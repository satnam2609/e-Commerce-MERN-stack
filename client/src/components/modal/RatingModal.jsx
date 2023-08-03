import React, { useState, useEffect } from "react";
import { Button, Modal } from "antd";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { StarOutlined } from "@ant-design/icons";
import StarRating from "react-star-ratings";
import { useNavigate } from "react-router-dom";
import { setProductStar } from "../../functions/product";

const RatingModal = ({ product }) => {
  const { user } = useSelector((state) => state.User);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [star, setStar] = useState(0);

  useEffect(() => {
    if (product.rating && user) {
      let existingRatingObject = product.ratings.find(
        (ele) => ele.postedBy.toString() === user._id.toString()
      );

      existingRatingObject && setStar(existingRatingObject.star);
    }
  }, [product.rating]);
  const handleModal = () => {
    if (user && user.token) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
      navigate("/login");
    }
  };
  return (
    <>
      <div onClick={handleModal}>
        <StarOutlined className="text-success" />
        <br />
        {user ? "Leave rating" : "Login to leave rating"}
      </div>

      <Modal
        title="Leave a rating"
        centered
        visible={modalVisible}
        onOk={() => {
          setModalVisible(false);
          toast.success("Thanks for your review.It will appear soon!");
        }}
        onCancel={() => {
          setModalVisible(false);
        }}
      >
        <StarRating
          numberOfStars={5}
          name={product._id}
          rating={star}
          starRatedColor="green"
          changeRating={(newRating) => {
            setStar(newRating);
            setProductStar(product._id, star, user.token).then((res) => {
              console.log("rating clicked", res.data);
            });
          }}
          starHoverColor="green"
        />
      </Modal>
    </>
  );
};

export default RatingModal;
