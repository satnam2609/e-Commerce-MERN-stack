import React from "react";
import ModalImage from "react-modal-image";
import { useDispatch } from "react-redux";
import { addItem } from "../../features/cart/cartReducer";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCardCheckOut = ({ p }) => {
  const dispatch = useDispatch();
  const colors = ["Browm", "Black", "Silver", "White", "Blue"];
  const handleColorChange = (e) => {
    console.log("color changed", e.target.value);
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, index) => {
        if (product._id === p._id) {
          cart[index].color = e.target.value;
        }
      });

      console.log("Cart Updated", cart);
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch(addItem(cart));
    }
  };

  const handleCountChange = (e) => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, index) => {
        if (product._id === p._id) {
          cart[index].count = e.target.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch(addItem(cart));
      console.log("Cart Count Updated", ...cart);
    }
  };

  const handleRemove = (cartProductId) => {
    let cart = [];
    if (typeof window !== "undefined") {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      let newCart = cart.filter((prod) => prod._id !== cartProductId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      dispatch(addItem(newCart));
      console.log("NEW CART", newCart);
    }
  };
  return (
    <tbody>
      <tr>
        <td>
          <div
            style={{
              width: "100px",
              height: "auto",
            }}
          >
            {p.images.length ? (
              <ModalImage small={p.images[0].url} large={p.images[0].url} />
            ) : (
              "No image yet"
            )}
          </div>
        </td>
        <td>{p.title}</td>
        <td>${p.price}</td>
        <td>{p.brand}</td>
        <td>
          <select
            name="color"
            id=""
            onChange={handleColorChange}
            className="form-control"
          >
            {p.color ? <option>{p.color}</option> : <option>Select</option>}
            {colors.map((c) => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </td>
        <td className="text-center ">
          <input
            type="number"
            className="form-control"
            value={p.count}
            onChange={handleCountChange}
            min={1}
          />
        </td>
        <td>
          {p.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td>
          <CloseOutlined
            className="text-danger"
            onClick={() => handleRemove(p._id)}
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardCheckOut;
