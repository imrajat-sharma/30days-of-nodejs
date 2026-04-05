const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const RefreshToken = require("../models/RefreshToken");
const { createAccessToken, createRefreshToken } = require("../utils/token");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

/*
  REGISTER
*/
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Registration failed",
      error: error.message,
    });
  }
});

/*
  LOGIN
*/
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    const decodedRefresh = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    await RefreshToken.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(decodedRefresh.exp * 1000),
    });

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
});

/*
  REFRESH TOKEN
  - verify refresh token
  - check in DB
  - rotate it
*/
router.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    let decoded;

    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Invalid or expired refresh token",
      });
    }

    if (decoded.type !== "refresh") {
      return res.status(401).json({
        message: "Invalid token type",
      });
    }

    const storedToken = await RefreshToken.findOne({ token: refreshToken });

    if (!storedToken) {
      return res.status(401).json({
        message: "Refresh token not found in database",
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    // rotate old refresh token
    await RefreshToken.deleteOne({ _id: storedToken._id });

    const newAccessToken = createAccessToken(user);
    const newRefreshToken = createRefreshToken(user);

    const decodedNewRefresh = jwt.verify(
      newRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    await RefreshToken.create({
      token: newRefreshToken,
      user: user._id,
      expiresAt: new Date(decodedNewRefresh.exp * 1000),
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Refresh failed",
      error: error.message,
    });
  }
});

/*
  LOGOUT
  - remove refresh token from DB
*/
router.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        message: "Refresh token is required",
      });
    }

    const deleted = await RefreshToken.findOneAndDelete({ token: refreshToken });

    if (!deleted) {
      return res.status(404).json({
        message: "Refresh token not found",
      });
    }

    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
});

/*
  PROTECTED ROUTE
*/
router.get("/me", protect, async (req, res) => {
  return res.status(200).json({
    message: "Profile fetched successfully",
    user: req.user,
  });
});

module.exports = router;