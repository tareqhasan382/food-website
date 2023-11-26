import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Cart from "../components/Cart";
import Login from "../components/Login";
import Register from "../components/Register";
import NotFoud from "../components/NotFoud";
import Home from "../components/Home";
import Dashboard from "../components/Dashboard";
import FromPage from "../components/dashboard/FromPage";
import AllFood from "../components/dashboard/AllFood";
const routes = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <NotFoud />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "/dashboard",
        element: <AllFood />,
      },
      {
        path: "/dashboard/add",
        element: <FromPage />,
      },
    ],
  },
]);
export default routes;
