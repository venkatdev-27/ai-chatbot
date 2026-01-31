import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = () => {
  const location = useLocation();
  const auth = useContext(AuthContext);

  // Safety fallback (should never happen, but good practice)
  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const { user, loading } = auth;

  // 🔄 Wait until auth state is resolved
  if (loading) {
    return <Loader />;
  }

  // ❌ Not logged in → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // ✅ Authorized → render child routes
  return <Outlet />;
};

export default ProtectedRoute;
