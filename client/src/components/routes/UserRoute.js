import React from "react";
import { Route, Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";

const UserRoutes = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.User);

  if (user && user.token) {
    return <Outlet />;
  } else {
    return <LoadingToRedirect />;
  }
};

export default UserRoutes;
