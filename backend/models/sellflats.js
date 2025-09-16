import mongoose from 'mongoose';

const sellFlatSchema = new mongoose.Schema({
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
        required: true // Added this field
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
        required: true // Added this field
    },
    ownershipType: {
        type: String,
        required: true // Added this field
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

const SellFlat = mongoose.model('SellFlat', sellFlatSchema);

export default SellFlat;