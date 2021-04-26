import React, {lazy, Suspense} from "react"
import {Route, Switch, Redirect} from "react-router-dom";
import {connect} from "react-redux"
import {localParam} from "../../../assets/js/utils/utils";
import Css from "../../../assets/css/home/goods/details.css"

const GoodsDetailsItemPage = lazy(() => import("./details_item"))
const GoodsDetailsContentPage = lazy(() => import("./details_content"))
const GoodsDetailsReviewPage = lazy(() => import("./details_review"))

class GoodsDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gid: props.location.search !== "" ? localParam(props.location.search).search.gid : "",
            itemActive: true,
            contentActive: false,
            reviewActive: false,
            aAttr: []
        }
    }

    componentDidMount() {
        this.changeStyle(this.props.location.pathname);
        //console.log(this.props.state.cart.aCartData.length)
    }


    UNSAFE_componentWillReceiveProps(newProps) {
        //console.log(newProps.location.pathname);
        this.changeStyle(newProps.location.pathname);
    }

    goBack() {
        this.props.history.goBack();
    }

    replacePage(url) {
        this.props.history.replace(window.base.config.path + url);
    }

    pushPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    changeStyle(pathname) {
        switch (pathname) {
            case window.base.config.path + "goods/details/item":
                this.setState({itemActive: true, contentActive: false, reviewActive: false});
                break;
            case window.base.config.path + "goods/details/content":
                this.setState({itemActive: false, contentActive: true, reviewActive: false});
                break;
            case window.base.config.path + "goods/details/review":
                this.setState({itemActive: false, contentActive: false, reviewActive: true});
                break;
            default:
                this.setState({itemActive: true, contentActive: false, reviewActive: false});
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
            <div>
                <div className={Css["details-header"]}>
                    <div className={Css["back"]} onClick={this.goBack.bind(this)}></div>
                    <div className={Css["tab-wrap"]}>
                        <div className={this.state.itemActive ? Css["tab-name"] + " " + Css["active"] : Css["tab-name"]}
                             onClick={this.replacePage.bind(this, "goods/details/item?gid=" + this.state.gid)}>商品
                        </div>
                        <div
                            className={this.state.contentActive ? Css["tab-name"] + " " + Css["active"] : Css["tab-name"]}
                            onClick={this.replacePage.bind(this, "goods/details/content?gid=" + this.state.gid)}>详情
                        </div>
                        <div
                            className={this.state.reviewActive ? Css["tab-name"] + " " + Css["active"] : Css["tab-name"]}
                            onClick={this.replacePage.bind(this, "goods/details/review?gid=" + this.state.gid)}>评价
                        </div>
                    </div>
                    <div className={Css["cart-icon"]} id="cart-icon"
                         onClick={this.pushPage.bind(this, "home/cart")}>
                        <div
                            className={this.props.state.cart.aCartData.length > 0 ? Css["spot"] : Css["spot"] + " hide"}></div>
                    </div>
                </div>
                <div className={Css["sub-page"]}>
                    <Suspense fallback={<React.Fragment/>}>
                        <Switch>
                            <Route path={window.base.config.path + "goods/details/item"}
                                   component={GoodsDetailsItemPage}></Route>
                            <Route path={window.base.config.path + "goods/details/content"}
                                   component={GoodsDetailsContentPage}></Route>
                            <Route path={window.base.config.path + "goods/details/review"}
                                   component={GoodsDetailsReviewPage}></Route>
                            <Redirect to={window.base.config.path + "goods/details/item"}></Redirect>
                        </Switch>
                    </Suspense>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(GoodsDetails)