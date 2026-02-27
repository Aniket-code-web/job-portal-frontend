import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // wait for auth

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export default ProtectedRoute;
