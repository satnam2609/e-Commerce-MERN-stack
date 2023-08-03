import React from "react";
import StarRating from "react-star-ratings";

export const ShowAverage = (p) => {
  if (p && p.ratings) {
    let ratingsArray = p && p.ratings;
    let total = [];
    let length = ratingsArray.length;

    ratingsArray.map((r) => {
      total.push(r.star);
    });

    let totalReduced = total.reduce((p, n) => p + n, 0);

    let height = length * 5;

    let result = (totalReduced * 5) / height;

    return (
      <div className="text-center pb-3 pt-1">
        <span>
          <StarRating
            rating={result}
            starRatedColor="green"
            starDimension="20px"
            starSpacing="2px"
          />
          ({p.ratings.length})
        </span>
      </div>
    );
  }
};
