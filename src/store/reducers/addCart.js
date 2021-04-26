let cartData = {
    aCartData: localStorage["cartData"] !== undefined ? JSON.parse(localStorage["cartData"]) : [],
    totalPrice: localStorage["totalPrice"] !== undefined ? localStorage["totalPrice"] : 0,
    freight: localStorage["freight"] !== undefined ? localStorage["freight"] : 0
}

function cartReducer(state = cartData, action) {
    //console.log(state, action);
    switch (action.type) {
        case "ADDCART":
            addCart(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "DELITEM":
            delItem(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "SELECTITEM":
            selectItem(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "ALLCHECKED":
            allChecked(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "INCAMOUNT":
            incAmount(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "DECAMOUNT":
            decAmount(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "INPUTAMOUNT":
            inputAmount(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        case "CLEARCART":
            clearCart(state, action.data);
            return Object.assign({}, state, action.data);
            break;
        default:
            return state;
    }
}

//添加商品到购物车
function addCart(state, action) {
    //console.log(state, action);
    let bSameGoods = false;
    if (state.aCartData.length > 0) {
        for (let key in state.aCartData) {
            if (state.aCartData[key].gid === action.gid && JSON.stringify(state.aCartData[key].attrs) === JSON.stringify(action.attrs)) {
                state.aCartData[key].amount += 1;
                bSameGoods = true;
                break;
            }
        }
    }
    if (!bSameGoods) {
        state.aCartData.push(action);
    }
    localStorage["cartData"] = JSON.stringify(state.aCartData);
    setTotalPrice(state);
}

//删除商品
function delItem(state, action) {
    if (state.aCartData.length > 0) {
        state.aCartData.splice(action.index, 1);
        localStorage["cartData"] = JSON.stringify(state.aCartData);
        setTotalPrice(state);
        setFreight(state);
    }
}

//计算总价
function setTotalPrice(state) {
    let totalPrice = 0;
    for (let key in state.aCartData) {
        if (state.aCartData[key].checked) {
            totalPrice += parseInt(state.aCartData[key].amount) * parseFloat(state.aCartData[key].price);
        }
    }
    state.totalPrice = parseFloat(totalPrice.toFixed(2));
    localStorage["totalPrice"] = state.totalPrice;
}

//计算运费
function setFreight(state, action) {
    let aFreight = [];
    if (state.aCartData.length > 0) {
        for (let key in state.aCartData) {
            if (state.aCartData[key].checked) {
                aFreight.push(state.aCartData[key].freight);
            }
        }
        state.freight = Math.max.apply(null, aFreight);
        localStorage["freight"] = state.freight;
    }
}

//选择商品
function selectItem(state, action) {
    state.aCartData[action.index].checked = action.checked;
    //console.log(state.aCartData[action.index].checked)
    setTotalPrice(state);
    setFreight(state);
    localStorage["cartData"] = JSON.stringify(state.aCartData);
}

//点击全选
function allChecked(state, action) {
    /*if (action.checked) {
        for (let key in state.aCartData) {
            state.aCartData[key].checked = true;
        }
    } else {
        for (let key in state.aCartData) {
            state.aCartData[key].checked = false;
        }
    }*/
    for (let key in state.aCartData) {
        state.aCartData[key].checked = action.checked;
    }
    setTotalPrice(state);
    setFreight(state);
    localStorage["cartData"] = JSON.stringify(state.aCartData);
}

//增加数量
function incAmount(state, action) {
    state.aCartData[action.index].amount += 1;
    //console.log(state.aCartData[action.index].amount)
    setTotalPrice(state);
    localStorage["cartData"] = JSON.stringify(state.aCartData);
}

//减少数量
function decAmount(state, action) {
    state.aCartData[action.index].amount -= 1;
    if (state.aCartData[action.index].amount <= 1) {
        state.aCartData[action.index].amount = 1;
    }
    setTotalPrice(state);
    localStorage["cartData"] = JSON.stringify(state.aCartData);
}

//输入数量
function inputAmount(state, action) {
    state.aCartData[action.index].amount = action.amount;
    setTotalPrice(state);
    localStorage["cartData"] = JSON.stringify(state.aCartData);
}

//清空购物车
function clearCart(state, action) {
    localStorage.removeItem("cartData");
    localStorage.removeItem("totalPrice");
    localStorage.removeItem("freight");
    state.aCartData = [];
    state.totalPrice = 0;
    state.freight = 0;
}

export default cartReducer