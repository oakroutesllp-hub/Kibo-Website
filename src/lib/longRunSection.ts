// Content for "Built for the Long Run" (`/products`, fourth and final
// section, directly below The Supply Behind Your Market — LOCKED 27 Aug
// 2026, see KIBO_Brand_and_Copy_Direction.md's "Built for the Long Run
// — page anatomy"). Fixed data, not Sanity-driven — same reasoning as
// customSection.ts/supplySection.ts.
//
// Built against the owner-shared reference screenshot ("Built for the
// long run.png") — copy here is typed exactly as it appears on that
// mockup image (no separate pasted text this time, unlike Supply).
// Supersedes the earlier working line "Built for the next order, not
// just the first." — that line is NOT part of the final copy.
//
// No numbered eyebrow — the mockup shows none, unlike Custom ("03") and
// Supply ("04"). Flagged in the brand doc as an open question (would be
// "05" for consistency) but the doc's explicit instruction is to build
// exactly what the mockup shows until the owner says otherwise. This is
// also now consistent with Custom and Supply, both of which had their
// own numbered eyebrows removed after this doc was written (27 Aug
// 2026, owner request) — so all three sections agree: no eyebrows.
// Trailing full stops removed from both (30 Aug 2026, owner: "remove
// the full stop after grow with confidence" / "remove the full stop
// after ability to scale").
export const LONG_RUN_PARAGRAPH_1 =
  "For importers, distributors and wholesalers looking to grow with confidence";

export const LONG_RUN_PARAGRAPH_2 = "Reliable supply, repeat business and the ability to scale";

// Forced 2-line breaks. Originally added 29 Aug 2026 for the old
// two-column layout ("bring this closer to the central vertical line -
// spill over in 2 lines each, split text at a reasonable point"), then
// unused once the 30 Aug restructure moved to a single centered column
// (see LongRunSection.tsx) where each sentence had room to sit on one
// line. **Reinstated the same day** (owner, on a screenshot of the new
// centered layout: "spill each sentence in two lines, take a judgment
// call on where to split") — same split points as the original pass,
// since they're still the most balanced clause breaks in each sentence
// regardless of which layout is using them: right after "wholesalers"
// (44/33 chars) and "business" (33/26 chars).
export const LONG_RUN_PARAGRAPH_1_LINE_1 = "For importers, distributors and wholesalers";
export const LONG_RUN_PARAGRAPH_1_LINE_2 = "looking to grow with confidence";

export const LONG_RUN_PARAGRAPH_2_LINE_1 = "Reliable supply, repeat business";
export const LONG_RUN_PARAGRAPH_2_LINE_2 = "and the ability to scale";

// Single line (30 Aug 2026, owner: "'Built for the long run' will be
// horizontal, first line") — supersedes the two-line stacked version
// above (`LINE_1`/`LINE_2`, kept defined but unused now, in case a
// future layout wants the split again). Part of the section's
// two-column split → single centered stacked-column restructure — see
// LongRunSection.tsx's own comment for the full change.
//
// Split into a plain prefix + a sage-green accent phrase, same day
// (owner: "change 'long run' to the green grey sage, just like 'we
// build the supply behind it'" — referencing Supply's own two-tone
// headline treatment) — "Built for" stays plain charcoal,
// "the long run" renders in the sage-green accent color. Kept as two
// separate strings (not one string with markup embedded) so the
// component controls the color split explicitly, same pattern already
// used for Tiruppur's closing statement and Founder's "KIBO" mentions.
export const LONG_RUN_HEADLINE_PLAIN = "Built for ";
export const LONG_RUN_HEADLINE_ACCENT = "the long run";
