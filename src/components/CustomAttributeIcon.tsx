import type { ReactNode } from "react";

// Line-icon set for the Custom / Made to Specification attribute grid
// (Fabric / Fit / Construction / Colour / Print / Finish).
//
// Rebuilt 27 Aug 2026 using real icons from Lucide (lucide.dev, ISC
// licence — free to use, no attribution required) rather than hand-drawn
// SVG paths — two prior hand-drawn passes were both called too
// rudimentary next to the reference mockup's own icon art, and owner
// asked directly whether web access could find better ones. Paths below
// are copied verbatim from `lucide-static`, unmodified except for being
// inlined here (no npm dependency added for 6 icons):
//   Fit → "shirt", Colour → "palette", Print → "grip" (a 3×3 dot grid —
//   the closest Lucide equivalent to the mockup's dot-grid/halftone
//   icon), Finish → "sparkles". Fabric ("layers") and Construction
//   ("ruler") are reasonable conceptual matches rather than close visual
//   matches to the mockup's own crosshatch-medallion and sewing-machine
//   icons — Lucide doesn't have direct equivalents for either.
// `currentColor` throughout so a className controls colour (used at
// `text-sage-green`, matching Eyebrow's "primary" accent tone).
type IconName = "fabric" | "fit" | "construction" | "colour" | "print" | "finish";

const ICON_PATHS: Record<IconName, ReactNode> = {
  // Lucide "layers"
  fabric: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  // Lucide "shirt"
  fit: (
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
  ),
  // Lucide "ruler"
  construction: (
    <>
      <path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z" />
      <path d="m14.5 12.5 2-2" />
      <path d="m11.5 9.5 2-2" />
      <path d="m8.5 6.5 2-2" />
      <path d="m17.5 15.5 2-2" />
    </>
  ),
  // Lucide "palette"
  colour: (
    <>
      <path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" />
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" stroke="none" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" stroke="none" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" stroke="none" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" stroke="none" />
    </>
  ),
  // Lucide "grip"
  print: (
    <>
      {[5, 12, 19].flatMap((cy) =>
        [5, 12, 19].map((cx) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1" fill="currentColor" stroke="none" />
        )),
      )}
    </>
  ),
  // Lucide "sparkles"
  finish: (
    <>
      <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
      <path d="M20 2v4" />
      <path d="M22 4h-4" />
      <circle cx="4" cy="20" r="2" />
    </>
  ),
};

export function CustomAttributeIcon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
