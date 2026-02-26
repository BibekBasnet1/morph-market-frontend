import api from "../client"; // axios instance with interceptors
import type { Trait } from "../../../types";

type GetAllParams = {
  page?: number;
};

export const TraitsService = {
  async getAll(): Promise<Trait[]> {
    const res = await api.get("/admin/traits");
    return res.data.data.data;
  },

  async getAllPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/admin/traits", {
      params: { page },
    });
    return res.data.data;
  },

  async getAllPublic(): Promise<Trait[]> {
    const res = await api.get("/traits");
    return res.data.data.data;
  },

  async getAllPublicPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/traits", {
      params: { page },
    });
    return res.data.data;
  },

  create: async (payload: FormData): Promise<Trait> => {
    const res = await api.post("/admin/traits", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Trait> => {
    const res = await api.post(`/admin/traits/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/traits/${id}`);
  },
};