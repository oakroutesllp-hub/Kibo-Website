import Image from "next/image";

// Static KIBO wordmark. Deliberately not animated: the brand spec describes
// a K-built-from-mountain-geometry animation, but the only asset we have is
// this flattened PNG (no separated vector paths to drive it). Treat the
// animation as a deferred enhancement until real SVG/AI vector masters with
// editable K components arrive — see DESIGN-SYSTEM.md.
//
// The source file (public/brand/kibo-logo.png) was auto-cropped (21 Aug
// 2026) from the originally-supplied 1740×904 asset, which had a large
// baked-in white margin around the mark — that margin was throwing off
// vertical alignment anywhere the logo sat next to text (e.g. the footer
// columns), since the visible mark started well below the image's own
// top edge. Cropped tight to the mark plus a small even margin; update
// this ratio again if the source file is ever replaced.
const LOGO_ASPECT_RATIO = 933 / 363;

// Light/white variant, added 4 Sep 2026 specifically for the footer's
// new dark `green-gray-deep` background (see Footer.tsx's own
// comment) — the original `kibo-logo.png` has a dark "IBO" wordmark
// and a colored gradient K-mark baked into the file, both effectively
// invisible on a dark surface. Owner supplied a real replacement
// (`Kibo Logo White.svg`, generated via Recraft AI — the same tool an
// earlier logo attempt used, which got rejected for visible gradient-
// seam artifacts; checked this one directly by rendering it against
// the actual footer background color before using it anywhere, and
// it's a flat solid white silhouette with no gradient at all, so that
// whole failure mode doesn't apply here). Own aspect ratio (953×532,
// ≈1.79) since this file is cropped tightly to just the wordmark —
// noticeably different from the original PNG's own ratio (933×363,
// ≈2.57), which carries extra built-in margin the SVG doesn't.
const LOGO_WHITE_ASPECT_RATIO = 953 / 532;

type LogoProps = {
  /** Rendered width in pixels; height is derived from the source aspect ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
  /** "dark" (default) is the original mark, for light/white backgrounds.
      "light" is the white silhouette variant, for dark backgrounds
      (currently just the footer). */
  variant?: "dark" | "light";
};

export function Logo({ width = 160, className, priority, variant = "dark" }: LogoProps) {
  const isLight = variant === "light";
  const aspectRatio = isLight ? LOGO_WHITE_ASPECT_RATIO : LOGO_ASPECT_RATIO;
  const height = Math.round(width / aspectRatio);

  return (
    <Image
      src={isLight ? "/brand/kibo-logo-white.svg" : "/brand/kibo-logo.png"}
      alt="KIBO"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
