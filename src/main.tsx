import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.ts";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/index.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Provider store={store}>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "9999px",
            },
          }}
        />
        <RouterProvider router={routes} />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>
);
