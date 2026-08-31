import { defineField, defineType } from "sanity";

// Custom Section Media — singleton, 31 Aug 2026 (owner: "under 'From
// reference to finished garment' need to be editable those six [process
// photos] plus six [attribute swatch] thumbnails... because they are
// not the final thumbnails"). CustomSection.tsx's own copy (captions,
// headline, attribute labels/blurbs) stays fixed in code — that text
// was explicitly locked business copy per customSection.ts's own file
// comment, and only the IMAGES were raised as needing to change. Each
// of the 12 images gets its own fixed, named field (not a repeatable
// array) since these are 12 specific, non-reorderable slots tied to
// fixed captions already defined in code — a singleton with named
// fields is simpler to edit correctly than an array where slot order
// would have to stay manually in sync with that fixed copy.
//
// `getCustomSectionMedia()` in lib/content/index.ts falls back to the
// current local image paths (lib/customSection.ts) per field if this
// document doesn't exist yet or a given field is empty — same fallback
// pattern as everywhere else, so nothing changes visually until the
// owner replaces a given slot.
export const customSectionMediaType = defineType({
  name: "customSectionMedia",
  title: "Custom Section Media",
  type: "document",
  fields: [
    defineField({
      name: "processReference",
      title: "Step 1 photo — Reference / specification",
      description: 'Caption: "You share a design, sample or specification"',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "processDevelopment",
      title: "Step 2 photo — Development",
      description: 'Caption: "We develop the right materials and details"',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "processCutting",
      title: "Step 3 photo — Cutting / sewing",
      description: 'Caption: "We cut, sew and print every piece with care"',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "processSample",
      title: "Step 4 photo — Sample / inspection",
      description: 'Caption: "We check samples for fit and finish"',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "processProduction",
      title: "Step 5 photo — Production",
      description: 'Caption: "Once approved, we move to production"',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "processFinished",
      title: "Step 6 photo — Finished garment",
      description: 'Caption: "We pack and ship your finished garments, ready to go"',
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "swatchFabric",
      title: "Fabric swatch photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "swatchColour",
      title: "Colour swatch photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "swatchFit",
      title: "Fit swatch photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "swatchConstruction",
      title: "Construction swatch photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "swatchPrint",
      title: "Print swatch photo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "swatchFinish",
      title: "Finish swatch photo",
      type: "image",
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: "Custom Section Media" };
    },
  },
});
