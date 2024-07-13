const express = require("express");
const router = express.Router();
const { auth, isAdmin } = require("../middlewares/Auth");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} = require("../controllers/ProductController");

router.get("/", getProducts);
router.get("/:productId", getProductById);
router.get("/search/:keyword", searchProducts);
router.post("/", auth, isAdmin, createProduct);
router.put("/:productId", auth, isAdmin, updateProduct);
router.delete("/:productId", auth, isAdmin, deleteProduct);

module.exports = router;
