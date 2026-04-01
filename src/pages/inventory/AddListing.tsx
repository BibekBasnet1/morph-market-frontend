import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ProductService } from "../../lib/api/products";
import { useAuth } from "../../contexts/AuthContext";
import { InventoryService } from "../../lib/api";
import { toast } from "react-hot-toast";
import type { InventoryFormItem } from "../../components/inventory/types";
import InInventoryBadge from "../../components/inventory/InInventoryBadge";
import InventoryModal from "../../components/inventory/InventoryModal";
import ProductCard from "../../components/inventory/ProductCard";
import SelectionSidebar from "../../components/inventory/SelectionSidebar";

const AddListingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [inventoryData, setInventoryData] = useState<Record<number, InventoryFormItem>>({});
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

  const updateItem = (productId: number, field: keyof InventoryFormItem, value: any) => {
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
    <div className="min-h-screen p-6 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] m-0">Add To Inventory</h2>
            <p className="text-[13px] text-slate-600 dark:text-slate-400 mt-1">
              {products.length} products ·{" "}
              <span className="text-emerald-600 dark:text-emerald-400">
                {inventoryCount} already in inventory
              </span>
            </p>
          </div>

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
                  { label: "Price", field: "price" as keyof InventoryFormItem },
                  { label: "Sale Price", field: "sale_price" as keyof InventoryFormItem },
                  { label: "Discount Price", field: "discount_price" as keyof InventoryFormItem },
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
                  { label: "Discount Start", field: "discount_start_date" as keyof InventoryFormItem },
                  { label: "Discount End", field: "discount_end_date" as keyof InventoryFormItem },
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