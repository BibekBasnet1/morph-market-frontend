import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CartService } from "../lib/api/cart";
import type { AddToCartPayload } from "../types/CartTypes";
import type { ProductDetails } from "../types/ProductDetailsType";
import { toast } from "react-hot-toast";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  const isGuestUser = (): boolean => {
    try {
      const auth = JSON.parse(localStorage.getItem("auth-storage") || "{}");
      return !auth?.user || !auth?.token;
    } catch {
      return true;
    }
  };

  const addToLocalCart = ({
    product,
    price,
  }: {
    product: ProductDetails;
    price: number;
  }) => {
    const existing: any[] = JSON.parse(
      localStorage.getItem("cart-products") || "[]"
    );

    const index = existing.findIndex(
      (item) => item.product_id === product.id
    );

    if (index !== -1) {
      existing[index].quantity += 1;
      existing[index].updated_at = new Date().toISOString();
    } else {
      existing.push({
        id: Date.now(),
        user_id: null,
        product_id: product.id,
        product_slug: product.slug,
        quantity: 1,
        price,
        status: "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        product,
      });
    }

    localStorage.setItem("cart-products", JSON.stringify(existing));
  };

  const addToCartMutation = useMutation({
    mutationFn: (payload: AddToCartPayload) =>
      CartService.create(payload),
    onSuccess: () => {
      toast.success("Added to cart");
      queryClient.invalidateQueries({ queryKey: ["carts"] });
    },
    onError: () => {
      toast.error("Failed to add to cart");
    },
  });

  const handleAddToCart = ({
    product,
    price,
  }: {
    product: ProductDetails;
    price: number;
  }) => {
    const payload: AddToCartPayload = {
      product_id: product.id,
      quantity: 1,
    };

    if (isGuestUser()) {
      addToLocalCart({ product, price });
      toast.success("Added to cart");
      return;
    }

    addToCartMutation.mutate(payload);
  };

  return {
    handleAddToCart,
    addToCartMutation,
    isGuestUser,
    addToLocalCart,
  };
};
