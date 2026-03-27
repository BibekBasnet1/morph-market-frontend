import { useState, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ProductService } from "../../lib/api/products";
import { useAuth } from "../../contexts/AuthContext";
import { InventoryService } from "../../lib/api";
import { toast } from "react-hot-toast";

type InventoryItem = {
  price: number | string;
  sale_price?: number | string;
  discount_price?: number | string;
  discount_start_date?: string;
  discount_end_date?: string;
  stock: number;
  quantity: number;
  active: boolean;
};


const InInventoryBadge = () => (
  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-[0.06em] uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-600/10 border border-emerald-600/25 dark:border-emerald-500/30 rounded-full px-2 py-0.5">
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <circle cx="4.5" cy="4.5" r="4.5" fill="#16a34a" />
      <path d="M2.5 4.5l1.4 1.4 2.6-2.8" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
    In Inventory
  </span>
);

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
  inventoryData: Record<number, InventoryItem>;
  onRemove: (id: number) => void;
  onSubmit: () => void;
  isPending: boolean;
  mode: "single" | "bulk";
}) => {
  if (selected.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white/95 dark:bg-slate-900/95 border border-slate-200/70 dark:border-white/10 rounded-2xl shadow-[0_24px_60px_rgba(2,6,23,0.18)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.5)] z-40 overflow-hidden backdrop-blur animate-in slide-in-from-bottom-3 duration-200">

      {/* Header */}
      <div className="py-4 px-6 border-b border-slate-200/70 dark:border-gray-700/30 flex items-center justify-between">
        <span className="text-sm font-semibold tracking-wide text-slate-600 dark:text-gray-400 uppercase">
          Queue · {selected.length} item{selected.length !== 1 ? "s" : ""}
        </span>
        <span className="text-xs text-slate-500 dark:text-gray-400">{mode === "bulk" ? "Bulk" : "Single"} mode</span>
      </div>

      {/* Items */}
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
                  <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
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

const AlreadyAddedOverlay = () => (
  <div
    className="absolute inset-0 bg-slate-950/45 dark:bg-black/55 flex flex-col items-center justify-center gap-2 rounded-inherit backdrop-blur-2xl"
  >
    <div
      className="w-10 h-10 rounded-full bg-emerald-500/10 dark:bg-emerald-50/20 border-2 border-emerald-500 flex items-center justify-center"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M4 9l4 4 6-7" stroke="#4ade80" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
    <span className="text-[11px] font-bold tracking-[0.06em] uppercase text-emerald-200 dark:text-emerald-300">
      Already Added
    </span>
  </div>
);


const InventoryModal = memo(({
  product,
  item,
  isAlreadyInInventory,
  onClose,
  onChange,
  onAddToInventory,
}: {
  product: any;
  item: InventoryItem;
  isAlreadyInInventory: boolean;
  onClose: () => void;
  onChange: (field: keyof InventoryItem, value: any) => void;
  onAddToInventory: () => void;
}) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 dark:bg-black/70 backdrop-blur-2xl"
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes modalIn { from { transform: scale(0.96) translateY(8px); opacity: 0 } to { transform: scale(1) translateY(0); opacity: 1 } }
      `}</style>
      <div
        className="w-full max-w-[480px] bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700/30 rounded-[20px] p-7 shadow-[0_32px_80px_rgba(2,6,23,0.18)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
      >
        {/* Header */}
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
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Warning if already in inventory */}
        {isAlreadyInInventory && (
          <div className="bg-amber-500/10 dark:bg-amber-900/10 border border-amber-500/20 dark:border-amber-900/20 rounded-lg p-3 mb-4 flex gap-2.5 items-start"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-1">
              <path d="M8 2L14.9 14H1.1L8 2z" fill="rgba(234,179,8,0.2)" stroke="#eab308" strokeWidth="1.2" strokeLinejoin="round"/>
              <path d="M8 6v4M8 11.5v.5" stroke="#eab308" strokeWidth="1.4" strokeLinecap="round"/>
            </svg>
            <div>
              <div className="text-sm font-semibold text-amber-800 dark:text-amber-400">Already in Inventory</div>
              <div className="text-xs text-amber-700 dark:text-amber-600 mt-1">This product has an existing inventory entry. Adding again will create a duplicate.</div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[
            { label: "Price *", field: "price" as keyof InventoryItem, type: "number" },
            { label: "Sale Price *", field: "sale_price" as keyof InventoryItem, type: "number" },
            { label: "Discount Price", field: "discount_price" as keyof InventoryItem, type: "number" },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
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
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
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
            <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">
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

        {/* Actions */}
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
            {isAlreadyInInventory ? "Add Anyway" : "Add to Inventory"}
          </button>
        </div>
      </div>
    </div>
  );
});

InventoryModal.displayName = "InventoryModal";

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
        hovered && !inInventory && !selected ? "-translate-y-0.5 shadow-[0_14px_30px_rgba(2,6,23,0.10)] dark:shadow-[0_14px_30px_rgba(0,0,0,0.35)]" : "",
        inInventory ? "cursor-not-allowed opacity-80" : "cursor-pointer",
      ].join(" ")}
    >
      <div className="relative h-40">
        <img
          src={product?.image_urls?.thumbnail?.url || "/placeholder.jpg"}
          alt={product.name}
          className={[
            "w-full h-full object-cover block transition",
            inInventory ? "brightness-75" : "",
          ].join(" ")}
        />

        {/* In-inventory overlay */}
        {inInventory && <AlreadyAddedOverlay />}

        {mode === "bulk" && selected && (
          <div
            className="absolute top-2.5 right-2.5 w-7 h-7 bg-emerald-600 rounded-full flex items-center justify-center z-[3] shadow-lg shadow-black/30"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}

        <div
          className="absolute bottom-2 left-2 z-[3] text-[10px] font-semibold bg-slate-950/55 text-slate-100 px-2 py-0.5 rounded-md backdrop-blur"
        >
          {product.category?.name}
        </div>
      </div>

      <div className="px-3.5 pt-3 pb-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug">{product.name}</div>
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
              <span key={t.id} className="text-[9px] font-bold tracking-[0.04em] text-violet-700 dark:text-violet-300 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
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


const AddListingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [inventoryData, setInventoryData] = useState<Record<number, InventoryItem>>({});
  const [openProductId, setOpenProductId] = useState<number | null>(null);

  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["seller-products"],
    queryFn: () => ProductService.getAllPrivate(),
  });

  const products = data ?? [];

  const addMutation = useMutation({
    mutationFn: async () => {
      for (const productId of selectedProducts) {
        const item = inventoryData[productId];
        const formData = new FormData();
        const storeId = user?.stores?.[0]?.id || "";
        formData.append("store_id", storeId.toString());
        formData.append("product_id", productId.toString());
        formData.append("price", item.price.toString());
        formData.append("stock", item.stock.toString());
        formData.append("quantity", item.quantity.toString());
        formData.append("active", item.active ? "true" : "false");
        if (item.sale_price) formData.append("sale_price", item.sale_price.toString());
        if (item.discount_price) formData.append("discount_price", item.discount_price.toString());
        if (item.discount_start_date) formData.append("discount_start_date", item.discount_start_date);
        if (item.discount_end_date) formData.append("discount_end_date", item.discount_end_date);
        await InventoryService.create(formData);
      }
    },
    onSuccess: () => {
      toast.success("Inventory created successfully");
      queryClient.invalidateQueries({ queryKey: ["inventories", "my-products"] });
      navigate("/inventory");
    },
    onError: (error: any) => {
      const apiMessage = error?.response?.data?.message || error?.message || null;
      toast.error(apiMessage || "Failed to create inventory");
    },
  });

  const initItem = (productId: number) => {
    if (!inventoryData[productId]) {
      const product = products.find((p: any) => p.id === productId);
      setInventoryData((prev) => ({
        ...prev,
        [productId]: {
          price: product?.price ?? "",
          stock: 1,
          quantity: 1,
          active: true,
        },
      }));
    }
  };

  const handleProductSelect = (productId: number) => {
    initItem(productId);
    if (mode === "single") {
      setSelectedProducts([productId]);
      setOpenProductId(productId);
    } else {
      setSelectedProducts((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
    }
  };

  const updateItem = (productId: number, field: keyof InventoryItem, value: any) => {
    setInventoryData((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  };

  const removeFromQueue = (id: number) => {
    setSelectedProducts((prev) => prev.filter((x) => x !== id));
  };

  const alreadyIn = (id: number) => Boolean(products.find((p: any) => p.id === id)?.in_inventory);
  const inventoryCount = products.filter((p: any) => Boolean(p?.in_inventory)).length;

  if (isLoading) {
    return (
      <div className="p-10 text-slate-500 dark:text-slate-400 flex items-center gap-3">
        <div className="w-4 h-4 rounded-full border-2 border-slate-300 dark:border-slate-700 border-t-emerald-500 animate-spin" />
        Loading products…
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] m-0">Add Inventory</h2>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">
              {products.length} products ·{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {inventoryCount} already in inventory
              </span>
            </p>
          </div>

          {/* Mode toggle */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg p-1 shadow-sm dark:shadow-none">
            {(["single", "bulk"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setSelectedProducts([]); setInventoryData({}); }}
                className={[
                  "px-[18px] py-[7px] rounded-lg text-[13px] font-bold tracking-[0.03em] capitalize transition-all",
                mode === m ? "bg-emerald-600 text-white shadow-sm" : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200",
                ].join(" ")}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* ── Legend ── */}
      <div className="flex gap-5 mb-5 text-sm text-slate-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border border-emerald-600/25 bg-emerald-500/10" />
            Already in inventory
          </div>
          <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border border-emerald-600 bg-emerald-500/15" />
            Selected
          </div>
          <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm border border-slate-300 dark:border-white/10 bg-white dark:bg-transparent" />
            Available
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              product={product}
              selected={selectedProducts.includes(product.id)}
              inInventory={alreadyIn(product.id)}
              mode={mode}
              onClick={() => handleProductSelect(product.id)}
            />
          ))}
        </div>

        {/* ── Bulk inline forms ── */}
        {mode === "bulk" && selectedProducts.map((id) => {
          const product = products.find((p: any) => p.id === id);
          const item = inventoryData[id];
          return (
            <div
              key={id}
              className="mt-4 bg-white dark:bg-slate-900 border border-emerald-600/25 dark:border-emerald-500/30 rounded-[14px] p-5 shadow-sm dark:shadow-none"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={product?.image_urls?.thumbnail?.url || "/placeholder.jpg"}
                  alt={product?.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div>
                  <div className="font-semibold text-base">{product?.name}</div>
                  {alreadyIn(id) && <div className="mt-1"><InInventoryBadge /></div>}
                </div>
              </div>

              {alreadyIn(id) && (
                <div className="bg-amber-500/10 dark:bg-amber-900/10 border border-amber-500/20 dark:border-amber-900/20 rounded-lg p-3 mb-4 text-sm text-amber-800 dark:text-amber-400">
                  ⚠ This product already has an inventory entry. You're creating an additional one.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { label: "Price", field: "price" as keyof InventoryItem },
                  { label: "Sale Price", field: "sale_price" as keyof InventoryItem },
                  { label: "Discount Price", field: "discount_price" as keyof InventoryItem },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
                    <input
                      type="number"
                      value={(item as any)[field] ?? ""}
                      onChange={(e) => updateItem(id, field, e.target.value ? +e.target.value : undefined)}
                      className="w-full bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200"
                    />
                  </div>
                ))}
                {[
                  { label: "Discount Start", field: "discount_start_date" as keyof InventoryItem },
                  { label: "Discount End", field: "discount_end_date" as keyof InventoryItem },
                ].map(({ label, field }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-gray-400 mb-1 uppercase tracking-wider">{label}</label>
                    <input
                      type="date"
                      value={(item as any)[field] ?? ""}
                      onChange={(e) => updateItem(id, field, e.target.value || undefined)}
                      className="w-full bg-white dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700/30 rounded-lg p-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all duration-200"
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* ── Bulk submit ── */}
        {mode === "bulk" && selectedProducts.length > 0 && (
          <div className="mt-5 flex justify-end">
            <button
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
              className="py-3 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {addMutation.isPending ? "Saving…" : `Add ${selectedProducts.length} to Inventory`}
            </button>
          </div>
        )}
      </div>

      {/* ── Single mode modal ── */}
      {openProductId && inventoryData[openProductId] && (
        <InventoryModal
          product={products.find((p: any) => p.id === openProductId)}
          item={inventoryData[openProductId]}
          isAlreadyInInventory={alreadyIn(openProductId)}
          onClose={() => { setOpenProductId(null); setSelectedProducts([]); }}
          onChange={(field, value) => updateItem(openProductId, field, value)}
          onAddToInventory={() => {
            setSelectedProducts([openProductId]);
            setOpenProductId(null);
            addMutation.mutate();
          }}
        />
      )}

      {/* ── Floating queue sidebar (bulk mode) ── */}
      {mode === "bulk" && (
        <SelectionSidebar
          products={products}
          selected={selectedProducts}
          inventoryData={inventoryData}
          onRemove={removeFromQueue}
          onSubmit={() => addMutation.mutate()}
          isPending={addMutation.isPending}
          mode={mode}
        />
      )}
    </div>
  );
};

export default AddListingPage;