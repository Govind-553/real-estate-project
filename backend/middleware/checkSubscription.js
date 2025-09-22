import User from "../models/User.js";

async function checkSubscription(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Expired
    if (user.subscriptionExpiry && user.subscriptionExpiry < new Date()) {
      user.subscriptionActive = false;
      user.subscriptionStatus = "Inactive";
      await user.save();

      return res.status(403).json({
        success: false,
        message: "Please subscribe to continue.",
      });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

export default checkSubscription;
