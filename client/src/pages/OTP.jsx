import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const OTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/verify-otp", {
        email,
        otp,
      });

      toast.success(res.data.message);

// 🔐 STORE TOKEN
localStorage.setItem("token", res.data.token);

// ➡️ Go to onboarding
navigate("/onboarding");

    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  // Error State: No email found in navigation state
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] p-6">
        <div className="w-full max-w-md bg-white dark:bg-[#161b22] p-8 rounded-[2rem] shadow-2xl border border-red-100 dark:border-red-900/30 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">
            ⚠️
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
            Invalid Request
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            We couldn't find an email to verify. Please try signing up again.
          </p>
          <Link
            to="/signup"
            className="block w-full py-4 bg-slate-900 dark:bg-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-all"
          >
            Go to Signup
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d1117] p-6 transition-colors duration-500">
      {/* Background Decorative Element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-blue-600/10 blur-[120px] rounded-full -z-10"></div>

      <div className="w-full max-w-md bg-white dark:bg-[#161b22] p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6">
            📩
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-3">
            Verify OTP
          </h1>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Enter the 6-digit code we sent to <br />
            <span className="text-slate-900 dark:text-blue-400 font-bold">
              {email}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              className="w-full p-5 text-center text-2xl tracking-[0.5em] font-black rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 6}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Now"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Didn't receive the code?{" "}
            <button className="text-blue-600 font-bold hover:underline ml-1">
              Resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OTP;
