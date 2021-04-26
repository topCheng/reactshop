import React from "react"
import "./search.css"
import {withRouter} from "react-router"
import {Modal, Toast} from "antd-mobile"
import {request} from "../../assets/js/utils/request";
import {connect} from "react-redux"
import actions from "../../store/actions/index"

//console.log(actions)

class SearchComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHistory: true,
            aHotwords: [],
            keywords: ""
        };
        //console.log(props.state.keywords.keywords);
        //this.aKeywords = props.state.keywords.keywords;
        this.aKeywords = localStorage["keywords"] !== undefined ? JSON.parse(localStorage["keywords"]) : [];
    }

    componentDidMount() {
        //console.log(this.props.displaySearch)
        this.getHotwords();
        if (this.aKeywords.length > 0) {
            this.setState({showHistory: true});
        } else {
            this.setState({showHistory: false});
        }
    }

    getHotwords() {
        request(window.base.config.baseUrl + "/home/public/hotwords?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({aHotwords: res.data});
            } else {
                this.setState({aHotwords: []});
            }
        });
    }

    deleteHistory() {
        Modal.alert('', '确认要删除吗?', [
            {
                text: '取消', onPress: () => {

                }, style: 'default'
            },
            {
                text: '确认', onPress: () => {
                    this.setState({showHistory: false});
                    localStorage.removeItem("keywords");
                    //this.props.dispatch({type: "ADDKEYWORDS", keywords: []});
                    this.props.dispatch(actions.keywords.addHistoryKeywords({keywords: []}));
                }
            },
        ]);
    }

    addHistoryKeywords() {
        let keywords = this.state.keywords || this.props.keywords;
        if (this.refs["keywords"].value.match(/^\s*$/)) {
            Toast.info("请输入宝贝名称", 3);
            return;
        }
        if (this.aKeywords.length > 0) {
            for (let i = 0; i < this.aKeywords.length; i++) {
                if (keywords === this.aKeywords[i]) {
                    this.aKeywords.splice(i--, 2);
                }
            }
        }
        this.aKeywords.unshift(keywords);
        localStorage["keywords"] = JSON.stringify(this.aKeywords);
        this.props.dispatch(actions.keywords.addHistoryKeywords({keywords: this.aKeywords}));
        //console.log(this.props.state.keywords.keywords);
        this.setState({showHistory: true});
        this.goPage("goods/search?keywords=" + keywords, keywords);
    }

    goPage(url, keywords) {
        //console.log(this.props.isLocal);
        if (this.props.isLocal) {
            this.props.childrenKeywords(keywords);
        } else {
            this.props.history.push(window.base.config.path + url);
        }
    }

    /*getDefaultValue() {
        this.defaultValue = this.state.keywords || this.props.keywords;
    }*/
    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div style={this.props.displaySearch} className="page">
                <div className="search-header">
                    <div className={"close"} onClick={this.props.hideSearchPage.bind(this)}></div>
                    <div className="search-wrap">
                        <div className="search-input-wrap">
                            <input type="text" className="search" placeholder="请输入宝贝名称"
                                   defaultValue={this.state.keywords || this.props.keywords}
                                   ref="keywords"
                                   onChange={(e) => {
                                       this.setState({keywords: e.target.value})
                                   }}/>
                        </div>
                        <button type="button" className="search-btn"
                                onClick={this.addHistoryKeywords.bind(this)}></button>
                    </div>
                </div>
                <div className={this.state.showHistory ? "search-main" : "search-main hide"}>
                    <div className="search-title-wrap">
                        <div className="search-title">最近搜索</div>
                        <div className="bin" onClick={this.deleteHistory.bind(this)}></div>
                    </div>
                    <div className="search-keywords-wrap">
                        {
                            this.props.state.keywords.keywords != null ? this.props.state.keywords.keywords.map((item, index) => {
                                return (
                                    <div className="keywords" key={index}
                                         onClick={this.goPage.bind(this, "goods/search?keywords=" + item, item)}>{item}</div>
                                )
                            }) : ""
                        }
                    </div>
                </div>
                <div className="search-main">
                    <div className="search-title-wrap">
                        <div className="search-title">热门搜索</div>
                    </div>
                    <div className="search-keywords-wrap">
                        {
                            this.state.aHotwords != null ?
                                this.state.aHotwords.map((item, index) => {
                                    return (
                                        <div className="keywords" key={index}
                                             onClick={this.goPage.bind(this, "goods/search?keywords=" + item.title, item.title)}>{item.title}</div>
                                    )
                                }) : ""
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(withRouter(SearchComponent))