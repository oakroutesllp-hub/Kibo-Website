import type { ReactNode } from "react";

// Line-icon set for "The Supply Behind Your Market"'s 3-row list
// (Manufacturing capability / Simplified supply / On-the-ground know-how).
//
// Chosen 27 Aug 2026 from "Section 4 logos.pdf" (owner-supplied icon
// options, one page per row) — same Lucide-sourced approach as
// CustomAttributeIcon.tsx (lucide.dev, ISC licence, free to use, no
// attribution), for the same reason: consistent, recognizable line-icon
// quality across the two sections rather than a second hand-drawn set.
//   - Manufacturing → Lucide "layers", the exact same icon (and path)
//     already used for Custom's Fabric attribute — the PDF's own
//     top-left option for this row was visually a layered/stacked
//     shape, which "layers" already covers, and reusing it keeps one
//     less icon concept in the shared vocabulary across both sections.
//   - Supply → Lucide "share-2" (three circular nodes, triangularly
//     connected) — closest real Lucide icon to the PDF's "scattered
//     dot / network cluster" concept (the PDF's own reference was a
//     denser 6-7 node cluster, but that reads as noise at the ~20px
//     size this renders at; share-2 keeps the same "distributed nodes,
//     one network" idea legible at icon scale).
//   - Ground → Lucide "map-pin" (outline pin with an inner ring) — a
//     direct match to one of the three pin variants offered on the
//     PDF's own page for this row.
// `currentColor` throughout so a className controls colour (used at
// `text-sage-green`, matching CustomAttributeIcon's convention).
type IconName = "manufacturing" | "supply" | "ground";

const ICON_PATHS: Record<IconName, ReactNode> = {
  // Lucide "layers" — identical path to CustomAttributeIcon's "fabric"
  // icon, reused deliberately (see file comment above).
  manufacturing: (
    <>
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </>
  ),
  // Lucide "share-2"
  supply: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98" />
      <path d="m15.41 6.51-6.82 3.98" />
    </>
  ),
  // Lucide "map-pin"
  ground: (
    <>
      <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
};

export function SupplyRowIcon({ name, className }: { name: IconName; className?: string }) {
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
