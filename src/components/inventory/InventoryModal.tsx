import { memo } from "react";
import InInventoryBadge from "./InInventoryBadge";
import type { InventoryFormItem } from "./types";

const InventoryModal = memo(({
  product,
  item,
  isAlreadyInInventory,
  onClose,
  onChange,
  onAddToInventory,
}: {
  product: any;
  item: InventoryFormItem;
  isAlreadyInInventory: boolean;
  onClose: () => void;
  onChange: (field: keyof InventoryFormItem, value: any) => void;
  onAddToInventory: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-black/70 backdrop-blur-2xl">
      <div className="w-full max-w-[480px] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700/30 rounded-[20px] p-7 shadow-[0_32px_80px_rgba(2,6,23,0.18)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)]">
        <div className="flex items-start justify-between mb-5">
          <div className="flex gap-3 items-center">
            <img
              src={product?.image_urls?.thumbnail?.url || "/placeholder.jpg"}
              alt={product?.name}
              className="w-13 h-13 rounded-[10px] object-cover"
            />
            <div>
              <div className="text-lg font-semibold text-slate-900 dark:text-white">{product?.name}</div>
              <div className="text-xs text-slate-500 dark:text-gray-400 mt-1">{product?.sku}</div>
              {isAlreadyInInventory && (
                <div className="mt-1.5">
                  <InInventoryBadge />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-900/5 dark:bg-gray-800/40 text-slate-500 dark:text-gray-400 rounded-lg w-8 h-8 flex items-center justify-center hover:bg-slate-900/10 dark:hover:bg-gray-800/60 hover:text-slate-900 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
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

        {isAlreadyInInventory && (
          <div className="bg-amber-500/10 dark:bg-amber-900/10 border border-amber-500/20 dark:border-amber-900/20 rounded-lg p-3 mb-4 flex gap-2.5 items-start">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-1">
              <path
                d="M8 2L14.9 14H1.1L8 2z"
                fill="rgba(234,179,8,0.2)"
                stroke="#eab308"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              <path d="M8 6v4M8 11.5v.5" stroke="#eab308" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <div>
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-400">Already in Inventory</div>
              <div className="text-xs text-amber-700 dark:text-amber-600 mt-1">
                This product has an existing inventory entry. Adding again will create a duplicate.
              </div>
            </div>
          </div>
        )}

        {
          !isAlreadyInInventory && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {[
                  { label: "Price *", field: "price" as const, type: "number" },
                  { label: "Sale Price", field: "sale_price" as const, type: "number" },
                  { label: "Discount Price", field: "discount_price" as const, type: "number" },
                ].map(({ label, field, type }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={(item as any)[field] ?? ""}
                      onChange={(e) => onChange(field, e.target.value ? +e.target.value : undefined)}
                      className="w-full bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200"
                    />
                  </div>
                ))}

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Discount Start
                  </label>
                  <input
                    type="date"
                    value={item.discount_start_date ?? ""}
                    onChange={(e) => onChange("discount_start_date", e.target.value || undefined)}
                    className="w-full bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
                    Discount End
                  </label>
                  <input
                    type="date"
                    value={item.discount_end_date ?? ""}
                    onChange={(e) => onChange("discount_end_date", e.target.value || undefined)}
                    className="w-full bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 mt-5.5">
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 bg-slate-900/5 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg text-slate-700 dark:text-gray-300 font-semibold text-sm hover:bg-slate-900/10 dark:hover:bg-gray-800/60 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onAddToInventory}
                  className="flex-[2] py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                >
                  Add to Inventory
                </button>
              </div>
            </>
          )}
      </div>
    </div>
  );
});

InventoryModal.displayName = "InventoryModal";

export default InventoryModal;

