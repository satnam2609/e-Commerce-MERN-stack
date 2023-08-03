import React, { useState } from "react";
import { Card, Skeleton, Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { ShowAverage } from "../../functions/rating";
import _ from "lodash";
import { addItem } from "../../features/cart/cartReducer";
import { useDispatch, useSelector } from "react-redux";
import { stateChange } from "../../features/drawer_state/drawerReducer";

const { Meta } = Card;

const ProductsCard = ({ product }) => {
  const { cart } = useSelector((state) => state.Cart);
  const dispatch = useDispatch();
  const { title, description, images, slug, price } = product;
  const [tooltip, setTooltip] = useState("Click to add");

  const handleAddToCart = () => {
    if (product.quantity < 1) {
      return;
    }

    //create cart array
    else {
      let cart = [];
      if (typeof window !== "undefined") {
        if (localStorage.getItem("cart")) {
          cart = JSON.parse(localStorage.getItem("cart"));
        }
        // push new product to cart
        cart.push({
          ...product,
          count: 1,
        });
        // remove duplicates
        let unique = _.uniqWith(cart, _.isEqual);
        // save to the localstorage
        localStorage.setItem("cart", JSON.stringify(unique));
        dispatch(addItem(unique));
        dispatch(stateChange());
      }

      setTooltip("Added!");
    }
  };
  return (
    <>
      {product && product.ratings && product.ratings.length > 0 ? (
        ShowAverage(product)
      ) : (
        <div className="text-center pt-1 pb-3"> no ratings yet</div>
      )}
      <Card
        cover={
          <img
            src={images && images.length ? images[1].url : ""}
            style={{
              height: "250px",
              objectFit: "contain",
            }}
            className="p-1 my-2 card_class"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" />
            <br />
            View Product
          </Link>,
          <Tooltip title={tooltip}>
            <a onClick={handleAddToCart} disabled={product.quantity < 1}>
              <ShoppingCartOutlined className="text-danger" disabled={true} />
              <br />
              {product.quantity < 1 ? "Out of Stock" : "Add to cart"}
            </a>
          </Tooltip>,
        ]}
      >
        <Meta
          title={`${title}-$${price}`}
          description={`${description && description.substring(0, 40)}...`}
        />
      </Card>
    </>
  );
};

export default ProductsCard;
