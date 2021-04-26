import React from "react"
import {connect} from "react-redux"
import actions from "../../../store/actions/index"
import SubHeaderComponent from "../../../components/header/header.js"
import Css from "../../../assets/css/home/login/index.css"
import {Switch, Toast} from "antd-mobile"
import {request} from "../../../assets/js/utils/request";

class RegComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: false,
            cellphone: "",
            password: "",
            passwordType: "password"
        }
        this.isSubmit = true;
    }

    componentDidMount() {
        document.getElementById("title").innerHTML = "会员登录";
    }

    //点击登录按钮
    login() {
        if (this.state.cellphone.match(/^\s*$/)) {
            Toast.info("请输入手机号", 2);
            return;
        }
        if (!this.state.cellphone.match(/^1[0-9][0-9]\d{8}$/)) {
            Toast.info("您输入的手机号格式不正确", 2);
            return;
        }

        if (this.state.password.match(/^\s*$/)) {
            Toast.info("请输入密码", 2);
            return;
        }

        //输入密码会员登录
        if (this.isSubmit) {
            this.isSubmit = false;
            request(window.base.config.baseUrl + "/home/user/pwdlogin?token=" + window.base.config.token, "post", {
                cellphone: this.state.cellphone,
                password: this.state.password
            }).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    this.props.dispatch(actions.user.login({
                        "uid": res.data.uid,
                        "nickname": res.data.nickname,
                        "auth_token": res.data.auth_token,
                        "isLogin": true
                    }));
                    localStorage["uid"] = res.data.uid;
                    localStorage["nickname"] = res.data.nickname;
                    localStorage["auth_token"] = res.data.auth_token;
                    localStorage["isLogin"] = true;
                    this.props.history.goBack();
                } else {
                    Toast.info(res.data, 2);
                }
                this.isSubmit = true;
            })
        }
    }

    //改变password的type
    changeType() {
        if (this.state.checked) {
            this.setState({checked: false, passwordType: "password"});
        } else {
            this.setState({checked: true, passwordType: "text"});
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
                <SubHeaderComponent title="会员登录"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["code-wrap"]} style={{"marginTop": 0}}>
                        <input type="text" placeholder="请输入手机号" onChange={(e) => {
                            this.setState({cellphone: e.target.value})
                        }}/>
                    </div>
                    <div className={Css["password-wrap"]}>
                        <div className={Css["password"]}>
                            <input type={this.state.passwordType} placeholder="请输入密码" onChange={(e) => {
                                this.setState({password: e.target.value})
                            }}/>
                        </div>
                        <div className={Css["switch-wrap"]}>
                            <Switch
                                platform="ios"
                                color="red"
                                checked={this.state.checked}
                                onClick={this.changeType.bind(this)}
                            />
                        </div>
                    </div>
                    <div className={Css["sure-btn"]} onClick={this.login.bind(this)}>登录</div>
                    <div className={Css["fastreg-wrap"]}>
                        <div>
                            <img src={require("../../../assets/images/common/forget.png")} alt=""/>忘记密码
                        </div>
                        <div onClick={this.pushPage.bind(this, "register/index")}>
                            <img src={require("../../../assets/images/common/reg.png")} alt=""/>快速注册
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(RegComponent)