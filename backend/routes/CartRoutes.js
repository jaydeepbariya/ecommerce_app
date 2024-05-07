const express = require("express");
const router = express.Router();
const {
  getUserCart,
  addToCart,
  removeFromCart,
  updateCart,
} = require("../controllers/CartController");
const { auth } = require("../middlewares/Auth");

router.get("/", auth, getUserCart);
router.post("/add", auth, addToCart);
router.delete("/:productId", auth, removeFromCart);
router.put("/update", auth, updateCart);

module.exports = router;
