export type CatalogSource = "public" | "seller";

export function catalogKey(source: CatalogSource, id: number): string {
  return `${source}:${id}`;
}

export function parseCatalogKey(key: string): { source: CatalogSource; id: number } | null {
  const i = key.indexOf(":");
  if (i <= 0) return null;
  const source = key.slice(0, i) as CatalogSource;
  if (source !== "public" && source !== "seller") return null;
  const id = Number(key.slice(i + 1));
  if (Number.isNaN(id)) return null;
  return { source, id };
}

/** Append tag + traits using backend fields: tag_id / seller_tag_id, trait_ids[] / seller_trait_ids[] */
export function appendProductTagAndTraitsFormData(
  fd: FormData,
  tagKey: string,
  traitKeys: string[],
): void {
  const tag = parseCatalogKey(tagKey);
  if (tag) {
    if (tag.source === "public") {
      fd.append("tag_id", String(tag.id));
    } else {
      fd.append("seller_tag_id", String(tag.id));
    }
  }
  traitKeys.forEach((k) => {
    const p = parseCatalogKey(k);
    if (!p) return;
    if (p.source === "public") {
      fd.append("trait_ids[]", String(p.id));
    } else {
      fd.append("seller_trait_ids[]", String(p.id));
    }
  });
}

/** Map API product tag to form key; defaults to public when `source` is absent. */
export function tagKeyFromProductTag(
  tag: unknown,
  getId: (v: unknown) => number,
): string {
  if (!tag) return "";

  const item = Array.isArray(tag) ? (tag as unknown[])[0] : tag;

  if (!item) return "";

  if (typeof item === "object" && item !== null && "source" in item) {
    const s = (item as { source: string }).source;
    const id = getId(item);
    if (s === "seller" || s === "public") return catalogKey(s, id);
  }

  return catalogKey("public", getId(item));
}

/**
 * Prefer explicit `seller_tag_id` / `tag_id` from the product payload when the API
 * does not embed a `tag` object (common on seller product resources).
 */
export function tagKeyFromProductResponse(
  product: Record<string, unknown>,
  getId: (v: unknown) => number,
): string {
  const sellerTagId = product.seller_tag_id;
  const tagId = product.tag_id;
  if (sellerTagId != null && Number(sellerTagId) > 0) {
    return catalogKey("seller", Number(sellerTagId));
  }
  if (tagId != null && Number(tagId) > 0) {
    return catalogKey("public", Number(tagId));
  }
  return tagKeyFromProductTag(product.tag, getId);
}

/** Map API traits array or trait_ids fallback to form keys. */
export function traitKeysFromProduct(
  traits: unknown,
  traitIdsFallback: number[] | undefined,
  getId: (v: unknown) => number,
): string[] {
  if (Array.isArray(traits) && traits.length) {
    return traits.map((t: unknown) => {
      if (typeof t === "object" && t !== null && "source" in (t as object)) {
        const s = (t as { source: string }).source;
        const id = getId(t);
        if (s === "seller" || s === "public") return catalogKey(s, id);
      }
      if (typeof t === "object" && t !== null) return catalogKey("public", getId(t));
      const n = typeof t === "number" ? t : Number(t);
      return catalogKey("public", Number.isNaN(n) ? 0 : n);
    });
  }
  if (Array.isArray(traitIdsFallback) && traitIdsFallback.length) {
    return traitIdsFallback.map((id) => catalogKey("public", id));
  }
  return [];
}

function dedupeKeys(keys: string[]): string[] {
  return [...new Set(keys)];
}

/**
 * Build trait keys from nested `traits`, `seller_traits` (Laravel relation), and/or
 * flat `trait_ids` + `seller_trait_ids`.
 */
export function traitKeysFromProductResponse(
  product: Record<string, unknown>,
  getId: (v: unknown) => number,
): string[] {
  const traits = product.traits as unknown[] | undefined;
  const sellerTraits = product.seller_traits as unknown[] | undefined;
  const traitIds = product.trait_ids as number[] | undefined;
  const sellerTraitIds = product.seller_trait_ids as number[] | undefined;

  const keys: string[] = [];

  if (Array.isArray(traits) && traits.length) {
    keys.push(...traitKeysFromProduct(traits, traitIds, getId));
  } else if (Array.isArray(traitIds) && traitIds.length) {
    traitIds.forEach((id) => keys.push(catalogKey("public", id)));
  }

  if (Array.isArray(sellerTraitIds) && sellerTraitIds.length) {
    sellerTraitIds.forEach((id) => keys.push(catalogKey("seller", id)));
  }
  if (Array.isArray(sellerTraits) && sellerTraits.length) {
    sellerTraits.forEach((st) => {
      keys.push(catalogKey("seller", getId(st)));
    });
  }

  return dedupeKeys(keys);
}

/** Row shape from merged-tags / merged-traits `combined` (or public/seller arrays). */
export type CatalogRowForResolve = {
  source: CatalogSource;
  id: number;
  name?: string;
  slug?: string;
};

