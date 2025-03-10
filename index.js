const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware (MUST be before routes)
app.use(express.json()); // Parse JSON requests
app.use(cors()); // Enable CORS

// Import Routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const blogRoutes = require("./routes/blogRoutes");

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contact", contactRoutes);


// Test if .env is loading correctly
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI is not defined in .env file");
  process.exit(1); // Stop execution if MongoDB URI is missing
}

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected Successfully!"))
  .catch((err) => console.log("❌ Database connection error:", error));
  
// Test Route
app.get("/", (req, res) => {
  res.send("Portfolio Blog API is running...");
});

// Blog Routes
app.use("/api/blogs", blogRoutes);


// Start Server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
