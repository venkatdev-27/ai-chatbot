import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

if (!SOCKET_URL) {
  console.error("❌ VITE_SOCKET_URL is not defined");
}

// Create socket instance (do NOT connect yet)
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"], // important for Render
});

// Helper to connect socket with auth token
export const connectSocket = (token) => {
  if (!token) return;

  socket.auth = { token };
  socket.connect();
};

// Helper to disconnect cleanly
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
