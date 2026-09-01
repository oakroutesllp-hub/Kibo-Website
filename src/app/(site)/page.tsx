import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ProductsGridSection } from "@/components/sections/ProductsGridSection";
import { CustomSection } from "@/components/sections/CustomSection";
import { SupplySection } from "@/components/sections/SupplySection";
import { LongRunSection } from "@/components/sections/LongRunSection";
import { CTANudgeSection } from "@/components/sections/CTANudgeSection";
import { WeStartedByListeningSection } from "@/components/sections/WeStartedByListeningSection";
import { TiruppurStorySection } from "@/components/sections/TiruppurStorySection";
import { FounderSection } from "@/components/sections/FounderSection";
import {
  getHomepage,
  getOurStory,
  getProductCategories,
  getCustomSectionMedia,
  getCustomSectionCopy,
  getSupplySectionCopy,
  getLongRunSectionCopy,
  getCtaNudgeCopy,
  getOurStoryCopy,
  getSiteSettings,
} from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const homepage = await getHomepage();
  return {
    title: homepage.seo.metaTitle || "KIBO",
    description: homepage.seo.metaDescription,
  };
}

// Home — one continuous page, 28 Aug 2026 architecture change,
// superseding the earlier scroll-triggered-route-change design
// (`HomeProductsHandoff.tsx` / `ProductsOurStoryHandoff.tsx`, both
// deleted as part of this change). Owner-initiated: the original
// design carried you forward into a real new route as you scrolled
// (URL genuinely changing mid-scroll, per the original "Scroll-
// triggered transitions" spec), but scrolling back UP from Our Story
// had nowhere to go — you'd already left Products' page entirely, so
// there was nothing above Our Story's own top to reveal. A mirrored
// auto-reverse-on-scroll-up was considered and rejected (same reasoning
// ProductsGridSection.tsx's `showBackToHome` comment already
// documented for the Products↔Home case: iOS rubber-band bounce at the
// top of a page is a constant, unintentional gesture — auto-navigating
// on it would fire false-positives on ordinary re-reading, not just
// deliberate "take me back" intent).
//
// Resolved by removing the route-change-mid-scroll altogether: Home now
// renders every section directly, in one real document — Hero →
// Products grid → Custom → Supply → Built for the Long Run → CTA nudge
// → We Started by Listening. Scrolling up and down anywhere in it is
// completely native, zero special code, because it's genuinely one
// page (matches how Apple's own fluid product pages work — no hidden
// route change during scroll, the "transition" IS the page).
//
// `/products` and `/our-story` remain separate, independently
// shareable/indexable real pages, reachable via the nav — this part of
// the original spec's reasoning (Our Story pieces individually
// shareable/SEO-indexable) is preserved. What's given up: the URL no
// longer updates automatically as a visitor scrolls through Home — it
// only changes when they click. Owner explicitly confirmed this
// trade-off (28 Aug 2026): the shareability goal is fully met by the
// separate pages existing and being reachable by click regardless of
// whether the address bar also updates during passive scrolling.
//
// Every section below is the SAME component `/products` and
// `/our-story` render — not a copy. This is deliberate and load-bearing
// for a rule the owner asked for explicitly: editing Custom, Supply,
// Built for the Long Run, the CTA nudge, or We Started by Listening
// only ever means editing that one section's own file — Home picks up
// the change automatically because it imports and renders the literal
// same component, not a duplicate. `ProductsGridSection` is the
// existing precedent this pattern already followed (reused between
// Home and `/products` since 26 Aug 2026, before this change existed)
// — this just extends the same rule to every other section.
export default async function Home() {
  const homepage = await getHomepage();
  // `getOurStory()` fetched here too, 30 Aug 2026 — these 3 sections'
  // media is now Sanity-editable and needs to match whatever
  // `/our-story` itself shows, since both pages render the literal same
  // components (see this file's own comment above on why that sharing
  // matters).
  const ourStory = await getOurStory();
  // `getProductCategories()`/`getCustomSectionMedia()`, 31 Aug 2026 —
  // both became Sanity-editable the same day (owner: "product cards
  // need to be editable... all the images... need to be editable").
  // Fetched here (not inside ProductsGridSection/CustomSection
  // themselves) because both of those stay Client Components — same
  // fetch-in-the-parent-then-prop-drill pattern as Hero/OurStory above.
  const productCategories = await getProductCategories();
  const customSectionMedia = await getCustomSectionMedia();
  // Copy fetches (1 Sep 2026, owner: "make everything editable") — same
  // fetch-in-the-parent-then-prop-drill pattern as every media fetch
  // above; `ourStoryCopy` covers Listening/Tiruppur/Founder together,
  // same scope as `ourStory` (media) above.
  const customSectionCopy = await getCustomSectionCopy();
  const supplySectionCopy = await getSupplySectionCopy();
  const longRunSectionCopy = await getLongRunSectionCopy();
  const ctaNudgeCopy = await getCtaNudgeCopy();
  const ourStoryCopy = await getOurStoryCopy();
  const settings = await getSiteSettings();
  return (
    <>
      <Hero content={homepage} />
      <ProductsGridSection
        headingLevel="h2"
        categories={productCategories}
        getInTouchLabel={settings.getInTouchLabel}
      />
      <CustomSection media={customSectionMedia} copy={customSectionCopy} />
      <SupplySection copy={supplySectionCopy} />
      <LongRunSection copy={longRunSectionCopy} />
      <CTANudgeSection copy={ctaNudgeCopy} />
      <WeStartedByListeningSection media={ourStory.listeningMedia} copy={ourStoryCopy} />
      <TiruppurStorySection media={ourStory.tiruppurMedia} copy={ourStoryCopy} />
      <FounderSection media={ourStory.founderMedia} copy={ourStoryCopy} />
    </>
  );
}
