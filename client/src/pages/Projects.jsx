import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => console.error("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-8">
          Student Projects
        </h1>

        {loading ? (
          <p className="text-slate-500">Loading projects...</p>
        ) : projects.length === 0 ? (
          <Empty text="No projects found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;

const Empty = ({ text }) => (
  <div className="text-center py-24 bg-white dark:bg-[#161b22] rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 text-slate-500">
    {text}
  </div>
);
