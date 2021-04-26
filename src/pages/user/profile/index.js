import React from "react"
import {connect} from "react-redux"
import {safeAuth} from "../../../assets/js/utils/utils"
import SubHeaderComponent from "../../../components/header/header";
import Css from "../../../assets/css/user/profile/index.css"
import {ActionSheet, Toast} from "antd-mobile"
import {request} from "../../../assets/js/utils/request";

class ProfileComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            head: "",
            headname: "",
            nickname: "",
            gender: "",
        }
        safeAuth(props);
    }

    componentDidMount() {
        this.getUserInfo();
    }

    //选择性别
    selectGender() {
        const genders = ['男', '女', '取消'];
        ActionSheet.showActionSheetWithOptions({
                options: genders,
                cancelButtonIndex: genders.length - 1,
                //title: '请选择性别',
                message: '请选择性别',
                maskClosable: true,
                onTouchStart: e => e.preventDefault(),
            },
            (buttonIndex) => {
                //console.log(buttonIndex);
                if (buttonIndex < genders.length - 1) {
                    this.setState({gender: genders[buttonIndex]})
                }
            });
    }

    //头像上传
    uploadHead() {
        //console.log(this.refs["headfile"].files[0])
        request(window.base.config.baseUrl + "/user/myinfo/formdatahead?token=" + window.base.config.token, "file", {headfile: this.refs["headfile"].files[0]}).then(res => {
            console.log(res);
            if (res.code === 200) {
                this.setState({
                    head: "http://vueshop.glbuys.com/userfiles/head/" + res.data.msbox,
                    headname: res.data.msbox
                });
            }
        })
    }

    //获取会员信息
    getUserInfo() {
        request(window.base.config.baseUrl + "/user/myinfo/userinfo/uid/" + this.props.state.user.uid + "?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({
                    head: res.data.head,
                    nickname: res.data.nickname,
                    gender: res.data.gender === "1" ? "男" : "女"
                })
            }
        })
    }


    save() {
        if (this.state.nickname.match(/^\s*$/)) {
            Toast.info("请输入昵称", 2);
            return;
        }
        if (this.state.gender.match(/^\s*$/)) {
            Toast.info("请选择性别", 2);
            return;
        }
        //修改会员信息
        request(window.base.config.baseUrl + "/user/myinfo/updateuser?token=" + window.base.config.token, "post", {
            uid: this.props.state.user.uid,
            head: this.state.headname,
            nickname: this.state.nickname,
            gender: this.state.gender === "男" ? "1" : "2"
        }).then(res => {
            console.log(res);
            if (res.code === 200) {
                Toast.info(res.data, 2, () => {
                    this.props.history.goBack();
                });
            }
        });
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="个人资料" right-btn="保存" click={this.save.bind(this)}></SubHeaderComponent>
                <div className={Css["main"]}>
                    <ul className={Css["head"]}>
                        <li>头像</li>
                        <li><img
                            src={this.state.head === "" ? require("../../../assets/images/user/my/default-head.png") : this.state.head}
                            alt=""/><input type="file" ref="headfile" onChange={this.uploadHead.bind(this)}/></li>
                    </ul>
                    <ul className={Css["list"]}>
                        <li>昵称</li>
                        <li><input type="text" placeholder="请设置昵称" value={this.state.nickname}
                                   onChange={(e) => {
                                       this.setState({nickname: e.target.value})
                                   }}/></li>
                        <li className={Css["arrow"]}></li>
                    </ul>
                    <ul className={Css["list"]}>
                        <li>性别</li>
                        <li><input type="text" placeholder="请选择性别" value={this.state.gender}
                                   readOnly onClick={this.selectGender.bind(this)}/>
                        </li>
                        <li className={Css["arrow"]}></li>
                    </ul>
                </div>
            </div>
        );
    }
}


export default connect(state => {
    return {
        state: state
    }
})(ProfileComponent)