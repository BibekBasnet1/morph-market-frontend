import api from "../api/client";

export type PrivacyPolicyMeta = {
  title?: string;
  updated_at?: string;
};

export type PrivacyPolicyPayload = {
  html: string;
  meta?: PrivacyPolicyMeta;
};

type ApiShape = {
  html?: string;
  content?: string;
  body?: string;
  title?: string;
  updated_at?: string;
};

async function parseFetchResponse(res: Response): Promise<PrivacyPolicyPayload> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = (await res.json()) as ApiShape;
    const html = data.html ?? data.content ?? data.body ?? "";
    return {
      html,
      meta: { title: data.title, updated_at: data.updated_at },
    };
  }
  const html = await res.text();
  return { html };
}


export async function fetchPrivacyPolicy(): Promise<PrivacyPolicyPayload> {
  const envUrl = import.meta.env.VITE_PRIVACY_POLICY_URL as string | undefined;
  if (envUrl?.trim()) {
    const res = await fetch(envUrl.trim());
    if (!res.ok) throw new Error(`Could not load privacy policy (${res.status})`);
    return parseFetchResponse(res);
  }

  try {
    const { data: raw } = await api.get<ApiShape | { data: ApiShape }>("/legal/privacy");
    const data = raw && typeof raw === "object" && "data" in raw && raw.data ? raw.data : (raw as ApiShape);
    const html = data.html ?? data.content ?? data.body ?? "";
    if (html.trim()) {
      return {
        html,
        meta: { title: data.title, updated_at: data.updated_at },
      };
    }
  } catch {
    /* fall through to static */
  }

  const base = import.meta.env.BASE_URL || "/";
  const staticPath = `${base.endsWith("/") ? base : `${base}/`}privacy-policy.html`;
  const res = await fetch(staticPath);
  if (!res.ok) {
    throw new Error("Privacy policy is not configured. Set VITE_PRIVACY_POLICY_URL or add public/privacy-policy.html.");
  }
  return parseFetchResponse(res);
}
