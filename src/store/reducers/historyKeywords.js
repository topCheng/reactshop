let aKeywords = localStorage["keywords"] !== undefined ? JSON.parse(localStorage["keywords"]) : []

function keywordsReducers(state = {keywords: aKeywords}, action) {
    //console.log(action);
    switch (action.type) {
        case "ADDKEYWORDS":
            //console.log(Object.assign({}, state, action.data))
            return Object.assign({}, state, action.data);
            break;
        default:
            return state;
    }
}

export default keywordsReducers