import api from "../client";
import {
  parseLaravelPaginatedResponse,
  unwrapLaravelResource,
} from "./parseLaravelPaginatedResponse";

export type SellerTagListParams = {
  search?: string;
  sort_by?: string;
  order?: "asc" | "desc";
  page?: number;
  per_page?: number;
};

export type SellerTag = {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  can_delete?: boolean;
  is_seller_owned?: boolean;
  seller_id?: number | null;
};

export type TagListResult = {
  items: SellerTag[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
};

export const SellerTagsService = {
  async list(params: SellerTagListParams = {}): Promise<TagListResult> {
    const res = await api.get("/seller/seller-tags", { params });
    return parseLaravelPaginatedResponse<SellerTag>(res.data);
  },

  async get(id: number | string): Promise<SellerTag> {
    const res = await api.get(`/seller/seller-tags/${id}`);
    return unwrapLaravelResource<SellerTag>(res.data);
  },

  async create(payload: { name: string; slug?: string }): Promise<SellerTag> {
    const res = await api.post("/seller/seller-tags", payload);
    return unwrapLaravelResource<SellerTag>(res.data);
  },

  async update(
    id: number | string,
    payload: Partial<{ name: string; slug: string }>,
  ): Promise<SellerTag> {
    const res = await api.patch(`/seller/seller-tags/${id}`, payload);
    return unwrapLaravelResource<SellerTag>(res.data);
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`/seller/seller-tags/${id}`);
  },
};
