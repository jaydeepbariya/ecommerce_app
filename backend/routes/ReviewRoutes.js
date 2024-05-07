const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  addProductReview,
  getReviewById,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");
const { auth } = require("../middlewares/Auth");

router.get("/:productId", getProductReviews);
router.post("/:productId", auth, addProductReview);
router.get("/:id", getReviewById);
router.put("/:id", auth, updateReview);
router.delete("/:id", auth, deleteReview);

module.exports = router;
