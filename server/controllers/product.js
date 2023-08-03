const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

exports.create = async (req, res) => {
  try {
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};

// without pagination
// exports.list = async (req, res) => {
//   try {
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit);
//     res.json(products);
//   } catch (err) {
//     console.log(err);
//     res.status(400).json({
//       err: err.message,
//     });
//   }
// };

// with pagination
exports.list = async (req, res) => {
  try {
    // createdAt/updatedAt, desc/asc, 3
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3; // 3

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("subs")
      .sort([[sort, order]])
      .limit(perPage);
    // .exec();

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};

exports.listAll = async (req, res) => {
  try {
    let products = await Product.find({})
      .limit(parseInt(req.params.count))
      .populate("category")
      .populate("subs")
      .sort([["createdAt", "desc"]]);
    res.json(products);
  } catch (error) {
    console.log(err);
    res.status(400).json({
      err: err.message,
    });
  }
};
exports.read = async (req, res) => {
  try {
    const product = await Product.find({ slug: req.params.slug })
      .populate("category")
      .populate("subs");
    res.json(product);
  } catch (error) {
    console.log(error);
    res.json({
      error: error.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.log("PRODUCT UPDATE ERROR ----> ", err);
    // return res.status(400).send("Product update failed");
    res.status(400).json({
      err: err.message,
    });
  }
};

exports.remove = async (req, res) => {
  try {
    const product = await Product.findOneAndRemove({ slug: req.params.slug });
    res.json(product);
  } catch (error) {
    res.json({
      error: "Product Delete Failed",
    });
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount();
  res.json(total);
};
// read,
// update,
// remove,
// list,

exports.productStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    const user = await User.findOne({ email: req.user.email });
    const { star } = req.body;
    // who is updating?
    // check if currently logged in user has already rated the product
    let existingRatingObject = product.ratings.find(
      (ele) => ele.postedBy.toString() === user._id.toString()
    );

    // if user havent left rating yet then push the rating
    if (existingRatingObject === undefined) {
      let ratingAdded = await Product.findByIdAndUpdate(
        product._id,
        {
          $push: {
            ratings: {
              star,
              postedBy: user._id,
            },
          },
        },
        {
          new: true,
        }
      );

      res.json(ratingAdded);
    }
    // if user have already left rating  then update the rating
    else {
      let ratingUpdated = await Product.updateOne(
        {
          ratings: { $elemMatch: existingRatingObject },
        },
        {
          $set: { "ratings.$.star": star },
        },
        {
          new: true,
        }
      );

      res.json(ratingUpdated);
    }
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

exports.getProductStar = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    let stars = product.ratings.map((rate) => rate.star);

    res.json(stars[0]);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId);

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("subs")
    .populate("ratings", "postedBy");

  res.json(related);
};

// search filter

const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("subs", "_id name");

  res.json(products);
};

const handlePrice = async (req, res, price) => {
  try {
    const products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("subs", "_id name");
    res.json(products);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};
const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("subs", "_id name");

    res.json(products);
  } catch (err) {
    console.log(err);
  }
};
const handleStars = async (req, res, stars) => {
  try {
    Product.aggregate([
      {
        $project: {
          document: "$$ROOT",
          // title: "$title",
          floorAverage: {
            $floor: { $avg: "$ratings.star" }, // floor value of 3.33 will be 3
          },
        },
      },
      { $match: { floorAverage: stars } },
    ])
      .limit(12)
      .then((aggregates) => {
        Product.find({ _id: aggregates })
          .populate("category", "_id name")
          .populate("subs", "_id name")
          .populate("ratings", "postedBy")
          .then((result) => res.json(result));
      });
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const handleSubCategory = async (req, res, sub) => {
  try {
    const products = await Product.find({ subs: sub })
      .populate("category", "_id name")
      .populate("subs", "_id name")
      .populate("ratings");

    res.json(products);
  } catch (error) {
    res.json({
      error: error.message,
    });
  }
};

const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings");

  res.json(products);
};

const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings");

  res.json(products);
};

const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("subs", "_id name")
    .populate("ratings");

  res.json(products);
};

exports.searchFilters = async (req, res) => {
  const { query, price, category, stars, subCategory, shipping, brand, color } =
    req.body;

  if (query) {
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    console.log(price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log(category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log("stars--->", stars);
    await handleStars(req, res, stars);
  }

  if (subCategory) {
    console.log("category--->", subCategory);
    await handleSubCategory(req, res, subCategory);
  }

  if (shipping) {
    console.log("shipping ---> ", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("color ---> ", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("brand ---> ", brand);
    await handleBrand(req, res, brand);
  }
};
