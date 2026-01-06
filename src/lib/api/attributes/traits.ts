import api from "../client"; // axios instance with interceptors
import type { Trait } from "../../../types";

export const TraitsService = {
  async getAll(): Promise<Trait[]> {
    const res = await api.get("/admin/traits");
    console.log("Fetched traits:", res.data);
    return res.data.data.data;
  },
    async getAllPublic(): Promise<Trait[]> {
    const res = await api.get("/traits");
    console.log("Fetched traits:", res.data);
    return res.data.data.data;
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