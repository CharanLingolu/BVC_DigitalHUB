import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-toastify";

const ProjectCard = ({ project, refresh }) => {
  const navigate = useNavigate();

  // Local like state
  const [likesCount, setLikesCount] = useState(project.likes.length);
  const [liked, setLiked] = useState(false);

  // ❤️ Like handler
  const handleLike = async (e) => {
    e.stopPropagation(); // ⛔ prevent navigation

    if (liked) return; // no unlike

    try {
      await API.post(`/projects/${project._id}/like`);
      setLikesCount((prev) => prev + 1);
      setLiked(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Like failed"
      );
    }
  };

  // 🗑 Delete handler
  const handleDelete = async (e) => {
    e.stopPropagation();

    if (!window.confirm("Delete this project?")) return;

    try {
      await API.delete(`/projects/${project._id}`);
      toast.success("Project deleted");
      refresh && refresh();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div
      onClick={() => navigate(`/projects/${project._id}`)}
      className="cursor-pointer bg-white dark:bg-[#161b22] rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 p-5 hover:scale-[1.02] transition"
    >
      <h3 className="text-xl font-black mb-2 text-slate-900 dark:text-white">
        {project.title}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3">
        {project.description}
      </p>

      <div className="flex items-center justify-between mt-4">
        {/* ❤️ LIKE */}
        <button
          onClick={handleLike}
          className={`font-semibold ${
            liked ? "text-red-600" : "text-red-500"
          }`}
        >
          ❤️ {likesCount}
        </button>

        {/* 🗑 DELETE (only in profile) */}
        {refresh && (
          <button
            onClick={handleDelete}
            className="text-sm text-red-600 font-bold hover:text-red-700"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
