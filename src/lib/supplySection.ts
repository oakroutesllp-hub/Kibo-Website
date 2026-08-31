// Content for "The Supply Behind Your Market" section (`/products`,
// directly below Custom / Made to Specification — section 4 in the
// site's real built order, per KIBO_Brand_and_Copy_Direction.md's "The
// Supply Behind Your Market — page anatomy," LOCKED 27 Aug 2026).
// Fixed data, not Sanity-driven — same reasoning as customSection.ts and
// productCategories.ts: this is the section's locked copy/structure,
// not routine owner-editable content.
//
// Built 27 Aug 2026 against two owner-supplied references: "Section 4
// visual reference.png" (the "Option 2 · Split Layout" mockup — layout/
// type-scale/spacing target only, per the standing rule already
// established for Custom's own reference mockup) and "Section 4
// logos.pdf" (icon-style options per row — see SupplyRowIcon.tsx for
// which concept was picked from that PDF and why). Copy below is typed
// exactly as the brand doc's LOCKED text, not the mockup's own
// placeholder wording — Row 1 in particular differs from the mockup's
// own card text ("Knowing which manufacturing capability best fits the
// product requirement") in favor of the owner's actual final line.
//
// Numbered eyebrow ("04") — per the brand doc, this settles the real
// built-site-order convention (Hero=1, Products grid=2, Custom=3,
// Supply=4) for any future numbered eyebrows, NOT the archived
// Architecture doc's original section numbers. Flagged to the owner
// before building: Custom's own eyebrow was removed outright on 26 Aug
// 2026 (see CustomSection.tsx's comment) at the owner's own request, so
// there's currently no "03" anywhere on the page for this "04" to
// visually continue from — the owner acknowledged this and asked to
// proceed with "04" as specified regardless. **Resolved 27 Aug 2026,
// same day:** owner reviewed the live section and asked to remove the
// eyebrow outright — same call already made on Custom, so the two
// sections are consistent again (neither carries a numbered eyebrow).
// `SUPPLY_EYEBROW_NUMBER`/`SUPPLY_EYEBROW_LABEL` below are kept defined
// but unused by SupplySection.tsx, not deleted, in case a future pass
// reintroduces numbered eyebrows site-wide.
export type SupplyRow = {
  icon: "manufacturing" | "supply" | "ground";
  label: string;
  copy: string;
};

export const SUPPLY_EYEBROW_NUMBER = "04";
export const SUPPLY_EYEBROW_LABEL = "The Supply Behind Your Market";

// Line-break history, all same 28–30 Aug 2026 conversation: 2 full
// sentences → briefly 4 stacked lines ("you / build your market / we /
// build the supply behind it") → back to 2 → 4 again, this time split
// differently ("You build - line 1 / Your market - line 2 / We build
// -line 3 / The supply behind it -line 4") with explicit per-line
// capitalization ("Y of you and your in caps and W of We in caps, T of
// the in Caps rest small letters") → **settled back to 2, 30 Aug 2026**
// (owner, reviewing layout variants: "keep everything the same... put
// 'you build your market' on top... 'we build the supply behind it' [as
// line two]") as part of the section's wider relayout (see
// SupplySection.tsx's own comment) — each line is now the same two full
// sentences the very first version used, just without trailing
// punctuation (matches the mockup variant the owner picked, "A2").
export const SUPPLY_HEADLINE_LINE_1 = "You build your market";
export const SUPPLY_HEADLINE_LINE_2 = "We build the supply behind it";

// Split across its 2 sentences (29 Aug 2026, owner: "split this text in
// 2 lines. remove the tiny horizontal line") — was one flowing string
// left to the browser's own wrap point; forced at the natural sentence
// boundary instead, same device as every other forced 2-line split on
// this site (e.g. Custom's Colour blurb, Built for the Long Run's own
// paragraphs).
// Trailing full stops removed (30 Aug 2026, owner: "remove full stop",
// on a screenshot of this exact line) — matches the same full-stop
// removal already applied to SUPPLY_ROWS below.
export const SUPPLY_SUPPORTING_LINE_1 = "You bring the demand and distribution";
export const SUPPLY_SUPPORTING_LINE_2 = "We build the capability to meet it";

// Row labels sentence-cased (29 Aug 2026, revised type scale — these are
// H3 "feature headings," and the doc's blanket case rule is "headings:
// sentence case") — were Title Case ("The Right Manufacturing
// Capability.", etc.); the `uppercase` CSS transform that was also
// forcing full caps in the component is dropped alongside this.
//
// Trailing full stops removed (30 Aug 2026, owner: "remove full stop
// after capability supply and know how") — these three now sitting side
// by side in a single row (see SupplySection.tsx's relayout comment)
// read more like short labels than full sentences in that arrangement,
// so the period reads oddly on each one; dropped from all three.
// Row `copy` full stops removed (30 Aug 2026, owner, on a screenshot of
// this exact row of three: "remove full stops") — the row labels above
// had theirs removed earlier the same day; this extends it to each
// row's supporting sentence too.
export const SUPPLY_ROWS: SupplyRow[] = [
  {
    icon: "manufacturing",
    label: "The right manufacturing capability",
    copy: "Knowing which production setup is the right fit for each requirement",
  },
  {
    icon: "supply",
    label: "Simplified supply",
    copy: "The complexity of multiple manufacturing relationships, handled behind the scenes",
  },
  {
    icon: "ground",
    // Non-breaking hyphen (U+2011) in "know‑how" only (30 Aug 2026,
    // owner: "I dont like the know and how spill over in 2 different
    // lines") — this label wraps to 2 lines at this column width either
    // way; without this, the browser preferred to break *inside*
    // "know-how" itself ("On-the-ground know-" / "how"), which reads
    // badly for a hyphenated compound word. A non-breaking hyphen makes
    // "know-how" one unbreakable unit, so the wrap point moves to the
    // space before it instead: "On-the-ground" / "know-how".
    label: "On-the-ground know‑how",
    copy: "Understanding how to translate product requirements into manufacturing in India",
  },
];
