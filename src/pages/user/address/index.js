import React from "react"
import {connect} from "react-redux"
import SubHeaderComponent from "../../../components/header/header"
import Css from "../../../assets/css/user/address/index.css"
import {safeAuth, setScrollTop} from "../../../assets/js/utils/utils";
import {request} from "../../../assets/js/utils/request";

class AddressComponent extends React.Component {
    constructor(props) {
        super(props);
        safeAuth(props);
        this.state = {
            addressList: []
        }
    }

    componentDidMount() {
        setScrollTop();
        this.getAddressList();
    }

    getAddressList() {
        request(window.base.config.baseUrl + "/user/address/index?uid=" + this.props.state.user.uid + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({addressList: res.data});
            }
        });
    }

    pushPage(url) {
        this.props.history.push(window.base.config.path + url);
    }

    //修改收货地址
    modAddress(aid) {
        this.pushPage("user/address/modify?aid=" + aid);
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="收货地址管理"></SubHeaderComponent>
                <div className={Css["main"]}>
                    {
                        this.state.addressList.length > 0 ? this.state.addressList.map((item, index) => {
                            return (
                                <div className={Css["list"]} key={index} onClick={this.modAddress.bind(this, item.aid)}>
                                    <div className={Css["name-wrap"]}>
                                        <span>{item.name}</span><span>{item.cellphone}</span></div>
                                    <div className={Css["address"]}>{item.isdefault === "1" ?
                                        <span>[默认]</span> : ""}{item.province}{item.city}{item.area}{item.address}
                                    </div>
                                    <div className={Css["right-arrow"]}></div>
                                </div>
                            )
                        }) : ""
                    }
                    <div style={{width: "100%", height: "1.8rem"}}></div>
                </div>
                <div className={Css["add-btn"]} onClick={this.pushPage.bind(this, "address/add")}>添加新地址</div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(AddressComponent)