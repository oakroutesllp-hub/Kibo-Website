import {
  LONG_RUN_PARAGRAPH_1_LINE_1,
  LONG_RUN_PARAGRAPH_1_LINE_2,
  LONG_RUN_PARAGRAPH_2_LINE_1,
  LONG_RUN_PARAGRAPH_2_LINE_2,
  LONG_RUN_HEADLINE_PLAIN,
  LONG_RUN_HEADLINE_ACCENT,
} from "@/lib/longRunSection";

// "Built for the Long Run" — KIBO_Brand_and_Copy_Direction.md, "Built
// for the Long Run — page anatomy" (LOCKED 27 Aug 2026). Fourth and
// final section on `/products`, directly below SupplySection. Built
// against the owner-shared reference screenshot ("Built for the long
// run.png") — layout/type-scale target only, same rule already
// established for Custom and Supply: no new fonts or colors, existing
// brand palette (sage green / charcoal / background) throughout.
//
// Simpler anatomy than Custom or Supply — no icons, no step tracker,
// just a two-column split with a vertical rule. Mirrors Supply's split
// but flipped left/right: Supply put the headline left and the content
// list right; here the two body paragraphs are LEFT and the big
// headline is RIGHT. Implemented the same way as Supply's rule
// (`lg:border-l` on the right column, disappears on the mobile stack)
// but sage-green here per the mockup, not charcoal like Supply's —
// the one deliberate visual variation between the two sections'
// otherwise-identical split mechanism.
//
// Headline sized to match Supply's headline exactly (27 Aug 2026, owner
// feedback: "should be same as 'You build your market'... they are at
// the same level") — `text-4xl font-bold leading-[1.1] tracking-tight
// sm:text-5xl`, identical classes to SupplySection.tsx's `<h2>`, not
// just a visually-similar size. The mockup's own headline reads larger
// than that in isolation, but the owner's actual ask is parity with the
// section above it, which wins over matching the mockup's proportions
// verbatim.
//
// `uppercase` dropped (29 Aug 2026, owner: "Built for / the long run —
// B captial rest small") — the underlying copy in longRunSection.ts was
// already typed as "Built for" / "the long run" (only the leading
// letter capitalized); `uppercase` was overriding that authored casing
// with all-caps. Same fix, same request, as SupplySection.tsx's
// headline right below in this conversation.
//
// Light sage-green section background (27 Aug 2026, owner request: "to
// mark it as a separate section... black on very light green grey or
// sage green so it separates this section from the previous one") —
// `bg-sage-green/10` (a tint of the existing brand sage-green token, not
// a new color) against the plain `bg-background` every other Products-
// page section uses, so this one visually closes the page as a distinct
// final beat rather than blending into Supply above it. Text stays
// plain charcoal/black, as asked ("black on... sage green"), not
// inverted to a light color.
//
// No numbered eyebrow — see longRunSection.ts's comment for why (the
// mockup shows none, and this is now consistent with Custom/Supply,
// both of which had theirs removed after the brand doc was written).
//
// Left column mirrored toward the centre rule (29 Aug 2026, owner:
// "Bring this closer to the central vertical line - spill over in 2
// lines each, split text at a reasonable point") — same mechanism as
// SupplySection.tsx's left column: `lg:items-end` right-hugs the column
// against the rule, `lg:pr-16` → `lg:pr-8` (32px) shortens the gap to
// it. Each paragraph is now a fixed 2-line break (see longRunSection.ts)
// rather than one flowing sentence, both because a forced break reads
// better right-aligned against a rule than a ragged natural wrap, and
// because the owner asked for exactly 2 lines each.
//
// **Restructured 30 Aug 2026** (owner, on a screenshot: "increase the
// height of this sage green grey band... 'Built for the long run' will
// be horizontal, first line, then 'for importers...' second line, and
// 'reliable supply...' third line, with horizontal dividers, use the
// accent horizontal lines as you see aesthetically fit") — replaces the
// two-column split (paragraphs left / headline right / vertical rule)
// entirely with one centered, stacked column: headline on top as a
// single horizontal line (no longer split "Built for" / "the long run"
// across two stacked spans — see LONG_RUN_HEADLINE in longRunSection.ts),
// then each paragraph below it in turn, separated by short centered dash
// accents rather than the old vertical rule — the same dash-under-
// headline device Custom/Supply/Tiruppur's own headlines already use
// elsewhere on the site, reused here as the "accent horizontal lines"
// the owner asked to place "as aesthetically fit."
//
// **Forced 2-line breaks reinstated, same day** (owner, on a screenshot
// of this new centered layout: "spill each sentence in two lines, take
// a judgment call on where to split") — each paragraph had briefly been
// left to wrap naturally once the vertical-rule layout (and its own
// reason for forcing 2 lines) was removed, but the owner wants the
// 2-line break back regardless of layout. Reused the exact same split
// points from `LONG_RUN_PARAGRAPH_1_LINE_1`/`_2` etc. in
// longRunSection.ts (see that file's own comment) rather than picking
// new ones — they're still the most balanced clause break in each
// sentence.
export function LongRunSection() {
  return (
    <section className="w-full bg-sage-green/10">
      {/* Band height increased, same pass (owner: "increase the
          height... a little wider height wise... nice presence to it")
          — `py-10 sm:py-14` (40px/56px) → `py-20 sm:py-28` (80px/112px),
          doubled. This section's own history already went through
          exactly this shrink-then-restore cycle once (see the removed
          comment this replaces) precisely because a squished band lost
          its "presence" — doubling past the previous "restored" value
          answers the same complaint more decisively rather than
          re-landing on a value already found wanting once.

          **Trimmed back slightly, 30 Aug 2026** (owner, on a screenshot:
          "slightly reduce padding on top and bottom") — `py-20 sm:py-28`
          (80px/112px) → `py-16 sm:py-[5.6rem]` (64px/89.6px), a ~20%
          cut, not a full revert to the pre-doubling value (still has
          more "presence" than the original `py-10 sm:py-14`, just not
          quite as much as the doubled version).

          **Bottom split off and reduced further, same day** (owner, on
          a screenshot of the merged sage-green band: "the gap between
          [Long Run's last line] and 'Have a requirement in mind' seems
          larger... make it look separate, but not with so much gap") —
          this seam only grew a problem once CTANudgeSection.tsx's own
          background became the same tint (see that file's own "band
          extended" comment, same day): with two different backgrounds,
          the color change itself was a visual break, so the numeric gap
          reading large didn't matter; once both sections share one
          continuous tinted field, the same gap is just empty space with
          no other cue. `py-16 sm:py-[5.6rem]` split into `pt-16
          sm:pt-[5.6rem]` (unchanged, not flagged) and a separately
          reduced `pb-8 sm:pb-10` (32px/40px) — combined with
          CTANudgeSection's own `pt-4 sm:pt-5`, the total gap drops from
          80/109.6px to 48/60px. The new dash accent in
          CTANudgeSection.tsx (see that file) is the actual "look
          separate" fix; this reduction is just proportioning the
          now-smaller gap around it, not replacing it. */}
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-6 px-6 pt-16 pb-8 text-center sm:px-10 sm:pt-[5.6rem] sm:pb-10">
        {/* `text-h2` (30px) — unchanged size, a single unbroken line (was
            two stacked `text-h2` spans). Two-tone accent added 30 Aug
            2026 (owner: "change 'long run' to the green grey sage, just
            like 'we build the supply behind it'") — matches Supply's
            own two-tone headline treatment exactly (plain charcoal line
            + sage-green line), just inline on one line instead of two
            stacked ones. */}
        <h2 className="text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          {LONG_RUN_HEADLINE_PLAIN}
          <span className="text-sage-green">{LONG_RUN_HEADLINE_ACCENT}</span>
        </h2>

        <span aria-hidden="true" className="h-px w-12 bg-sage-green/50" />

        <p className="text-body text-charcoal/70">
          <span className="block">{LONG_RUN_PARAGRAPH_1_LINE_1}</span>
          <span className="block">{LONG_RUN_PARAGRAPH_1_LINE_2}</span>
        </p>

        <span aria-hidden="true" className="h-px w-12 bg-sage-green/50" />

        <p className="text-body text-charcoal/70">
          <span className="block">{LONG_RUN_PARAGRAPH_2_LINE_1}</span>
          <span className="block">{LONG_RUN_PARAGRAPH_2_LINE_2}</span>
        </p>
      </div>
    </section>
  );
}
