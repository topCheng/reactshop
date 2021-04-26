import React from "react"
import {connect} from "react-redux"
import SubHeaderComponent from "../../../components/header/header"
import {safeAuth, lazyImg, setScrollTop} from "../../../assets/js/utils/utils";
import UpRefresh from "../../../assets/js/libs/uprefresh"
import Css from "../../../assets/css/user/myCollection/index.css"
import {request} from "../../../assets/js/utils/request";
import {Modal, Toast} from "antd-mobile"

class MyCollectiton extends React.Component {
    constructor(props) {
        super(props);
        safeAuth(props);
        this.state = {
            fav: [],
            total: 0
        }
        this.upRefresh = null;
        this.curPage = 1;
        this.maxPage = 0;
        this.offsetBottom = 100;
    }

    componentDidMount() {
        setScrollTop();
        this.getFav();
    }

    getFav() {
        request(window.base.config.baseUrl + "/user/fav/index?uid=" + this.props.state.user.uid + "&token=" + window.base.config.token + "&page=1").then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({fav: res.data}, () => {
                    lazyImg();
                });
                this.maxPage = res.pageinfo.pagenum;
                this.getScrollPage();
            } else {
                this.setState({fav: [], total: 0});
            }
        })
    }

    getScrollPage() {
        this.upRefresh = new UpRefresh({
            curPage: this.curPage,
            maxPage: this.maxPage,
            offsetBottom: this.offsetBottom
        }, curPage => {
            request(window.base.config.baseUrl + "/user/fav/index?uid=" + this.props.state.user.uid + "&token=" + window.base.config.token + "&page=" + curPage).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        let fav = this.state.fav;
                        for (let i = 0; i < res.data.length; i++) {
                            fav.push(res.data[i]);
                        }
                        this.setState({fav: fav}, () => {
                            lazyImg();
                        });
                    }
                }
            })
        })
    }

    buy(gid) {
        this.props.history.push(window.base.config.path + "goods/details/item?gid=" + gid);
    }

    delete(index, fid) {
        Modal.alert('', '确认要删除吗?', [
            {
                text: '取消', onPress: () => {

                }, style: 'default'
            },
            {
                text: '确认', onPress: () => {
                    request(window.base.config.baseUrl + "/user/fav/del?uid=" + this.props.state.user.uid + "&fid=" + fid + "&token=" + window.base.config.token).then(res => {
                        //console.log(res);
                        if (res.code === 200) {
                            let fav = this.state.fav;
                            Toast.info("删除成功", 2, () => {
                                fav.splice(index, 1);
                                this.setState({fav: fav},()=>{
                                    lazyImg();
                                });
                            });
                        }
                    });
                }
            },
        ]);
    }

    componentWillUnmount() {
        this.upRefresh = null;
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <SubHeaderComponent title="我的收藏"></SubHeaderComponent>
                <div className={Css["main"]}>
                    {
                        this.state.fav.length > 0 ? this.state.fav.map((item, index) => {
                            return (
                                <div className={Css["goods-list"]} key={index}>
                                    <div className={Css["image"]}>
                                        <img src={require("../../../assets/images/common/lazyImg.jpg")}
                                             data-echo={item.image} alt={item.title}/>
                                    </div>
                                    <div className={Css["title"]}>{item.title}</div>
                                    <div className={Css["price"]}>¥{item.price}</div>
                                    <div className={Css["btn-wrap"]}>
                                        <div className={Css["btn"]} onClick={this.buy.bind(this, item.gid)}>购买</div>
                                        <div className={Css["btn"]}
                                             onClick={this.delete.bind(this, index, item.fid)}>删除
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : ""
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
})(MyCollectiton)