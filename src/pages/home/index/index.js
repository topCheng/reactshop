/*eslint-disable*/
import React from "react"
import {connect} from "react-redux"
import Swiper from "../../../assets/js/libs/swiper-3.4.2.min"
import "../../../assets/css/common/swiper-3.4.2.min.css"
import Css from "../../../assets/css/home/index/index.css"
import {request} from "../../../assets/js/utils/request"
import {lazyImg, setScrollTop} from "../../../assets/js/utils/utils"
import SearchComponent from "../../../components/search/search"


class IndexComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            aSwiper: [],
            aNav: [],
            aGoodsLevel: [],
            aRecom: [],
            bScroll: false,
            displaySearch: {display: "none"}
        }
        this.bscroll = true
    }

    componentDidMount() {
        //console.log(this.props.state.user.isLogin)
        setScrollTop(window.base.pages.index.scrollTop);
        this.getSwiper();
        this.getNav();
        this.getGoodsLevel();
        this.getRecom();
        window.addEventListener("scroll", this.eventScroll.bind(this));
    }

    componentWillUnmount() {
        this.bscroll = false;
        window.removeEventListener("scroll", this.eventScroll.bind(this));
        this.setState = (state, callback) => {
            return;
        }
    }

    eventScroll() {
        if (this.bscroll) {
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            //console.log(scrollTop);
            window.base.pages.index.scrollTop = scrollTop;
            if (scrollTop > 20) {
                this.setState({bScroll: true});
            } else {
                this.setState({bScroll: false});
            }
        }
    }

    getSwiper() {
        request(window.base.config.baseUrl + "/home/index/slide?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({"aSwiper": res.data}, () => {
                    new Swiper(this.refs["swiper-container"], {
                        autoplay: 3000,//可选选项，自动滑动
                        pagination: '.swiper-pagination',
                        paginationClickable: true,
                        autoplayDisableOnInteraction: false
                    });
                })
            }
        })
    }

    getNav() {
        request(window.base.config.baseUrl + "/home/index/nav?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({"aNav": res.data});
            }
        })
    }

    getGoodsLevel() {
        request(window.base.config.baseUrl + "/home/index/goodsLevel?token=" + window.base.config.token).then(res => {
            //onsole.log(res);
            if (res.code === 200) {
                this.setState({"aGoodsLevel": res.data}, () => {
                    lazyImg();
                });
            }
        })
    }

    getRecom() {
        request(window.base.config.baseUrl + "/home/index/recom?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({"aRecom": res.data}, () => {
                    lazyImg();
                });
            }
        })
    }

    goPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    showSearch() {
        this.setState({displaySearch: {display: "block"}});
    }

    hideSearch() {
        this.setState({displaySearch: {display: "none"}});
    }


    render() {
        return (
            <div className={Css["page"]}>
                <div
                    className={this.state.bScroll ? (Css["search-header"] + " " + Css["red-bg"]) : Css["search-header"]}>
                    <div className={Css["classify-icon"]}
                         onClick={this.goPage.bind(this, "goods/classify/items")}></div>
                    <div className={Css["search-wrap"]} onClick={this.showSearch.bind(this)}>
                        <div className={Css["search-icon"]}></div>
                        <div className={Css["search-text"]}>请输入宝贝名称</div>
                    </div>
                    <div className={Css["login-wrap"]}>
                        {
                            this.props.state.user.isLogin ? <div className={Css["my"]} onClick={this.goPage.bind(this,"home/my")}></div> :
                                <div className={Css["login-text"]}
                                     onClick={this.goPage.bind(this, "login/index")}>登录</div>
                        }
                    </div>
                </div>
                <div className={Css["swiper-wrap"]}>
                    <div className="swiper-container" ref="swiper-container">
                        <div className="swiper-wrapper">
                            {
                                this.state.aSwiper != null ?
                                    this.state.aSwiper.map((item, index) => {
                                        return (
                                            <div className="swiper-slide" key={index}>
                                                <a href={item.webs} target="_blank" rel="noopener noreferrer">
                                                    <img src={item.image} alt={item.title}/>
                                                </a>
                                            </div>
                                        )
                                    }) : ""
                            }
                        </div>
                        <div className="swiper-pagination"></div>
                    </div>
                </div>
                <ul className={Css["quick-nav"]}>
                    {
                        this.state.aNav != null ?
                            this.state.aNav.map((item, index) => {
                                return (
                                    <li className={Css["item"]} key={index}
                                        onClick={this.goPage.bind(this, "goods/classify/items?cid=" + item.cid)}>
                                        <div className={Css["item-img"]}>
                                            <img src={item.image} alt={item.title}/>
                                        </div>
                                        <div className={Css["item-text"]}>{item.title}</div>
                                    </li>
                                )
                            }) : ""
                    }
                </ul>
                {
                    this.state.aGoodsLevel != null ?
                        this.state.aGoodsLevel.map((item, index) => {
                            return (
                                <div className={Css["goods-level-wrap"]} key={index}>
                                    <div
                                        className={Css["classify-title"] + " " + Css["color" + (index + 1)]}>—— {item.title} ——
                                    </div>
                                    {index % 2 == 1 ?
                                        <div className={Css["goods-level1-wrap"]}>
                                            {
                                                item.items != null ? item.items.slice(0, 2).map((item2, index2) => {
                                                    return (
                                                        <div className={Css["goods-level1-item0"]} key={index2}
                                                             onClick={this.goPage.bind(this, "goods/details/item?gid=" + item2.gid)}>
                                                            <div className={Css["goods-title2"]}>{item2.title}</div>
                                                            <div className={Css["goods-text2"]}>精品打折</div>
                                                            <div className={Css["goods-img2"]}>
                                                                <img
                                                                    src={require("../../../assets/images/common/lazyImg.jpg")}
                                                                    data-echo={item2.image} alt={item2.title}/>
                                                            </div>
                                                        </div>
                                                    )
                                                }) : ""
                                            }
                                        </div>
                                        :
                                        <div className={Css["goods-level1-wrap"]}>
                                            <div className={Css["goods-level1-item0"]}
                                                 onClick={this.goPage.bind(this, "goods/details/item?gid=" + item.items[0].gid)}>
                                                <div
                                                    className={Css["goods-title"]}>{item.items.length > 0 && item.items[0].title}</div>
                                                <div className={Css["goods-text"]}>精品打折</div>
                                                <div
                                                    className={Css["goods-price" + (index + 1)]}>{item.items.length > 0 && item.items[0].price}元
                                                </div>
                                                <div className={Css["goods-img"]}>
                                                    <img src={item.items.length > 0 && item.items[0].image}
                                                         alt={item.items.length > 0 && item.items[0].title}/>
                                                </div>
                                            </div>
                                            <div className={Css["goods-level1-item1"]}>
                                                {
                                                    item.items != null ? item.items.slice(1, 3).map((item2, index2) => {
                                                        return (
                                                            <div className={Css["goods-row"]} key={index2}
                                                                 onClick={this.goPage.bind(this, "goods/details/item?gid=" + item2.gid)}>
                                                                <div
                                                                    className={Css["goods-row-title"]}>{item2.title}</div>
                                                                <div className={Css["goods-row-text"]}>精品打折</div>
                                                                <div className={Css["goods-row-img"]}>
                                                                    <img
                                                                        src={require("../../../assets/images/common/lazyImg.jpg")}
                                                                        data-echo={item2.image} alt={item2.title}/>
                                                                </div>
                                                            </div>
                                                        )
                                                    }) : ""
                                                }
                                            </div>
                                        </div>
                                    }
                                    <div className={Css["goods-list-wrap"]}>
                                        {
                                            item.items != null ? item.items.slice(index % 2 === 1 ? 2 : 3).map((item3, index3) => {
                                                return (
                                                    <div className={Css["goods-list"]} key={index3}
                                                         onClick={this.goPage.bind(this, "goods/details/item?gid=" + item3.gid)}>
                                                        <div className={Css["title"]}>{item3.title}</div>
                                                        <div className={Css["image"]}>
                                                            <img
                                                                src={require("../../../assets/images/common/lazyImg.jpg")}
                                                                data-echo={item3.image}
                                                                alt={item3.title}/>
                                                        </div>
                                                        <div className={Css["price"]}>¥{item3.price}</div>
                                                        <div className={Css["unprice"]}>¥{item3.price * 2}</div>
                                                    </div>
                                                )
                                            }) : ""
                                        }
                                    </div>
                                </div>
                            )
                        }) : ""
                }
                <div className={Css["reco-title-wrap"]}>
                    <div className={Css["line"]}></div>
                    <div className={Css["reco-text-wrap"]}>
                        <div className={Css["reco-icon"]}></div>
                        <div className={Css["reco-text"]}>为您推荐</div>
                    </div>
                    <div className={Css["line"]}></div>
                </div>
                <div className={Css["reco-item-wrap"]}>
                    {
                        this.state.aRecom != null ? this.state.aRecom.map((item, index) => {
                            return (
                                <div className={Css["reco-item"]} key={index}
                                     onClick={this.goPage.bind(this, "goods/details/item?gid=" + item.gid)}>
                                    <div className={Css["image"]}>
                                        <img src={require("../../../assets/images/common/lazyImg.jpg")}
                                             data-echo={item.image}
                                             alt={item.title}/>
                                    </div>
                                    <div className={Css["title"]}>{item.title}</div>
                                    <div className={Css["price"]}>¥{item.price}</div>
                                </div>
                            )
                        }) : ""
                    }
                </div>
                <SearchComponent displaySearch={this.state.displaySearch}
                                 hideSearchPage={this.hideSearch.bind(this)}></SearchComponent>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(IndexComponent)