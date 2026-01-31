import api from "./axiosInstance";

// 🔹 Helper: store auth data safely
const setAuthData = (data) => {
  if (data?.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data));
  }
};

// 🔹 Register
const register = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);
    setAuthData(response.data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Registration failed",
      }
    );
  }
};

// 🔹 Login
const login = async (userData) => {
  try {
    const response = await api.post("/auth/login", userData);
    setAuthData(response.data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data || {
        message: "Login failed",
      }
    );
  }
};

// 🔹 Logout
const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// 🔹 Get current user
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default authService;
