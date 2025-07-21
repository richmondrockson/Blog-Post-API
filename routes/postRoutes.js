const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const authenticateToken = require("../middlewares/authMiddleware");

// Create a new post
router.post("/", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Assuming userId is set by the auth middleware
  const { title, body, author } = req.body;
  try {
    const post = await Post.create({ title, body, author, UserId: userId });
    console.log("User from token:", req.user);
    res.status(201).json({ message: "Post created", post });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create post", details: err.message });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll();
    res.json(posts);
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get a single post
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return req.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Error fetching post" });
  }
});

// Update a post
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, body, author } = req.body;
  const userId = req.user.userId;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // ❗ Only allow the user who created the post to update it
    if (post.UserId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this post" });
    }

    // Update post fields
    post.title = title || post.title;
    post.body = body || post.body;
    post.author = author || post.author;

    await post.save();
    res.json({ message: "Post updated", post });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update post", details: err.message });
  }
});

// Delete a Post
router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.UserId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await post.destroy();
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete post", details: err.message });
  }
});

// Get all posts by a logged-in user
router.get("/mine", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const posts = await Post.findAll({
      where: { UserId: userId },
      order: [["createdAt", "DESC"]],
    });
    if (posts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }
    res.json(posts);
  } catch (err) {
    console.error("Error fetching user's posts:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch posts", details: err.message });
  }
});

module.exports = router;
