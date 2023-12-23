import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import store from "./store/emojisSlice";

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <CssBaseline />
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
);
