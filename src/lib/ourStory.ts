// Content for "We Started by Listening" — the first section of the new
// `/our-story` page, at anchor `#listening`.
// KIBO_Brand_and_Copy_Direction.md, "Our Story — We Started by
// Listening — page anatomy" (LOCKED 27 Aug 2026, reference:
// `kibo_our_story_option_1.png`). Fixed data, not Sanity-driven — same
// reasoning as customSection.ts/supplySection.ts/longRunSection.ts.
//
// Was a page-level micro-label eyebrow ("OUR STORY", uppercase via CSS
// transform) — promoted to a real page title, 30 Aug 2026 (owner: "Our
// story is a main title - I would think you want to treat this as
// products. no?"). Now that `/our-story` is a real standalone
// destination (not just a slice of Home's continuous scroll — see
// `(site)/our-story/page.tsx`'s and `products/page.tsx`'s own comments
// on that restructure), its title deserves the same H2 page-title
// treatment "Products" gets, not a small in-page label. Re-cased to
// sentence case ("Our story", was "Our Story") to match — every other
// real H2 headline's authored copy on this site is already sentence
// case, with `uppercase` handled (or not) purely via CSS, never via how
// the string itself is typed.
// Split into plain + sage-green accent, 30 Aug 2026 (owner: "'story' to
// be in green grey sage") — matches the same two-tone treatment applied
// to every other headline on the site this session (Supply, Long Run,
// Listening's own second line, Tiruppur).
export const OUR_STORY_PLAIN = "Our ";
export const OUR_STORY_ACCENT = "story";

// Trailing full stop dropped (29 Aug 2026, owner: "remove full stop") —
// was "listening." with a period.
export const LISTENING_HEADLINE_LINE_1 = "We started by";
export const LISTENING_HEADLINE_LINE_2 = "listening";

export const LISTENING_PARAGRAPH_1 = "Before building for the market, we wanted to understand it.";

export const LISTENING_PARAGRAPH_2 =
  "What we learned showed a natural fit between what the market needs and what India already does well.";
