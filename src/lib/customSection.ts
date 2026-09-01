// Content for the Custom / Made to Specification section (`/products`,
// section 3 per KIBO_Brand_and_Copy_Direction.md's original numbering).
// Fixed data, not Sanity-driven — same reasoning as
// `productCategories.ts`: this is the section's locked copy/structure, not
// routine owner-editable content. Copy is the exact, final wording supplied
// 26 Aug 2026 (a structural/visual reference mockup informed the layout —
// see CustomSection.tsx — but its own copy was superseded where the two
// conflicted; this file is the copy that actually shipped).
//
// Photography swapped 27 Aug 2026 — the original mockup crops (150–220px
// native, from the 1536×1024 reference PNG) were visibly pixelating once
// upscaled to the ~250–500px this section actually displays them at.
// Replaced with real, properly-licensed stock photography (Pexels
// License — free for commercial use, no attribution required) chosen to
// match the original crops' colour/angle/theme/content, at 800×1000
// native resolution — well above anything this layout renders at, so no
// more upscaling artefacts. Re-encoded as JPEG (not PNG) for file size:
// the original PNG re-encode of these came out to ~1–2MB *per image*
// (PNG's lossless compression is a poor fit for photographic noise/detail
// like fabric texture); JPEG at quality 82 holds visually identical
// quality at roughly a tenth of the size. Several images needed a second
// (or third) search pass after the first candidates showed a real
// problem on closer inspection:
// - Third-party branding, caught only on zoomed inspection, never at
//   thumbnail size: a Tommy Hilfiger tag (a real competitor's brand) on
//   the first Construction candidate, a fictional-but-still-distinct
//   "CLOTH" brand tag on the first Sample candidate, and a "WELLALUX"
//   tag + embroidered logo on the first Finished-garment candidate.
// - Fabric's first replacement read as a rug/carpet close-up, not
//   apparel fabric (owner feedback) — swapped for a ribbed knit texture
//   that's unambiguously garment material.
// - Print went through two replacements after the mountain-graphic
//   original: first to an abstract geometric graphic (kept for a while,
//   see PROJECT-SUMMARY.md), then per repeated owner instruction back to
//   the mockup's own mountain crop — which promptly hit the exact same
//   pixelation problem as every other un-replaced image, since it was
//   still the original small crop (owner: "this is still the old glitch
//   you did not resolve"). Replaced a third time with a real high-res
//   photo of a bold-graphic tee — and that FIRST real-photo candidate
//   had to be pulled too: it printed Chinese characters and an
//   East-Asian-styled graphic, a real conflict for an India-vs-China
//   sourcing positioning, not just an aesthetic call (owner: "no chinese
//   reference please they are our competitors"). Final version has
//   English-only text and a culturally-neutral abstract design.
// - Construction and Finish (attribute swatches) and Sample/Finished-
//   garment (process photos) went through several iterations on the same
//   underlying question — real photo vs. mockup crop vs. composite:
//   1. Real stock photo, no branding (pixelation fixed, but no KIBO tag).
//   2. KIBO's actual logo (`public/brand/kibo-logo.png`) composited
//      directly onto a blank tag with `sharp`, rotated to match the
//      tag's angle in-frame — owner called this "really bad... slapping,"
//      pasted-on/fake-looking, and chose to have the logo placement done
//      via ChatGPT instead (sent the clean base photos + the real logo
//      file for that).
//   3. Reverted Construction/Finish (and process Sample/Finished-garment)
//      to their original reference-mockup crops (owner: "I really like
//      the pictures used in [the mockup]... just find similar stuff —
//      or just revert to this, I will have this changed later if you
//      can't figure the right images") as an interim step, accepting
//      the reintroduced low-res pixelation as a deliberate trade-off.
//   4. **Landed on (27 Aug 2026): real KIBO-branded photos, done by the
//      owner via ChatGPT.** Sent the owner clean base photos (fabric
//      close-ups matching the mockup's Construction/Finish crops) plus
//      the real logo file (`public/brand/kibo-logo.png`); the owner had
//      ChatGPT composite the logo onto a proper hangtag/label in-frame
//      and returned the results, which replace the mockup-crop
//      placeholders here. High-res source (1024×1536 / 1536×1024),
//      cropped to the section's 800×1000 swatch convention — the
//      pixelation trade-off from step 3 no longer applies to these two.
//      Sample and Finished-garment (process photos) stayed on the
//      step-3 mockup crops for the moment — no equivalent ChatGPT
//      replacement supplied for those two yet. Reference, Development,
//      Cutting, and Production stay as the real-photo replacements from
//      step 1 (owner confirmed those directly: "really really good
//      images"). Filenames bumped straight to `-3` (not reusing `-2`) —
//      owner reported "not visible on site" after step 4 shipped under
//      the existing `-2` names; same stale-cache mechanism documented
//      above (browser/edge cache keyed to the URL), reusing the exact
//      fix.
//   5. **Sample/Finished-garment resolved differently (27 Aug 2026,
//      same day).** Owner first said to leave these two on the step-3
//      mockup crops and revisit later ("just use the same image — we
//      will refine this later"), then asked directly after seeing them
//      still pixelated in a full render of the section: "use exactly
//      the images in the snapshot in the best resolution possible ...
//      replace all images." No higher-resolution source of these two
//      specific photos exists anywhere (checked the project and the
//      owner's own file system) — sending them through the ChatGPT
//      compositing workflow like step 4 would swap in different photos,
//      not sharpen these ones, which isn't what was asked. Instead:
//      Lanczos3-resampled + sharpened the existing ~220px crops up to
//      the section's 800×1000 convention (`sharp`, `kernel: lanczos3`,
//      `sharpen({ sigma: 1.0 })`) — genuinely reduces the pixelation
//      versus the raw file being stretched by the browser, without
//      inventing any new detail or content the way an AI upscaler
//      would. Filenames get their own fresh `-2` suffix (Sample/
//      Finished never carried a suffix before this) purely for cache-
//      busting — not a sequence continuation of the `-2`/`-3` names
//      used above for Fabric/Construction/Finish.
//
// Filenames for Fabric, Construction, and Finish carry a `-2` suffix
// (27 Aug 2026) after the owner reported "didn't change" on a browser
// re-check, despite the files on disk, the Next.js image optimizer, and
// the tunnel all independently verified serving the new content — almost
// certainly a caching layer (browser and/or Cloudflare edge) keyed to
// the old URL. Renaming forces every layer to treat these as genuinely
// new URLs it's never cached before, which sidesteps the question of
// which layer was stale rather than needing to diagnose it exactly.
export type CustomProcessStep = {
  number: string;
  /** Short label for the step tracker, e.g. "Reference / Specification". */
  trackerLabel: string;
  /** Full-sentence caption shown under the step's photo. */
  caption: string;
  image: string;
  imageAlt: string;
};

