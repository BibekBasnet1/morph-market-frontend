import api from "../client"; // axios instance with interceptors
import type { Diet } from "../../../types";

export const DietService = {
  async getAll(): Promise<Diet[]> {
    const res = await api.get("/admin/diets");
    return res.data.data.data;
  },

  create: async (payload: FormData): Promise<Diet> => {
    const res = await api.post("/admin/diets", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Diet> => {
    const res = await api.post(`/admin/diets/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/diets/${id}`);
  },
};