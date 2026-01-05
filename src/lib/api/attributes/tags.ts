import api from "../client"; // axios instance with interceptors
import type { Tag } from "../../../types";

export const TagsService = {
  async getAll(): Promise<Tag[]> {
    const res = await api.get("/admin/tags");
    return res.data.data.data;
  },

  create: async (payload: FormData): Promise<Tag> => {
    const res = await api.post("/admin/tags", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Tag> => {
    const res = await api.post(`/admin/tags/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/admin/tags/${id}`);
  },
};
