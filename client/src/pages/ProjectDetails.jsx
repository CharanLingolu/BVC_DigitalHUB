import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [liking, setLiking] = useState(false);


  const handleLike = async () => {
  try {
    setLiking(true);
    const res = await API.post(`/projects/${project._id}/like`);
    setProject({
      ...project,
      likes: [...project.likes, "temp"],
    });
  } catch (err) {
    alert("Already liked");
  } finally {
    setLiking(false);
  }
};


  useEffect(() => {
    API.get(`/projects/${id}`).then((res) => setProject(res.data));
  }, [id]);

  if (!project) {
    return <p className="text-center mt-40">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117]">
      <Navbar />
      <div className="h-20" />

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* USER */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar user={project.user} />
          <div>
            <p className="font-bold text-lg">{project.user?.name}</p>
            <p className="text-slate-500">
              {project.user?.department}
            </p>
          </div>
        </div>

        {/* PROJECT INFO */}
        <h1 className="text-4xl font-black mb-4">
          {project.title}
        </h1>

        <p className="text-slate-600 mb-6">
          {project.description}
        </p>

        {/* LINKS */}
        <div className="flex gap-4 mb-8">
          {project.repoLink && (
            <a
              href={project.repoLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 font-bold"
            >
              Repository
            </a>
          )}
          {project.liveLink && (
            <a
              href={project.liveLink}
              target="_blank"
              rel="noreferrer"
              className="text-green-600 font-bold"
            >
              Live Demo
            </a>
          )}
        </div>

        {/* MEDIA */}
        {project.media?.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.media.map((url, i) =>
              url.includes("video") ? (
                <video key={i} controls className="rounded-xl">
                  <source src={url} />
                </video>
              ) : (
                <img
                  key={i}
                  src={url}
                  alt="project"
                  className="rounded-xl"
                />
              )
            )}
          </div>
        )}

        <button
  onClick={handleLike}
  disabled={liking}
  className="mt-8 flex items-center gap-2 text-red-500 font-bold text-lg hover:scale-105 transition"
>
  ❤️ {project.likes.length} Likes
</button>

      </main>
    </div>
  );
};

export default ProjectDetails;

/* 🔹 AVATAR */
const Avatar = ({ user }) => (
  <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
    {user?.profilePic ? (
      <img
        src={user.profilePic}
        alt={user.name}
        className="w-full h-full object-cover"
      />
    ) : (
      <span className="font-black text-blue-600 text-lg">
        {user?.name?.charAt(0)}
      </span>
    )}
  </div>
);
