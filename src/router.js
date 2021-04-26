/*HashRouter:有#号
BrowserRouter:没有#号
Route：设置路由与组件关联
Switch:只要匹配到一个地址不往下匹配，相当于for循环里面的break
Link:跳转页面，相当于vue里面的router-link
exact :完全匹配路由
Redirect:路由重定向
*/
import React, {lazy, Suspense} from "react"
import {HashRouter as Router, Route, Switch, Redirect} from "react-router-dom"
import {AuthRoute} from "./routes/private";

//V16.6 lazy和suspense
const MainPage = lazy(() => import("./pages/home/main"));
const GoodsClassifyPage = lazy(() => import("./pages/home/goods/classify"));
const GoodsSearchPage = lazy(() => import("./pages/home/goods/search"));
const GoodsDetailsPage = lazy(() => import("./pages/home/goods/details"));
const LoginPage = lazy(() => import("./pages/home/login/index"));
const RegisterPage = lazy(() => import("./pages/home/register/index"));
const OrderPage = lazy(() => import("./pages/home/order/index"));
const OrderResultPage = lazy(() => import("./pages/home/order/result"));
const SelectAddressPage = lazy(() => import("./pages/home/address/index"));
const AddAddressPage = lazy(() => import("./pages/home/address/add"));
const ModifyAddressPage = lazy(() => import("./pages/home/address/modify"));
const ProfilePage = lazy(() => import("./pages/user/profile/index"));
const MyOrderPage = lazy(() => import("./pages/user/myorder/index"));
const Transfer = lazy(() => import("./pages/transfer/index"));//订单页面转接
const OrderDetail = lazy(() => import("./pages/user/myorder/detail"));
const AddReview = lazy(() => import("./pages/user/myorder/add_review"));
const UserAddressIndexPage = lazy(() => import("./pages/user/address/index"));
const UserAddressModifyPage = lazy(() => import("./pages/user/address/modify"));
const UserMobileIndexPage = lazy(() => import("./pages/user/mobile/index"));
const UserModifyPasswordPage = lazy(() => import("./pages/user/modifyPassword/index"));
const UserMyCollectionPage = lazy(() => import("./pages/user/myCollection/index"));

class RouterComponent extends React.Component {
    render() {
        return (
            <React.Fragment>
                <Router>
                    <React.Fragment>
                        <Suspense fallback={<React.Fragment/>}>
                            <Switch>
                                <Route path={window.base.config.path + "home"} component={MainPage}></Route>
                                <Route path={window.base.config.path + "goods/classify"} component={GoodsClassifyPage}/>
                                <Route path={window.base.config.path + "goods/search"}
                                       component={GoodsSearchPage}></Route>
                                <Route path={window.base.config.path + "goods/details"}
                                       component={GoodsDetailsPage}></Route>
                                <Route path={window.base.config.path + "login/index"}
                                       component={LoginPage}></Route>
                                <Route path={window.base.config.path + "register/index"}
                                       component={RegisterPage}></Route>
                                <AuthRoute path={window.base.config.path + "order/index"}
                                           component={OrderPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "order/result"}
                                           component={OrderResultPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "address/index"}
                                           component={SelectAddressPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "address/add"}
                                           component={AddAddressPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "address/modify"}
                                           component={ModifyAddressPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "profile/index"}
                                           component={ProfilePage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "myorder"}
                                           component={MyOrderPage}></AuthRoute>
                                <Route path={window.base.config.path + "transfer"}
                                       component={Transfer}></Route>
                                <AuthRoute path={window.base.config.path + "order/detail"}
                                           component={OrderDetail}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "order/add_review"}
                                           component={AddReview}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "user/address/index"}
                                           component={UserAddressIndexPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "user/address/modify"}
                                           component={UserAddressModifyPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "user/mobile/index"}
                                           component={UserMobileIndexPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "user/modifyPassword/index"}
                                           component={UserModifyPasswordPage}></AuthRoute>
                                <AuthRoute path={window.base.config.path + "user/myCollection/index"}
                                           component={UserMyCollectionPage}></AuthRoute>
                                <Redirect to={window.base.config.path + "home/index"}></Redirect>
                            </Switch>
                        </Suspense>
                    </React.Fragment>
                </Router>
            </React.Fragment>
        );
    }
}

export default RouterComponent