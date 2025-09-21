// routes/webhook.js
const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/User");

router.post("/razorpay-webhook", async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    const event = req.body.event;

    if (event === "subscription.activated") {
      const subscriptionId = req.body.payload.subscription.entity.id;

      await User.findOneAndUpdate(
        { subscriptionId },
        { subscriptionActive: true }
      );
    }

    if (event === "subscription.cancelled") {
      const subscriptionId = req.body.payload.subscription.entity.id;

      await User.findOneAndUpdate(
        { subscriptionId },
        { subscriptionActive: false }
      );
    }
  }

  res.json({ status: "ok" });
});

module.exports = router;
