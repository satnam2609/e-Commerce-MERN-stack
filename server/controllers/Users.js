const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const Order = require("../models/order");
const uniqueid = require("uniqueid");

exports.userCart = async (req, res) => {
  const { cart } = req.body;
  console.log("CART ITEM", cart);
  let products = [];

  const user = await User.findOne({ email: req.user.email });

  //   check if user with logged id already exits
  let cartExistsByThisUser = await Cart.findOne({ orderdBy: user._id });

  if (cartExistsByThisUser) {
    cartExistsByThisUser.deleteOne();
    console.log("Removed old cart");
  }

  for (let i = 0; i < cart.length; i++) {
    let object = {};
    object.product = cart[i]._id;
    object.count = cart[i].count;
    object.color = cart[i].color;
    // get price for getting total
    let { price } = await Product.findById(cart[i]._id).select("price");
    object.price = price;

    products.push(object);
  }

  console.log("products", products);
  let cartTotal = 0;

  for (let i = 0; i < products.length; i++) {
    cartTotal = cartTotal + products[i].price * products[i].count;
  }
  console.log("CartTotal-->", cartTotal);

  let newCart = await Cart.create({
    products,
    cartTotal,
    orderdBy: user._id,
  });
  console.log("New Cart", newCart);
  res.json({ ok: true });
};

exports.getCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  let cart = await Cart.findOne({ orderdBy: user._id }).populate(
    "products.product",
    "id title price totalAfterDiscount"
  );

  if (cart) {
    const { products, cartTotal, totalAfterDiscount } = cart;
    res.json({
      products,
      cartTotal,
      totalAfterDiscount,
    });
  }
};

exports.emptyCart = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });

  const cart = await Cart.findOneAndRemove({ orderdBy: user._id });

  res.json(cart);
};

exports.saveAddress = async (req, res) => {
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      address: req.body.address,
    },
    {
      new: true,
    }
  );

  res.json({
    ok: true,
  });
};

exports.applyCouponToUserCart = async (req, res) => {
  const { coupon } = req.body;
  console.log("COUPON", coupon);

  const validCoupon = await Coupon.findOne({ name: coupon });
  if (validCoupon === null) {
    return res.json({
      err: "Invalid coupon",
    });
  }
  console.log("VALID COUPON", validCoupon);

  const user = await User.findOne({ email: req.user.email });

  let { products, cartTotal } = await (
    await Cart.findOne({ orderdBy: user._id })
  ).populate("products.product", "_id title price");
  console.log("cartTotal", cartTotal, "discount%", validCoupon.discount);

  // calculate the total after discount
  let totalAfterDiscount = (
    cartTotal -
    (cartTotal * validCoupon.discount) / 100
  ).toFixed(2); // 99.99

  await Cart.findOneAndUpdate(
    { orderdBy: user._id },
    { totalAfterDiscount },
    { new: true }
  );

  res.json(totalAfterDiscount);
};

exports.createOrder = async (req, res) => {
  const paymentIntent = req.body.stripeResponse;

  const user = await User.findOne({ email: req.user.email });

  let { products } = await Cart.findOne({ orderdBy: user._id });

  let newOrder = await Order.create({
    products,
    paymentIntent,
    orderdBy: user._id,
  });

  // decrement quantity, increment sold
  let bulkOption = products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);

  res.json({
    ok: true,
  });
};

exports.getOrders = async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const orders = await Order.find({ orderdBy: user._id }).populate(
    "products.product"
  );
  res.json(orders);
};

exports.addToWishList = async (req, res) => {
  const { productId } = req.body;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    {
      $addToSet: { wishList: productId },
    },
    {
      new: true,
    }
  );

  res.json({ ok: true });
};

exports.wishList = async (req, res) => {
  const list = await User.findOne({ email: req.user.email })
    .select("wishlist")
    .populate("wishList");

  res.json(list);
};

exports.removeFromWishList = async (req, res) => {
  const { productId } = req.params;

  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $pull: { wishList: productId } }
  );

  res.json({ ok: true });
};

exports.createCashOrder = async (req, res) => {
  const { isCOD } = req.body;

  // if COD is true then create order on cash on delivery
  if (!isCOD) return res.status(400).send("Create cash order failed");

  const user = await User.findOne({ email: req.user.email });

  let userCart = await Cart.findOne({ orderdBy: user._id });

  let newOrder = await Order.create({
    products: userCart.products,
    paymentIntent:{
      paymentIntent:{
       
          id: uniqueid(),
          amount: userCart.cartTotal,
          currency: "INR",
          status: "Cash on Delivery",
          created: Date.now(),
          payment_method_types: ["cash"],
   
      }
    },

    orderdBy: user._id,
  });

  // decrement quantity, increment sold
  let bulkOption = userCart.products.map((item) => {
    return {
      updateOne: {
        filter: { _id: item.product._id }, // IMPORTANT item.product
        update: { $inc: { quantity: -item.count, sold: +item.count } },
      },
    };
  });

  let updated = await Product.bulkWrite(bulkOption, {});
  console.log("PRODUCT QUANTITY-- AND SOLD++", updated);

  console.log("NEW ORDER SAVED", newOrder);

  res.json({
    ok: true,
  });
};
