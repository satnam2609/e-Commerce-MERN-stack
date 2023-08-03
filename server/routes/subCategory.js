const express = require("express");
const {
  read,
  update,
  remove,
  list,
  createsubCategory,
} = require("../controllers/subCategory");

// middlewares
const { authCheck, adminCheck } = require("../midlewares/auth");

const router = express.Router();

router.post("/subCategory", authCheck, adminCheck, createsubCategory);
router.get("/subCategory/:slug", read);
router.get("/subCategories", list);
router.delete("/subCategory/:slug", authCheck, adminCheck, remove);
router.put("/subCategory/:slug", authCheck, adminCheck, update);

module.exports = router;
