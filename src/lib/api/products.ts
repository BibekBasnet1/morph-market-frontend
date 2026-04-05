import type { Product, ProductFilters } from "../../types";
import api from "./client";

type GetAllParams = {
  page?: number;
  filters?: ProductFilters;
};

export const ProductService = {
  // async getAll(): Promise<Product[]> {
  //   const res = await api.get("/seller/products");
  //   return res.data.data.data;
  // },
  getAll: async ({ page = 1, filters = {} }: GetAllParams) => {
    const res = await api.get("/seller/products", {
      params: {
        page,
        ...filters,
      },
    });
    return res.data.data;
  },
  getAllPublic: async ({ page = 1, filters = {} }: GetAllParams) => {
    const res = await api.get("/products", {
      params: {
        page,
        ...filters,
      },
    });
    return res.data.data;
  },

  getAllPrivate: async (): Promise<Product[]> => {
    const res = await api.get(`/seller/my-products`);
    const inner = res.data.data;
    if (Array.isArray(inner)) return inner;
    if (inner && typeof inner === "object" && Array.isArray((inner as { data?: Product[] }).data)) {
      return (inner as { data: Product[] }).data;
    }
    return [];
  },
  async getById(id: number): Promise<Product> {
    const res = await api.get(`/seller/products/${id}`);
    return res.data.data;
  },

  async getBySlug (slug: string) {
    const res = await api.get(`/products/${slug}`);
  return res.data.data;
},

  create: async (payload: FormData): Promise<Product> => {
    const res = await api.post("/seller/products", payload);
    return res.data.data;
  },

  update: async (id: number, payload: FormData): Promise<Product> => {
    const res = await api.put(`/seller/products/${id}`, payload);
    return res.data.data;
  },

  remove: async (id: number): Promise<void> => {
    await api.delete(`/seller/products/${id}`);
  },
};