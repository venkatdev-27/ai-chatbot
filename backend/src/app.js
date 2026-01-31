const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   🔹 ENV
========================= */
const CLIENT_URL =
  process.env.CLIENT_URL || "http://localhost:5173";

/* =========================
   🔹 CORS CONFIG (FIXED)
========================= */
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Handle preflight explicitly (important for Render)
app.options("*", cors());

/* =========================
   🔹 BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   🔹 API ROUTES
========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));

/* =========================
   🔹 HEALTH CHECK
========================= */
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running");
});

module.exports = app;
