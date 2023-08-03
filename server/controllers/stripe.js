const User = require("../models/user");
const Cart = require("../models/cart");
const Product = require("../models/product");
const Coupon = require("../models/coupon");
const stripe = require("stripe")(
  "sk_test_51NCGr6SAhut43b9aqQyoJYmqridjVaoKiS5h2JqaXoQ0ExmcmsaV4Ae4goF3jLYHHMwGot61WReidYQufbIAUFMH00xXjrpGwo"
);

exports.createPaymentIntent = async (req, res) => {
  // console.log(req.body);
  const { couponApplied } = req.body;

  // later apply coupon
  // later calculate price

  // 1 find user
  const user = await User.findOne({ email: req.user.email });
  // 2 get user cart total
  const { cartTotal, totalAfterDiscount } = await Cart.findOne({
    orderdBy: user._id,
  });
  // console.log("CART TOTAL", cartTotal, "AFTER DIS%", totalAfterDiscount);

  let finalAmount = 0;

  if (couponApplied && totalAfterDiscount) {
    finalAmount = totalAfterDiscount * 1000;
  } else {
    finalAmount = cartTotal * 1000;
  }

  // create payment intent with order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: finalAmount, // Amount in the smallest currency unit (e.g., 1000 = ₹10.00)
    currency: "inr",
    description: "Payment description", // Add a description for the payment intent
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
    cartTotal,
    totalAfterDiscount,
    payable: finalAmount,
  });
};
