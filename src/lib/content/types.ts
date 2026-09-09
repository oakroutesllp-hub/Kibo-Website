import type { ArbitraryTypedObject } from "@portabletext/types";

// Frontend-facing content shapes. Deliberately decoupled from Sanity's raw
// document shape (see ../../sanity for that) — this is the "portable"
// boundary the Master Brief asks for (§5 Plan B): if Sanity is ever
// dropped, only lib/content/*.ts needs to change, not the components.

export type ContentImage = {
  url: string;
  alt: string;
} | null;

// Generic image-or-video-or-carousel media slot — editors pick one of the
// three fields in Sanity; precedence when more than one is set: video,
// then carousel, then single image (see resolveMedia's own comment).
// `poster` is the image, used as the video's poster frame when both are
// present. Originally `HeroMedia` (Hero was the only Sanity-editable
// media slot); generalized 30 Aug 2026 when the same image/video toggle
// was extended to three more spots on `/our-story` (We Started by
// Listening, The Tiruppur Story, The Person Behind KIBO) — see
// `OurStoryContent` below. `HeroMedia` kept as an alias so Hero's own
// code/comments referencing that name don't need touching.
//
// `carousel` variant added 2 Sep 2026 (owner: "in addition to the image
// or video, I would like to have an option where multiple pictures can
// be scrolled, like a carousel... maybe five, six images") — a bare
// array of up to 6 images, rendered by the new MediaCarousel component.
export type Media =
  | { type: "video"; url: string; poster: string | null }
  | { type: "carousel"; images: { url: string; alt: string }[] }
  | { type: "image"; url: string; alt: string }
  | null;

export type HeroMedia = Media;

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImageUrl?: string;
};

// rangeHeading/rangeIntro removed (25 Aug 2026) — Home is Hero-only per
// the confirmed site architecture; the product grid moved to its own
// /products route as fixed data, not Sanity content (see
// lib/productCategories.ts).
export type HomepageContent = {
  heroHeading: string;
  heroSubheading: string;
  heroMedia: HeroMedia;
  seo: Seo;
};

// `/our-story` page media — 3 of its 4 sections' image/video slots, now
// Sanity-editable (30 Aug 2026, owner: "make sure the image/video option
// is at hero, we are listening, where apparel runs deep, and the founder
// video — build functionality for both"). Hero's own slot is
// `HomepageContent.heroMedia` (unchanged, already existed). Falls back to
// each section's current placeholder image (see sampleContent.ts) when
// unset, same per-field fallback pattern as every other content type.
export type OurStoryContent = {
  listeningMedia: Media;
  tiruppurMedia: Media;
  founderMedia: Media;
};

export type ArticleContent = {
  title: string;
  slug: string;
  coverImage: ContentImage;
  excerpt?: string;
  body: ArbitraryTypedObject[];
  publishedAt?: string;
  // Blog filter-tab category (31 Aug 2026) — see articleType.ts's own
  // field description. Left `undefined` files the post under
  // "Uncategorized" (BlogGrid.tsx's own fallback), not a Sanity-side
  // default, so the fallback wording is one place to change, not baked
  // into the schema.
  category?: string;
  linkedInUrl?: string;
  seo: Seo;
};

