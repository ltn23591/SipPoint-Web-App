import { createBrowserRouter } from "react-router";
import { AppLayout } from "@/components/common/AppLayout";
import { ROUTE_PATH } from "@/constants/routePaths";

import LoginView from "@/features/auth/views/LoginView";
import RegisterView from "@/features/auth/views/RegisterView";
import ForgotPasswordView from "@/features/auth/views/ForgotPasswordView";
import LoginSuccessView from "@/features/auth/views/LoginSuccessView";
import VerifyOtpView from "@/features/auth/views/VerifyOtpView";

import WelcomeView from "@/pages/WelcomeView";
import NotFoundView from "@/pages/NotFoundView";

import MenuView from "@/features/menu/views/MenuView";
import CartView from "@/features/cart/views/CartView";
import OrderHistoryView from "@/features/orders/views/OrderHistoryView";
import OrderTrackingView from "@/features/orders/views/OrderTrackingView";

import RewardPointsView from "@/features/rewards/views/RewardPointsView";
import LuckyWheelView from "@/features/rewards/views/LuckyWheelView";
import LuckyWheelDetailView from "@/features/rewards/views/LuckyWheelDetailView";
import MyVouchersView from "@/features/rewards/views/MyVouchersView";

import AccountView from "@/features/profile/views/AccountView";
import EditProfileView from "@/features/profile/views/EditProfileView";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: ROUTE_PATH.HOME,
        element: <WelcomeView />
      },
      { 
        path: ROUTE_PATH.WELCOME, 
        element: <WelcomeView /> 
      },
      { 
        path: ROUTE_PATH.LOGIN, 
        element: <LoginView /> 
      },
      { 
        path: ROUTE_PATH.FORGOT_PASSWORD, 
        element: <ForgotPasswordView /> 
      },
      { 
        path: "/login-success", 
        element: <LoginSuccessView /> 
      },
      { 
        path: ROUTE_PATH.REGISTER,
        element: <RegisterView /> 
      },
      { 
        path: ROUTE_PATH.VERIFY_OTP, 
        element: <VerifyOtpView /> 
      },
      { 
        path: ROUTE_PATH.MENU, 
        element: <MenuView /> 
      },
      { 
        path: ROUTE_PATH.NOT_FOUND, 
        element: <NotFoundView /> 
      },
      {
        path: ROUTE_PATH.REWARDS,
        element: <RewardPointsView />
      },
      {
        path: ROUTE_PATH.ACCOUNT,
        element: <AccountView />
      },
      {
        path: ROUTE_PATH.EDIT_PROFILE,
        element: <EditProfileView />
      },
      {
        path: ROUTE_PATH.VOUCHERS,
        element: <MyVouchersView />
      },
      {
        path: ROUTE_PATH.ORDERS,
        element: <OrderHistoryView />
      },
      {
        path: ROUTE_PATH.ORDER_DETAIL,
        element: <OrderTrackingView />
      },
      {
        path: ROUTE_PATH.ORDER_TRACKING,
        element: <OrderTrackingView />
      },
      {
        path: ROUTE_PATH.LUCKY_WHEEL,
        element: <LuckyWheelView />
      },
      {
        path: ROUTE_PATH.LUCKY_WHEEL_DETAIL,
        element: <LuckyWheelDetailView />
      },
      {
        path: ROUTE_PATH.CART,
        element: <CartView />
      },
    ]
  }
]);
