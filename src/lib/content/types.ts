import type { ArbitraryTypedObject } from "@portabletext/types";

// Frontend-facing content shapes. Deliberately decoupled from Sanity's raw
// document shape (see ../../sanity for that) — this is the "portable"
// boundary the Master Brief asks for (§5 Plan B): if Sanity is ever
// dropped, only lib/content/*.ts needs to change, not the components.

export type ContentImage = {
  url: string;
  alt: string;
} | null;

// Generic image-or-video media slot — editors pick one of the two fields
// in Sanity, video wins if both are set. `poster` is the image, used as
// the video's poster frame when both are present. Originally
// `HeroMedia` (Hero was the only Sanity-editable media slot); generalized
// 30 Aug 2026 when the same image/video toggle was extended to three more
// spots on `/our-story` (We Started by Listening, The Tiruppur Story, The
// Person Behind KIBO) — see `OurStoryContent` below. `HeroMedia` kept as
// an alias so Hero's own code/comments referencing that name don't need
// touching.
export type Media =
  | { type: "video"; url: string; poster: string | null }
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
};
