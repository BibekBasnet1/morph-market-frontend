import api from "./client"; // axios instance with interceptors
import type { Category } from "../../types";

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const res = await api.get("/admin/categories");
    return res.data.data.data;
  },
    async getAllPublic(): Promise<Category[]> {
    const res = await api.get("/categories");
    return res.data.data.data;
  },

  create: async (payload: FormData): Promise<Category> => {
    const res = await api.post("/admin/categories", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Category> => {
    const res = await api.post(`/admin/categories/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};
