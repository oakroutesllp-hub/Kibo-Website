import { defineField, defineType } from "sanity";

// Supply Section — Copy. Singleton, 1 Sep 2026 (owner: "make everything
// editable"). Reverses supplySection.ts's original "fixed, code-level"
// call — see that file's own comment for the full copy history this
// replaces (line-break experiments, capitalization passes, etc. — all
// now just live text an editor can change directly).
export const supplySectionCopyType = defineType({
  name: "supplySectionCopy",
  title: "Supply Section — Copy",
  type: "document",
  fields: [
    defineField({
      name: "headlineLine1",
      title: "Headline — line 1",
      description: 'e.g. "You build your market". Rendered in charcoal.',
      type: "string",
    }),
    defineField({
      name: "headlineLine2",
      title: "Headline — line 2",
      description: 'e.g. "We build the supply behind it". Rendered in sage green.',
      type: "string",
    }),
    defineField({
      name: "supportingLine1",
      title: "Supporting line 1",
      description: 'e.g. "You bring the demand and distribution".',
      type: "string",
    }),
    defineField({
      name: "supportingLine2",
      title: "Supporting line 2",
      description: 'e.g. "We build the capability to meet it".',
      type: "string",
    }),
    defineField({
      name: "rows",
      title: "Rows (3)",
      description:
        "Keep all 3, in order. Each row's icon is fixed to its position (manufacturing, then supply, then ground) — only the label/copy text moves.",
      type: "array",
      validation: (rule) => rule.max(3),
      of: [
        {
          type: "object",
          name: "row",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: 'e.g. "The right manufacturing capability".',
              type: "string",
              validation: (r) => r.required().max(60),
            }),
            defineField({
              name: "copy",
              title: "Copy",
              description: 'e.g. "Knowing which production setup is the right fit for each requirement".',
              type: "string",
              validation: (r) => r.required().max(120),
            }),
          ],
          preview: { select: { title: "label", subtitle: "copy" } },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Supply Section — Copy" };
    },
  },
});
