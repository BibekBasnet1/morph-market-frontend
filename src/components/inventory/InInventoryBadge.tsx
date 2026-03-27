const InInventoryBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.06em] uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-600/10 border border-emerald-600/25 dark:border-emerald-500/30 rounded-full px-2 py-0.5">
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <circle cx="4.5" cy="4.5" r="4.5" fill="#16a34a" />
      <path
        d="M2.5 4.5l1.4 1.4 2.6-2.8"
        stroke="#fff"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    In Inventory
  </span>
);

export default InInventoryBadge;

