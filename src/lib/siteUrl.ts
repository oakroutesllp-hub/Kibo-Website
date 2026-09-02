// Single source of truth for the site's public domain (2 Sep 2026,
// SEO pass) — used by sitemap.ts, robots.ts, and the root layout's
// structured data/metadataBase. Previously this string didn't exist
// anywhere in the codebase; each of those three would otherwise have
// hardcoded its own copy, an easy way for one to drift if the domain
// ever changes.
export const SITE_URL = "https://wearkibo.com";
