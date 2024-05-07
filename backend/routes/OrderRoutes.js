const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/OrderController");
const { auth } = require("../middlewares/Auth");

router.get("/", auth, getOrders);
router.get("/:id", auth, getOrderById);
router.post("/", auth, createOrder);
router.put("/:id", auth, updateOrder);
router.delete("/:id", auth, deleteOrder);

module.exports = router;
