import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // only during app bootstrap
  const [error, setError] = useState(null);

  /* =========================
     🔹 LOAD USER ON APP START
  ========================= */
  useEffect(() => {
    try {
      const storedUser = authService.getCurrentUser();

      if (storedUser && storedUser.token) {
        setUser(storedUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Auth bootstrap failed:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /* =========================
     🔹 LOGIN
  ========================= */
  const login = useCallback(async (credentials) => {
    setError(null);

    try {
      const data = await authService.login(credentials);

      if (!data || !data.token) {
        throw new Error("Invalid login response");
      }

      setUser(data);
      return data;
    } catch (err) {
      const message = err?.message || "Login failed";
      setError(message);
      throw new Error(message);
    }
  }, []);

  /* =========================
     🔹 REGISTER
  ========================= */
  const register = useCallback(async (payload) => {
    setError(null);

    try {
      const data = await authService.register(payload);

      if (!data || !data.token) {
        throw new Error("Invalid register response");
      }

      setUser(data);
      return data;
    } catch (err) {
      const message = err?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    }
  }, []);

  /* =========================
     🔹 LOGOUT
  ========================= */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /* =========================
     🔹 CONTEXT VALUE
  ========================= */
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: Boolean(user?.token), // ✅ IMPORTANT
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
