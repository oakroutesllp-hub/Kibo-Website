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
// until the owner publishes real ones.
//
// **Retitled "Certification logo" → "Icon," 4 Sep 2026, same-day
// follow-up** — owner: "a lot of suggestions I'm getting are that we
// cannot use government marks as logos... we'll use icons and names"
// instead. One icon per certification (owner's own choice, confirmed
// directly: a different icon per certification, not one shared icon
// reused for all) — what changed is what it's FOR: a generic icon
// representing the certification (a badge/seal/checkmark shape),
// never the certifying body's own official logo or trademark, which
// this business isn't necessarily licensed to reproduce.
//
// **The field's own internal name deliberately stays `logo`, NOT
// renamed to `icon`** — caught before shipping: the owner had already
// uploaded 2 real certifications (GST Registered, IEC Registered)
// against the field's ORIGINAL name. Sanity Studio only shows a field
// matching the current schema's own field name, so actually renaming
// this to `icon` would have made those two real uploads silently
// disappear from the form (still sitting in the raw document data,
// just orphaned/inaccessible via the normal UI) — and this project has
// no write-capable Sanity API token available to migrate the data
// programmatically, so that would have meant asking the owner to
// re-upload work already done. `title: "Icon"` (what the owner
// actually sees in Studio) already fully covers the rename in every
// place that matters to a human; only the low-level schema id, which
// no one but this codebase ever looks at, stays `logo`.
// getCertifications() in lib/content/index.ts aliases `logo` to
// `icon` in its own GROQ projection, so every other file in this
// codebase — including this type's own preview/media wiring 3 lines
// below — can keep using the clean, current name without knowing
// about this internal detail.
//
// **`icon` made REQUIRED, same day, immediate follow-up** (owner:
// "why will OEKO-TEX not have an icon? Everything will have an icon.
// We build it for that.") — reverses the brief "optional, falls back
// to text-only" state from the previous pass: an icon is now created
// for every certification as part of adding it (Claude Code's own
// job, per the owner's "we create an icon" — not sourced from the
// certifying body, an original generic mark), so there's no longer a
// real "no icon yet" case to design around. Icon and name always show
// together either way — a generic icon alone still can't distinguish
// "ISO 9001" from "GOTS" the way an official logo could, so the name
// stays visible too, not replaced by the icon.
export const certificationType = defineType({
  name: "certification",
  title: "Certification",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Certification name",
      description: 'e.g. "ISO 9001:2015" or "GOTS Certified" — always shown as visible text.',
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Icon",
      description:
        "A generic icon or badge shape representing this certification (a seal, a checkmark, a shield — whatever reads as \"certified\") — NOT the certifying body's own official logo or trademark, which this business may not be licensed to reproduce. Shown at a small, fixed size next to the certification's name, in a flat single color (not the icon file's own colors) — upload it on a transparent background so that color swap looks clean. Every certification gets one — ask a Claude Code session to create a simple original icon for this entry if you don't have one yet, rather than leaving it blank.",
      type: "image",
      options: { hotspot: true },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "verificationUrl",
      title: "Verification link (optional)",
      description:
        "Where a visitor can independently verify this certification (the certifying body's own registry/lookup page, for example) — not KIBO's own site. Leave blank if there isn't one; the entry just won't be clickable.",
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
