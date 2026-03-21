import api from "../client";
import type { CatalogSource } from "../../catalogKeys";

export type MergedTagItem = {
  source: CatalogSource;
  id: number;
  name: string;
  slug: string;
};

export type MergedTraitItem = {
  source: CatalogSource;
  id: number;
  category_id: number;
  name: string;
  description?: string | null;
  category?: { id: number; name: string; slug?: string } | null;
};

export type MergedTagsPayload = {
  public: MergedTagItem[];
  seller: MergedTagItem[];
  combined: MergedTagItem[];
};

export type MergedTraitsPayload = {
  public: MergedTraitItem[];
  seller: MergedTraitItem[];
  combined: MergedTraitItem[];
};

function unwrapMergedPayload<T>(res: { data: unknown }): T {
  const root = res.data as Record<string, unknown> | null | undefined;
  if (!root) return {} as T;
  const inner = root.data;
  if (inner && typeof inner === "object" && "combined" in (inner as object)) {
    return inner as T;
  }
  return root as T;
}

export const SellerMergedCatalogService = {
  async getMergedTags(): Promise<MergedTagsPayload> {
    const res = await api.get("/seller/merged-tags");
    return unwrapMergedPayload<MergedTagsPayload>(res);
  },

  async getMergedTraits(params?: { category_id?: number }): Promise<MergedTraitsPayload> {
    const res = await api.get("/seller/merged-traits", {
      params:
        params?.category_id != null && params.category_id > 0
          ? { category_id: params.category_id }
          : undefined,
    });
    return unwrapMergedPayload<MergedTraitsPayload>(res);
  },
};
