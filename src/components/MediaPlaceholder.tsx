// Neutral placeholder for any media slot without a real asset yet. Master
// Brief §12: "Design media sections so assets can later be replaced without
// rebuilding layouts" — this is that seam. Styled as a deliberate "media
// coming soon" frame (hairline pattern + label badge) rather than a flat
// grey fill, so it reads as an intentional placeholder, not a bug.
//
// Deliberately charcoal-based (fully desaturated), not a Warm Stone tint —
// per owner feedback (19 Aug 2026), placeholder content shouldn't borrow a
// brand accent color at all; a neutral grey is the safer, standard
// convention for "not real content yet." Swapped automatically for a real
// image once one exists in Sanity (see lib/content).
export function MediaPlaceholder({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden border border-charcoal/10 bg-charcoal/[0.04] bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--color-charcoal)_8%,transparent)_0,color-mix(in_srgb,var(--color-charcoal)_8%,transparent)_1px,transparent_1px,transparent_14px)] ${className ?? ""}`}
    >
      <span className="rounded-full bg-background/85 px-3 py-1 text-micro font-medium text-charcoal/60">
        {label}
      </span>
    </div>
  );
}
