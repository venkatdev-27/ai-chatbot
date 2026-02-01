require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");

// ✅ Express app
const app = require("./src/app");

// ✅ DB & socket handlers
const connectDB = require("./src/config/db");
const chatSocket = require("./src/sockets/chatSocket");

// 🔹 Environment
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "";

let server; // for graceful shutdown

const startServer = async () => {
  try {
    // 🔹 Connect DB first
    await connectDB();
    console.log("✅ MongoDB connected");

    // 🔹 Create HTTP server
    server = http.createServer(app);

    // 🔹 Socket.io setup (CORS FIXED)
    const io = new Server(server, {
      cors: {
        origin: CLIENT_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    console.log("🔹 Socket.io initialized with CORS origin:", CLIENT_URL);

    // 🔹 Socket connections
    io.on("connection", (socket) => {
      console.log("🟢 Client connected:", socket.id);

      chatSocket(io, socket);

      socket.on("disconnect", () => {
        console.log("🔴 Client disconnected:", socket.id);
      });
    });

    // 🔹 Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Allowed client: ${CLIENT_URL}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

// 🔹 Global error handling (REGISTER ONCE)
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// 🔹 Graceful shutdown (VERY IMPORTANT)
process.on("SIGINT", () => {
  console.log("🛑 SIGINT received. Shutting down gracefully...");
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
});

process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received. Shutting down gracefully...");
  if (server) {
    server.close(() => process.exit(0));
  } else {
    process.exit(0);
  }
});

startServer();
