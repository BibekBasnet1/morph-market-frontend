import api from "../client"; // axios instance with interceptors
import type { Maturity } from "../../../types";

type GetAllParams = {
  page?: number;
};

export const MaturityService = {
  async getAll(): Promise<Maturity[]> {
    const res = await api.get("/admin/maturity-levels");
    return res.data.data.data;
  },

  async getAllPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/admin/maturity-levels", {
      params: { page },
    });
    return res.data.data;
  },

  async getAllPublic(): Promise<Maturity[]> {
    const res = await api.get("/maturity-levels");
    return res.data.data.data;
  },

  async getAllPublicPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/maturity-levels", {
      params: { page },
    });
    return res.data.data;
  },

  create: async (payload: FormData): Promise<Maturity> => {
    const res = await api.post("/admin/maturity-levels", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Maturity> => {
    const res = await api.post(`/admin/maturity-levels/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/maturity-levels/${id}`);
  },
};