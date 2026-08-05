import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <ToastContainer
          position="top-right"
          autoClose={2500}
          newestOnTop
          closeOnClick
          pauseOnFocusLoss
          pauseOnHover
          theme="light"
        />
        <RouterProvider router={routes} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
