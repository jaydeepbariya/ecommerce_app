const OrderModel = require("../models/OrderModel");

exports.getOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await OrderModel.find({ user: userId }).populate("products");

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.log("GET ORDERS ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;

    const order = await OrderModel.findById(orderId).populate("products");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.log("GET ORDER BY ID ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { user, products, totalPrice, status, shippingAddress } = req.body;

    if (!user || !products || !totalPrice || !status || !shippingAddress) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Products must be a non-empty array",
      });
    }

    const calculatedTotalPrice = products.reduce(
      (acc, curr) => acc + curr.price * curr.quantity,
      0
    );

    const order = new OrderModel({
      user,
      products,
      totalPrice: calculatedTotalPrice,
      status,
      shippingAddress,
    });

    await order.save();

    res
      .status(201)
      .json({ success: true, message: "Order created successfully", order });
  } catch (error) {
    console.log("CREATE ORDER ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    let order = await OrderModel.findById(orderId);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    const { products, status, shippingAddress } = req.body;

    if (products) {
      order.products = products;
      order.totalPrice = products.reduce(
        (acc, curr) => acc + curr.price * curr.quantity,
        0
      );
    }
    if (status) {
      order.status = status;
    }
    if (shippingAddress) {
      order.shippingAddress = shippingAddress;
    }

    order = await order.save();

    res
      .status(200)
      .json({ success: true, message: "Order updated successfully", order });
  } catch (error) {
    console.log("UPDATE ORDER ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    const deletedOrder = await OrderModel.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log("DELETE ORDER ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
