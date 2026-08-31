import type { Metadata } from "next";
import { CatalogCtaSection } from "@/components/sections/CatalogCtaSection";
import { BackToHomeLink } from "@/components/BackToHomeLink";
import { getCatalog } from "@/lib/content";

export const metadata: Metadata = {
  title: "Catalog — KIBO",
  description:
    "Download the KIBO product catalog, or talk to us about your requirement.",
};

// Catalog (`/catalog`) — new route, 30 Aug 2026, replacing the earlier
// `/lookbook` placeholder (`/lookbook` now redirects here).
//
// **Simplified 31 Aug 2026** (owner: "we don't need to show the products
// [grid] again... it's a full repetition of the Products page... then
// it's at three places [Home, /products, /catalog] and it doesn't make
// sense") — the original build reused `ProductsGridSection` here
// (same card/flip range display as `/products`), which was a reasonable
// literal reading of "essentially the Products page's range and specs,"
// but reviewing it live made the repetition obvious. Stripped back to
// just this page's own content: a short intro line, the placeholder PDF
// thumbnail, and the two CTAs (`CatalogCtaSection`) — the actual
// catalog range/specs live in the PDF itself once that exists, not
// duplicated on this page too.
// Heading restyled to match Products'/Our Story's own page-title
// treatment exactly, 31 Aug 2026 (owner, testing live, navigating
// between all three via the hamburger menu: "Products and Our Story
// font are the same, but Catalog font... is much larger... Products and
// Our Story also have horizontal line treatment, Catalog does not...
// needs to be consistent") — was `text-h1 font-semibold` (40px) with no
// dash accent, a genuine one-off next to `ProductsGridSection.tsx`'s
// `text-h2 font-bold` (30px) + single dash below. Now identical: same
// size, weight, tracking, and dash.
// `BackToHomeLink` added, 31 Aug 2026, same "add it everywhere" pass as
// the heading restyle above — see that component's own file for the two
// rounds of feedback (chevron icon, mobile text size) already folded
// into it since it first existed on `/products`.
// `getCatalog()` (31 Aug 2026) — see catalogType.ts's own comment. This
// page fetches it for the thumbnail specifically (the PDF link itself
// lives in the modal, wired via `(site)/layout.tsx`'s own provider,
// since that needs to work from every page, not just this one).
export default async function CatalogPage() {
  const catalog = await getCatalog();
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-4 px-6 pt-10 text-center sm:px-10 sm:pt-14">
      <div className="flex flex-col items-center gap-5">
        <BackToHomeLink />
        <h1 className="text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">Catalog</h1>
        <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />
      </div>
      <p className="text-body text-charcoal/70">
        Our full range and specs, in one downloadable catalog.
      </p>
      <CatalogCtaSection thumbnail={catalog.thumbnail} />
    </div>
  );
}
