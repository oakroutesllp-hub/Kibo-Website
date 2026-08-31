import { defineField, defineType } from "sanity";

// Reusable SEO fields, embedded in each content type that needs them
// (homepage, product, article) per Master Brief §13 — page titles, meta
// descriptions, Open Graph image.
export const seoType = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({
      name: "metaTitle",
      title: "Meta title",
      type: "string",
      description: "Falls back to the page/item title if left blank.",
    }),
    defineField({
      name: "metaDescription",
      title: "Meta description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "ogImage",
      title: "Social share image",
      type: "image",
    }),
  ],
});
