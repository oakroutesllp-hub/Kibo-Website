import { defineField, defineType } from "sanity";

// Customer — 4 Sep 2026, owner: "let's move to brand section" (the
// section's own working name shifted through the conversation before
// landing here — see the field/copy comments below for the full
// naming history). Same real, repeatable document type + "hidden
// until ready" toggle pattern as Testimonial/Certification: this
// section only renders once `showTrustedBy` (Site Settings) is
// switched on AND at least one Customer document exists.
//
// **No sample/placeholder customers — deliberate, same reasoning as
// testimonialType.ts's own comment**: showing a company's logo next
// to the words "Trusted by" is a specific, checkable claim that real
// business happened — inventing one, even a generic-sounding
// placeholder, would misrepresent a relationship that doesn't exist.
// This type has zero fallback content by design.
//
// **Named `customer`, not `brand`** — owner's own catch, mid-
// conversation: "some of the wholesalers and distributors may not be
// brands... they may just be our clients... it's a B2B wholesaler
// distributor space." Whatever this section ends up called on the
// page (see TrustedBySection.tsx), the underlying entity is simply a
// business KIBO has sold to — calling the Sanity type `brand` would
// have baked in the same wrong assumption at the data layer.
//
// **Logo required, name optional** — first pass here was logo-only
// (owner: "logos only, no names... I think it's just the logo"),
// reversed almost immediately, same conversation: "these brands might
// not be very big... it's not like I'm gonna see an Apple logo and
// instantly recognize it... if I see just logos... who are they?" A
// recognizable brand's logo carries meaning on its own; an unfamiliar
// wholesaler or distributor's doesn't — the company name is what
// actually makes the social proof legible when the visitor has never
// heard of the company before, so `name` is shown by default. `name`
// was briefly REQUIRED for that reason (7 Sep 2026) — loosened to
// optional the same day, owner: "I would like to keep the text
// optional" — a well-known logo (or one the owner judges recognizable
// enough on its own) can still be added without a name forcing a
// caption underneath it; TrustedByRow.tsx simply skips rendering the
// name line when it's blank rather than leaving an empty gap.
//
// **No transparent-background requirement, unlike Certification's own
// icon** — that section recolors every icon to one flat brand color
// via a CSS mask, which needs real transparency to work at all. This
// section shows each logo in its own real, unmodified colors on a
// plain white section background — a logo file with its own white
// background will simply sit flush with the page, no visible seam,
// so there's no equivalent hard requirement here.
export const customerType = defineType({
  name: "customer",
  title: "Customer",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Company name (optional)",
      description:
        "Shown as text below the logo, and also used as the logo image's alt text. Leave blank to show the logo alone — recommended only for a company whose logo is recognizable on its own; for most B2B wholesalers/distributors, the name is what makes the logo mean anything to a visitor.",
      type: "string",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      description:
        "The company's own real logo, in its own real colors — shown as-is, nothing recolored or converted to grayscale. Displayed at a small, fixed height, so a wider-than-tall logo will look most natural (a very tall, narrow logo will end up looking small next to the others). PNG or SVG both work.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "websiteUrl",
      title: "Company website (optional)",
      description: "Makes the logo clickable, linking out to this company's own site. Leave blank if there isn't one to link to; the logo just won't be clickable.",
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
    // `name` is optional now — falls back to a plain label in the
    // Studio document list instead of showing a blank title when it's
    // left empty.
    prepare({ title, media }) {
      return { title: title || "(logo, no name)", media };
    },
  },
});
