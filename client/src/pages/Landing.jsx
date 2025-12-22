import Navbar from "../components/Navbar";

const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] text-slate-900 dark:text-white transition-colors duration-300">
      {/* NAVBAR */}
      <Navbar />

      {/* PUSH CONTENT BELOW FIXED NAVBAR */}
      <main className="pt-20">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          {/* LIGHT MODE BACKGROUND */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-white dark:hidden -z-10" />

          {/* DARK MODE GLOW */}
          <div className="absolute inset-0 hidden dark:block -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full" />
          </div>

          <div className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT CONTENT */}
            <div className="text-center lg:text-left space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">
                  New Portal for 2025
                </span>
              </div>

              {/* Heading */}
              <h1 className="text-5xl lg:text-7xl font-black leading-tight tracking-tight">
                Elevating the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                  BVC Experience
                </span>
              </h1>

              {/* Description */}
              <p className="text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                A centralized digital ecosystem for BVC students. Showcase
                innovation, connect with faculty, and accelerate your career
                path.
              </p>

              {/* CTA */}
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start pt-4">
                <a
                  href="/signup"
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:-translate-y-1 hover:bg-blue-700 transition-all duration-300"
                >
                  Get Started
                </a>
                <a
                  href="/login"
                  className="px-8 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-300"
                >
                  Sign In
                </a>
              </div>
            </div>

            {/* RIGHT IMAGE PLACEHOLDER */}
            <div className="relative flex justify-center items-center">
              {/* Glow */}
              <div className="absolute w-[420px] h-[420px] bg-blue-600/10 blur-[100px] rounded-full" />

              {/* Card */}
              <div className="relative bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl">
                <img
                  src="/bvc.png"
                  alt="BVC Student"
                  className="w-[420px] lg:w-[480px] rounded-2xl"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-24 bg-slate-50 dark:bg-[#010409] border-y border-slate-200 dark:border-slate-800/50 transition-colors">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="🎓"
              title="Student Projects"
              desc="Showcase your academic innovation with high-quality media."
            />
            <FeatureCard
              icon="👩‍🏫"
              title="Faculty & Events"
              desc="Sync with mentors and stay updated on every workshop."
            />
            <FeatureCard
              icon="💼"
              title="Placements"
              desc="Track hiring progress and corporate drives in real-time."
            />
          </div>
        </section>
      </main>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="group p-8 rounded-3xl bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
      {desc}
    </p>
  </div>
);

export default Landing;
