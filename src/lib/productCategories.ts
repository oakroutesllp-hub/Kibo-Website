// Fixed, code-level content — not Sanity-editable. Per
// KIBO_Brand_and_Copy_Direction.md, "Products grid" section (fully
// locked, 25 Aug 2026): 6 categories, specs, copy, and order are locked
// business/manufacturing data, not routine content an owner needs to
// edit without a code change (same reasoning as the footer's Navigate
// links — see lib/navigation.ts).

export type ProductSpec = {
  label: string;
  value: string;
};

export type GalleryFrame = {
  /** Describes what this frame shows — used as the gray placeholder's
   *  label until a real photo is set, and as the image's alt text once
   *  one is. */
  label: string;
  /** Real photo for this frame, once sourced. Frames without one still
   *  render the placeholder block — not every frame has real
   *  photography yet. */
  image?: string;
};

export type ProductCategory = {
  name: string;
  specs: ProductSpec[];
  /** Optional small clarifying note shown below the spec list. */
  note?: string;
  /**
   * Interim single-frame state (29 Aug 2026, owner: "Set the placeholder
   * product photo for each of the 6 Products grid cards, using 'category
   * pics.png'... This is only 1 real placeholder photo per card for now,
   * not the full 6–8 image gallery target — that's fine as an interim
   * state") — every category's gallery is one real photo, no placeholder
   * frames behind it. The locked card anatomy still calls for a 6–8
   * frame gallery per category eventually (pattern/color variants ×
   * mannequin/on-model, plus colour-range and fabric-detail shots — see
   * git history / PROJECT-SUMMARY.md for the full prior structure and
   * the extensive real-photo sourcing attempts that preceded this pass);
   * rebuild that multi-frame array around this photo once more real
   * photography exists for each category. `ProductCategoryCard.tsx`
   * hides its arrow/dot gallery controls whenever `gallery.length <= 1`
   * rather than showing controls with nothing to cycle to.
   */
  gallery: GalleryFrame[];
};

// Identical spec set for all 4 knit-tee categories (Crew Neck, V-Neck,
// Polo, Long Sleeve T-Shirt) — same silhouette family, differing only in
// neckline/collar construction.
//
// `Style` (26 Aug 2026) — previously this Plain/Striped/Printed variant
// list only appeared as decorative subtext under the card title (a now-
// removed `variants` field), missing from the actual expanded spec list.
// Added as a proper spec attribute, first in the list (mirroring its
// position as the first thing shown on the card face). Every category
// gets this treatment, including Woven Shirt (added in a second pass —
// see its own entry below) despite already having a same-sounding
// `Pattern` spec; owner confirmed both should surface, not just one.
// `variants` itself was deleted (27 Aug 2026) rather than left as dead
// data once the card-face subtext it fed was removed as redundant with
// `Style` — same "don't leave it orphaned" call as the Phase 1 Sanity
// `product` schema removal (see PROJECT-SUMMARY.md).
// MOQ added 31 Aug 2026 (owner: "not sure what MOQ actually works in
// the market yet — we're going to let buyers ask, then figure it out —
// but add MOQ 1,000 for all cards [as a starting placeholder]") — a
// deliberate placeholder number, not a researched/locked commitment;
// revisit once real buyer conversations establish what MOQ actually
// works. First in the spec list on purpose — a qualifying number a
// buyer needs to self-select on before reading anything else.
const KNIT_TEE_SPECS: ProductSpec[] = [
  { label: "MOQ", value: "1,000 units" },
  { label: "Style", value: "Plain, Striped, Printed" },
  { label: "Fit", value: "Slim, Regular, Relaxed, Oversized" },
  { label: "Colors", value: "Various" },
  { label: "GSM", value: "150–240" },
  {
    label: "Print",
    value:
      "DTF (Direct to Film), DTG (Direct to Garment), Screen Print, Sublimation",
  },
  { label: "Fabric", value: "100% Cotton, Poly-Cotton, Polyester" },
  { label: "Sizes", value: "XS–4XL" },
];

