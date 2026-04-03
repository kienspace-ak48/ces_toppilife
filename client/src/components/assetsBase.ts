/**
 * Base URL for images served from Express `public/` (uploads, etc.).
 * Dev: client often runs on another port than API — align with App.tsx.
 */
export const ASSETS_BASE = import.meta.env.DEV
  ? "http://localhost:8081/"
  : typeof window !== "undefined"
    ? `${window.location.origin}/`
    : "/";
