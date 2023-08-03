import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/users";
import { removeItem } from "../features/cart/cartReducer";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { couponApplied } from "../features/couponReducer";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.User);
  const { isCoupon } = useSelector((state) => state.Coupon);
  const { isCOD } = useSelector((state) => state.COD);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [coupon, setCoupon] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);

  // discount
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      console.log("User cart-->", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);

  const emptyCart = () => {
    // remove local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart");
    }

    // remove from redux
    dispatch(removeItem([]));
    // remove from backend
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Cart is successfully emptyed");
    });
  };

  const saveAddressToDb = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success(`Address saved!`);
      }
    });
  };

  const createCashOrder = () => {
    // user token
    createCashOrderForUser(user.token, isCOD).then((res) => {
      console.log("User cash order created", res.data);
      // empty redux cart ,local Storage, reset coupon and reset COD and redirect to history page
    });
  };
  const showAddress = () => {
    return (
      <>
        <ReactQuill theme="snow" value={address} onChange={setAddress} />
        <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
          Save
        </button>
      </>
    );
  };

  const productSummary = () => {
    return (
      <>
        {products.map((p, i) => (
          <div key={i}>
            <p>
              {p.product.title} ({p.color}) x {p.count} ={" "}
              {p.product.price * p.count}
            </p>
          </div>
        ))}
      </>
    );
  };

  const applyDiscountCoupon = () => {
    // apply coupon
    applyCoupon(user.token, coupon).then((res) => {
      console.log("RES On Coupon Applied", res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        dispatch(couponApplied(true));
      }
      if (res.data.err) {
        setDiscountError(res.data.err);
        dispatch(couponApplied(false));
      }
    });
  };

  const showApplyCoupon = () => {
    return (
      <>
        <input
          type="text"
          className="form-control"
          onChange={(e) => {
            setCoupon(e.target.value);
            setDiscountError("");
          }}
          value={coupon}
        />
        <button
          className="btn btn-primary btn-raised mt-2 ml-3"
          onClick={applyDiscountCoupon}
        >
          Apply
        </button>
      </>
    );
  };
  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        {showAddress()}
        <br />
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        coupon input and apply button
        {showApplyCoupon()}
        <br />
        {discountError && <p className="text-danger">{discountError}</p>}
      </div>

      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {productSummary()}
        <hr />
        <p>Cart Total: {total}</p>

        {totalAfterDiscount > 0 && (
          <p className="bg-success p-2">
            Discount applied : Total payable :${totalAfterDiscount}
          </p>
        )}

        <div className="row">
          <div className="col-md-6">
            {isCOD ? (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                className="btn btn-primary"
                disabled={!addressSaved || !products.length}
                onClick={() => navigate(`/payment`)}
              >
                Place Order
              </button>
            )}
          </div>

          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-primary"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