// Footer Build Brief (21 Aug 2026) — site-wide settings, not tied to any
// one page. `whatsappNumber` is the display string as entered in Sanity
// (e.g. "+91 75065 65454"); `whatsappDigits` is the same number with only
// digits, precomputed here so the footer's wa.me link is built from one
// place. (whatsappMessage removed 25 Aug 2026 with the floating WhatsApp
// button it was for — see KIBO_Brand_and_Copy_Direction.md.)
export type SiteSettingsContent = {
  footerBrandLines: string[];
  footerAddress?: string;
  footerEmail?: string;
  // Enquiry-form destination address (30 Aug 2026) — see
  // siteSettingsType.ts's own field description. Falls back to
  // `footerEmail` when unset; `getSiteSettings` resolves that fallback
  // once here so every caller (currently just the /api/enquiry route)
  // gets a single field to read, not two to reconcile itself.
  enquiryEmail?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  whatsappDigits?: string;
  // Catalog-download gate toggle (31 Aug 2026) — see
  // siteSettingsType.ts's own field description. Defaults to `true`
  // (gate ON, current behavior) both here and in `getSiteSettings`'s
  // resolution — an owner who's never touched this field, or who isn't
  // connected to Sanity yet, keeps the existing gated experience rather
  // than silently losing lead capture.
  requireCatalogGate: boolean;
  // Blog nav-visibility toggle (31 Aug 2026) — see siteSettingsType.ts's
  // own field description. Defaults to `false` (hidden) both here and
  // in `getSiteSettings`'s resolution — the Blog page ships unlisted
  // until the owner has real content and flips this on herself.
  showBlogInNav: boolean;
  // Global CTA label + nav labels (1 Sep 2026) — see
  // siteSettingsType.ts's own field descriptions. Each falls back to
  // its current hardcoded string ("Get in touch", "Home", etc.) when
  // unset.
  getInTouchLabel: string;
  navLabelHome: string;
  navLabelProducts: string;
  navLabelCatalog: string;
  navLabelBlog: string;
  navLabelOurStory: string;
  // Image carousel speed (2 Sep 2026) — see siteSettingsType.ts's own
  // field description. Falls back to 5 (seconds) when unset, same
  // default MediaCarousel.tsx always used before this field existed.
  carouselIntervalSeconds: number;
  // Testimonials-on-Home toggle (3 Sep 2026) — see siteSettingsType.ts's
  // own field description. Defaults to `false` (hidden), same
  // hidden-until-ready pattern as `showBlogInNav`.
  showTestimonials: boolean;
  // Testimonials display-count testing control (3 Sep 2026) — see
  // siteSettingsType.ts's own field description. `undefined` (field
  // left blank) means "show all" — TestimonialsSection.tsx only slices
  // the array when this is an actual number.
  testimonialsLimit?: number;
  // Testimonials auto-advance speeds, desktop and mobile separately
  // (3 Sep 2026) — see siteSettingsType.ts's own field descriptions.
  // Fall back to 6/7 seconds respectively when unset.
  testimonialsDesktopSpeed: number;
  testimonialsMobileSpeed: number;
  // Fallback for a quote that can't be trimmed under the 180-char
  // guideline (4 Sep 2026) — see siteSettingsType.ts's own field
  // description. Defaults false (current/tested quote size).
  testimonialsCompactQuote: boolean;
  // Certifications toggle (4 Sep 2026) — same hidden-until-ready
  // pattern as showTestimonials/showBlogInNav above.
  showCertifications: boolean;
  // Auto-scroll speed, only used once certifications overflow one row
  // (4 Sep 2026) — see siteSettingsType.ts's own field description.
  certificationsScrollSpeed: number;
  // "Trusted by" toggle + scroll speed (4 Sep 2026) — same
  // hidden-until-ready + overflow-only-auto-scroll pattern as
  // Certifications above. See siteSettingsType.ts's own field
  // descriptions, and customerType.ts for why the underlying content
  // type is `customer` even though the section label is "Trusted by."
  showTrustedBy: boolean;
  trustedByScrollSpeed: number;
};

// Testimonial (3 Sep 2026) — see testimonialType.ts's own comment.
// Deliberately no `ContentImage`/photo field — not asked for, and a
// text-only card is simpler to keep uniform height across a grid (see
// TestimonialsSection.tsx's own comment on the line-clamp approach).
export type TestimonialContent = {
  quote: string;
  authorName: string;
  authorRole: string;
};

// Certification (4 Sep 2026) — see certificationType.ts's own comment.
// `icon` (renamed from `logo` same day, once the owner learned
// official certifying-body logos generally can't be reproduced
// without permission — a generic icon instead, required in Sanity now
// — "everything will have an icon. We build it for that.") stays
// nullable in this TS type only as a defensive fallback against an
// unexpected gap between the required-in-Studio rule and what's
// actually published — CertificationsSection.tsx still renders `name`
// alone if it's ever missing, rather than crashing, but that's no
// longer a supported/designed-for state, just a safety net.
export type CertificationContent = {
  name: string;
  icon: ContentImage;
  verificationUrl?: string;
};

// Customer (4 Sep 2026) — see customerType.ts's own comment, including
// why this is `customer` and not `brand`, and why `name` is shown as
// visible text now (reversed from an initial logo-only pass, same
// conversation — an unrecognized company's logo alone conveys nothing
// without its name attached). `logo` deliberately does NOT
// reuse the shared `ContentImage` type every other media slot on this
// site uses — those are all displayed via Next/Image's `fill` inside
// a container with a fixed, known aspect ratio (a hero photo, a
// square swatch), so they never need their own intrinsic dimensions.
// A real customer logo's aspect ratio is different every time (a
// square mark vs. a wide wordmark), and this section displays every
// logo at the same fixed HEIGHT with natural width (see
// TrustedByRow.tsx) — Next/Image needs real width/height to do that
// without distorting or guessing, so `width`/`height` (the logo's own
// real pixel dimensions, from Sanity's own asset metadata) travel
// alongside `url`/`alt` here.
export type CustomerContent = {
  // Optional, 7 Sep 2026 (owner: "I would like to keep the text
  // optional") — was required; TrustedByRow.tsx now skips the name
  // line under a logo entirely when this is empty, rather than
  // rendering a blank caption. Logo `alt` still needs SOME text
  // regardless (screen readers, not a visual caption) — falls back to
  // a generic string at the query layer (see getCustomers() in
  // index.ts) when name is blank.
  name?: string;
  logo: { url: string; alt: string; width: number; height: number } | null;
  websiteUrl?: string;
};

