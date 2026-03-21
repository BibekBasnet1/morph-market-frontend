/**
 * Laravel list responses 
 * {
 *   "success": true,
 *   "message": "...",
 *   "data": {
 *     "current_page": 1,
 *     "data": [ ...rows ],
 *     "last_page": 1,
 *     "per_page": 15,
 *     "total": 0,
 *     ...
 *   }
 * }
 *
 */

export type LaravelPaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type PaginatedListResult<T> = {
  items: T[];
  meta: LaravelPaginationMeta | null;
};

function readMeta(p: Record<string, unknown>): LaravelPaginationMeta | null {
  const current = Number(p.current_page);
  const last = Number(p.last_page);
  if (Number.isNaN(current) || Number.isNaN(last)) return null;
  return {
    current_page: current,
    last_page: last,
    per_page: Number(p.per_page ?? 15),
    total: Number(p.total ?? 0),
  };
}

function isPaginatorObject(obj: unknown): obj is Record<string, unknown> {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const o = obj as Record<string, unknown>;
  return Array.isArray(o.data) && o.current_page != null && o.last_page != null;
}

/**
 * Parse axios `response.data` into rows + pagination meta.
 */
export function parseLaravelPaginatedResponse<T>(axiosResponseData: unknown): PaginatedListResult<T> {
  if (axiosResponseData == null) {
    return { items: [], meta: null };
  }

  if (Array.isArray(axiosResponseData)) {
    return { items: axiosResponseData as T[], meta: null };
  }

  if (typeof axiosResponseData !== "object") {
    return { items: [], meta: null };
  }

  const root = axiosResponseData as Record<string, unknown>;

  const inner = root["data"];
  if (inner != null && typeof inner === "object" && !Array.isArray(inner)) {
    const paginator = inner as Record<string, unknown>;
    if (isPaginatorObject(paginator)) {
      return {
        items: (paginator["data"] as T[]) ?? [],
        meta: readMeta(paginator),
      };
    }
    const nestedRows = paginator["data"];
    if (Array.isArray(nestedRows)) {
      return { items: nestedRows as T[], meta: readMeta(paginator) };
    }
  }

  if (isPaginatorObject(root)) {
    return {
      items: (root["data"] as T[]) ?? [],
      meta: readMeta(root),
    };
  }

  const topRows = root["data"];
  if (Array.isArray(topRows)) {
    return { items: topRows as T[], meta: null };
  }

  return { items: [], meta: null };
}

export function unwrapLaravelResource<T>(axiosResponseData: unknown): T {
  if (axiosResponseData && typeof axiosResponseData === "object" && "data" in axiosResponseData) {
    const inner = (axiosResponseData as { data?: unknown }).data;
    if (inner !== undefined && inner !== null) {
      return inner as T;
    }
  }
  return axiosResponseData as T;
}
