import type { ReactNode } from "react";

// Line-icon set for The Tiruppur Story's two sub-blocks (A Long
// Heritage / Specialised Ecosystems). Same convention as
// CustomAttributeIcon.tsx / SupplyRowIcon.tsx: `currentColor` stroke so
// a className controls colour, Lucide-sourced where a direct match
// exists (lucide.dev, ISC licence, free to use, no attribution).
//   - "people" → Lucide "users" (two overlapping figures) — a direct
//     match to the reference mockup's own icon.
//   - "thread" → no direct Lucide equivalent for a thread spool; hand-
//     drawn to match the mockup's silhouette (top/bottom rim, wound
//     thread lines) using the same stroke conventions as every other
//     icon on the site (24×24 viewBox, strokeWidth 2, round caps) so it
//     doesn't look out of place next to the Lucide-sourced ones.
type IconName = "thread" | "people";

const ICON_PATHS: Record<IconName, ReactNode> = {
  thread: (
    <>
      <ellipse cx="12" cy="5.5" rx="6" ry="2.25" />
      <ellipse cx="12" cy="18.5" rx="6" ry="2.25" />
      <path d="M6 5.5v13" />
      <path d="M18 5.5v13" />
      <path d="M7.5 8.5 16.5 12" />
      <path d="M7.5 12 16.5 15.5" />
    </>
  ),
  // Lucide "users"
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
};

export function TiruppurIcon({ name, className }: { name: IconName; className?: string }) {
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
