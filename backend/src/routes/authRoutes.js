const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

// 🔹 Register
router.post("/register", registerUser);

// 🔹 Login
router.post("/login", loginUser);

// 🔹 Get current user
router.get("/me", protect, async (req, res) => {
  try {
    res.status(200).json(req.user); // already attached by protect
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
