import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Heart,
  ArrowLeft,
  ExternalLink,
  Share2,
  Check,
  Layers,
  Calendar,
  Image as ImageIcon,
  User,
  Maximize2,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import API from "../services/api";

// ✅ Updated Hook to recognize Admin IDs for Liking
const useCurrentUserId = () => {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    try {
      const userRaw = localStorage.getItem("user");
      const adminRaw = localStorage.getItem("admin");

      if (userRaw) {
        const user = JSON.parse(userRaw);
        setUserId(user._id || user.id);
      } else if (adminRaw) {
        const admin = JSON.parse(adminRaw);
        setUserId(admin._id || admin.id);
      }
    } catch (error) {
      console.error("Failed to parse session from local storage:", error);
    }
  }, []);

  return userId;
};

const LoadingScreen = () => (
  <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-[#020205]">
    <Loader2 className="w-16 h-16 text-indigo-500 animate-spin" />
    <p className="mt-4 text-xs font-black tracking-widest text-indigo-500 animate-pulse uppercase">
      Loading Project...
    </p>
  </div>
);

const Avatar = ({ user }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {user?.profilePic ? (
        <img
          src={user.profilePic}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      ) : (
        <User size={24} className="text-slate-400 dark:text-slate-600" />
      )}
    </div>
  );
};

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const currentUserId = useCurrentUserId();

  const [project, setProject] = useState(null);
  const [isLiking, setIsLiking] = useState(false);
  const [copied, setCopied] = useState(false);
  const errorShownRef = useRef(false);

  // ✅ FIXED: Dependency array is constant [id, navigate] to stop the React error
  useEffect(() => {
    let cancelled = false;

    // Access control: Admin or User
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token && !adminToken) {
      toast.error("Please login to view projects");
      navigate("/login");
      return;
    }

    const fetchProject = async () => {
      try {
        const { data } = await API.get(`/projects/${id}`);
        if (!cancelled) {
          setProject({
            ...data,
            likes: Array.isArray(data.likes) ? data.likes : [],
            media: Array.isArray(data.media) ? data.media : [],
          });
        }
      } catch (error) {
        if (!errorShownRef.current) {
          errorShownRef.current = true;
          toast.error("Failed to load project");
        }
      }
    };

    fetchProject();
    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  if (!project) {
    return <LoadingScreen />;
  }

  const safeUserId = currentUserId ? String(currentUserId) : null;
  const isLiked =
    safeUserId && project.likes.some((uid) => String(uid) === safeUserId);
  const likesCount = project.likes.length;

  const handleLike = async () => {
    const token = localStorage.getItem("token");
    const adminToken = localStorage.getItem("adminToken");

    if (!token && !adminToken) {
      toast.error("Please login to like");
      return;
    }

    if (isLiking) return;
    setIsLiking(true);

    try {
      const { data } = await API.post(`/projects/${project._id}/like`);

      setProject((prev) => ({
        ...prev,
        likes: data.likes,
      }));
    } catch (err) {
      toast.error(
        err.response?.status === 401 ? "Unauthorized action" : "Action failed"
      );
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const uName = project.user?.name || "Unknown";
  const uDept = project.user?.department || "General";
  const postDate = project.createdAt
    ? new Date(project.createdAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  const renderMediaContent = () => {
    if (project.media.length > 0) {
      return project.media.map((url, index) => (
        <div
          key={index}
          className="relative w-full rounded-2xl overflow-hidden bg-white dark:bg-[#12121a] shadow-xl border border-slate-300 dark:border-white/10 group transition-all"
        >
          <div className="relative z-10 flex items-center justify-center p-1.5">
            {url.match(/\.(mp4|webm|ogg)$/i) ? (
              <video
                controls
                className="w-full h-auto max-h-[50vh] lg:max-h-[60vh] object-contain rounded-xl bg-black"
              >
                <source src={url} />
              </video>
            ) : (
              <img
                src={url}
                alt="Visual"
                className="w-full h-auto max-h-[50vh] lg:max-h-[60vh] object-contain rounded-xl"
              />
            )}
          </div>
        </div>
      ));
    }
    return (
      <div className="h-full py-12 flex flex-col items-center justify-center text-slate-400 dark:text-slate-600">
        <ImageIcon size={60} strokeWidth={1} />
        <p className="mt-4 font-bold text-xs uppercase tracking-widest opacity-50">
          Visual Documentation Empty
        </p>
      </div>
    );
  };

  const renderActionButtons = () => (
    /* Added pr-16 on mobile (lg:pr-8) to ensure theme switch button doesn't collide */
    <div className="p-6 pr-16 lg:p-8 lg:pr-8 border-t border-slate-200 dark:border-white/5 bg-white/50 dark:bg-black/20 backdrop-blur-xl shrink-0">
      <div className="flex items-center gap-3 lg:gap-4">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex-[2] relative h-12 lg:h-14 rounded-2xl font-black transition-all duration-300 active:scale-90 flex items-center justify-center gap-2 lg:gap-3 border overflow-hidden ${
            isLiked
              ? "bg-rose-500/10 border-rose-500/50 text-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
              : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
          }`}
        >
          <Heart
            size={20}
            className={`transition-all duration-300 ${
              isLiked
                ? "fill-rose-500 stroke-rose-500 scale-110"
                : "stroke-current"
            }`}
          />
          <span className="text-base lg:text-lg">{likesCount}</span>
        </button>

        {project.repoLink && (
          <a
            href={project.repoLink}
            target="_blank"
            rel="noreferrer"
            className="
              flex-1 h-12 lg:h-14 rounded-2xl flex items-center justify-center gap-2 lg:gap-3 px-4 lg:px-6
              font-black transition-all duration-500 active:scale-95 group/repo
              bg-white text-gray-900 border border-slate-200 shadow-sm
              hover:bg-slate-50 hover:border-indigo-500/30 hover:shadow-lg
              dark:bg-white/5 dark:text-white dark:border-white/10
              dark:backdrop-blur-xl dark:shadow-[0_0_20px_rgba(0,0,0,0.3)]
              dark:hover:bg-white/10 dark:hover:border-cyan-500/50
              dark:hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]
            "
          >
            <ExternalLink
              size={18}
              className="transition-transform duration-500 group-hover/repo:rotate-12 group-hover/repo:text-cyan-500"
            />
            <span className="hidden sm:inline text-xs tracking-widest uppercase">
              Source
            </span>
          </a>
        )}

        <button
          onClick={handleShare}
          className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all active:scale-90 text-slate-500 dark:text-slate-400 hover:text-indigo-500"
        >
          {copied ? (
            <Check className="text-emerald-500" size={20} />
          ) : (
            <Share2 size={20} />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shimmer { 100% { transform: translateX(100%); } }
      `}</style>

      <div className="min-h-screen lg:h-screen w-full bg-slate-50 dark:bg-[#030407] text-slate-900 dark:text-white flex flex-col lg:overflow-hidden transition-colors duration-500 relative">
        <Navbar />
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-rose-500/10 dark:bg-rose-600/10 rounded-full blur-[140px]" />
        </div>

        {/* Increased pt-32 on desktop to clear fixed navbar properly */}
        <main className="relative z-10 flex-1 flex flex-col items-center p-4 lg:p-8 pt-24 lg:pt-32 min-h-0">
          {/* Back Button Section: Aligned with card max-width */}
          <div className="w-full max-w-[1400px] mb-4 shrink-0 px-2 flex justify-start">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 px-4 py-2 lg:px-6 lg:py-2.5 rounded-full bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white dark:hover:bg-white/10 hover:border-indigo-500/50 backdrop-blur-xl transition-all duration-300 shadow-sm active:scale-95"
            >
              <ArrowLeft
                size={18}
                className="text-indigo-500 group-hover:text-indigo-500 transition-colors"
              />
              <span className="text-xs lg:text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white">
                Back
              </span>
            </button>
          </div>

          <div className="w-full max-w-[1400px] h-auto lg:h-[78vh] flex flex-col lg:flex-row bg-white/90 dark:bg-[#0b0b12]/95 backdrop-blur-3xl rounded-[2rem] lg:rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] overflow-hidden relative mb-8 lg:mb-0">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent opacity-50 z-20"></div>

            {/* Media Section */}
            <div className="w-full lg:w-[55%] bg-slate-200/50 dark:bg-black/40 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 relative flex flex-col lg:h-full">
              <div className="flex-1 overflow-y-auto p-4 lg:p-10 space-y-6 lg:space-y-8 no-scrollbar">
                {renderMediaContent()}
              </div>
            </div>

            {/* Details Section */}
            <div className="w-full lg:w-[45%] flex flex-col bg-transparent relative min-h-0 lg:h-full">
              <div className="p-6 lg:p-10 border-b border-slate-200 dark:border-white/5 shrink-0">
                <div className="flex items-center gap-4 lg:gap-5 mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl opacity-40 blur group-hover:opacity-70 transition duration-500"></div>
                    <div className="relative w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#1a1a23] border border-slate-200 dark:border-white/10 shadow-inner">
                      <Avatar user={project.user} />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                      {uName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 lg:gap-3 text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400 mt-1">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                        <Layers size={10} /> {uDept}
                      </span>
                      <span className="flex items-center gap-1 opacity-60">
                        <Calendar size={10} /> {postDate}
                      </span>
                    </div>
                  </div>
                </div>

                <h1 className="text-xl lg:text-4xl font-black text-slate-900 dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-br dark:from-white dark:to-slate-500 leading-tight tracking-tight uppercase">
                  {project.title}
                </h1>
              </div>

              <div className="flex-1 lg:overflow-y-auto p-6 lg:p-10 min-h-0 no-scrollbar">
                <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-pre-wrap">
                  {project.description || "No project description available."}
                </p>
              </div>

              {renderActionButtons()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectDetails;
