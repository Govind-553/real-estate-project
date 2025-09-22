import express from "express";
import razorpay from "../config/razorpay.js";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Route to create a new subscription
router.post("/create-subscription", async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ status: "failed", message: "UserId is required" });
    }

    // Create subscription using Razorpay Plan ID
    const subscription = await razorpay.subscriptions.create({
      plan_id: process.env.RAZORPAY_PLAN_ID, // Replace with your Razorpay Plan ID
      customer_notify: 1,
      total_count: 12, // e.g. 12 months billing
    });

    // Save subscriptionId in user
    await User.findByIdAndUpdate(userId, {
      subscriptionId: subscription.id,
      subscriptionActive: true,
      subscriptionStatus: "Active"
    });

    res.json({
      status: "success",
      message: "Subscription created",
      subscriptionId: subscription.id,
      subscription,
    });
  } catch (error) {
    console.error("Error in create-subscription:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
});

export default router;
