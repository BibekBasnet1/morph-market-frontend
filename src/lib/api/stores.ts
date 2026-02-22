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

  getMyStore: async() => {
    const response = await api.get('/buyer/stores/user/my-store');
    return response.data.data;
  },

async getAllStores(): Promise<StoreForm[]> {
  const res = await api.get("/stores");
  return res.data?.data ?? [];
},
      async getStoresById(storeId:any): Promise<StoreForm[]> {
    const res = await api.get(`/stores/${storeId}/products`);
    return res.data.data;
  },
};
