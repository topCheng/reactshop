import React from "react"
import ReactDOM from "react-dom"
import {connect} from "react-redux"
import Swiper from "../../../assets/js/libs/swiper-3.4.2.min"
import "../../../assets/css/common/swiper-3.4.2.min.css"
import Css from "../../../assets/css/home/goods/details_item.css"
import {Toast} from "antd-mobile"
import {localParam, setScrollTop, lazyImg} from "../../../assets/js/utils/utils";
import {request} from "../../../assets/js/utils/request";
import TweenMax from "../../../assets/js/libs/TweenMax.min"
import actions from "../../../store/actions/index"

class GoodsDetailsItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gid: props.location.search !== "" ? localParam(props.location.search).search.gid : "",
            showCartPanel: false,
            aAttr: [],
            amount: 1,
            details: {
                swiper: [],
                title: "",
                price: 0,
                freight: 0,
                sales: 0
            },
            reviews: [],
            reviewsTotal: 0
        }
        this.imgIsMove = false;
    }

    componentDidMount() {
        setScrollTop(0);
        this.getSwiper();
        this.getAttr();
        this.getReviews();
    }

    replacePage(url) {
        this.props.history.replace(window.base.config.path + url);
    }

    //获取商品详情
    getSwiper() {
        request(window.base.config.baseUrl + "/home/goods/info?gid=" + this.state.gid + "&type=details&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({
                        details: {
                            swiper: res.data.images,
                            title: res.data.title,
                            price: res.data.price,
                            sales: res.data.sales,
                            freight: res.data.freight
                        }
                    },
                    () => {
                        new Swiper(this.refs["swiper-container"], {
                            autoplay: 3000,//可选选项，自动滑动
                            pagination: '.swiper-pagination',
                            paginationClickable: true,
                            autoplayDisableOnInteraction: false
                        });
                    }
                )
            }
        })
    }

    //获取商品规格
    getAttr() {
        request(window.base.config.baseUrl + "/home/goods/info?gid=" + this.state.gid + "&type=spec&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                //this.setState({aAttr: res.data});
                let aAttr = res.data;
                for (let i = 0; i < aAttr.length; i++) {
                    if (aAttr[i].values.length > 0) {
                        for (let j = 0; j < aAttr[i].values.length; j++) {
                            aAttr[i].values[j].checked = false;
                        }
                    }
                }
                this.setState({aAttr: aAttr});
            } else {
                this.setState({aAttr: []});
            }
        });
    }

    //获取商品评价
    getReviews() {
        request(window.base.config.baseUrl + "/home/reviews/index?gid=" + this.state.gid + "&token=" + window.base.config.token + "&page=1").then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({reviews: res.data, reviewsTotal: res.pageinfo.total}, () => {
                    lazyImg();
                });
            } else {
                this.setState({reviews: [], reviewsTotal: 0});
            }
        });
    }

    showCartPanel() {
        this.refs["mask"].addEventListener("touchmove", function (e) {
            e.preventDefault();
        }, true);
        this.setState({showCartPanel: true});
    }

    hideCartPanel() {
        if (!this.imgIsMove) {
            this.setState({showCartPanel: false});
        }
    }

    //收藏
    addCollect() {
        if(this.props.state.user.isLogin) {
            request(window.base.config.baseUrl + "/goods/fav?uid=" + this.props.state.user.uid + "&gid=" + this.state.gid + "&token=" + window.base.config.token).then(res => {
                //console.log(res);
                Toast.info(res.data, 1);
            });
        } else {
            Toast.info("请先登录", 1);
        }
    }

    //选择属性
    selectAttr(index1, index2) {
        let aAttr = this.state.aAttr;
        if (aAttr[index1].values.length > 0) {
            for (let i = 0; i < aAttr[index1].values.length; i++) {
                if (aAttr[index1].values[i].checked) {
                    aAttr[index1].values[i].checked = false;
                    break;
                }
            }
        }
        aAttr[index1].values[index2].checked = true;
        this.setState({aAttr: aAttr});
    }

    //检测属性
    checkedAttr(callback) {
        let aAttr = this.state.aAttr, bChecked = false, attrName = "";
        for (let i = 0; i < aAttr.length; i++) {
            if (aAttr[i].values.length > 0) {
                bChecked = false;
                for (let j = 0; j < aAttr[i].values.length; j++) {
                    if (aAttr[i].values[j].checked) {
                        bChecked = true;
                        break;
                    }
                }
            }
            if (!bChecked) {
                attrName = aAttr[i].title;
                break;
            }
        }
        if (!bChecked) {
            Toast.info(`请选择${attrName}`, 1);
        }
        if (bChecked && callback) {
            callback.call();
        }
    }

    //增加数量
    incAmount() {
        let amount = this.state.amount;
        this.setState({amount: ++amount});
    }

    //减少数量
    decAmount() {
        let amount = this.state.amount;
        if (amount <= 2) {
            amount = 2;
        }
        this.setState({amount: --amount});
    }

    //输入数量
    inputAmount(e) {
        let amount = 1;
        if (e.target.value !== "") {
            amount = e.target.value.replace(/[^\d]/g, "");
            if (amount === "") {
                amount = 1;
            }
        }
        this.setState({amount: amount});
    }

    //加入购物车
    addCart() {
        this.checkedAttr(() => {
            if (!this.imgIsMove) {
                this.imgIsMove = true;
                let goodsInfo = this.refs["goods-info"], goodsImg = this.refs["goods-img"],
                    cartIcon = ReactDOM.findDOMNode(document.getElementById("cart-icon")),
                    cartPanel = this.refs["cart-panel"];
                let cloneImg = goodsImg.cloneNode(true);
                cloneImg.style.cssText = "position: absolute;z-index:1;top:.2rem;left:.2rem;width:.4rem;height:.4rem";
                goodsInfo.appendChild(cloneImg);
                let cloneY = parseInt(window.innerHeight - cartPanel.offsetHeight + goodsImg.offsetTop - cartIcon.offsetTop);

                TweenMax.to(cloneImg, 1.5, {
                    bezier: [{x: cloneImg.offsetLeft, y: -100}, {
                        x: cloneImg.offsetLeft + 30,
                        y: -130
                    }, {x: cartIcon.offsetLeft, y: -cloneY}],
                    onComplete: () => {
                        cloneImg.remove();
                        this.imgIsMove = false;

                        //添加商品到redux
                        let aAttr = [], aParam = [];
                        for (let key in this.state.aAttr) {
                            if (this.state.aAttr.length > 0) {
                                if (this.state.aAttr[key].values.length > 0) {
                                    aParam = [];
                                    for (let key2 in this.state.aAttr[key].values) {
                                        if (this.state.aAttr[key].values[key2].checked) {
                                            aParam.push({
                                                paramid: this.state.aAttr[key].values[key2].vid,
                                                title: this.state.aAttr[key].values[key2].value
                                            })
                                        }
                                    }
                                }
                                aAttr.push({
                                    attrid: this.state.aAttr[key].attrid,
                                    title: this.state.aAttr[key].title,
                                    param: aParam
                                });
                            }
                        }
                        //console.log(aAttr);
                        this.props.dispatch(actions.cart.addCart({
                            gid: this.state.gid,
                            title: this.state.details.title,
                            amount: parseInt(this.state.amount),
                            price: this.state.details.price,
                            img: this.state.details.swiper[0],
                            checked: false,
                            freight: this.state.details.freight,
                            attrs: aAttr
                        }));
                    }
                });
                TweenMax.to(cloneImg, 0.2, {rotation: 360, repeat: -1});
            }
        });
    }

    componentWillUnmount() {
        this.setState = ({}, () => {
            return;
        });
        /*this.setState = (state, callback) => {
            return;
        }*/
    }

    render() {
        return (
            <React.Fragment>
                <div className={Css["swiper-wrap"]}>
                    <div ref="swiper-container">
                        <div className="swiper-wrapper">
                            {
                                this.state.details.swiper.length > 0 && this.state.details.swiper.map((item, index) => {
                                    return (
                                        <div className="swiper-slide" key={index}>
                                            <img src={item} alt=""/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                </div>
                <div className={Css["goods-ele-main"]}>
                    <div className={Css["goods-title"]}>{this.state.details.title}</div>
                    <div className={Css["price"]}>￥<span>{this.state.details.price}</span></div>
                    <ul className={Css["sales-wrap"]}>
                        <li>快递：{this.state.details.freight}元</li>
                        <li>月销量{this.state.details.sales}件</li>
                    </ul>
                </div>
                <div className={Css["reviews-main"]}>
                    <div className={Css["reviews-title"]}>商品评价({this.state.reviewsTotal})</div>
                    <div className={Css["reviews-wrap"]}>
                        {
                            this.state.reviews.length > 0 ? this.state.reviews.map((item, index) => {
                                return (
                                    <div className={Css["reviews-list"]} key={index}>
                                        <div className={Css["uinfo"]}>
                                            <div className={Css["head"]}>
                                                <img data-echo={item.head}
                                                     src={require("../../../assets/images/common/lazyImg.jpg")}
                                                     alt={item.nickname}/>
                                            </div>
                                            <div className={Css["nickname"]}>{item.nickname}</div>
                                        </div>
                                        <div className={Css["reviews-content"]}>{item.content}</div>
                                        <div className={Css["reviews-date"]}>{item.times}</div>
                                    </div>
                                )
                            }) : <div className="no-data">没有任何评价!</div>
                        }
                    </div>
                    <div
                        className={this.state.reviews.length > 0 ? Css["reviews-more"] : Css["reviews-more"] + " " + "hide"}
                        onClick={this.replacePage.bind(this, "goods/details/review?gid=" + this.state.gid)}>查看更多评价
                    </div>
                </div>
                <div className={Css["bottom-btn-wrap"]}>
                    <div className={Css["btn"] + " " + Css["fav"]} onClick={this.addCollect.bind(this)}>收藏</div>
                    <div className={Css["btn"] + " " + Css["cart"]} onClick={this.showCartPanel.bind(this)}>加入购物车</div>
                </div>
                <div className={this.state.showCartPanel ? Css["mask"] : Css["mask"] + " hide"} ref="mask">
                    <div ref="cart-panel"
                         className={this.state.showCartPanel ? Css["cart-panel"] + " " + Css["up"] : Css["cart-panel"] + " " + Css["down"]}>
                        <div ref="goods-info" className={Css["goods-info"]}>
                            <div className={Css["close-panel-wrap"]}>
                                <div className={Css["spot"]}></div>
                                <div className={Css["line"]}></div>
                                <div className={Css["close"]} onClick={this.hideCartPanel.bind(this)}></div>
                            </div>
                            <div ref="goods-img" className={Css["goods-img"]}>
                                <img src={this.state.details.swiper.length > 0 ? this.state.details.swiper[0] : ""}
                                     alt=""/>
                            </div>
                            <div className={Css["goods-wrap"]}>
                                <div className={Css["goods-title"]}>{this.state.details.title}</div>
                                <div className={Css["price"]}>￥{this.state.details.price}</div>
                                <div className={Css["goods-code"]}>
                                    商品编码:{this.state.gid}
                                </div>
                            </div>
                        </div>
                        <div className={Css["attr-amount-wrap"]}>
                            <div className={Css["attr-wrap"]}>
                                {
                                    this.state.aAttr.length > 0 && this.state.aAttr.map((item, index) => {
                                        return (
                                            <div className={Css["attr-list"]} key={index}>
                                                <div className={Css["attr-name"]}>{item.title}</div>
                                                <div className={Css["val-wrap"]}>
                                                    {
                                                        item.values.length > 0 && item.values.map((item2, index2) => {
                                                            return (
                                                                <span
                                                                    className={item2.checked ? Css["val"] + " " + Css["active"] : Css["val"]}
                                                                    key={index2}
                                                                    onClick={this.selectAttr.bind(this, index, index2)}>{item2.value}</span>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className={Css["amount-wrap"]}>
                                <div className={Css["amount-name"]}>购买数量</div>
                                <div className={Css["amount-input-wrap"]}>
                                    <div
                                        className={this.state.amount <= 1 ? Css["btn"] + " " + Css["dec"] + " " + Css["active"] : Css["btn"] + " " + Css["dec"]}
                                        onClick={this.decAmount.bind(this)}>-
                                    </div>
                                    <div className={Css["amount-input"]}>
                                        <input type="tel" value={this.state.amount} onChange={(e) => {
                                            this.inputAmount(e)
                                        }}/>
                                    </div>
                                    <div className={Css["btn"] + " " + Css["inc"]}
                                         onClick={this.incAmount.bind(this)}>+
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={Css["sure-btn"]} onClick={this.addCart.bind(this)}>确定</div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(GoodsDetailsItem)