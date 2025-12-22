import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/signup", formData);
      toast.success(res.data.message, {
        autoClose: 1500,
      });
      navigate("/otp", { state: { email: formData.email } });
    } catch (error) {
      toast.error(error.response?.data?.message, {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] overflow-hidden transition-colors duration-500">
      {/* DARK MODE BACKGROUND GLOW */}
      <div className="fixed inset-0 -z-10 hidden dark:block">
        <div className="absolute top-[25%] left-[-5%] w-[30%] h-[30%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[15%] right-[-5%] w-[35%] h-[35%] bg-indigo-600/10 blur-[120px] rounded-full" />
      </div>

      {/* MAIN CARD */}
      <div className="w-[95%] max-w-5xl h-[85vh] grid grid-cols-1 lg:grid-cols-2 bg-white dark:bg-[#161b22] rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-500">
        {/* LEFT PANEL */}
        <div className="hidden lg:flex flex-col justify-center px-12 py-10 bg-gradient-to-br from-blue-700 to-indigo-800 dark:from-slate-900 dark:to-blue-950 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

          <div className="relative z-10">
            <div className="text-xl font-bold mb-8">
              BVC <span className="text-blue-300">DigitalHub</span>
            </div>

            <h2 className="text-4xl font-black mb-5 leading-tight">
              Start Your Journey <br />
              <span className="text-blue-200">With Us.</span>
            </h2>

            <p className="text-blue-50 text-base mb-6 max-w-sm leading-relaxed">
              Create your account to explore projects, placements, faculty
              events, and campus opportunities.
            </p>

            <div className="space-y-3 text-sm font-medium text-blue-100">
              <div className="bg-white/10 p-3 rounded-xl">
                🚀 Fast Placement Tracking
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                🎓 Showcase Academic Innovation
              </div>
              <div className="bg-white/10 p-3 rounded-xl">
                🤝 Connect with Faculty
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="px-8 py-10 md:px-12 lg:px-16 flex flex-col justify-center bg-white dark:bg-[#161b22]">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
              Create Account
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Enter your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              name="name"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none dark:text-white"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-lg shadow-xl transition-all"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center text-slate-500 dark:text-slate-400 text-sm pt-2">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
