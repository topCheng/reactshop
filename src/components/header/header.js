import React from "react"
import {withRouter} from "react-router"
import "./header.css"

class SubHeaderComponent extends React.Component {
    constructor() {
        super();
        this.state = {}
    }

    componentDidMount() {

    }

    goBack() {
        //console.log(this.props);
        if (this.props.location.pathname === window.base.config.path + "address/index") {
            this.props.history.replace(window.base.config.path + "order/index");
        } else {
            this.props.history.goBack();
        }
    }

    render() {
        return (
            <div className="sub-header">
                <div className="back" onClick={this.goBack.bind(this)}></div>
                <div className="title">{this.props.title}</div>
                <div
                    className={this.props["right-btn"] !== " " ? "right-btn" : "right-btn hide"} onClick={this.props.click}>{this.props["right-btn"]}</div>
            </div>
        );
    }
}

export default withRouter(SubHeaderComponent)