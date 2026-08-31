import { defineField, defineType } from "sanity";

// Product Category — reverses the 25 Aug 2026 "fully locked, not
// Sanity-editable" call this content used to live under
// (lib/productCategories.ts's own file comment still documents that
// original decision). Owner, 31 Aug 2026: "product cards need to be
// editable, the specs need to be editable, all the images... need to
// be editable... those eight images need to... be uploadable... I need
// to be able to change those out when I need to." A real, repeatable
// document type (not a singleton) so the owner can add, remove, and
// reorder categories from Studio directly, the same way Blog Posts
// already work — not baked into one fixed array only a code change can
// touch.
//
// `getProductCategories()` in lib/content/index.ts falls back to the
// existing PRODUCT_CATEGORIES code data (lib/productCategories.ts) if
// no documents exist yet — same fallback pattern as every other
// content type in this project — so the grid keeps showing its current
// 6 categories with zero visual change until the owner actually
// publishes real documents here.
export const productCategoryType = defineType({
  name: "productCategory",
  title: "Product Category",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      description: 'Shown on the card and as its title, e.g. "Crew Neck T-Shirt".',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Grid position",
      description:
        "Lower numbers show first in the Products grid. Use round numbers (10, 20, 30...) so you can slot a new category in between two existing ones later without renumbering everything.",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "specs",
      title: "Specs",
      description:
        'Shown on the back of the card when a visitor taps "Specs". Add one item per row — e.g. label "Fabric", value "100% Cotton, Poly-Cotton, Polyester".',
      type: "array",
      of: [
        {
          type: "object",
          name: "spec",
          fields: [
            defineField({ name: "label", title: "Label", type: "string", validation: (r) => r.required() }),
            defineField({ name: "value", title: "Value", type: "string", validation: (r) => r.required() }),
          ],
          preview: { select: { title: "label", subtitle: "value" } },
        },
      ],
    }),
    defineField({
      name: "note",
      title: "Note (optional)",
      description: "A small clarifying line shown below the spec list. Leave empty for none.",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "gallery",
      title: "Gallery images",
      description:
        "Up to 8 photos for this card — the first is the main image shown by default; the rest cycle through via the arrows/dots. Each needs a short label (used as the alt text, and as a placeholder caption until you upload the actual photo).",
      type: "array",
      validation: (rule) => rule.max(8),
      of: [
        {
          type: "object",
          name: "frame",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              description: 'e.g. "Plain — on hanger", "Colour variant", "On model — front".',
              type: "string",
              validation: (r) => r.required(),
            }),
            defineField({
              name: "image",
              title: "Image",
              description: "Leave empty to show a placeholder in this slot instead.",
              type: "image",
              options: { hotspot: true },
            }),
          ],
          preview: { select: { title: "label", media: "image" } },
        },
      ],
    }),
  ],
  orderings: [
    {
      title: "Grid position",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "order", media: "gallery.0.image" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle: subtitle !== undefined ? `Position ${subtitle}` : undefined, media };
    },
  },
});
