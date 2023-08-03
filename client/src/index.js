import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import userSlice from "./features/user/userSlice";
import searchReducer from "./features/searchReducer";
import cartReducer from "./features/cart/cartReducer";
import drawerReducer from "./features/drawer_state/drawerReducer";
import couponReducer from "./features/couponReducer";
import CODReducer from "./features/CODReducer";

const store = configureStore({
  reducer: {
    User: userSlice,
    Search: searchReducer,
    Cart: cartReducer,
    Drawer: drawerReducer,
    Coupon: couponReducer,
    COD: CODReducer,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
