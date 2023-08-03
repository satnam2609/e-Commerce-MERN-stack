import React, { useEffect, useState } from "react";
import { getProducts, getProductsCount } from "../../functions/product";
import ProductsCard from "../cards/ProductsCard";
import LoadingCard from "../cards/LoadingCard";
import { Pagination } from "antd";

const BestSellers = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsCount, setProductsCount] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, [page]);

  useEffect(() => {
    getProductsCount().then((res) => setProductsCount(res.data));
  }, []);

  const loadAllProducts = () => {
    setLoading(true);
    // sort, order, limit
    getProducts("sold", "desc", page).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  return (
    <>
      <div className="container">
        {loading ? (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <LoadingCard />
              </div>
            ))}
          </div>
        ) : (
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4">
                <ProductsCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-center mt-2 mb-4">
        <Pagination
          current={page}
          total={Math.round((productsCount / 3) * 10)}
          onChange={(value) => setPage(value)}
        />
      </div>
    </>
  );
};

export default BestSellers;
