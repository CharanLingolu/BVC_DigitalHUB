import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/info/staff")
      .then((res) => setStaff(res.data))
      .catch(() => console.error("Failed to load staff"));
  }, []);

  // 🔍 Search + Filter
  const filteredStaff = staff.filter((s) => {
    const matchesSearch = s.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDepartment =
      department === "" || s.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Faculty
        </h1>

        {/* 🔍 SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search faculty name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-xl border bg-white dark:bg-[#161b22]"
          />

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="p-3 rounded-xl border bg-white dark:bg-[#161b22]"
          >
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="MECH">MECH</option>
            <option value="CIVIL">CIVIL</option>
          </select>
        </div>

        {/* 📄 STAFF LIST */}
        {filteredStaff.length === 0 ? (
          <Empty text="No faculty found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStaff.map((s) => (
              <div
                key={s._id}
                onClick={() => navigate(`/staff/${s._id}`)}
                className="cursor-pointer bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-800 hover:scale-105 transition"
              >
                <h3 className="font-black text-lg text-slate-900 dark:text-white">
                  {s.name}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {s.department}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Staff;

const Empty = ({ text }) => (
  <div className="text-center py-24 bg-white dark:bg-[#161b22] rounded-3xl border border-dashed text-slate-500">
    {text}
  </div>
);
