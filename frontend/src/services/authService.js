import api from "./axiosInstance";

// 🔹 Store auth data safely
const setAuthData = (data) => {
  if (!data?.token) return;

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data));
};

// 🔹 Register
const register = async (userData) => {
  try {
    const { data } = await api.post("/auth/register", userData);
    setAuthData(data);
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Registration failed"
    );
  }
};

// 🔹 Login
const login = async (userData) => {
  try {
    const { data } = await api.post("/auth/login", userData);
    setAuthData(data);
    return data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Login failed"
    );
  }
};

// 🔹 Logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 🔹 Get current user safely
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    logout(); // 🔹 auto-clean corrupted storage
    return null;
  }
};

export default {
  register,
  login,
  logout,
  getCurrentUser,
};
