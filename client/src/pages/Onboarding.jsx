import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const Onboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.put("/users/onboarding", {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      });

      toast.success("Profile completed successfully!", {
        autoClose: 1500,
      });
      navigate("/home");
    } catch {
      toast.error("Onboarding failed. Please check your details.", {
        autoClose: 1500,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-500">
      <Navbar />

      {/* FIX NAVBAR OVERLAP */}
      <div className="h-20" />

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-black shadow-lg shadow-blue-500/30 mb-5">
            3
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            This helps recruiters and faculty understand you better.
          </p>
        </div>

        {/* FORM CARD */}
        <div className="bg-white dark:bg-[#161b22] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            {/* SECTION: ACADEMIC */}
            <Section title="Academic Information">
              <Input
                label="Department"
                name="department"
                placeholder="e.g. Computer Science"
                onChange={handleChange}
                required
              />
              <Input
                label="Academic Year"
                name="year"
                placeholder="e.g. 3rd Year"
                onChange={handleChange}
                required
              />
            </Section>

            {/* SECTION: ID + SKILLS */}
            <Section title="Personal Details">
              <Input
                label="Roll Number"
                name="rollNumber"
                placeholder="e.g. 21BVC1234"
                onChange={handleChange}
                required
              />
              <Input
                label="Top Skills"
                name="skills"
                placeholder="React, Java, Python"
                onChange={handleChange}
              />
            </Section>

            {/* SECTION: BIO */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
                Professional Bio
              </label>
              <textarea
                name="bio"
                rows="4"
                placeholder="Tell us about your interests, goals, and achievements..."
                onChange={handleChange}
                className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-all dark:text-white"
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xl shadow-xl shadow-blue-500/30 transition-all active:scale-[0.99] disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <Spinner />
                  Setting up...
                </span>
              ) : (
                "Finish & Go to Dashboard →"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;

/* ---------- REUSABLE UI PARTS ---------- */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
      {label}
    </label>
    <input
      {...props}
      className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
    />
  </div>
);

const Spinner = () => (
  <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);
