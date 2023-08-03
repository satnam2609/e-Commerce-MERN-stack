import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";

import {
  getCoupons,
  removeCoupon,
  createCoupon,
} from "../../../functions/coupon";

const CreateCoupon = () => {
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState(Date.now());
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const { user } = useSelector((state) => state.User);

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const loadAllCoupons = () => getCoupons().then((res) => setCoupons(res.data));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const coupon = {
      name,
      expiry,
      discount,
    };

    createCoupon(coupon, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`"${res.data.name}" is created`);
        loadAllCoupons();
      })
      .catch((err) => {
        setLoading(false);
        console.log("create coupon err", err);
      });
  };

  const handleRemove = async (id) => {
    if (window.confirm("Are you sure you want to delete this coupon")) {
      setLoading(true);
      removeCoupon(id, user.token).then((res) => {
        setLoading(false);
        getCoupons()
          .then((res) => {
            setLoading(false);
            setCoupons(res.data);
          })
          .catch((err) => {
            toast.error(err);
          });
        toast.error(`Coupon is removed!`);
      });
    }
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Coupon</h4>
          <form onSubmit={handleSubmit}>
            {/* name */}
            <div className="form-group">
              <label className="text-muted">Name</label>
              <br />
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>

            {/* expiry */}
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={new Date()}
                value={expiry}
                onChange={(date) => setExpiry(date)}
              />
            </div>
            {/* discount */}
            <div className="form-group">
              <label className="text-muted">Discount</label>
              <br />
              <input
                type="number"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                autoFocus
                required
              />
            </div>

            <button className="btn btn-primary   btn-raised ">
              Create Coupon
            </button>
          </form>

          <br />
          <h4>{coupons.length} Coupons</h4>

          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => {
                return (
                  <tr key={coupon._id}>
                    <th>{coupon.name}</th>
                    <th>{new Date(coupon.expiry).toLocaleDateString()}</th>

                    <th>{coupon.discount}%</th>

                    <th>
                      <DeleteOutlined
                        className="text-danger cursor-pointer"
                        onClick={() => handleRemove(coupon._id)}
                      />
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
