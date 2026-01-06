import api from "../client"; // axios instance with interceptors
import type { Origin } from "../../../types";

export const OriginService = {
  async getAll(): Promise<Origin[]> {
    const res = await api.get("/admin/origins");
    return res.data.data.data;
  },

    async getAllPublic(): Promise<Origin[]> {
    const res = await api.get("/origins");
    return res.data.data.data;
  },

  create: async (payload: FormData): Promise<Origin> => {
    const res = await api.post("/admin/origins", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Origin> => {
    const res = await api.post(`/admin/origins/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/origins/${id}`);
  },
};