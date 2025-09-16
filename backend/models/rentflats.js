import mongoose from "mongoose";

const rentFlatSchema = new mongoose.Schema({
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  userName: {
    type: String,
    required: false 
  },
  location: { 
    type: String,
    required: true
  },
  propertyType: { 
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  contact: { 
    type: Number,
    required: [true, 'Mobile number is required.'],
    trim: true,
    match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit mobile number.']
  },
  date: { 
    type: Date,
    required: true
  },
  ownershipType: { 
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

const RentFlat = mongoose.model("RentFlat", rentFlatSchema);

export default RentFlat;