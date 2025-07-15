const express = require("express");
const app = express();
require("dotenv").config;

const { connectDB, sequelize } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");

// Middlewares
app.use(express.json()); //Allows Express to automatically parse incoming JSON data
app.use(express.urlencoded({ extended: true })); //Allows Express to parse URL-encoded data

// Routes
app.use("/api/auth", authRoutes);
// app.use("/api/post", postRoutes);
app.use("/api/posts", postRoutes);

// Server
const PORT = process.env.PORT || 5004;
connectDB().then(() => {
  sequelize.sync().then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  });
});
