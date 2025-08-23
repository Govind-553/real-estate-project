import User from '../models/User.js';
import bcrypt from "bcrypt";
import express from 'express';
import { generateRefreshToken, generateAccessToken, sendTokenResponse } from './jwtController.js';


//Route 1 - Register user
export const registerUser = async (req, res) => {
    const { fullName, contact, password } = req.body;

    try{
    // --- Basic Validation ---
    if (!fullName || !contact || !password) {
        return res.status(400).json({ msg: 'Please enter all fields.' });
    }

    // Optional: Check if a user with the same mobile number already exists
    const existingUser = await User.findOne({ contact });
    if (existingUser) {
        return res.status(400).json({ msg: 'A user with this mobile number already exists.' });
    }

    // Password length check
    if (password.length < 6) {
        return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }

    // creating new user.
    const newUser = new User({
        fullName,
        contact,
        password,
    });
    // Save the new user to the database
    await newUser.save();

    // password hashing
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Respond with the saved user data and a 201 (Created) status

    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
            fullName: newUser.fullName,
            contact: newUser.contact,
        }
    });
} catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ msg: 'Server error. Please try again later.' });
    }  
};

//Route 2 - Login user existing user 
export const loginUser = async (req, res) => {
    const { mobileNumber, password } = req.body;
    try {
        //Basic validation
        if (!mobileNumber || !password) {
            return res.status(400).json({
                msg: 'Please enter all fields.'
            });
        }
        
        //mobileNumber length restriction
        if (mobileNumber.length !== 10) {
            return res.status(400).json({
                message: "mobile Number should be of only 10 digit"
            });
        }

        // Password length check
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password should be at least of 6 characters."
            });
        }

        //check the entered mobile number is registered or not.
        const existingUser = await User.findOne({ mobileNumber });
        if (!existingUser) {
            res.status(400).json({
                message: "Mobile number is not registered."
            });
        } else {
            const isMatch = await bcrypt.compare(password, existingUser.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Invalid credentials."
                });
            }

            // If login is successful, you can return user data or a token
            res.status(200).json({
                status: 'success',
                message: 'User logged in successfully',
                data: generateAccessToken(existingUser.mobileNumber),
            });
        }

    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ msg: 'Server error. Please try again later.' });
        }
};

//Route 3 - Forgot Password
export const forgotPassword = async (req, res) => {
    // Extract the mobile number from the request body    
    const { contact } = req.body;
     // Basic validation
        if (!contact) {
            return res.status(400).json({ msg: 'Please enter your mobile number.' });
        }

    try {
        // Check if the user exists
        const existingUser = await User.findOne({ mobileNumber });
        if (!existingUser) {
            return res.status(400).json({ msg: 'Mobile number is not registered.' });
        }

        // Generate a password reset token (you can use a library like jsonwebtoken)
        const resetToken = existingUser.generateResetToken();

        // Send the reset token to the user's email or mobile number
        // (For simplicity, we'll just return it in the response)
        res.status(200).json({
            status: 'success',
            message: 'Password reset link has been sent.',
            data: {
                resetToken,
            }
        });
    } catch (error) {
        console.error('Error processing forgot password request:', error);
        res.status(500).json({ msg: 'Server error. Please try again later.' });
    }
};

//Route 8 - logout User
// logout.controller.js
export const logout = async (req, res) => {
    try {
        // Clear the refreshToken cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            path: "/" // ensures cookie is cleared site-wide
        });

        res.status(200).json({
            message: "Logged Out Successfully - Come Back Soon!"
        });
    } catch (error) {
        console.error("Logout Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
