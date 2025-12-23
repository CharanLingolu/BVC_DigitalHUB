import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import API from "../services/api";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* 👋 GREETING */}
        <section className="bg-white dark:bg-[#161b22] rounded-3xl p-10 shadow-xl border border-slate-200 dark:border-slate-800">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Welcome{user ? `, ${user.name}` : ""} 👋
          </h1>

          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-2xl">
            This is your digital campus hub — explore projects, discover talent,
            and stay connected with everything happening at BVC.
          </p>
        </section>

        {/* 🎓 ABOUT COLLEGE (YOU WILL EDIT CONTENT HERE) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white dark:bg-[#161b22] rounded-3xl p-8 shadow-lg border border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-4">
              About Our College
            </h2>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {/* 🔹 You can replace this text with your college info */}
              BVC College of Engineering is committed to academic excellence,
              innovation, and holistic student development. The institution
              fosters technical skills, research culture, and career readiness.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-lg">
            <h3 className="text-2xl font-black mb-4">
              Why BVC DigitalHub?
            </h3>
            <ul className="space-y-3 text-lg">
              <li>✅ Centralized student project repository</li>
              <li>✅ Faculty & department information</li>
              <li>✅ Events & placement updates</li>
              <li>✅ Student collaboration & recognition</li>
            </ul>
          </div>
        </section>

        {/* 🚀 QUICK STATS (INTERACTIVE FEEL) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard title="Projects" value="500+" />
          <StatCard title="Students" value="2000+" />
          <StatCard title="Faculty" value="150+" />
          <StatCard title="Placements" value="95%" />
        </section>
      </main>
    </div>
  );
};

export default Home;

/* 🔹 STAT CARD */
const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-[#161b22] rounded-2xl p-6 text-center shadow-md border border-slate-200 dark:border-slate-800 hover:scale-105 transition">
    <p className="text-slate-500 dark:text-slate-400 text-sm uppercase">
      {title}
    </p>
    <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
      {value}
    </p>
  </div>
);
