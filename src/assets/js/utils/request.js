/*eslint-disable*/
import axios from "axios"
//import {fetch} from "whatwg-fetch"
import ReactDOM from "react-dom"

let load = ReactDOM.findDOMNode(document.querySelector(".load"));

export function request(url, method = "get", data = {}, config = {}) {
    load.style.display = "block";
    return axiosRequest(url, method, data, config);
    // return fetchRequest(url, method, data);
}

function axiosRequest(url, method, data, config) {
    if (method.toLowerCase() === "post") {
        let params = new URLSearchParams();
        if (data instanceof Object) {
            for (let key in data) {
                params.append(key, data[key]);
            }
            data = params;
        }
    } else if (method.toLowerCase() === "file") {
        method = "post";
        let params = new FormData();
        if (data instanceof Object) {
            for (let key in data) {
                params.append(key, data[key]);
            }
            data = params;
        }
    }
    let axiosConfig = {
        url: url,
        method: method.toLowerCase(),
        data: data
    }
    if (config instanceof Object) {
        for (let key in config) {
            axiosConfig[key] = config[key];
        }
    }
    return axios(axiosConfig).then(res => {
        load.style.display = "none";
        return res.data;
    });
}


// function fetchRequest(url, method, data) {
//     let fetchConfig = {};
//     if (method.toLowerCase() === "post") {
//         fetchConfig["headers"] = {
//             "Content-Type": "application/x-www-form-urlencoded"
//         }
//         if (data instanceof Object) {
//             let body = "";
//             for (let key in data) {
//                 body += "&" + key + "=" + encodeURIComponent(data[key]);
//             }
//             data = body.slice(1);
//         }
//         fetchConfig["body"] = data;
//     } else if (method.toLowerCase() === "file") {
//         method = "post";
//         let param = new FormData();
//         if (data instanceof Object) {
//             for (let key in data) {
//                 param.append(key, data[key]);
//             }
//             data = param;
//         }
//         fetchConfig["body"] = data;
//     }
//     fetchConfig["method"] = method;
//     return fetch(url, fetchConfig).then(res => res.json());
// }
