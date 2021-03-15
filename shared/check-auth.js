const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);
  if (token == null)
    return res.status(401).json({
      error: "Unauthorized!",
    });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,(err,payload) => {
    if(err) return res.status(401).json({
      error: err,
    });
    req.userData = payload;
    next();
  });
};
