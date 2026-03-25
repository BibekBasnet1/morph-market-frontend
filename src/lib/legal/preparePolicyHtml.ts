import { slugify } from "../slugify";

export type PolicySection = { id: string; label: string; level: 2 | 3 };

function ensureUniqueId(base: string, used: Set<string>): string {
  let id = base || "section";
  let n = 0;
  while (used.has(id)) {
    n += 1;
    id = `${base}-${n}`;
  }
  used.add(id);
  return id;
}

/**
 * Ensures heading anchors exist and returns sanitized body HTML plus a TOC list.
 */
export function preparePolicyHtml(rawHtml: string): { html: string; sections: PolicySection[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, "text/html");
  const body = doc.body;
  const used = new Set<string>();
  const sections: PolicySection[] = [];

  body.querySelectorAll("h2, h3").forEach((el, index) => {
    const label = el.textContent?.trim() || "";
    const fromLabel = slugify(label);
    const base = (el.id?.trim() || fromLabel || `section-${index}`).replace(/^#/, "");
    const id = ensureUniqueId(base, used);
    el.id = id;
    sections.push({
      id,
      label: label || id,
      level: el.tagName === "H2" ? 2 : 3,
    });
  });

  return { html: body.innerHTML, sections };
}
