"use client";

import { useTalkToKibo } from "@/components/TalkToKiboProvider";

// Persistent "Talk to KIBO" CTA — mobile half (28 Aug 2026).
// KIBO_Brand_and_Copy_Direction.md: "in addition to the persistent CTA
// (nav button on desktop, sticky bar on mobile, live on every page)" —
// this is the mobile half; the desktop half is the button in Nav.tsx.
// Mounted once in `(site)/layout.tsx` (not per-page) so it's present on
// every page site-wide, same as Nav/Footer. `sm:hidden` — desktop gets
// the nav button instead, not both.
//
// `fixed bottom-0`, full-width, opens the same shared modal every other
// "Talk to KIBO" trigger uses (see TalkToKiboProvider.tsx). The bottom
// padding respects the iOS home-indicator safe area (via CSS `env()`,
// see the className below) so the bar/button isn't flush against it.
// `(site)/layout.tsx` adds a matching mobile-only spacer right after
// `<Footer />` so this bar never overlaps the end of the page — see
// that file's own comment for why it has to go there specifically
// rather than at the top of `<main>`.
export function TalkToKiboStickyBar() {
  const { open } = useTalkToKibo();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-charcoal/10 bg-background/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur sm:hidden">
      <button
        type="button"
        onClick={open}
        // Padding matched to Nav's own CTA button, `px-4 py-2` (30 Aug
        // 2026, owner: button-size consistency pass) — was `px-5 py-3`.
        // `py-2` reads slightly slimmer full-width than it did as an
        // inline pill, but keeping one true standard everywhere is the
        // point of this pass, not a case-by-case size per context.
        className="w-full rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray"
      >
        Talk to KIBO
      </button>
    </div>
  );
}
