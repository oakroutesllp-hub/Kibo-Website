"use client";

import { useEffect, useState } from "react";
import type { TestimonialContent } from "@/lib/content";

// Desktop sliding-window carousel — only used once there are MORE than
// 3 testimonials (`xl`+; TestimonialsSection.tsx renders the plain
// static centered row instead when there are 3 or fewer, see that
// file's own comment). 3 Sep 2026, owner's own spec, confirmed before
// building: "we show four in a row [we settled on 3, not 4 — see the
// width-math discussion], and there is [a further] fifth testimonial.
// The carousel should be such that the first one disappears, fifth
// one appears, then the second one disappears, first one reappears
// again" — a sliding WINDOW of 3 visible cards that shifts by exactly
// one position per advance, wrapping (looping) back to the start
// rather than stopping at the end.
//
// Implementation note, disclosed rather than silently chosen: each of
// the 3 card SLOTS (not each testimonial) is a fixed position: slot 0,
// 1, 2. Advancing swaps which testimonial's content renders in each
// slot (slot 0 shows testimonial[start], slot 1 shows
// testimonial[start+1], etc., wrapping via modulo) — an instant
// content swap per slot, not an animated sliding-transform motion.
// This is simpler and more robust than a true slide (which needs a
// doubled track + careful reset-without-transition to loop seamlessly)
// while still satisfying every functional requirement above: 3
// visible, shifts by one, loops, both auto and manual advance. Ask a
// future session to add an animated slide/fade transition later if
// the instant swap reads as too abrupt once real testimonials are in.
const WINDOW_SIZE = 3;

export function TestimonialsDesktopCarousel({
  testimonials,
  intervalSeconds = 6,
}: {
  testimonials: TestimonialContent[];
  intervalSeconds?: number;
}) {
  const [start, setStart] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    if (paused || count <= WINDOW_SIZE) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => setStart((s) => (s + 1) % count), Math.max(1, intervalSeconds) * 1000);
    return () => clearInterval(timer);
  }, [paused, count, intervalSeconds]);

  if (count === 0) return null;

  const goTo = (next: number) => setStart(((next % count) + count) % count);
  const visible = Array.from({ length: Math.min(WINDOW_SIZE, count) }, (_, i) => testimonials[(start + i) % count]);

  return (
    <div
      // `mx-auto` added 3 Sep 2026 — found live, not assumed: this
      // wrapper's parent (TestimonialsSection.tsx's `xl:block
      // xl:w-full` div) is a plain block element that stretches to
      // the section's FULL width, and a block child with `max-w` but
      // no `mx-auto` defaults to flush-left inside a wider parent
      // (confirmed: measured 0px left margin, 115px right margin at
      // 1440px before this fix — visible in the owner's own
      // screenshot as cards hugging the left edge). The static-row
      // version never had this bug because IT sits directly inside a
      // `flex flex-col items-center` parent, which centers any
      // narrower child automatically — this carousel needed its own
      // explicit centering since it's one extra wrapper level removed
      // from that parent.
      className="relative mx-auto w-full max-w-[1230px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {/* `items-stretch` made explicit (was relying on flexbox's
          unspecified default, which resolves to the same behavior but
          isn't guaranteed identical across every render path) after
          the owner reported visibly unequal card heights live —
          couldn't reproduce the imbalance locally with matching test
          content (measured all 3 cards at an identical 266.5px), but
          this is a zero-cost, strictly-safer belt-and-suspenders fix
          regardless of the exact mechanism, and removes any ambiguity
          for future debugging. */}
      <div className="flex flex-wrap items-stretch justify-center gap-6">
        {visible.map((testimonial, slot) => (
          <div
            key={slot}
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

      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={() => goTo(start - 1)}
        className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background text-charcoal shadow-md transition-colors hover:bg-charcoal/[0.06]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={() => goTo(start + 1)}
        className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-background text-charcoal shadow-md transition-colors hover:bg-charcoal/[0.06]"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      <div className="mt-6 flex items-center justify-center gap-1.5">
        {testimonials.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show testimonial ${i + 1}`}
            aria-current={i === start}
            onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === start ? "w-5 bg-charcoal" : "w-1.5 bg-charcoal/25 hover:bg-charcoal/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
