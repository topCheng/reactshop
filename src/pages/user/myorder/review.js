import React from "react"
import {connect} from "react-redux"
import Css from "../../../assets/css/user/myorder/review.css"
import {request} from "../../../assets/js/utils/request";
import {lazyImg} from "../../../assets/js/utils/utils";
import UpRefresh from "../../../assets/js/libs/uprefresh"

class ReviewComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            orderList: [],
            total: 0
        }
        this.upRefresh = null;
        this.curPage = 1;
        this.maxPage = 0;
        this.offsetBottom = 100;
    }

    componentDidMount() {
        this.getMyOrder();
    }


    getMyOrder() {
        request(window.base.config.baseUrl + "/user/myorder/reviewOrder?uid=" + this.props.state.user.uid + "&page=1&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({orderList: res.data}, () => {
                    lazyImg();
                });
                this.maxPage = res.pageinfo.pagenum;
                this.getScrollPage();
            } else {
                this.setState({orderList: [], total: 0});
            }
        })
    }

    getScrollPage() {
        this.upRefresh = new UpRefresh({
            curPage: this.curPage,
            maxPage: this.maxPage,
            offsetBottom: this.offsetBottom
        }, curPage => {
            request(window.base.config.baseUrl + "/user/myorder/reviewOrder?uid=" + this.props.state.user.uid + "&page=" + curPage + "&token=" + window.base.config.token).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        let orderList = this.state.orderList;
                        for (let i = 0; i < res.data.length; i++) {
                            orderList.push(res.data[i]);
                        }
                        this.setState({orderList: orderList}, () => {
                            lazyImg();
                        });
                    }
                }
            })
        })
    }

    pushPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <React.Fragment>
                {
                    this.state.orderList.length > 0 ? this.state.orderList.map((item, index) => {
                        return (
                            <div className={Css["order-list"]} key={index}
                                 onClick={this.pushPage.bind(this, "order/detail?ordernum=" + item.ordernum)}>
                                <div className={Css["ordernum-wrap"]}>
                                    <div className={Css["ordernum"]}>订单编号:{item.ordernum}</div>
                                    <div
                                        className={Css["status"]}>{item.status === "0" ? "待付款" : item.status === "1" ? "待收货" : "已收货"}</div>
                                </div>
                                {
                                    item.goods.length > 0 ? item.goods.map((item2, index2) => {
                                        return (
                                            <div className={Css["item-list"]} key={index2}>
                                                <div className={Css["image"]}>
                                                    <img src={require("../../../assets/images/common/lazyImg.jpg")}
                                                         data-echo={item2.image} alt={item2.title}/>
                                                </div>
                                                <div className={Css["title"]}>{item2.title}</div>
                                                <div className={Css["amount"]}>x{item2.amount}</div>
                                                <div
                                                    className={Css["status-btn"]} onClick={(e) => {
                                                        e.stopPropagation();
                                                    this.pushPage("order/add_review?gid=" + item2.gid + "&ordernum=" + item.ordernum)
                                                }}>{item2.isreview === "0" ? "去评价" : "追加评价"}</div>
                                            </div>
                                        )
                                    }) : ""
                                }
                            </div>
                        )
                    }) : ""
                }
            </React.Fragment>
        );
    }
}

export default connect(state => {
    return {
        state: state
    }
})(ReviewComponent)