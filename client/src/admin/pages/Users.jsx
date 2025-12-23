import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminAPI from "../../services/adminApi";
import AdminNavbar from "../components/AdminNavbar";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    adminAPI
      .get("/admin/users")
      .then((res) => setUsers(res.data))
      .catch(() => console.error("Failed to load users"));
  }, []);

  const filtered = users.filter((u) => {
    return (
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (department === "" || u.department === department)
    );
  });

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminNavbar />
      <div className="pt-24 px-8 max-w-7xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Users</h1>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            placeholder="Search by name or email"
            className="p-3 rounded-xl border w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 rounded-xl border"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          >
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>

        {/* User Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((u) => (
            <div
              key={u._id}
              onClick={() => navigate(`/admin/users/${u._id}`)}
              className="cursor-pointer bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                {/* PROFILE PIC FIX */}
                <div className="w-14 h-14 rounded-full overflow-hidden bg-blue-600 flex items-center justify-center">
                  {u.profilePic ? (
                    <img
                      src={u.profilePic}
                      alt={u.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-black text-xl">
                      {u.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold">{u.name}</h3>
                  <p className="text-sm text-slate-500">{u.email}</p>
                  <p className="text-xs text-slate-400">
                    {u.department || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Users;
