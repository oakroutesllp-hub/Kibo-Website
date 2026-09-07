import { TrustedByRow } from "@/components/TrustedByRow";
import type { CustomerContent } from "@/lib/content";

// "Trusted by" — new Home section, 4 Sep 2026. Hidden until both
// `showTrustedBy` (Site Settings) is on AND at least one real Customer
// document exists — same "won't go live now" toggle pattern as Blog/
// Testimonials/Certifications; returns null here defensively even if
// a future caller forgets to check the toggle itself.
//
// **The section label is "Trusted by," but the underlying content
// type is `customer`, not `brand`** — owner's own catch mid-
// conversation: "some of the wholesalers and distributors may not be
// brands... they may just be our clients... it's a B2B wholesaler
// distributor space," so the Sanity schema (customerType.ts) never
// assumes brand status. "Trusted by" itself was chosen over
// "Companies we've worked with"/"Our customers" after the owner made
// a real distinction, not just a preference: showing a company's real
// logo next to "Trusted by" is a claim implied by an actual completed
// transaction (they placed a real order), not an invented endorsement
// — different in kind from a fabricated testimonial quote. Owner's
// own bar for using this label at all: every logo here has to be a
// company that genuinely placed a real order, not just an inquiry.
//
// **Placement: right after Products, not grouped with Certifications
// near the footer** — owner's own instinct, confirmed against real
// UX reasoning rather than just going with a preference: real client
// logos are social proof, most persuasive EARLY, while a visitor is
// still deciding whether to trust the products they're looking at.
// Certifications reads more like compliance documentation, which is
// fine sitting quietly near the end — the two "logo strip" sections
// look similar but serve different jobs, so bundling them together
// just because they're visually similar would waste the placement
// advantage this one actually needs. See `(site)/page.tsx` for the
// actual insertion point.
//
// **Real, unmodified logo colors, generous gaps, no dividers, no
// names** — the opposite of Certifications' own treatment in every
// one of those respects, all deliberate: see TrustedByRow.tsx's own
// comment for the full reasoning trail (grayscale and sage-tint-with-
// hover were both seriously considered and rejected before landing
// here).
//
// **Heading matches the site's own established convention** — big,
// sentence case, `text-h2 font-bold leading-[1.1] tracking-tight`,
// identical to Certifications/Products/Long Run/Supply/Testimonials —
// the same site-wide rule the owner corrected Certifications' own
// heading against ("we don't have that [all-caps tracked label]
// typography design anywhere in the website") applies here too, so
// this doesn't reintroduce a one-off smaller/quieter heading style
// just because the LOGOS themselves are meant to read quietly.
export function TrustedBySection({
  customers,
  show,
  scrollSpeed,
}: {
  customers: CustomerContent[];
  show: boolean;
  scrollSpeed?: number;
}) {
  if (!show || customers.length === 0) return null;

  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-8 px-6 py-12 sm:px-10 sm:py-16">
        <h2 className="text-center text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          Trusted by
        </h2>
        <TrustedByRow customers={customers} scrollSpeed={scrollSpeed} />
      </div>
    </section>
  );
}
