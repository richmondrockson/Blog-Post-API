const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");
const Post = require("./post");

const Comment = sequelize.define("Comment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

// Relationships
User.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(User);

Post.hasMany(Comment, { onDelete: "CASCADE" });
Comment.belongsTo(Post);

module.exports = Comment;
