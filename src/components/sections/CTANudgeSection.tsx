"use client";

import { useTalkToKibo } from "@/components/TalkToKiboProvider";
import type { CtaNudgeCopyContent } from "@/lib/content";

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
// `copy` (1 Sep 2026, owner: "make everything editable") — reverses
// lib/ctaNudge.ts's own "fixed, code-level" call.
//
// `testimonialsVisible` prop, added then removed same day (3 Sep
// 2026) — first pass made this section's background conditional
// (white when Testimonials is hidden, matching Long Run). **Reversed
// on the very next round** (owner: "when the testimonials aren't
// showing... built for the long run along with have a requirement in
// mind... stays that sage green background") — the owner's actual
// preference is the opposite of that first pass: this section stays
// tinted in BOTH states, and it's Long Run/Supply that swap which one
// carries the tint instead (see LongRunSection.tsx's and
// SupplySection.tsx's own matching comments for that mechanism). With
// this section's own tint now constant either way, it no longer needs
// to know whether Testimonials is showing at all — back to a plain,
// unconditional background, same as its very first version.
export function CTANudgeSection({
  copy,
  testimonialsVisible,
}: {
  copy: CtaNudgeCopyContent;
  testimonialsVisible: boolean;
}) {
  const { open } = useTalkToKibo();

  return (
    // Mobile-only darker patch treatment, 31 Aug 2026 (owner, testing
    // live on /products' Long Run → this section: "it almost reads like
    // a third pointer under Built for the Long Run... can we remove the
    // last horizontal line... but use that vertical line to create a
    // patch that is maybe slightly less transparent than the sage green
    // grey, so it looks like a separate patch" — explicitly mobile-
    // only: "I don't think it will look good on desktop") — built when
    // this section always sat directly under a same-toned Long Run on
    // mobile, needing its own visual "this is separate" cue.
    //
    // **Removed, 3 Sep 2026** (owner, on mobile: "there is a darker
    // band where we are saying 'have a requirement in mind, get in
    // touch'... I think we can just match it with the built for the
    // long run lighter band. We don't need a darker band there") — now
    // that Long Run and this section deliberately form ONE continuous
    // tinted band together whenever Testimonials is hidden (see
    // LongRunSection.tsx's own comment on that swap), the darker patch
    // this section used to need reads as a mismatched seam INSIDE that
    // one intended band, not a helpful separator — the exact opposite
    // of what it was built for. `bg-sage-green/20 sm:bg-sage-green/10`
    // → flat `bg-sage-green/10` at every breakpoint, the same token
    // Long Run and Supply already use, so mobile now matches
    // desktop/tablet instead of carrying its own darker shade.
    //
    // **Tint removed entirely, 10 Sep 2026** (owner, live screenshot,
    // Testimonials now visible above this section: "that green band
    // is looking like too flimsy a strip so that needs to go as
    // well") — this section's own tint was ALWAYS built on the premise
    // that it merges with a same-toned neighbor right above it (Long
    // Run when Testimonials is hidden, Testimonials itself when
    // visible — see this comment's own history above); now that
    // Testimonials went back to plain white the same day (see
    // TestimonialsSection.tsx's own comment), this section has no
    // same-toned neighbor left in EITHER state — Supply/Long Run's own
    // merged green band ends well above it now. A short, isolated
    // tinted strip with nothing to blend into is exactly the "flimsy"
    // read the owner flagged, so it goes back to plain white,
    // unconditionally, matching Testimonials right above it.
    <section className="w-full bg-background">
      {/* Bottom reverted, same day, after live review (owner: "give me
          more gap between talk to keyboard button and our story...
          keep it the same as the six thumbnails bottom line and you
          build your market" — i.e. Custom→Supply's own reverted value)
          — `pb-7 sm:pb-[2.45rem]` (28px/39.2px), matching that seam.
          Top (pairing with Long Run above) stays at the exact-match
          `pt-4 sm:pt-5` — not flagged here.

          **`pb-7 sm:pb-[2.45rem]` → `pb-16 sm:pb-[5.6rem]`, 1 Sep 2026**
          (owner: "padding above 'Built for the long run' [and] below
          'Get in touch' — take a call, make it symmetrical") — Long Run
          and this section share one continuous sage-tinted band (see
          LongRunSection.tsx's own comment), so the whitespace at the
          band's very top (above its headline, `pt-16 sm:pt-[5.6rem]` =
          64px/89.6px) and very bottom (below this section's own button)
          read as one shape, not two independent seams — 28px/39.2px at
          the bottom against 64px/89.6px at the top was visibly
          lopsided. Matched the bottom UP to the top's value rather than
          cutting the top down, since that top value was itself a
          deliberate "give the band presence" choice (see Long Run's own
          `py-20 sm:py-28` → trimmed → this comment's history) — worth
          preserving rather than undoing for the sake of symmetry. */}
      {/* `pb-16 sm:pb-[5.6rem]` (64px/89.6px) → `pb-[62px] sm:pb-[87px]`,
          10 Sep 2026 (owner: "increase the gap between get in touch
          and our story... one point three, one point four x... place
          the horizontal band right in the center") — measured the
          real total gap first (button-bottom → Our Story's heading
          top): 92px mobile, 129px desktop. Target 1.35x (picked the
          midpoint of the owner's own 1.3–1.4x range): 124px/174px.
          Centering the new divider (below) means each half needs to
          land on 62px/87px — this section's own existing bottom
          padding was ALREADY almost exactly that (64/89.6 vs the
          62/87 target, a ~2px difference), so trimmed down to the
          exact value rather than adding a separate spacer on top of
          an untouched one. Conditional on `testimonialsVisible` (new
          prop, see this function's own signature) — same reasoning as
          Supply/Long Run's own new divider (see SupplySection.tsx):
          only relevant while this section and Our Story are both
          plain white with nothing marking the seam, which is only
          true when Testimonials is visible (Our Story's own top
          padding never changes either way, so nothing here needs a
          separate "off" case to maintain). */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-5 px-6 pt-4 pb-[62px] text-center sm:px-10 sm:pt-5 sm:pb-[87px]">
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

            **Hidden on mobile, then removed outright, 31 Aug 2026** —
            first hidden below `sm` (this exact dash style is also what
            LongRunSection.tsx uses between ITS OWN two paragraphs, right
            above this one on the page, so on mobile it read as an actual
            4th list item continuing Long Run's own two; the new shaded-
            patch background became mobile's own "this is separate" cue
            instead). Brainstormed with the owner on the desktop half of
            the same complaint ("that horizontal line... looks like it's
            part of Built for the Long Run, it does not seem right") —
            removed here too rather than kept "unless mobile said
            otherwise": the dash is what was creating the echo with Long
            Run's own paragraph dashes in the first place, at every
            breakpoint, not just below `sm`; plain whitespace is how
            every other section-to-section transition on this page
            already reads (Custom→Supply, Supply→Long Run) with no
            comparable accent line. */}
        {/* `text-body`/`text-support` (30 Aug 2026, owner: "no other font
            sizes floating around" — every size must come from the 8
            named tokens) replacing raw `text-lg`/`text-sm`.

            `copy.line2` dropped from display, 3 Sep 2026 (owner, on a
            screenshot: "we are saying 'have a requirement, get in
            touch,' and then showing another 'get in touch' button — I
            think we just need to say 'have a requirement'... remove
            the get in touch next to it and just have that button
            below") — `line2` was literally the button's own label
            repeated as a second line of text right above the button
            itself, real redundancy once flagged, not a design nitpick.
            The forced-2-line mobile break this replaced (line1/line2
            each their own line below `sm`, joined into one sentence at
            `sm`+) no longer applies with only one line of text — a
            single centered line reads correctly at every breakpoint on
            its own, no responsive split needed.
            `copy.line2`/`ctaNudgeCopyType.ts`'s "Line 2" field is left
            in place (still Sanity-editable, still fetched) rather than
            removed outright — simplest, least destructive fix; a
            future session can drop the field itself if an editor
            confirms it's genuinely never needed again. */}
        <p className="max-w-md text-center text-body text-charcoal/80">{copy.line1}</p>
        <button
          type="button"
          onClick={open}
          // Padding matched to Nav's own CTA button, `px-4 py-2` (30 Aug
          // 2026, owner: "the talk to KIBO button under have a
          // requirement in mind... is larger than the talk to KIBO
          // button on the top sticky bar... make it consistent") — was
          // `px-6 py-3`.
          className="rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray-deep active:bg-green-gray-deep"
        >
          {copy.buttonLabel}
        </button>
      </div>
      {/* Divider between this section and Our Story, 10 Sep 2026 —
          same width/inset as the other three dividers built the same
          day (TrustedBySection.tsx, SupplySection.tsx — see either
          for the shared `mx-[127px] sm:mx-[279px]` value's own math),
          reused verbatim rather than picking a new one. Sits at the
          exact center of the enlarged button→heading gap (this
          section's own trimmed `pb` above gets it to the first half;
          the spacer right below completes the second half, landing on
          Our Story's own EXISTING top padding unchanged — see this
          file's own comment on the `pb` change for the full numbers).
          Conditional on `testimonialsVisible`, same as the trimmed
          `pb` above — both are one decision, kept together. */}
      {testimonialsVisible && (
        <>
          <div className="mx-[127px] h-px bg-charcoal/10 sm:mx-[279px]" />
          {/* Completes the second half of the centered gap: target
              62px/87px (mobile/desktop) minus Our Story's own existing
              top padding (28px/39.2px, WeStartedByListeningSection.tsx
              — deliberately left untouched since that component is
              also used standalone on `/our-story`, where this whole
              concept doesn't apply) = 34px/48px. */}
          <div className="h-[34px] sm:h-[48px]" aria-hidden="true" />
        </>
      )}
    </section>
  );
}
