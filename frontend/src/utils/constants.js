export const API_URL = import.meta.env.VITE_API_URL;
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

// 🔹 Safety checks (dev-friendly)
if (!API_URL) {
  console.error("❌ VITE_API_URL is not defined in .env");
}

if (!SOCKET_URL) {
  console.error("❌ VITE_SOCKET_URL is not defined in .env");
}
