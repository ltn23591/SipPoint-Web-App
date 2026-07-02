import { createBrowserRouter } from "react-router";
import { LandingLayout } from "@/components/layout/LandingLayout";
import { ROUTE_PATH } from "@/constants/routePaths";

import Home from "@/pages/home/Home";
import NotFound from "@/pages/NotFound";
import Login from "@/pages/Login";    // Import trang Login
import Register from "@/pages/Register"; // Import trang Register
import VerifyOtp from "@/pages/VerifyOtp"; // Import trang VerifyOtp
import Welcome from "@/pages/Welcome"; // Import trang Welcome

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [{ path: ROUTE_PATH.HOME, element: <Home /> }],
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
    path: ROUTE_PATH.REGISTER, // Đảm bảo bạn đã khai báo REGISTER trong routePaths
    element: <Register /> 
  },
  { 
    path: ROUTE_PATH.VERIFY_OTP, 
    element: <VerifyOtp /> 
  },
  { 
    path: ROUTE_PATH.NOT_FOUND, 
    element: <NotFound /> 
  },
]);
