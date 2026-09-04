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
        "Where \"Talk to KIBO\" form submissions get sent. Leave empty to use the Footer contact email above instead — set this separately only if enquiries should go to a different inbox (e.g. a sales address) than the one shown publicly in the footer. Change this any time — no code change needed, takes effect within about a minute.",
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
        "ON: the Catalog page's \"Download Catalog\" button asks for Name + Email first, same as it does today. OFF: it skips the form entirely and goes straight to the download — no details collected for that visit. Leave ON to keep capturing leads from catalog downloads; only turn OFF if you'd rather prioritize a frictionless download over capturing that contact. Takes effect within about a minute of saving, no code change or redeploy needed.",
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
        "OFF (default): the Blog page still exists and works if someone has the direct link, but it's hidden from the main nav and footer — effectively unlisted, not deleted. Turn this ON once there's real content published and you're ready for visitors to find it through normal browsing. Takes effect within about a minute of saving, no code change or redeploy needed.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      // 3 Sep 2026, owner: "let's do testimonials section" — same
      // hidden-until-ready pattern as Show Blog in navigation above.
      name: "showTestimonials",
      title: "Show Testimonials on Home",
      description:
        "OFF (default): the Testimonials section doesn't render on Home at all, even if Testimonial documents exist. Turn this ON once you have real testimonials published and are ready for visitors to see them. Also requires at least one Testimonial document to actually show anything — this toggle alone with zero testimonials still shows nothing. Takes effect within about a minute of saving.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      // 3 Sep 2026, owner: "I want to have three testimonials or four
      // testimonials in there, but show only one... to test how it
      // looks like when there is one testimonial, two, three, or four."
      // A testing/preview control, not something a visitor-facing site
      // normally needs — lets the owner keep several real Testimonial
      // documents published and preview the layout at different counts
      // without actually deleting or unpublishing any of them.
      name: "testimonialsLimit",
      title: "Testimonials — how many to show (for testing layouts)",
      description:
        "Leave blank to show every published Testimonial. Set a number (e.g. 1, 2, or 3) to show only that many on the live site, even if more exist — useful for previewing how the section looks with different counts before deciding how many testimonials to actually keep visible.",
      type: "number",
      validation: (rule) => rule.min(1).integer(),
    }),
    defineField({
      // 3 Sep 2026, owner: "the number of seconds needs to be different
      // from desktop versus mobile... I want these fields to be
      // changeable in Sanity." Desktop shows 3 testimonials at once (a
      // sliding window, once there are more than 3 total) — see
      // TestimonialsDesktopCarousel.tsx.
      name: "testimonialsDesktopSpeed",
      title: "Testimonials — desktop auto-advance speed (seconds)",
      description:
        "Only matters once there are more than 3 testimonials (desktop shows 3 at a time and slides through the rest). How long each set of 3 shows before automatically advancing by one. Leave blank for the default (6 seconds).",
      type: "number",
      validation: (rule) => rule.min(2).max(20),
      initialValue: 6,
    }),
    defineField({
      name: "testimonialsMobileSpeed",
      title: "Testimonials — mobile auto-advance speed (seconds)",
      description:
        "Mobile shows one testimonial at a time. How long each one shows before automatically advancing to the next. Leave blank for the default (7 seconds) — a little longer than desktop's, since reading one full quote alone takes longer than glancing at a set of 3.",
      type: "number",
      validation: (rule) => rule.min(2).max(20),
      initialValue: 7,
    }),
    defineField({
      // 4 Sep 2026, owner: "provide me with two options, the current
      // text size and the bumped down text size... in case we are not
      // able to fit testimonials in the size, I would like to have the
      // option to bump it down one size." A fallback for a quote that
      // genuinely can't be trimmed under the recommended 180-character
      // guideline (see the Quote field's own description) — not meant
      // to be the everyday setting.
      name: "testimonialsCompactQuote",
      title: "Testimonials — use smaller quote text",
      description:
        "OFF (default, current/tested look): quote text at the site's normal size — fits about 190 characters on desktop before it gets cut off, ~220 on mobile. ON: quote text one size smaller, raising that to about 225 characters on desktop — use ONLY if a real testimonial genuinely can't be trimmed to fit at the normal size. This affects EVERY testimonial's quote at once, not just one long one, so short quotes will also render slightly smaller. Takes effect within about a minute of saving.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      // 4 Sep 2026, owner: "let's build the certifications section" —
      // same hidden-until-ready pattern as Show Testimonials/Show Blog
      // above.
      name: "showCertifications",
      title: "Show Certifications on Home",
      description:
        "OFF (default): the Certifications section doesn't render on Home at all, even if Certification documents exist. Turn this ON once you have real certifications published and are ready for visitors to see them. Also requires at least one Certification document to actually show anything — this toggle alone with zero certifications still shows nothing. Takes effect within about a minute of saving.",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      // 4 Sep 2026, owner: "if we have more certifications than can fit
      // on the page, then they will also slow scroll, and I should be
      // able to change how fast or slow they scroll... we don't need a
      // slider bar here." A continuous auto-scroll, not a Testimonials-
      // style advance-and-pause carousel — only ever activates when the
      // certifications genuinely don't fit in one centered row at the
      // viewer's own screen width; otherwise the row just stays static
      // and centered, same as it always has.
      name: "certificationsScrollSpeed",
      title: "Certifications — auto-scroll speed (seconds per loop)",
      description:
        "Only matters if you have enough certifications that they don't all fit in one row on a visitor's screen — at that point the row scrolls continuously and slowly rather than showing everything cramped or requiring a click. This is how many seconds one full loop takes: a bigger number scrolls slower, a smaller number scrolls faster. Leave blank for the default (30 seconds).",
      type: "number",
      validation: (rule) => rule.min(10).max(90),
      initialValue: 30,
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
