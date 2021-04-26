import React, {lazy, Suspense} from "react"
import {Switch, Route, Redirect} from "react-router-dom"
import {connect} from "react-redux"
import {localParam, safeAuth} from "../../../assets/js/utils/utils"
import SubHeaderComponent from "../../../components/header/header.js"
import Css from "../../../assets/css/user/myorder/index.css"

const OrderPage = lazy(() => import("./order"));
const ReviewPage = lazy(() => import("./review"));

class OrderComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: localParam(props.location.search).search.status ? localParam(props.location.search).search.status : "",
            title: "全部订单"
        }
        safeAuth(props);
    }

    componentDidMount() {
        this.getTitle();
    }

    componentWillReceiveProps(newProps) {
        let status = localParam(newProps.location.search).search.status;
        this.setState({status: status}, () => {
            this.getTitle();
        });
    }

    getTitle() {
        switch (this.state.status) {
            case "all":
                this.setState({"title": "全部订单"});
                break;
            case "0":
                this.setState({"title": "待付款"});
                break;
            case "1":
                this.setState({"title": "待收货"});
                break;
            case "2":
                this.setState({"title": "待评价"});
                break;
            default:
                this.setState({"title": "全部订单"});
                break;
        }
    }

    replacePage(url) {
        this.props.history.replace(window.base.config.path + "transfer");
        setTimeout(()=>{
            this.props.history.replace(window.base.config.path + url);
        },30);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title={this.state.title}></SubHeaderComponent>
                <div className={Css["tab-wrap"]}>
                    <div className={this.state.status === "all" ? Css["tab"] + " " + Css["active"] : Css["tab"]}
                         onClick={this.replacePage.bind(this, "myorder/order?status=all")}>全部订单
                    </div>
                    <div className={this.state.status === "0" ? Css["tab"] + " " + Css["active"] : Css["tab"]}
                         onClick={this.replacePage.bind(this, "myorder/order?status=0")}>待付款
                    </div>
                    <div className={this.state.status === "1" ? Css["tab"] + " " + Css["active"] : Css["tab"]}
                         onClick={this.replacePage.bind(this, "myorder/order?status=1")}>待收货
                    </div>
                    <div className={this.state.status === "2" ? Css["tab"] + " " + Css["active"] : Css["tab"]}
                         onClick={this.replacePage.bind(this, "myorder/review?status=2")}>待评价
                    </div>
                </div>
                <div className={Css["main"]}>
                    <Suspense fallback={<React.Fragment/>}>
                        <Switch>
                            <Route path={window.base.config.path + "myorder/order"} component={OrderPage}></Route>
                            <Route path={window.base.config.path + "myorder/review"} component={ReviewPage}></Route>
                            <Redirect to={window.base.config.path + "myorder/order?status=all"}></Redirect>
                        </Switch>
                    </Suspense>
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return {
        state: state
    }
})(OrderComponent)