const subCategory = require("../models/subCategory");
const Product = require("../models/product");
const slugify = require("slugify");

exports.createsubCategory = async (req, res) => {
  try {
    const { name, parent } = req.body;

    const subcategory = await subCategory.create({
      name,
      slug: slugify(name),
      parent,
    });

    res.json(subcategory);
  } catch (error) {
    res.json({
      message: "CREATE SUB-CATEGORY FAILED",
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { name, parent } = req.body;
    let subcategory = await subCategory.findOneAndUpdate(
      {
        slug: req.params.slug,
      },
      { name, slug: slugify(name), parent },
      {
        new: true,
      }
    );

    res.json(subcategory);
  } catch (error) {
    res.status(400).send("update sub-category failed");
  }
};

exports.list = async (req, res) => {
  try {
    res.json(
      await subCategory.find({}).sort({
        createdAt: -1,
      })
    );
  } catch (error) {
    res.status(400).send("CANNOT FIND  SUB-CATEGORIES");
  }
};

exports.read = async (req, res) => {
  try {
    let subcategory = await subCategory.findOne({ slug: req.params.slug });
    const products = await Product.find({ subs: subcategory }).populate(
      "category"
    );

    // res.json(subcategory);

    res.json({
      subcategory,
      products,
    });
  } catch (error) {
    res.status(400).send({
      error: error.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    let subcategory = await subCategory.findOneAndDelete({
      slug: req.params.slug,
    });

    res.json(subcategory);
  } catch (error) {
    res.status(400).send("Create sub-category failed");
  }
};
