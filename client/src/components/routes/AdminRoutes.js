import React, { useEffect, useState } from "react";
import { Route, Link, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import LoadingToRedirect from "./LoadingToRedirect";
import { currentAdmin } from "../../functions/auth";

const AdminRoutes = ({ children, ...rest }) => {
  const { user } = useSelector((state) => state.User);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (user && user.token) {
      currentAdmin(user.token)
        .then((res) => {
          console.log("CURRENT ADMIN RESPONSE", res);
          setOk(true);
        })
        .catch((error) => {
          console.log("ADMIN ROUTE ERROR", error);
        });
    }
  }, [user]);

  if (ok) {
    return <Outlet />;
  } else {
    return <LoadingToRedirect />;
  }
};

export default AdminRoutes;
