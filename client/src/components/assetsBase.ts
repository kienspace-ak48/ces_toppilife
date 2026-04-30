/**
 * Base URL for images served from Express `public/` (uploads, etc.).
 * Dev: client often runs on another port than API — align with App.tsx.
 */
export const ASSETS_BASE = import.meta.env.DEV
  ? "http://localhost:8081/"
  : typeof window !== "undefined"
    ? `${window.location.origin}/`
    : "/";

const ORIGIN_WITHOUT_TRAILING_SLASH = ASSETS_BASE.replace(/\/*$/u, "");

/**
 * TinyMCE saves `src="/uploads/..."`. In Vite dev the page is on another port, so the browser
 * requests the wrong host and images 404. Mirror `resolveImgUrl` by prefixing the static server.
 */
export function rewriteRelativeUploadUrlsInHtml(html: string): string {
  if (!html || typeof html !== "string") return html || "";

  function toAbsolute(url: string): string {
    const u = url.trim();
    if (!u) return url;
    if (/^https?:\/\//iu.test(u)) return url;
    if (u.startsWith("//") || u.startsWith("data:")) return url;
    if (u.startsWith("/uploads")) return `${ORIGIN_WITHOUT_TRAILING_SLASH}${u}`;
    if (/^uploads\//iu.test(u)) return `${ORIGIN_WITHOUT_TRAILING_SLASH}/${u}`;
    return url;
  }

  return html.replaceAll(
    /\ssrc=(["'])([^"']*)\1/giu,
    (full, quote: string, src: string) => {
      const abs = toAbsolute(src);
      return abs === src ? full : ` src=${quote}${abs}${quote}`;
    },
  );
}
