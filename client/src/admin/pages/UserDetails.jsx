import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profilePicFile, setProfilePicFile] = useState(null);

  useEffect(() => {
    adminAPI.get(`/admin/users/${id}`).then((res) => setUser(res.data));
  }, [id]);

  /* ================= UPDATE USER ================= */
  const updateUser = async () => {
    try {
      const data = new FormData();

      data.append("name", user.name);
      data.append("email", user.email);
      data.append("rollNumber", user.rollNumber || "");
      data.append("department", user.department || "");
      data.append("bio", user.bio || "");

      if (profilePicFile) {
        data.append("profilePic", profilePicFile);
      }

      await adminAPI.put(`/admin/users/${id}`, data);
      alert("Profile updated");
      setEditing(false);
    } catch {
      alert("Update failed");
    }
  };

  /* ================= DELETE USER ================= */
  const deleteUser = async () => {
    if (!window.confirm("Delete this user permanently?")) return;
    await adminAPI.delete(`/admin/users/${id}`);
    navigate("/admin/users");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />

      <div className="pt-24 px-8 max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow">
          {/* HEADER */}
          <div className="flex items-center gap-6 mb-10">
            <label className="relative cursor-pointer">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.name}
                  className="w-20 h-20 rounded-full object-cover border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-black">
                  {user.name.charAt(0)}
                </div>
              )}

              {editing && (
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setProfilePicFile(e.target.files[0])}
                />
              )}
            </label>

            <div>
              <h2 className="text-2xl font-black">{user.name}</h2>
              <p className="text-slate-500">{user.email}</p>
            </div>

            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="ml-auto px-5 py-2 border border-blue-600 text-blue-600 rounded-xl font-bold"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Name"
              value={user.name}
              disabled={!editing}
              onChange={(v) => setUser({ ...user, name: v })}
            />
            <Input
              label="Email"
              value={user.email}
              disabled={!editing}
              onChange={(v) => setUser({ ...user, email: v })}
            />
            <Input
              label="Roll Number"
              value={user.rollNumber || ""}
              disabled={!editing}
              onChange={(v) => setUser({ ...user, rollNumber: v })}
            />

            <Select
              label="Department"
              value={user.department || ""}
              disabled={!editing}
              onChange={(v) => setUser({ ...user, department: v })}
            />
          </div>

          <textarea
            className="w-full mt-6 p-4 border rounded-xl"
            placeholder="Bio"
            disabled={!editing}
            value={user.bio || ""}
            onChange={(e) =>
              setUser({ ...user, bio: e.target.value })
            }
          />

          {/* ACTIONS */}
          {editing && (
            <div className="flex justify-between mt-10">
              <button
                onClick={updateUser}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditing(false)}
                className="border px-6 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          )}

          {!editing && (
            <div className="mt-10">
              <button
                onClick={deleteUser}
                className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDetails;

/* ---------- UI ---------- */

const Input = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="text-sm font-bold text-slate-600">{label}</label>
    <input
      className="w-full mt-1 p-3 border rounded-xl disabled:bg-slate-100"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

const Select = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="text-sm font-bold text-slate-600">{label}</label>
    <select
      className="w-full mt-1 p-3 border rounded-xl disabled:bg-slate-100"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Select</option>
      <option value="CSE">CSE</option>
      <option value="ECE">ECE</option>
      <option value="EEE">EEE</option>
      <option value="MECH">MECH</option>
      <option value="CIVIL">CIVIL</option>
    </select>
  </div>
);
