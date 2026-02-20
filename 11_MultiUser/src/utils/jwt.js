const jwt = require('jsonwebtoken');

const signToken = (payload, secret, options) => {
  return jwt.sign(payload, secret, options);
}

const verifyToken = (token, secret, options) => {
  return jwt.verify(token, secret, options);
}

module.exports = {
  signToken,
  verifyToken
}