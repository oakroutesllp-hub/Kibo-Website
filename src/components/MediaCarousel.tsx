"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Third media option alongside single image / video (2 Sep 2026, owner:
// "in addition to the image or video, I would like to have an option
// where multiple pictures can be scrolled, like a carousel... maybe
// five, six images") — added to all four existing image/video slots
// (Hero, We Started by Listening, The Tiruppur Story, The Person
// Behind KIBO — see each section's own `media?.type === "carousel"`
// branch and lib/content's `Media` type). Up to 6 images, per the
// owner's own number; enforced as a Sanity array validation
// (`.max(6)`), not here — this component just renders however many
// it's given.
//
// Auto-advances every 5s, plus manual prev/next arrows and dot
// indicators (owner: "auto-advance... but also manual arrows/dots").
// Auto-advance pauses on hover/focus (a visitor reading one slide
// shouldn't have it yanked away) and is skipped entirely under
// `prefers-reduced-motion` (dots/arrows still work — this only turns
// off the *automatic* movement, not the feature).
//
// Fills its positioned parent exactly like the single `<Image fill>`
// it replaces (`absolute inset-0`) — every call site already wraps its
// media slot in a `relative` box, so this drops in without changing
// any surrounding layout.
export function MediaCarousel({
  images,
  sizes = "100vw",
  className,
  intervalSeconds = 5,
}: {
  images: { url: string; alt: string }[];
  sizes?: string;
  className?: string;
  // Owner-editable (2 Sep 2026, owner: "let the number of seconds be
  // something that I can customize... or is it something that stays
  // hard coded" — answer: customizable) — one site-wide value in
  // Sanity (Site Settings → "Carousel speed"), not per-section, since
  // there was no request for different speeds in different places and
  // one shared number is one less thing to configure. Falls back to 5s
  // if unset, same default this component always used.
  intervalSeconds?: number;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const count = images.length;

  useEffect(() => {
    if (paused || count <= 1) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, Math.max(1, intervalSeconds) * 1000);
    return () => clearInterval(timer);
  }, [paused, count, intervalSeconds]);

  if (count === 0) return null;

  const goTo = (next: number) => setIndex(((next % count) + count) % count);

  return (
    <div
      className={`absolute inset-0 h-full w-full ${className ?? ""}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      onTouchStart={(e) => {
        touchStartX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX.current;
        // 40px — enough to distinguish an intentional swipe from an
        // incidental finger wobble while tapping, same threshold order
        // of magnitude as the product gallery's own swipe fix.
        if (delta > 40) goTo(index - 1);
        else if (delta < -40) goTo(index + 1);
        touchStartX.current = null;
      }}
    >
      {images.map((image, i) => (
        <div
          key={image.url + i}
          aria-hidden={i !== index}
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ease-in-out ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Image src={image.url} alt={image.alt} fill sizes={sizes} className="object-cover" priority={i === 0} />
        </div>
      ))}

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous image"
            onClick={() => goTo(index - 1)}
            className="absolute left-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-charcoal transition-colors hover:bg-background"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Next image"
            onClick={() => goTo(index + 1)}
            className="absolute right-3 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 text-charcoal transition-colors hover:bg-background"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          <div className="absolute inset-x-0 bottom-3 z-10 flex items-center justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to image ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-background" : "w-1.5 bg-background/60 hover:bg-background/85"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
