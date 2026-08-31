// Copy for the Products page's secondary "Talk to KIBO" CTA nudge —
// KIBO_Brand_and_Copy_Direction.md, "Secondary CTA nudge — build spec,
// 27 Aug 2026." No pre-written copy or reference mockup existed for
// this one (unlike Custom/Supply/Built for the Long Run) — the doc
// asked for 2–3 supporting-line options generated for owner review
// alongside visual variants, not one copy pre-picked.
//
// Final pick (28 Aug 2026): from 3 live-rendered variants, owner chose
// Variant A's copy — "Have a requirement in mind? Talk to KIBO." — kept
// alongside that layout's structure, though the tint background from
// that same variant was dropped (see CTANudgeSection.tsx). Grounded in
// the site's existing plain/factual tone (no buzzwords, no invented
// urgency) — modeled on how "Talk to KIBO" and "get in touch" already
// read elsewhere on this exact page (the Products grid's "Looking for
// something else? We build to your spec — get in touch.").
// Trailing full stop removed (31 Aug 2026, owner, on a screenshot of the
// mobile patch treatment: "remove the full stop after Talk to KIBO") —
// was "...Talk to KIBO." — matches this line's own question mark not
// getting a redundant full stop after it either, and the button right
// below repeats "Talk to KIBO" without one.
//
// Split into 2 lines, same day, same conversation (owner: "have a
// requirement in mind first line, talk to KIBO should be second line" —
// on mobile, per this whole feedback session's standing "mobile unless
// I say desktop" rule) — was one flowing sentence. `CTANudgeSection.tsx`
// forces the break between these two below `sm` only; at `sm` and up
// they render as the original single line (`sm:inline`), unchanged.
export const CTA_NUDGE_LINE_1 = "Have a requirement in mind?";
export const CTA_NUDGE_LINE_2 = "Talk to KIBO";

export const CTA_NUDGE_BUTTON_LABEL = "Talk to KIBO";
