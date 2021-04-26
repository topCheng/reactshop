import React from "react"
import {connect} from "react-redux"
import SubHeaderComponent from "../../../components/header/header"
import Css from "../../../assets/css/user/modifyPassword/index.css"
import {Switch, Toast} from "antd-mobile"
import {request} from "../../../assets/js/utils/request";

class ModifyPassword extends React.Component {
    constructor() {
        super();
        this.state = {
            type: "password",
            checked: false,
            password: ""
        }
        this.isSubmit = false;
    }

    changeType() {
        if (this.state.checked) {
            this.setState({checked: false, type: "password"});
        } else {
            this.setState({checked: true, type: "text"});
        }
    }

    submit() {
        if (this.state.password.match(/^\s*$/)) {
            Toast.info("请输入密码", 2);
            return;
        }
        if (this.state.password.length < 6) {
            Toast.info("请输入不小于6位的密码", 2);
            return;
        }
        if (!this.isSubmit) {
            this.isSubmit = true;
            request(window.base.config.baseUrl + "/home/user/modpwd?token=" + window.base.config.token, "post", {
                uid: this.props.state.user.uid,
                pwd: this.state.password
            }).then(res => {
                console.log(res);
                if (res.code === 200) {
                    Toast.info("修改成功", 2, () => {
                        this.props.history.goBack();
                    });
                } else {
                    Toast.info(res.data, 2, () => {
                        this.isSubmit = false;
                    });
                }
            });
        }
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="修改密码"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["input-wrap"]} style={{marginTop: "0.3rem"}}>
                        <input type={this.state.type} placeholder="请输入不小于6位的密码" className={Css["password"]}
                               onChange={(e) => {
                                   this.setState({password: e.target.value})
                               }}/>
                        <div className={Css["switch-wrap"]}>
                            <Switch
                                platform="ios"
                                color="red"
                                checked={this.state.checked}
                                onClick={this.changeType.bind(this)}
                            />
                        </div>
                    </div>
                    <div className={Css["save-btn"]} onClick={this.submit.bind(this)}>提交</div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(ModifyPassword)