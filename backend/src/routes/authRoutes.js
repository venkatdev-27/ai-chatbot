const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

/* ---------------- AUTH ROUTES ---------------- */

// 🔹 Register user
router.post("/register", registerUser);

// 🔹 Login user
router.post("/login", loginUser);

// 🔹 Get current logged-in user
router.get("/me", protect, (req, res) => {
  res.status(200).json(req.user);
});

module.exports = router;
