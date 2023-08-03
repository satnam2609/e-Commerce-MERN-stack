import React, { useState, useEffect } from "react";
import UserNav from "../../components/nav/UserNav";
import { getWishList, removeWishList } from "../../functions/users";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
const WishList = () => {
  const dispatch = useDispatch();
  const [wishList, setWishList] = useState([]);
  const { user } = useSelector((state) => state.User);

  useEffect(() => {
    loadWishList();
  }, []);

  const loadWishList = () => {
    getWishList(user.token).then((res) => {
      console.log("WishListArray", res.data);
      setWishList(res.data.wishList);
    });
  };

  const handleRemove = (pId) => {
    removeWishList(user.token, pId).then((res) => {
      if (res.data.ok) {
        console.log("Product removed from the wishList", res.data);
        loadWishList();
      } else {
        console.log("Product removing from the wishList failed");
      }
    });
  };
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="colmd-2">
          <UserNav />
        </div>
        <div className="col">
          <h4>WishList</h4>

          {wishList.map((p) => {
            return (
              <div key={p._id} className="alert alert-secondary">
                <Link to={`/product/${p.slug}`}>{p.title}</Link>
                <span
                  onClick={() => handleRemove(p._id)}
                  className="btn btn-sm float-right"
                >
                  X
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WishList;
