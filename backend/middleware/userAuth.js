import jwt from "jsonwebtoken";

export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer")) {
    return res.status(401).json({
      status: "failed",
      message: "Unauthorized User - No Token!",
    });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);

    if (!decoded) {
      return res.status(403).json({
        status: "failed",
        message: "User Unauthorized - Invalid Token!",
      });
    }

    req.userId = decoded.userId;
    req.mobileNumber = decoded.mobileNumber;
    //req.contact = decoded.contact; // works only if included in token payload
    jwt.sign({ userId: req.userId, mobileNumber: req.mobileNumber }, process.env.JWT_ACCESS_TOKEN_SECRET);


    next();
  } catch (error) {
    console.error("Error in Verifying Token: ", error.message);
    return res.status(401).json({
      status: "failed",
      message: "Invalid or expired token",
    });
  }
};
