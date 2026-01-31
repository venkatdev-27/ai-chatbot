import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_URL is not defined");
}

const api = axios.create({
  baseURL: `${BASE_URL}/api`, // ✅ IMPORTANT
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 🔹 Request interceptor → attach JWT (but not for auth endpoints)
api.interceptors.request.use(
  (config) => {
    // Don't attach token for auth endpoints (login/register)
    if (!config.url.includes("/auth/")) {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response interceptor → handle auth errors safely
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const path = window.location.pathname;

    // ✅ Avoid redirect loop on login/register
    if (status === 401 && !["/login", "/register"].includes(path)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
