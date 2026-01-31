import api from "./axiosInstance";

/* =========================
   🔹 Helper: store auth data
========================= */
const setAuthData = (data) => {
  if (!data || !data.token) {
    throw new Error("Invalid auth response");
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
};

/* =========================
   🔹 Register
========================= */
const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    setAuthData(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Registration failed"
    );
  }
};

/* =========================
   🔹 Login
========================= */
const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);

    setAuthData(response.data);
    return response.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message ||
      error?.message ||
      "Login failed"
    );
  }
};

/* =========================
   🔹 Logout
========================= */
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

/* =========================
   🔹 Get current user
========================= */
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!user || !token) return null;

    return JSON.parse(user);
  } catch (error) {
    // 🔴 Corrupted storage → cleanup
    logout();
    return null;
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
