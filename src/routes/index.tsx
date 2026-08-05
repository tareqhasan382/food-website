/* eslint-disable react-refresh/only-export-components */
import { lazy, Suspense } from "react";
import type { ReactNode } from "react";
import { createBrowserRouter } from "react-router-dom";
import PageLoader from "../components/ui/PageLoader";
import RequireAuth from "../components/guards/RequireAuth";
import RequireAdmin from "../components/guards/RequireAdmin";
import GuestOnly from "../components/guards/GuestOnly";

// Lazy-loaded layouts
const UserLayout = lazy(() => import("../layouts/UserLayout"));
const DashboardLayout = lazy(() => import("../layouts/DashboardLayout"));

// Lazy-loaded pages
const HomePage = lazy(() => import("../App"));
const MenuPage = lazy(() => import("../pages/MenuPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const OverviewPage = lazy(() => import("../pages/dashboard/OverviewPage"));
const FoodsPage = lazy(() => import("../pages/dashboard/FoodsPage"));
const FoodFormPage = lazy(() => import("../pages/dashboard/FoodFormPage"));

const withLoader = (node: ReactNode): ReactNode => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

const routes = createBrowserRouter([
  {
    // Public / user layout
    element: withLoader(<UserLayout />),
    children: [
      { index: true, element: withLoader(<HomePage />) },
      { path: "menu", element: withLoader(<MenuPage />) },
      {
        // Requires an authenticated user
        element: <RequireAuth />,
        children: [
          { path: "cart", element: withLoader(<CartPage />) },
        ],
      },
      {
        // Already-logged-in users are redirected away
        element: <GuestOnly />,
        children: [
          { path: "login", element: withLoader(<LoginPage />) },
          { path: "register", element: withLoader(<RegisterPage />) },
        ],
      },
      { path: "*", element: withLoader(<NotFoundPage />) },
    ],
  },
  {
    // Admin-only area
    element: <RequireAdmin />,
    children: [
      {
        path: "dashboard",
        element: withLoader(<DashboardLayout />),
        children: [
          { index: true, element: withLoader(<OverviewPage />) },
          { path: "foods", element: withLoader(<FoodsPage />) },
          { path: "foods/new", element: withLoader(<FoodFormPage />) },
          { path: "foods/edit/:id", element: withLoader(<FoodFormPage />) },
        ],
      },
    ],
  },
]);

export default routes;
