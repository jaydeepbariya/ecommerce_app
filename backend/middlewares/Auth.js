const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/UserModel");

exports.auth = async (req, res, next) => {
  try {
    const token = req.body.token || req.cookies.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Empty Token",
      });
    }

    let decode;

    try {
      decode = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.log("Token Verification Error", error.message);
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      success: false,
      message: "Error In Token Validation, Please Try Again",
    });
  }
};

exports.isAdmin = async (req, res, next) => {
  try {
    const userDetails = await User.findOne({ email: req.user.email }).select("-password");
    console.log(userDetails);
    if (userDetails.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a Protected Route for User",
      });
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Role Can't be Verified` });
  }
};
