const express = require("express");
const cors = require("cors");

const app = express();

/* =========================
   🔹 ALLOWED ORIGINS
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5175",
  "http://localhost:3000",
  "https://ai-chatbot-mern-6ph8.onrender.com",
  "https://your-frontend-domain.onrender.com",
];

/* =========================
   🔹 CORS CONFIG (MULTI ORIGIN)
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman / curl / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(
          new Error(`CORS blocked for origin: ${origin}`)
        );
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔹 Preflight (important)
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
