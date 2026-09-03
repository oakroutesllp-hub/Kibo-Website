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
// Equal card height regardless of quote length, two mechanisms
// together: `items-stretch` (flexbox default) matches every card in
// the same row to the tallest one, AND each card's own `line-clamp-5`
// caps a genuinely long quote so even a lone long-quote row doesn't
// tower over the row below it — same reasoning CustomSection.tsx's
// attribute blurbs already use `line-clamp-3` for.
export function TestimonialsSection({
  testimonials,
  show,
  limit,
  desktopSpeed,
  mobileSpeed,
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
}) {
  if (!show || testimonials.length === 0) return null;
  const visible = typeof limit === "number" ? testimonials.slice(0, limit) : testimonials;
  if (visible.length === 0) return null;

  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-10 px-6 py-16 sm:px-10 sm:py-20">
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
                <p className="mb-5 line-clamp-5 text-body text-charcoal/80">{testimonial.quote}</p>
                <div className="mt-auto">
                  <p className="text-support font-semibold text-charcoal">{testimonial.authorName}</p>
                  <p className="text-micro text-charcoal/60">{testimonial.authorRole}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="hidden xl:block xl:w-full">
            <TestimonialsDesktopCarousel testimonials={visible} intervalSeconds={desktopSpeed} />
          </div>
        )}

        {/* Carousel view, below `xl` — one at a time, regardless of
            count (even 2-3 testimonials still get the mobile carousel,
            not a stacked list — see TestimonialsCarousel.tsx's own
            comment on why). */}
        <div className="w-full max-w-md xl:hidden">
          <TestimonialsCarousel testimonials={visible} intervalSeconds={mobileSpeed} />
        </div>
      </div>
    </section>
  );
}
