import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import OTP from "./pages/OTP";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";
import Events from "./pages/Events";
import Jobs from "./pages/Jobs";
import Onboarding from "./pages/Onboarding";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  // ✅ SINGLE SOURCE OF TRUTH
  const [dark, setDark] = useState(false);

  // ✅ Apply theme to <html>
  useEffect(() => {
    const html = document.documentElement;
    dark ? html.classList.add("dark") : html.classList.remove("dark");
  }, [dark]);

  return (
    <BrowserRouter>
      {/* 🌙 GLOBAL THEME TOGGLE */}
      <button
        onClick={() => setDark(!dark)}
        className="
          fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full
          bg-white dark:bg-slate-800
          border border-slate-200 dark:border-slate-700
          shadow-lg flex items-center justify-center text-xl
        "
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {/* ✅ TOAST THEME SYNCED */}
      <ToastContainer position="top-center" theme={dark ? "dark" : "light"} />

      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* PROTECTED */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/projects"
          element={
            <ProtectedRoute>
              <Projects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/jobs"
          element={
            <ProtectedRoute>
              <Jobs />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
