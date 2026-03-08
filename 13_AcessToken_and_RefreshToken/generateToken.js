const jwt = require('jsonwebtoken');
require("dotenv").config()

const generateAccessToken = (user) => {
    return jwt.sign({ _id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION });
}   

const generateRefreshToken = (user) => {    
    return jwt.sign({ _id: user._id, username: user.username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION });
}

module.exports = { generateAccessToken, generateRefreshToken }