const asyncHandler = require("../utils/asyncHandler");
const { verifyToken } = require("../utils/jwt");
const User = require("../model/userModel");

const authMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const decoded = verifyToken(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  req.user = user; 
  
  next();
});

module.exports = authMiddleware;
