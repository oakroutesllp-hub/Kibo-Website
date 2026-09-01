import { defineField, defineType } from "sanity";

// Custom Section — Copy. Singleton, 1 Sep 2026 (owner: "make everything
// editable... all the text can be sanity based"). Reverses the
// customSection.ts file comment's original "copy stays fixed, only
// images became Sanity-editable" call — pairs with the existing
// `customSectionMedia` singleton, which stays image-only; this one is
// text-only, same split-by-concern pattern used across the rest of
// this Sanity build.
//
// Field structure mirrors lib/customSection.ts's own CUSTOM_PROCESS_STEPS
// (6 steps) and CUSTOM_ATTRIBUTES (6 attributes) arrays exactly — each
// step/attribute keeps its `icon`/`number` identity fixed in code (the
// tracker's number sequence and which SVG icon renders per attribute
// aren't editorial decisions), only the label/caption/blurb text is
// exposed here.
export const customSectionCopyType = defineType({
  name: "customSectionCopy",
  title: "Custom Section — Copy",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      description: 'e.g. "From reference to finished garment".',
    }),
    defineField({
      name: "processSteps",
      title: "Process steps (6)",
      description:
        "Keep all 6, in order — this is the step tracker (01–06) and the six photo captions below it. Reordering here does NOT reorder which photo shows in which slot (that's fixed to the slot names in Custom Section Media); only the label/caption text moves.",
      type: "array",
      validation: (rule) => rule.max(6),
      of: [
        {
          type: "object",
          name: "step",
          fields: [
            defineField({
              name: "trackerLabel",
              title: "Step name",
              description: 'Shown in the tracker row, e.g. "Reference / specification".',
              type: "string",
              validation: (r) => r.required().max(40),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              description: "Full sentence shown under the photo, e.g. \"You share a design, sample or specification\". Keep it short — long captions can wrap to more lines than the layout expects.",
              type: "string",
              validation: (r) => r.required().max(70),
            }),
          ],
          preview: { select: { title: "trackerLabel", subtitle: "caption" } },
        },
      ],
    }),
    defineField({
      name: "dividerLabel",
      title: "Divider label",
      description: 'e.g. "Built around your requirements" — sits between the photo row and the attribute row.',
      type: "string",
    }),
    defineField({
      name: "attributes",
      title: "Attributes (6)",
      description:
        "Keep all 6, in order — Fabric, Colour, Fit, Construction, Print, Finish. Reordering here does NOT change which icon or image shows (those are fixed to each attribute's identity); only the label/blurb text moves.",
      type: "array",
      validation: (rule) => rule.max(6),
      of: [
        {
          type: "object",
          name: "attribute",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: 'e.g. "Fabric".',
              type: "string",
              validation: (r) => r.required().max(20),
            }),
            defineField({
              name: "blurb",
              title: "Blurb",
              description: 'Short line under the label, e.g. "Natural and blended, to performance options". Keep to roughly 3 lines\' worth — longer text isn\'t cut off, but will make this card taller than its neighbors.',
              type: "string",
              validation: (r) => r.required().max(80),
            }),
          ],
          preview: { select: { title: "label", subtitle: "blurb" } },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Custom Section — Copy" };
    },
  },
});
