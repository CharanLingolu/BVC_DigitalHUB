import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();

      data.append("department", formData.department);
      data.append("year", formData.year);
      data.append("rollNumber", formData.rollNumber);
      data.append("bio", formData.bio);
      data.append(
        "skills",
        JSON.stringify(
          formData.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      await API.put("/users/onboarding", data);

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
      <div className="h-20" />

      <main className="max-w-4xl mx-auto px-6 pb-20">
        {/* HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 text-white text-2xl font-black shadow-lg mb-5">
            3
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">
            Complete Your Profile
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            This helps recruiters and faculty understand you better.
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white dark:bg-[#161b22] rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-10">

            {/* PROFILE PIC (CENTERED) */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 bg-slate-100 dark:bg-[#0d1117] shadow-lg">
                  <div className="w-full h-full flex items-center justify-center">
  {preview ? (
    <img
      src={preview}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <span className="text-slate-400 text-sm font-semibold">
      Upload
    </span>
  )}
</div>

                </div>

                {/* Camera Icon */}
                <label
                  htmlFor="profilePic"
                  className="
                    absolute bottom-2 right-2
                    bg-blue-600 hover:bg-blue-700
                    p-2 rounded-full cursor-pointer
                    shadow-lg transition
                  "
                >
                  <Camera className="w-5 h-5 text-white" />
                </label>

                {/* Hidden Input */}
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setProfilePic(file);
                      setPreview(URL.createObjectURL(file));
                    }
                  }}
                />
              </div>
            </div>

            {/* ACADEMIC */}
            <Section title="Academic Information">
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
                <option value="CIVIL">CIVIL</option>
              </select>

              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="input"
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </Section>

            {/* PERSONAL */}
            <Section title="Personal Details">
              <Input
                label="Roll Number"
                name="rollNumber"
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

            {/* BIO */}
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Professional Bio
              </label>
              <textarea
                name="bio"
                rows="4"
                onChange={handleChange}
                className="
                  w-full p-4 rounded-xl border
                  border-slate-200 dark:border-slate-800
                  bg-slate-50 dark:bg-[#0d1117]
                  focus:ring-2 focus:ring-blue-500
                  outline-none resize-none
                  dark:text-white
                "
              />
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full py-5 bg-blue-600 hover:bg-blue-700
                text-white rounded-2xl font-black text-xl
                shadow-xl shadow-blue-500/30
                transition-all disabled:opacity-70
              "
            >
              {loading ? "Setting up..." : "Finish & Go to Dashboard →"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Onboarding;

/* ---------- REUSABLE UI ---------- */

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6">
      {title}
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {children}
    </div>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="space-y-2">
    <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
      {label}
    </label>
    <input
      {...props}
      className="
        w-full p-4 rounded-xl border
        border-slate-200 dark:border-slate-800
        bg-slate-50 dark:bg-[#0d1117]
        focus:ring-2 focus:ring-blue-500
        outline-none transition-all
        dark:text-white
      "
    />
  </div>
);
