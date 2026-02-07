import api from "../client"; // axios instance with interceptors
import type { Gender } from "../../../types";

export const GenderService = {
  async getAll(): Promise<Gender[]> {
    const res = await api.get("/admin/genders");
    return res.data.data.data;
  },
    async getAllPublic(): Promise<Gender[]> {
    const res = await api.get("/genders");
    return res.data.data.data;
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