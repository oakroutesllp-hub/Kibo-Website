import { defineField, defineType } from "sanity";

// Certification — 4 Sep 2026, owner: "let's build the certifications
// section" (bundled with Testimonials/Brands as the day's main build,
// per the night-before check-in). Same real, repeatable document type
// + "hidden until ready" toggle pattern as Testimonial: this section
// only renders once `showCertifications` (Site Settings) is switched
// on AND at least one Certification document exists — see
// getCertifications() in lib/content/index.ts for the exact fallback
// behavior.
//
// **No sample/placeholder certifications — deliberate, same reasoning
// as testimonialType.ts's own comment, arguably stronger here**: a
// certification badge is a specific, checkable claim ("this business
// holds ISO 9001," "this business is GOTS certified") — inventing one,
// even a generic-sounding placeholder, would misrepresent KIBO as
// holding a real compliance credential it may not actually have. This
// type has zero fallback content by design; the section stays off
// until the owner publishes real ones with real logos.
//
// Layout, owner's own choice (4 Sep 2026, asked directly rather than
// assumed): "Logo/badge strip" — a simple row of marks, not cards with
// descriptions, so this type is deliberately thin: a logo image, a
// name, an optional link so a buyer can verify the certification
// themselves, and display order.
//
// `logo` made OPTIONAL, same day, immediate follow-up (owner: "some
// room for text in case some of those don't have logos... just in
// case we come across that scenario") — with a logo, `name` is used
// as its alt text only, never shown as visible label text (keeps the
// strip a pure logo row). WITHOUT a logo, `name` itself becomes the
// visible entry instead — rendered as text styled to sit naturally in
// the same row alongside the logo marks, not left blank. Either way
// `name` is required, since it always serves at least one of those
// two roles.
export const certificationType = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Certification name",
      description:
        'e.g. "ISO 9001:2015" or "GOTS Certified". If you add a logo below, this is used as that image\'s alt text (not shown as visible text — the strip stays a pure row of logos). If you leave the logo blank, this name IS what shows in the row, as text.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Certification logo (optional)",
      description:
        "The certification body's own logo/badge, ideally on a transparent background. Displayed at a fixed height in a row alongside the other certifications, so a roughly square or wide (not tall) logo will look most consistent. Leave blank if you don't have a logo for this one yet — the certification's name is shown as text instead, so it still appears in the row.",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "verificationUrl",
      title: "Verification link (optional)",
      description:
        "Where a visitor can independently verify this certification (the certifying body's own registry/lookup page, for example) — not KIBO's own site. Leave blank if there isn't one; the logo just won't be clickable.",
      type: "url",
    }),
    defineField({
      name: "order",
      title: "Display position",
      description:
        "Lower numbers show first (left to right). Use round numbers (10, 20, 30...) so you can slot a new one in between two existing ones later without renumbering everything.",
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
    select: { title: "name", media: "logo" },
  },
});
