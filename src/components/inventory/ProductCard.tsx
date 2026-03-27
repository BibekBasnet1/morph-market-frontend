import { useState } from "react";
import AlreadyAddedOverlay from "./AlreadyAddedOverlay";
import InInventoryBadge from "./InInventoryBadge";

const ProductCard = ({
  product,
  selected,
  inInventory,
  mode,
  onClick,
}: {
  product: any;
  selected: boolean;
  inInventory: boolean;
  mode: "single" | "bulk";
  onClick: () => void;
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={[
        "relative overflow-hidden rounded-[14px] bg-white dark:bg-slate-900 border-2 transition-all",
        selected
          ? "border-emerald-500 ring-2 ring-emerald-500/20 shadow-[0_0_0_3px_rgba(22,163,74,0.15),0_14px_30px_rgba(0,0,0,0.35)]"
          : inInventory
            ? "border-emerald-500/25"
            : "border-slate-200 hover:border-slate-300 dark:border-white/10 dark:hover:border-white/20",
        hovered && !inInventory && !selected
          ? "-translate-y-0.5 shadow-[0_14px_30px_rgba(2,6,23,0.10)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.35)]"
          : "",
        inInventory ? "cursor-not-allowed opacity-80" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="relative h-40">
        <img
          src={product?.image_urls?.thumbnail?.url || "/placeholder.jpg"}
          alt={product.name}
          className={["w-full h-full object-cover block transition", inInventory ? "brightness-75" : ""].join(
            " "
          )}
        />

        {inInventory && <AlreadyAddedOverlay />}

        {mode === "bulk" && selected && (
          <div className="absolute top-2.5 right-2.5 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center z-[3] shadow-lg shadow-black/30">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <div className="absolute bottom-2 left-2 z-[3] text-[10px] font-semibold bg-slate-950/55 text-slate-100 px-2 py-0.5 rounded-md backdrop-blur">
          {product.category?.name}
        </div>
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">
              {product.name}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-mono">{product.sku}</div>
          </div>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
          {inInventory && <InInventoryBadge />}

          {product.maturity_level && (
            <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md">
              {product.maturity_level.name}
            </span>
          )}
          {product.gender && (
            <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-900/5 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded-md">
              {product.gender.name}
            </span>
          )}
        </div>

        {product.traits?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.traits.slice(0, 3).map((t: any) => (
              <span
                key={t.id}
                className="text-[9px] font-bold tracking-[0.04em] text-violet-700 dark:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded"
              >
                {t.name}
              </span>
            ))}
            {product.traits.length > 3 && (
              <span className="text-[9px] text-slate-500">+{product.traits.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;

