import type { Metadata } from "next";
import { CatalogCtaSection } from "@/components/sections/CatalogCtaSection";

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
export default function CatalogPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-4 px-6 pt-10 text-center sm:px-10 sm:pt-14">
      <h1 className="text-h1 font-semibold text-charcoal">Catalog</h1>
      <p className="text-body text-charcoal/70">
        Our full range and specs, in one downloadable catalog.
      </p>
      <CatalogCtaSection />
    </div>
  );
}
