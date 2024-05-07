const express = require("express");
const router = express.Router();
const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/CategoryController");

router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.post("/", auth, isAdmin, createCategory);
router.put("/:id", auth, isAdmin, updateCategory);
router.delete("/:id", auth, isAdmin, deleteCategory);

module.exports = router;
