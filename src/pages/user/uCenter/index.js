import React from "react"
import {connect} from "react-redux"
import actions from "../../../store/actions/index"
import {request} from "../../../assets/js/utils/request";
import SubHeaderComponent from "../../../components/header/header";
import Css from "../../../assets/css/user/uCenter/index.css"
import {Modal} from "antd-mobile";
import {setScrollTop} from "../../../assets/js/utils/utils";

class UCenterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            head: "",
            nickname: "昵称",
            points: 0
        }
        this.uid = props.state.user.uid;
        //console.log(this.props.state.user.isLogin)
    }

    logout() {
        if (this.props.state.user.isLogin) {
            Modal.alert('', '确认要删除吗?', [
                {
                    text: '取消', onPress: () => {

                    }, style: 'default'
                },
                {
                    text: '确认', onPress: () => {
                        //安全退出
                        request(window.base.config.baseUrl + "/home/user/safeout?token=" + window.base.config.token, "post", {uid: this.props.state.user.uid}).then(res => {
                            //console.log(res);
                            if (res.code === 200) {
                                this.props.dispatch(actions.user.logout());
                                this.props.dispatch(actions.cart.clearCart());
                                this.props.history.push(window.base.config.path + "login/index");
                            }
                        });
                    }
                },
            ]);
        } else {
            this.props.history.push(window.base.config.path + "login/index")
        }
    }

    componentDidMount() {
        setScrollTop();
        this.getUserInfo();
    }

    getUserInfo() {
        if (this.props.state.user.isLogin) {
            request(window.base.config.baseUrl + "/user/myinfo/userinfo/uid/" + this.uid + "?token=" + window.base.config.token).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    this.setState({head: res.data.head, nickname: res.data.nickname, points: res.data.points});
                }
            })
        }
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
            <div className={Css["page"]}>
                <SubHeaderComponent title="会员中心"></SubHeaderComponent>
                <div className={Css["user-info-wrap"]}>
                    <div className={Css["head"]}>
                        <img
                            src={this.state.head ? this.state.head : require("../../../assets/images/user/my/default-head.png")}
                            alt=""/>
                    </div>
                    <div className={Css["nickname"]}>{this.state.nickname}</div>
                    <div className={Css["points"]}>我的积分:{this.state.points}</div>
                </div>
                <div className={Css["order-name-wrap"]}>
                    <div className={Css["order-name"]}>全部订单</div>
                    <div className={Css["show-order"]}
                         onClick={this.pushPage.bind(this, "myorder/order?status=all")}>查看全部订单 &gt;</div>
                </div>
                <div className={Css["order-status-wrap"]}>
                    <div className={Css["item"]} onClick={this.pushPage.bind(this, "myorder/order?status=0")}>
                        <div className={Css["icon"] + " " + Css["wait"]}></div>
                        <div className={Css["text"]}>待支付
                        </div>
                    </div>
                    <div className={Css["item"]} onClick={this.pushPage.bind(this, "myorder/order?status=1")}>
                        <div className={Css["icon"] + " " + Css["take"]}></div>
                        <div className={Css["text"]}>待收货
                        </div>
                    </div>
                    <div className={Css["item"]} onClick={this.pushPage.bind(this, "myorder/review?status=2")}>
                        <div className={Css["icon"] + " " + Css["comment"]}></div>
                        <div className={Css["text"]}>待评价
                        </div>
                    </div>
                </div>
                <div className={Css["menu-list-wrap"]}>
                    <ul onClick={this.pushPage.bind(this, "profile/index")}>
                        <li>个人资料</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, "user/address/index")}>
                        <li>收货地址</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, "user/mobile/index")}>
                        <li>绑定手机</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, "user/modifyPassword/index")}>
                        <li>修改密码</li>
                        <li></li>
                    </ul>
                    <ul onClick={this.pushPage.bind(this, "user/myCollection/index")}>
                        <li>我的收藏</li>
                        <li></li>
                    </ul>
                    <div className={Css["btn"]} onClick={this.logout.bind(this)}>{
                        this.props.state.user.isLogin ? "安全退出" : "登录/注册"}</div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(UCenterComponent)