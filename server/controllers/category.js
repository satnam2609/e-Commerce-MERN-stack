const Category = require("../models/category");
const Product = require("../models/product");
const slugify = require("slugify");
const Sub = require("../models/subCategory");

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    const category = await Category.create({
      name,
      slug: slugify(name),
    });

    res.json(category);
  } catch (error) {
    res.json({
      message: "CREATE CATEGORY FAILED",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name } = req.body;
    let category = await Category.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      { name, slug: slugify(name) },
      {
        new: true,
      }
    );

    res.json(category);
  } catch (error) {
    res.status(400).send("update category failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(
      await Category.find({}).sort({
        createdAt: -1,
      })
    );
  } catch (error) {
    res.status(400).send("CANNOT FIND  CATEGORIES");
  }
};

exports.read = async (req, res) => {
  try {
    let category = await Category.findOne({ slug: req.params.slug });
    // res.json(category);
    const products = await Product.find({ category })
      .populate("category")
      .populate("subs");

    res.json({
      category,
      products,
    });
  } catch (error) {
    res.status(400).send("CANNOT GET CATEGORY");
  }
};

exports.remove = async (req, res) => {
  try {
    let category = await Category.findOneAndDelete({
      slug: req.params.slug,
    });

    res.json(category);
  } catch (error) {
    res.status(400).send("Create category failed");
  }
};

exports.getSubs = (req, res) => {
  Sub.find({ parent: req.params._id })
    .then((subs) => {
      res.json(subs);
    })
    .catch((err) => {
      res.json(err);
    });
};
