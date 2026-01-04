import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar"; // ✅ Imported the shared Navbar
import {
  Mail,
  Briefcase,
  GraduationCap,
  Clock,
  Building2,
  BookOpen,
  UserCheck,
} from "lucide-react";

const StaffProfile = () => {
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("staffData");
    if (data) {
      setStaff(JSON.parse(data));
    }
  }, []);

  if (!staff)
    return (
      <div className="min-h-screen pt-20 text-center">
        Loading Faculty Profile...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030407] transition-colors duration-500">
      {/* ✅ Uses the main Navbar which now supports Staff Tokens */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* HEADER CARD - Distinct Indigo Gradient for Staff */}
        <div className="relative mb-8 p-8 rounded-[2.5rem] bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 opacity-15" />

          <div className="relative flex flex-col md:flex-row items-center gap-6 mt-4">
            {/* Photo */}
            <div className="w-32 h-32 rounded-[2rem] border-4 border-white dark:border-[#0d1117] shadow-lg overflow-hidden bg-indigo-100">
              {staff.photo ? (
                <img
                  src={staff.photo}
                  alt={staff.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl font-black text-indigo-300">
                  {staff.name[0]}
                </div>
              )}
            </div>

            {/* Name & Title */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-2">
                <UserCheck size={14} /> Verified Faculty
              </div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {staff.name}
              </h1>
              <p className="text-lg font-medium text-slate-500 dark:text-slate-400">
                {staff.position}
              </p>
            </div>
          </div>
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard icon={Mail} label="Official Email" value={staff.email} />
          <InfoCard
            icon={Building2}
            label="Department"
            value={staff.department}
          />
          <InfoCard
            icon={GraduationCap}
            label="Qualification"
            value={staff.qualification}
          />
          <InfoCard
            icon={Clock}
            label="Experience"
            value={`${staff.experience} Years`}
          />

          {/* Full Width Bio */}
          <div className="md:col-span-2 p-6 rounded-[2rem] bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-indigo-500">
                <BookOpen size={20} />
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Biography
              </p>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {staff.bio || "No biography provided."}
            </p>
          </div>

          {/* Subjects */}
          <div className="md:col-span-2 p-6 rounded-[2rem] bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Subjects Handled
            </p>
            <div className="flex flex-wrap gap-2">
              {staff.subjects && staff.subjects.length > 0 ? (
                staff.subjects.map((sub, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 font-bold text-sm"
                  >
                    {sub}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">
                  No subjects listed
                </span>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="p-6 rounded-[2rem] bg-white dark:bg-[#0d1117] border border-slate-200 dark:border-white/5 shadow-sm flex items-center gap-4 transition-transform hover:scale-[1.01]">
    <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-indigo-500">
      <Icon size={24} />
    </div>
    <div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">
        {label}
      </p>
      <p className="font-bold text-slate-900 dark:text-white">
        {value || "N/A"}
      </p>
    </div>
  </div>
);

export default StaffProfile;
