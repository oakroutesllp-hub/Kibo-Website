"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CustomerContent } from "@/lib/content";

// "Trusted by" row — 4 Sep 2026. Same overflow-measure-then-decide
// mechanism as CertificationsRow.tsx (measure the row's real width
// once on mount/resize; centered and motionless if it fits, doubled
// track + seamless CSS-animation loop if it doesn't, no dots/arrows,
// paused on hover, disabled under `prefers-reduced-motion` with a
// plain scrollable fallback instead) — see that file's own comment
// for the full reasoning, unchanged here.
//
// What's different from Certifications, all owner's own explicit
// calls after seeing several live mockups: **real, unmodified logo
// colors** — no CSS mask/recolor step at all (owner: "monotone takes
// away from the logos' brand identity... it's their identity, that's
// why that sticks as odd to me" — after also ruling out a grayscale-
// at-rest/color-on-hover compromise: "what is even a logo getting
// converted to color telling anybody... I don't agree with that
// logic"). **No dividers** between entries — generous whitespace
// alone does the separating job (owner: "increase the gaps... keep
// the logos very visible but not shouting too loud... smallish").
// **Fixed display height, natural width** for each logo — kept its
// own real aspect ratio rather than being forced into a uniform box,
// which is what actually keeps a very different set of real logos (a
// wide wordmark next to a square mark) reading as calm and equal-
// weighted instead of some looking stretched or cropped.
//
// **Name shown below the logo — reversed from an initial logo-only
// pass, same conversation** (owner: "logos only, no names" → then,
// almost immediately: "these brands might not be very big... it's not
// like I'm gonna see an Apple logo and instantly recognize it...
// these might be small time wholesalers and distributors... if I see
// just logos... who are they?"). A famous brand's logo carries meaning
// alone; an unfamiliar company's doesn't — the name is what actually
// makes this read as real, checkable social proof rather than an
// anonymous shape. Name styled quieter than the logo itself
// (`text-support`, muted color, not bold) — the logo stays the
// primary visual, the name is a caption under it, not equal billing.
export function TrustedByRow({
  customers,
  scrollSpeed = 30,
}: {
  customers: CustomerContent[];
  scrollSpeed?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [overflowing, setOverflowing] = useState(false);
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
  }, [customers]);

  // `h-8` (32px) fixed display height — "smallish," per the owner's
  // own word for it, modest enough to sit quietly under Products
  // rather than compete with it. Width is left to follow each logo's
  // own real aspect ratio (`w-auto` + the real `width`/`height` passed
  // to `Image` below), not a shared fixed box — a wide wordmark and a
  // square mark both read at the same visual WEIGHT this way, rather
  // than one being stretched or letterboxed to match the other.
  const entry = (customer: CustomerContent, i: number, keyPrefix: string) => {
    if (!customer.logo) return null;
    return (
      <a
        key={`${keyPrefix}-${i}`}
        {...(customer.websiteUrl
          ? { href: customer.websiteUrl, target: "_blank", rel: "noopener noreferrer" }
          : {})}
        className="flex flex-none flex-col items-center gap-2"
      >
        <Image
          src={customer.logo.url}
          alt={customer.logo.alt}
          width={customer.logo.width}
          height={customer.logo.height}
          className="h-8 w-auto"
        />
        <span className="whitespace-nowrap text-support text-charcoal/70">{customer.name}</span>
      </a>
    );
  };

  const active = overflowing && !reducedMotion;

  return (
    <div
      ref={containerRef}
      className={`w-full max-w-[1230px] ${active ? "overflow-hidden" : ""} ${
        overflowing && reducedMotion ? "overflow-x-auto" : ""
      }`}
    >
      {/* Hidden measuring copy — see CertificationsRow.tsx's own
          comment on why this stays the single, undoubled row
          regardless of which mode renders below. */}
      <div ref={measureRef} className="invisible absolute flex items-center gap-14" aria-hidden="true">
        {customers.map((customer, i) => entry(customer, i, "measure"))}
      </div>

      <div
        className={active ? "flex w-max items-center gap-14" : "flex flex-wrap items-center justify-center gap-x-14 gap-y-8"}
        style={active ? { animation: `trusted-by-scroll ${scrollSpeed}s linear infinite` } : undefined}
        onMouseEnter={(e) => active && (e.currentTarget.style.animationPlayState = "paused")}
        onMouseLeave={(e) => active && (e.currentTarget.style.animationPlayState = "running")}
      >
        {active
          ? [...customers, ...customers].map((customer, i) => entry(customer, i, "loop"))
          : customers.map((customer, i) => entry(customer, i, "static"))}
      </div>

      {active && (
        <style>{`
          @keyframes trusted-by-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      )}
    </div>
  );
}
