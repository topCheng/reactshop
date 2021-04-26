let defaultState = {
    uid: localStorage["uid"] !== undefined ? localStorage["uid"] : "",
    nickname: localStorage["nickname"] !== undefined ? localStorage["nickname"] : "",
    auth_token: localStorage["auth_token"] !== undefined ? localStorage["auth_token"] : "",
    isLogin: localStorage["isLogin"] !== undefined ? Boolean(localStorage["isLogin"]) : false
}

function loginReducers(state = defaultState, action) {
    //console.log(action);
    switch (action.type) {
        case "LOGIN":
            state.uid = action.uid;
            state.nickname = action.nickname;
            state.auth_token = action.auth_token;
            state.isLogin = action.isLogin;
            return Object.assign({}, state, action.data);
            break;
        case "LOGOUT":
            localStorage.removeItem("uid");
            localStorage.removeItem("nickname");
            localStorage.removeItem("auth_token");
            localStorage.removeItem("isLogin");
            sessionStorage.removeItem("aid");//address id
            localStorage.removeItem("aid");//默认 address id
            state.uid = "";
            state.nickname = "";
            state.auth_token = "";
            state.isLogin = false;
            return Object.assign({}, state, action.data);
            break;
        default:
            return state;
    }
}

export default loginReducers