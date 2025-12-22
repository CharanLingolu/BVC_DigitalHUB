import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Staff = () => {
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    API.get("/info/staff")
      .then((res) => setStaff(res.data))
      .catch(() => console.error("Failed to load staff"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Faculty
        </h1>

        {staff.length === 0 ? (
          <Empty text="No faculty data available" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {staff.map((s) => (
              <div
                key={s._id}
                className="bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-800"
              >
                <h3 className="font-bold text-lg">{s.name}</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  {s.department}
                </p>
                <p className="text-sm text-slate-500">{s.designation}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Staff;

/* ✅ ADD THIS */
const Empty = ({ text }) => (
  <div className="text-center py-24 bg-white dark:bg-[#161b22] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
    {text}
  </div>
);
