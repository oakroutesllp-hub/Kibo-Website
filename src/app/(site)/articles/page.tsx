import { redirect } from "next/navigation";

// Route renamed `/articles` → `/blog`, 31 Aug 2026 (owner: "why does the
// URL say articles when this is a blog?") — kept `/articles` unchanged
// through the earlier "Articles" → "Resources" → "Blog" label-only
// renames on the reasoning that changing a URL is a more sensitive,
// SEO/broken-link-risk call than changing a label. That reasoning
// stopped applying once actually asked about directly: the site isn't
// deployed yet, so nothing is indexed and no external links point to
// `/articles` — the real risk was near zero. Same redirect pattern as
// `/lookbook` → `/catalog`: this route stays alive as a forward rather
// than being deleted outright, in case anyone already bookmarked it.
export default function ArticlesRedirect() {
  redirect("/blog");
}
