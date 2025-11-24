import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../services/authService";

function ProtectedRoute({ children, requiredRole }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const user = getCurrentUser();
    if (user.role !== requiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;