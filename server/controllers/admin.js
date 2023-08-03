const Order = require("../models/order");

exports.orders = async (req, res) => {
  const allOrders = await Order.find({})
    .sort("-createdAt")
    .populate("products.product");

  res.json(allOrders);
};

exports.orderStatus = async (req, res) => {
  const { orderId, orderStatus } = req.body;
  let updated = await Order.findByIdAndUpdate(
    orderId,
    { orderStatus },
    {
      new: true,
    }
  );

  res.json(updated);
};
