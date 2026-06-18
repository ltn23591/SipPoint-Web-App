import { createBrowserRouter } from "react-router";

import { LandingLayout } from "@/components/layout/LandingLayout";
import { ROUTE_PATH } from "@/constants/routePaths";

import Home from "@/pages/home/Home";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <LandingLayout />,
    children: [{ path: ROUTE_PATH.HOME, element: <Home /> }],
  },
  { path: ROUTE_PATH.NOT_FOUND, element: <NotFound /> },
]);
