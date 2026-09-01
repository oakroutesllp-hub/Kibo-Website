import { defineField, defineType } from "sanity";

// CTA Nudge — Copy. Singleton, 1 Sep 2026 (owner: "make everything
// editable"). Reverses lib/ctaNudge.ts's original "fixed, code-level"
// call. This is the "Have a requirement in mind? Get in touch" band
// near the bottom of Home.
export const ctaNudgeCopyType = defineType({
  name: "ctaNudgeCopy",
  title: "CTA Nudge — Copy",
  type: "document",
  fields: [
    defineField({
      name: "line1",
      title: "Line 1",
      description: 'e.g. "Have a requirement in mind?".',
      type: "string",
    }),
    defineField({
      name: "line2",
      title: "Line 2",
      description: 'e.g. "Get in touch". Sits directly above the button.',
      type: "string",
    }),
    defineField({
      name: "buttonLabel",
      title: "Button label",
      description: 'e.g. "Get in touch". Opens the enquiry form — the label is the only editable part.',
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "CTA Nudge — Copy" };
    },
  },
});
