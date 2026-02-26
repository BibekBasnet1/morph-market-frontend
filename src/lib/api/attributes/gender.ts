import api from "../client"; // axios instance with interceptors
import type { Gender } from "../../../types";

type GetAllParams = {
  page?: number;
};

export const GenderService = {
  async getAll(): Promise<Gender[]> {
    const res = await api.get("/admin/genders");
    return res.data.data.data;
  },

  async getAllPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/admin/genders", {
      params: { page },
    });
    return res.data.data;
  },

  async getAllPublic(): Promise<Gender[]> {
    const res = await api.get("/genders");
    return res.data.data.data;
  },

  async getAllPublicPaginated({ page = 1 }: GetAllParams = {}) {
    const res = await api.get("/genders", {
      params: { page },
    });
    return res.data.data;
  },

  create: async (payload: FormData): Promise<Gender> => {
    const res = await api.post("/admin/genders", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Gender> => {
    const res = await api.post(`/admin/genders/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/genders/${id}`);
  },
};