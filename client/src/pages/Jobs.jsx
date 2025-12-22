import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("/info/jobs")
      .then((res) => setJobs(res.data))
      .catch(() => console.error("Failed to load jobs"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Placements
        </h1>

        {jobs.length === 0 ? (
          <Empty text="No placement data available" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-[#161b22] p-6 rounded-2xl shadow border border-slate-200 dark:border-slate-800"
              >
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {job.company}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{job.role}</p>
                <p className="mt-3 text-sm text-slate-500">
                  Selected: {job.selectedStudents.join(", ")}
                </p>
                <p className="text-sm font-semibold mt-1">Year: {job.year}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Jobs;

const Empty = ({ text }) => (
  <div className="text-center py-20 bg-white dark:bg-[#161b22] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
    {text}
  </div>
);
