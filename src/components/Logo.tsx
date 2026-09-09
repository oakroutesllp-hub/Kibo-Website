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
// whole failure mode doesn't apply here).
//
// **Corrected 7 Sep 2026** — the line originally here claimed this
// file was "cropped tightly to just the wordmark," which turned out
// to be wrong: the owner caught the footer logo visibly NOT lining up
// with the text below it on a live screenshot, and measuring the raw
// SVG's own `getBBox()` against its `viewBox` showed the real artwork
// only occupied the middle ~45% of the canvas — 27.4% of the width
// was empty space sitting before the "K" even starts (Recraft AI
// appears to export onto a fixed oversized canvas, centering the mark
// within it, unlike a normal tight logo export). That invisible
// margin was silently eating into every layout that assumed the
// image's own bounding box WAS the visible logo (e.g. Footer.tsx's
// flex alignment against the tagline text below it) — a plain
// `getBoundingClientRect()` check against the `<img>` element itself
// couldn't catch this, since the box really was aligned; only the ink
// inside it wasn't. Fixed at the source: `kibo-logo-white.svg`'s own
// `viewBox` was tightened directly to the artwork's real bounding box
// (plus a small ~1% safety pad on every side, same idea as the PNG's
// own tight crop above), rather than compensating with a magic-number
// CSS offset here that would only be correct for this one file. New
// ratio, from the new tight `viewBox` (446.16×165.35, ≈2.70) —
// updated together with the file so the two never drift apart.
const LOGO_WHITE_ASPECT_RATIO = 446.16 / 165.35;

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
