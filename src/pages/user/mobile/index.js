import React from "react"
import {connect} from "react-redux"
import {Toast} from "antd-mobile"
import SubHeaderComponent from "../../../components/header/header"
import {safeAuth} from "../../../assets/js/utils/utils";
import Css from "../../../assets/css/user/mobile/index.css"
import {request} from "../../../assets/js/utils/request";

class BindMobileComponent extends React.Component {
    constructor(props) {
        super(props);
        safeAuth(props);
        this.state = {
            cellphone: "",
            code: "",
            codeSuccess: false,
            codeText: "获取验证码",
        }
        this.timer = null;
        this.isSendCode = false;
        this.isSubmit = true;
    }

    componentDidMount() {

    }

    //点击下一步按钮
    async submit() {
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
        if (this.state.code.match(/^\s*$/)) {
            Toast.info("请输入验证码", 2);
            return;
        }
        //会员注册
        if (this.isSubmit) {
            this.isSubmit = false;
            request(window.base.config.baseUrl + "/user/myinfo/updatecellphone?token=" + window.base.config.token, "post", {
                uid: this.props.state.user.uid,
                cellphone: this.state.cellphone,
                vcode: this.state.code,
            }).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    Toast.info("修改成功", 2, () => {
                        this.props.history.goBack();
                    });
                } else {
                    Toast.info(res.data, 2);
                }
            })
        }
    }

    //验证手机号
    checkCellphone(e) {
        this.setState({cellphone: e.target.value}, () => {
            if (this.state.cellphone.match(/^1[0-9][0-9]\d{8}$/)) {
                this.setState({codeSuccess: true});
            } else {
                this.setState({codeSuccess: false});
            }
        })
    }

    //是否注册过会员
    isReg() {
        return request(window.base.config.baseUrl + "/home/user/isreg?token=" + window.base.config.token, "post", {username: this.state.cellphone}).then(res => {
            return res;
        });
    }

    //获取验证码
    async getCode() {
        if (!this.isSendCode && this.state.codeSuccess) {
            let res = await this.isReg();
            //console.log(res);
            if (res.code === 200) {
                if (res.data.isreg === "1") {
                    Toast.info("该手机号已注册", 2);
                    return;
                }
            }
            this.isSendCode = true;
            let time = 5, codeText = "重新获取(" + time + "s)";
            this.setState({codeText: codeText, codeSuccess: false});
            this.timer = setInterval(() => {
                if (time > 0) {
                    time--;
                    codeText = "重新获取(" + time + "s)";
                } else {
                    clearInterval(this.timer);
                    codeText = "获取短信验证码";
                    this.setState({codeSuccess: true});
                    this.isSendCode = false;
                }
                this.setState({codeText: codeText});
            }, 1000);
        }
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
                <SubHeaderComponent title="绑定手机"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["tip"]}>
                        <div className={Css["icon"]}></div>
                        <div className={Css["text"]}>新手机号验证后，即可绑定成功！</div>
                    </div>
                    <div className={Css["input-wrap"]} style={{marginTop: "0.5rem"}}>
                        <input type="tel" className={Css["cellphone"]} placeholder="绑定手机号"
                               onChange={(e) => {
                                   this.checkCellphone(e)
                               }}/>
                    </div>
                    <div className={Css["input-wrap"]} style={{marginTop: "0.2rem"}}>
                        <input type="text" className={Css["code"]} placeholder="请输入短信验证码" onChange={(e) => {
                            this.setState({code: e.target.value})
                        }}/>
                        <div
                            className={this.state.codeSuccess ? Css["code-btn"] + " " + Css["success"] : Css["code-btn"]}
                            onClick={this.getCode.bind(this)}>{this.state.codeText}
                        </div>
                    </div>
                    <div className={Css["save-btn"]} onClick={this.submit.bind(this)}>下一步</div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(BindMobileComponent)