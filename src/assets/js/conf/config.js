let devUrl = "/api";//开发环境
let prodUrl = "http://vueshop.glbuys.com/api";//生产环境
export default {
    baseUrl: process.env.NODE_ENV === "production" ? prodUrl : devUrl,
    path: "/",
    token: "1ec949a15fb709370f"
}