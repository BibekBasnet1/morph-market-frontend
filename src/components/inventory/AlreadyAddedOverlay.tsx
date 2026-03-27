const AlreadyAddedOverlay = () => (
  <div className="absolute inset-0 bg-slate-950/45 dark:bg-black/55 flex flex-col items-center justify-center gap-2 rounded-inherit backdrop-blur-2xl">
    <div className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-50/20 border-2 border-emerald-500 flex items-center justify-center">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M4 9l4 4 6-7"
          stroke="#4ade80"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-emerald-200 dark:text-emerald-300">
      Already Added
    </span>
  </div>
);

export default AlreadyAddedOverlay;

