import React from "react"
import {connect} from "react-redux"
import SubHeaderComponent from "../../../components/header/header"
import Css from "../../../assets/css/home/address/index.css"
import {request} from "../../../assets/js/utils/request";
import {Modal, Toast} from "antd-mobile"
import {safeAuth, setScrollTop} from "../../../assets/js/utils/utils";

class SelectAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addressList: []
        }
        safeAuth(props);
        this.uid = props.state.user.uid;
    }

    componentDidMount() {
        setScrollTop();
        this.getAddressList();
    }

    //收货地址列表
    getAddressList() {
        request(window.base.config.baseUrl + "/user/address/index?uid=" + this.uid + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({addressList: res.data});
            }
        });
    }

    pushPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    //删除收货地址
    del(e, index, aid) {
        e.stopPropagation();
        Modal.alert('', '确认要删除吗?', [
            {
                text: '取消', onPress: () => {

                }, style: 'default'
            },
            {
                text: '确认', onPress: () => {
                    let addressList = this.state.addressList;
                    request(window.base.config.baseUrl + "/user/address/del?uid=" + this.uid + "&aid=" + aid + "&token=" + window.base.config.token).then(res => {
                        //console.log(res);
                        if (res.code === 200) {
                            addressList.splice(index, 1);
                            this.setState({addressList: addressList}, () => {
                                Toast.info(res.data, 2);
                            });
                            if (aid === sessionStorage["aid"]) {
                                sessionStorage.removeItem("aid");
                            }
                            if (aid === localStorage["aid"]) {
                                localStorage.removeItem("aid");
                            }
                        }
                    });
                }
            },
        ]);
    }

    //选择收货地址
    selectAddress(aid) {
        sessionStorage["aid"] = aid;
        this.props.history.replace(window.base.config.path + "order/index");
    }

    //修改收货地址
    modify(e, aid) {
        e.stopPropagation();
        this.pushPage("address/modify?aid=" + aid);

    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="选择收货地址"></SubHeaderComponent>
                <div className={Css["main"]}>
                    <div className={Css["address-nav"]}>
                        <div className={Css["address-nav-name"]}>配送地址</div>
                        <div className={Css["address-nav-name"]}
                             onClick={this.pushPage.bind(this, "address/add")}>+添加收货地址
                        </div>
                    </div>
                    {
                        this.state.addressList.length > 0 ? this.state.addressList.map((item, index) => {
                            return (
                                <div className={Css["address-list"]} key={index}
                                     onClick={this.selectAddress.bind(this, item.aid)}>
                                    <div className={Css["address-info-wrap"]}>
                                        <div className={item.isdefault === "1" ? Css["check-mark"] : ""}></div>
                                        <div className={Css["address-info"]}>
                                            <div className={Css["person"]}>
                                                <span>{item.name}</span>
                                                <span>{item.cellphone}</span>
                                            </div>
                                            <div className={Css["address"]}>
                                                <span
                                                    className={item.isdefault === "1" ? Css["default"] : "hide"}>默认</span>
                                                <span
                                                    className={Css["text"]}>{item.province}{item.city}{item.area}{item.address}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={Css["handle-wrap"]}>
                                        <div className={Css["edit"]}
                                             onClick={(e) => {
                                                 this.modify(e, item.aid)
                                             }}></div>
                                        <div className={Css["del"]}
                                             onClick={(e) => {
                                                 this.del(e, index, item.aid)
                                             }}></div>
                                    </div>
                                </div>
                            )
                        }) : <div className="no-data">您还没有添加收货地址!</div>
                    }
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(SelectAddress)