import type { Metadata } from "next";
import { WeStartedByListeningSection } from "@/components/sections/WeStartedByListeningSection";
import { TiruppurStorySection } from "@/components/sections/TiruppurStorySection";
import { FounderSection } from "@/components/sections/FounderSection";
import { getOurStory, getOurStoryCopy } from "@/lib/content";

// `description` added (30 Aug 2026, same pass as products/page.tsx's
// own — part of the canonical-URL/duplicate-content discussion) — had
// no meta description before.
export const metadata: Metadata = {
  title: "Our Story — KIBO",
  description:
    "How KIBO connects India's apparel manufacturing expertise with growing markets in Africa.",
};

// Our Story (`/our-story`) — new route, created 28 Aug 2026. Per
// KIBO_Brand_and_Copy_Direction.md's "Site architecture," the full
// target order is We Started by Listening → The Tiruppur Story → The
// Person Behind KIBO → Final Enquiry, one continuous scroll, each with
// its own anchor (`#listening` / `#tiruppur` / `#founder` / `#enquiry`).
// First three pieces are locked/built so far — only Final Enquiry
// remains undrafted; add it here in the same order once its own mockup
// and copy are locked.
//
// Lives inside the `(site)` route group like every other public page,
// so it automatically gets the shared Nav/Footer/TalkToKiboProvider
// (and, as of this same build, the persistent "Talk to KIBO" CTA — nav
// button desktop, sticky bar mobile) from `(site)/layout.tsx` — no
// per-page wiring needed for any of that.
export default async function OurStoryPage() {
  // Media for these 3 sections is Sanity-editable as of 30 Aug 2026 —
  // see OurStoryContent in lib/content/types.ts. Made this an async
  // Server Component to fetch it, same pattern `(site)/page.tsx` already
  // uses for `getHomepage()`.
  const ourStory = await getOurStory();
  const ourStoryCopy = await getOurStoryCopy();
  return (
    <>
      {/* `showBackToHome`, 31 Aug 2026 — see that component's own prop
          comment. This is the one caller that wants it (a real, separate
          destination); `(site)/page.tsx`'s own Home usage doesn't pass
          it. */}
      <WeStartedByListeningSection media={ourStory.listeningMedia} copy={ourStoryCopy} showBackToHome />
      <TiruppurStorySection media={ourStory.tiruppurMedia} copy={ourStoryCopy} />
      <FounderSection media={ourStory.founderMedia} copy={ourStoryCopy} />
    </>
  );
}
