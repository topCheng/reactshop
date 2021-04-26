import React from "react"
import {connect} from "react-redux"
import {Toast} from "antd-mobile"
import SubHeaderComponent from "../../../components/header/header"
import Css from "../../../assets/css/home/order/index.css"
import {request} from "../../../assets/js/utils/request";
import {safeAuth, setScrollTop} from "../../../assets/js/utils/utils";

class OrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            cellphone: "",
            address: ""
        }
        this.uid = props.state.user.uid;
        safeAuth(props);
        this.isSubmit = true;
    }

    componentDidMount() {
        setScrollTop();
        if (sessionStorage["aid"] !== undefined) {
            this.getSelectedAddress();
        } else {
            this.getDefaultAddress();
        }
    }

    //获取选择收货地址
    getSelectedAddress() {
        if (sessionStorage["aid"] !== undefined) {
            request(window.base.config.baseUrl + "/user/address/info?uid=" + this.uid + "&aid=" + sessionStorage["aid"] + "&token=" + window.base.config.token).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    this.setState({
                        name: res.data.name,
                        cellphone: res.data.cellphone,
                        address: res.data.province + res.data.city + res.data.area + res.data.address
                    })
                }
            })
        }
    }

    //获取默认地址
    getDefaultAddress() {
        request(window.base.config.baseUrl + "/user/address/defaultAddress?uid=" + this.uid + "&token=" + window.base.config.token).then(res => {
            //console.log(res)
            if (res.code === 200) {
                localStorage["aid"] = res.data.aid;
                this.setState({
                    name: res.data.name,
                    cellphone: res.data.cellphone,
                    address: res.data.province + res.data.city + res.data.area + res.data.address
                })
            } else {

            }
        })
    }

    //结算订单
    settlement() {
        if (sessionStorage["aid"] === undefined && localStorage["aid"] === undefined) {
            Toast.info("请选择收货地址", 2);
        } else {
            if (this.props.state.cart.totalPrice > 0) {
                if (this.isSubmit) {
                    this.isSubmit = false;
                    request(window.base.config.baseUrl + "/order/add?token=" + window.base.config.token, "post", {
                        uid: this.uid,
                        freight: this.props.state.cart.freight,
                        addsid: sessionStorage["aid"] || localStorage["aid"],
                        goodsData: JSON.stringify(this.props.state.cart.aCartData)
                    }).then(res => {
                        console.log(res);
                        if (res.code === 200) {
                            this.props.history.push(window.base.config.path + "order/result");
                        }
                    })
                }
            } else {
                Toast.info("您的购物车还没商品", 2);
            }
        }
    }

    replacePage(url) {
        this.props.history.replace(window.base.config.path + url);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="确认订单"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["address-wrap"]} onClick={this.replacePage.bind(this, "address/index")}>
                        {
                            sessionStorage["aid"] !== undefined || localStorage["aid"] !== undefined ? <React.Fragment>
                                <div className={Css["person-info"]}>
                                    <span>收货人：{this.state.name}</span>
                                    <span>{this.state.cellphone}</span>
                                </div>
                                <div className={Css["address"]}>
                                    <img src={require("../../../assets/images/common/address.png")} alt=""/>
                                    <span>{this.state.address}</span>
                                </div>
                            </React.Fragment> : <div className={Css["address-null"]}>您的收货地址为空,点击添加收货地址</div>

                        }
                        <div className={Css["arrow"]}></div>
                        <div className={Css["address-border-wrap"]}>
                            <div className={Css["trapezoid"] + " " + Css["style1"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style2"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style1"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style2"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style1"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style2"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style1"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style2"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style1"]}></div>
                            <div className={Css["trapezoid"] + " " + Css["style2"]}></div>
                        </div>
                    </div>
                    <div className={Css["goods-wrap"]}>
                        {
                            this.props.state.cart.aCartData.length > 0 ? this.props.state.cart.aCartData.map((item, index) => {
                                return (
                                    item.checked ?
                                        <div className={Css["goods-list"]} key={index}>
                                            <div className={Css["image"]}>
                                                <img src={item.img} alt=""/>
                                            </div>
                                            <div className={Css["goods-param"]}>
                                                <div className={Css["title"]}>{item.title}</div>
                                                <div className={Css["attr"]}>
                                                    {
                                                        item.attrs.length > 0 ? item.attrs.map((item2, index2) => {
                                                            return (
                                                                <span
                                                                    key={index2}>{item2.title}：{item2.param.length > 0 ? item2.param.map((item3, index3) => {
                                                                    return (
                                                                        <React.Fragment
                                                                            key={index3}>{item3.title}</React.Fragment>
                                                                    )
                                                                }) : ""}</span>
                                                            )
                                                        }) : ""
                                                    }
                                                </div>
                                                <div className={Css["amount"]}>x{item.amount}</div>
                                                <div className={Css["price"]}>￥{item.price}</div>
                                            </div>
                                        </div> : ""
                                )
                            }) : ""
                        }

                    </div>
                    <div className={Css["total-wrap"]}>
                        <div>商品总额</div>
                        <div>￥{this.props.state.cart.totalPrice}</div>
                    </div>
                    <div className={Css["total-wrap"]}>
                        <div>运费</div>
                        <div>￥{this.props.state.cart.freight}</div>
                    </div>
                </div>
                <div className={Css["balance-wrap"]}>
                    <div className={Css["price-wrap"]}>
                        <span>实际金额：</span>
                        <span>￥{parseFloat(this.props.state.cart.totalPrice) + parseFloat(this.props.state.cart.freight)}</span>
                    </div>
                    <div className={Css["balance-btn"]} onClick={this.settlement.bind(this)}>提交订单</div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(OrderComponent)