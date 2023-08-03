import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckout from "../components/StripeCheckout";
import "../stripe.css";
// load stripe outside of render to avoid recreating stripe object on every render
const promise = loadStripe(
  "pk_test_51NCGr6SAhut43b9aqjmbvpDT5iycuviyh4v3OGOr5Yv7BVnIKzsWmZY5qsrZO8HwEmPEmYfUf4FZIqLkkvcfmZY600anFu1lfG"
);

const Payment = () => {
  return (
    <div className="container p-3 text-center">
      <h4>Complete your purchase</h4>
      <Elements stripe={promise}>
        <div className="col-md-8 offset-md-2">
          <StripeCheckout />
        </div>
      </Elements>
    </div>
  );
};

export default Payment;
