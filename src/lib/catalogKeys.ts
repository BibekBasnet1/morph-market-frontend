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
