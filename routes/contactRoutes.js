const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");  // Import the model

router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newContact = new Contact({ name, email, message });
    await newContact.save(); // Save to MongoDB

    res.status(201).json({ message: "Message received successfully!" });
  } catch (error) {
    console.error("Error saving contact message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
