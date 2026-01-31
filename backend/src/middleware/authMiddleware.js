const jwt = require("jsonwebtoken");
const User = require("../models/User");

/* =========================
   🔐 Protect Routes Middleware
========================= */
const protect = async (req, res, next) => {
  let token;

  try {
    // ✅ Check Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach user (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    }

    // ❌ No token
    return res.status(401).json({ message: "Not authorized, no token" });
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};

/* =========================
   👑 Admin Middleware
========================= */
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Admin only.",
  });
};

module.exports = { protect, admin };
