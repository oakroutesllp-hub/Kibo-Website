"use client";

import { useTalkToKibo } from "@/components/TalkToKiboProvider";
import { useDownloadCatalog } from "@/components/DownloadCatalogProvider";

// Catalog page's own footer: a "Download PDF" placeholder card, then two
// CTAs side by side — "Download Catalog" and "Talk to KIBO," deliberately
// NOT merged into one button (owner spec: "Two CTAs, side by side, not
// merged"). Split into its own client component (separate from
// `(site)/catalog/page.tsx`, a Server Component) purely because it needs
// `useDownloadCatalog()`/`useTalkToKibo()` — Next.js doesn't allow a
// `metadata` export (which that page needs) inside a "use client" file.
//
// The placeholder card: the real catalog PDF "will be supplied later by
// [the] creative agency" (owner) — not something to generate here. Same
// placeholder-now pattern as the Products-grid imagery before real
// photography existed: a clearly-labeled stand-in, not a broken link or
// a fake file, that gets swapped for the real asset later with no
// structural change (once a real PDF exists, this card can link/preview
// it directly instead of just opening the gate).
export function CatalogCtaSection() {
  const { open: openTalkToKibo } = useTalkToKibo();
  const { open: openDownloadCatalog } = useDownloadCatalog();

  // No outer `max-w`/`px` wrapper here, 31 Aug 2026 — the parent page
  // (`(site)/catalog/page.tsx`) now supplies that container directly
  // (it used to be this component's own job, back when this rendered
  // alongside a full ProductsGridSection instead of a short intro
  // paragraph); keeping a second nested `max-w-2xl` here was harmless
  // but redundant once the page itself became this simple.
  return (
    <div className="flex w-full flex-col items-center gap-8 pt-4 pb-20 text-center sm:pb-28">
      {/* Placeholder thumbnail card — same visual language as
          MediaPlaceholder.tsx (hairline pattern, neutral charcoal, "not
          real content yet" reads as intentional rather than broken) but
          purpose-built for a document rather than a photo/video slot,
          so it carries its own document icon instead of a generic
          label badge. */}
      <button
        type="button"
        onClick={openDownloadCatalog}
        aria-label="Download Catalog"
        className="flex aspect-[3/4] w-full max-w-[220px] flex-col items-center justify-center gap-3 overflow-hidden rounded-lg border border-charcoal/10 bg-charcoal/[0.04] bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--color-charcoal)_8%,transparent)_0,color-mix(in_srgb,var(--color-charcoal)_8%,transparent)_1px,transparent_1px,transparent_14px)] transition-colors hover:bg-charcoal/[0.07]"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="h-10 w-10 text-charcoal/50"
          aria-hidden="true"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <path d="M14 2v6h6" />
          <path d="M12 18v-6M9.5 15.5 12 18l2.5-2.5" />
        </svg>
        <span className="rounded-full bg-background/85 px-3 py-1 text-micro font-medium text-charcoal/60">
          Download PDF
        </span>
      </button>

      {/* Two CTAs, side by side, not merged — owner spec. `flex-wrap` so
          they stack on very narrow widths instead of overflowing,
          matching the site's general mobile-first reflow convention. */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={openDownloadCatalog}
          className="rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray"
        >
          Download Catalog
        </button>
        {/* Matched to "Download Catalog"'s own solid black/white styling,
            31 Aug 2026 (owner, testing live: "Download Catalog as a
            black button and Talk to KIBO as a white button isn't making
            much sense" — the outline treatment was meant to read as
            "secondary option," but in practice just read as
            inconsistent) — was `border border-charcoal/15 ... text-
            charcoal`, an outline pill. Now identical to every other
            "Talk to KIBO" button on the site (Nav, mobile sticky bar,
            footer, this same page's own placeholder card): solid
            charcoal background, white text, sage-green-grey hover. */}
        <button
          type="button"
          onClick={openTalkToKibo}
          className="rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray"
        >
          Talk to KIBO
        </button>
      </div>
    </div>
  );
}
