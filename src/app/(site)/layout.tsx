import type { ReactNode } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { TalkToKiboProvider } from "@/components/TalkToKiboProvider";
import { TalkToKiboStickyBar } from "@/components/TalkToKiboStickyBar";
import { DownloadCatalogProvider } from "@/components/DownloadCatalogProvider";
import { getSiteSettings } from "@/lib/content";
import { isSanityConfigured } from "@/sanity/client";

// Wraps every public-facing page (Home, Products, Articles, style guide)
// with the site-wide Nav/Footer — but not /studio, which is deliberately
// outside this route group (Phase 2 boundary, not Phase 1, see
// PROJECT-SUMMARY.md): Sanity's embedded Studio needs full-viewport
// control and would break with site chrome wrapped around it. Site
// Settings is fetched once here and passed down to Footer.
//
// No floating WhatsApp button here (removed 25 Aug 2026,
// KIBO_Brand_and_Copy_Direction.md — settled decision, not open for
// reconsideration) — superseded by the persistent "Talk to KIBO" CTA.
// The phone/WhatsApp number itself stays visible in the footer's
// Contact column regardless.
//
// `TalkToKiboProvider` wraps the whole site here (27 Aug 2026) so the
// enquiry modal it owns is reachable via `useTalkToKibo()` from any
// page — built as part of the Products page's secondary CTA nudge,
// deliberately mounted at this shared layout level (not locally inside
// the nudge) so every other trigger reuses this exact instance.
//
// `DownloadCatalogProvider` added 30 Aug 2026, same pattern, for the new
// Catalog page's own modal — wraps OUTSIDE `TalkToKiboProvider`
// specifically because TalkToKiboModal's own thank-you state calls
// `useDownloadCatalog()` (the "download the catalog" cross-offer), so
// that context has to be an ancestor of wherever TalkToKiboModal
// renders, not a sibling or child of it.
//
// Persistent CTA, both halves now built (28 Aug 2026, while building
// `/our-story`): the desktop half is a button inside `Nav.tsx`; the
// mobile half is `TalkToKiboStickyBar` below — mounted once here so
// it's on every page, not per-page. That component also owns its own
// mobile-only spacer (moved in 31 Aug 2026, see its own file comment)
// so the two can't disagree about whether the bar — and therefore the
// space it needs reserved at the bottom of the page — is showing on a
// given route; layout.tsx itself no longer renders a separate spacer.
//
// `OverscrollBackGuard` removed here (27 Aug 2026) — it was mounted to
// stop a phone's native "pull down at the top = go back" gesture, but a
// threshold tweak the same day failed to fix the actual reported bug
// (gallery-arrow and card-flip taps not registering on a real phone) and
// there's no way to test real touch-event behavior from this environment
// to keep iterating blind on it — every fix attempt here is a guess
// dispatched as a synthetic `.click()` in a browser tool, which never
// exercises the real touch pipeline this component hooks into. Rather
// than risk a third guess breaking core interactions again, removed the
// JS interceptor entirely. `overscroll-behavior-y: contain` (globals.css)
// stays as the original, lower-risk CSS-only attempt at the same
// problem — it can't block clicks since it's declarative, not a JS event
// handler, even though it didn't fully resolve the original issue either.
export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <DownloadCatalogProvider requireGate={settings.requireCatalogGate}>
      <TalkToKiboProvider>
        {/* Dev-only diagnostic banner, deliberately left off the type scale
            (30 Aug 2026, owner: "no other font sizes floating around") —
            same reasoning as `style-guide/page.tsx`: this only ever
            renders when Sanity isn't configured, i.e. never in front of a
            real visitor on a properly configured deployment, so it's
            tooling rather than site content. */}
        {!isSanityConfigured && (
          <p className="fixed bottom-3 left-3 z-50 rounded-full bg-charcoal px-3 py-1.5 text-xs text-background shadow-lg">
            Sanity not connected — showing sample content
          </p>
        )}
        <Nav showBlogInNav={settings.showBlogInNav} />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer settings={settings} />
        <TalkToKiboStickyBar />
      </TalkToKiboProvider>
    </DownloadCatalogProvider>
  );
}
