import {createStore, combineReducers} from "redux"
import keywordsReducers from "./historyKeywords"
import cartReducers from "./addCart"
import loginReducers from "./login"
import orderReducers from "./order"

let store = createStore(combineReducers({
    keywords: keywordsReducers,
    cart: cartReducers,
    user: loginReducers,
    order: orderReducers
}));


export default store