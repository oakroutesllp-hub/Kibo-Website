import { defineField, defineType } from "sanity";

// Singleton document — one Homepage entry. Home is Hero-only per the
// confirmed site architecture (25 Aug 2026, KIBO_Brand_and_Copy_Direction.md
// "Site architecture") — the former "Range" section's product-grid role
// moved to its own /products route (fixed category data, not this
// document), so the old rangeHeading/rangeIntro fields were removed here.
export const homepageType = defineType({
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    defineField({
      name: "heroHeading",
      title: "Hero heading",
      type: "string",
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero supporting line",
      type: "string",
    }),
    defineField({
      name: "heroMedia",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      description:
        "Used if Hero video below is empty. Also used as the video's poster frame if both are set.",
    }),
    defineField({
      name: "heroVideo",
      title: "Hero video",
      type: "file",
      options: { accept: "video/*" },
      description:
        "Optional — a short video (per the architecture brief's 'cinematic' hero). Takes priority over Hero image and Hero carousel if any are set.",
    }),
    defineField({
      // Carousel option (2 Sep 2026, owner: "in addition to the image
      // or video, I would like to have an option where multiple
      // pictures can be scrolled, like a carousel"). Used only if Hero
      // video above is empty; takes priority over the single Hero
      // image above if both are set (see resolveMedia's own comment in
      // lib/content/index.ts for the full precedence order).
      name: "heroCarousel",
      title: "Hero image carousel",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(6),
      description:
        "Optional — up to 6 images that scroll automatically (visitors can also use the arrows/dots). Used if Hero video above is empty; takes priority over the single Hero image above if both are set.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Homepage" };
    },
  },
});
