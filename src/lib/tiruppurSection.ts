// Content for "The Tiruppur Story" — the second section of `/our-story`,
// directly below We Started by Listening, at anchor `#tiruppur`.
// KIBO_Brand_and_Copy_Direction.md, "Our Story — The Tiruppur Story —
// page anatomy" (LOCKED 27 Aug 2026, reference: `Tiruppur.png`). Fixed
// data, not Sanity-driven — same reasoning as every other locked
// section's data file on this site.
//
// Intent (kept here, not just in the brand doc, since it should guide
// any future edit to this copy or its footage): this section
// communicates that apparel runs deeply through certain parts of
// India — generations of experience, specialised skills, people
// connected to the business of making clothing — not a narrow sourcing
// claim. Tiruppur is the visual hero and a vivid example; KIBO should
// NOT read as sourcing exclusively from Tiruppur. The closing line
// ("KIBO works within ecosystems like these") is deliberately about
// ecosystems in general, with Tiruppur as one example of one, not the
// only one.
// Trailing full stop removed (30 Aug 2026, owner: "remove the full stop
// after deep") — was "runs deep.".
//
// Split into plain + sage-green accent (30 Aug 2026, owner: "do a green
// grey sage for deep", then widened same day: "apparel runs deep should
// be green grey sage") — "Where" stays plain charcoal, "apparel runs
// deep" renders in the sage-green accent color, matching Supply/Long
// Run/Listening's own two-tone headline treatment. Split across the two
// original line constants still (`_LINE_1` covers "Where", the accent
// spans the rest) since the component still renders them on the same
// visual line either way.
export const TIRUPPUR_HEADLINE_LINE_1 = "Where";
export const TIRUPPUR_HEADLINE_ACCENT = "apparel runs deep";

export type TiruppurSubBlock = {
  icon: "thread" | "people";
  label: string;
  copy: string;
};

// Labels sentence-cased (29 Aug 2026, revised type scale) — were Title
// Case ("A Long Heritage", "Specialised Ecosystems"); font case 2.png
// names these examples verbatim in sentence case ("A long heritage" /
// "Specialised ecosystems") as H3s, so this isn't a style choice, it's
// matching the doc's own literal text.
export const TIRUPPUR_SUB_BLOCKS: TiruppurSubBlock[] = [
  {
    icon: "thread",
    label: "A long heritage",
    copy: "India has been making textiles and clothing for generations—refined through trade, experience and time.",
  },
  {
    icon: "people",
    label: "Specialised ecosystems",
    copy: "Today, that expertise lives in specialised ecosystems across the country. Tiruppur is one of the most vibrant examples.",
  },
];

// Closing statement — first clause bold, rest regular weight. Kept as
// two separate strings (not one string with markup embedded) so the
// component controls the bold/regular split explicitly rather than
// parsing markdown-style syntax out of copy data.
export const TIRUPPUR_CLOSING_BOLD = "KIBO works within ecosystems like these";
export const TIRUPPUR_CLOSING_REST =
  ", connecting the right people and capabilities to build the right products.";

// Background photo — now `tiruppur-photo-4.jpg` (the yarn cone wall —
// "the one with multiple thread spools"), 30 Aug 2026. Two rejections
// led here: `tiruppur-photo-1.jpg` (tailor shot) measured as a ~2x
// upscale at real desktop widths (900×1198 source stretched to
// 1799×567, visibly soft — owner: "bad resolution"); the original
// `tiruppur-photo.jpg` (factory floor) was then rejected on content
// ("i dont want that tirupur photo"). `tiruppur-photo-4.jpg` is
// natively 2560×2755 — wide enough that it actually downscales rather
// than upscales at any normal desktop width, so it doesn't carry
// photo-1's resolution problem. Same Ken Burns pan/zoom treatment as
// every single-photo version before it.
//
// The filmstrip mechanism (TiruppurStorySection.tsx's scrolling,
// edge-blended multi-photo strip) and the other 3 candidate photos
// below are parked, not deleted, in case a multi-photo sequence is
// revisited later.
export type TiruppurPhoto = { src: string; w: number; h: number };

export const TIRUPPUR_PHOTO_SEQUENCE: TiruppurPhoto[] = [
  { src: "/our-story/tiruppur-photo-1.jpg", w: 1000, h: 1332 }, // tailor at work — low-res, see above
  { src: "/our-story/tiruppur-photo-2.jpg", w: 1000, h: 667 }, // screen-printing detail
  { src: "/our-story/tiruppur-photo-3.jpg", w: 1000, h: 1500 }, // thread spools
  { src: "/our-story/tiruppur-photo-4.jpg", w: 2560, h: 2755 }, // yarn cone wall
];

// Current single-photo background — see note above.
export const TIRUPPUR_PHOTO = "/our-story/tiruppur-photo-4.jpg";
