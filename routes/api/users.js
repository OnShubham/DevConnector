const express = require("express");
const router = express.Router();

// @route   GET api/users
// @desc    register user
// @access  Public

router.post("/", (req, res) => {
  res.send("users route");
});

module.exports = router;
