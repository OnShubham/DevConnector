const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");
  // console.log("token: ", token);
  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  // console.log("token: ", token);
  // Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwt"));
    // console.log("decoded: ", decoded);
    req.user = decoded.user;
    // console.log("req.user: ", req.user);
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
