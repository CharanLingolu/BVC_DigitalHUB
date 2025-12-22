export default function PageWrapper({ children }) {
  return (
    <div
      className="
      min-h-screen
      bg-slate-50
      text-slate-900
      dark:bg-[#0d1117]
      dark:text-white
      transition-colors duration-300
    "
    >
      {children}
    </div>
  );
}
