import React from "react"
import {connect} from "react-redux"
import actions from "../../../store/actions/index"
import SubHeaderComponent from "../../../components/header/header.js"
import Css from "../../../assets/css/home/cart/index.css"

class Cart extends React.Component {
    constructor() {
        super();
        this.state = {
            bAllChecked: false
        }
    }

    componentDidMount() {
        //console.log(this.props.state.cart.aCartData);
        this.isAllChecked();
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    //删除商品
    delItem(index) {
        //console.log(this.props.state.cart.aCartData)
        if (this.props.state.cart.aCartData.length > 0) {
            this.props.dispatch(actions.cart.delItem({index: index}));
        }
        this.isAllChecked();
    }

    //选择商品
    selectItem(index, checked) {
        if (this.props.state.cart.aCartData.length > 0) {
            this.props.dispatch(actions.cart.selectItem({index: index, checked: checked}));
            this.isAllChecked();
        }
    }

    //是否全选
    isAllChecked() {
        if (this.props.state.cart.aCartData.length > 0) {
            let bAllChecked = false;
            for (let key in this.props.state.cart.aCartData) {
                if (!this.props.state.cart.aCartData[key].checked) {
                    this.setState({bAllChecked: false});
                    bAllChecked = false;
                    break;
                } else {
                    bAllChecked = true;
                }
            }
            if (bAllChecked) {
                this.setState({bAllChecked: true});
            }
        } else {
            this.setState({bAllChecked: false});
        }
    }

    //点击全选
    allChecked(checked) {
        if (this.props.state.cart.aCartData.length > 0) {
            this.setState({bAllChecked: checked});
            this.props.dispatch(actions.cart.allChecked({checked: checked}))
        }
    }

    incAmount(index) {
        if (this.props.state.cart.aCartData.length > 0) {
            this.props.dispatch(actions.cart.incAmount({index: index}))
        }
    }

    decAmount(index) {
        if (this.props.state.cart.aCartData.length > 0) {
            this.props.dispatch(actions.cart.decAmount({index: index}))
        }
    }

    //输入数量
    inputAmount(e, index) {
        if (this.props.state.cart.aCartData.length > 0) {
            let amount = 1;
            if (e.target.value !== "") {
                amount = e.target.value.replace(/[^\d]/g, "");
                if (amount === "") {
                    amount = 1;
                }
            }
            this.props.dispatch(actions.cart.inputAmount({amount: amount, index: index}))
        }
    }

    pushPage() {//去结算
        if (this.props.state.cart.totalPrice > 0) {
            this.props.history.push(window.base.config.path + "order/index");
        }
    }

    render() {
        return (
            <React.Fragment>
                <SubHeaderComponent title="购物车"></SubHeaderComponent>
                <div className={Css["cart-main"]}>
                    {
                        this.props.state.cart.aCartData.length > 0 ? this.props.state.cart.aCartData.map((item, index) => {
                            return (
                                <div className={Css["cart-list"]} key={index}>
                                    <div
                                        className={item.checked ? Css["select-btn"] + " " + Css["active"] : Css["select-btn"]}
                                        onClick={this.selectItem.bind(this, index, !item.checked)}></div>
                                    <div className={Css["image-wrap"]}>
                                        <div className={Css["image"]}>
                                            <img src={item.img}
                                                 alt={item.title}/>
                                        </div>
                                        <div className={Css["del"]} onClick={this.delItem.bind(this, index)}>删除</div>
                                    </div>
                                    <div className={Css["goods-wrap"]}>
                                        <div className={Css["goods-title"]}>{item.title}</div>
                                        <div className={Css["goods-attr"]}>
                                            {
                                                item.attrs.length > 0 ? item.attrs.map((item2, index2) => {
                                                    return (
                                                        <span key={index2}>{item2.title}:
                                                            {
                                                                item2.param.length > 0 ? item2.param.map((item3, index3) => {
                                                                    return (
                                                                        <React.Fragment
                                                                            key={index3}>{item3.title}</React.Fragment>
                                                                    )
                                                                }) : ""
                                                            }
                                                        </span>
                                                    )
                                                }) : ""
                                            }
                                        </div>
                                        <div className={Css["buy-wrap"]}>
                                            <div className={Css["price"]}>￥{item.price}</div>
                                            <div className={Css["amount-input-wrap"]}>
                                                <div
                                                    className={this.props.state.cart.aCartData[index].amount <= 1 ? Css["btn"] + " " + Css["dec"] + " " + Css["active"] : Css["btn"] + " " + Css["dec"]}
                                                    onClick={this.decAmount.bind(this, index)}>-
                                                </div>
                                                <div className={Css["amount-input"]}>
                                                    <input type="tel"
                                                           value={item.amount}
                                                           onChange={(e) => {
                                                               this.inputAmount(e, index)
                                                           }}/>
                                                </div>
                                                <div className={Css["btn"] + " " + Css["inc"]}
                                                     onClick={this.incAmount.bind(this, index)}>+
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className="no-data" style={{"marginTop": "1.2rem"}}>您还没有选购商品，快去选择您喜欢的宝贝吧！</div>
                    }
                </div>
                <div className={Css["order-wrap"]}>
                    <div className={Css["select-area"]}>
                        <div className={Css["select-wrap"]}
                             onClick={this.allChecked.bind(this, !this.state.bAllChecked)}>
                            <div
                                className={this.state.bAllChecked ? Css["select-btn"] + " " + Css["active"] : Css["select-btn"]}
                            ></div>
                            <div className={Css["select-text"]}>全选</div>
                        </div>
                        <div className={Css["total"]}>合计:<span>{this.props.state.cart.totalPrice}</span></div>
                    </div>
                    <div onClick={this.pushPage.bind(this)}
                         className={this.props.state.cart.totalPrice > 0 ? Css["order-btn"] : Css["order-btn"] + " " + Css["disable"]}>去结算
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
})(Cart)