import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useState, useEffect, Suspense, lazy } from "react";
import { ToastContainer } from "react-toastify";
import { Loader2 } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// Components
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute"; // For Students
import AdminProtectedRoute from "./admin/components/AdminProtectedRoute"; // For Admin

// Lazy Loaded Pages
const Landing = lazy(() => import("./pages/Landing"));
const Signup = lazy(() => import("./pages/Signup"));
const OTP = lazy(() => import("./pages/OTP"));
const Login = lazy(() => import("./pages/Login"));

// Staff Pages
const StaffLogin = lazy(() => import("./staff/components/StaffLogin"));
const StaffProfile = lazy(() => import("./staff/pages/StaffProfile"));

// Shared Pages
const Home = lazy(() => import("./pages/Home"));
const Projects = lazy(() => import("./pages/Projects"));
const Profile = lazy(() => import("./pages/Profile"));
const Staff = lazy(() => import("./pages/Staff"));
const Events = lazy(() => import("./pages/Events"));
const Jobs = lazy(() => import("./pages/Jobs"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const ProjectDetails = lazy(() => import("./pages/ProjectDetails"));
const EditProject = lazy(() => import("./pages/EditProject"));
const EventDetails = lazy(() => import("./pages/EventDetails"));
const JobApply = lazy(() => import("./pages/JobApply"));

// Admin Pages
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminUsers = lazy(() => import("./admin/pages/Users"));
const AdminStaff = lazy(() => import("./admin/pages/Staff"));
const AdminEvents = lazy(() => import("./admin/pages/Events"));
const AdminJobs = lazy(() => import("./admin/pages/Jobs"));
const UserDetails = lazy(() => import("./admin/pages/UserDetails"));

/**
 * ✅ SCROLL TO TOP HELPER
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

/**
 * ✅ GLOBAL LOADING COMPONENT
 */
const LoadingOverlay = ({ message = "Loading..." }) => (
  <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-white/60 dark:bg-[#030407]/80 backdrop-blur-sm transition-all">
    <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
    <p className="text-lg font-medium text-slate-600 dark:text-slate-300 animate-pulse">
      {message}
    </p>
  </div>
);

/**
 * ✅ PUBLIC ROUTE WRAPPER
 * Prevents logged-in users from accessing Login/Signup pages again.
 */
const PublicRoute = ({ children }) => {
  const isUser = localStorage.getItem("token");
  const isStaff = localStorage.getItem("staffToken");
  const isAdmin = localStorage.getItem("adminToken");

  if (isAdmin) return <Navigate to="/admin/dashboard" replace />;
  if (isUser || isStaff) return <Navigate to="/home" replace />;

  return children;
};

/**
 * ✅ UNIVERSAL ROUTE (Allows Staff OR Student)
 * Handles redirection intelligently based on the URL path.
 */
const UniversalProtectedRoute = ({ children }) => {
  const location = useLocation();
  const isUser = !!localStorage.getItem("token");
  const isStaff = !!localStorage.getItem("staffToken");
  const isAdmin = !!localStorage.getItem("adminToken");

  // If NO ONE is logged in, redirect based on where they were trying to go
  if (!isUser && !isStaff && !isAdmin) {
    // If trying to access Staff pages, go to Staff Login
    if (location.pathname.startsWith("/staff")) {
      return <Navigate to="/staff/login" replace />;
    }
    // If trying to access Admin pages, go to Admin Login
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    // Default: Go to Student Login
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * ✅ STAFF ONLY ROUTE
 */
const StaffProtectedRoute = ({ children }) => {
  const isStaff = !!localStorage.getItem("staffToken");
  if (!isStaff) {
    return <Navigate to="/staff/login" replace />;
  }
  return children;
};

/**
 * ✅ ROOT REDIRECTOR
 */
const RootRedirector = () => {
  const token = localStorage.getItem("token");
  const adminToken = localStorage.getItem("adminToken");
  const staffToken = localStorage.getItem("staffToken");

  if (adminToken) return <Navigate to="/admin/dashboard" replace />;
  if (staffToken) return <Navigate to="/home" replace />;
  if (token) return <Navigate to="/home" replace />;
  return <Landing />;
};

function App() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // 1. Theme Logic
    const html = document.documentElement;
    if (dark) {
      html.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      html.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }

    // 2. ✅ GLOBAL FIX: Intercept API calls and attach the correct token
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("token");
        const staffToken = localStorage.getItem("staffToken");
        const adminToken = localStorage.getItem("adminToken");

        // Prioritize: Student -> Staff -> Admin (or logic fitting your needs)
        // Usually, only one should exist at a time.
        const activeToken = token || staffToken || adminToken;

        if (activeToken) {
          config.headers.Authorization = `Bearer ${activeToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [dark]);

  return (
    <BrowserRouter>
      <ScrollToTop />

      <div
        className={`theme-liquid-transition min-h-screen flex flex-col ${
          dark ? "dark bg-[#030407]" : "bg-slate-50"
        }`}
      >
        {isProcessing && <LoadingOverlay message="Processing request..." />}

        {/* Theme Toggle Button */}
        <button
          onClick={() => setDark(!dark)}
          className="fixed bottom-8 right-8 z-[100] w-16 h-16 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-3xl border border-white/40 dark:border-white/10 flex items-center justify-center text-2xl cursor-pointer shadow-lg transition-all duration-1000 ease-in-out hover:scale-110 active:scale-90 group"
        >
          <div
            className={`relative z-10 transition-all duration-[1200ms] ${
              dark ? "rotate-0" : "rotate-[360deg]"
            }`}
          >
            {dark ? (
              <span className="drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]">
                ☀️
              </span>
            ) : (
              <span className="drop-shadow-[0_0_12px_rgba(129,140,248,0.8)]">
                🌙
              </span>
            )}
          </div>
        </button>

        <ToastContainer
          position="top-center"
          autoClose={1500}
          theme={dark ? "dark" : "light"}
        />

        <Suspense fallback={<LoadingOverlay message="Loading BVC Hub..." />}>
          <div className="flex-grow">
            <Routes>
              {/* ================= PUBLIC ROUTES ================= */}
              <Route path="/" element={<RootRedirector />} />

              <Route
                path="/signup"
                element={
                  <PublicRoute>
                    <Signup />
                  </PublicRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/staff/login"
                element={
                  <PublicRoute>
                    <StaffLogin />
                  </PublicRoute>
                }
              />

              <Route path="/otp" element={<OTP />} />
              <Route path="/onboarding" element={<Onboarding />} />

              {/* ================= ADMIN ROUTES ================= */}
              <Route
                path="/admin/login"
                element={
                  <PublicRoute>
                    <AdminLogin />
                  </PublicRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminProtectedRoute>
                    <AdminUsers />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/users/:id"
                element={
                  <AdminProtectedRoute>
                    <UserDetails />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/staff"
                element={
                  <AdminProtectedRoute>
                    <AdminStaff />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events"
                element={
                  <AdminProtectedRoute>
                    <AdminEvents />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs"
                element={
                  <AdminProtectedRoute>
                    <AdminJobs />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs/:id/view"
                element={
                  <AdminProtectedRoute>
                    <JobDetails />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/events/:id/view"
                element={
                  <AdminProtectedRoute>
                    <EventDetails />
                  </AdminProtectedRoute>
                }
              />
              <Route
                path="/admin/jobs/:id/view"
                element={
                  <AdminProtectedRoute>
                    <JobDetails />
                  </AdminProtectedRoute>
                }
              />

              {/* ================= SHARED ROUTES (Staff & Students) ================= */}

              <Route
                path="/home"
                element={
                  <UniversalProtectedRoute>
                    <Home />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <UniversalProtectedRoute>
                    <Projects />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/projects/:id"
                element={
                  <UniversalProtectedRoute>
                    <ProjectDetails />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/projects/edit/:id"
                element={
                  <UniversalProtectedRoute>
                    <EditProject />
                  </UniversalProtectedRoute>
                }
              />

              {/* ✅ Staff Listing Page */}
              <Route
                path="/staff"
                element={
                  <UniversalProtectedRoute>
                    <Staff />
                  </UniversalProtectedRoute>
                }
              />

              <Route
                path="/events"
                element={
                  <UniversalProtectedRoute>
                    <Events />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/events/:id"
                element={
                  <UniversalProtectedRoute>
                    <EventDetails />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <UniversalProtectedRoute>
                    <Jobs />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id"
                element={
                  <UniversalProtectedRoute>
                    <JobDetails />
                  </UniversalProtectedRoute>
                }
              />
              <Route
                path="/jobs/:id/apply"
                element={
                  <UniversalProtectedRoute>
                    <JobApply />
                  </UniversalProtectedRoute>
                }
              />

              {/* ================= PROFILE ROUTES ================= */}

              {/* Student Only */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Staff Only */}
              <Route
                path="/staff/profile"
                element={
                  <StaffProtectedRoute>
                    <StaffProfile />
                  </StaffProtectedRoute>
                }
              />

              <Route path="*" element={<RootRedirector />} />
            </Routes>
          </div>
          <Footer />
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
