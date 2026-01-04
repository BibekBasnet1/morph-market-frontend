import type { StoreForm } from "../../types/StoreType";
import api from "./client";

export const StoreService = {
  async getAll(): Promise<StoreForm[]> {
    const res = await api.get("/admin/stores");
    return res.data.data.data;
  },

  create: async (payload: FormData): Promise<StoreForm> => {
    const res = await api.post("/admin/stores", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<StoreForm> => {
    const res = await api.post(`/admin/stores/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/stores/${id}`);
  },
};
