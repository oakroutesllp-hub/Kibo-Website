import { defineField, defineType } from "sanity";

// Long Run Section — Copy. Singleton, 1 Sep 2026 (owner: "make
// everything editable"). Reverses longRunSection.ts's original "fixed,
// code-level" call.
//
// Each paragraph keeps its own 2-line split as two separate fields
// (matching LongRunSection.tsx's current forced line break exactly) —
// an editor controls precisely where the line breaks, same as the
// code constants did, rather than leaving it to the browser's own wrap
// point at every possible screen width.
export const longRunSectionCopyType = defineType({
  name: "longRunSectionCopy",
  title: "Long Run Section — Copy",
  type: "document",
  fields: [
    defineField({
      name: "headlinePlain",
      title: "Headline — plain part",
      description: 'e.g. "Built for ". Rendered in charcoal.',
      type: "string",
    }),
    defineField({
      name: "headlineAccent",
      title: "Headline — accent part",
      description: 'e.g. "the long run". Rendered in sage green.',
      type: "string",
    }),
    defineField({
      name: "paragraph1Line1",
      title: "Paragraph 1 — line 1",
      description: 'e.g. "For importers, distributors and wholesalers".',
      type: "string",
    }),
    defineField({
      name: "paragraph1Line2",
      title: "Paragraph 1 — line 2",
      description: 'e.g. "looking to grow with confidence".',
      type: "string",
    }),
    defineField({
      name: "paragraph2Line1",
      title: "Paragraph 2 — line 1",
      description: 'e.g. "Reliable supply, repeat business".',
      type: "string",
    }),
    defineField({
      name: "paragraph2Line2",
      title: "Paragraph 2 — line 2",
      description: 'e.g. "and the ability to scale".',
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Long Run Section — Copy" };
    },
  },
});
