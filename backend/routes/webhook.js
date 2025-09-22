import express from "express";
import crypto from "crypto";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Razorpay webhook endpoint
router.post("/razorpay-webhook", express.json({ type: "application/json" }), async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== req.headers["x-razorpay-signature"]) {
      return res.status(400).json({ status: "failed", message: "Invalid signature" });
    }

    const event = req.body.event;

    if (event === "subscription.activated") {
      const subscriptionId = req.body.payload.subscription.entity.id;

      await User.findOneAndUpdate(
        { subscriptionId },
        { subscriptionActive: true, subscriptionStatus: "Active" }
      );

      console.log(`✅ Subscription activated: ${subscriptionId}`);
    }

    if (event === "subscription.cancelled") {
      const subscriptionId = req.body.payload.subscription.entity.id;

      await User.findOneAndUpdate(
        { subscriptionId },
        { subscriptionActive: false, subscriptionStatus: "Inactive" }
      );

      console.log(`❌ Subscription cancelled: ${subscriptionId}`);
    }

    res.json({ status: "ok" });
  } catch (error) {
    console.error("Error in webhook:", error.message);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
});

export default router;
