const bcrypt = require("bcrypt");
const crypto = require("crypto");
const UserModel = require("../models/UserModel");
const CartModel = require("../models/CartModel");
const ReviewModel = require("../models/ReviewModel");
const OrderModel = require("../models/OrderModel");

exports.registerUser = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role } = req.body;

    if (!email || !password || !firstName || !lastName || !role) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exists" });
    }

    // Step 4: Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Create a new User using UserModel model and hashedPassword as password
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role,
    });

    const savedUser = await newUser.save();

    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: savedUser,
    });
  } catch (error) {
    console.log("USER REGISTRATION ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("token", token, { httpOnly: true, expiresIn: "18h" })
      .status(200)
      .json({
        success: true,
        message: "Logged in successfully",
        userData: user,
      });
  } catch (error) {
    console.log(`USER LOGIN ERROR`, error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");

    res
      .status(200)
      .json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log("LOGOUT ERROR", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomUUID();

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = Date.now() + 5 * 60 * 1000;

    await user.save();

    const subject = "Password Reset";
    const text = `Click on the following link to reset your password: http://localhost:3000/reset-password/${resetToken}`;

    await mailSender(email, subject, text);

    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.log("FORGOT PASSWORD ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await UserModel.findOne({ resetPasswordToken: token });

    if (!user || user.resetPasswordTokenExpires < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("RESET PASSWORD ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (req.body.firstName) {
      user.firstName = req.body.firstName;
    }

    if (req.body.lastName) {
      user.lastName = req.body.lastName;
    }

    if (req.body.address) {
      user.address = req.body.address;
    }

    if (req.body.dateOfBirth) {
      user.dateOfBirth = req.body.dateOfBirth;
    }

    if (req.body.gender) {
      user.gender = req.body.gender;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    console.log("USER PROFILE UPDATE ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    await OrderModel.deleteMany({ user: userId });
    await CartModel.deleteMany({ user: userId });
    await ReviewModel.deleteMany({ user: userId });

    await user.remove();

    res
      .status(200)
      .json({ success: true, message: "User profile deleted successfully" });
  } catch (error) {
    console.log("USER DELETION ERROR ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await UserModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!req.files || !req.files.displayPicture) {
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });
    }

    const { secure_url } = await cloudinary.uploader.upload(
      req.files.displayPicture.path
    );

    user.displayPicture = secure_url;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Display picture updated successfully",
      displayPicture: secure_url,
    });
  } catch (error) {
    console.log("UPDATE DISPLAY PICTURE ERROR ", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
