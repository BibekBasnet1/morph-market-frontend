import api from "../client"; // axios instance with interceptors
import type { Diet } from "../../../types";

type GetAllParams = {
  page?: number;
};

export const DietService = {
  async getAll(): Promise<Diet[]> {
    const res = await api.get("/admin/diets");
    return res.data.data.data;
  },

  async getAllPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/admin/diets", {
      params: { page },
    });
    return res.data.data;
  },

  async getAllPublic(): Promise<Diet[]> {
    const res = await api.get("/diets");
    return res.data.data.data;
  },

  async getAllPublicPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/diets", {
      params: { page },
    });
    return res.data.data;
  },

  create: async (payload: FormData): Promise<Diet> => {
    const res = await api.post("/admin/diets", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Diet> => {
    const res = await api.put(`/admin/diets/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/diets/${id}`);
  },
};