import React from "react";

const ShowPaymentInfo = ({ order, showStatus = true }) => {
  console.log(order);
  return (
    <div>
      <p>
        <span>Order id:{order.paymentIntent.paymentIntent.id}</span>
        {"/"}
        <span>
          Amount:
          {order.paymentIntent.paymentIntent.amount.toLocaleString("en-US", {
            style: "currency",
            currency: "INR",
          })}
        </span>
        {"/"}
        <span>
          Currency:{order.paymentIntent.paymentIntent.currency.toUpperCase()}
        </span>
        {"/"}
        <span>
          Payment:{order.paymentIntent.paymentIntent.status.toUpperCase()}
        </span>
        {"/"}
        <br />

        {showStatus && (
          <span className="badge bg-primary text-white">
            Order status:{order.orderStatus}
          </span>
        )}
      </p>
    </div>
  );
};

export default ShowPaymentInfo;