export const CUSTOM_PROCESS_STEPS: CustomProcessStep[] = [
  {
    number: "01",
    // Sentence case (29 Aug 2026, font case 1.png: "'Reference /
    // specification', 'Development', 'Cutting / sewing' → H3, sentence
    // case") — was Title Case ("Reference / Specification" etc.).
    trackerLabel: "Reference / specification",
    caption: "You share a design, sample or specification",
    image: "/custom-section/process-reference.jpg",
    imageAlt: "Fashion design sketches pinned up alongside small fabric swatches",
  },
  {
    number: "02",
    trackerLabel: "Development",
    caption: "We develop the right materials and details",
    image: "/custom-section/process-development.jpg",
    imageAlt: "Hands holding a fanned-out selection of colour swatches",
  },
  {
    number: "03",
    trackerLabel: "Cutting / sewing",
    caption: "We cut, sew and print every piece with care",
    image: "/custom-section/process-cutting.jpg",
    imageAlt: "A sewing machine needle stitching fabric, close up",
  },
  {
    number: "04",
    trackerLabel: "Sample / inspection",
    // "every sample" → "samples" (31 Aug 2026, owner, testing live: "this
    // text needs to change to we check samples for fit and finish not
    // every sample that would be a false claim") — "every" reads as a
    // guarantee that literally every single unit gets inspected, which
    // isn't the actual claim; "samples" (the pre-production samples this
    // step's own photo and tracker label are both about) is accurate.
    caption: "We check samples for fit and finish",
    // Upscaled 27 Aug 2026 — see file header comment (step 5): no
    // higher-res source of this exact photo exists, so this is a
    // Lanczos3 resample + sharpen of the same original crop rather than
    // a substituted photo. `-2` suffix is fresh cache-busting, not a
    // sequence continuation of the earlier `-2`/`-3` filenames above.
    image: "/custom-section/process-sample-2.jpg",
    imageAlt: "Hands holding up a finished garment's neck label for inspection",
  },
  {
    number: "05",
    trackerLabel: "Production",
    caption: "Once approved, we move to production",
    image: "/custom-section/process-production.jpg",
    imageAlt: "A worker sewing garments on a factory production line",
  },
  {
    number: "06",
    trackerLabel: "Finished garment",
    // Shortened (1 Sep 2026, owner, density pass): "We pack and ship
    // your finished garments, ready to go" → "Packed, shipped and ready
    // to go" — drops the subject/verb framing every other caption in
    // this list still carries (they're a deliberate stylistic outlier
    // now, not an inconsistency — owner reviewed this one specifically).
    caption: "Packed, shipped and ready to go",
    // Upscaled 27 Aug 2026 — see file header comment (step 5): no
    // higher-res source of this exact photo exists, so this is a
    // Lanczos3 resample + sharpen of the same original crop rather than
    // a substituted photo.
    image: "/custom-section/process-finished-2.jpg",
    imageAlt: "A finished folded polo shirt packaged in a box, with a KIBO label",
  },
];

