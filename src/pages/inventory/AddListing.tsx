import { useState, memo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { ProductService } from "../../lib/api/products";
import { useAuth } from "../../contexts/AuthContext";
import { InventoryService } from "../../lib/api";
import { toast } from "react-hot-toast";

type InventoryItem = {
  price: number;
  sale_price?: number;
  discount_price?: number;
  discount_start_date?: string;
  discount_end_date?: string;
  stock: number;
  quantity: number;
  active: boolean;
};

const InventoryModal = memo(({
  product,
  item,
  onClose,
  onChange,
  onAddToInventory,
}: {
  product: any;
  item: InventoryItem;
  onClose: () => void;
  onChange: (field: keyof InventoryItem, value: any) => void;
  onAddToInventory: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-xl rounded-xl bg-white p-6 dark:bg-[#111827]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{product.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price</Label>
            <Input
              type="number"
              value={item.price}
              onChange={(e) => onChange("price", +e.target.value)}
            />
          </div>

          <div>
            <Label>Sale Price</Label>
            <Input
              type="number"
              value={item.sale_price || ""}
              onChange={(e) =>
                onChange(
                  "sale_price",
                  e.target.value ? +e.target.value : undefined
                )
              }
            />
          </div>

          <div>
            <Label>Discount Price</Label>
            <Input
              type="number"
              value={item.discount_price || ""}
              onChange={(e) =>
                onChange(
                  "discount_price",
                  e.target.value ? +e.target.value : undefined
                )
              }
            />
          </div>

          <div>
            <Label>Discount Start Date</Label>
            <Input
              type="date"
              value={item.discount_start_date || ""}
              onChange={(e) =>
                onChange(
                  "discount_start_date",
                  e.target.value || undefined
                )
              }
            />
          </div>

          <div>
            <Label>Discount End Date</Label>
            <Input
              type="date"
              value={item.discount_end_date || ""}
              onChange={(e) =>
                onChange(
                  "discount_end_date",
                  e.target.value || undefined
                )
              }
            />
          </div>

          <div>
            <Label>Stock</Label>
            <Input
              type="number"
              value={item.stock}
              onChange={(e) => onChange("stock", +e.target.value)}
            />
          </div>

          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={item.quantity}
              onChange={(e) => onChange("quantity", +e.target.value)}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onAddToInventory} className="bg-green-600 hover:bg-green-700">
            Add to Inventory
          </Button>
        </div>
      </div>
    </div>
  );
});

InventoryModal.displayName = "InventoryModal";

const AddListingPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [mode, setMode] = useState<"single" | "bulk">("single");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [inventoryData, setInventoryData] = useState<
    Record<number, InventoryItem>
  >({});

  const [openProductId, setOpenProductId] = useState<number | null>(null);


  const { user } = useAuth();
  const storeSlug = user?.stores?.[0]?.slug;

  const { data, isLoading } = useQuery({
    queryKey: ["seller-products", storeSlug],
    queryFn: () => ProductService.getAllPrivate(storeSlug as string),
    enabled: !!storeSlug,
  });

  const products = data?.data ?? [];

  const addMutation = useMutation({
    mutationFn: async () => {
      for (const productId of selectedProducts) {
        const item = inventoryData[productId];

        const formData = new FormData();
        formData.append("store_id", "1");
        formData.append("product_id", productId.toString());
        formData.append("price", item.price.toString());
        formData.append("stock", item.stock.toString());
        formData.append("quantity", item.quantity.toString());
        formData.append("active", item.active ? "true" : "false");

        if (item.sale_price)
          formData.append("sale_price", item.sale_price.toString());

        if (item.discount_price)
          formData.append("discount_price", item.discount_price.toString());

        if (item.discount_start_date)
          formData.append(
            "discount_start_date",
            item.discount_start_date
          );

        if (item.discount_end_date)
          formData.append("discount_end_date", item.discount_end_date);

        await InventoryService.create(formData);
      }
    },
    onSuccess: () => {
      toast.success("Inventory created successfully");
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
      navigate("/inventory");
    },
    onError: () => {
      toast.error("Failed to create inventory");
    },
  });

const handleProductSelect = (productId: number) => {
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

  if (!inventoryData[productId]) {
    const product = products.find((p: any) => p.id === productId);

    setInventoryData((prev) => ({
      ...prev,
      [productId]: {
        price: product?.price || 0,
        stock: 1,
        quantity: 1,
        active: true,
      },
    }));
  }
};



  const updateItem = (
    productId: number,
    field: keyof InventoryItem,
    value: any
  ) => {
    setInventoryData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [field]: value,
      },
    }));
  };

  if (isLoading) {
    return <div className="p-6 dark:text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen dark:bg-[#0b0f0e] dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Add Inventory</h2>

          <div className="flex gap-2">
            <Button
              variant={mode === "single" ? "primary" : "outline"}
              onClick={() => {
                setMode("single");
                setSelectedProducts([]);
                setInventoryData({});
              }}
            >
              Single
            </Button>
            <Button
              variant={mode === "bulk" ? "primary" : "outline"}
              onClick={() => {
                setMode("bulk");
                setSelectedProducts([]);
                setInventoryData({});
              }}
            >
              Bulk
            </Button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => {
            const selected = selectedProducts.includes(product.id);

            return (
              <div
                key={product.id}
                onClick={() => handleProductSelect(product.id)}
                className={`cursor-pointer rounded-xl overflow-hidden border
                  ${
                    selected
                      ? "border-green-500 ring-1 ring-green-500"
                      : "border-gray-800"
                  }
                  dark:bg-[#111827]
                `}
              >
                <img
                  src={product.image || "/placeholder.jpg"}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{product.name}</h3>
                  <p className="text-sm text-gray-400">
                    Base Price: ${product.price}
                  </p>
                </div>
              </div>
            );
          })}
        </div>



       {mode === "bulk" &&
        selectedProducts.map((id) => {
          const product = products.find((p: any) => p.id === id);
          const item = inventoryData[id];

          return (
            <Card
              key={id}
              className="mt-6 dark:bg-[#111827] border border-green-500"
            >
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">{product?.name}</h3>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      type="text"
                      value={item.price}
                      onChange={(e) =>
                        updateItem(id, "price", +e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Sale Price</Label>
                    <Input
                      type="text"
                      value={item.sale_price || ""}
                      onChange={(e) =>
                        updateItem(
                          id,
                          "sale_price",
                          e.target.value ? +e.target.value : undefined
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label>Discount Price</Label>
                    <Input
                      type="text"
                      value={item.discount_price || ""}
                      onChange={(e) =>
                        updateItem(
                          id,
                          "discount_price",
                          e.target.value ? +e.target.value : undefined
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label>Discount Start</Label>
                    <Input
                      type="date"
                      value={item.discount_start_date || ""}
                      onChange={(e) =>
                        updateItem(id, "discount_start_date", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Discount End</Label>
                    <Input
                      type="date"
                      value={item.discount_end_date || ""}
                      onChange={(e) =>
                        updateItem(id, "discount_end_date", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Stock</Label>
                    <Input
                      type="text"
                      value={item.stock}
                      onChange={(e) =>
                        updateItem(id, "stock", +e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="text"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(id, "quantity", +e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {openProductId && (
  <InventoryModal
    product={products.find((p: any) => p.id === openProductId)}
    item={inventoryData[openProductId]}
    onClose={() => setOpenProductId(null)}
    onChange={(field, value) =>
      updateItem(openProductId, field, value)
    }
    onAddToInventory={() => {
      setSelectedProducts([openProductId]);
      setOpenProductId(null);
      addMutation.mutate();
    }}
  />
)}


        {/* Submit */}
        {selectedProducts.length > 0 && (
          <div className="flex justify-end mt-8">
            <Button
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {addMutation.isPending ? "Saving..." : "Create Inventory"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddListingPage;
