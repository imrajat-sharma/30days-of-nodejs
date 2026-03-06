const express = require("express");
const app = express();
const User = require("./user.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("./generateToken");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password is required" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    await User.create({ username, password });
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "username and password is required" });
    }
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const safeUser = { _id: user._id, username: user.username };
    const accessToken = generateAccessToken(safeUser);
    const refreshToken = generateRefreshToken(safeUser);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
    return res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/refresh-token", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token not found" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded?._id);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isValid = user && user.refreshToken === refreshToken;
    if (!isValid) {
      return res.status(401).json({ message: "Refresh token invalid or revoked" });
    }
    const safeUser = { _id: user._id, username: user.username };

    const newRefreshToken = generateRefreshToken(safeUser);
    user.refreshToken = newRefreshToken;
    await user.save();
    res.cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });

    const newAccessToken = generateAccessToken(safeUser);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Refresh token error:", err.message);

    if (err.name === "TokenExpiredError") {
      return res.status(403).json({ message: "Refresh token has expired" });
    }

    if (err.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid refresh token signature" });
    }
    
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = app;
