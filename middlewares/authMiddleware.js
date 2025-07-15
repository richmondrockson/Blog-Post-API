const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes using jwt
const authenticateToken = (req, res, next) => {
  if (!JWT_SECRET) {
    return res
      .status(500)
      .json({ error: "JWT_SECRET is not defined in environment variables." });
  }
  // Get Authorization header from request
  const authHeader = req.headers["authorization"];

  // Extract the token from Bearer <token> format
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Access denied. Token missing." });
  }
  try {
    // Verify token using the secret key
    const decoded = jwt.verify(token.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authenticateToken;
