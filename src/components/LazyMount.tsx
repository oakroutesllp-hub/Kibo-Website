"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

// Generic viewport-gated lazy-mount wrapper, 10 Sep 2026 (mobile
// performance pass) — extracted from LazyBackgroundVideo.tsx's own
// IntersectionObserver mechanism (see that component's own comment for
// the full original reasoning) so the same "don't pay for it until
// it's actually about to be seen" treatment can be reused anywhere a
// below-the-fold interactive widget has a cheap static placeholder to
// show in the meantime.
//
// Deliberately NOT used for Testimonials/TrustedBy/Certifications —
// unlike a decorative background video, those sections' real text and
// logo `alt` text are exactly what the site-wide alt-text pass (10 Sep
// 2026) was built to get indexed by Google, and a crawler doesn't
// reliably scroll to trigger an IntersectionObserver the way a real
// visitor does. Using a placeholder there would risk that content
// never actually reaching the initial HTML a crawler sees. This wrapper
// is scoped to MediaCarousel only (Our Story's 3 sections — see each
// section's own call site), where the placeholder shown in the
// meantime is a real, fully-formed `<Image>` (first carousel slide,
// same alt text it would've had anyway) — so nothing is missing from
// the page, only the extra interactive chrome (arrows/dots/auto-
// advance) mounts a moment later.
//
// `rootMargin: "600px 0px"` — same value as LazyBackgroundVideo, kept
// in sync deliberately: a visitor scrolling at a normal pace never
// sees the placeholder-to-real swap happen, since the real component is
// already mounted a full scroll's-worth before they'd actually notice.
export function LazyMount({
  children,
  placeholder,
  className,
}: {
  children: ReactNode;
  placeholder?: ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Same "can't verify IntersectionObserver actually fires in this
    // project's own testing sandbox" defensive fallback documented in
    // LazyBackgroundVideo.tsx's own comment — real browsers support
    // this reliably; this only guards against the observer somehow
    // never firing, not a sign the primary mechanism is in doubt.
    const fallback = setTimeout(() => setShouldRender(true), 3000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          clearTimeout(fallback);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(el);

    return () => {
      clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? children : placeholder}
    </div>
  );
}
