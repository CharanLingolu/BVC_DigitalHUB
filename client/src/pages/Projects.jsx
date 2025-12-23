import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const Projects = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Search & Filter
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");

  useEffect(() => {
    API.get("/projects")
      .then((res) => setProjects(res.data))
      .catch(() => console.error("Failed to load projects"))
      .finally(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      project.title.toLowerCase().includes(searchText) ||
      project.user?.name?.toLowerCase().includes(searchText);

    const matchesDepartment =
      department === "" || project.user?.department === department;

    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-black mb-8">Student Projects</h1>

        {/* SEARCH & FILTER */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <input
            type="text"
            placeholder="Search by project or student name"
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

        {/* PROJECT LIST */}
        {loading ? (
          <p>Loading projects...</p>
        ) : filteredProjects.length === 0 ? (
          <Empty text="No matching projects found" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                onClick={() => navigate(`/projects/${project._id}`)}
                className="cursor-pointer bg-white dark:bg-[#161b22] rounded-2xl p-5 shadow hover:shadow-xl transition"
              >
                {/* USER */}
                <div className="flex items-center gap-3 mb-4">
                  <Avatar user={project.user} />
                  <div>
                    <p className="font-bold">{project.user?.name}</p>
                    <p className="text-sm text-slate-500">
                      {project.user?.department}
                    </p>
                  </div>
                </div>

                {/* PROJECT */}
                <h3 className="text-lg font-black mb-2">
                  {project.title}
                </h3>
                <p className="text-slate-500 line-clamp-3">
                  {project.description}
                </p>

                <button
  onClick={(e) => {
    e.stopPropagation();
    API.post(`/projects/${project._id}/like`).then(() => {
      project.likes.push("x");
      setProjects([...projects]);
    });
  }}
  className="text-red-500 font-bold mt-3"
>
  ❤️ {project.likes.length}
</button>

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Projects;

/* 🔹 AVATAR COMPONENT */
const Avatar = ({ user }) => (
  <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
    {user?.profilePic ? (
      <img
        src={user.profilePic}
        alt={user.name}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="font-black text-blue-600">
        {user?.name?.charAt(0)}
      </span>
    )}
  </div>
);

const Empty = ({ text }) => (
  <div className="text-center py-24 bg-white dark:bg-[#161b22] rounded-3xl border border-dashed text-slate-500">
    {text}
  </div>
);
