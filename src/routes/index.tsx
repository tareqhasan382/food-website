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
const CategoryPage = lazy(() => import("../pages/CategoryPage"));
const HomePage = lazy(() => import("../App"));
const MenuPage = lazy(() => import("../pages/MenuPage"));
const FoodDetailsPage = lazy(() => import("../pages/FoodDetailsPage"));
const CartPage = lazy(() => import("../pages/CartPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const RegisterPage = lazy(() => import("../pages/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("../pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("../pages/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("../pages/VerifyEmailPage"));
const EmailVerifiedPage = lazy(() => import("../pages/EmailVerifiedPage"));
const EmailVerificationFailedPage = lazy(
  () => import("../pages/EmailVerificationFailedPage")
);
const PasswordResetSuccessPage = lazy(
  () => import("../pages/PasswordResetSuccessPage")
);
const ChangePasswordPage = lazy(() => import("../pages/ChangePasswordPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));
const WishlistPage = lazy(() => import("../pages/WishlistPage"));
const CheckoutPage = lazy(() => import("../pages/CheckoutPage"));
const PaymentSuccessPage = lazy(() => import("../pages/PaymentSuccessPage"));
const PaymentFailedPage = lazy(() => import("../pages/PaymentFailedPage"));
const OrderSuccessPage = lazy(() => import("../pages/OrderSuccessPage"));
const OrderHistoryPage = lazy(() => import("../pages/OrderHistoryPage"));
const OrderDetailsPage = lazy(() => import("../pages/OrderDetailsPage"));
const TrackOrderPage = lazy(() => import("../pages/TrackOrderPage"));
const OverviewPage = lazy(() => import("../pages/dashboard/OverviewPage"));
const OrdersPage = lazy(() => import("../pages/dashboard/OrdersPage"));
const FoodsPage = lazy(() => import("../pages/dashboard/FoodsPage"));
const FoodFormPage = lazy(() => import("../pages/dashboard/FoodFormPage"));
const CategoriesPage = lazy(() => import("../pages/dashboard/CategoriesPage"));
const UsersPage = lazy(() => import("../pages/dashboard/UsersPage"));
const CouponsPage = lazy(() => import("../pages/dashboard/CouponsPage"));
const PromotionsPage = lazy(() => import("../pages/dashboard/PromotionsPage"));
const AnalyticsPage = lazy(() => import("../pages/dashboard/AnalyticsPage"));
const ReportsPage = lazy(() => import("../pages/dashboard/ReportsPage"));

const withLoader = (node: ReactNode): ReactNode => (
  <Suspense fallback={<PageLoader />}>{node}</Suspense>
);

const routes = createBrowserRouter([
  {
    // Public / user layout
    element: withLoader(<UserLayout />),
    children: [
      { index: true, element: withLoader(<HomePage />) },
      { path: "categories/:category?", element: withLoader(<CategoryPage />) },
      { path: "menu", element: withLoader(<MenuPage />) },
      { path: "food/:id", element: withLoader(<FoodDetailsPage />) },
      { path: "cart", element: withLoader(<CartPage />) },
      { path: "wishlist", element: withLoader(<WishlistPage />) },
      {
        // Requires an authenticated user
        element: <RequireAuth />,
        children: [
          { path: "change-password", element: withLoader(<ChangePasswordPage />) },
          { path: "checkout", element: withLoader(<CheckoutPage />) },
          { path: "payment/success", element: withLoader(<PaymentSuccessPage />) },
          { path: "payment/failed", element: withLoader(<PaymentFailedPage />) },
          { path: "order-success/:orderId", element: withLoader(<OrderSuccessPage />) },
          { path: "orders", element: withLoader(<OrderHistoryPage />) },
          { path: "orders/:orderId", element: withLoader(<OrderDetailsPage />) },
          { path: "orders/:orderId/track", element: withLoader(<TrackOrderPage />) },
        ],
      },
      {
        // Already-logged-in users are redirected away
        element: <GuestOnly />,
        children: [
          { path: "login", element: withLoader(<LoginPage />) },
          { path: "register", element: withLoader(<RegisterPage />) },
          { path: "forgot-password", element: withLoader(<ForgotPasswordPage />) },
          { path: "reset-password", element: withLoader(<ResetPasswordPage />) },
          { path: "verify-email", element: withLoader(<VerifyEmailPage />) },
        ],
      },
      { path: "email-verified", element: withLoader(<EmailVerifiedPage />) },
      { path: "email-verification-failed", element: withLoader(<EmailVerificationFailedPage />) },
      { path: "password-reset-success", element: withLoader(<PasswordResetSuccessPage />) },
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
          { path: "orders", element: withLoader(<OrdersPage />) },
          { path: "categories", element: withLoader(<CategoriesPage />) },
          { path: "foods", element: withLoader(<FoodsPage />) },
          { path: "foods/new", element: withLoader(<FoodFormPage />) },
          { path: "foods/edit/:id", element: withLoader(<FoodFormPage />) },
          { path: "users", element: withLoader(<UsersPage />) },
          { path: "coupons", element: withLoader(<CouponsPage />) },
          { path: "promotions", element: withLoader(<PromotionsPage />) },
          { path: "analytics", element: withLoader(<AnalyticsPage />) },
          { path: "reports", element: withLoader(<ReportsPage />) },
        ],
      },
    ],
  },
]);

export default routes;
