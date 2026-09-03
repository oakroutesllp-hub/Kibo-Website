"use client";

import { useEffect, useState } from "react";
import type { TestimonialContent } from "@/lib/content";

// One-at-a-time testimonial view for narrow screens (below `lg` —
// TestimonialsSection.tsx switches to this instead of its grid), 3 Sep
// 2026 — owner's own reasoning: "on mobile somebody will have to
// scroll through three testimonials before they can reach the CTA...
// I feel like they will go through one testimonial and drop off" — a
// grid stacked full-width on mobile adds real scroll distance right
// before the CTA nudge section that follows; showing one at a time
// avoids that cost while keeping the same "multiple people vouch for
// us" signal via the dots.
//
// Same auto-advance + arrows/dots mechanism as MediaCarousel.tsx, but
// deliberately a separate component rather than a shared one — that
// component is image-specific (Next.js `<Image>`, `sizes` prop);
// forcing testimonials through it would mean stripping all of that
// out via a union-type prop, more complexity than just having two
// small, single-purpose components.
//
// Default 7s interval (longer than MediaCarousel's 5s default) —
// reading a full sentence takes longer than glancing at a photo; not
// tied to the "Image carousel speed" Site Settings field, which is
// scoped to the 4 media carousels by name (Hero, Our Story) and would
// be a confusing dual-purpose setting if reused here. Owner-editable
// via its own "Testimonials — mobile auto-advance speed" field
// instead (3 Sep 2026, same request as the desktop carousel's own
// speed field — see TestimonialsDesktopCarousel.tsx).
export function TestimonialsCarousel({
  testimonials,
  intervalSeconds = 7,
}: {
  testimonials: TestimonialContent[];
  intervalSeconds?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), Math.max(1, intervalSeconds) * 1000);
    return () => clearInterval(timer);
  }, [paused, count, intervalSeconds]);

  if (count === 0) return null;

  const goTo = (next: number) => setIndex(((next % count) + count) % count);
  const current = testimonials[index];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* `px-11 sm:px-12` (44px/48px), wider than the vertical `py-6
          sm:py-7` — the prev/next arrows below are absolutely
          positioned at `left-2`/`right-2` with an `h-8 w-8` (32px)
          box, ending 40px from each edge. Found live, not assumed:
          the card's original uniform `p-6 sm:p-7` (24px/28px) left the
          quote text running UNDER the arrows on narrow screens (a real
          word got visually cut by the button, not just close to it) —
          horizontal padding needs to clear the arrows specifically,
          vertical padding doesn't. */}
      <div className="flex h-full flex-col rounded-lg border border-charcoal/10 bg-background px-11 py-6 sm:px-12 sm:py-7">
        <span aria-hidden="true" className="mb-3 text-3xl leading-none text-sage-green">
          &ldquo;
        </span>
        {/* `line-clamp-6` — one line more than the grid cards' `line-clamp-5`
            (CustomSection.tsx's own precedent for length caps), since
            this view has no neighboring card forcing a shared row
            height — a little more room reads better alone.
            `min-h-[144px]` (6 lines × 24px) added 3 Sep 2026 alongside
            the same fix on the desktop carousel — without it, this
            card's own height (and the arrow buttons' vertical
            position, since they're centered on the card) still jumped
            between a short quote and a long one as the mobile
            carousel auto-advanced. */}
        <p className="mb-5 line-clamp-6 min-h-[144px] text-body text-charcoal/80">{current.quote}</p>
        {/* `line-clamp-2` + `min-h`, name and role — same fix, same
            reasoning as the desktop carousel's own comment: without
            it, this card's own height (and the arrow buttons centered
            on it) still jumped between a short author block and a
            long one. */}
        <div className="mt-auto">
          <p className="line-clamp-2 min-h-[40.3px] text-support font-semibold text-charcoal">{current.authorName}</p>
          <p className="line-clamp-2 min-h-[30.8px] text-micro text-charcoal/60">{current.authorRole}</p>
        </div>
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-charcoal shadow-md transition-colors hover:bg-charcoal/[0.06]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background text-charcoal shadow-md transition-colors hover:bg-charcoal/[0.06]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="mt-4 flex items-center justify-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-charcoal" : "w-1.5 bg-charcoal/25 hover:bg-charcoal/40"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
