import type { Product } from "../../types";
import api from "./client";

export const ProductService = {
  async getAll(): Promise<Product[]> {
    const res = await api.get("/seller/products");
    return res.data.data.data;
  },

  async getById(id: number): Promise<Product> {
    const res = await api.get(`/seller/products/${id}`);
    return res.data.data;
  },

  create: async (payload: FormData): Promise<Product> => {
    const res = await api.post("/seller/products", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Product> => {
    const res = await api.post(`/seller/products/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/seller/products/${id}`);
  },
};