const express = require('express');
const mongoose = require('mongoose'); 
const cors = require('cors');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');

const app = express();  // Initialize Express app
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGOOSE_CONNECTION_STRING)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch(err => {
    console.error("MongoDB connection error:", err);
  });

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
} 
); 
