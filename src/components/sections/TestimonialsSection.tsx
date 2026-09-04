import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { TestimonialsDesktopCarousel } from "@/components/TestimonialsDesktopCarousel";
import type { TestimonialContent } from "@/lib/content";

// Desktop shows a plain static row for 3 or fewer testimonials, but
// switches to TestimonialsDesktopCarousel's sliding window once there
// are MORE than this — see that component's own comment for the full
// "first disappears, next appears, loops" spec. 3 (not 4) per the
// owner's own confirmed call after seeing the actual width math: at a
// comfortable, readable card width, only 3 fit in one row from this
// site's `xl` breakpoint up through its own widest point — matches
// the site's existing 3-across convention elsewhere (Products, Blog).
const MAX_STATIC_ROW = 3;

// Testimonials — new Home section, 3 Sep 2026, owner: "let's do
// testimonials section." Hidden until both `showTestimonials` (Site
// Settings) is on AND at least one real Testimonial document exists —
// same "won't go live now" toggle pattern as the Blog page; returns
// null here defensively even if a future caller forgets to check the
// toggle itself, so an empty/disabled state can never render a blank
// section with just a heading and no cards.
//
// Placed on Home between "Built for the long run" and the CTA nudge
// (owner's own reasoning: trust content right before the one
// conversion ask on the page reads better than after it) — see
// `(site)/page.tsx` for the actual insertion point.
//
// Desktop/tablet (`xl`+): a centered flex row, NOT a fixed 3-column
// grid — deliberate. A `grid-cols-3` would auto-place 1 or 2 cards
// starting from the left, leaving lopsided empty space on the right
// (owner, testing the idea live: "if there is just one testimonial,
// it can't be left aligned or right aligned — it has to be in the
// center"). `flex flex-wrap justify-center` with each card at a fixed
// width instead centers 1, 2, or 3 cards identically, and would still
// center a wrapped second row if a 4th+ testimonial is ever added.
// Below `xl`: TestimonialsCarousel.tsx, one at a time — see that
// file's own comment for why (avoiding a 3-card scroll tax right
// before the CTA nudge on mobile).
//
// `xl` (1280px), not `lg` (1024px) like most other 3-column sections
// on this site — found live, not assumed: at exactly 1280px with the
// original `lg` breakpoint, 3 fixed 380px cards + 2 24px gaps (1188px)
// didn't fit the ~1185px actually available, so the 3rd card silently
// wrapped to its own row (2 cards centered above, 1 alone below) —
// text cards need more width than this site's other 3-across grids
// (small image thumbnails), so `lg`'s narrower range isn't safe for
// them. `xl` guarantees real slack (~57px at exactly 1280px) rather
// than landing 3px short.
//
// Equal card height regardless of quote length: the quote paragraph
// carries both `line-clamp-5` (caps a long quote, same reasoning
// CustomSection.tsx's attribute blurbs use `line-clamp-3` for) AND
// `min-h-[120px]` (reserves that same 5-line height even for a SHORT
// quote — `line-clamp` alone only caps a maximum, it doesn't reserve
// a minimum, so without this a short quote's card would still shrink
// on its own). `items-stretch` (flexbox default) then matches every
// card in one row to the tallest — belt-and-suspenders alongside the
// min-height, not a substitute for it. See
// TestimonialsDesktopCarousel.tsx's own comment for the live
// measurement that found this — the actual owner-reported bug was
// each AUTO-ADVANCE STATE rendering a different row height from the
// next, not cards mismatching within one single row.
export function TestimonialsSection({
  testimonials,
  show,
  limit,
  desktopSpeed,
  mobileSpeed,
  compactQuote,
}: {
  testimonials: TestimonialContent[];
  show: boolean;
  // Testing control (3 Sep 2026) — see siteSettingsType.ts's own
  // "testimonialsLimit" field description. `undefined` means show
  // every testimonial; a number caps it, so the owner can preview 1/2/
  // 3/4-testimonial layouts without deleting or unpublishing anything.
  limit?: number;
  desktopSpeed?: number;
  mobileSpeed?: number;
  // Fallback quote-size toggle (4 Sep 2026) — see siteSettingsType.ts's
  // own "testimonialsCompactQuote" field description. Threaded down to
  // the static grid below AND both carousel components, since all
  // three render their own quote paragraph independently.
  compactQuote?: boolean;
}) {
  if (!show || testimonials.length === 0) return null;
  const visible = typeof limit === "number" ? testimonials.slice(0, limit) : testimonials;
  if (visible.length === 0) return null;

  return (
    // `bg-background` → `bg-sage-green/10`, 3 Sep 2026 (owner: "the
    // next section, which is 'what our partners say,' that along with
    // 'get in touch'... needs to be the sage green gray background")
    // — same token Long Run used to carry (see LongRunSection.tsx's
    // own comment), forming one continuous tinted band with
    // CTANudgeSection right below it. CTANudgeSection's own background
    // needs NO change for this to work — it already darkens itself
    // slightly on mobile (`bg-sage-green/20`) specifically to stay
    // visually distinct from whatever same-tinted section precedes it,
    // a mechanism built for exactly this "two tinted sections back to
    // back" case (originally written for Long Run, now applies to
    // Testimonials instead by the same construction, no change needed
    // on CTA's side).
    <section className="w-full bg-sage-green/10">
      {/* Heading→tile gap `gap-10` → `gap-14` (40px → 56px, 3 Sep 2026,
          owner: "increase the gap between 'what our partners say' and
          the top of the tile... need some space") — measured live
          first (exactly 40px, confirming this single flex `gap` is the
          whole seam, both for the desktop grid/carousel and the mobile
          carousel, since only one of those two is ever an un-hidden
          flex sibling at a given breakpoint).

          Bottom padding split off the shared `py-16 sm:py-20` into its
          own `pb-11 sm:pb-14` (44px/56px, same day, same request:
          "decrease the space between the slider... dot dot dot... and
          'have a requirement in mind'... reduce that gap slightly") —
          measured that seam too: 100px at desktop, made up of this
          section's own `sm:py-20` bottom half (80px) plus
          CTANudgeSection's own `sm:pt-5` top padding (20px) once the
          two sections meet with no gap between the boxes themselves.
          Cut the bottom half only, top (`pt-16 sm:pt-20`, the space
          above the heading) left exactly as it was — that's a
          different seam, not the one flagged. New total: 76px at
          desktop (56 + CTA's unchanged 20), a real but not drastic
          reduction from 100px, in the same ~30%-cut range as this
          codebase's existing precedent for "tighten a flagged seam
          without collapsing it." */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-14 px-6 pt-16 pb-11 sm:px-10 sm:pt-20 sm:pb-14">
        <h2 className="text-center text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          What our <span className="text-sage-green">partners say</span>
        </h2>

        {/* Desktop/tablet, `xl`+ only. Static centered row for
            MAX_STATIC_ROW (3) or fewer; the sliding-window carousel
            once there are more. */}
        {visible.length <= MAX_STATIC_ROW ? (
          <div className="hidden w-full max-w-[1230px] flex-wrap justify-center gap-6 xl:flex">
            {visible.map((testimonial) => (
              <div
                key={testimonial.authorName + testimonial.authorRole}
                className="flex w-[360px] flex-none flex-col rounded-lg border border-charcoal/10 bg-background p-6 sm:p-7"
              >
                <span aria-hidden="true" className="mb-3 text-3xl leading-none text-sage-green">
                  &ldquo;
                </span>
                {/* Compact-quote fallback (4 Sep 2026) — `min-h` value
                    changes with the font swap since `text-support`'s
                    line-height (20.15px) differs from `text-body`'s
                    (24px); 5 lines × 20.15px ≈ 100.75px, measured live
                    as 101px at the 5-line boundary — see
                    siteSettingsType.ts's own field description for the
                    full character-count trade-off this toggle makes. */}
                <p
                  className={`mb-5 line-clamp-5 text-charcoal/80 ${
                    compactQuote ? "min-h-[101px] text-support" : "min-h-[120px] text-body"
                  }`}
                >
                  {testimonial.quote}
                </p>
                {/* `line-clamp-2` + `min-h`, name and role — see
                    TestimonialsDesktopCarousel.tsx's own comment for
                    why this needed the same treatment as the quote. */}
                <div className="mt-auto">
                  <p className="line-clamp-2 min-h-[40.3px] text-support font-semibold text-charcoal">{testimonial.authorName}</p>
                  <p className="line-clamp-2 min-h-[30.8px] text-micro text-charcoal/60">{testimonial.authorRole}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden xl:block xl:w-full">
            <TestimonialsDesktopCarousel
              testimonials={visible}
              intervalSeconds={desktopSpeed}
              compactQuote={compactQuote}
            />
          </div>
        )}

        {/* Carousel view, below `xl` — one at a time, regardless of
            count (even 2-3 testimonials still get the mobile carousel,
            not a stacked list — see TestimonialsCarousel.tsx's own
            comment on why). */}
        <div className="w-full max-w-md xl:hidden">
          <TestimonialsCarousel
            testimonials={visible}
            intervalSeconds={mobileSpeed}
            compactQuote={compactQuote}
          />
        </div>
      </div>
    </section>
  );
}
