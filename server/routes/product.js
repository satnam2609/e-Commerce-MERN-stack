const express = require("express");
const {
  update,
  remove,
  listAll,
  create,
  read,
  list,
  productStar,
  productsCount,
  getProductStar,
  listRelated,
  searchFilters,
} = require("../controllers/product");

// middlewares
const { authCheck, adminCheck } = require("../midlewares/auth");

const router = express.Router();

router.post("/product", authCheck, adminCheck, create); //post
router.get("/products/total", productsCount);
router.get("/products/:count", listAll);
router.delete("/product/:slug", authCheck, adminCheck, remove);
router.get("/product/:slug", read);
router.put("/product/:slug", authCheck, adminCheck, update);
router.post("/products", list);

// rating
router.put("/product/star/:productId", authCheck, productStar);
router.get("/product/getStar/:productId", authCheck, getProductStar);
router.get("/product/related/:productId", listRelated);

// search endpoint
router.post("/search/filters", searchFilters);
module.exports = router;
