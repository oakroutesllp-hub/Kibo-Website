import type { ReactNode } from "react";

// Shared small-caps label treatment — the one consistent typographic device
// used across the homepage (section eyebrows, product category labels) so
// hierarchy reads the same everywhere instead of each section inventing its
// own label style.
//
// Both tones stay in the Sage Green / Green Gray family per owner feedback
// (19 Aug 2026): the brand's cool green tones should dominate, not Warm
// Stone/Soft Taupe (beige/rust) — those two stay available as tokens for a
// deliberate warm accent later, but aren't used in this pass.
//  - "primary" (sage-green): section-level eyebrows (Hero, Range)
//  - "muted" (green-gray): secondary, item-level meta (product category)
const TONES = {
  primary: "text-sage-green",
  muted: "text-green-gray",
} as const;

export function Eyebrow({
  children,
  tone = "primary",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  return (
    // `text-micro` (11px, 29 Aug 2026) — the semantic "micro label" size
    // from the owner's revised type scale (font size.png/font case
    // 1&2.png), replacing the generic `text-xs`. Uppercase stays, per
    // that same spec's case rule ("micro labels: uppercase").
    <p
      className={`text-micro font-semibold uppercase tracking-[0.16em] ${TONES[tone]} ${className ?? ""}`}
    >
      {children}
    </p>
  );
}
