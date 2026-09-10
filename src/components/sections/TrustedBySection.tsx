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
          Originally the ONLY extra separator, deliberately (owner,
          same message: "don't make it too many lines either") — a
          second one was added below 10 Sep 2026, see that divider's
          own comment for why this changed.

          **Position within the button→heading gap, 10 Sep 2026**
          (owner, live screenshot: "the trusted by section needs a
          little more definition... increase the gap between get in
          touch and the horizontal line... make it one point five
          x... reduce the gap between the horizontal line and trusted
          by by the same point five x... push the horizontal line down
          by point five x") — measured live before changing anything:
          x (Get in touch's bottom → this line) was 32px/44px
          (mobile/desktop, from Products' own `pb-8 sm:pb-11`, this
          section contributing nothing before the divider); y (line →
          "Trusted by" heading) was 64px/80px. Target: x→1.5x
          (48px/66px), y→y−0.5x (48px/58px) — a wrapper here adds
          exactly that 0.5x (16px/22px) of new top space before the
          divider, entirely inside this component (so it vanishes
          along with everything else when `show` is false — Products'
          own padding above is untouched, same as before). */}
      <div className="pt-4 sm:pt-[22px]">
        {/* `mx-24` → `mx-[116px] sm:mx-[217px]`, 10 Sep 2026 (owner:
            "reduce the horizontal line size... by about maybe twenty,
            twenty five percent") — measured the line's own real
            rendered width before changing anything (183px mobile,
            1073px desktop), then picked an added inset that lands
            inside that 20–25% band rather than an arbitrary-looking
            round number: mobile 183px→143px (−21.9%), desktop
            1073px→832px (−22.5%). Same divider used for both lines
            below, so the width change applies to both automatically. */}
        <div className="mx-[116px] h-px bg-charcoal/10 sm:mx-[217px]" />
      </div>
      {/* `py-16 sm:py-20` (64px/80px, 7 Sep 2026 — see git history for
          that day's own full reasoning on why this section needed
          more breathing room at all) → split into independent
          `pt`/`pb`, 10 Sep 2026, same pass as the divider wrapper
          above: top shrinks to the new y (48px/58px, this component's
          own comment above has the math); bottom shrinks to the SAME
          48px/58px, deliberately matching — the owner's own next
          instruction ("whatever new gap between the horizontal line
          and trusted by, that same gap I want between bottom of the
          logos... and place another horizontal line underneath")
          asks for this exact symmetry: row-bottom → new divider now
          measures the same as divider-top → heading. The 16px/22px
          this bottom side gives up (64−48, 80−58) reappears below the
          new divider, mirroring the top wrapper exactly — see that
          divider's own comment. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-8 px-6 pt-12 sm:px-10 sm:pt-[58px] pb-12 sm:pb-[58px]">
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
      {/* Bottom divider, 10 Sep 2026 (owner: "place another horizontal
          line underneath [the logos] so that trusted by section gets
          a little more definition") — same inset technique as the top
          divider, mirroring it: sits exactly 48px/58px below the
          logos row (matching the new top gap, see that divider's own
          comment), with the original 64px/80px bottom breathing room
          reappearing below IT, split as a plain 16px/22px spacer here
          — the same 0.5x this pass took from the top side, given back
          on the bottom side, so the section's own total height versus
          Custom below is unchanged from before this whole pass, only
          redistributed. Still inside this component, same as
          everything else — off when `show` is false, no separate
          on/off spacing case to maintain (see this function's own
          top-level comment). Width matched to the top divider's own
          `mx-[116px] sm:mx-[217px]` reduction (see that divider's own
          comment for the exact numbers) — same class, kept in sync
          deliberately, not two independently-tuned lines. */}
      <div className="mx-[116px] h-px bg-charcoal/10 sm:mx-[217px]" />
      <div className="h-4 sm:h-[22px]" aria-hidden="true" />
    </section>
  );
}
