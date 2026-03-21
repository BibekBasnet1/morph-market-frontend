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

function isMergedShape(obj: unknown): obj is MergedTagsPayload | MergedTraitsPayload {
  if (!obj || typeof obj !== "object") return false;
  const o = obj as Record<string, unknown>;
  return "combined" in o || "public" in o || "seller" in o;
}

function unwrapMergedPayload<T extends MergedTagsPayload | MergedTraitsPayload>(
  res: { data: unknown },
): T {
  const root = res.data as Record<string, unknown> | null | undefined;
  if (!root) return { public: [], seller: [], combined: [] } as unknown as T;

  const inner = root.data;
  if (isMergedShape(inner)) {
    return inner as T;
  }
  if (inner && typeof inner === "object" && "data" in inner) {
    const nested = (inner as Record<string, unknown>).data;
    if (isMergedShape(nested)) {
      return nested as T;
    }
  }
  if (isMergedShape(root)) {
    return root as T;
  }
  return { public: [], seller: [], combined: [] } as unknown as T;
}

/**
 * `public` may be empty while `seller` / `combined` hold rows. If `combined` is missing
 * or empty but `public`/`seller` have items, rebuild `combined` (public first, then seller).
 */
function ensureCombined<T extends MergedTagsPayload | MergedTraitsPayload>(payload: T): T {
  const pub = Array.isArray(payload.public) ? payload.public : [];
  const sel = Array.isArray(payload.seller) ? payload.seller : [];
  const comb = Array.isArray(payload.combined) ? payload.combined : [];
  if (comb.length > 0) {
    return { ...payload, public: pub, seller: sel, combined: comb };
  }
  const merged = [...pub, ...sel] as T["combined"];
  return { ...payload, public: pub, seller: sel, combined: merged };
}

export const SellerMergedCatalogService = {
  async getMergedTags(): Promise<MergedTagsPayload> {
    const res = await api.get("/seller/merged-tags");
    return ensureCombined(unwrapMergedPayload<MergedTagsPayload>(res));
  },

  async getMergedTraits(params?: { category_id?: number }): Promise<MergedTraitsPayload> {
    const res = await api.get("/seller/merged-traits", {
      params:
        params?.category_id != null && params.category_id > 0
          ? { category_id: params.category_id }
          : undefined,
    });
    return ensureCombined(unwrapMergedPayload<MergedTraitsPayload>(res));
  },
};
