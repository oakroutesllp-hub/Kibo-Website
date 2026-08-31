import type { Metadata } from "next";
import { ProductsGridSection } from "@/components/sections/ProductsGridSection";

// `description` added (30 Aug 2026, part of the same canonical-URL
// discussion that trimmed this page down to just the grid) — this page
// had no meta description at all before, unlike Home's (which pulls
// from Sanity). Search engines use this to distinguish a page's own
// purpose from others on the same site; worth having now that this
// page has a real, distinct purpose to describe.
export const metadata: Metadata = {
  title: "Products — KIBO",
  description:
    "KIBO's product categories — men's apparel manufactured in India, built to your specification.",
};

// Product category grid — KIBO_Brand_and_Copy_Direction.md, "Products
// grid" section (fully locked, 25 Aug 2026). A flat grid of 6 category
// cards, no parent/grouped cards, each flipping in place to reveal its
// spec list — no separate detail pages. Fixed data
// (lib/productCategories.ts), not Sanity-driven, superseding the
// earlier sample-product prototype.
//
// Markup lives in ProductsGridSection (26 Aug 2026) so it can be reused
// identically wherever it's shown — Home's own permanent copy in its
// one continuous scroll (see `(site)/page.tsx`), and this page. This
// page is reached directly (nav link, "Explore Products" CTA, or a
// fresh visit/reload).
//
// **Trimmed to just the grid, 30 Aug 2026** (owner, after a design
// discussion about Home vs. this page duplicating each other: "'/products'
// becomes just the Products Grid, on its own — drop Custom/Supply/Long
// Run/CTA from that page entirely; they only need to exist once, on
// Home") — this page used to also render CustomSection, SupplySection,
// LongRunSection, and CTANudgeSection directly below the grid (the same
// four sections Home renders in the same order), making this page a
// near-total duplicate of a slice of Home. The reasoning for cutting
// them here rather than keeping them: those four are "why manufacture
// with us" capability-reinforcement content — they support the
// narrative Home is telling, but don't stand on their own as something
// a visitor would seek out by landing on `/products` directly. The
// Products Grid alone — six real, interactive category cards with
// specs — IS a complete, standalone thing: the actual catalog, useful
// as its own link (e.g. sent directly to a buyer) independent of the
// rest of the site's story. Home is unchanged and still renders all
// nine sections in one continuous scroll; this page is now genuinely
// distinct from it rather than a partial copy.
//
// `showBackToHome` stays — this is still a real, separate destination
// (not folded back into Home), so the same reasoning that added it
// still holds: scrolling up here has nothing above it to reveal, since
// this genuinely is a different page, not a section of Home.
export default function ProductsPage() {
  return <ProductsGridSection showBackToHome />;
}
