export function slugifyFromName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

/** Whether to show delete — hide admin-owned rows when API exposes flags. */
export function canDeleteSellerRow(row: {
  can_delete?: boolean;
  is_admin_trait?: boolean;
  is_seller_owned?: boolean;
  seller_id?: number | null;
}): boolean {
  if (row.can_delete === false) return false;
  if (row.is_admin_trait === true) return false;
  if (row.is_seller_owned === false) return false;
  if (row.can_delete === true) return true;
  if (row.seller_id != null) return true;
  if (row.is_seller_owned === true) return true;
  return true;
}

type SellerRowFlags = {
  can_delete?: boolean;
  is_admin_trait?: boolean;
  is_seller_owned?: boolean;
  seller_id?: number | null;
};

export function canEditSellerRow(row: SellerRowFlags): boolean {
  return canDeleteSellerRow(row);
}
