import type {
  HomepageContent,
  OurStoryContent,
  ArticleContent,
  SiteSettingsContent,
} from "./types";

// Fallback content shown until a real Sanity project is connected (or if
// Sanity is dropped per Plan B). No final photography exists yet, so most
// images are left null — components render a neutral placeholder block
// instead of a broken image.
//
// `heroMedia` is the one exception (28 Aug 2026, owner request: "add a
// temporary hero image based on the copy - make it bright") — a real
// stock photo (Pexels License, free for commercial use, no attribution
// required — same sourcing basis as the Custom section's photography),
// not a placeholder block, specifically because Hero is the very first
// thing every visitor sees and a gray placeholder box there reads far
// worse than it does further down the page. Chosen for the copy
// ("Men's Apparel for African Markets" / "Exported from India"): a
// vertical stack of colorful folded fabric — communicates apparel/
// material range without depicting any specific person (sidesteps any
// risk of mis-representing "African market" demographics with a stand-in
// stock model), no third-party branding, no non-English text (a
// recurring problem sourcing images earlier in this project). Brightness
// and saturation both lifted ~8-12% via `sharp` from the source photo
// specifically because the owner asked for "bright" — a modest,
// deliberate push, not just accepting the raw stock photo's own
// exposure. Explicitly temporary — swap for real Hero photography once
// it's shot (see "Video/photo medium plan per section" in
// KIBO_Brand_and_Copy_Direction.md: Hero is photo-based, a toggle/
// sequence of stills, composed for this section's tall aspect ratio).
export const sampleHomepage: HomepageContent = {
  heroHeading: "Men's Apparel for African Markets",
  heroSubheading: "Exported from India.",
  heroMedia: {
    type: "image",
    url: "/hero/hero-placeholder.jpg",
    alt: "A vertical stack of colorful folded fabric in shades of purple, green, teal, blue and rust",
  },
  seo: {
    metaTitle: "KIBO — Men's Apparel for African Markets",
    metaDescription:
      "KIBO is a B2B men's apparel merchant exporter from India, focused on African markets.",
  },
};

// `/our-story` fallback media (30 Aug 2026) — one entry per newly
// Sanity-editable slot, pointing at each section's own current
// placeholder image (the same files those sections' own `<Image>` tags
// hardcoded before this change) so nothing regresses to a blank/broken
// state before an editor uploads anything in Sanity.
export const sampleOurStory: OurStoryContent = {
  listeningMedia: {
    type: "image",
    url: "/our-story/listening-placeholder.jpg",
    alt: "",
  },
  tiruppurMedia: {
    type: "image",
    url: "/our-story/tiruppur-photo-4.jpg",
    alt: "",
  },
  founderMedia: {
    type: "image",
    url: "/our-story/founder-placeholder-2.jpg",
    alt: "",
  },
};

// Footer Build Brief content spec (frozen 21 Aug 2026) — this is the
// approved current copy, not a placeholder invented for the fallback
// path, so it's correct to show even before a Sanity document exists.
// `whatsappDigits` is left unset here — index.ts derives it from
// `whatsappNumber` uniformly for both this fallback and real Sanity data.
export const sampleSiteSettings: SiteSettingsContent = {
  footerBrandLines: [
    "B2B men's apparel merchant exporter from India",
    "Backed by a manufacturing network",
    "Built to serve businesses across Africa",
  ],
  // Commas reintroduced, 31 Aug 2026 (owner, testing live: "let's do
  // Mumbai, comma, Maharashtra on one line and India on the second
  // line") — supersedes the 21 Aug "no commas" preference below, for
  // this field specifically: Footer.tsx's `formatFooterAddressLines`
  // now splits on ", " to produce that exact 2-line break, so the
  // commas are load-bearing punctuation for the split, not just style.
  footerAddress: "Mumbai, Maharashtra, India",
  // Explicit placeholder per the brief — swap for a @kibo-domain address
  // once one exists; not meant to stay a personal/business Gmail long-term.
  footerEmail: "oakroutesllp@gmail.com",
  linkedInUrl: undefined,
  instagramUrl: undefined,
  whatsappNumber: "+91 75065 65454",
  requireCatalogGate: true,
  showBlogInNav: false,
  // Global CTA label + nav labels (1 Sep 2026) — see
  // siteSettingsType.ts's own field descriptions; this is the current
  // production copy every trigger site-wide already used before these
  // fields existed, not an invented placeholder.
  getInTouchLabel: "Get in touch",
  navLabelHome: "Home",
  navLabelProducts: "Products",
  navLabelCatalog: "Catalog",
  navLabelBlog: "Blog",
  navLabelOurStory: "Our Story",
  carouselIntervalSeconds: 5,
  showTestimonials: false,
  testimonialsDesktopSpeed: 6,
  testimonialsMobileSpeed: 7,
  testimonialsCompactQuote: false,
  showCertifications: false,
  certificationsScrollSpeed: 30,
};

// A second sample post added 31 Aug 2026, same time as the Blog page
// rebuild — with only one sample post, the filter tabs (which read
// their options from whatever categories actually exist across
// published posts) had nothing to demonstrate; one real post per
// category shows the tabs actually filtering, not just rendering an
// "All" tab alone.
export const sampleArticles: ArticleContent[] = [
  {
    title: "Why We Started by Listening to the African Market",
    slug: "why-we-started-by-listening",
    coverImage: null,
    excerpt:
      "Before building a range, KIBO commissioned market research to understand what African importers actually need.",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Sample article body — replace via the Studio at /studio.",
          },
        ],
      },
    ],
    publishedAt: "2026-08-01T00:00:00.000Z",
    category: "Company News",
    seo: {},
  },
  {
    title: "What Working With an Indian Apparel Manufacturer Actually Looks Like",
    slug: "sourcing-from-india-what-to-expect",
    coverImage: null,
    excerpt:
      "A plain-language walkthrough of the sourcing process, from first sample to final shipment.",
    body: [
      {
        _type: "block",
        style: "normal",
        children: [
          {
            _type: "span",
            text: "Sample article body — replace via the Studio at /studio.",
          },
        ],
      },
    ],
    publishedAt: "2026-07-15T00:00:00.000Z",
    category: "Sourcing & Manufacturing",
    seo: {},
  },
];
