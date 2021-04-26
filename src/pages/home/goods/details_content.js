import React from "react"
import Css from "../../../assets/css/home/goods/details_content.css"
import {request} from "../../../assets/js/utils/request";
import {localParam} from "../../../assets/js/utils/utils";

class GoodsDetailsContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gid: props.location.search !== "" ? localParam(props.location.search).search.gid : "",
            bodys: ""
        }
    }

    componentDidMount() {
        this.getBodys();
    }

    getBodys() {
        request(window.base.config.baseUrl + "/home/goods/info?gid=" + this.state.gid + "&type=details&token=" + window.base.config.token).then(res => {
            //console.log(res);
            if (res.code === 200) {
                this.setState({bodys: res.data.bodys});
            } else {
                this.setState({bodys: ""});
            }
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
                <div className={Css["content"]} dangerouslySetInnerHTML={{__html: this.state.bodys}}></div>
            </div>
        );
    }
}

export default GoodsDetailsContent