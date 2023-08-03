import React, { useEffect, useState } from "react";
import { getProduct } from "../functions/product";
import { useParams } from "react-router-dom";
import SingleProduct from "../components/cards/SingleProduct";
import { getRelated } from "../functions/product";
import { useSelector } from "react-redux";
import ProductCard from "../components/cards/ProductsCard";

const Product = () => {
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState([]);

  const { slug } = useParams();

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  const loadSingleProduct = () => {
    setLoading(true);
    getProduct(slug)
      .then((res) => {
        setLoading(false);
        setProduct(res.data[0]);
        console.log("PRODUCT ID ", res.data[0]._id);
        getRelated(res.data[0]._id).then((res) => {
          setRelated(res.data);
        });
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  };

  return (
    <div className="container-fluid  ">
      <div className="row pt-4">
        <SingleProduct product={product} />
      </div>

      <div className="row  ">
        <div className="col text-center pt-5 pb-5">
          <hr />
          Related Products
          <hr />
        </div>
      </div>

      <div className="row pb-5">
        {related.length ? (
          related.map((prod) => {
            return (
              <div key={prod._id} className="col-md-4">
                <ProductCard product={prod} />
              </div>
            );
          })
        ) : (
          <div className="danger col">No Products Found</div>
        )}
      </div>
    </div>
  );
};

export default Product;
