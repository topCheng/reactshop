/*eslint-disable*/
import React, {lazy, Suspense} from "react"
import {Route, Switch} from "react-router-dom";
import Css from "../../../assets/css/home/goods/classify.css"
import IScroll from "../../../assets/js/libs/iscroll"
import {request} from "../../../assets/js/utils/request"
import {localParam, setScrollTop} from "../../../assets/js/utils/utils";
import SearchComponent from "../../../components/search/search";

const GoodsClassifyItemPage = lazy(() => import("./classify_item"));

class GoodsClassify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            aClassify: [],
            displaySearch: {display: "none"}
        }
        this.myScroll = null;
        this.aTempClassify = [];
        this.cid = props.location.search ? localParam(props.location.search).search.cid : "492";
    }

    replacePage(url) {
        this.props.history.replace(window.base.config.path + url);
    }

    componentDidMount() {
        setScrollTop();
        this.getClassifyData();
        //console.log(this.cid)
    }


    eventScroll() {
        this.refs["classify-wrap"].addEventListener('touchmove', function (e) {
            e.preventDefault();
        }, false);
        this.myScroll = new IScroll(this.refs["classify-wrap"], {
            scrollX: false,
            scrollY: true,
            preventDefault: false
        });
    }

    getClassifyData() {
        request(window.base.config.baseUrl + "/home/category/menu?token=" + window.base.config.token).then(res => {
            //console.log(res);
            this.aTempClassify = res.data;
            for (let i = 0; i < this.aTempClassify.length; i++) {
                this.aTempClassify[i].active = false;
            }
            //console.log(this.aTempClassify)
            if (res.code === 200) {
                this.setState({aClassify: res.data}, () => {
                    this.eventScroll();
                    this.getDefaultClassify();
                })
            }
        })
    }

    changeStyle(url, index) {
        if (this.aTempClassify.length > 0) {
            for (let i = 0; i < this.aTempClassify.length; i++) {
                if (this.aTempClassify[i].active) {
                    this.aTempClassify[i].active = false;
                    break;
                }
            }
        }
        this.aTempClassify[index].active = true;
        this.handleIscroll(index);
        this.replacePage(url);
    }

    getDefaultClassify() {
        if (this.aTempClassify.length > 0) {
            for (let i = 0; i < this.aTempClassify.length; i++) {
                if (this.aTempClassify[i].cid === this.cid) {
                    this.aTempClassify[i].active = true;
                    break;
                }
            }
            this.setState({aClassify: this.aTempClassify});
        }
    }

    handleIscroll(index) {
        //console.log(this.refs["classify-item-" + index].offsetHeight)
        let offsetTop = this.refs["classify-item-" + index].offsetHeight * index;
        let halfHeight = parseInt(this.refs["classify-wrap"].offsetHeight / 3);
        let bottomHeight = parseInt(this.refs["classify-wrap"].scrollHeight - offsetTop)
        if (offsetTop > halfHeight && bottomHeight > this.refs["classify-wrap"].offsetHeight) {
            this.myScroll.scrollTo(0, -offsetTop, 1000);
        }
    }

    goBack() {
        this.props.history.goBack();
    }

    showSearch() {
        this.setState({displaySearch: {display: "block"}});
    }

    hideSearch() {
        this.setState({displaySearch: {display: "none"}});
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div>
                <div className={Css["search-header"]}>
                    <div className={Css["back"]} onClick={this.goBack.bind(this)}></div>
                    <div className={Css["search"]} onClick={this.showSearch.bind(this)}>请输入宝贝名称</div>
                </div>
                <div className={Css["goods-main"]}>
                    <div className={Css["classify-wrap"]} id="classify-wrap" ref="classify-wrap">
                        <div>
                            {
                                this.state.aClassify != null ? this.state.aClassify.map((item, index) => {
                                    return (
                                        <div ref={"classify-item-" + index}
                                             className={this.aTempClassify[index].active ? Css["classify-item"] + " " + Css["active"] : Css["classify-item"]}
                                             key={index}
                                             onClick={this.changeStyle.bind(this, "goods/classify/items?cid=" + item.cid, index)}>{item.title}</div>
                                    )
                                }) : ""
                            }
                            <div style={{width: "100%", height: "2rem"}}></div>
                        </div>
                    </div>
                    <div className={Css["goods-content"]}>
                        <Suspense fallback={<React.Fragment/>}>
                            <Switch>
                                <Route path={window.base.config.path + "goods/classify/items"}
                                       component={GoodsClassifyItemPage}></Route>
                            </Switch>
                        </Suspense>
                    </div>
                </div>
                <SearchComponent displaySearch={this.state.displaySearch}
                                 hideSearchPage={this.hideSearch.bind(this)}></SearchComponent>
            </div>
        );
    }
}

export default GoodsClassify