// Product Categories (31 Aug 2026) — see productCategoryType.ts's own
// comment for why this reverses the 25 Aug "fixed, code-level, not
// Sanity-editable" call lib/productCategories.ts's own file comment
// still documents. Same field names/shapes as that file's own
// `ProductCategory`/`ProductSpec`/`GalleryFrame` types (deliberately —
// ProductCategoryCard.tsx and ProductsGridSection.tsx consume whichever
// one is passed down without needing to know which source it came
// from), except `GalleryFrame.image` is a resolved `ContentImage` here
// instead of a raw local path string.
export type ProductSpecContent = { label: string; value: string };
export type ProductGalleryFrameContent = { label: string; image: ContentImage };
export type ProductCategoryContent = {
  name: string;
  specs: ProductSpecContent[];
  note?: string;
  gallery: ProductGalleryFrameContent[];
};

// Custom Section images (31 Aug 2026) — see customSectionMediaType.ts's
// own comment. Only the 12 images became Sanity-editable; the section's
// copy (captions, headline, attribute labels/blurbs) stays fixed in
// lib/customSection.ts, unchanged. Each field falls back to that file's
// current local image path when unset — see getCustomSectionMedia's own
// per-field fallback in lib/content/index.ts.
export type CustomSectionMediaContent = {
  processReference: ContentImage;
  processDevelopment: ContentImage;
  processCutting: ContentImage;
  processSample: ContentImage;
  processProduction: ContentImage;
  processFinished: ContentImage;
  swatchFabric: ContentImage;
  swatchColour: ContentImage;
  swatchFit: ContentImage;
  swatchConstruction: ContentImage;
  swatchPrint: ContentImage;
  swatchFinish: ContentImage;
};

// Catalog (31 Aug 2026) — see catalogType.ts's own comment. `pdfUrl`
// undefined means no real PDF has been uploaded yet — CatalogCtaSection
// keeps showing its existing placeholder-card/gated-modal behavior in
// that case, unchanged from before this type existed.
export type CatalogContent = {
  pdfUrl?: string;
  thumbnail: ContentImage;
};

// Text-copy content types (1 Sep 2026, owner: "make everything
// editable... all the text can be sanity based") — reverses the
// "copy stays fixed, code-level" call each of these sections' own
// lib file previously documented. Every field falls back to that
// file's current hardcoded string when unset — see each getter's own
// per-field fallback in lib/content/index.ts.
export type CustomProcessStepContent = { trackerLabel: string; caption: string };
export type CustomAttributeContent = { label: string; blurb: string };
export type CustomSectionCopyContent = {
  headline: string;
  processSteps: CustomProcessStepContent[];
  dividerLabel: string;
  attributes: CustomAttributeContent[];
};

export type SupplyRowContent = { label: string; copy: string };
export type SupplySectionCopyContent = {
  headlineLine1: string;
  headlineLine2: string;
  supportingLine1: string;
  supportingLine2: string;
  rows: SupplyRowContent[];
};

export type LongRunSectionCopyContent = {
  headlinePlain: string;
  headlineAccent: string;
  paragraph1Line1: string;
  paragraph1Line2: string;
  paragraph2Line1: string;
  paragraph2Line2: string;
};

export type CtaNudgeCopyContent = {
  line1: string;
  line2: string;
  buttonLabel: string;
};

export type TiruppurSubBlockContent = { label: string; copy: string };
export type OurStoryCopyContent = {
  pageTitlePlain: string;
  pageTitleAccent: string;
  listeningHeadlineLine1: string;
  listeningHeadlineLine2: string;
  listeningParagraph1: string;
  listeningParagraph2: string;
  tiruppurHeadlinePlain: string;
  tiruppurHeadlineAccent: string;
  tiruppurSubBlocks: TiruppurSubBlockContent[];
  tiruppurClosingBold: string;
  tiruppurClosingRest: string;
  founderHeadlineLine1: string;
  founderHeadlineLine2: string;
  founderParagraph1: string;
  founderParagraph2: string;
  founderParagraph3: string;
};

// Global CTA label + nav labels (1 Sep 2026) — added directly to
// SiteSettingsContent below rather than their own content type, since
// they're single strings alongside the footer/contact fields already
// living there, not a whole section's worth of copy.
