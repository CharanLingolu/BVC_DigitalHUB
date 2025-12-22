import { Heart } from "lucide-react";

const ProjectCard = ({ project }) => {
  return (
    <div
      className="
        bg-white dark:bg-[#161b22]
        border border-slate-200 dark:border-slate-800
        rounded-2xl p-6
        shadow-sm dark:shadow-none
        hover:shadow-xl dark:hover:shadow-blue-900/10
        transition-all duration-300
      "
    >
      {/* Title */}
      <h2 className="text-xl font-black text-slate-900 dark:text-white mb-1">
        {project.title}
      </h2>

      {/* Author */}
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
        By {project.owner?.name || "Unknown"}
      </p>

      {/* Description */}
      <p className="text-slate-700 dark:text-slate-300 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Tech Stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {project.techStack?.map((tech, idx) => (
          <span
            key={idx}
            className="
              px-3 py-1 rounded-full text-xs font-semibold
              bg-blue-100 text-blue-700
              dark:bg-blue-900/30 dark:text-blue-400
            "
          >
            {tech}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Likes */}
        <div className="flex items-center gap-1 text-pink-600 dark:text-pink-400 font-bold">
          <Heart size={16} fill="currentColor" />
          <span>{project.likes?.length || 0}</span>
        </div>

        {/* Repo Link */}
        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              text-blue-600 dark:text-blue-400
              font-bold text-sm
              hover:underline
            "
          >
            View Repo →
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
