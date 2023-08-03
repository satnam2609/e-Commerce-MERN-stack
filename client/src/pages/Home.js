import React, { useEffect, useState } from "react";

import Jumbotron from "../components/cards/Jumbotron";

import NewArrivals from "../components/home/NewArrivals";
import BestSellers from "../components/home/BestSellers";
import CategoryList from "../components/category/categoryList";

const Home = () => {
  // sort, order, limit

  return (
    <>
      <div className="jumbotron text-success h1 font-weight-bold text-center">
        <Jumbotron text={["New Arrivals", "Best Sellers", "Deal of the day"]} />
      </div>

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        New Arrivals
      </h4>
      <NewArrivals />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Best Sellers
      </h4>
      <BestSellers />

      <h4 className="text-center p-3 mt-5 mb-5 display-4 jumbotron">
        Categories
      </h4>
      <CategoryList />
    </>
  );
};

export default Home;
