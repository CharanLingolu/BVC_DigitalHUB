import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  // ✅ Check for both User and Staff tokens
  const token = localStorage.getItem("token");
  const staffToken = localStorage.getItem("staffToken");
  const isAuthenticated = token || staffToken;

  if (
    !isAuthenticated &&
    (location.pathname === "/login" || location.pathname === "/staff/login")
  ) {
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
