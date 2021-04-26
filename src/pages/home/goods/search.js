import React from "react"
import Css from "../../../assets/css/home/goods/search.css"
import IScroll from "../../../assets/js/libs/iscroll"
import {localParam, lazyImg} from "../../../assets/js/utils/utils";
import SearchComponent from "../../../components/search/search"
import {request} from "../../../assets/js/utils/request";
import UpRefresh from "../../../assets/js/libs/uprefresh"

class SearchComponentPage extends React.Component {
    constructor() {
        super();
        this.state = {
            showScreen: false,
            showOrder: false,
            showSales: false,
            displaySearch: {display: "none"},
            keywords: "",
            aGoods: [],
            aPriceOrder: [
                {title: "综合", type: "all", checked: true},
                {title: "价格从低到高", type: "up", checked: false},
                {title: "价格从高到低", type: "down", checked: false}
            ],
            aClassify: {
                items: [],
                active: false
            },
            aPrice: {
                items: [
                    {"price1": "1", "price2": "50", checked: false},
                    {"price1": "51", "price2": "99", checked: false},
                    {"price1": "100", "price2": "300", checked: false},
                    {"price1": "100", "price2": "300", checked: false},
                    {"price1": "301", "price2": "1000", checked: false},
                    {"price1": "1001", "price2": "4000", checked: false},
                    {"price1": "4001", "price2": "9999", checked: false}
                ],
                active: false
            },
            minPrice: "",
            maxPrice: "",
            aParams: [],
            total: 0
        }
        this.showOrder = false;
        this.showSales = false;
        this.myScroll = null;
        this.upRefresh = null;
        this.curPage = 1;
        this.maxPage = 0;
        this.offsetBottom = 100;
        this.otype = "all";//综合排序,
        this.cid = "";//选择分类,
        this.minPrice = "";//选择价格区间
        this.maxPrice = "";//选择价格区间,
        this.sParams = "";//选择属性(string)
        this.aParams = [];//选择属性(数组)
    }

    componentDidMount() {
        this.myScroll = new IScroll(this.refs["screen"], {
            scrollX: false,
            scrollY: true,
            preventDefault: false
        });
        let keywords = decodeURIComponent(localParam(this.props.history.location.search).search.keywords);
        //console.log(keywords)
        this.setState({keywords: keywords});
        this.getData(keywords);
        this.getClassifyData();
        this.getParamsData(keywords);
    }

    showSearch() {
        this.setState({displaySearch: {display: "block"}});
    }

    hideSearch() {
        this.setState({displaySearch: {display: "none"}});
    }

    showScreen() {
        this.refs["mask"].addEventListener("touchmove", (e) => {
            e.preventDefault();
        }, false);
        this.refs["screen"].addEventListener("touchmove", (e) => {
            e.preventDefault();
        }, false);
        this.setState({showScreen: true});
    }

    hideScreen() {
        this.setState({showScreen: false});
    }

    goBack() {
        this.props.history.goBack();
    }

    //价格排序
    handleOrder() {
        this.showSales = false;
        if (!this.showOrder) {
            this.showOrder = true;
            this.setState({showOrder: true});
        } else {
            this.showOrder = false;
            this.setState({showOrder: false});
        }
        this.setState({showSales: false});
    }

    //销量排序
    handleSales() {
        this.showOrder = false;
        if (!this.showSales) {
            this.showSales = true;
            this.setState({showSales: true});
        }
        this.setState({showOrder: false});
        this.otype = "sales";
        this.getData(this.state.keywords);
    }

