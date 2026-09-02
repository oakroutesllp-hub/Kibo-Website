import { defineField, defineType } from "sanity";

// Singleton document — one Our Story entry. Holds ONLY the
// image/video media slots for 3 of `/our-story`'s 4 sections (We
// Started by Listening, The Tiruppur Story, The Person Behind KIBO) —
// added 30 Aug 2026, owner: "make sure the image/video option is at
// hero, we are listening, where apparel runs deep, and the founder
// video — build functionality for both." Hero's own slot already
// existed on the `homepage` document (`heroMedia`/`heroVideo`); this
// mirrors that exact same pattern for the other three.
//
// Deliberately NOT a home for these sections' copy (headings,
// paragraphs, sub-block labels) — that stays fixed/code-level, same
// reasoning as every other locked section's data file on this site
// (see e.g. tiruppurSection.ts's own comment). Only the media toggle
// was asked to become owner-editable.
export const ourStoryType = defineType({
  name: "ourStory",
  title: "Our Story",
  type: "document",
  fields: [
    defineField({
      name: "listeningMedia",
      title: "We Started by Listening — image",
      type: "image",
      options: { hotspot: true },
      description:
        "Used if the video below is empty. Also used as the video's poster frame if both are set.",
    }),
    defineField({
      name: "listeningVideo",
      title: "We Started by Listening — video",
      type: "file",
      options: { accept: "video/*" },
      description: "Optional. Takes priority over the image and carousel above if any are set.",
    }),
    defineField({
      name: "listeningCarousel",
      title: "We Started by Listening — image carousel",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(6),
      description:
        "Optional — up to 6 images that scroll automatically. Used if the video above is empty; takes priority over the single image above if both are set.",
    }),
    defineField({
      name: "tiruppurMedia",
      title: "Where Apparel Runs Deep — image",
      type: "image",
      options: { hotspot: true },
      description:
        "Used if the video below is empty. Also used as the video's poster frame if both are set.",
    }),
    defineField({
      name: "tiruppurVideo",
      title: "Where Apparel Runs Deep — video",
      type: "file",
      options: { accept: "video/*" },
      description: "Optional. Takes priority over the image and carousel above if any are set.",
    }),
    defineField({
      name: "tiruppurCarousel",
      title: "Where Apparel Runs Deep — image carousel",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(6),
      description:
        "Optional — up to 6 images that scroll automatically. Used if the video above is empty; takes priority over the single image above if both are set.",
    }),
    defineField({
      name: "founderMedia",
      title: "The Person Behind KIBO — image",
      type: "image",
      options: { hotspot: true },
      description:
        "Used if the video below is empty. Also used as the video's poster frame if both are set.",
    }),
    defineField({
      name: "founderVideo",
      title: "The Person Behind KIBO — video",
      type: "file",
      options: { accept: "video/*" },
      description: "Optional. Takes priority over the image and carousel above if any are set.",
    }),
    defineField({
      name: "founderCarousel",
      title: "The Person Behind KIBO — image carousel",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
      validation: (Rule) => Rule.max(6),
      description:
        "Optional — up to 6 images that scroll automatically. Used if the video above is empty; takes priority over the single image above if both are set.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Our Story" };
    },
  },
});
