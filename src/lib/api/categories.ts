import api from "./client"; // axios instance with interceptors
import type { Category } from "../../types";

type GetAllParams = {
  page?: number;
};

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    const res = await api.get("/admin/categories");
    return res.data.data.data;
  },

  async getAllPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/categories", {
      params: { page },
    });
    return res.data.data;
  },

  async getAllPublic(): Promise<Category[]> {
    const res = await api.get("/categories");
    return res.data.data.data;
  },

  async getAllPublicPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/categories", {
      params: { page },
    });
    return res.data.data;
  },

  create: async (payload: FormData): Promise<Category> => {
    const res = await api.post("/admin/categories", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Category> => {
    const res = await api.put(`/admin/categories/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/categories/${id}`);
  },
};
