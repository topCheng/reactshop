export function addCart(data) {
    return {
        type: "ADDCART",
        data: data
    }
}

//删除商品
export function delItem(data) {
    return {
        type: "DELITEM",
        data: data
    }
}

//选择商品
export function selectItem(data) {
    return {
        type: "SELECTITEM",
        data: data
    }
}

//点击全选
export function allChecked(data) {
    return {
        type: "ALLCHECKED",
        data: data
    }
}

//增加数量
export function incAmount(data) {
    return {
        type: "INCAMOUNT",
        data: data
    }
}

//减少数量
export function decAmount(data) {
    return {
        type: "DECAMOUNT",
        data: data
    }
}

//输入数量
export function inputAmount(data) {
    return {
        type: "INPUTAMOUNT",
        data: data
    }
}

//登出后清空购物车
export function clearCart() {
    return {
        type: "CLEARCART"
    }
}
