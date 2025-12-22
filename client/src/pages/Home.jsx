import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] transition-colors">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#161b22] rounded-3xl p-10 shadow-xl border border-slate-200 dark:border-slate-800">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">
            Welcome to BVC DigitalHub 🎓
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-4 text-lg max-w-2xl">
            Explore student projects, connect with faculty, track events, and
            stay updated with placements.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Home;
