import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Briefcase,
  Calendar,
  Users,
  FolderKanban,
} from "lucide-react";

import { toast } from "react-toastify";

const Navbar = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");

    toast.success("Logged out successfully 👋", {
      autoClose: 1500,
    });

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition-all"
    >
      {Icon && <Icon size={18} />}
      {children}
    </Link>
  );

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 dark:bg-[#0d1117]/80 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black">
            BVC
          </div>
          <span className="text-xl font-black text-slate-900 dark:text-white">
            Digital<span className="text-blue-600">Hub</span>
          </span>
        </div>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-4">
          {!token ? (
            <>
              <Link
                to="/login"
                className="font-bold text-slate-600 dark:text-slate-300"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <NavLink to="/home" icon={LayoutDashboard}>
                Home
              </NavLink>
              <NavLink to="/projects" icon={FolderKanban}>
                Projects
              </NavLink>
              <NavLink to="/staff" icon={Users}>
                Staff
              </NavLink>
              <NavLink to="/events" icon={Calendar}>
                Events
              </NavLink>
              <NavLink to="/jobs" icon={Briefcase}>
                Jobs
              </NavLink>
              <NavLink to="/profile" icon={User}>
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile */}
        <button
          className="md:hidden text-slate-900 dark:text-white"
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
