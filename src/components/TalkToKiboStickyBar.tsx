"use client";

import { usePathname } from "next/navigation";
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
// `(site)/layout.tsx`'s own matching mobile-only spacer, right after
// `<Footer />`, is now owned by this component too (see `hidden` below)
// so the two can never disagree about whether the bar is showing.
//
// Hidden on `/catalog` only, 31 Aug 2026 (owner, testing live mobile:
// "Download PDF... Download Catalog... Talk to KIBO, and then there is
// this universal Talk to KIBO line... too much redundancy... when we go
// to catalog we should remove that sticky Talk to KIBO") — the Catalog
// page already has its own "Download Catalog" + "Talk to KIBO" pair
// right above this bar (see CatalogCtaSection.tsx), so this global bar
// was a third, stacked CTA repeating the second. Every other page keeps
// it — this is a single-route exception, not a rule change to the
// "live on every page" brand-doc line above. The spacer (`h-20` in the
// old layout.tsx location) is skipped in lockstep with the bar itself,
// via the same `hidden` check, so Catalog doesn't end up with a dead
// gap at the bottom of the page where the bar would have been.
// `label` (1 Sep 2026, owner: "make everything editable") — the global
// "Get in touch" button label, now Sanity-editable.
export function TalkToKiboStickyBar({ label }: { label: string }) {
  const { open } = useTalkToKibo();
  const pathname = usePathname();
  const hidden = pathname === "/catalog";

  if (hidden) return null;

  return (
    <>
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
          {label}
        </button>
      </div>
      {/* Spacer moved in from `(site)/layout.tsx`, 31 Aug 2026 — see file
          comment above for why it needs to hide in lockstep with the bar
          rather than stay a separate, unconditional element there. */}
      <div className="h-20 sm:hidden" aria-hidden="true" />
    </>
  );
}
