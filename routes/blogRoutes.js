const express = require("express");
const Blog = require("../models/Blog");

const router = express.Router();

// ✅ Create a new blog post
router.post("/create", async (req, res) => {
  try {
    console.log("📥 Received request data:", req.body);

    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      console.warn("⚠️ Missing required fields!");
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBlog = new Blog({ title, content, author });
    const savedBlog = await newBlog.save();

    console.log("✅ Blog created successfully:", savedBlog);
    res.status(201).json({ message: "Blog created successfully!", blog: savedBlog });

  } catch (error) {
    console.error("❌ Blog creation error:", error);
    res.status(500).json({ error: "Error creating blog post", details: error.message });
  }
});

// ✅ Fetch all blog posts
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error("❌ Error fetching blogs:", error);
    res.status(500).json({ error: "Error fetching blog posts" });
  }
});

// ✅ Fetch a single blog post by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format" });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ error: "Blog not found" });

    res.json(blog);
  } catch (error) {
    console.error("❌ Error fetching blog:", error);
    res.status(500).json({ error: "Error fetching blog post" });
  }
});

// ✅ Update a blog post
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format" });
    }

    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res.status(400).json({ error: "All fields (title, content, author) are required" });
    }

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) return res.status(404).json({ error: "Blog not found" });

    console.log("✅ Blog updated successfully:", updatedBlog);
    res.json({ message: "Blog updated successfully", blog: updatedBlog });

  } catch (error) {
    console.error("❌ Error updating blog:", error);
    res.status(500).json({ error: "Error updating blog post" });
  }
});

// ✅ Delete a blog post
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid blog ID format" });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return res.status(404).json({ error: "Blog not found" });

    console.log("✅ Blog deleted successfully:", deletedBlog);
    res.json({ message: "Blog deleted successfully" });

  } catch (error) {
    console.error("❌ Error deleting blog:", error);
    res.status(500).json({ error: "Error deleting blog post" });
  }
});

module.exports = router;
