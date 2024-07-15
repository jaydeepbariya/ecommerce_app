const CartModel = require("../models/CartModel");
const ProductModel = require("../models/ProductModel");

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const userCart = await CartModel.findOne({ user: userId }).populate(
      "products.productId"
    );

    res.status(200).json({ success: true, cart: userCart });
  } catch (error) {
    console.log("GET USER CART ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const {productId, quantity, price } = req.body;

    let userCart = await CartModel.findOne({ user: userId });

    let cartProduct = await ProductModel.findById(productId);

    if(!userCart){
      userCart = await CartModel.create({ user: userId});
    }

    userCart.products.push({ productId, quantity, price });

    userCart = await userCart.save();

    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart: userCart,
    });
  } catch (error) {
    console.log("ADD TO CART ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const productId = req.params.productId;

    let userCart = await CartModel.findOne({ user: userId });
    console.log(userCart.products);

    const existingProductIndex = userCart.products.findIndex(
      (product) => product._id?.toString() === productId
    );

    console.log(existingProductIndex);

    if (existingProductIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist in the cart",
      });
    }

    userCart.products.splice(existingProductIndex, 1);

    userCart = await userCart.save();

    res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart: userCart,
    });
  } catch (error) {
    console.log("REMOVE FROM CART ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, quantity, price } = req.body;

    let userCart = await CartModel.findOne({ user: userId });

    const existingProductIndex = userCart.products.findIndex(
      (product) => product.productId.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Product does not exist in the cart",
      });
    }

    const existingProduct = userCart.products[existingProductIndex];
    if (quantity !== undefined && existingProduct.quantity !== quantity) {
      existingProduct.quantity = quantity;
    }
    if (price !== undefined && existingProduct.price !== price) {
      existingProduct.price = price;
    }

    userCart = await userCart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: userCart,
    });
  } catch (error) {
    console.log("UPDATE CART ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
