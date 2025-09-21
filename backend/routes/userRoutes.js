// Import required packages
import express from "express";
const router = express.Router(); 
import { verifyAccessToken } from "../middleware/userAuth.js";
import { checkAdminNumber } from "../middleware/checkAdminNumber.js";
import { registerUser, forgotPassword, loginUser, resetPassword, adminLogin, logout, getAllUsers }  from "../controllers/userController.js";

// Import the User model
import User from "../models/User.js";

// Route 1 - register new user
router.post('/create', registerUser);

//Route 2 - Login existing User
router.post("/login",loginUser);

//Route 3 - Forgot password (password reset request)
router.post("/forgot", forgotPassword);

//Round 4 - forgot password (verify OTP and reset password)
router.post("/reset-password", resetPassword);

//Route 5 - Admin login 
router.post("/admin-login", adminLogin);

//Route 6 - Generate the new access token using refressToken.


// Route 7 - Get all users
router.get('/all-users', verifyAccessToken, checkAdminNumber, getAllUsers);

// Route 8 - Get user by contact
router.get('/contact/:mobileNumber', async (req, res) => {
    const { mobileNumber } = req.params;
    try {
        const user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

//Route 9 - Logout user.
router.post("/logout", logout);

export default router;