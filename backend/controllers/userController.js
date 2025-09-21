import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Register new user
 */
export const registerUser = async (req, res) => {
  try {
    const { fullName, mobileNumber, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ mobileNumber });
    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "User already exists with this mobile number",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      fullName,
      mobileNumber,
      password: hashedPassword,
      registrationDate: new Date(),
      subscriptionActive: false, // default until subscribed
    });

    await newUser.save();

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        mobileNumber: newUser.mobileNumber,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

/**
 * Login user
 */
export const loginUser = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // Find user
    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid credentials",
      });
    }

    // Trial and subscription check
    const trialPeriodDays = 7;
    const today = new Date();
    const daysSinceRegistration = Math.floor(
      (today - user.registrationDate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceRegistration > trialPeriodDays && !user.subscriptionActive) {
      return res.status(403).json({
        status: "failed",
        message: "Please subscribe to continue.",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        userId: user._id,
        mobileNumber: user.mobileNumber,
      },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        subscriptionActive: user.subscriptionActive,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

/**
 * Forgot Password (send OTP)
 */
export const forgotPassword = async (req, res) => {
  try {
    const { mobileNumber } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user) {
      return res.status(404).json({
        status: "failed",
        message: "User not found",
      });
    }

    // Normally: generate OTP, send via SMS/Email
    const otp = Math.floor(100000 + Math.random() * 900000);

    // For demo, save OTP in user (not secure for production)
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 min
    await user.save();

    res.status(200).json({
      status: "success",
      message: "OTP sent successfully",
      otp, // ⚠️ In production, don't send OTP in response
    });
  } catch (error) {
    console.error("Error in forgotPassword:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

/**
 * Reset Password (verify OTP + set new password)
 */
export const resetPassword = async (req, res) => {
  try {
    const { mobileNumber, otp, newPassword } = req.body;

    const user = await User.findOne({ mobileNumber });
    if (!user || user.resetOtp !== Number(otp) || user.resetOtpExpiry < Date.now()) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid or expired OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = undefined;
    user.resetOtpExpiry = undefined;

    await user.save();

    res.status(200).json({
      status: "success",
      message: "Password reset successful",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

/**
 * Admin Login
 */
export const adminLogin = async (req, res) => {
  try {
    const { mobileNumber, password } = req.body;

    // simple check for admin (extend as per your requirement)
    if (mobileNumber !== process.env.ADMIN_MOBILE) {
      return res.status(403).json({
        status: "failed",
        message: "Unauthorized admin",
      });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      return res.status(400).json({
        status: "failed",
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { role: "admin", mobileNumber },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({
      status: "success",
      message: "Admin login successful",
      token,
    });
  } catch (error) {
    console.error("Error in adminLogin:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};

/**
 * Logout
 */
export const logout = async (req, res) => {
  try {
    // With JWT, logout is client-side (remove token)
    res.status(200).json({
      status: "success",
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in logout:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};
