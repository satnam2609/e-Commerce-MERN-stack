import React, { useState } from "react";
import { Menu, Badge } from "antd";
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  UserAddOutlined,
  ShopOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import Search from "../forms/Search";
import firebase from "firebase/compat/app";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { UserReducerFunc } from "../../features/user/userSlice";

const { SubMenu, Item } = Menu;

const Header = () => {
  const [current, setCurrent] = useState("home");
  let dispatch = useDispatch();

  const { cart } = useSelector((state) => state.Cart);
  const { user } = useSelector((state) => state.User);
  console.log(user);
  const navigate = useNavigate();
  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logOut = () => {
    firebase.auth().signOut();
    dispatch(UserReducerFunc(null));
  };

  return (
    <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to={"/"}>Home</Link>
      </Item>

      <Item key="shop" icon={<ShoppingOutlined />}>
        <Link to={"/shop"}>Shop</Link>
      </Item>

      <Item key="cart" icon={<ShoppingCartOutlined />}>
        <Link to={"/cart"}>
          <Badge count={cart.length} color="green" offset={[9, 0]}>
            Cart
          </Badge>
        </Link>
      </Item>
      {!user && (
        <Item key="register" icon={<UserAddOutlined />} className="float-right">
          <Link to="/register">Register</Link>
        </Item>
      )}

      {!user && (
        <Item key="login" icon={<UserOutlined />} className="float-right">
          <Link to={"/login"}>Login</Link>
        </Item>
      )}

      {user && (
        <SubMenu
          icon={<SettingOutlined />}
          title={user.name}
          className="float-right"
        >
          {user && user.role === "subscriber" && (
            <Item key={"Dashboard"} onClick={() => navigate("/user/history")}>
              Dashboard
            </Item>
          )}
          {user && user.role === "admin" && (
            <Item
              key={"Dashboard"}
              onClick={() => navigate("/admin/dashboard")}
            >
              Dashboard
            </Item>
          )}

          <Item
            icon={<LogoutOutlined />}
            onClick={() => {
              navigate("/login");
              logOut();
            }}
          >
            Logout
          </Item>
        </SubMenu>
      )}

      <span className="float-right p-1">
        <Search />
      </span>
    </Menu>
  );
};

export default Header;
