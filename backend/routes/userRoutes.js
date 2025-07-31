// Import required packages
const express = require('express');
const router = express.Router(); 

// Import the User model
const User = require('../models/User');

router.post('/users', async (req, res) => {
    try {
        const { fullName, mobileNumber } = req.body;

        // --- Basic Validation ---
        if (!fullName || !mobileNumber) {
            return res.status(400).json({ msg: 'Please enter both full name and mobile number.' });
        }

        // Optional: Check if a user with the same mobile number already exists
        const existingUser = await User.findOne({ mobileNumber });
        if (existingUser) {
            return res.status(400).json({ msg: 'A user with this mobile number already exists.' });
        }

        const newUser = new User({
            fullName,
            mobileNumber,
        });

        // Save the new user to the database
        const savedUser = await newUser.save();

        // Respond with the saved user data and a 201 (Created) status
        res.status(201).json(savedUser);

    } catch (err) {
        // Handle potential errors, e.g., validation errors from Mongoose
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});  


router.get('/users/verify/:mobileNumber', async (req, res) => {
    try {
        const { mobileNumber } = req.params;

        // Find the user in the database by their mobile number
        const user = await User.findOne({ mobileNumber });

        // --- Handle Response ---
        if (!user) {
            return res.status(404).json({ msg: 'User not found. Please register first.' });
        }

        // If the user is found, return their data with a 200 (OK) status
        res.status(200).json({
            msg: 'User verified successfully.',
            user: {
                id: user._id,
                fullName: user.fullName,
                mobileNumber: user.mobileNumber,
                registrationDate: user.registrationDate
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;  