import React from "react"
import Css from "../../../assets/css/home/goods/details_review.css";
import {lazyImg, localParam} from "../../../assets/js/utils/utils";
import {request} from "../../../assets/js/utils/request";
import UpRefresh from "../../../assets/js/libs/uprefresh"

class GoodsDetailsReview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gid: props.location.search !== "" ? localParam(props.location.search).search.gid : "",
            reviews: [],
            reviewsTotal: 0
        }
        this.upRefresh = null;
        this.curPage = 1;
        this.maxPage = 0;
        this.offsetBottom = 100;
    }

    componentDidMount() {
        this.getReviews();
    }

    //获取商品评价
    getReviews() {
        request(window.base.config.baseUrl + "/home/reviews/index?gid=" + this.state.gid + "&token=" + window.base.config.token + "&page=1").then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({reviews: res.data, reviewsTotal: res.pageinfo.total}, () => {
                    lazyImg();
                });
                this.maxPage = res.pageinfo.pagenum;
                this.getScrollPage();
            } else {
                this.setState({reviews: [], reviewsTotal: 0});
            }
        });
    }

    getScrollPage() {
        this.upRefresh = new UpRefresh({
            curPage: this.curPage,
            maxPage: this.maxPage,
            offsetBottom: this.offsetBottom
        }, curPage => {
            request(window.base.config.baseUrl + "/home/reviews/index?gid=" + this.state.gid + "&token=" + window.base.config.token + "&page=" + curPage).then(res => {
                //console.log(res);
                if (res.code === 200) {
                    if (res.data.length > 0) {
                        let reviews = this.state.reviews;
                        for (let i = 0; i < res.data.length; i++) {
                            reviews.push(res.data[i]);
                        }
                        this.setState({reviews: reviews},()=>{
                            lazyImg();
                        });
                    }
                }
            })
        })
    }

    componentWillUnmount() {
        this.setState = (state, callback) => {
            return;
        }
    }

    render() {
        return (
            <div className={Css["page"]}>
                <div className={Css["reviews-main"]}>
                    <div className={Css["reviews-title"]}>商品评价(42)</div>
                    <div className={Css["reviews-wrap"]}>
                        {
                            this.state.reviews.length > 0 ? this.state.reviews.map((item, index) => {
                                return (
                                    <div className={Css["reviews-list"]} key={index}>
                                        <div className={Css["uinfo"]}>
                                            <div className={Css["head"]}>
                                                <img data-echo={item.head}
                                                     src={require("../../../assets/images/common/lazyImg.jpg")}
                                                     alt={item.nickname}/>
                                            </div>
                                            <div className={Css["nickname"]}>{item.nickname}</div>
                                        </div>
                                        <div className={Css["reviews-content"]}>{item.content}</div>
                                        <div className={Css["reviews-date"]}>{item.times}</div>
                                    </div>
                                )
                            }) : <div className="no-data">没有任何评价!</div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default GoodsDetailsReview