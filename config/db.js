const { Sequelize } = require("sequelize");
require("dotenv").config();

// Setting up database connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Function to authenticate DB connection
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅Database connected successfully.");
  } catch (error) {
    console.error("❌Connection failed", err);
  }
};

module.exports = { sequelize, connectDB };
