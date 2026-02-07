const jwt = require("jsonwebtoken");

const authHandler = (req, res, next) => {
  let token;
  
  // Check Authorization header first
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  
  // Fall back to cookies if Authorization header not present
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split("; ");
    const tokenCookie = cookies.find(c => c.startsWith("token="));
    if (tokenCookie) {
      token = tokenCookie.substring(6);
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("Authenticated user:", req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authHandler;
