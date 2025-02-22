import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./app/store.ts";
import { Provider } from "react-redux";
import { CssBaseline } from "@mui/material";
import { PersistGate } from "redux-persist/integration/react";
import { addInterceptors } from "./utils/axiosAPI.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { GOOGLE_CLIENT_ID } from "./constants.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

addInterceptors(store);

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <CssBaseline />
        <BrowserRouter>
          <ToastContainer />
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>,
);
