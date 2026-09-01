// Content for "The Person Behind KIBO" — the third section of
// `/our-story`, directly below The Tiruppur Story, at anchor `#founder`.
// KIBO_Brand_and_Copy_Direction.md, "Our Story — The Person Behind
// KIBO — page anatomy" (LOCKED 27 Aug 2026, reference: `Our Story.png`).
// Fixed data, not Sanity-driven — same reasoning as every other locked
// section's data file on this site.
//
// Copy is typed exactly as the mockup shows it — no rewording. The two
// "KIBO" mentions render in the site's sage-green accent color (the
// mockup's own gold is one of two colors deliberately overridden here,
// the other being navy → charcoal — see FounderSection.tsx's comment
// for the full color-override rationale).
// Headline changed to "What led to KIBO" (30 Aug 2026, owner: "Change
// the attached text to 'what led to Kibo'") — was "The story / behind
// KIBO". Split the same way as before: line 1 is everything before
// "KIBO", line 2 is just "KIBO" itself (FounderSection.tsx's own
// `.replace("KIBO", "")` on LINE_2 now yields an empty prefix, so line
// 2 renders as just the colored "KIBO" span, no leading text).
export const FOUNDER_HEADLINE_LINE_1 = "What led to";
export const FOUNDER_HEADLINE_LINE_2 = "KIBO";

// Paragraphs 1 and 2 reworded (1 Sep 2026, owner-supplied copy, from a
// highlighted screenshot of this section) — was "I set out to build
// something on my own." / "Then I found an opportunity to connect
// India's apparel expertise with growing markets in Africa." Paragraph
// 3 is unchanged verbatim, including its trailing "KIBO." — the
// `.replace("KIBO.", "")` split in FounderSection.tsx that colors just
// that word still applies unmodified.
export const FOUNDER_PARAGRAPH_1 = "It started with the idea of building something of my own.";
export const FOUNDER_PARAGRAPH_2 =
  "Then came an opportunity to connect India's apparel expertise with growing markets in Africa.";
export const FOUNDER_PARAGRAPH_3 = "That became KIBO.";
