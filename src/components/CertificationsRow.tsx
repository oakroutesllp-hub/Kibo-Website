"use client";

import { useEffect, useRef, useState } from "react";
import type { CertificationContent } from "@/lib/content";

// Certifications row — split out from CertificationsSection.tsx as its
// own Client Component, 4 Sep 2026, once the row needed to measure its
// own width to decide whether to scroll — same reason Testimonials'
// carousels are separate Client Components from their (Server
// Component) section wrapper.
//
// Owner's own spec, confirmed before building: "if we have more
// certifications than can fit on the page, they will also slow
// scroll, and I should be able to change how fast or slow they
// scroll... we don't need a slider bar here... it needs to loop." A
// continuous auto-scroll (not Testimonials' discrete
// advance-and-pause-every-N-seconds carousel, and no dots/arrows at
// all) that ONLY activates once the certifications genuinely don't
// fit in one row at the viewer's own screen width — otherwise this
// renders exactly like the static centered row always has.
//
// Mechanism: measure the row's natural width once on mount (and on
// resize) against its container. If it fits, render the entries once,
// centered, motionless. If it overflows, render the entries TWICE
// back-to-back in one flex track and animate that track from 0 to
// -50% on a linear infinite loop — because the second copy is
// identical to the first, the moment the first copy has scrolled
// fully out of view the second copy is sitting exactly where the
// first one started, so the loop has no visible seam or reset (owner:
// "the first one loops after the fifth one," confirmed this is
// exactly that — a true loop, not a snap-back). Paused on hover so a
// visitor can actually read one if they want to; disabled entirely
// under `prefers-reduced-motion`, falling back to a plain
// horizontally-scrollable (not auto-moving) row instead, so overflow
// content is still reachable without motion.
export function CertificationsRow({
  certifications,
  scrollSpeed = 30,
}: {
  certifications: CertificationContent[];
  scrollSpeed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
  // Lazy initializer, not an effect-driven setState — `overflowing`
  // always starts false (real measurement only happens post-mount, via
  // the effect below), so `active` below is guaranteed false on both
  // the server-rendered and just-hydrated client output regardless of
  // what this resolves to; nothing to keep in sync via an effect.
  const [reducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

  useEffect(() => {
    const check = () => {
      if (!containerRef.current || !measureRef.current) return;
      setOverflowing(measureRef.current.scrollWidth > containerRef.current.clientWidth);
    };
    check();
    const observer = new ResizeObserver(check);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [certifications]);

  const entry = (cert: CertificationContent, i: number, keyPrefix: string) => (
    // Keyed by POSITION (`i`), not `cert.name` — the doubled marquee
    // track renders every certification twice (same names both
    // copies), so a name-based key collided across the two copies
    // (React logged "two children with the same key" for all 8 test
    // entries, caught via the dev overlay before this got a chance to
    // become a real bug in production). `i` is each item's actual
    // index in whichever array is being mapped (the doubled track or
    // the single static row), always unique within that render.
    // Icon on top, name below — owner's own follow-up ask, tried live:
    // "can we try this iteration - logo on top text below it?" — swaps
    // the `<a>` wrapper from a horizontal row to a centered column.
    // Divider height bumped from `h-6` to `h-10` to match the new
    // taller stacked entry (icon + gap + text line) instead of the old
    // single-line height.
    <div key={`${keyPrefix}-${i}`} className="flex flex-none items-center gap-8">
      {i > 0 && <span aria-hidden="true" className="h-10 w-px flex-none bg-charcoal/15" />}
      <a
        {...(cert.verificationUrl
          ? { href: cert.verificationUrl, target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="flex flex-none flex-col items-center gap-2"
      >
        {cert.icon && (
          <span
            aria-hidden="true"
            className="h-7 w-7 flex-none bg-sage-green-deep"
            style={{
              maskImage: `url(${cert.icon.url})`,
              WebkitMaskImage: `url(${cert.icon.url})`,
              maskSize: "contain",
              WebkitMaskSize: "contain",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        )}
        <span className="whitespace-nowrap text-support font-semibold text-sage-green-deep">{cert.name}</span>
      </a>
    </div>
  );

  const active = overflowing && !reducedMotion;

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-[1230px] ${active ? "overflow-hidden" : ""} ${
        overflowing && reducedMotion ? "overflow-x-auto" : ""
      }`}
    >
      {/* Hidden measuring copy — always the single, undoubled row, so
          `scrollWidth` reflects the real content width regardless of
          which mode is currently rendering below. `absolute` + `invisible`
          keeps it out of layout/paint but still measurable. */}
      <div ref={measureRef} className="invisible absolute flex items-center gap-8" aria-hidden="true">
        {certifications.map((cert, i) => entry(cert, i, "measure"))}
      </div>

      <div
        className={active ? "flex w-max items-center gap-8" : "flex flex-wrap items-center justify-center gap-x-8 gap-y-6"}
        style={
          active
            ? {
                animation: `certifications-scroll ${scrollSpeed}s linear infinite`,
              }
            : undefined
        }
        onMouseEnter={(e) => active && (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => active && (e.currentTarget.style.animationPlayState = "running")}
      >
        {active
          ? [...certifications, ...certifications].map((cert, i) => entry(cert, i, "loop"))
          : certifications.map((cert, i) => entry(cert, i, "static"))}
      </div>

      {active && (
        <style>{`
          @keyframes certifications-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      )}
    </div>
  );
}
