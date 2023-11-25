import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Cart from "../components/Cart";
import Login from "../components/Login";
import Register from "../components/Register";
import NotFoud from "../components/NotFoud";
const routes = createBrowserRouter([
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
]);
export default routes;
