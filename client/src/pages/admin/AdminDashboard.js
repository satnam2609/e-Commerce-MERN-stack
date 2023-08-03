import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AdminNav from "../../components/nav/AdminNav";
import { allOrders, changeStatus } from "../../functions/admin";
import { toast } from "react-toastify";
import Orders from "../../components/order/Orders";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useSelector((state) => state.User);

  useEffect(() => {
    loadAllOrdres();
  }, []);
  const loadAllOrdres = () => {
    allOrders(user.token).then((res) => {
      console.log("Orders", res.data);
      setOrders(res.data);
    });
  };

  const handleStatusChange = (orderId, orderStatus) => {
    changeStatus(user.token, orderStatus, orderId).then((res) => {
      console.log("updated order--->", res.data);
      toast.success("Status updated");
      loadAllOrdres();
    });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <AdminNav />
        </div>

        <div className="col-md-10">
          <p>AdminDashboard</p>
          <Orders orders={orders} handleStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
