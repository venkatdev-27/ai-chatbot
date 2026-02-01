const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   🔹 ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "http://localhost:5173",                  // local Vite
  "http://localhost:5175",                  // local alt port
  "http://localhost:3000",                  // CRA
  "https://vooc-ai.onrender.com",            // ✅ ADD REAL FRONTEND
];


const CLIENT_URL = process.env.CLIENT_URL;

/* =========================
   🔹 CORS CONFIG (MULTI ORIGIN)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // ✅ Allow Postman, curl, server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ CORS blocked:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],   
  })
);

// ✅ VERY IMPORTANT FOR RENDER / BROWSERS
app.options("*", cors());

/* =========================
   🔹 BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
  res.status(200).send("✅ API is running");
});

module.exports = app;
