import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required."],
    trim: true,
  },
  mobileNumber: {
    type: String, // changed to String because mobile numbers often start with 0 or +91
    required: [true, "Mobile number is required."],
    unique: true,
    trim: true,
    match: [/^91[0-9]{10}$/, "Please enter a valid 10-digit mobile number starting with country code 91."],
  },
  password: {
    type: String,
    required: [true, "Password is required."],
    minlength: [6, "Password must be at least 6 characters long."],
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  subscriptionActive: {
    type: Boolean,
    default: false, // trial until subscription is paid
  },
  subscriptionId: {
    type: String, // Razorpay subscription ID
  },
});

const User = mongoose.model("User", UserSchema);
export default User;
