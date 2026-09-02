import { defineField, defineType } from "sanity";

// Singleton document — site-wide settings not tied to any one page.
// Currently just the footer content (Footer Build Brief, 21 Aug 2026) —
// everything here is explicitly required to be owner-editable without a
// Claude Code session, per that brief.
export const siteSettingsType = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "footerBrandLines",
      title: "Footer brand blurb",
      description:
        "Rendered as separate short lines, not a wrapped paragraph — add each line as its own item, no trailing full stops.",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "footerAddress",
      title: "Footer address",
      description: "City-level only by design (e.g. \"Mumbai, Maharashtra, India\") — not a full street address.",
      type: "string",
    }),
    defineField({
      name: "footerEmail",
      title: "Footer contact email",
      description:
        "Currently a placeholder personal/business Gmail — swap for a @kibo-domain address once one exists. Publicly shown in the footer's Contact column.",
      type: "string",
    }),
    defineField({
      name: "enquiryEmail",
      title: "Enquiry form destination email",
      description:
        "Where \"Talk to KIBO\" form submissions get sent. Leave empty to use the Footer contact email above instead — set this separately only if enquiries should go to a different inbox (e.g. a sales address) than the one shown publicly in the footer. Change this any time — no code change needed, takes effect on the next form submission.",
      type: "string",
    }),
    defineField({
      name: "linkedInUrl",
      title: "LinkedIn company page URL",
      description:
        "Leave empty to show the Connect icon in its inert (\"coming soon\") state — it's always visible, just not yet clickable to a real destination.",
      type: "url",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      description:
        "Leave empty to show the Connect icon in its inert (\"coming soon\") state — it's always visible, just not yet clickable to a real destination.",
      type: "url",
    }),
    defineField({
      name: "whatsappNumber",
      title: "WhatsApp / phone number",
      description:
        "Shown in the footer's Contact column, and used to build its wa.me link. Any readable format is fine (e.g. \"+91 75065 65454\"); digits are extracted automatically.",
      type: "string",
    }),
    defineField({
      name: "requireCatalogGate",
      title: "Require details before download (Catalog)",
      description:
        "ON: the Catalog page's \"Download Catalog\" button asks for Name + Email first, same as it does today. OFF: it skips the form entirely and goes straight to the download — no details collected for that visit. Leave ON to keep capturing leads from catalog downloads; only turn OFF if you'd rather prioritize a frictionless download over capturing that contact. Takes effect immediately on save, no code change or redeploy needed.",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      // Carousel speed (2 Sep 2026, owner: "let the number of seconds
      // be something that I can customize... or does it stay hard
      // coded" — made owner-editable rather than freezing it). One
      // shared value for every image carousel on the site (Hero, We
      // Started by Listening, Where Apparel Runs Deep, The Person
      // Behind KIBO) — see MediaCarousel.tsx's own comment for why this
      // is one setting, not one per section.
      name: "carouselIntervalSeconds",
      title: "Image carousel speed (seconds per image)",
      description:
        "How long each image in a carousel shows before auto-advancing to the next. Visitors can still click the arrows/dots to move faster or slower on their own — this only controls the automatic timing. Leave blank for the default (5 seconds).",
      type: "number",
      validation: (rule) => rule.min(2).max(20),
      initialValue: 5,
    }),
    defineField({
      name: "showBlogInNav",
      title: "Show Blog in navigation",
      description:
        "OFF (default): the Blog page still exists and works if someone has the direct link, but it's hidden from the main nav and footer — effectively unlisted, not deleted. Turn this ON once there's real content published and you're ready for visitors to find it through normal browsing. Takes effect immediately on save, no code change or redeploy needed.",
      type: "boolean",
      initialValue: false,
    }),
    // `getInTouchLabel` + nav labels (1 Sep 2026, owner: "make everything
    // editable") — one shared button label used everywhere the site
    // opens the enquiry form (nav bar, mobile sticky bar, footer, CTA
    // nudge button, Catalog page, the modal's own heading) rather than
    // five separate fields that could drift out of sync with each
    // other — see Nav.tsx's own comment for the full "Talk to KIBO" →
    // "Get in touch" rename history this field now controls going
    // forward. Nav labels are separate fields, not one array tied to
    // routes, since there are exactly 5, fixed — an array here would
    // let someone add/remove/reorder entries in a way that doesn't
    // correspond to any real route, which a fixed field per route can't
    // do by construction.
    defineField({
      name: "getInTouchLabel",
      title: "\"Get in touch\" button label",
      description:
        "Used on every button that opens the enquiry form — nav bar, mobile sticky bar, footer, the CTA nudge near the bottom of Home, and the Catalog page. Changing this changes all of them at once.",
      type: "string",
    }),
    defineField({
      name: "navLabelHome",
      title: "Nav label — Home",
      type: "string",
    }),
    defineField({
      name: "navLabelProducts",
      title: "Nav label — Products",
      type: "string",
    }),
    defineField({
      name: "navLabelCatalog",
      title: "Nav label — Catalog",
      type: "string",
    }),
    defineField({
      name: "navLabelBlog",
      title: "Nav label — Blog",
      description: "Only shown if \"Show Blog in navigation\" above is ON.",
      type: "string",
    }),
    defineField({
      name: "navLabelOurStory",
      title: "Nav label — Our Story",
      type: "string",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
