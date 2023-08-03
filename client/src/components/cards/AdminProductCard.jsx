import React from "react";
import { Card } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Meta } = Card;

const AdminProductCard = ({ product, handleRemove }) => {
  const { title, description, images, slug } = product;

  const deleteProduct = (slug) => {
    let ans = window.confirm("Are you sure you want to delete product ?");

    if (ans) {
      console.log("send delete request", slug);
    }
  };

  return (
    <Card
      cover={
        <img
          src={images && images.length ? images[1].url : ""}
          style={{
            height: "250px",
            objectFit: "contain",
          }}
          className="p-1 my-2 "
        />
      }
      actions={[
        <Link to={`/admin/products/${slug}`}>
          <EditOutlined className="text-warning" />
        </Link>,
        <DeleteOutlined className="text-danger" onClick={handleRemove} />,
      ]}
    >
      <Meta
        title={title}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
  );
};

export default AdminProductCard;
