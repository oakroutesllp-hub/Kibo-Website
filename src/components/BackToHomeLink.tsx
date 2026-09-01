import Link from "next/link";

// Shared "back to Home" link — extracted 31 Aug 2026 from
// ProductsGridSection.tsx (the only place it existed before) so Catalog
// and Our Story can use the exact same element instead of each growing
// a slightly-different copy, per the owner's own explicit ask: "add the
// same '← Home' link everywhere... consistent everywhere," after a
// three-way brainstorm on how visitors should get back to Home from a
// non-Home page (logo-only vs. an explicit link vs. both — the owner
// picked the explicit-link option).
//
// This element's own styling has been through two more rounds of live
// mobile feedback since the original (see ProductsGridSection.tsx's git
// history for the "moved in-flow + enlarged" round):
// - The plain "←" text character was swapped for a drawn SVG chevron
//   (31 Aug 2026, owner: "I'm not liking the back arrow... it does not
//   really look very nice or aesthetic. It looks more like... fixing
//   something" — a bare arrow glyph renders however the font happens to
//   draw it, not as a designed icon; shown 3 options live, owner picked
//   the thin-chevron variant as closest to the site's existing icon
//   language, e.g. the product gallery's own prev/next arrows).
// - Bumped again on mobile only, same day (owner: "the text size of
//   Home on mobile is very small. On desktop looks OK") — `text-body`
//   (15px) below `sm`, `sm:text-support` (13px, the prior universal
//   size, confirmed fine on desktop) at `sm` and up.
// `tracking-[0.14em]` → `tracking-[0.16em]` (1 Sep 2026, owner-requested
// site-wide unification after a typography audit found four different
// uppercase-label tracking values in use: 0.16em (Eyebrow.tsx, Hero.tsx's
// "OUR STORY" tag), 0.14em (here + Hero's "Explore products" button),
// 0.12em (CustomSection.tsx's process/attribute labels), 0.10em
// (BlogGrid.tsx's category tabs) — all now 0.16em, matching Eyebrow.tsx,
// the value globals.css's own type-scale comment already cites as the
// reference (`text-xs font-semibold uppercase tracking-[0.16em]`).
export function BackToHomeLink() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-body font-semibold uppercase tracking-[0.16em] text-charcoal/50 transition-colors hover:text-charcoal sm:text-support"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-3 w-3 shrink-0"
        aria-hidden="true"
      >
        <polyline points="15 18 9 12 15 6" />
      </svg>
      Home
    </Link>
  );
}
