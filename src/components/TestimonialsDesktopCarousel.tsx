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
  compactQuote,
}: {
  testimonials: TestimonialContent[];
  intervalSeconds?: number;
  compactQuote?: boolean;
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
          isn't guaranteed identical across every render path) — kept
          as a belt-and-suspenders fix, but it was never the actual
          cause of the height report (see `min-h-[120px]` below for
          the real fix, 3 Sep 2026). */}
      <div className="flex flex-wrap items-stretch justify-center gap-6">
        {visible.map((testimonial, slot) => (
          <div
            key={slot}
            className="flex w-[360px] flex-none flex-col rounded-lg border border-charcoal/10 bg-background p-6 sm:p-7"
          >
            <span aria-hidden="true" className="mb-3 text-3xl leading-none text-sage-green">
              &ldquo;
            </span>
            {/* `min-h-[120px]` (5 lines × 24px line-height, measured
                live), added 3 Sep 2026 — the real root cause of the
                owner's "tile size still changing" report, confirmed by
                measurement: `line-clamp-5` only caps a LONG quote's
                height, it doesn't reserve space for a SHORT one — a
                short quote's <p> shrinks to fit its own 1-2 lines, so
                `mt-auto` pulls the whole card shorter too. Because this
                sliding carousel reshuffles which 3 testimonials are
                visible every few seconds, that made the row's overall
                height visibly grow and shrink between auto-advance
                states (measured 220.6px vs. 265.7px for the same 3
                slots, seconds apart) even though every card WITHIN one
                row already matched (`items-stretch` alone can't fix
                this — it only equalizes cards against each other in
                a single row, not against a row that hasn't rendered
                yet). Reserving the full 5-line height regardless of
                actual quote length makes every card the same height
                in every state, not just within each individual row. */}
            {/* Compact-quote fallback (4 Sep 2026) — see
                TestimonialsSection.tsx's own matching comment for the
                min-height math behind the two size options. */}
            <p
              className={`mb-5 line-clamp-5 text-charcoal/80 ${
                compactQuote ? "min-h-[101px] text-support" : "min-h-[120px] text-body"
              }`}
            >
              {testimonial.quote}
            </p>
            {/* `line-clamp-2` + matching `min-h` on BOTH name and role,
                3 Sep 2026 — a second, distinct cause of the same
                "row height changes between states" report: capping
                only the quote (above) left the author block itself
                free to grow (a 2-line name and a long role together
                measured 40px/46px live, against 20px/15px for a short
                one), which alone reshuffled the row's overall height
                between auto-advance states just as much as the quote
                did before its own fix. Same mechanism, applied to the
                one other piece of free-text content in this card. */}
            <div className="mt-auto">
              <p className="line-clamp-2 min-h-[40.3px] text-support font-semibold text-charcoal">{testimonial.authorName}</p>
              <p className="line-clamp-2 min-h-[30.8px] text-micro text-charcoal/60">{testimonial.authorRole}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Circle chrome removed, 3 Sep 2026 — same fix, same reasoning
          as TestimonialsCarousel.tsx's own matching comment (owner
          flagged this on mobile, applied here too for consistency
          across breakpoints — see that file's comment for the full
          quote). `h-9 w-9` invisible tap target unchanged. */}
      <button
        type="button"
        aria-label="Previous testimonial"
        onClick={() => goTo(start - 1)}
        className="absolute left-0 top-1/2 z-10 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next testimonial"
        onClick={() => goTo(start + 1)}
        className="absolute right-0 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 translate-x-1/2 items-center justify-center text-charcoal/70 transition-colors hover:text-charcoal"
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
