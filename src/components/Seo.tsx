import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
  type?: "website" | "product" | "article";
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const SITE = "Electronic Hive";
const DEFAULT_DESC = "Affordable laptops & accessories in Ghana — tested, trusted, fast delivery.";

function setMeta(selector: string, attr: string, key: string, value: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function Seo({ title, description = DEFAULT_DESC, image, type = "website", jsonLd }: SeoProps) {
  useEffect(() => {
    const fullTitle = title.includes(SITE) ? title : `${title} — ${SITE}`;
    document.title = fullTitle;
    const url = typeof window !== "undefined" ? window.location.href : "";
    const img = image || `${typeof window !== "undefined" ? window.location.origin : ""}/og-default.jpg`;

    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[property="og:title"]', "property", "og:title", fullTitle);
    setMeta('meta[property="og:description"]', "property", "og:description", description);
    setMeta('meta[property="og:type"]', "property", "og:type", type);
    setMeta('meta[property="og:url"]', "property", "og:url", url);
    setMeta('meta[property="og:image"]', "property", "og:image", img);
    setMeta('meta[property="og:site_name"]', "property", "og:site_name", SITE);
    setMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    setMeta('meta[name="twitter:title"]', "name", "twitter:title", fullTitle);
    setMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMeta('meta[name="twitter:image"]', "name", "twitter:image", img);
    setLink("canonical", url);

    let ldEl: HTMLScriptElement | null = null;
    if (jsonLd) {
      ldEl = document.createElement("script");
      ldEl.type = "application/ld+json";
      ldEl.dataset.seo = "page";
      ldEl.text = JSON.stringify(jsonLd);
      document.head.appendChild(ldEl);
    }
    return () => { if (ldEl) ldEl.remove(); };
  }, [title, description, image, type, jsonLd]);

  return null;
}
