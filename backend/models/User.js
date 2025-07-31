// Import required packages
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required.'],
        trim: true, 
    },
    mobileNumber: {
        type: String,
        required: [true, 'Mobile number is required.'],
        unique: true, 
        trim: true,
        match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit mobile number.'],
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the User model
module.exports = mongoose.model('User', UserSchema);