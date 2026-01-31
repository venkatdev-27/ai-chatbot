import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // only for app boot
  const [error, setError] = useState(null);

  /* ---------------- LOAD USER ON APP START ---------------- */
  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser();
      if (storedUser?.token) {
        setUser(storedUser); // ✅ must include token
      }
    } catch (err) {
      console.error("Auth load failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ---------------- LOGIN ---------------- */
  const login = useCallback(async (credentials) => {
    setError(null);

    try {
      const data = await authService.login(credentials);

      // ✅ Ensure consistent shape
      if (!data?.token) {
        throw new Error("Invalid login response");
      }

      setUser(data);
      return data;
    } catch (err) {
      setError(err?.message || "Login failed");
      throw err;
    }
  }, []);

  /* ---------------- REGISTER ---------------- */
  const register = useCallback(async (payload) => {
    setError(null);

    try {
      const data = await authService.register(payload);

      if (!data?.token) {
        throw new Error("Invalid register response");
      }

      setUser(data);
      return data;
    } catch (err) {
      setError(err?.message || "Registration failed");
      throw err;
    }
  }, []);

  /* ---------------- LOGOUT ---------------- */
  const logout = useCallback(() => {
    authService.logout(); // clears localStorage
    setUser(null);
    setError(null);
  }, []);

  /* ---------------- CONTEXT VALUE ---------------- */
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user?.token, // ✅ VERY IMPORTANT
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
