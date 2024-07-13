const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  addProductReview,
  updateReview,
  deleteReview,
} = require("../controllers/ReviewController");
const { auth } = require("../middlewares/Auth");

router.get("/:productId", getProductReviews);
router.post("/:productId", auth, addProductReview);
router.put("/:reviewId", auth, updateReview);
router.delete("/:reviewId", auth, deleteReview);

module.exports = router;
