const express = require("express");
const {
  read,
  update,
  remove,
  list,
  createCategory,
  getSubs,
} = require("../controllers/category");

// middlewares
const { authCheck, adminCheck } = require("../midlewares/auth");

const router = express.Router();

router.post("/category", authCheck, adminCheck, createCategory);
router.get("/category/:slug", read);
router.get("/categories", list);
router.delete("/category/:slug", authCheck, adminCheck, remove);
router.put("/category/:slug", authCheck, adminCheck, update);
router.get("/category/subs/:_id", getSubs);

module.exports = router;