export type CustomAttribute = {
  icon: "fabric" | "fit" | "construction" | "colour" | "print" | "finish";
  label: string;
  blurb: string;
  image: string;
  imageAlt: string;
};

// Order (27 Aug 2026, owner instruction): Fabric, Colour, Fit,
// Construction, Print, Finish — reordered from the mockup's original
// Fabric/Fit/Construction/Colour/Print/Finish sequence to track closer to
// the actual order these decisions get made in building a garment
// (material and colour first, then fit and construction, then print,
// then finishing). Icon + title + blurb + image move together as one
// unit per attribute, so reordering the array is the whole change.
export const CUSTOM_ATTRIBUTES: CustomAttribute[] = [
  {
    icon: "fabric",
    label: "Fabric",
    // "to choose from" dropped (30 Aug 2026, owner, on a screenshot of
    // this exact blurb) — was "A variety of fabric types to choose
    // from, from natural and blended to performance options", the
    // repeated "from...from" read awkwardly once seen rendered.
    // "from" dropped too, same day, second look at the same screenshot.
    // Leading "A variety of fabric types," dropped entirely (1 Sep 2026,
    // owner, density pass across all six blurbs) — same instruction
    // applied to every attribute below: trim the lead-in clause, keep
    // just the actual list of options.
    // Comma added after "blended" (1 Sep 2026, owner, on a live read of
    // this exact blurb) — was "Natural and blended to performance
    // options", missing the pause between the two clauses that every
    // other blurb's own comma provides.
    blurb: "Natural and blended, to performance options",
    image: "/custom-section/swatch-fabric-2.jpg",
    imageAlt: "Close-up of a ribbed grey knit fabric texture",
  },
  {
    icon: "colour",
    label: "Colour",
    // Leading "An array of colour options," dropped (1 Sep 2026, same
    // density pass as Fabric above).
    blurb: "From neutrals to bold shades",
    image: "/custom-section/swatch-colour.jpg",
    imageAlt: "A stack of folded fabric in an array of colours",
  },
  {
    icon: "fit",
    label: "Fit",
    // Leading "Different fits for" dropped (1 Sep 2026, same density pass
    // as Fabric/Colour above) — was "Different fits for different
    // styles, from slim and regular to relaxed", repeating "fit(s)"
    // right after the "Fit" heading above it.
    blurb: "Different styles, from slim and regular to relaxed",
    image: "/custom-section/swatch-fit.jpg",
    imageAlt: "A row of t-shirts on wooden hangers in different colours",
  },
  {
    icon: "construction",
    label: "Construction",
    // "A range of" → "Various" (1 Sep 2026, same density pass as
    // Fabric/Colour/Fit above).
    blurb: "Various detailing options, simple to complex",
    image: "/custom-section/swatch-construction-3.jpg",
    imageAlt: "Close-up of folded orange fabric with a KIBO hangtag",
  },
  {
    icon: "print",
    label: "Print",
    // "to choose from" dropped, same fix/reasoning as Fabric's blurb
    // above — this had the identical "to choose from, from" repetition.
    // "Several" → "An array of" (30 Aug 2026, owner, on a screenshot of
    // Colour's blurb: "replace several with an array of") — matches
    // Colour's own phrasing ("An array of colour options...").
    // Leading "An array of print techniques," dropped (1 Sep 2026, same
    // density pass as the other five blurbs).
    blurb: "From subtle graphics to bold designs",
    // Real photo of a bold graphic tee (27 Aug 2026) — see the file-level
    // comment above for the full history (mountain graphic → abstract
    // geometric → mountain graphic again → this). Deliberately generic,
    // not KIBO-branded — English text only, culturally neutral design.
    // `-2` suffix added 27 Aug 2026 — owner reported Print and Finish
    // missing entirely from a live render (only 4 of 6 attribute photos
    // showing) despite this file serving correctly server-side (raw and
    // via the Next.js image optimizer, both confirmed 200 OK). Print had
    // never been given a cache-busting rename since its original
    // creation — the same stale-cache mechanism documented at the top of
    // this file for Fabric/Construction/Finish, reused here.
    image: "/custom-section/swatch-print-2.jpg",
    imageAlt: "Close-up of a bold abstract graphic print on a dark t-shirt",
  },
  {
    icon: "finish",
    label: "Finish",
    // Leading "Checked and finished with care," dropped (1 Sep 2026,
    // same density pass as the other five blurbs) — "finished" also
    // duplicated the "Finish" heading right above it.
    blurb: "Labels, trims and a clean presentation",
    // Bumped `-3` → `-4` (27 Aug 2026, same fix as Print above) — owner
    // reported this missing from a live render alongside Print; `-3` was
    // renamed only shortly before that report, so a stale cached
    // response for that specific URL (browser or tunnel/edge) was still
    // plausible even this soon after the rename.
    image: "/custom-section/swatch-finish-4.jpg",
    imageAlt: "Close-up of a striped t-shirt's neck tag showing the KIBO logo",
  },
];
