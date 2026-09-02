import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";

// Added 2 Sep 2026 (owner priority-1 SEO fix, after the "if I had to
// pick what's next" assessment) — previously absent entirely, meaning
// search engines had no explicit guidance and no sitemap pointer.
//
// Disallowed paths, and why each isn't meant for a search engine:
// - `/studio` — the Sanity Studio admin/editing interface, not
//   visitor-facing content.
// - `/api/` — backend routes (currently just the leads webhook
//   forwarder); nothing there renders a page.
// - `/style-guide` — an internal color/type-scale reference page for
//   this project's own development, not real site content.
// - `/articles` / `/lookbook` — legacy URLs kept alive only as
//   redirects (to `/blog` and `/catalog` respectively) so an old
//   bookmark or external link doesn't 404; the real content lives at
//   the redirect target, which stays crawlable normally.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/studio", "/api/", "/style-guide", "/articles", "/lookbook"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
