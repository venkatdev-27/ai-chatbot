const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// =========================
// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
// =========================
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 🔹 Validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Check email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 🔹 Check username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // 🔹 Create user
    const user = await User.create({
      username,
      email,
      password,
    });

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);

    // 🔹 Handle Mongo duplicate key error (safety net)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email or username already exists",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// =========================
// @desc    Authenticate user
// @route   POST /api/auth/login
// @access  Public
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Find user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Verify password
    const isPasswordValid = await user.matchPassword(password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 🔹 Generate token and return user data
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser };
