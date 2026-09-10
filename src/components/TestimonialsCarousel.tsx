"use client";

import { useEffect, useRef, useState } from "react";
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
  compactQuote,
}: {
  testimonials: TestimonialContent[];
  intervalSeconds?: number;
  compactQuote?: boolean;
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

  const goTo = (next: number) => setIndex(((next % count) + count) % count);

  // Swipe-to-advance, 9 Sep 2026 (owner: "Yes, go ahead and add
  // swipe") — genuinely new, this component never had real touch-
  // swipe support at any point in its history (confirmed via git log
  // before building this); what briefly felt like swipe was actually
  // a real bug — the whole PAGE could be dragged sideways (the same
  // horizontal-overflow bug fixed earlier the same day), so dragging
  // across this card was panning the entire page, not driving the
  // carousel. Passive start/end tracking only (no `touchmove`
  // handler, no `preventDefault` anywhere) — the browser's native
  // vertical scroll is never interrupted mid-gesture; direction is
  // decided ONCE, at `touchend`, from the net movement. Requires the
  // drag to be both far enough (40px) AND more horizontal than
  // vertical (`abs(deltaX) > abs(deltaY)`) before it counts as a
  // swipe — an ordinary vertical scroll that happens to start on this
  // card, even one with a little sideways wobble, never triggers it.
  // `touch-pan-y` on the container (below) tells the browser up front
  // that vertical panning is this element's own native gesture,
  // keeping horizontal drags free for this logic without any
  // scroll-vs-swipe ambiguity or input lag. Touch also pauses
  // auto-advance the same way hover/focus already do, via the same
  // `paused` state — a mid-swipe auto-advance firing under a visitor's
  // thumb would be a jarring, confusing double-move.
  //
  // `touchStart` (a ref, not state) is declared here, ABOVE the
  // `count === 0` early return below — React's Rules of Hooks require
  // every hook to run on every render, so `useRef` can't sit after a
  // conditional return. `goTo` (above) was moved up alongside it for
  // the same reason, since these handlers close over it.
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    setPaused(true);
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStart.current;
    touchStart.current = null;
    setPaused(false);
    if (!start) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;
    const SWIPE_THRESHOLD_PX = 40;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD_PX || Math.abs(deltaX) <= Math.abs(deltaY)) return;
    goTo(index + (deltaX < 0 ? 1 : -1));
  };

  if (count === 0) return null;

  const current = testimonials[index];

  return (
    <div
      className="relative w-full touch-pan-y"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
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
      {/* `border-charcoal/10` → `border-sage-green-deep/25`, 10 Sep
          2026 — same change as both desktop card variants (see
          TestimonialsSection.tsx's own comment for the full context):
          the section background went back to white, so the card
          border carries the definition instead. */}
      <div className="flex h-full flex-col rounded-lg border border-sage-green-deep/25 bg-background px-11 py-6 sm:px-12 sm:py-7">
        <span aria-hidden="true" className="mb-3 text-3xl leading-none text-sage-green">
          &ldquo;
        </span>
        {/* `line-clamp-6` — one line more than the grid cards' own cap
            (CustomSection.tsx's own precedent for length caps), since
            this view has no neighboring card forcing a shared row
            height — a little more room reads better alone.
            `min-h-[144px]` (6 lines × 24px) added 3 Sep 2026 alongside
            the same fix on the desktop carousel — without it, this
            card's own height (and the arrow buttons' vertical
            position, since they're centered on the card) still jumped
            between a short quote and a long one as the mobile
            carousel auto-advanced.

            **`line-clamp-6`/`min-h-[144/121px]` → `line-clamp-5`/
            `min-h-[120/101px]`, 10 Sep 2026** — the desktop cards'
            own cap dropped from 5 lines to 4 the same day (see
            TestimonialsSection.tsx's own comment for the real-quote
            measurements behind that), so this one drops from 6 to 5
            to preserve the same "+1 over desktop" relationship, not
            picked independently. Coincidentally lands on the exact
            pixel values desktop used to have (120px/101px) — a
            genuine coincidence of the math, not the reasoning; this
            view still gets its own dedicated extra line, same as
            before. */}
        {/* Compact-quote fallback (4 Sep 2026) — 5 lines × 20.15px
            (text-support's line-height) ≈ 100.75px, measured live as
            101px at the boundary — see TestimonialsSection.tsx's own
            matching comment for the full trade-off. */}
        <p
          className={`mb-5 line-clamp-5 text-charcoal/80 ${
            compactQuote ? "min-h-[101px] text-support" : "min-h-[120px] text-body"
          }`}
        >
          {current.quote}
        </p>
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
          {/* Circle chrome (`rounded-full bg-background shadow-md` +
              hover fill) removed, 3 Sep 2026 (owner: "the arrows...
              look very big proportionately as compared to the text
              itself... I feel that the arrow should not be within the
              circle. It makes it look too big... instead can we just
              have the chevron... and an invisible radius... touch
              sensor around it without having that circle outlined
              with shadow") — same fix applied to both this mobile
              carousel and TestimonialsDesktopCarousel.tsx (owner's own
              "your call" on mobile-only vs. both; picked both so the
              arrow doesn't read as two different styles across
              breakpoints). The `h-8 w-8` box itself is UNCHANGED — it's
              still the full invisible tap target, just with no visible
              fill/border/shadow now; card padding (`px-11 sm:px-12`,
              this file's own earlier comment) was already tuned against
              this exact box footprint, so text-clearing the arrow still
              holds without touching that separately. Hover now shifts
              the icon's own color (`hover:text-charcoal/50`) instead of
              painting a circle behind it. */}
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => goTo(index - 1)}
            className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => goTo(index + 1)}
            className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal"
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
