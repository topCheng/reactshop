import React from "react"
import {connect} from "react-redux"
import Css from "../../../assets/css/home/address/add.css"
import SubHeaderComponent from "../../../components/header/header";
import {request} from "../../../assets/js/utils/request";
import {localParam, safeAuth, setScrollTop} from "../../../assets/js/utils/utils"
import {Picker, Toast, Modal} from "antd-mobile";
import {province} from "../../../assets/data/province";

class ModifyAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            cellphone: "",
            provinceAddress: "",
            province: "",
            city: "",
            area: "",
            address: "",
            isDefault: false
        }
        this.uid = props.state.user.uid
        this.aid = localParam(props.location.search).search.aid
        safeAuth(props)
    }

    componentDidMount() {
        setScrollTop();
        this.getAddress();
    }

    //获取收货地址
    getAddress() {
        request(window.base.config.baseUrl + "/user/address/info?uid=" + this.uid + "&aid=" + this.aid + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({
                    name: res.data.name,
                    cellphone: res.data.cellphone,
                    provinceAddress: `${res.data.province} ${res.data.city} ${res.data.area}`,
                    province: res.data.province,
                    city: res.data.city,
                    area: res.data.area,
                    address: res.data.address,
                    isDefault: res.data.isdefault === "1" ? true : false
                })
            }
        })
    }

    save() {
        if (this.state.name.match(/^\s*$/)) {
            Toast.info("请输入收货人姓名", 2);
            return;
        }
        if (this.state.cellphone.match(/^\s*$/)) {
            Toast.info("请输入联系人手机号", 2);
            return;
        }
        if (!this.state.cellphone.match(/^1[0-9][0-9]\d{8}$/)) {
            Toast.info("您输入的手机号格式不正确", 2);
            return;
        }
        if (this.state.provinceAddress.match(/^\s*$/)) {
            Toast.info("请选择收货地址", 2);
            return;
        }
        if (this.state.address.match(/^\s*$/)) {
            Toast.info("请输入街道详细地址", 2);
            return;
        }
        request(window.base.config.baseUrl + "/user/address/mod?token=" + window.base.config.token, "post", {
            aid: this.aid,
            uid: this.uid,
            name: this.state.name,
            cellphone: this.state.cellphone,
            province: this.state.province,
            city: this.state.city,
            area: this.state.area,
            address: this.state.address,
            isdefault: this.state.isDefault ? "1" : "0",
        }).then(res => {
            //console.log(res);
            if (res.code === 200) {
                if (!this.state.isDefault) {
                    localStorage.removeItem("aid");
                }
                Toast.info("修改成功", 2, () => {
                    this.props.history.goBack();
                });
            } else {
                Toast.info(res.data, 2);
            }
        })
    }

    //删除收货地址
    deleteAddress() {
        Modal.alert('', '确认要删除吗?', [
            {
                text: '取消', onPress: () => {

                }, style: 'default'
            },
            {
                text: '确认', onPress: () => {
                    let addressList = this.state.addressList;
                    request(window.base.config.baseUrl + "/user/address/del?uid=" + this.uid + "&aid=" + this.aid + "&token=" + window.base.config.token).then(res => {
                        //console.log(res);
                        if (res.code === 200) {
                            Toast.info(res.data, 2, () => {
                                if (this.aid === sessionStorage["aid"]) {
                                    sessionStorage.removeItem("aid");
                                }
                                if (this.aid === localStorage["aid"]) {
                                    localStorage.removeItem("aid");
                                }
                                this.props.history.goBack();
                            });
                        }
                    });
                }
            },
        ]);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="修改收货地址" right-btn="删除"
                                    click={this.deleteAddress.bind(this)}></SubHeaderComponent>
                <div className={Css["main"]}>
                    <ul>
                        <li>收货人</li>
                        <li><input type="text" placeholder="收货人姓名" value={this.state.name} onChange={(e) => {
                            this.setState({name: e.target.value})
                        }}/></li>
                    </ul>
                    <ul>
                        <li>联系方式</li>
                        <li><input type="text" placeholder="联系人手机号" value={this.state.cellphone}
                                   onChange={(e) => {
                                       this.setState({cellphone: e.target.value})
                                   }}/></li>
                    </ul>
                    <ul>
                        <li>所在地区</li>
                        <Picker
                            data={province}
                            title="请选择收货地址"
                            onOk={e => {
                                //console.log(e);
                                this.setState({
                                    provinceAddress: e.join(" "),
                                    province: e[0],
                                    city: e[1],
                                    area: e[2] !== undefined ? e[2] : ""
                                });
                            }}
                            onDismiss={e => console.log('dismiss')}
                            value={this.state.provinceAddress.split(" ")}
                        >
                            <li>
                                <input type="text" value={this.state.provinceAddress} placeholder="请选择收货地址" readOnly/>
                            </li>
                        </Picker>
                    </ul>
                    <ul>
                        <li>详细地址</li>
                        <li><input type="text" placeholder="街道详细地址" value={this.state.address} onChange={(e) => {
                            this.setState({address: e.target.value})
                        }}/></li>
                    </ul>
                    <ul>
                        <li>设置为默认地址</li>
                        <li><input type="checkbox" checked={this.state.isDefault} onChange={(e) => {
                            this.setState({isDefault: !this.state.isDefault})
                        }}/></li>
                    </ul>
                    <button type="button" className={Css["save"]} onClick={this.save.bind(this)}>保存</button>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(ModifyAddress)