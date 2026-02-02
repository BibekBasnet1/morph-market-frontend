import api  from "./client";
import type { Cart, AddToCartPayload } from "../../types/CartTypes";

export const CartService = {
  create: async (payload: AddToCartPayload): Promise<Cart> => {
    const res = await api.post("/carts", payload);
    return res.data.data;
  },

  list: async (): Promise<Cart[]> => {
    const res = await api.get("/carts");
    return res.data.data;
  },
    update: async (id: number, payload: FormData): Promise<Cart[]> => {
    const res = await api.put(`/carts/${id}`, payload);
    return res.data.data;
  },
  remove: async (id: number): Promise<void> => {
    await api.delete(`/carts/${id}`);
  },
};
