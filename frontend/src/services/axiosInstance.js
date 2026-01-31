import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

// 🔴 Warn clearly if env is missing
if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined. Check Render env variables.");
}

const api = axios.create({
  baseURL: BASE_URL, // ✅ DO NOT append /api here
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔹 Attach JWT automatically (except auth routes)
api.interceptors.request.use(
  (config) => {
    const isAuthRoute =
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/register");

    if (!isAuthRoute) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Handle auth expiry safely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const path = window.location.pathname;

    if (status === 401 && !["/login", "/register"].includes(path)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
