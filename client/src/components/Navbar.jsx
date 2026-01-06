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
  ShieldCheck,
  ChevronRight,
  GraduationCap,
} from "lucide-react";
import { toast } from "react-toastify";

const Navbar = () => {
  // ✅ FIX: Check for BOTH tokens
  const token = localStorage.getItem("token");
  const staffToken = localStorage.getItem("staffToken");
  const isLoggedIn = !!token || !!staffToken; // True if either exists

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    // 1. Remove EVERY possible auth key
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // CRITICAL: This is what Jobs.jsx checks
    localStorage.removeItem("staffToken");
    localStorage.removeItem("adminToken");
    localStorage.removeItem("staffData");
    localStorage.removeItem("userData");

    toast.success("Logged out successfully 👋", { autoClose: 1000 });

    // 2. FORCE a hard refresh instead of navigate
    setTimeout(() => {
      window.location.href = "/"; // This destroys the cached React state
    }, 1000);
  };

  const NavLink = ({ to, children, icon: Icon }) => (
    <Link
      to={to}
      onClick={() => setOpen(false)}
      className="group flex items-center gap-2.5 px-4 py-2.5 rounded-full
      text-sm font-medium text-slate-600 dark:text-slate-300
      transition-all duration-300
      hover:bg-indigo-50 dark:hover:bg-white/5
      hover:text-indigo-600 dark:hover:text-indigo-400"
    >
      <Icon
        size={18}
        className="text-slate-400 group-hover:text-indigo-500
        group-hover:scale-110 group-hover:-rotate-12 transition-all"
      />
      {children}
    </Link>
  );

  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-[60]">
        <div className="absolute inset-0 bg-white/70 dark:bg-[#05070a]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 shadow-sm" />

        <div className="relative max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          {/* LOGO */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate(isLoggedIn ? "/home" : "/")}
          >
            <div className="group relative w-12 h-12 flex items-center justify-center cursor-pointer transition-transform duration-500">
              <div
                className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl rotate-3 shadow-lg 
                  transition-all duration-700 ease-in-out 
                  group-hover:rotate-[360deg] group-hover:scale-110 group-hover:shadow-indigo-500/50"
              />

              <span className="relative z-10 text-white font-black text-lg transition-transform duration-500 group-hover:scale-110">
                BVC
              </span>
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              Digital{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Hub
              </span>
            </span>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center gap-4">
            {/* ✅ FIX: Use isLoggedIn instead of just token */}
            {!isLoggedIn ? (
              <>
                {/* Log In */}
                <Link
                  to="/login"
                  className="relative text-sm font-bold text-slate-600 dark:text-slate-300
                  transition-all duration-300
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0
                  after:bg-indigo-500 after:rounded-full
                  after:transition-all after:duration-300
                  hover:after:w-full"
                >
                  Log In
                </Link>

                {/* Sign Up */}
                <Link
                  to="/signup"
                  className="px-6 py-2.5 rounded-xl
                  bg-gradient-to-r from-blue-600 to-indigo-600
                  text-white font-bold text-sm
                  shadow-lg shadow-blue-500/25
                  transition-all duration-300
                  hover:shadow-indigo-500/50
                  hover:-translate-y-0.5
                  active:scale-95"
                >
                  Sign Up
                </Link>

                {/* Staff Login */}
                <Link
                  to="/staff/login"
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl
                  border border-slate-200 dark:border-white/10
                  text-slate-600 dark:text-slate-400
                  font-bold text-sm
                  transition-all duration-300
                  hover:border-indigo-400/60
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  hover:bg-indigo-50/50 dark:hover:bg-white/5
                  hover:shadow-md
                  hover:-translate-y-0.5"
                >
                  <GraduationCap
                    size={16}
                    className="transition-all duration-300
                    group-hover:text-indigo-500
                    group-hover:scale-110"
                  />
                  Faculty
                </Link>

                {/* Admin */}
                <Link
                  to="/admin/login"
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl
                  border border-slate-200 dark:border-white/10
                  text-slate-600 dark:text-slate-400
                  font-bold text-sm
                  transition-all duration-300
                  hover:border-indigo-400/60
                  hover:text-indigo-600 dark:hover:text-indigo-400
                  hover:bg-indigo-50/50 dark:hover:bg-white/5
                  hover:shadow-md
                  hover:-translate-y-0.5"
                >
                  <ShieldCheck
                    size={16}
                    className="transition-all duration-300
                    group-hover:text-indigo-500
                    group-hover:scale-110"
                  />
                  Admin
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-1 p-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-slate-200/50 dark:border-white/5">
                <NavLink to="/home" icon={LayoutDashboard}>
                  Home
                </NavLink>
                <NavLink to="/projects" icon={FolderKanban}>
                  Projects
                </NavLink>
                <NavLink to="/staff" icon={Users}>
                  Faculty
                </NavLink>
                <NavLink to="/events" icon={Calendar}>
                  Events
                </NavLink>
                <NavLink to="/jobs" icon={Briefcase}>
                  Jobs
                </NavLink>

                {/* ✅ FIX: Smart Profile Link */}
                <Link
                  to={staffToken ? "/staff/profile" : "/profile"}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10"
                >
                  <User size={20} />
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full 
                  bg-red-50 dark:bg-red-500/10 
                  text-red-600 dark:text-red-400 font-bold
                  transition-all duration-200 ease-in-out
                  hover:bg-red-100 dark:hover:bg-red-500/20 
                  hover:scale-[1.02] active:scale-95"
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 flex items-center justify-center"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* MOBILE OVERLAY */}
      <div
        className={`fixed inset-0 z-[55] bg-slate-900/40 backdrop-blur-md md:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* MOBILE DRAWER – GLOSSY MODERN STYLE */}
      <div
        className={`fixed inset-x-4 top-[5.5rem] z-[70] md:hidden transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${
          open
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-12 scale-90 pointer-events-none"
        }`}
      >
        {/* ✅ FIX: Modern Light/Dark Glass Background */}
        <div className="relative overflow-hidden bg-white/80 dark:bg-[#121212]/90 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/60 dark:border-white/10 p-6 transition-colors duration-500">
          {/* Subtle Ambient Glows (Blue/Purple for modern feel) */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 dark:bg-indigo-500/10 blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 dark:bg-rose-500/10 blur-[80px] pointer-events-none" />

          {!isLoggedIn ? (
            <div className="space-y-4 relative z-10">
              {/* Log In */}
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between p-5 rounded-[1.8rem] bg-slate-50/80 dark:bg-white/5 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white transition-all duration-300 hover:bg-white dark:hover:bg-white/10 active:scale-[0.97] group"
              >
                <span className="text-lg font-bold tracking-tight">Log In</span>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-white/5 flex items-center justify-center shadow-sm dark:shadow-none group-hover:scale-110 transition-all">
                  <ChevronRight
                    size={20}
                    className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-white transition-colors"
                  />
                </div>
              </Link>

              {/* Sign Up */}
              <Link
                to="/signup"
                onClick={() => setOpen(false)}
                className="relative flex items-center justify-center p-5 rounded-[1.8rem] bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg shadow-lg shadow-blue-500/30 transition-all duration-300 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:scale-[0.95]"
              >
                <span className="relative">Sign Up Now</span>
              </Link>

              {/* Access Links */}
              <div className="grid grid-cols-2 gap-3 mt-2">
                <Link
                  to="/staff/login"
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[1.8rem] border border-dashed border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 font-bold transition-all active:scale-[0.97]"
                >
                  <GraduationCap size={24} />
                  <span className="text-sm">Faculty</span>
                </Link>

                <Link
                  to="/admin/login"
                  onClick={() => setOpen(false)}
                  className="flex flex-col items-center justify-center gap-2 p-4 rounded-[1.8rem] border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 font-bold transition-all active:scale-[0.97]"
                >
                  <ShieldCheck size={22} />
                  <span className="text-sm">Admin</span>
                </Link>
              </div>
            </div>
          ) : (
            /* Logged In Grid */
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    to: "/home",
                    label: "Home",
                    icon: LayoutDashboard,
                    color:
                      "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20",
                  },
                  {
                    to: "/projects",
                    label: "Projects",
                    icon: FolderKanban,
                    color:
                      "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-100 dark:border-indigo-500/20",
                  },
                  {
                    to: "/staff",
                    label: "Faculty",
                    icon: Users,
                    color:
                      "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-100 dark:border-purple-500/20",
                  },
                  {
                    to: "/events",
                    label: "Events",
                    icon: Calendar,
                    color:
                      "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border-orange-100 dark:border-orange-500/20",
                  },
                  {
                    to: "/jobs",
                    label: "Jobs",
                    icon: Briefcase,
                    color:
                      "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
                  },
                  {
                    to: staffToken ? "/staff/profile" : "/profile",
                    label: "Profile",
                    icon: User,
                    color:
                      "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
                  },
                ].map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex flex-col gap-3 p-4 rounded-[2rem] border ${item.color
                      .split(" ")
                      .slice(2)
                      .join(
                        " "
                      )} bg-white/50 dark:bg-white/5 transition-all duration-300 hover:scale-[1.02] active:scale-[0.95]`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center ${item.color
                        .split(" ")
                        .slice(0, 2)
                        .join(" ")}`}
                    >
                      <item.icon size={22} />
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white text-sm tracking-tight">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Sign Out */}
              <button
                onClick={() => {
                  setOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-3 p-5 rounded-[1.8rem] bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 font-black transition-all duration-300 hover:bg-red-100 dark:hover:bg-red-500/20 active:scale-[0.95]"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
