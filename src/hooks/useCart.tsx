import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "../lib/api/cart";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-hot-toast";
import type { Cart } from "../types/CartTypes";

const loadLocalCarts = (): Cart[] => {
  try {
    return JSON.parse(localStorage.getItem("cart-products") || "[]");
  } catch {
    return [];
  }
};

/**
 * Hook that returns the current cart items and derived counts.
 * It merges localStorage carts with API carts (for authenticated users)
 * and listens for updates so that consumers (like the navbar) stay in sync.
 */
export const useCart = () => {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // react query for carts when logged in
  const { data: apiCarts = [] } = useQuery<Cart[]>({
    queryKey: ["carts"],
    queryFn: CartService.list,
    enabled: isAuthenticated,
  });

  // keep a local copy of guest carts, update on storage events or custom events
  const [localCarts, setLocalCarts] = useState<Cart[]>(() => loadLocalCarts());

  useEffect(() => {
    const handleStorage = () => {
      setLocalCarts(loadLocalCarts());
    };

    window.addEventListener("cart-updated", handleStorage);
    // storage event only fires on other windows/tabs
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("cart-updated", handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const carts = useMemo<Cart[]>(() => {
    return isAuthenticated ? [...apiCarts, ...localCarts] : localCarts;
  }, [apiCarts, localCarts, isAuthenticated]);

  const count = useMemo(() => {
    return carts.reduce((sum, item) => sum + item.quantity, 0);
  }, [carts]);

  // mutation for removing an item from API cart
  const removeMutation = useMutation({
    mutationFn: (id: number) => CartService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["carts"] }),
  });

  const removeFromCart = (productId: number) => {
    // find matching cart item
    const item = carts.find((c) => c.product_id === productId);
    if (!item) return;

    if (!isAuthenticated || !item.user_id) {
      const updated = localCarts.filter((c) => c.product_id !== productId);
      setLocalCarts(updated);
      localStorage.setItem("cart-products", JSON.stringify(updated));
      window.dispatchEvent(new Event("cart-updated"));
      toast.success("Removed from cart");
      return;
    }

    removeMutation.mutate(item.id, {
      onSuccess: () => {
        toast.success("Removed from cart");
      },
      onError: () => {
        toast.error("Failed to remove item");
      },
    });
  };

  // `isLoading` isn't recognized on the result type so cast to any for callers
  return { carts, count, removeFromCart, removing: (removeMutation as any).isLoading };
};
