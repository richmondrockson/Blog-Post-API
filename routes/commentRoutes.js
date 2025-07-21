const express = require("express");
const router = express.Router();
const { Comment, Post } = require("../models");
const authenticateToken = require("../middlewares/authMiddleware");

// Create a new comment
router.post("/:postId", authenticateToken, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  const userId = req.user.userId; // Assuming userId is set by the auth middleware

  try {
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create comment
    const comment = await Comment.create({
      content,
      UserId: userId,
      PostId: postId,
    });

    res.status(201).json({ message: "Comment added", comment });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to add comment", details: err.message });
  }
});

// Get all comments for a post
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  try {
    // Check if post exists
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Fetch comments for the post
    const comments = await post.getComments({
      include: ["User"], // Include commenter info
      order: [["createdAt", "DESC"]],
    });

    res.json(comments);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch comments", details: err.message });
  }
});

// Update a comment
router.put("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const userId = req.user.userId;

  try {
    const comment = await Comment.finfByPk(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    // ❗ Only allow the user who created the comment to update it
    if (comment.UserId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit this comment" });
    }
    comment.content = content || comment.content;
    await comment.save();
    res.json({ message: "Comment updated successfully", comment });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update comment", details: err.message });
  }
});

// Delete a comment

router.delete("/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }
    // ❗ Only allow the user who created the comment to delete it
    if (comment.UserId !== userId) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this comment" });
    }
    await comment.destroy();
    res.json({ message: "Comment deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete comment", details: err.message });
  }
});

module.exports = router;
