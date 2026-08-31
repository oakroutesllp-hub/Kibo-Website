import type { Metadata } from "next";
import { BlogGrid } from "@/components/sections/BlogGrid";
import { getArticles } from "@/lib/content";

// Route renamed `/articles` → `/blog`, 31 Aug 2026 (owner: "why does the
// URL say articles when this is a blog?") — see `articles/page.tsx`'s
// own comment (now just a redirect here) for the full reasoning on why
// this was safe to do now specifically (site not deployed yet, nothing
// indexed, no real external links to break).
export const metadata: Metadata = {
  title: "Blog — KIBO",
  description: "Sourcing, manufacturing, and market insights from KIBO.",
};

// Blog listing page — rebuilt 31 Aug 2026 following "Blog Page
// Ideas.docx" (see BlogGrid.tsx's own comment for the full reasoning
// on which of the doc's two reference layouts this follows, and why).
// Header here is KIBO's own established "page title" pattern — a
// centered H1 + one-line subtitle, dash accent below — the same
// treatment Products/Catalog already use, NOT the reference doc's own
// full-bleed photo hero band. That's a deliberate substitution, not an
// oversight: no other interior page on this site uses a full-bleed
// photo hero, and there's no real Blog hero photo to put there yet
// regardless — reusing the site's own established header pattern
// matches "the visual/graphic language already established across the
// rest of the site" more closely than introducing a brand-new hero
// treatment used nowhere else, just to match the reference doc's own
// specific hero mechanism.
//
// **Hidden from nav by default** — see `showBlogInNav` in
// lib/navigation.ts / siteSettingsType.ts. This route/page itself
// always exists and renders correctly regardless of that toggle; only
// its nav/footer visibility depends on it.
export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-4 px-6 py-16 sm:px-10">
      <h1 className="text-h1 font-semibold text-charcoal">Blog</h1>
      <p className="max-w-md text-center text-body text-charcoal/70">
        Sourcing, manufacturing, and market insights from KIBO.
      </p>
      <span aria-hidden="true" className="mb-6 h-px w-12 bg-charcoal/20" />
      <BlogGrid articles={articles} />
    </div>
  );
}
