import api from "../client";
import {
  parseLaravelPaginatedResponse,
  unwrapLaravelResource,
} from "./parseLaravelPaginatedResponse";

export type SellerTraitSort = "name" | "created_at" | "category_id";

export type SellerTraitListParams = {
  category_id?: number;
  search?: string;
  sort_by?: SellerTraitSort;
  order?: "asc" | "desc";
  page?: number;
  per_page?: number;
};

export type SellerTrait = {
  id: number;
  name: string;
  description?: string | null;
  category_id: number;
  category?: { id: number; name: string; slug?: string } | null;
  created_at: string;
  /** API may expose whether the row is deletable */
  can_delete?: boolean;
  is_seller_owned?: boolean;
  is_admin_trait?: boolean;
  seller_id?: number | null;
};

export type TraitListResult = {
  items: SellerTrait[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  } | null;
};

export const SellerTraitsService = {
  async list(params: SellerTraitListParams = {}): Promise<TraitListResult> {
    const res = await api.get("/seller/seller-traits", { params });
    return parseLaravelPaginatedResponse<SellerTrait>(res.data);
  },

  async get(id: number | string): Promise<SellerTrait> {
    const res = await api.get(`/seller/seller-traits/${id}`);
    return unwrapLaravelResource<SellerTrait>(res.data);
  },

  async create(payload: {
    category_id: number;
    name: string;
    description?: string;
  }): Promise<SellerTrait> {
    const res = await api.post("/seller/seller-traits", payload);
    return unwrapLaravelResource<SellerTrait>(res.data);
  },

  async update(
    id: number | string,
    payload: Partial<{ category_id: number; name: string; description: string | null }>,
  ): Promise<SellerTrait> {
    const res = await api.patch(`/seller/seller-traits/${id}`, payload);
    return unwrapLaravelResource<SellerTrait>(res.data);
  },

  async remove(id: number | string): Promise<void> {
    await api.delete(`/seller/seller-traits/${id}`);
  },
};
