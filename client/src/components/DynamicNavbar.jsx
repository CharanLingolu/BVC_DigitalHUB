import { useLocation } from "react-router-dom";
import AdminNavbar from "../admin/components/AdminNavbar";
import Navbar from "./Navbar";

const DynamicNavbar = () => {
  const location = useLocation();

  // Logic: If path starts with /admin AND admin is logged in, show AdminNavbar
  const isAdminPath = location.pathname.startsWith("/admin");
  const isAdminLoggedIn = localStorage.getItem("adminToken");

  if (isAdminPath && isAdminLoggedIn) {
    return <AdminNavbar />;
  }

  return <Navbar />;
};

export default DynamicNavbar;
