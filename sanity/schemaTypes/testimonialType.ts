import { defineField, defineType } from "sanity";

// Testimonial — 3 Sep 2026, owner: "let's do testimonials section." A
// real, repeatable document type (owner can add/remove/reorder from
// Studio directly), same "hidden until ready" pattern the Blog page
// already established: this section only renders on Home once
// `showTestimonials` (Site Settings) is switched on AND at least one
// testimonial document exists — see getTestimonials() in
// lib/content/index.ts for the exact fallback behavior. No sample
// placeholder testimonials — inventing fake quotes/names would be
// actively misleading rather than a harmless stand-in the way a
// placeholder photo is, so this type has zero fallback content by
// design; the section stays off until real ones are published.
export const testimonialType = defineType({
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    defineField({
      name: "quote",
      title: "Quote",
      description:
        "The testimonial text itself, in the person's own words. Keep it reasonably short (2-4 sentences) — long quotes get visually capped on the live site so every card lines up at the same height, and a quote that runs past that cap gets cut off with a fade.",
      type: "text",
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorName",
      title: "Author name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "authorRole",
      title: "Author role / company",
      description: 'e.g. "Sourcing Manager, apparel retailer, Lagos" — role and company/location, not a full address.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Display position",
      description:
        "Lower numbers show first. Use round numbers (10, 20, 30...) so you can slot a new testimonial in between two existing ones later without renumbering everything.",
      type: "number",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Display position",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "authorName", subtitle: "authorRole" },
  },
});
