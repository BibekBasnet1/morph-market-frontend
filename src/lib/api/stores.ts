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
    const res = await api.post(`/buyer/stores/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/buyer/stores/${id}`);
  },

  getMyStore: async() => {
    const response = await api.get('/buyers/stores/my-store');
    return response.data.data;
  },
};
