import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});

// 🔐 Attach token EVERY request
API.interceptors.request.use(
  (req) => {
    const token = localStorage.getItem("token"); // Student
    const staffToken = localStorage.getItem("staffToken"); // Staff
    const adminToken = localStorage.getItem("adminToken"); // Admin

    // ✅ FIX: Prioritize checking all token types
    const activeToken = token || staffToken || adminToken;

    if (activeToken) {
      req.headers.Authorization = `Bearer ${activeToken}`;
    }

    return req;
  },
  (error) => Promise.reject(error)
);

export default API;
