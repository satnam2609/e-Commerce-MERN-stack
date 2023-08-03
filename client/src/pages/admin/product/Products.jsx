import React, { useState, useEffect } from "react";
import AdminProductCard from "../../../components/cards/AdminProductCard";
import AdminNav from "../../../components/nav/AdminNav";
import { getProductsByCount, removeProduct } from "../../../functions/product";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.User);

  useEffect(() => {
    loadAllproducts();
  }, []);

  const loadAllproducts = () => {
    setLoading(true);
    getProductsByCount(100)
      .then((res) => {
        setLoading(false);
        setProducts(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  const deleteProduct = (slug) => {
    if (window.confirm("Are you sure you want to delete product ?")) {
      setLoading(true);
      removeProduct(user.token, slug)
        .then((res) => {
          setLoading(false);
          console.log(res);
          loadAllproducts();
          toast.success(`${res.data.title} is deleted...`);
        })
        .catch((err) => {
          toast.error(err.message);
          setLoading(false);
          console.log(err);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <AdminNav />
        </div>
        {loading ? (
          <h2>Loading...</h2>
        ) : (
          <h2
            style={{
              display: "block",
            }}
          ></h2>
        )}
        <div className="col">
          <div className="row">
            {products.map((prod) => {
              return (
                <div className="col-md-4 pb-4" key={prod._id}>
                  <AdminProductCard
                    product={prod}
                    handleRemove={() => deleteProduct(prod.slug)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
