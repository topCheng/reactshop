import React from "react"
import {connect} from "react-redux"
import Css from "../../../assets/css/home/order/result.css";
import SubHeaderComponent from "../../../components/header/header";
import {safeAuth, setScrollTop} from "../../../assets/js/utils/utils"
import {request} from "../../../assets/js/utils/request";

class OrderResult extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ordernum: ""
        }
        safeAuth(props);
        this.uid = props.state.user.uid
    }

    componentDidMount() {
        setScrollTop();
        request(window.base.config.baseUrl + "/order/lastordernum?uid=" + this.uid + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({ordernum: res.data.ordernum});
            }
        })
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    replacePage(url) {
        this.props.history.replace(window.base.config.path + url);
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="订单结束"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["list"] + " " + Css["success"]}>订购成功！</div>
                    <div className={Css["list"] + " " + Css["ordernum"]}>订单编号：{this.state.ordernum}</div>
                    <div className={Css["list"]} onClick={this.replacePage.bind(this, "myorder")}>查看订单</div>
                    <div className={Css["pay-btn"]}>去付款</div>
                </div>
            </div>
        );
    }
}

export default connect(state => {
    return {
        state: state
    }
})(OrderResult)