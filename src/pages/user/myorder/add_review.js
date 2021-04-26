import React from "react"
import {connect} from "react-redux"
import SubHeaderComponent from "../../../components/header/header"
import Css from "../../../assets/css/user/myorder/add_review.css"
import {request} from "../../../assets/js/utils/request";
import {safeAuth, localParam} from "../../../assets/js/utils/utils";
import {Toast} from "antd-mobile"

class ReviewComponent extends React.Component {
    constructor(props) {
        super(props);
        safeAuth(props);
        this.state = {
            gid: props.location.search ? localParam(props.location.search).search.gid : "",
            ordernum: props.location.search ? localParam(props.location.search).search.ordernum : "",
            service: [],
            content: ""
        }
        this.isSubmit = true;
    }

    componentDidMount() {
        //console.log(localParam(this.props.location.search).search.gid)
        this.getService();
    }

    //评价项目选项
    getService() {
        request(window.base.config.baseUrl + "/home/reviews/service?token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                let service = res.data;
                for (let i = 0; i < service.length; i++) {
                    service[i].scores = [{
                        "checked": false,
                        "score": 1
                    }, {
                        "checked": false,
                        "score": 2
                    }, {
                        "checked": false,
                        "score": 3
                    }, {
                        "checked": false,
                        "score": 4
                    }, {
                        "checked": false,
                        "score": 5
                    }]
                }
                //console.log(service)
                this.setState({service: service});
            }
        });
    }

    //评价
    checkedScore(index, index2) {
        let service = this.state.service;
        //console.log(service)
        if (service.length > 0) {
            for (let i = 0; i < service[index].scores.length; i++) {
                service[index].scores[i].checked = false;
            }
            for (let i = 0; i <= index2; i++) {
                service[index].scores[i].checked = true;
            }
            this.setState({service: service});
        }
    }

    //提交评价
    submitReview() {
        if (this.isSubmit) {
            this.isSubmit = false;
            let service = this.state.service;
            let checkedFlag = false;
            for (let i = 0; i < service.length; i++) {
                checkedFlag = false;
                for (let j = 0; j < service[i].scores.length; j++) {
                    if (service[i].scores[j].checked) {
                        checkedFlag = true;
                        break;
                    }
                }
                if (!checkedFlag) {
                    Toast.info("请评级" + service[i].title, 2, () => {
                        this.isSubmit = true;
                    });
                    return;
                }
            }
            if (this.state.content.match(/^\s*$/)) {
                Toast.info("请分享你的消费感受", 2, () => {
                    this.isSubmit = true;
                });
                return;
            }
            //提交评价
            let rsdata = [], scores = [], score = 0;
            for (let i = 0; i < service.length; i++) {
                scores = [];
                for (let j = 0; j < service[i].scores.length; j++) {
                    if (service[i].scores[j].checked) {
                        scores.push(service[i].scores[j].score);
                    }
                }
                score = scores[scores.length - 1];
                //console.log(score);
                rsdata.push({
                    gid: this.state.gid,
                    myid: this.props.state.user.uid,
                    rsid: service[i].rsid,
                    score: score
                })
            }
            //console.log(rsdata)
            request(window.base.config.baseUrl + "/home/reviews/add?token=" + window.base.config.token, "post", {
                uid: this.props.state.user.uid,
                gid: this.state.gid,
                content: this.state.content,
                ordernum: this.state.ordernum,
                rsdata: JSON.stringify(rsdata)
            }).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    Toast.info(res.data, 2, () => {
                        this.props.history.goBack();
                    });
                } else {
                    Toast.info(res.data, 2, () => {
                        this.isSubmit = true;
                    });
                }
            })
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
                <SubHeaderComponent title="评价"></SubHeaderComponent>
                <div className={Css["main"]}>
                    {
                        this.state.service.length > 0 ? this.state.service.map((item, index) => {
                            return (
                                <ul className={Css["service"]} key={index}>
                                    <li>{item.title}</li>
                                    <li>
                                        {
                                            item.scores.length > 0 ? item.scores.map((item2, index2) => {
                                                return (
                                                    <div
                                                        className={item2.checked ? Css["stars"] + " " + Css["active"] : Css["stars"]}
                                                        key={index2}
                                                        onClick={this.checkedScore.bind(this, index, index2)}></div>
                                                )
                                            }) : ""
                                        }
                                    </li>
                                </ul>
                            )
                        }) : ""
                    }
                    <div className={Css["content-wrap"]}><textarea placeholder="来分享你的消费感受吧!" onChange={(e) => {
                        this.setState({content: e.target.value})
                    }}></textarea></div>
                    <button className={Css["submit"]} type="button" onClick={this.submitReview.bind(this)}>提交</button>
                </div>
            </div>
        );
    }
}

export default connect((state) => {
    return {
        state: state
    }
})(ReviewComponent)