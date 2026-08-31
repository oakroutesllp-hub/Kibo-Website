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

type LogoProps = {
  /** Rendered width in pixels; height is derived from the source aspect ratio. */
  width?: number;
  className?: string;
  priority?: boolean;
};

export function Logo({ width = 160, className, priority }: LogoProps) {
  const height = Math.round(width / LOGO_ASPECT_RATIO);

  return (
    <Image
      src="/brand/kibo-logo.png"
      alt="KIBO"
      width={width}
      height={height}
      className={className}
      priority={priority}
    />
  );
}
