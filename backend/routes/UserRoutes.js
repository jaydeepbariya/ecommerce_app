const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/Auth");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotPassword,
  resetPassword,
  updateUserProfile,
  deleteUserAccount
} = require("../controllers/UserController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", auth, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/profile", auth, updateUserProfile);
router.delete("/profile", auth, deleteUserAccount);

module.exports = router;
