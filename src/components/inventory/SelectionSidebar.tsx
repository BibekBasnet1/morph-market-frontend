import type { InventoryFormItem } from "./types";

const SelectionSidebar = ({
  products,
  selected,
  inventoryData,
  onRemove,
  onSubmit,
  isPending,
  mode,
}: {
  products: any[];
  selected: number[];
  inventoryData: Record<number, InventoryFormItem>;
  onRemove: (id: number) => void;
  onSubmit: () => void;
  isPending: boolean;
  mode: "single" | "bulk";
}) => {
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white/95 dark:bg-slate-900/95 border border-slate-200/70 dark:border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(2,6,23,0.18)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)] z-40 overflow-hidden backdrop-blur animate-in slide-in-from-bottom-3 duration-200">
      <div className="py-4 px-6 border-b border-slate-200/70 dark:border-gray-700/30 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-400 uppercase">
          Queue · {selected.length} item{selected.length !== 1 ? "s" : ""}
        </span>
        <span className="text-xs text-slate-500 dark:text-gray-400">
          {mode === "bulk" ? "Bulk" : "Single"} mode
        </span>
      </div>

      <div className="max-h-[220px] overflow-y-auto py-2">
        {selected.map((id) => {
          const p = products.find((x: any) => x.id === id);
          const item = inventoryData[id];
          return (
            <div key={id} className="flex items-center gap-2.5 px-4 py-2">
              <img
                src={p?.image_urls?.thumbnail?.url || "/placeholder.jpg"}
                alt={p?.name}
                className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white whitespace-nowrap overflow-hidden text-ellipsis">
                  {p?.name}
                </div>
                <div className="text-xs text-slate-500 dark:text-gray-400">
                  {item?.price ? `$${item.price}` : "No price set"}
                </div>
              </div>
              <button
                onClick={() => onRemove(id)}
                className="shrink-0 p-1 rounded-md text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-900/5 dark:hover:bg-white/5 transition-colors"
                title="Remove"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M1 1l10 10M11 1L1 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      <div className="py-4 px-6 border-t border-slate-200/70 dark:border-gray-700/30">
        <button
          onClick={onSubmit}
          disabled={isPending}
          className="w-full p-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Adding to Inventory…" : `Add ${selected.length} to Inventory`}
        </button>
      </div>
    </div>
  );
};

export default SelectionSidebar;

