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
  // Returns null entirely (not just hidden via CSS) when off — this
  // means the `py-16 sm:py-20` below is never in the DOM in that
  // state, so Products and CustomSection sit directly adjacent with
  // their own original spacing, completely unaffected by this
  // section's own padding either way. No separate "off" spacing case
  // to maintain — there's nothing here to revert when this returns
  // null.
  if (!show || customers.length === 0) return null;

  return (
    <section className="w-full bg-background">
      {/* Top divider, 7 Sep 2026 (owner: "add some horizontal line
          accents in the trusted by section because that is not
          getting the same treatment as the rest... maybe use a longer
          horizontal accent line to separate products from trusted
          by") — same technique as Certifications' own top divider
          (that file's own comment has the full reasoning): an
          inset-from-both-edges line, not a full-bleed `border-t`
          (owner's standing preference against edge-to-edge lines,
          "looks very very flaky"), marking the boundary with Products
          above, which shares this section's own white background and
          so has no color change of its own to mark that seam.
          Deliberately only ONE extra separator, not two (owner, same
          message: "don't make it too many lines either") — Custom
          ("From reference to finished garment") right below gets the
          `py-16 sm:py-20` breathing room added just above instead of a
          second line; Certifications' own precedent is the same
          call — a divider on the boundary that actually needs one
          (white-to-white), nothing added on the edge that doesn't
          (its own bottom edge hands off to the footer's background
          change instead). */}
      <div className="mx-24 h-px bg-charcoal/10" />
      {/* `py-12 sm:py-16` → `py-16 sm:py-20` (48/64px → 64/80px), 7
          Sep 2026 — owner, live screenshot: "Trusted by... in
          reference to finished garment section are getting too
          mushed up together." Measured every section-heading seam on
          the live page before changing anything: this one measured
          108px on both sides, genuinely the tightest transition
          anywhere on Home — every other seam measured 120–186px. A
          new color band was considered and rejected (owner's own
          call: "I'm not even liking all... too many bands" — and
          this site's existing tint logic is reserved for covering
          Testimonials' absence, not decorative separation, so a band
          here for spacing alone would break that discipline). This
          bump alone brings both seams to ~124–140px, in line with
          Testimonials (120px) and Our Story (129px) — the two other
          seams belonging to comparably lightweight sections, rather
          than the airier 170px+ seams that belong to sections with
          their own divider treatment. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-8 px-6 py-16 sm:px-10 sm:py-20">
        <h2 className="text-center text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          Trusted by
        </h2>
        {/* Small heading accent, 7 Sep 2026, same message as the top
            divider above — this section was missing the `h-px w-12`
            accent every other major section heading carries directly
            under itself (Products, Supply, Long Run, Custom,
            Certifications as of this same edit, Founder). Same class,
            not a new variant — see CertificationsSection.tsx's own
            comment on this same day for the parallel fix there. */}
        <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />
        <TrustedByRow customers={customers} scrollSpeed={scrollSpeed} />
      </div>
    </section>
  );
}
