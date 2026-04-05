const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES || "15m",
    }
  );
};

const createRefreshToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      type: "refresh",
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES || "7d",
    }
  );
};

module.exports = {
  createAccessToken,
  createRefreshToken,
};