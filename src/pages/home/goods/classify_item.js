import React from "react"
import Css from "../../../assets/css/home/goods/classify_item.css"
import IScroll from "../../../assets/js/libs/iscroll"
import {request} from "../../../assets/js/utils/request"
import {lazyImg, localParam, setScrollTop} from "../../../assets/js/utils/utils"

class GoodsClassifyItem extends React.Component {
    constructor() {
        super();
        this.state = {
            aGoods: []
        }
        this.myScroll = null;
    }

    componentDidMount() {
        setScrollTop();
        //console.log(localParam(this.props.location.search).search.cid)
        this.getGoodsData(this.props);
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        //console.log(localParam(newProps.location.search).search.cid);
        this.getGoodsData(newProps);
    }

    getGoodsData(props) {
        let cid = props.location.search ? localParam(props.location.search).search.cid : "";
        //console.log(cid)
        request(window.base.config.baseUrl + "/home/category/show?cid=" + cid + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({aGoods: res.data}, () => {
                    this.eventScroll();
                    lazyImg();
                    this.myScroll.on("scrollEnd", () => {
                        lazyImg();
                    })
                });
            } else {
                this.setState({aGoods: []});
            }
        })
    }

    eventScroll() {
        this.refs["goods-content-main"].addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        this.myScroll = new IScroll(this.refs["goods-content-main"], {
            scrollX: false,
            scrollY: true,
            preventDefault: false
        });
    }

    goPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div ref="goods-content-main" className={Css["goods-content-main"]}>
                <div>
                    {
                        this.state.aGoods.length > 0 ? this.state.aGoods.map((item, index) => {
                            return (
                                <div className={Css["goods-wrap"]} key={index}>
                                    <div className={Css["classify-name"]}>{item.title}</div>
                                    <div className={Css["goods-items-wrap"]}>
                                        {
                                            item.goods != null ? item.goods.map((item2, index2) => {
                                                return (
                                                    <ul key={index2}
                                                        onClick={this.goPage.bind(this, "goods/details/item?gid=" + item2.gid)}>
                                                        <li>
                                                            <img
                                                                src={require("../../../assets/images/common/lazyImg.jpg")}
                                                                data-echo={item2.image}
                                                                alt={item2.title}/>
                                                        </li>
                                                        <li>{item2.title}</li>
                                                    </ul>
                                                )
                                            }) : ""
                                        }
                                    </div>
                                </div>
                            )
                        }) : <div className="no-data">没有相关商品！</div>
                    }
                    <div style={{width: "100%", height: "2rem"}}></div>
                </div>

            </div>
        );
    }
}

export default GoodsClassifyItem