"use client";

import { useTalkToKibo } from "@/components/TalkToKiboProvider";
import { CTA_NUDGE_SUPPORTING_LINE, CTA_NUDGE_BUTTON_LABEL } from "@/lib/ctaNudge";

// Secondary "Talk to KIBO" CTA nudge — KIBO_Brand_and_Copy_Direction.md,
// "Secondary CTA nudge — build spec, 27 Aug 2026." Sits directly after
// Built for the Long Run on `/products` (the fourth/final built
// section) — currently the actual end of the page's built content since
// Our Story doesn't exist yet, but positioned so it stays correctly
// between Built for the Long Run and Our Story once that page is built.
// Deliberately NOT a full-bleed/edge-to-edge "final answer" block —
// generous vertical padding on both sides so the page still reads as
// continuing past it, not stopping.
//
// `py-20 sm:py-28` (28 Aug 2026, fixed) — this section originally used
// `py-16`, the one section on the page whose vertical rhythm didn't
// match every other section's (`py-20 sm:py-28`, e.g. CustomSection,
// SupplySection, LongRunSection). Not obvious in isolation, but once
// Home became one continuous page stacking every section together
// (see `(site)/page.tsx`), the mismatch became a real, measurable
// inconsistency in the padding between sections — the kind of thing
// that reads as "not tight and thought out" scrolling through the full
// page, per owner feedback. Matched to the site-wide standard.
//
// A nudge, not a gate: plain in-flow content, no overlay/scrim, no
// scroll-lock, nothing blocking — it just opens the shared
// `TalkToKiboModal` (see TalkToKiboProvider.tsx) on tap, same as any
// other future "Talk to KIBO" trigger on the site.
//
// Bottom padding trimmed (29 Aug 2026, owner: "reduce the gap between
// talk to kibo and we are listening section") — same root cause as the
// Custom→Supply seam fixed earlier: this section's own `py-28` (112px)
// bottom padding was stacking with We Started by Listening's own `py-28`
// top padding directly below it on Home's continuous scroll, so the
// visible gap between the button and the video was 224px, double either
// section's own intended rhythm. Only the bottom was reduced at the
// time (`pb-10 sm:pb-14`, roughly half) — the top was deliberately left
// at the standard rhythm, reasoning it governed the boundary with Built
// for the Long Run above and wasn't the seam being fixed.
//
// Top padding also trimmed, same mechanism (30 Aug 2026, owner, on a
// screenshot showing a large blank stretch above this section's text:
// "reduce white space") — that "leave the top alone" call above didn't
// hold up: Long Run's own `pb-28` tint padding plus this section's
// `pt-28` white padding read as one continuous ~224px blank stretch
// (the tint is only `sage-green/10`, faint enough that the seam between
// the two isn't visually obvious), the identical doubling problem as
// the bottom seam. `pt-20 sm:pt-28` → `pt-10 sm:pt-14`, the same halving
// already applied to `pb-`.
//
// Final pick (28 Aug 2026), from 3 live-rendered review variants —
// see PROJECT-SUMMARY.md for what the other two looked like: owner
// chose Variant A's layout/copy (centered, generous padding) but
// explicitly dropped its sage-green tint band — Built for the Long Run
// directly above already carries one, and stacking two tinted bands
// back to back read as repetitive ("too bandy bandy"). Plain
// `bg-background` here instead, same as Custom/Supply.
//
// **Reversed, 30 Aug 2026** (owner, on a screenshot: "extend the green
// gray sage transparent band until under Talk to KIBO, so Our story
// reads as a separate new section") — a deliberate reversal of the 28
// Aug call above, not a silent drift back from it: on Home's continuous
// scroll, this section sits directly between Long Run (tinted) and We
// Started by Listening (plain white, the start of `/our-story`'s
// content) — the goal now is making that white section clearly read as
// a new chapter starting, which means the tint needs to run all the way
// through this nudge first rather than stopping short of it. `bg-
// background` → `bg-sage-green/10`, same token Long Run already uses,
// so the two sections' bands are visually one continuous field, not two
// separately-tinted blocks that happen to match.
export function CTANudgeSection() {
  const { open } = useTalkToKibo();

  return (
    // Mobile-only patch treatment, 31 Aug 2026 (owner, testing live on
    // /products' Long Run → this section: "it almost reads like a third
    // pointer under Built for the Long Run... can we remove the last
    // horizontal line... but use that vertical line to create a patch
    // that is maybe slightly less transparent than the sage green grey,
    // so it looks like a separate patch" — explicitly mobile-only: "I
    // don't think it will look good on desktop") — this section shares
    // Long Run's exact `bg-sage-green/10` tint AND the exact same dash
    // device Long Run uses between its own two paragraphs (see file
    // comment below), so on a continuous mobile scroll the two read as
    // one uninterrupted list rather than two distinct sections. Below
    // `sm`: a visibly darker tint (`bg-sage-green/20`, double Long Run's
    // /10) makes this its own shaded patch instead of a same-toned
    // continuation. `sm:bg-sage-green/10` restores the original shared
    // tint at tablet/desktop — unchanged there, per the owner's own
    // caveat above.
    <section className="w-full bg-sage-green/20 sm:bg-sage-green/10">
      {/* Bottom reverted, same day, after live review (owner: "give me
          more gap between talk to keyboard button and our story...
          keep it the same as the six thumbnails bottom line and you
          build your market" — i.e. Custom→Supply's own reverted value)
          — `pb-7 sm:pb-[2.45rem]` (28px/39.2px), matching that seam.
          Top (pairing with Long Run above) stays at the exact-match
          `pt-4 sm:pt-5` — not flagged here. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-5 px-6 pt-4 pb-7 text-center sm:px-10 sm:pt-5 sm:pb-[2.45rem]">
        {/* Dash accent added, 30 Aug 2026 (owner, on a screenshot of the
            merged sage-green band with Long Run above: "[these] need to
            look like separate things, however the gap seems larger —
            use an accent or something to make it separate, but not with
            so much gap") — same short dash device used everywhere else
            on the site to mark a new headline/statement (Our Story,
            Tiruppur, Supply, Long Run's own paragraph breaks), reused
            here as the "this is its own statement" cue so the seam can
            rely on a real visual marker instead of pure whitespace once
            Long Run's own bottom padding was trimmed (see that file's
            own comment).

            **Hidden on mobile, 31 Aug 2026** — this exact dash style is
            also what LongRunSection.tsx uses between ITS OWN two
            paragraphs, right above this one on the page; on mobile the
            new shaded-patch background (see this section's own comment
            above) is the "this is separate" cue instead, so keeping
            this dash too read as an actual 4th list item continuing
            Long Run's own two. `sm:block` keeps it exactly as it was at
            tablet/desktop, where the owner did not ask for a change. */}
        <span aria-hidden="true" className="hidden h-px w-12 bg-sage-green/50 sm:block" />
        {/* `text-body`/`text-support` (30 Aug 2026, owner: "no other font
            sizes floating around" — every size must come from the 8
            named tokens) replacing raw `text-lg`/`text-sm`. */}
        <p className="max-w-md text-body text-charcoal/80">{CTA_NUDGE_SUPPORTING_LINE}</p>
        <button
          type="button"
          onClick={open}
          // Padding matched to Nav's own CTA button, `px-4 py-2` (30 Aug
          // 2026, owner: "the talk to KIBO button under have a
          // requirement in mind... is larger than the talk to KIBO
          // button on the top sticky bar... make it consistent") — was
          // `px-6 py-3`.
          className="rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray"
        >
          {CTA_NUDGE_BUTTON_LABEL}
        </button>
      </div>
    </section>
  );
}
