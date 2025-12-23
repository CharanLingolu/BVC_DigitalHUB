import { NavLink, useNavigate } from "react-router-dom";

const AdminNavbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0d1117] text-white flex items-center justify-between px-8 shadow z-50">
      <h1 className="font-black text-lg tracking-wide">
        BVC Admin Panel
      </h1>

      <div className="flex gap-6 items-center">
        <NavLink to="/admin/dashboard" className="hover:text-blue-400">
          Dashboard
        </NavLink>
        <NavLink to="/admin/users" className="hover:text-blue-400">
          Users
        </NavLink>
        <NavLink to="/admin/staff" className="hover:text-blue-400">
          Staff
        </NavLink>
        <NavLink to="/admin/events" className="hover:text-blue-400">
          Events
        </NavLink>
        <NavLink to="/admin/jobs" className="hover:text-blue-400">
          Jobs
        </NavLink>

        <button
          onClick={logout}
          className="bg-red-600 px-4 py-1.5 rounded-lg font-bold"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
