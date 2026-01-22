import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "../../lib/api/cart";
import type { Cart } from "../../types/CartTypes";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { useAuth } from "../../contexts/AuthContext";
import { toast } from "react-hot-toast";

/* ---------------- Local cart helpers ---------------- */
const loadLocalCarts = (): Cart[] => {
  try {
    return JSON.parse(localStorage.getItem("cart-products") || "[]");
  } catch {
    return [];
  }
};
const GENDER_MAP: Record<number, string> = {
  1: "Unknown",
  2: "Male",
  3: "Female",
};


const saveLocalCarts = (carts: Cart[]) => {
  localStorage.setItem("cart-products", JSON.stringify(carts));
};

const CartPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  /* ---------------- Local cart state ---------------- */
  const [localCarts, setLocalCarts] = useState<Cart[]>([]);

  useEffect(() => {
    setLocalCarts(loadLocalCarts());
  }, []);

  /* ---------------- API carts ---------------- */
  const { data: apiCarts = [] } = useQuery<Cart[]>({
    queryKey: ["carts"],
    queryFn: CartService.list,
    enabled: isAuthenticated,
  });

  /* ---------------- Merge carts ---------------- */
  const carts = useMemo<Cart[]>(() => {
    return isAuthenticated ? [...apiCarts, ...localCarts] : localCarts;
  }, [apiCarts, localCarts, isAuthenticated]);

  /* ---------------- API mutations ---------------- */
  const updateMutation = useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      CartService.update(id, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  });

  const removeMutation = useMutation({
    mutationFn: (id: number) => CartService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      toast.success("Item removed");
    },
  });

  /* ---------------- Handlers ---------------- */
  const updateQuantity = (item: Cart, quantity: number) => {
    if (quantity < 1) return;

    // Guest cart
    if (!isAuthenticated || !item.user_id) {
      const updated = localCarts.map((c) =>
        c.id === item.id ? { ...c, quantity } : c
      );
      setLocalCarts(updated);
      saveLocalCarts(updated);
      return;
    }

    // API cart
    updateMutation.mutate({ id: item.id, quantity });
  };

  const removeItem = (item: Cart) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this item from your cart?"
    );

    if (!confirmed) return;

    // Guest cart
    if (!isAuthenticated || !item.user_id) {
      const updated = localCarts.filter((c) => c.id !== item.id);
      setLocalCarts(updated);
      saveLocalCarts(updated);
      toast.success("Item removed");
      return;
    }

    // API cart
    removeMutation.mutate(item.id);
  };

  const totalAmount = carts.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (!carts.length) {
    return <p className="p-6">Your cart is empty</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-semibold">My Cart</h1>

      {carts.map((item:any) => {
        const product = item.product;

        return (
          <Card key={item.id}>
            <CardContent className="p-4 flex gap-4">
              {/* Image */}
              <img
                src={product?.image ?? "https://placehold.co/120x120"}
                alt={product?.name}
                className="w-auto h-28 rounded object-cover"
              />

              {/* Info */}
              <div className="flex-1 space-y-2">
                <p className="text-lg font-medium">
                  {product?.name ?? `Product #${item.product_id}`}
                </p>
                {product?.gender_id && (
  <p className="text-sm text-muted-foreground">
    Gender: <span className="font-medium">{GENDER_MAP[product.gender_id]}</span>
  </p>
)}
<p>Origin: {product.origin_id}</p>

<p>Diet: {product.diet_id}</p>
<p>Maturity: {product.maturity_level_id}</p>

                {product?.traits?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {product.traits.map((trait: string) => (
                      <span
                        key={trait}
                        className="px-2 py-0.5 text-xs bg-muted rounded"
                      >
                        {trait}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-sm">
                  Price: <strong>${item.price}</strong>
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(item, item.quantity - 1)
                    }
                  >
                    −
                  </Button>
                  <span>{item.quantity}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      updateQuantity(item, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                </div>

                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => removeItem(item)}
                >
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}

      {/* Total */}
      <Card>
        <CardContent className="p-4 flex justify-between">
          <span className="font-semibold">Total</span>
          <span className="text-lg font-bold">
            ${totalAmount.toFixed(2)}
          </span>
        </CardContent>
      </Card>

      {/* Checkout */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={() =>
            isAuthenticated ? navigate("/checkout") : navigate("/login")
          }
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
