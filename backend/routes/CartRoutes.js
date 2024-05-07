const express = require("express");
const router = express.Router();
const {
  getUserCart,
  addToCart,
  addCartItem,
  removeFromCart,
  updateCartItem
} = require("../controllers/CartController");
const { auth } = require("../middlewares/Auth");

router.get("/", auth, getUserCart);
router.post("/add", auth, addToCart);
router.put("/:productId", auth, addCartItem);
router.delete("/:productId", auth, removeFromCart);
router.delete("/:productId", auth, updateCartItem);

module.exports = router;
