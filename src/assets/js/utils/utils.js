import echo from "../libs/echo"
import {request} from "./request";
import actions from "../../../store/actions";

export function localParam(search, hash) {
    search = search || window.location.search;
    hash = hash || window.location.hash;
    var fn = function (str, reg) {
        if (str) {
            var data = {};
            str.replace(reg, function ($0, $1, $2, $3) {
                data[$1] = $3;
            });
            return data;
        }
    };
    return {
        search: fn(search, new RegExp("([^?=&]+)(=([^&]*))?", "g")) || {},
        hash: fn(hash, new RegExp("([^#=&]+)(=([^&]*))?", "g")) || {}
    };
}

export function setScrollTop(val = 0) {
    setTimeout(() => {
        document.documentElement.scrollTop = val;
        document.body.scrollTop = val;
    }, 300);
}


export function lazyImg() {
    echo.init({
        offset: 100,//离可视区域多少像素的图片可以被加载
        throttle: 0 //图片延迟多少毫秒加载
    });
}

//会员登录认证接口
export function safeAuth(props) {
    request(window.base.config.baseUrl + "/home/user/safe?token=" + window.base.config.token, "post", {
        uid: props.state.user.uid,
        auth_token: props.state.user.auth_token
    }).then(res => {
        //console.log(res);
        if (res.code !== 200) {
            props.dispatch(actions.user.logout());
            props.dispatch(actions.cart.clearCart());
            props.history.replace(window.base.config.path + "login/index");
        }
    })
}
