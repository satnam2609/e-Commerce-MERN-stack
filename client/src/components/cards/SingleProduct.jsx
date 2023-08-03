import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import StarRating from "react-star-ratings";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import ProductListItems from "./ProductListItems";
import RatingModal from "../modal/RatingModal";
import { ShowAverage } from "../../functions/rating";
import { getProductStar } from "../../functions/product";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";
import { addItem } from "../../features/cart/cartReducer";
import { addToWishList } from "../../functions/users";
import { toast } from "react-toastify";
const { TabPane } = Tabs;

const SingleProduct = ({ product }) => {
  const [tooltip, setTooltip] = useState("Click to add");
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.User);
  const { cart } = useSelector((state) => state.Cart);
  const { title, images } = product;

  const handleAddToCart = () => {
    // show tooltip

    //create cart array
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
    }

    setTooltip("Added!");
  };
  console.log("CART=====>>>>>", cart);

  const handleAddToWishList = (e) => {
    e.preventDefault();

    addToWishList(user.token, product._id).then((res) => {
      if (res.data.ok) {
        console.log("Product added to wishlist--->", res.data);
        toast.success(`Added to wishlist`);
      } else {
        console.log(`Failed to set wishlist`, res.data);
        toast.success(`Failed to set wishlist`);
      }
    });
  };

  return (
    <>
      <div className="col-md-5">
        <Carousel autoPlay infiniteLoop showArrows>
          {images &&
            images.map((img) => {
              return <img src={img.url} key={img.public_id} />;
            })}
        </Carousel>

        <Tabs type="card">
          <TabPane tab="description" key={1}>
            {product.description}
          </TabPane>

          <TabPane tab="More" key={2}>
            Contact us on buykaro@gmail.com
          </TabPane>
        </Tabs>
      </div>
      <div
        className="col-md-5 p-3"
        style={{
          borderRadius: "10px",
        }}
      >
        <h1
          className="bg-info text-center pt-1 pb-1"
          style={{
            borderRadius: "6px",
          }}
        >
          {title}
        </h1>

        {product && product.ratings && product.ratings.length > 0 ? (
          ShowAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3"> no ratings yet</div>
        )}

        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-danger" />
                <br />
                Add to cart
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishList}>
              <HeartOutlined className="text-info" />
              <br />
              Add to wishlist
            </a>,
            <RatingModal product={product} />,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
