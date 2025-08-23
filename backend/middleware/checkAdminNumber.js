
// middleware/checkAdminNumber.js
export const checkAdminNumber = (req, res, next) => {
  try {
    // Ensure mobile number is attached from verifyAccessToken
    // if (!req.mobileNumber) {
    //   return res.status(401).json({ message: "Unauthorized: User mobile number missing" });
    // }

    // Admin number from environment variable
    const ADMIN_NUMBER = process.env.ADMIN_NUMBER;

    if (!ADMIN_NUMBER) {
      console.error("ADMIN_NUMBER not set in .env file");
      return res.status(500).json({ message: "Server configuration error" });
    }

    // Check if logged-in user is the admin number
    if (req.mobileNumber !== ADMIN_NUMBER) {
      return res.status(403).json({ message: "Access denied: Admin only" });
    }

    //  Passed — user is admin
    next();
  } catch (error) {
    console.error("Error in checkAdminNumber middleware:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
