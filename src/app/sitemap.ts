import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteUrl";
import { getArticles, getSiteSettings } from "@/lib/content";

// Added 2 Sep 2026 (owner priority-1 SEO fix) — previously absent
// entirely, so search engines had no map of the site's real pages.
//
// Blog is included ONLY when `showBlogInNav` is ON (Site Settings) —
// deliberately mirrors the exact same visibility rule the site itself
// already uses (OWNER-OPERATIONS-GUIDE.md §3a: the Blog page works if
// someone has the direct link, but stays unlisted from nav/footer
// until the owner has real content and switches it on). Listing it in
// the sitemap while it's meant to stay unlisted would quietly defeat
// that intent by inviting Google to index and surface it anyway.
// Certifications/Testimonials sections, when built the same
// hidden-until-ready way, should follow this identical pattern.
//
// `/`, `/products`, `/catalog`, `/our-story`, `/privacy-policy`, and
// `/terms-conditions` are always included — real, intentionally public
// pages regardless of CMS state. `/studio`, `/api`, `/style-guide`,
// and the `/articles`/`/lookbook` legacy redirects are deliberately
// excluded — see robots.ts's own comment for why each isn't real
// visitor-facing content.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/products`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/catalog`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/our-story`, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms-conditions`, changeFrequency: "yearly", priority: 0.2 },
  ];

  if (!settings.showBlogInNav) return staticRoutes;

  const articles = await getArticles();
  return [
    ...staticRoutes,
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    ...articles.map((article) => ({
      url: `${SITE_URL}/blog/${article.slug}`,
      lastModified: article.publishedAt ? new Date(article.publishedAt) : undefined,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
