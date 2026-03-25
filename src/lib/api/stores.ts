import type { StoreForm } from "../../types/StoreType";
import api from "./client";

export const StoreService = {
  async getAll(): Promise<StoreForm[]> {
    const res = await api.get("/buyer/stores");
    return res.data.data.data;
  },

  create: async (payload: FormData): Promise<StoreForm> => {
    const res = await api.post("/buyer/stores", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<StoreForm> => {
    payload.append("_method", "PUT");
    const res = await api.post(`/buyer/stores/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/buyer/stores/${id}`);
  },

  getMyStore: async () => {
    const response = await api.get('/buyer/stores/user/my-store');
    return response.data.data;
  },

  async getAllStores(): Promise<StoreForm[]> {
    const res = await api.get("/stores");
    return res.data?.data ?? [];
  },

  async getStoresById(storeId: string | number): Promise<StoreForm[]> {
    const res = await api.get(`/stores/${storeId}/products`);
    return res.data.data;
  },

  /**
   * Submit a 1–5 star rating for a store.
   */
  async submitStoreRating(
    storeId: string | number,
    rating: number
  ): Promise<{ user_rating: number; message?: string }> {
    const clamped = Math.min(5, Math.max(1, Math.round(rating)));
    const res = await api.post(`/stores/${storeId}/rating`, { rating: clamped });
    const root = res.data as Record<string, unknown>;
    const inner =
      root &&
      typeof root === "object" &&
      "data" in root &&
      root.data != null &&
      typeof root.data === "object"
        ? (root.data as Record<string, unknown>)
        : {};
    const merged: Record<string, unknown> = { ...root, ...inner };
    const userRating = merged.user_rating ?? merged.my_rating ?? clamped;
    return {
      user_rating: Number(userRating),
      message:
        typeof merged.message === "string"
          ? merged.message
          : typeof root.message === "string"
            ? root.message
            : undefined,
    };
  },
};
