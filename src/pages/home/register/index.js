import React from "react"
import SubHeaderComponent from "../../../components/header/header.js"
import Css from "../../../assets/css/home/register/index.css"
import {Switch, Toast} from "antd-mobile"
import {request} from "../../../assets/js/utils/request";

class RegComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            checked: false,
            cellphone: "",
            msgCodeSuccess: false,
            msgCodeText: "获取短信验证码",
            msgCode: "",
            password: "",
            passwordType: "password"
        }
        this.timer = null;
        this.isSendMsgCode = false;
        this.isSubmit = true;
    }

    componentDidMount() {
        document.getElementById("title").innerHTML = "会员注册";
    }

    //验证手机号
    checkCellphone(e) {
        this.setState({cellphone: e.target.value}, () => {
            if (!this.isSendMsgCode) {
                if (this.state.cellphone.match(/^1[0-9][0-9]\d{8}$/)) {
                    this.setState({msgCodeSuccess: true});
                } else {
                    this.setState({msgCodeSuccess: false});
                }
            }
        });
    }

    //获取短信验证码
    async getCode() {
        if (!this.isSendMsgCode && this.state.msgCodeSuccess) {
            let res = await this.isReg();
            if (res.code === 200) {
                if (res.data.isreg === "1") {
                    Toast.info("该手机号已注册", 2);
                    return;
                }
            }
            this.isSendMsgCode = true;
            let time = 10, msgCodeText = "重新获取(" + time + "s)";
            this.setState({msgCodeText: msgCodeText, msgCodeSuccess: false});
            this.timer = setInterval(() => {
                if (time > 0) {
                    time--;
                    msgCodeText = "重新获取(" + time + "s)";
                } else {
                    clearInterval(this.timer);
                    msgCodeText = "获取短信验证码";
                    this.setState({msgCodeSuccess: true});
                    this.isSendMsgCode = false;
                }
                this.setState({msgCodeText: msgCodeText});
            }, 1000);
        }
    }

    //点击注册按钮
    async reg() {
        if (this.state.cellphone.match(/^\s*$/)) {
            Toast.info("请输入手机号", 2);
            return;
        }
        if (!this.state.cellphone.match(/^1[0-9][0-9]\d{8}$/)) {
            Toast.info("您输入的手机号格式不正确", 2);
            return;
        }
        let res = await this.isReg();
        //console.log(res);
        if (res.code === 200) {
            if (res.data.isreg === "1") {
                Toast.info("该手机号已注册", 2);
                return;
            }
        }
        if (this.state.msgCode.match(/^\s*$/)) {
            Toast.info("请输入短信验证码", 2);
            return;
        }
        if (this.state.password.match(/^\s*$/)) {
            Toast.info("请输入密码", 2);
            return;
        }
        //会员注册
        if (this.isSubmit) {
            this.isSubmit = false;
            request(window.base.config.baseUrl + "/home/user/reg?token=" + window.base.config.token, "post", {
                cellphone: this.state.cellphone,
                vcode: this.state.msgCode,
                password: this.state.password
            }).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    this.props.history.goBack();
                }
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

    //是否注册过会员
    isReg() {
        return request(window.base.config.baseUrl + "/home/user/isreg?token=" + window.base.config.token, "post", {username: this.state.cellphone}).then(res => {
            return res;
        });
    }

    componentWillUnmount() {
        clearInterval(this.timer);
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="会员注册"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["cellphone-wrap"]}>
                        <div className={Css["cellphone"]}>
                            <input type="tel" placeholder="请输入手机号" maxLength="11" onChange={(e) => {
                                this.checkCellphone(e)
                            }}/>
                        </div>
                        <div
                            className={this.state.msgCodeSuccess ? Css["code-btn"] + " " + Css["success"] : Css["code-btn"]}
                            onClick={this.getCode.bind(this)}>{this.state.msgCodeText}
                        </div>
                    </div>
                    <div className={Css["code-wrap"]}>
                        <input type="text" placeholder="请输入短信验证码" onChange={(e) => {
                            this.setState({msgCode: e.target.value})
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
                    <div className={Css["sure-btn"]} onClick={this.reg.bind(this)}>注册</div>
                </div>
            </div>
        );
    }
}

export default RegComponent