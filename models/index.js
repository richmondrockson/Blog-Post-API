const sequelize = require("../config/db");

const User = require("./user");
const Post = require("./post");
const Comment = require("./comment");

// Sync Models
// const syncDB = async () => {
//   try {
//     await sequelize.sync({ alter: true });
//     console.log("✅All Models synced");
//   } catch (err) {
//     console.error("❌Sync failed", err);
//   }

module.exports = { User, Post, Comment };
