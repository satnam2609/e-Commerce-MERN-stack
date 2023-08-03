const express = require("express");
const { create, remove, list } = require("../controllers/coupon");

// middlewares
const { authCheck, adminCheck } = require("../midlewares/auth");

const router = express.Router();

router.post("/coupon", authCheck, adminCheck, create);

router.get("/coupons", list);
router.delete("/coupon/:couponId", authCheck, adminCheck, remove);

module.exports = router;
