import React, { useEffect, useState } from "react";
import { Route, Routes, Router, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Register from "./pages/auth/Reigster";
import Login from "./pages/auth/Login";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterComplete from "./pages/auth/RegisterComplete";
import { auth } from "./firebase";
import { UserReducerFunc } from "./features/user/userSlice";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { currentUser } from "./functions/auth";
import History from "./pages/user/History";
import UserRoutes from "./components/routes/UserRoute";
import Password from "./pages/user/Password";
import WishList from "./pages/user/WishList";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRoutes from "./components/routes/AdminRoutes";
import CategoryCreate from "./pages/admin/category/categoryCreate";
import CategoryUpdate from "./pages/admin/category/CategoryUpdate";
import SubCreate from "./pages/admin/sub/SubCreate";
import SubUpdate from "./pages/admin/sub/SubUpdate";
import ProductCreate from "./pages/admin/product/ProductCreate";
import Products from "./pages/admin/product/Products";
import ProductUpdate from "./pages/admin/product/ProductUpdate";
import Product from "./pages/Product";
import CategoryHome from "./pages/category/CategoryHome";
import SubList from "./pages/subs/SubList";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import SideDrawer from "./components/drawer/SideDrawer";
import Checkout from "./pages/Checkout";
import CreateCoupon from "./pages/admin/coupon/CreateCoupon";
import Payment from "./pages/Payment";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        console.log("user", user);
        currentUser(idTokenResult.token)
          .then((res) => {
            dispatch(
              UserReducerFunc({
                name: res.data.email.split("@")[0],
                email: res.data.email,
                token: idTokenResult.token,
                role: res.data.role,
                _id: res.data._id,
              })
            );

            if (user && user.token) {
              if (user.role === "admin") {
                navigate("/admin/dashboard");
              } else {
                navigate("/user/history");
              }
            }
          })
          .catch((error) => console.log(error));

        return () => unsubscribe();
      }
    });
  }, []);
  return (
    <div className="App">
      <Header />
      <SideDrawer />
      <ToastContainer />
      <Routes>
        <Route path="/register/complete" element={<RegisterComplete />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot/password" element={<ForgotPassword />} />
        <Route element={<UserRoutes />}>
          <Route path="/user/history" element={<History />} />
          <Route path="/user/password" element={<Password />} />
          <Route path="/user/wishlist" element={<WishList />} />
        </Route>

        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/category" element={<CategoryCreate />} />
          <Route path="/admin/wishlist" element={<WishList />} />
          <Route path="/admin/category/:slug" element={<CategoryUpdate />} />

          <Route path="/admin/sub-category" element={<SubCreate />} />
          <Route path="/admin/sub-category/:slug" element={<SubUpdate />} />

          <Route path="/admin/product" element={<ProductCreate />} />
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/products/:slug" element={<ProductUpdate />} />
          <Route path="/admin/coupon" element={<CreateCoupon />} />
        </Route>

        <Route path="/product/:slug" element={<Product />} />
        <Route path="/category/:slug" element={<CategoryHome />} />

        <Route path="/sub/:slug" element={<SubList />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </div>
  );
}

export default App;
