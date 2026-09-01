// Single source of truth for the main site nav links, shared by Nav.tsx
// and Footer.tsx (Footer Build Brief §1, Column 2 — the two must not be
// two separately-maintained lists that can drift out of sync). Not a
// Sanity field: each entry is tied to an actual route that exists in
// code, so adding/removing one is a code change regardless.
//
// "Our Story" added 28 Aug 2026 (owner request), positioned right after
// Products — matching its relative place in the confirmed final nav
// order from KIBO_Brand_and_Copy_Direction.md ("Home / Products /
// Lookbook / Our Story / Resources").
//
// "Articles" → "Resources" (30 Aug 2026, owner: "Articles needs to
// change, let's figure out what that part will be called") — this is
// exactly the rename the brand doc above already specifies; the label
// only changes here, not the route (`/articles` stays the actual URL
// for now — renaming the path itself is a separate, more sensitive call
// with SEO/link implications, not asked for here).
//
// **Restructured again, same day** (owner: "we're renaming 'Lookbook' to
// 'Catalog' and fully defining it. Update the main nav to Home / Products
// / Catalog / Blog / Our Story") — supersedes both changes above:
// - Lookbook (previously flagged as "not yet part of this nav," per
//   PROJECT-SUMMARY.md's pre-launch checklist) is now a real, fully-
//   defined page — added as "Catalog," pointing at the new `/catalog`
//   route (`/lookbook` now redirects there, see that route's own file).
// - "Resources" → "Blog" (route unchanged at the time, `/articles` —
//   same reasoning as the "Articles" → "Resources" rename above: a
//   label-only change, the path itself is a separate, more sensitive
//   call). **Route since renamed too, same day** — see below.
// - Order changed to match the owner's explicit new sequence: Our Story
//   moves from 3rd to last position.
//
// **Route renamed `/articles` → `/blog`, same day** (owner: "why does
// the URL say articles when this is a blog?") — the "renaming a route
// is separate/more sensitive" caution above stopped applying once
// actually asked about directly: the site isn't deployed yet, so
// nothing is indexed and no real external links point to `/articles` —
// the actual risk was near zero. `/articles` (and `/articles/[slug]`)
// now just redirect to `/blog` (and `/blog/[slug]`), same forwarding
// pattern as `/lookbook` → `/catalog`.
export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/catalog", label: "Catalog" },
  { href: "/blog", label: "Blog" },
  { href: "/our-story", label: "Our Story" },
] as const;

// Blog nav-visibility toggle (31 Aug 2026, owner: "build this hidden by
// default... a boolean setting in Sanity... same pattern as the Catalog
// download-gate toggle") — the route/page itself always exists and
// works regardless (someone with the direct link can still reach it);
// this only controls whether it's *listed* in Nav.tsx/Footer.tsx.
// Filtering happens here, once, rather than duplicating the `href ===
// "/blog"` check in both consumers separately.
export function getVisibleNavLinks(showBlogInNav: boolean) {
  return showBlogInNav ? NAV_LINKS : NAV_LINKS.filter((link) => link.href !== "/blog");
}

// Applies Sanity's per-route nav label overrides (1 Sep 2026, owner:
// "make everything editable") on top of `getVisibleNavLinks`'s own
// fixed list — routes/order/visibility stay code-controlled (see that
// function's own comment), only each link's display TEXT can change.
// Both Nav.tsx and Footer.tsx call this rather than each doing their
// own href-keyed lookup, so the two can't drift out of sync with each
// other, same reasoning NAV_LINKS itself being one shared array already
// documents above.
export function applyNavLabelOverrides(
  links: readonly { href: string; label: string }[],
  labels: {
    navLabelHome: string;
    navLabelProducts: string;
    navLabelCatalog: string;
    navLabelBlog: string;
    navLabelOurStory: string;
  },
) {
  const overrides: Record<string, string> = {
    "/": labels.navLabelHome,
    "/products": labels.navLabelProducts,
    "/catalog": labels.navLabelCatalog,
    "/blog": labels.navLabelBlog,
    "/our-story": labels.navLabelOurStory,
  };
  return links.map((link) => ({ ...link, label: overrides[link.href] || link.label }));
}
