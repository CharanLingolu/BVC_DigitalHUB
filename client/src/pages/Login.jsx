import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      toast.success(res.data.message, {
        autoClose: 1500, // 2 seconds
      });

      setTimeout(() => {
        navigate("/home");
      }, 1800);
    } catch (error) {
      toast.error(error.response?.data?.message, {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] p-6 transition-colors duration-500">
      {/* 🔥 BACKGROUND ACCENTS — DARK MODE ONLY */}
      <div className="fixed inset-0 overflow-hidden -z-10 hidden dark:block">
        <div className="absolute top-[20%] right-[-5%] w-[35%] h-[35%] bg-blue-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-[30%] h-[30%] bg-purple-600/10 blur-[100px] rounded-full"></div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#161b22] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-500">
        {/* LEFT SIDE */}
        <div className="hidden lg:flex flex-col justify-center p-12 bg-gradient-to-br from-blue-700 to-indigo-800 dark:from-slate-900 dark:to-blue-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

          <div className="absolute top-10 left-10 text-xl font-bold tracking-tight z-10">
            BVC{" "}
            <span className="text-blue-300 dark:text-blue-400">DigitalHub</span>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-black mb-6 leading-tight">
              Welcome Back to the <br />
              <span className="text-blue-200 dark:text-blue-400">
                Student Hub.
              </span>
            </h2>

            <p className="text-blue-50 dark:text-slate-300 text-lg mb-8 leading-relaxed">
              Login to access your dashboard, track your placement progress, and
              showcase your latest academic breakthroughs.
            </p>

            <div className="flex items-center gap-4 text-sm font-medium text-blue-100 dark:text-slate-400">
              <span className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-blue-700 dark:border-slate-900 bg-blue-500 dark:bg-slate-700 flex items-center justify-center text-[10px]"
                  >
                    👤
                  </div>
                ))}
              </span>
              <span>Joined by 500+ BVC Students</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center bg-white dark:bg-[#161b22]">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
              Sign In
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              Enter your credentials to access your account.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 text-slate-700 dark:text-slate-300 ml-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                onChange={handleChange}
                className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl transition-all"
            >
              {loading ? "Authenticating..." : "Sign In"}
            </button>

            <div className="text-center mt-8">
              <p className="text-slate-500 dark:text-slate-400">
                New to the platform?{" "}
                <Link
                  to="/signup"
                  className="text-blue-600 dark:text-blue-400 font-extrabold hover:underline"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
