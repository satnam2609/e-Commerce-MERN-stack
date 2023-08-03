import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../functions/category";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getCategories().then((res) => {
      setLoading(false);
      setCategories(res.data);
    });
  }, []);

  const showCategories = () =>
    categories.map((category) => (
      <div
        className="col btn btn-outline btn-primary btn-raised btn-lg btn-block m-3"
        key={category._id}
      >
        {" "}
        <Link
          to={`/category/${category.slug}`}
          style={{
            color: "black",
            textDecoration: "none",
          }}
        >
          {category.name}
        </Link>
      </div>
    ));
  return (
    <div className="container">
      <div className="row">
        {loading ? (
          <h4 className="text-warning">...Loading</h4>
        ) : (
          showCategories()
        )}
      </div>
    </div>
  );
};

export default CategoryList;
