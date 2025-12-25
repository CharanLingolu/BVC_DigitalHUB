import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Briefcase,
  Book,
  User,
  ArrowLeft,
  BadgeCheck,
  Quote,
  LayoutGrid,
  Info,
} from "lucide-react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const StaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    API.get(`/info/staff/${id}`)
      .then((res) => setStaff(res.data))
      .catch(() => {});
  }, [id]);

  if (!staff) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0d1117]">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f4f9] dark:bg-[#05070a] transition-colors duration-300 overflow-y-auto">
      <Navbar />
      <div className="h-16 md:h-20" />

      <main className="max-w-md mx-auto pb-20">
        {/* --- DYNAMIC HEADER CARD --- */}
        <div className="relative w-full bg-gradient-to-br from-[#5142f5] to-[#8a42f5] rounded-b-[3.5rem] shadow-2xl flex flex-col items-center pt-16 pb-20 text-white px-6">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-8 left-6 p-2.5 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 active:scale-95 z-30"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Profile Image with Online Status */}
          <div className="relative z-10 mb-6">
            <div className="w-40 h-40 rounded-[2.5rem] p-1.5 bg-white/30 backdrop-blur-md shadow-2xl">
              <div className="w-full h-full rounded-[2.2rem] bg-slate-200 overflow-hidden flex items-center justify-center">
                {staff.profilePic ? (
                  <img
                    src={staff.profilePic}
                    alt={staff.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={60} className="text-indigo-500" />
                )}
              </div>
            </div>
            <div className="absolute bottom-2 right-0 bg-[#00d285] px-3 py-1 rounded-lg border-[3px] border-[#6b42f5] shadow-xl">
              <span className="text-[10px] font-black uppercase tracking-widest text-white">
                Online
              </span>
            </div>
          </div>

          <h1 className="text-3xl font-black tracking-tight uppercase mb-2">
            {staff.name}
          </h1>
          <div className="px-5 py-1.5 rounded-full bg-white/20 border border-white/30 backdrop-blur-md text-[10px] font-bold uppercase tracking-[0.2em]">
            {staff.department || "Faculty"}
          </div>
        </div>

        {/* --- DETAILS OVERLAY SECTION --- */}
        <div className="px-5 -mt-10 relative z-20">
          <div className="bg-white dark:bg-[#0b0c15] rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-white/5">
            {/* Faculty Data Label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <LayoutGrid size={18} />
              </div>
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
                Faculty Profile Data
              </h3>
            </div>

            {/* Academic & Experience Cards */}
            <div className="grid grid-cols-2 gap-4 mb-10">
              <DetailCard
                label="Academic"
                value={staff.qualification}
                icon={GraduationCap}
                color="indigo"
              />
              <DetailCard
                label="Experience"
                value={`${staff.experience} Years`}
                icon={Briefcase}
                color="rose"
              />
            </div>

            {/* BIOGRAPHY SECTION - Ensuring visibility */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                  Professional Bio
                </h4>
              </div>
              <div className="relative p-6 rounded-[2rem] bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5">
                <Quote
                  className="absolute top-4 right-4 text-indigo-500/10"
                  size={40}
                />
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 font-medium italic relative z-10">
                  {staff.bio ||
                    "No biography information available for this faculty member."}
                </p>
              </div>
            </div>

            {/* SUBJECTS HANDLED SECTION */}
            {staff.subjects && staff.subjects.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1.5 h-4 bg-fuchsia-500 rounded-full" />
                  <h4 className="font-black text-[11px] uppercase tracking-widest text-slate-400">
                    Specializations
                  </h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {staff.subjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-4 py-2.5 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-tight border border-indigo-100 dark:border-indigo-500/20"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Custom Scrollbar Styling */}
      <style>{`
        ::-webkit-scrollbar { width: 0px; }
      `}</style>
    </div>
  );
};

/* Internal Detail Card Component */
const DetailCard = ({ label, value, icon: Icon, color }) => {
  const themes = {
    indigo:
      "bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20",
    rose: "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
  };

  return (
    <div className="bg-slate-50 dark:bg-white/[0.03] p-5 rounded-[2.2rem] border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform active:scale-95">
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-sm border ${themes[color]}`}
      >
        <Icon size={22} strokeWidth={2.5} />
      </div>
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-xs font-black text-slate-800 dark:text-white uppercase truncate w-full px-1">
        {value || "N/A"}
      </p>
    </div>
  );
};

export default StaffDetails;
