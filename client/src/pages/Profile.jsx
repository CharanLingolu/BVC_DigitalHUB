import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  // Fetch profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);

      setFormData({
        department: res.data.department || "",
        year: res.data.year || "",
        rollNumber: res.data.rollNumber || "",
        bio: res.data.bio || "",
        skills: (res.data.skills || []).join(", "),
      });
    } catch {
      toast.error("Failed to load profile", {
        autoClose: 1500,
      });
    }
  };

  // Fetch projects
  const fetchMyProjects = async () => {
    try {
      const res = await API.get("/projects/my");
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects", {
        autoClose: 1500,
      });
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyProjects();
  }, []);

  // Update profile
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.put("/users/me", {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()),
      });
      toast.success("Profile updated", {
        autoClose: 1500,
      });
      setEditing(false);
      fetchProfile();
    } catch {
      toast.error("Update failed", {
        autoClose: 1500,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors duration-500">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pb-12 pt-28">
        {/* PROFILE HEADER */}
        {user && (
          <div className="relative mb-14 bg-white dark:bg-[#161b22] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
            {/* Header Gradient */}
            <div className="h-36 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <div className="px-8 pb-10">
              <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-8">
                {/* Avatar */}
                <div className="w-32 h-32 rounded-2xl bg-white dark:bg-[#0d1117] p-2 shadow-lg">
                  <div className="w-full h-full rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-5xl font-black text-blue-600">
                    {user.name.charAt(0)}
                  </div>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-black text-slate-900 dark:text-white">
                    {user.name}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {user.email}
                  </p>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* INFO GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoItem label="Department" value={user.department || "—"} />
                <InfoItem label="Year" value={user.year || "—"} />
                <InfoItem label="Roll Number" value={user.rollNumber || "—"} />
              </div>

              {/* BIO */}
              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
                  About Me
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {user.bio || "No bio added yet."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* EDIT PROFILE */}
        {editing && (
          <div className="mb-14 bg-white dark:bg-[#161b22] rounded-3xl p-8 shadow-2xl border border-blue-500/20">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Update Profile
            </h2>

            <form
              onSubmit={handleUpdate}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <Input
                placeholder="Department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />
              <Input
                placeholder="Year"
                value={formData.year}
                onChange={(e) =>
                  setFormData({ ...formData, year: e.target.value })
                }
              />
              <Input
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) =>
                  setFormData({ ...formData, rollNumber: e.target.value })
                }
              />
              <Input
                placeholder="Skills (React, Node)"
                value={formData.skills}
                onChange={(e) =>
                  setFormData({ ...formData, skills: e.target.value })
                }
              />
              <textarea
                rows="4"
                placeholder="Short bio..."
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
                className="
    md:col-span-2 w-full p-4 rounded-xl
    border border-slate-200 dark:border-slate-800
    bg-slate-50 dark:bg-[#0d1117]
    text-slate-900 dark:text-white
    placeholder:text-slate-400 dark:placeholder:text-slate-500
    focus:ring-2 focus:ring-blue-500
    outline-none resize-none
  "
              />

              <div className="md:col-span-2">
                <button className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PROJECTS */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              My Projects
            </h2>
            <span className="px-4 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold text-sm">
              {projects.length}
            </span>
          </div>

          {projects.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-[#161b22] rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">
                No projects yet. Start uploading your work!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project) => (
                <ProjectCard
                  key={project._id}
                  project={project}
                  refresh={fetchMyProjects}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const Input = ({ placeholder, value, onChange }) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="
  w-full p-4 rounded-xl
  border border-slate-200 dark:border-slate-800
  bg-slate-50 dark:bg-[#0d1117]
  text-slate-900 dark:text-white
  placeholder:text-slate-400 dark:placeholder:text-slate-500
  focus:ring-2 focus:ring-blue-500
  outline-none
"
  />
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm uppercase tracking-wider text-slate-400 mb-1">
      {label}
    </p>
    <p className="text-lg font-bold text-slate-900 dark:text-white">{value}</p>
  </div>
);

export default Profile;
