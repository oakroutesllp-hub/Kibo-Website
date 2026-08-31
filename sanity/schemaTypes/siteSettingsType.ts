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
      name: "showBlogInNav",
      title: "Show Blog in navigation",
      description:
        "OFF (default): the Blog page still exists and works if someone has the direct link, but it's hidden from the main nav and footer — effectively unlisted, not deleted. Turn this ON once there's real content published and you're ready for visitors to find it through normal browsing. Takes effect immediately on save, no code change or redeploy needed.",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