    getData(keywords) {
        console.log(window.base.config.baseUrl + "/home/goods/search?kwords=" + keywords + "&param=" + this.sParams + "&page=1&price1=" + this.minPrice + "&price2=" + this.maxPrice + "&otype=" + this.otype + "&cid=" + this.cid + "&token=" + window.base.config.token);
        request(window.base.config.baseUrl + "/home/goods/search?kwords=" + keywords + "&param=" + this.sParams + "&page=1&price1=" + this.minPrice + "&price2=" + this.maxPrice + "&otype=" + this.otype + "&cid=" + this.cid + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({aGoods: res.data, total: res.pageinfo.total}, () => {
                    lazyImg();
                });
                this.maxPage = res.pageinfo.pagenum;
                this.getScrollPage(keywords);
            } else {
                this.setState({aGoods: [], total: 0});
                this.maxPage = 0;
            }
        })
    }

    getScrollPage(keywords) {
        this.upRefresh = new UpRefresh({
            curPage: this.curPage,
            maxPage: this.maxPage,
            offsetBottom: this.offsetBottom
        }, curPage => {
            request(window.base.config.baseUrl + "/home/goods/search?kwords=" + keywords + "&param=" + this.sParams + "&page=" + curPage + "&price1=" + this.minPrice + "&price2=" + this.maxPrice + "&otype=" + this.otype + "&cid=" + this.cid + "&token=" + window.base.config.token).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        let aGoods = this.state.aGoods;
                        for (let i = 0; i < res.data.length; i++) {
                            aGoods.push(res.data[i]);
                        }
                        this.setState({aGoods: aGoods});
                    }
                    lazyImg();
                }
            })
        })
    }

    checkedItem(index) {
        let aPriceOrder = this.state.aPriceOrder;
        for (let i = 0; i < aPriceOrder.length; i++) {
            if (aPriceOrder[i].checked) {
                aPriceOrder[i].checked = false;
                break;
            }
        }
        aPriceOrder[index].checked = true;
        this.setState({aPriceOrder: aPriceOrder});
        this.otype = aPriceOrder[index].type;
        this.getData(this.state.keywords);
    }

    getChildrenKeywords(val) {
        //console.log(val);
        this.setState({keywords: val});
        this.getData(val);
        this.hideSearch();
        this.getParamsData();
        this.props.history.replace(window.base.config.path + "goods/search?keywords=" + val);
    }

    //获取分类数据
    getClassifyData() {
        request(window.base.config.baseUrl + "/home/category/menu?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                let aClassify = this.state.aClassify;
                aClassify.items = res.data;
                for (let i = 0; i < aClassify.items.length; i++) {
                    aClassify.items[i].checked = false;
                }
                this.setState({aClassify: aClassify}, () => {
                    this.myScroll.refresh();
                });
            } else {
                this.setState({aClassify: {}}, () => {
                    this.myScroll.refresh();
                });
            }
        })
    }

    //分类显示隐藏
    handleClassify() {
        let aClassify = this.state.aClassify;
        aClassify.active = !aClassify.active;
        this.setState({aClassify: aClassify});
    }

    //选择分类
    checkedClassify(index) {
        let aClassify = this.state.aClassify;
        if (aClassify.items.length > 0) {
            for (let i = 0; i < aClassify.items.length; i++) {
                if (i !== index) {
                    aClassify.items[i].checked = false;
                }
            }
            if (aClassify.items[index].checked) {
                aClassify.items[index].checked = false;
                this.cid = "";
            } else {
                aClassify.items[index].checked = true;
                this.cid = aClassify.items[index].cid;
            }
            this.setState({aClassify: aClassify});
        }
    }

    //价格显示隐藏
    handlePrice() {
        let aPrice = this.state.aPrice;
        aPrice.active = !aPrice.active;
        this.setState({aPrice: aPrice});
    }

    //选择价格
    checkedPrice(index) {
        let aPrice = this.state.aPrice;
        let minPrice = "";
        let maxPrice = "";
        if (aPrice.items.length > 0) {
            for (let i = 0; i < aPrice.items.length; i++) {
                if (i !== index) {
                    aPrice.items[i].checked = false;
                }
            }
            if (aPrice.items[index].checked) {
                aPrice.items[index].checked = false;
            } else {
                aPrice.items[index].checked = true;
                minPrice = aPrice.items[index].price1;
                maxPrice = aPrice.items[index].price2;
            }
            //aPrice.items[index].checked = !aPrice.items[index].checked;
            this.minPrice = minPrice;
            this.maxPrice = maxPrice;
            this.setState({aPrice: aPrice, minPrice: minPrice, maxPrice: maxPrice});
        }
    }

    //阻止价格冒泡
    preventBubble(e) {
        e.stopPropagation();
    }

    //获取属性
    getParamsData(keywords) {
        request(window.base.config.baseUrl + "/home/goods/param?kwords=" + keywords + "&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                let aParams = res.data;
                for (let i = 0; i < aParams.length; i++) {
                    aParams[i].active = false;
                    if (aParams[i].param.length > 0) {
                        for (let j = 0; j < aParams[i].param.length; j++) {
                            aParams[i].param[j].checked = false;
                        }
                    }
                }
                this.setState({aParams: aParams}, () => {
                    this.myScroll.refresh();
                });
            } else {
                this.setState({aParams: []}, () => {
                    this.myScroll.refresh();
                });
            }
            //console.log(this.state.aParams)
        })
    }

    //属性参数显示隐藏
    handleParams(index) {
        let aParams = this.state.aParams;
        //console.log(aParams);
        aParams[index].active = !aParams[index].active;
        this.setState({aParams: aParams});
    }

    //选择属性
    checkedParams(index1, index2) {
        let aParams = this.state.aParams;
        //console.log(aParams);
        if (aParams[index1].param[index2].checked) {
            aParams[index1].param[index2].checked = false;
            for (let i = 0; i < this.aParams.length; i++) {
                if (this.aParams[i] === aParams[index1].param[index2].pid) {
                    this.aParams.splice(i--, 1);
                }
            }
        } else {
            aParams[index1].param[index2].checked = true;
            this.aParams.push(aParams[index1].param[index2].pid);
        }
        //console.log(this.aParams);
        this.sParams = this.aParams.length > 0 ? JSON.stringify(this.aParams) : "";
        //console.log(this.sParams)
        this.setState({aParams: aParams});
    }

    //监听最低价格输入
    changeMinPrice(e) {
        this.setState({minPrice: e.target.value.replace(/[^\d]/g, "")}, () => {
            this.minPrice = this.state.minPrice;
        });
    }

    //监听最高价格输入
    changeMaxPrice(e) {
        this.setState({maxPrice: e.target.value.replace(/[^\d]/g, "")}, () => {
            this.maxPrice = this.state.maxPrice;
        });
    }

    //点击确定
    handleSearch() {
        this.getData(this.state.keywords);
        this.hideScreen();
    }

    //全部重置
    handleReset() {
        //console.log(window.base.config.baseUrl + "/home/goods/search?kwords=" + keywords + "&param=" + this.sParams + "&page=1&price1=" + this.minPrice + "&price2=" + this.maxPrice + "&otype=" + this.otype + "&cid=" + this.cid + "&token=" + window.base.config.token)
        this.sParams = "";
        this.minPrice = "";
        this.maxPrice = "";
        this.otype = "all";
        this.cid = "";
        //重置分类
        let aClassify = this.state.aClassify;
        if (aClassify.items.length > 0) {
            for (let i = 0; i < aClassify.items.length; i++) {
                aClassify.items[i].checked = false;
            }
            this.setState({aClassify: aClassify});
        }
        //重置价格
        let aPrice = this.state.aPrice;
        if (aPrice.items.length > 0) {
            for (let i = 0; i < aPrice.items.length; i++) {
                aPrice.items[i].checked = false;
            }
            this.setState({aPrice: aPrice, minPrice: "", maxPrice: ""});
        }
        //重置属性
        let aParams = this.state.aParams;
        for (let i = 0; i < aParams.length; i++) {
            if (aParams[i].param.length > 0) {
                for (let j = 0; j < aParams[i].param.length; j++) {
                    aParams[i].param[j].checked = false;
                }
            }
        }
        this.setState({aParams: aParams});
        //console.log(window.base.config.baseUrl + "/home/goods/search?kwords=" + this.state.keywords + "&param=" + this.sParams + "&page=1&price1=" + this.minPrice + "&price2=" + this.maxPrice + "&otype=" + this.otype + "&cid=" + this.cid + "&token=" + window.base.config.token)
    }

    goPage(url) {
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
                <div className={Css["search-top"]}>
                    <div className={Css["search-header"]}>
                        <div className={Css["back"]} onClick={this.goBack.bind(this)}></div>
                        <div className={Css["search-wrap"]} onClick={this.showSearch.bind(this)}>
                            <div className={Css["search-icon"]}></div>
                            <div className={Css["search-text"]}>{this.state.keywords}</div>
                        </div>
                        <div className={Css["screen-btn"]} onClick={this.showScreen.bind(this)}>筛选</div>
                    </div>
                    <div className={Css["order-main"]}>
                        <div
                            className={this.state.showOrder ? Css["order-item"] + " " + Css["active"] : Css["order-item"]}
                            onClick={this.handleOrder.bind(this)}>
                            <div className={Css["order-text"]}>综合</div>
                            <div className={Css["order-icon"]}></div>
                            <ul className={this.state.showOrder ? Css["order-menu"] : Css["order-menu"] + " hide"}>
                                {
                                    this.state.aPriceOrder.map((item, index) => {
                                        return (
                                            <li className={item.checked ? Css["active"] : ""}
                                                key={index}
                                                onClick={this.checkedItem.bind(this, index)}>{item.title}</li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div
                            className={this.state.showSales ? Css["order-item"] + " " + Css["active"] : Css["order-item"]}
                            onClick={this.handleSales.bind(this)}>
                            <div className={Css["order-text"]}>销量</div>
                        </div>
                    </div>
                </div>
                <div className={Css["goods-main"]}>
                    {
                        this.state.aGoods.length > 0 ? this.state.aGoods.map((item, index) => {
                            return (
                                <div className={Css["goods-list"]} key={index}
                                     onClick={this.goPage.bind(this, "goods/details/item?gid=" + item.gid)}>
                                    <div className={Css["image"]}>
                                        <img src={require("../../../assets/images/common/lazyImg.jpg")}
                                             data-echo={item.image}
                                             alt={item.title}/>
                                    </div>
                                    <div className={Css["goods-content"]}>
                                        <div className={Css["goods-title"]}>{item.title}</div>
                                        <div className={Css["price"]}>￥{item.price}</div>
                                        <div className={Css["sales"]}>销量<React.Fragment>{item.sales}</React.Fragment>件
                                        </div>
                                    </div>
                                </div>
                            )
                        }) : <div className="no-data">没有相关商品！</div>
                    }
                </div>
                <div ref="mask" className={this.state.showScreen ? Css["mask"] : Css["mask"] + " hide"}
                     onClick={this.hideScreen.bind(this)}></div>
                <div ref="screen"
                     className={this.state.showScreen ? Css["screen"] + " " + Css["move"] : Css["screen"] + " " + Css["unmove"]}>
                    <div>
                        <div className={Css["attr-wrap"]}>
                            <div className={Css["attr-title-wrap"]} onClick={this.handleClassify.bind(this)}>
                                <div className={Css["attr-name"]}>分类</div>
                                <div
                                    className={this.state.aClassify.active ? Css["attr-icon"] + " " + Css["up"] : Css["attr-icon"]}></div>
                            </div>
                            <div
                                className={this.state.aClassify.active ? Css["item-wrap"] + " hide" : Css["item-wrap"]}>
                                {
                                    this.state.aClassify.items.length > 0 ? this.state.aClassify.items.map((item, index) => {
                                        return (
                                            <div
                                                className={item.checked ? Css["item"] + " " + Css["active"] : Css["item"]}
                                                key={index}
                                                onClick={this.checkedClassify.bind(this, index)}>{item.title}</div>
                                        )
                                    }) : ""
                                }
                            </div>
                        </div>
                        <div style={{"width": "100%", "height": "1px", "backgroundColor": "rgb(239, 239, 239)"}}></div>
                        <div className={Css["attr-wrap"]}>
                            <div className={Css["attr-title-wrap"]} onClick={this.handlePrice.bind(this)}>
                                <div className={Css["attr-name"]}>价格区间</div>
                                <div className={Css["price-wrap"]}>
                                    <div className={Css["price-input"]}>
                                        <input type="tel" placeholder="最低价" value={this.state.minPrice}
                                               onClick={this.preventBubble.bind(this)}
                                               onChange={this.changeMinPrice.bind(this)}/>
                                    </div>
                                    <div className={Css["price-line"]}></div>
                                    <div className={Css["price-input"]}>
                                        <input type="tel" placeholder="最高价" value={this.state.maxPrice}
                                               onClick={this.preventBubble.bind(this)}
                                               onChange={this.changeMaxPrice.bind(this)}/>
                                    </div>
                                </div>
                                <div
                                    className={this.state.aPrice.active ? Css["attr-icon"] + " " + Css["up"] : Css["attr-icon"]}></div>
                            </div>
                            <div
                                className={this.state.aPrice.active ? Css["item-wrap"] + " hide" : Css["item-wrap"]}>
                                {
                                    this.state.aPrice.items.length > 0 ? this.state.aPrice.items.map((item, index) => {
                                        return (
                                            <div
                                                className={item.checked ? Css["item"] + " " + Css["active"] : Css["item"]}
                                                key={index}
                                                onClick={this.checkedPrice.bind(this, index)}>{item.price1}-{item.price2}</div>
                                        )
                                    }) : ""
                                }
                            </div>
                        </div>
                        <div style={{
                            "width": "100%",
                            "height": "0.3rem",
                            "backgroundColor": "rgb(239, 239, 239)"
                        }}></div>
                        {
                            this.state.aParams.length > 0 ? this.state.aParams.map((item, index) => {
                                return (
                                    <React.Fragment key={index}>
                                        <div className={Css["attr-wrap"]}>
                                            <div className={Css["attr-title-wrap"]}
                                                 onClick={this.handleParams.bind(this, index)}>
                                                <div className={Css["attr-name"]}>{item.title}</div>
                                                <div
                                                    className={this.state.aParams[index].active ? Css["attr-icon"] + " " + Css["up"] : Css["attr-icon"]}></div>
                                            </div>
                                            <div
                                                className={this.state.aParams[index].active ? Css["item-wrap"] + " hide" : Css["item-wrap"]}>
                                                {
                                                    item.param.length > 0 ? item.param.map((item2, index2) => {
                                                        return (
                                                            <div
                                                                className={item2.checked ? Css["item"] + " " + Css["active"] : Css["item"]}
                                                                key={index2}
                                                                onClick={this.checkedParams.bind(this, index, index2)}>{item2.title}</div>
                                                        )
                                                    }) : ""
                                                }
                                            </div>
                                        </div>
                                        <div style={{
                                            "width": "100%",
                                            "height": "1px",
                                            "backgroundColor": "rgb(239, 239, 239)"
                                        }}></div>
                                    </React.Fragment>
                                )
                            }) : ""
                        }
                        <div style={{"width": "100%", "height": "1.2rem"}}></div>
                    </div>
                    <div className={Css["handel-wrap"]}>
                        <div className={Css["item"]}>
                            共<React.Fragment>{this.state.total}</React.Fragment>件
                        </div>
                        <div className={Css["item"] + " " + Css["reset"]} onClick={this.handleReset.bind(this)}>全部重置
                        </div>
                        <div className={Css["item"] + " " + Css["sure"]} onClick={this.handleSearch.bind(this)}>确定</div>
                    </div>
                </div>
                <SearchComponent displaySearch={this.state.displaySearch}
                                 hideSearchPage={this.hideSearch.bind(this)} isLocal={true}
                                 childrenKeywords={this.getChildrenKeywords.bind(this)}
                                 keywords={this.state.keywords}></SearchComponent>
            </div>
        );
    }
}

export default SearchComponentPage