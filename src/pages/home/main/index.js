/*eslint-disable*/
import React, {lazy, Suspense} from "react"
import {connect} from "react-redux"
//import {AuthRoute} from "../../../routes/private"
import Css from "../../../assets/css/home/main/index.css"
import {Route, Switch, Redirect} from "react-router-dom";

const IndexPage = lazy(() => import("../index"))
const CartPage = lazy(() => import("../cart"))
const UCenterPage = lazy(() => import("../../user/uCenter"))

class MainComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            homeStyle: true,
            cartStyle: false,
            myStyle: false
        }
    }

    goPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    componentDidMount() {
        //console.log(this.props);
        this.changeStyle(this.props.location.pathname);
        //console.log(this.props.state.cart.aCartData.length)
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        //console.log(newProps.location.pathname);
        this.changeStyle(newProps.location.pathname);
    }

    changeStyle(pathName) {
        switch (pathName) {
            case window.base.config.path + "home/index":
                this.setState({
                    homeStyle: true,
                    cartStyle: false,
                    myStyle: false
                });
                break;
            case window.base.config.path + "home/cart":
                this.setState({
                    homeStyle: false,
                    cartStyle: true,
                    myStyle: false
                });
                break;
            case window.base.config.path + "home/my":
                this.setState({
                    homeStyle: false,
                    cartStyle: false,
                    myStyle: true
                });
                break;
            default:
                this.setState({
                    homeStyle: true,
                    cartStyle: false,
                    myStyle: false
                });
                break;
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <React.Fragment>
                <div>
                    <Suspense fallback={<React.Fragment/>}>
                        <Switch>
                            <Route path={window.base.config.path + "home/index"} component={IndexPage}></Route>
                            <Route path={window.base.config.path + "home/cart"} component={CartPage}></Route>
                            <Route path={window.base.config.path + "home/my"} component={UCenterPage}></Route>
                            <Redirect to={window.base.config.path + "home/index"}></Redirect>
                        </Switch>
                    </Suspense>
                </div>
                <div className={Css["bottom-nav"]}>
                    <ul>
                        <li className={this.state.homeStyle ? Css["active"] : ""}
                            onClick={this.goPage.bind(this, "home/index")}>
                            <div className={Css["icon"] + " " + Css["home-icon"]}></div>
                            <div className={Css["text"]}>首页</div>
                        </li>
                        <li className={this.state.cartStyle ? Css["active"] : ""}
                            onClick={this.goPage.bind(this, "home/cart")}>
                            <div className={Css["icon"] + " " + Css["cart-icon"]}></div>
                            <div className={Css["text"]}>购物车</div>
                            <div className={this.props.state.cart.aCartData.length > 0 ? Css["spot"] : Css["spot"] + " hide"}></div>
                        </li>
                        <li className={this.state.myStyle ? Css["active"] : ""}
                            onClick={this.goPage.bind(this, "home/my")}>
                            <div className={Css["icon"] + " " + Css["mine-icon"]}></div>
                            <div className={Css["text"]}>我的</div>
                        </li>
                    </ul>
                </div>
            </React.Fragment>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(MainComponent)