const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    
    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (decoded.type !== "access") {
      return res.status(401).json({
        message: "Invalid access token",
      });
    }

    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Token invalid or expired",
    });
  }
};

module.exports = { protect };