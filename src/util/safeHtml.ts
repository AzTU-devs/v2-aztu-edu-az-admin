import DOMPurify from "dompurify";

/**
 * Rich text from the API, made safe to render with dangerouslySetInnerHTML.
 *
 * The backend sanitises stored HTML too, but the dashboard renders content
 * written by many editors (and records stored before server-side sanitising
 * existed), so every HTML sink here passes through DOMPurify — a maintained
 * allowlist sanitiser — with scripts, frames, forms, SVG/MathML and any URL
 * scheme other than http(s)/mailto/tel or a relative path removed.
 */
const SAFE_URI = /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i;

export function safeHtml(html: string | null | undefined): string {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["style", "iframe", "object", "embed", "form", "input", "button", "textarea", "select"],
    FORBID_ATTR: ["style", "srcset"],
    ALLOWED_URI_REGEXP: SAFE_URI,
  });
}

/** For text that ends up inside an HTML-rendering API (e.g. SweetAlert2 options). */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