function disambiguateIdToKey(
  id: number,
  combined: CatalogRowForResolve[],
  nameHint: string | undefined,
): string {
  const matches = combined.filter((t) => t.id === id);
  if (matches.length === 1) {
    return catalogKey(matches[0].source, matches[0].id);
  }
  if (matches.length >= 2) {
    if (nameHint) {
      const byName = matches.find((m) => m.name === nameHint);
      if (byName) return catalogKey(byName.source, byName.id);
    }
    const seller = matches.find((m) => m.source === "seller");
    if (seller) return catalogKey("seller", seller.id);
  }
  return catalogKey("public", id);
}

/**
 * Resolve tag form key using merged catalog so seller-owned tags (same numeric id as a
 * public tag) select correctly when the API only sends `tag_id` or nested `tag` without `source`.
 */
export function resolveTagKeyWithMergedCatalog(
  product: Record<string, unknown>,
  combined: CatalogRowForResolve[],
  getId: (v: unknown) => number,
): string {
  if (!combined.length) return tagKeyFromProductResponse(product, getId);

  const sellerTagId = product.seller_tag_id;
  const tagId = product.tag_id;
  if (sellerTagId != null && Number(sellerTagId) > 0) {
    return catalogKey("seller", Number(sellerTagId));
  }
  if (tagId != null && Number(tagId) > 0) {
    const id = Number(tagId);
    const tagObj = product.tag;
    let nameHint: string | undefined;
    let slugHint: string | undefined;
    if (tagObj && typeof tagObj === "object") {
      nameHint = (tagObj as { name?: string }).name;
      slugHint = (tagObj as { slug?: string }).slug;
    }
    const matches = combined.filter((t) => t.id === id);
    if (matches.length === 1) {
      return catalogKey(matches[0].source, matches[0].id);
    }
    if (matches.length >= 2) {
      const hit = matches.find(
        (m) =>
          (nameHint != null && m.name === nameHint) ||
          (slugHint != null && m.slug === slugHint),
      );
      if (hit) return catalogKey(hit.source, hit.id);
      const seller = matches.find((m) => m.source === "seller");
      if (seller) return catalogKey("seller", seller.id);
    }
    return catalogKey("public", id);
  }

  const fromNested = tagKeyFromProductTag(product.tag, getId);
  if (!fromNested) return "";
  const parsed = parseCatalogKey(fromNested);
  if (!parsed) return fromNested;
  const matches = combined.filter((t) => t.id === parsed.id);
  if (matches.length === 1) {
    return catalogKey(matches[0].source, matches[0].id);
  }
  if (matches.length >= 2) {
    const tagObj = product.tag;
    if (tagObj && typeof tagObj === "object") {
      const name = (tagObj as { name?: string }).name;
      const slug = (tagObj as { slug?: string }).slug;
      const hit = matches.find(
        (m) =>
          (name != null && m.name === name) ||
          (slug != null && m.slug === slug),
      );
      if (hit) return catalogKey(hit.source, hit.id);
    }
    if (parsed.source === "public") {
      const seller = matches.find((m) => m.source === "seller");
      if (seller) return catalogKey("seller", seller.id);
    }
  }
  return fromNested;
}

/**
 * Resolve trait keys using merged catalog (disambiguate ids; nested traits without `source`).
 */
export function resolveTraitKeysWithMergedCatalog(
  product: Record<string, unknown>,
  combined: CatalogRowForResolve[],
  getId: (v: unknown) => number,
): string[] {
  if (!combined.length) return traitKeysFromProductResponse(product, getId);

  const sellerTraitIds = product.seller_trait_ids as number[] | undefined;
  const traitIds = product.trait_ids as number[] | undefined;
  const traits = product.traits as unknown[] | undefined;
  const sellerTraits = product.seller_traits as unknown[] | undefined;

  const keys: string[] = [];

  if (Array.isArray(traits) && traits.length) {
    keys.push(
      ...traits.map((t: unknown) => {
        if (typeof t === "object" && t !== null && "source" in (t as object)) {
          const s = (t as { source: string }).source;
          const id = getId(t);
          if (s === "seller" || s === "public") return catalogKey(s, id);
        }
        const id =
          typeof t === "object" && t !== null ? getId(t) : Number(t);
        const nameHint =
          typeof t === "object" && t !== null
            ? (t as { name?: string }).name
            : undefined;
        return disambiguateIdToKey(
          Number.isNaN(id) ? 0 : id,
          combined,
          nameHint,
        );
      }),
    );
  } else if (Array.isArray(traitIds) && traitIds.length) {
    traitIds.forEach((tid) => {
      keys.push(disambiguateIdToKey(tid, combined, undefined));
    });
  }

  if (Array.isArray(sellerTraits) && sellerTraits.length) {
    sellerTraits.forEach((st) => {
      keys.push(catalogKey("seller", getId(st)));
    });
  }
  if (Array.isArray(sellerTraitIds) && sellerTraitIds.length) {
    sellerTraitIds.forEach((id) => keys.push(catalogKey("seller", id)));
  }

  return dedupeKeys(keys);
}
