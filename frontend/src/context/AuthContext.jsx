import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Load user from localStorage on app start
  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (err) {
      console.error("Failed to load user:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Login
  const login = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await authService.login(userData);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      const message = err?.message || "Login failed";
      setError(message);
      throw err; // 🔹 let component handle navigation
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Register
  const register = useCallback(async (userData) => {
    setLoading(true);
    setError(null);

    try {
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      return registeredUser;
    } catch (err) {
      const message = err?.message || "Registration failed";
      setError(message);
      throw err; // 🔹 IMPORTANT: do not wrap again
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Logout
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  // 🔹 Memoized context value
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      register,
      logout,
    }),
    [user, loading, error, login, register, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
