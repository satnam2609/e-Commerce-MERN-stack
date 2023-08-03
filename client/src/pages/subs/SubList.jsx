import React, { useEffect, useState } from "react";
import { getsubCategory } from "../../functions/subCategory";
import ProductsCard from "../../components/cards/ProductsCard";
import { Link, useParams } from "react-router-dom";

const SubList = () => {
  const { slug } = useParams();
  const [subs, setSubs] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getsubCategory(slug).then((res) => {
      setLoading(false);
      setSubs(res.data.subcategory);
      setProducts(res.data.products);
    });
  }, []);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {loading ? (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron ">
              ...Loading
            </h4>
          ) : (
            <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron ">
              Products in "{subs.name}" sub-category
            </h4>
          )}
        </div>
      </div>

      <div className="row">
        {products.map((prod) => (
          <div className="col" key={prod._id}>
            <ProductsCard product={prod} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubList;
