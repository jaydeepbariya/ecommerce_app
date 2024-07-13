const Review = require("../models/ReviewModel");
const Product = require("../models/ProductModel");

exports.getProductReviews = async (req, res) => {
  try {
    const productId = req.params.productId;

    const reviews = await Review.find({ product: productId });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.log("GET PRODUCT REVIEWS ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addProductReview = async (req, res) => {
  try {
    const productId = req.params.productId;

    const product = await ProductModel.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const { rating, comment } = req.body;

    const review = new Review({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    await review.save();

    res
      .status(201)
      .json({ success: true, message: "Review added successfully", review });
  } catch (error) {
    console.log("ADD PRODUCT REVIEW ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    let review = await Review.findById(reviewId);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (req.body.rating) {
      review.rating = req.body.rating;
    }
    if (req.body.comment) {
      review.comment = req.body.comment;
    }

    review = await review.save();

    res
      .status(200)
      .json({ success: true, message: "Review updated successfully", review });
  } catch (error) {
    console.log("UPDATE REVIEW ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    console.log("DELETE REVIEW ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
