const User = require("../models/User");
const jwt = require("jsonwebtoken");

/* =========================
   🔹 Generate JWT Token
========================= */
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
};

/* =========================
   🔹 Register User
   POST /api/auth/register
========================= */
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Normalize email
    const normalizedEmail = email.toLowerCase();

    // ✅ Check duplicates
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // ✅ Create user (password hashed in model)
    const user = await User.create({
      username,
      email: normalizedEmail,
      password,
    });

    // ✅ Response
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: "Registration failed. Please try again.",
    });
  }
};

/* =========================
   🔹 Login User
   POST /api/auth/login
========================= */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase();

    // ✅ Find user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !(await user.matchPassword(password))) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    // ✅ Success
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic || null,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Login failed. Please try again.",
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
