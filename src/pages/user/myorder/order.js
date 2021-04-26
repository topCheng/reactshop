import React from "react"
import {connect} from "react-redux"
import Css from "../../../assets/css/user/myorder/order.css"
import {request} from "../../../assets/js/utils/request";
import {localParam, lazyImg, setScrollTop} from "../../../assets/js/utils/utils";
import UpRefresh from "../../../assets/js/libs/uprefresh"
import {Modal, Toast} from "antd-mobile"

class OrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: localParam(props.location.search).search.status ? localParam(props.location.search).search.status : "",
            orderList: [],
            total: 0
        }
        this.upRefresh = null;
        this.curPage = 1;
        this.maxPage = 0;
        this.offsetBottom = 100;
    }

    componentDidMount() {
        setScrollTop();
        //console.log(this.state.status);
        this.getOrder();
    }

    /*componentWillReceiveProps(newProps) {
        let status = localParam(newProps.location.search).search.status;
        this.setState({status: status}, () => {
            this.getOrder();
            console.log(this.state.status);//与主路由myorder/index.js中的方法重合,打印两次，消耗性能
        });
    }*/

    getOrder() {
        request(window.base.config.baseUrl + "/user/myorder/index?uid=" + this.props.state.user.uid + "&status=" + this.state.status + "&token=" + window.base.config.token + "&page=1").then(res => {
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
            request(window.base.config.baseUrl + "/user/myorder/index?uid=" + this.props.state.user.uid + "&status=" + this.state.status + "&token=" + window.base.config.token + "&page=" + curPage).then(res => {
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

    //取消订单
    cancelOrder(e, ordernum, index) {
        e.stopPropagation();
        Modal.alert('', '确认要取消订单吗?', [
            {
                text: '取消', onPress: () => {

                }, style: 'default'
            },
            {
                text: '确认', onPress: () => {
                    request(window.base.config.baseUrl + "/user/myorder/clearorder?uid=" + this.props.state.user.uid + "&ordernum=" + ordernum + "&token=" + window.base.config.token).then(res => {
                        //console.log(res);
                        if (res.code === 200) {
                            let orderList = this.state.orderList;
                            orderList.splice(index, 1);
                            this.setState({orderList: orderList});
                        }
                    });
                }
            },
        ]);
    }

    //确认收货
    confirmOrder(e, ordernum, index) {
        e.stopPropagation();
        request(window.base.config.baseUrl + "/user/myorder/finalorder?uid=" + this.props.state.user.uid + "&ordernum=" + ordernum + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                let orderList = this.state.orderList;
                orderList[index].status = "2";
                this.setState({orderList: orderList}, () => {
                    Toast.info(res.data, 2);
                });
            }
        });
    }

    pushPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    componentWillUnmount() {
        this.upRefresh = null;
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
                                        className={Css["status"]}>{item.status === "0" ? "待付款" : item.status === "1" ? "待收货" : item.status === "2" ? "已收货" : ""}</div>
                                </div>
                                {
                                    item.goods !== null ? item.goods.map((item2, index2) => {
                                        return (
                                            <div className={Css["item-list"]} key={index2}>
                                                <div className={Css["image"]}>
                                                    <img src={require("../../../assets/images/common/lazyImg.jpg")}
                                                         data-echo={item2.image} alt={item2.title}/>
                                                </div>
                                                <div className={Css["title"]}>{item2.title}</div>
                                                <div className={Css["amount"]}>x{item2.amount}</div>
                                            </div>
                                        )
                                    }) : ""
                                }
                                <div className={Css["total-wrap"]}>
                                    <div className={Css["total"]}>实付金额:￥{item.total}</div>
                                    <div
                                        className={Css["status-btn"]}
                                        onClick={item.status === "0" ? (e) => {
                                            this.cancelOrder(e, item.ordernum, index)
                                        } : item.status === "1" ? (e) => {
                                            this.confirmOrder(e, item.ordernum, index)
                                        } : () => {
                                        }}>{item.status === "0" ? "取消订单" : item.status === "1" ? "确认收货" : item.status === "2" ? "去评价" : ""}</div>
                                </div>
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
})(OrderComponent)