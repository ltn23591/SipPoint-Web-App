import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/components/common/AppLayout";
import { ROUTE_PATH } from "@/constants/routePaths";

import Login from "@/pages/Login";    // Import trang Login
import Register from "@/pages/Register"; // Import trang Register
import LoginSuccess from "@/pages/LoginSuccess"; // Import trang LoginSuccess
import VerifyOtp from "@/pages/VerifyOtp"; // Import trang VerifyOtp
import Welcome from "@/pages/Welcome"; // Import trang Welcome
import Menu from "@/pages/Menu"; // Import trang Menu
import RewardPoints from "@/pages/RewardPoints"; // Import trang RewardPoints
import Account from "@/pages/Account";
import EditProfile from "@/pages/EditProfile";
import MyVouchers from "@/pages/MyVouchers";
import OrderTracking from "@/pages/OrderTracking";
import OrderHistory from "@/pages/OrderHistory";
import LuckyWheel from "@/pages/LuckyWheel";
import Cart from "@/pages/Cart";
import NotFound from "@/pages/NotFound";



export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTE_PATH.HOME,
        element: <Welcome />
      },
      { 
        path: ROUTE_PATH.WELCOME, 
        element: <Welcome /> 
      },
      { 
        path: ROUTE_PATH.LOGIN, 
        element: <Login /> 
      },
      { 
        path: "/login-success", 
        element: <LoginSuccess /> 
      },
      { 
        path: ROUTE_PATH.REGISTER,
        element: <Register /> 
      },
      { 
        path: ROUTE_PATH.VERIFY_OTP, 
        element: <VerifyOtp /> 
      },
      { 
        path: ROUTE_PATH.MENU, 
        element: <Menu /> 
      },
      { 
        path: ROUTE_PATH.NOT_FOUND, 
        element: <NotFound /> 
      },
      {
        path: ROUTE_PATH.REWARDS,
        element: <RewardPoints />
      },
      {
        path: ROUTE_PATH.ACCOUNT,
        element: <Account />
      },
      {
        path: ROUTE_PATH.EDIT_PROFILE,
        element: <EditProfile />
      },
      {
        path: ROUTE_PATH.VOUCHERS,
        element: <MyVouchers />
      },
      {
        path: ROUTE_PATH.ORDERS,
        element: <OrderHistory />
      },
      {
        path: ROUTE_PATH.ORDER_DETAIL,
        element: <OrderTracking />
      },
      {
        path: ROUTE_PATH.ORDER_TRACKING,
        element: <OrderTracking />
      },
      {
        path: ROUTE_PATH.LUCKY_WHEEL,
        element: <LuckyWheel />
      },
      {
        path: ROUTE_PATH.CART,
        element: <Cart />
      },
    ]
  }
]);

