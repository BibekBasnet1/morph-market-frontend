import { useEffect, useRef } from "react";
import { CartService } from "../lib/api/cart";
import type { Cart } from "../types/CartTypes";

const isLoggedIn = (): boolean => {
  try {
    const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
    return !!auth?.user && !!auth?.token;
  } catch {
    return false;
  }
};

const getLocalCarts = (): Cart[] => {
  try {
    return JSON.parse(localStorage.getItem("cart-products") || "[]");
  } catch {
    return [];
  }
};

export const useCartSync = () => {
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!isLoggedIn()) return;
    if (syncedRef.current) return;

    const localCarts = getLocalCarts();
    if (!localCarts.length) return;

    syncedRef.current = true;

    const syncCarts = async () => {
      try {
        for (const item of localCarts) {
          await CartService.create({
            product_id: item.product_id,
            store_id: item.store_id!,
            quantity: item.quantity,
          });
        }

        localStorage.removeItem("cart-products");
      } catch (error) {
        console.error("Cart sync failed", error);
        syncedRef.current = false; // retry later
      }
    };

    syncCarts();
  }, []);
};
