import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // ✅ Check for both User and Staff tokens
  const token = localStorage.getItem("token");
  const staffToken = localStorage.getItem("staffToken");
  const isAuthenticated = token || staffToken;

  // Already on login page → do nothing
  // (Adding /staff/login check here for safety)
  if (
    !isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/staff/login")
  ) {
    return children;
  }

  // Not logged in → redirect to student/user login by default
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in (as either User or Staff) → allow access
  return children;
};

export default ProtectedRoute;
