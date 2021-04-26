function orderReducers(state = {}, action) {
    switch (action.type) {
        case "ORDER":
            return Object.assign({}, state.action.data);
            break;
        default:
            return state;
            break;
    }
}
export default orderReducers