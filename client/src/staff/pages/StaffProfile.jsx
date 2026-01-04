import { useEffect, useState, useRef } from "react";
import Navbar from "../../components/Navbar";
import API from "../../services/api";
import {
  Mail,
  Briefcase,
  GraduationCap,
  Clock,
  Building2,
  BookOpen,
  UserCheck,
  Edit2,
  Save,
  X,
  Camera,
  Sparkles,
  Loader2,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";

// --- CONSTANTS ---
const DEPARTMENTS = ["CSE", "ECE", "EEE", "MECH", "CIVIL"];
const POSITIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "HOD",
];

// --- SKELETON LOADER ---
const ProfileSkeleton = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-[#030407] pt-28 pb-20 px-6 transition-colors duration-300">
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="relative h-48 rounded-[2.5rem] bg-slate-200 dark:bg-[#0d1117] border border-slate-300 dark:border-white/5 overflow-hidden animate-pulse" />
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-[2rem] bg-slate-200 dark:bg-[#0d1117] border border-slate-300 dark:border-white/5 animate-pulse"
          />
        ))}
      </div>
    </div>
  </div>
);

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

  // File Upload State
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Try to get fresh data from API first (Best Practice)
        // If that fails or isn't set up, fall back to local storage
        const localData = localStorage.getItem("staffData");

        // You can uncomment this if you want to force a refresh from DB on load:
        // const { data } = await API.get("/staff/auth/profile");
        // setStaff(data); setFormData(data);

        if (localData) {
          const parsed = JSON.parse(localData);
          setStaff(parsed);
          setFormData(parsed);
        }
      } catch (err) {
        console.error("Error loading profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (index, value) => {
    const newSubjects = [...formData.subjects];
    newSubjects[index] = value;
    setFormData((prev) => ({ ...prev, subjects: newSubjects }));
  };

  const addSubject = () => {
    setFormData((prev) => ({
      ...prev,
      subjects: prev.subjects ? [...prev.subjects, ""] : [""],
    }));
  };

  const removeSubject = (index) => {
    const newSubjects = formData.subjects.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, subjects: newSubjects }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // ✅ FIXED SAVE FUNCTION
  const saveProfile = async () => {
    setIsSaving(true);
    try {
      // 1. Create FormData object
      const data = new FormData();

      // 2. Append all text fields
      Object.keys(formData).forEach((key) => {
        if (key === "subjects") {
          // Stringify arrays because FormData can only send strings/files
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      // 3. Append Photo if one was selected
      if (photoFile) {
        data.append("photo", photoFile);
      }

      // ✅ FIX: Send 'data' (the FormData), NOT 'formData' (the plain state)
      // Also, allow Axios to set the Content-Type header automatically
      const res = await API.put("/staff/auth/profile", data);

      const updatedStaff = res.data.staff;

      // Update Local Storage & State with the fresh data from DB
      localStorage.setItem("staffData", JSON.stringify(updatedStaff));
      setStaff(updatedStaff);
      setFormData(updatedStaff);

      // Reset upload state
      setPhotoFile(null);
      setPhotoPreview(null);

      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Save failed", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <ProfileSkeleton />;
  if (!staff)
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#030407] text-slate-500 dark:text-slate-400">
        <Navbar />
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">No Profile Found</h2>
          <p className="text-sm opacity-70">
            Please log in again to view your profile.
          </p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030407] text-slate-900 dark:text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden transition-colors duration-500">
      <Navbar />

      {/* --- FLASHY AMBIENT BACKGROUND --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-500/10 dark:from-indigo-900/20 to-transparent transition-colors duration-500" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-500/20 dark:bg-fuchsia-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 dark:bg-cyan-900/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 pt-28 pb-20 space-y-8">
        {/* ================= HEADER CARD ================= */}
        <div className="relative group">
          {/* Banner */}
          <div className="relative h-48 md:h-64 rounded-[3rem] overflow-hidden border border-white/40 dark:border-white/10 bg-white/60 dark:bg-[#0d1117]/60 backdrop-blur-2xl shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />

            {/* Edit Actions */}
            <div className="absolute top-6 right-6 z-20">
              {isEditing ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData(staff);
                      setPhotoFile(null);
                      setPhotoPreview(null);
                    }}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/80 dark:bg-black/40 hover:bg-red-500/10 border border-white/20 hover:border-red-500/50 text-slate-700 dark:text-white transition-all backdrop-blur-md text-xs font-bold uppercase tracking-wider"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all disabled:opacity-70 disabled:scale-100"
                  >
                    {isSaving ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/30 text-slate-800 dark:text-white transition-all backdrop-blur-md shadow-lg text-xs font-bold uppercase tracking-wider"
                >
                  <Edit2 size={14} /> Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Profile Content Overlay */}
          <div className="px-8 md:px-16 -mt-20 flex flex-col md:flex-row items-end gap-8 relative z-10">
            {/* Avatar with Glow */}
            <div className="relative group/avatar">
              <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-[2.5rem] blur-xl opacity-30 group-hover/avatar:opacity-50 transition-opacity duration-500"></div>

              {/* PHOTO CONTAINER */}
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-[2rem] p-1.5 bg-white dark:bg-[#121212] shadow-2xl relative z-10">
                <div className="w-full h-full rounded-[1.7rem] overflow-hidden bg-slate-100 dark:bg-[#0d1117] relative border border-slate-100 dark:border-white/5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*"
                  />

                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : staff.photo ? (
                    <img
                      src={staff.photo}
                      alt={staff.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-black text-slate-300 dark:text-white/10 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-white/5 dark:to-white/[0.02]">
                      {staff.name[0]}
                    </div>
                  )}

                  {isEditing && (
                    <div
                      onClick={handlePhotoClick}
                      className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center cursor-pointer hover:bg-black/70 transition-all group/edit-photo"
                    >
                      <div className="flex flex-col items-center gap-2 text-white/80 group-hover/edit-photo:text-white">
                        <Camera className="w-8 h-8" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          Change
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-2 -right-2 z-20">
                <div className="bg-emerald-500 text-white p-2 rounded-xl border-[4px] border-white dark:border-[#030407] shadow-lg">
                  <UserCheck size={18} strokeWidth={3} />
                </div>
              </div>
            </div>

            {/* Name & Position */}
            <div className="flex-1 pb-4 space-y-2 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4 w-full md:w-96 p-6 bg-white/80 dark:bg-[#121212]/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-2xl animate-in slide-in-from-bottom-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
                      Full Name
                    </label>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-lg font-bold text-slate-900 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1 block">
                      Position
                    </label>
                    <select
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                      {POSITIONS.map((p) => (
                        <option
                          key={p}
                          value={p}
                          className="bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white"
                        >
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
                    {staff.name}
                  </h1>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold text-sm tracking-wide">
                    <Briefcase size={14} />
                    {staff.position}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================= DATA GRID ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
          <DetailCard
            icon={Mail}
            label="Email Address"
            value={formData.email}
            name="email"
            isEditing={isEditing}
            onChange={handleInputChange}
            color="text-cyan-500"
            bg="bg-cyan-500/10"
            border="border-cyan-500/20"
          />

          <DepartmentCard
            value={formData.department}
            isEditing={isEditing}
            onChange={handleInputChange}
          />

          <DetailCard
            icon={GraduationCap}
            label="Qualification"
            value={formData.qualification}
            name="qualification"
            isEditing={isEditing}
            onChange={handleInputChange}
            color="text-pink-500"
            bg="bg-pink-500/10"
            border="border-pink-500/20"
          />
          <DetailCard
            icon={Clock}
            label="Experience"
            value={formData.experience}
            name="experience"
            isEditing={isEditing}
            onChange={handleInputChange}
            color="text-emerald-500"
            bg="bg-emerald-500/10"
            border="border-emerald-500/20"
            suffix=" Years"
          />
        </div>

        {/* ================= BOTTOM SECTION ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Biography */}
          <div className="lg:col-span-2 relative p-8 rounded-[2.5rem] bg-white/60 dark:bg-[#0d1117]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 overflow-hidden group shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 group-hover:bg-indigo-500/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Biography
              </h3>
            </div>

            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full h-48 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-5 text-slate-700 dark:text-white/80 focus:border-indigo-500 outline-none resize-none leading-relaxed text-base font-medium transition-all focus:bg-white dark:focus:bg-black/40"
                placeholder="Write a brief professional bio..."
              />
            ) : (
              <p className="text-base md:text-lg text-slate-600 dark:text-white/70 leading-relaxed font-medium">
                {staff.bio ||
                  "No biography provided yet. Click edit to add details about your academic journey."}
              </p>
            )}
          </div>

          {/* Subjects */}
          <div className="relative p-8 rounded-[2.5rem] bg-white/60 dark:bg-[#0d1117]/60 backdrop-blur-2xl border border-white/20 dark:border-white/5 flex flex-col group shadow-lg">
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-[60px] -z-10 group-hover:bg-fuchsia-500/20 transition-all" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-500">
                <Sparkles size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Subjects
              </h3>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-2">
              {formData.subjects && formData.subjects.length > 0 ? (
                formData.subjects.map((sub, i) =>
                  isEditing ? (
                    <div key={i} className="flex gap-2 group/sub">
                      <input
                        value={sub}
                        onChange={(e) => handleSubjectChange(i, e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white focus:border-fuchsia-500 outline-none transition-colors"
                      />
                      <button
                        onClick={() => removeSubject(i)}
                        className="p-3 bg-red-50 dark:bg-red-500/10 text-red-500 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-100 dark:border-red-500/10 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <div
                      key={i}
                      className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-fuchsia-50 dark:hover:bg-white/10 transition-colors group/item"
                    >
                      <div className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                      <span className="font-bold text-slate-700 dark:text-white/90 text-sm">
                        {sub}
                      </span>
                    </div>
                  )
                )
              ) : (
                <div className="text-slate-400 dark:text-white/30 italic text-sm py-4 text-center">
                  No subjects listed
                </div>
              )}

              {isEditing && (
                <button
                  onClick={addSubject}
                  className="mt-2 text-xs font-bold uppercase tracking-widest text-center py-4 border border-dashed border-slate-300 dark:border-white/20 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-500 dark:text-white/50 hover:text-indigo-500 dark:hover:text-white transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add New Subject
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- COMPONENT: Standard Input Card ---
const DetailCard = ({
  icon: Icon,
  label,
  value,
  name,
  isEditing,
  onChange,
  color,
  bg,
  border,
  suffix = "",
}) => (
  <div
    className={`p-6 rounded-[2.5rem] bg-white/60 dark:bg-[#0d1117]/80 backdrop-blur-xl border ${border} dark:border-white/5 hover:bg-white dark:hover:bg-[#12161f] transition-all group flex items-center gap-6 relative overflow-hidden shadow-sm hover:shadow-lg`}
  >
    <div
      className={`absolute right-0 top-0 w-32 h-32 ${bg} blur-[50px] opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
    />

    <div
      className={`w-16 h-16 rounded-2xl ${bg} border border-transparent dark:border-white/5 flex items-center justify-center ${color} shadow-inner shrink-0`}
    >
      <Icon size={28} />
    </div>

    <div className="flex-1 relative z-10 min-w-0">
      <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">
        {label}
      </p>
      {isEditing ? (
        <input
          name={name}
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-1 text-lg font-bold text-slate-900 dark:text-white focus:border-indigo-500 outline-none transition-colors"
        />
      ) : (
        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">
          {value || "N/A"}
          {value ? suffix : ""}
        </p>
      )}
    </div>
  </div>
);

// --- COMPONENT: Department Dropdown Card ---
const DepartmentCard = ({ value, isEditing, onChange }) => (
  <div className="p-6 rounded-[2.5rem] bg-white/60 dark:bg-[#0d1117]/80 backdrop-blur-xl border border-purple-100 dark:border-purple-500/20 hover:bg-white dark:hover:bg-[#12161f] transition-all group flex items-center gap-6 relative overflow-hidden shadow-sm hover:shadow-lg">
    <div className="absolute right-0 top-0 w-32 h-32 bg-purple-500/10 blur-[50px] opacity-0 group-hover:opacity-50 transition-opacity duration-500" />

    <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-transparent dark:border-white/5 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-inner shrink-0">
      <Building2 size={28} />
    </div>

    <div className="flex-1 relative z-10 min-w-0">
      <p className="text-[10px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest mb-1">
        Department
      </p>
      {isEditing ? (
        <select
          name="department"
          value={value}
          onChange={onChange}
          className="w-full bg-transparent border-b-2 border-slate-200 dark:border-white/10 py-1 text-lg font-bold text-slate-900 dark:text-white focus:border-purple-500 outline-none cursor-pointer"
        >
          {DEPARTMENTS.map((d) => (
            <option
              key={d}
              value={d}
              className="bg-white dark:bg-[#0d1117] text-slate-900 dark:text-white"
            >
              {d}
            </option>
          ))}
        </select>
      ) : (
        <p className="text-xl font-bold text-slate-900 dark:text-white truncate">
          {value || "N/A"}
        </p>
      )}
    </div>
  </div>
);

export default StaffProfile;
