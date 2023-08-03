import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import ProductCardCheckOut from "../components/cards/ProductCardCheckOut";
import { userCart } from "../functions/users";
import { CODReducerFunc } from "../features/CODReducer";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.Cart);
  const { user } = useSelector((state) => state.User);

  const getTotal = () => {
    return cart.reduce((currentVal, nextVal) => {
      return currentVal + nextVal.count * nextVal.price;
    }, 0);
  };

  const handleSaveToDb = () => {
    //
    alert("save order to db ?");
    userCart(cart, user.token)
      .then((res) => {
        console.log("RES DATA OF USER CART", res.data);
        if (res.data.ok) {
          navigate("/checkout");
        }
      })
      .catch((error) => console.log("CART SAVE ERR", error));
  };

  const handleCashSaveToDb = () => {
    //
    alert("save order to db ?");
    dispatch(CODReducerFunc(true));
    userCart(cart, user.token)
      .then((res) => {
        console.log("RES DATA OF USER CART", res.data);
        if (res.data.ok) {
          navigate("/checkout");
        }
      })
      .catch((error) => console.log("CART SAVE ERR", error));
  };

  const showCartItem = () => {
    return (
      <table className="table table-ordered">
        <thead className="thead-light">
          <tr>
            <th scope="col">Image</th>
            <th scope="col">Title</th>
            <th scope="col">Price</th>
            <th scope="col">Brand</th>
            <th scope="col">Color</th>
            <th scope="col">Count</th>
            <th scope="col">Shippings</th>
            <th scope="col">Remove</th>
          </tr>
        </thead>
        {cart.map((p) => (
          <ProductCardCheckOut key={p._id} p={p} />
        ))}
        <tbody></tbody>
      </table>
    );
  };
  return (
    <div className="container-fluid pt-2">
      <div className="row">
        <div className="col-md-8">
          <h4>Cart/{cart.length} Products</h4>
          {!cart.length ? (
            <p>
              No products in Cart. <Link to={"/shop"}>Continue Shopping</Link>
            </p>
          ) : (
            showCartItem()
          )}
        </div>
        <div className="col-md-4">
          <h4>Order Summary</h4>
          <hr />
          <p>Products</p>
          {cart.map((c, i) => (
            <div key={i}>
              <p>
                {c.title} x {c.count}= ${c.price * c.count}
              </p>
            </div>
          ))}
          <hr />
          Total:<b>${getTotal()}</b>
          <hr />
          {user && user.token ? (
            <>
              <button
                className="btn btn-sm btn-primary mt-2"
                onClick={handleSaveToDb}
                disabled={!cart.length}
              >
                Proceed to checkout
              </button>
              <br />
              <button
                className="btn btn-sm btn-warning mt-2"
                onClick={handleCashSaveToDb}
                disabled={!cart.length}
              >
                Cash on Delivery
              </button>
            </>
          ) : (
            <button
              className="btn btn-sm btn-primary mt-2"
              onClick={() => navigate("/login")}
            >
              Log-in to checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;
