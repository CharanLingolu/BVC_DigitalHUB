import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";
import { toast } from "react-toastify";
import { Camera } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(false);

  // Profile pic states
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  // Add project states
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: "",
    description: "",
    repoLink: "",
    files: [],
  });

  const [formData, setFormData] = useState({
    department: "",
    year: "",
    rollNumber: "",
    bio: "",
    skills: "",
  });

  /* ================= FETCH PROFILE ================= */

  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/me");
      setUser(res.data);
      setPreview(res.data.profilePic || null);

      setFormData({
        department: res.data.department || "",
        year: res.data.year || "",
        rollNumber: res.data.rollNumber || "",
        bio: res.data.bio || "",
        skills: (res.data.skills || []).join(", "),
      });
    } catch {
      toast.error("Failed to load profile");
    }
  };

  /* ================= FETCH PROJECTS ================= */

  const fetchMyProjects = async () => {
    try {
      const res = await API.get("/projects/my");
      setProjects(res.data);
    } catch {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchMyProjects();
  }, []);

  /* ================= UPDATE PROFILE ================= */

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "skills") {
          data.append(
            key,
            JSON.stringify(value.split(",").map((s) => s.trim()))
          );
        } else {
          data.append(key, value);
        }
      });

      if (profilePic) {
        data.append("profilePic", profilePic);
      }

      await API.put("/users/me", data);

      toast.success("Profile updated");
      setEditing(false);
      fetchProfile();
    } catch {
      toast.error("Update failed");
    }
  };

  /* ================= CREATE PROJECT ================= */

  const handleCreateProject = async () => {
    if (!projectForm.title || !projectForm.description) {
      return toast.error("Title and description required");
    }

    const data = new FormData();
    data.append("title", projectForm.title);
    data.append("description", projectForm.description);
    data.append("repoLink", projectForm.repoLink);

    Array.from(projectForm.files).forEach((file) => {
      data.append("media", file);
    });

    try {
      setUploading(true);
      await API.post("/projects", data);
      toast.success("Project added");
      setShowProjectModal(false);
      setProjectForm({ title: "", description: "", repoLink: "", files: [] });
      fetchMyProjects();
    } catch {
      toast.error("Project upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 pb-12 pt-28">
        {/* ================= PROFILE HEADER ================= */}
        {user && (
          <div className="relative mb-14 bg-white dark:bg-[#161b22] rounded-3xl shadow-xl overflow-hidden">
            <div className="h-36 bg-gradient-to-r from-blue-600 to-indigo-600" />

            <div className="px-8 pb-10">
              <div className="flex flex-col md:flex-row items-center gap-6 mt-6 mb-8">
                {/* PROFILE PIC */}
<div className="relative -mt-20 md:-mt-24">
  <div className="w-32 h-32 rounded-2xl bg-white dark:bg-[#0d1117] p-2 shadow-lg">
    <div className="w-full h-full rounded-xl overflow-hidden flex items-center justify-center bg-blue-100 dark:bg-blue-900/30">
      {preview ? (
        <img
          src={preview}
          alt="profile"
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-5xl font-black text-blue-600">
          {user.name.charAt(0)}
        </span>
      )}
    </div>
  </div>

  {/* CAMERA ICON */}
  <label
    htmlFor="profilePic"
    className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 p-2 rounded-full cursor-pointer shadow-lg transition"
  >
    <Camera className="w-4 h-4 text-white" />
  </label>

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


                {/* INFO */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-black">{user.name}</h1>
                  <p className="text-slate-500">{user.email}</p>
                </div>

                <button
                  onClick={() => setEditing(!editing)}
                  className="px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-600 hover:text-white"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <InfoItem label="Department" value={user.department || "—"} />
                <InfoItem label="Year" value={user.year || "—"} />
                <InfoItem label="Roll Number" value={user.rollNumber || "—"} />
              </div>

              <div className="mt-8">
                <h3 className="text-sm font-bold uppercase text-slate-400 mb-2">
                  About Me
                </h3>
                <p className="text-slate-600">{user.bio || "No bio added yet."}</p>
              </div>
            </div>
          </div>
        )}

        {/* ================= EDIT PROFILE ================= */}
        {editing && (
          <div className="mb-14 bg-white dark:bg-[#161b22] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-black mb-6">Update Profile</h2>

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
                placeholder="Skills"
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
                className="md:col-span-2 input"
              />

              <div className="md:col-span-2">
                <button className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ================= PROJECTS ================= */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black">My Projects</h2>
            <button
              onClick={() => setShowProjectModal(true)}
              className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl"
            >
              + Add Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-3xl border border-dashed">
              No projects yet.
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

      {/* ================= ADD PROJECT MODAL ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#161b22] p-6 rounded-xl w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Project</h2>

            <input
              className="input mb-3"
              placeholder="Project Title"
              value={projectForm.title}
              onChange={(e) =>
                setProjectForm({ ...projectForm, title: e.target.value })
              }
            />
            <textarea
              className="input mb-3 h-28"
              placeholder="Description"
              value={projectForm.description}
              onChange={(e) =>
                setProjectForm({
                  ...projectForm,
                  description: e.target.value,
                })
              }
            />
            <input
              className="input mb-3"
              placeholder="Repository Link"
              value={projectForm.repoLink}
              onChange={(e) =>
                setProjectForm({ ...projectForm, repoLink: e.target.value })
              }
            />
            <input
              type="file"
              multiple
              onChange={(e) =>
                setProjectForm({ ...projectForm, files: e.target.files })
              }
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => setShowProjectModal(false)}
                className="border px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                disabled={uploading}
                onClick={handleCreateProject}
                className="bg-green-600 px-4 py-2 rounded font-bold"
              >
                {uploading ? "Uploading..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ================= REUSABLE ================= */

const Input = ({ placeholder, value, onChange }) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full p-4 rounded-xl border bg-slate-50 dark:bg-[#0d1117]"
  />
);

const InfoItem = ({ label, value }) => (
  <div>
    <p className="text-sm uppercase tracking-wider text-slate-400 mb-1">
      {label}
    </p>
    <p className="text-lg font-bold">{value}</p>
  </div>
);

export default Profile;