// Locked grid order: knit tees first (core/highest-volume range), Woven
// Shirt next (the "step up" category), Sweatshirt last (heaviest/most
// seasonal item).
//
// All 6 photos below (29 Aug 2026) are crops of one owner-supplied
// composite, `category pics.png` — a 2-column × 3-row grid of 6 on-
// hanger product shots, each already carrying the "kibo" wordmark on
// the garment. Cropped along the composite's own white gutters via
// `sharp .extract` (boundaries found by scanning for the near-white
// gutter pixels, not eyeballed) — used as-is per owner instruction, no
// retouching/recropping-the-garment/background edits beyond isolating
// each cell. Mapped to categories by garment type, double-checked
// against the actual garment (not just position) before wiring up:
// cream/sun-graphic crew tee, sage V-neck, rust polo, lavender crew-
// neck sweatshirt, light-blue long-sleeve crew tee, pale-yellow button-
// up shirt.
// 30 Aug 2026, owner: "the swipe and change image feature is gone, bring
// it back" — each category had been trimmed to its single real photo
// (see `gallery` field's own comment above), which correctly hides
// `ProductCategoryCard.tsx`'s arrow/dot controls once `gallery.length`
// drops to 1. Restoring the multi-frame gallery brings those controls
// back; each category's real photo stays frame 1, followed by
// placeholder frames (no `image`, same as this codebase's other
// not-yet-photographed frames) standing in for the locked card
// anatomy's pattern/color-variant and on-model shots until that
// photography exists.
//
// Extended to 8 total frames (30 Aug 2026, owner: "we need 8 image
// capability per product") — was 3 (1 real + 2 placeholder); now 1 real
// + 7 placeholder, matching this same field's own note further up about
// the locked card anatomy's 6–8 frame gallery target (pattern/color
// variants × mannequin/on-model, plus colour-range and fabric-detail
// shots). The dot indicator and prev/next wraparound math
// (`ProductCategoryCard.tsx`) already handle any frame count, verified
// up to N=8 previously — no code change needed there, only more frames
// here.
const PLACEHOLDER_GALLERY_FRAMES: GalleryFrame[] = [
  { label: "Color variant" },
  { label: "Pattern variant" },
  { label: "On model — front" },
  { label: "On model — back" },
  { label: "Colour range" },
  { label: "Fabric detail" },
  { label: "Close-up detail" },
];

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    name: "Crew Neck T-Shirt",
    specs: KNIT_TEE_SPECS,
    gallery: [
      { label: "Plain — on hanger", image: "/products/crew-neck-kibo.jpg" },
      ...PLACEHOLDER_GALLERY_FRAMES,
    ],
  },
  {
    name: "V-Neck T-Shirt",
    specs: KNIT_TEE_SPECS,
    gallery: [
      { label: "Plain — on hanger", image: "/products/v-neck-kibo.jpg" },
      ...PLACEHOLDER_GALLERY_FRAMES,
    ],
  },
  {
    name: "Polo Shirt",
    specs: KNIT_TEE_SPECS,
    gallery: [
      { label: "Plain — on hanger", image: "/products/polo-kibo.jpg" },
      ...PLACEHOLDER_GALLERY_FRAMES,
    ],
  },
  {
    name: "Long Sleeve T-Shirt",
    specs: KNIT_TEE_SPECS,
    gallery: [
      { label: "Plain — on hanger", image: "/products/long-sleeve-kibo.jpg" },
      ...PLACEHOLDER_GALLERY_FRAMES,
    ],
  },
  {
    // Short Sleeve and Long Sleeve woven shirt are the same product
    // differing on one dimension — handled as a Sleeve Length spec
    // attribute on one card, not two separate cards.
    name: "Woven Shirt",
    specs: [
      // `Type`/`Style` relabelled 27 Aug 2026 (owner instruction) — the
      // Casual/Formal split (originally added as a `Style` spec, second
      // pass 26 Aug 2026, mirroring the card-face subtext) is now called
      // `Type` instead, freeing up the `Style` label for what used to be
      // `Pattern` — expanded from Solid/Stripe/Check to Solid/Checkered/
      // Striped/Printed (adding Printed as a new option, not just a
      // rename of the other two).
      { label: "MOQ", value: "1,000 units" },
      { label: "Type", value: "Casual, Formal" },
      { label: "Style", value: "Solid, Checkered, Striped, Printed" },
      { label: "Fit", value: "Slim, Regular, Relaxed" },
      { label: "Sleeve", value: "Short, Long" },
      { label: "Colors", value: "Various" },
      { label: "GSM", value: "100–160" },
      {
        label: "Fabric",
        value: "Poplin, Oxford, Twill, Cotton-Linen, Poly-Cotton, Cotton, Polyester",
      },
      { label: "Sizes", value: "XS–4XL" },
    ],
    gallery: [
      { label: "Casual — on hanger", image: "/products/woven-shirt-kibo.jpg" },
      ...PLACEHOLDER_GALLERY_FRAMES,
    ],
  },
  {
    name: "Sweatshirt",
    specs: [
      { label: "MOQ", value: "1,000 units" },
      { label: "Style", value: "Plain, Printed, Embroidered" },
      { label: "Fit", value: "Regular, Relaxed, Oversized" },
      { label: "Colors", value: "Various" },
      { label: "GSM", value: "220 GSM+" },
      { label: "Print", value: "DTF, DTG, Screen Print, Embroidery" },
      {
        label: "Fabric",
        value: "Cotton Fleece, Poly-Cotton Fleece, French Terry & Others",
      },
      { label: "Sizes", value: "XS–4XL" },
    ],
    // Crew-neck specifically, not a hoodie — internal disambiguation for
    // sourcing/photo-selection purposes (see ProductCategoryCard.tsx's
    // `note` field, unused here). Removed from the live customer-facing
    // spec sheet (29 Aug 2026, owner: "erase this text it is an
    // anomaly") — it was never meant as copy visitors should see, just a
    // build-time clarification.
    gallery: [
      { label: "Plain — on hanger", image: "/products/sweatshirt-kibo.jpg" },
      ...PLACEHOLDER_GALLERY_FRAMES,
    ],
  },
];
