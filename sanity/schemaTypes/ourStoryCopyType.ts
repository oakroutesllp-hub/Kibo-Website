import { defineField, defineType } from "sanity";

// Our Story — Copy. Singleton, 1 Sep 2026 (owner: "make everything
// editable"). Reverses ourStory.ts's/tiruppurSection.ts's/
// founderSection.ts's original "fixed, code-level" call. Covers the
// same 4 sub-sections of `/our-story` as the existing `ourStory` media
// singleton (page title + We Started by Listening + The Tiruppur Story
// + The Person Behind KIBO) — split from media the same way
// `customSectionCopy`/`customSectionMedia` are split, one document per
// concern rather than one document mixing both.
//
// Tiruppur's background photo, the photo-sequence array, and both
// sections' icons stay fixed in code (tiruppurSection.ts) — not
// editorial text, and swapping them safely needs either real image
// upload UI (photo) or a real icon picker (icon), neither of which
// this singleton provides.
export const ourStoryCopyType = defineType({
  name: "ourStoryCopy",
  title: "Our Story — Copy",
  type: "document",
  fields: [
    defineField({
      name: "pageTitlePlain",
      title: "Page title — plain part",
      description: 'e.g. "Our ". Rendered in charcoal.',
      type: "string",
    }),
    defineField({
      name: "pageTitleAccent",
      title: "Page title — accent part",
      description: 'e.g. "story". Rendered in sage green.',
      type: "string",
    }),
    defineField({
      name: "listeningHeadlineLine1",
      title: "We Started by Listening — headline line 1",
      description: 'e.g. "We started by". Rendered in charcoal.',
      type: "string",
    }),
    defineField({
      name: "listeningHeadlineLine2",
      title: "We Started by Listening — headline line 2",
      description: 'e.g. "listening". Rendered in sage green.',
      type: "string",
    }),
    defineField({
      name: "listeningParagraph1",
      title: "We Started by Listening — paragraph 1",
      description: 'e.g. "Before building for the market, we wanted to understand it."',
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "listeningParagraph2",
      title: "We Started by Listening — paragraph 2",
      description: 'e.g. "What we learned showed a natural fit between what the market needs and what India already does well."',
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "tiruppurHeadlinePlain",
      title: "The Tiruppur Story — headline plain part",
      description: 'e.g. "Where". Rendered in charcoal.',
      type: "string",
    }),
    defineField({
      name: "tiruppurHeadlineAccent",
      title: "The Tiruppur Story — headline accent part",
      description: 'e.g. "apparel runs deep". Rendered in sage green.',
      type: "string",
    }),
    defineField({
      name: "tiruppurSubBlocks",
      title: "The Tiruppur Story — sub-blocks (2)",
      description:
        "Keep both, in order — each block's icon is fixed to its position (thread, then people); only the label/copy text moves.",
      type: "array",
      validation: (rule) => rule.max(2),
      of: [
        {
          type: "object",
          name: "subBlock",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: 'e.g. "A long heritage".',
              type: "string",
              validation: (r) => r.required().max(40),
            }),
            defineField({
              name: "copy",
              title: "Copy",
              type: "text",
              rows: 2,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: "label", subtitle: "copy" } },
        },
      ],
    }),
    defineField({
      name: "tiruppurClosingBold",
      title: "The Tiruppur Story — closing statement, bold part",
      description: 'e.g. "KIBO works within ecosystems like these".',
      type: "string",
    }),
    defineField({
      name: "tiruppurClosingRest",
      title: "The Tiruppur Story — closing statement, regular-weight part",
      description: 'e.g. ", connecting the right people and capabilities to build the right products." (note the leading comma/space).',
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "founderHeadlineLine1",
      title: "The Person Behind KIBO — headline line 1",
      description: 'e.g. "What led to". Rendered in charcoal.',
      type: "string",
    }),
    defineField({
      name: "founderHeadlineLine2",
      title: "The Person Behind KIBO — headline line 2",
      description: 'e.g. "KIBO". Rendered in sage green.',
      type: "string",
    }),
    defineField({
      name: "founderParagraph1",
      title: "The Person Behind KIBO — paragraph 1",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "founderParagraph2",
      title: "The Person Behind KIBO — paragraph 2",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "founderParagraph3",
      title: "The Person Behind KIBO — paragraph 3",
      description: 'e.g. "That became KIBO." — must end with "KIBO." exactly (with the full stop) for the accent-color split to work correctly.',
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Our Story — Copy" };
    },
  },
});
