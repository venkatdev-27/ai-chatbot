const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
   🔹 CORS CONFIG (FIXED)
   ========================= */
app.use(
  cors({
    origin: "http://localhost:5173", // ✅ frontend URL
    credentials: true,               // ✅ allow auth headers / cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* =========================
   🔹 BODY PARSERS
   ========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
   🔹 STATIC FILES
   ========================= */
/* =========================
   🔹 ROUTES
   ========================= */
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/conversations", require("./routes/conversationRoutes"));


/* =========================
   🔹 HEALTH CHECK
   ========================= */
app.get("/", (req, res) => {
  res.send("API is running...");
});

module.exports = app;
