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
router.get("/:id", getProductById);
router.get("/:keyword", searchProducts);
router.post("/", auth, isAdmin, createProduct);
router.put("/:id", auth, isAdmin, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;
