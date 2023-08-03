const express = require("express");

const router = express.Router();
const { authCheck } = require("../midlewares/auth");
const {
  userCart,
  getCart,
  emptyCart,
  saveAddress,
  applyCouponToUserCart,
  createOrder,
  getOrders,
  addToWishList,
  wishList,
  removeFromWishList,
  createCashOrder,
} = require("../controllers/Users");

router.post("/user/cart", authCheck, userCart);
router.get("/user/cart", authCheck, getCart);
router.put("/user/cart", authCheck, emptyCart);
router.post("/user/address", authCheck, saveAddress);

// coupon
router.post("/user/cart/coupon", authCheck, applyCouponToUserCart);

// order
router.post("/user/order", authCheck, createOrder);
router.get("/user/orders", authCheck, getOrders);

// cash on delivery
router.post("/user/cash-order", authCheck, createCashOrder);

// wishlist
router.post("/user/wishlist", authCheck, addToWishList);
router.get("/user/wishlist", authCheck, wishList);
router.put("/user/wishlist/:productId", authCheck, removeFromWishList);

module.exports = router;
