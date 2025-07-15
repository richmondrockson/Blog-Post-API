const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db");
const User = require("./user");

const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Relationships
User.hasMany(Post, { onDelete: "CASCADE" });
Post.belongsTo(User);

module.exports = Post;
