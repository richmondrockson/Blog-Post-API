const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();

const signup = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Check if user exist
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.status(201).json({
      message: "User created",
      user: { id: user.id, username, email },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login controller function
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user in the DB with a provided email
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email }, // Payload
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };
