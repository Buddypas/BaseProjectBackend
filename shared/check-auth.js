const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(403).json({
      status: 403,
      error: "no-token-added",
      message: "No access token provided!",
    });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err)
      return res.status(401).json({
        status: 401,
        error: "invalid-token",
        message: "Invalid token!",
      });
    req.userData = payload;
    next();
  });
};
