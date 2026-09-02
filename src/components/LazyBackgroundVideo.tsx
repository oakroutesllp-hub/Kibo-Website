"use client";

import { useEffect, useRef, useState } from "react";

// Lazy-mounted ambient background video, 2 Sep 2026 (owner, on a
// Lighthouse "B" grade with every media slot still on placeholder
// images: "once the videos are in place, it will become even slower...
// my worry is [load times] will be more, and it will result in
// drop-offs"). Extracted into its own small Client Component so the
// section it lives in (TiruppurStorySection.tsx) can stay a plain
// Server Component — only this one interactive piece needs the
// IntersectionObserver/state below.
//
// The problem this fixes: a plain `<video autoPlay muted loop src=...>`
// starts fetching real video bytes the moment it's parsed into the DOM,
// regardless of scroll position — browsers don't defer autoplay-video
// network activity for off-screen elements the way they do for
// `<img loading="lazy">`. Tiruppur is the 2nd of 3 "Our Story" sections
// (8th of 9 on Home) — today this costs nothing since no real video is
// uploaded yet (falls back to a static photo), but the moment a real
// file lands in Sanity, every single page load would start downloading
// it immediately, even for a visitor who never scrolls that far.
//
// Fix: don't render the `<video>` element itself — and therefore don't
// give the browser anything to fetch — until this section is actually
// approaching the viewport. `rootMargin: "600px"` starts the fetch a
// good scroll's-worth before the section is visible, so playback is
// already underway (not a blank flash) by the time a visitor actually
// scrolls to it; a visitor who never gets there never downloads a
// single byte of it. The poster image renders immediately in the
// interim — same static-photo look as the current no-video fallback,
// so there's no visible change until a video actually exists.
export function LazyBackgroundVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Same "can't verify IntersectionObserver actually fires in this
    // project's own testing sandbox" caveat documented elsewhere in
    // this codebase (see ProductsGridSection.tsx's own comment) — real
    // browsers support this reliably; this is a defensive fallback,
    // not a sign the primary mechanism is in doubt. If the observer
    // never fires for any reason, load the video after a short delay
    // instead of leaving it permanently stuck on the poster frame.
    const fallback = setTimeout(() => setShouldLoad(true), 3000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
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
      {shouldLoad ? (
        <video src={src} poster={poster} autoPlay muted loop playsInline className="h-full w-full object-cover" />
      ) : (
        // Poster shown as a plain background-image div while waiting to
        // intersect — same visual result as the video's own `poster`
        // attribute would show once mounted, so there's no flash/swap
        // visible to a visitor who scrolls straight past the 600px
        // pre-load margin before the video finishes loading.
        <div
          aria-hidden="true"
          className="h-full w-full bg-cover bg-center"
          style={poster ? { backgroundImage: `url(${poster})` } : undefined}
        />
      )}
    </div>
  );
}
