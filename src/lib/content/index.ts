import { sanityClient, isSanityConfigured } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import type { Image } from "sanity";
import type { ArbitraryTypedObject } from "@portabletext/types";
import {
  sampleHomepage,
  sampleOurStory,
  sampleArticles,
  sampleSiteSettings,
} from "./sampleContent";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";
import {
  CUSTOM_PROCESS_STEPS,
  CUSTOM_ATTRIBUTES,
  CUSTOM_SECTION_HEADLINE,
  CUSTOM_SECTION_DIVIDER_LABEL,
} from "@/lib/customSection";
import { SUPPLY_HEADLINE_LINE_1, SUPPLY_HEADLINE_LINE_2, SUPPLY_SUPPORTING_LINE_1, SUPPLY_SUPPORTING_LINE_2, SUPPLY_ROWS } from "@/lib/supplySection";
import {
  LONG_RUN_HEADLINE_PLAIN,
  LONG_RUN_HEADLINE_ACCENT,
  LONG_RUN_PARAGRAPH_1_LINE_1,
  LONG_RUN_PARAGRAPH_1_LINE_2,
  LONG_RUN_PARAGRAPH_2_LINE_1,
  LONG_RUN_PARAGRAPH_2_LINE_2,
} from "@/lib/longRunSection";
import { CTA_NUDGE_LINE_1, CTA_NUDGE_LINE_2, CTA_NUDGE_BUTTON_LABEL } from "@/lib/ctaNudge";
import {
  OUR_STORY_PLAIN,
  OUR_STORY_ACCENT,
  LISTENING_HEADLINE_LINE_1,
  LISTENING_HEADLINE_LINE_2,
  LISTENING_PARAGRAPH_1,
  LISTENING_PARAGRAPH_2,
} from "@/lib/ourStory";
import {
  TIRUPPUR_HEADLINE_LINE_1,
  TIRUPPUR_HEADLINE_ACCENT,
  TIRUPPUR_SUB_BLOCKS,
  TIRUPPUR_CLOSING_BOLD,
  TIRUPPUR_CLOSING_REST,
} from "@/lib/tiruppurSection";
import {
  FOUNDER_HEADLINE_LINE_1,
  FOUNDER_HEADLINE_LINE_2,
  FOUNDER_PARAGRAPH_1,
  FOUNDER_PARAGRAPH_2,
  FOUNDER_PARAGRAPH_3,
} from "@/lib/founderSection";
import type {
  ContentImage,
  Media,
  HomepageContent,
  OurStoryContent,
  ArticleContent,
  SiteSettingsContent,
  ProductCategoryContent,
  CustomSectionMediaContent,
  CatalogContent,
  CustomSectionCopyContent,
  SupplySectionCopyContent,
  LongRunSectionCopyContent,
  CtaNudgeCopyContent,
  OurStoryCopyContent,
  Seo,
} from "./types";

// The public content API for the app. Every page should read content
// through these functions, never through sanity/client.ts directly — that
// keeps the Sanity dependency swappable (Master Brief §5, Plan B) and
// means the site renders sample content out of the box before a Sanity
// project is connected, rather than an empty/broken page.

function resolveImage(image: Image | undefined, alt: string): ContentImage {
  if (!image?.asset) return null;
  return { url: urlForImage(image).width(1600).url(), alt };
}

// Generalized from `resolveHeroMedia`, 30 Aug 2026, once the same
// image/video toggle mechanism was reused for 3 more media slots on
// `/our-story` (see OurStoryContent) — behavior unchanged, just no
// longer named after the one field it originally served.
function resolveMedia(
  image: Image | undefined,
  videoUrl: string | undefined,
  alt: string,
): Media {
  if (videoUrl) {
    return {
      type: "video",
      url: videoUrl,
      poster: resolveImage(image, alt)?.url ?? null,
    };
  }
  const resolved = resolveImage(image, alt);
  return resolved ? { type: "image", url: resolved.url, alt: resolved.alt } : null;
}

// wa.me links need digits only (no +, spaces, or leading zero) — derived
// from the human-entered display number in one place so the footer's
// Contact line and the floating WhatsApp button always agree.
function toWhatsAppDigits(number: string | undefined): string | undefined {
  if (!number) return undefined;
  const digits = number.replace(/\D/g, "");
  return digits || undefined;
}

function resolveSeo(seo: RawSeo | undefined): Seo {
  return {
    metaTitle: seo?.metaTitle,
    metaDescription: seo?.metaDescription,
    ogImageUrl: seo?.ogImage
      ? urlForImage(seo.ogImage).width(1200).url()
      : undefined,
  };
}

type RawSeo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: Image;
};

type RawHomepage = {
  heroHeading?: string;
  heroSubheading?: string;
  heroMedia?: Image;
  heroVideoUrl?: string;
  seo?: RawSeo;
};

const homepageQuery = `*[_type == "homepage"][0]{
  heroHeading, heroSubheading, heroMedia,
  "heroVideoUrl": heroVideo.asset->url,
  seo
}`;

export async function getHomepage(): Promise<HomepageContent> {
  if (!isSanityConfigured) return sampleHomepage;

  try {
    const doc = await sanityClient.fetch<RawHomepage | null>(
      homepageQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return sampleHomepage;

    return {
      heroHeading: doc.heroHeading || sampleHomepage.heroHeading,
      heroSubheading: doc.heroSubheading || sampleHomepage.heroSubheading,
      // `?? sampleHomepage.heroMedia` (28 Aug 2026) — same per-field
      // fallback pattern already used for heroHeading/heroSubheading
      // above, extended to heroMedia: Sanity is connected and has a real
      // homepage document, but no hero image has been uploaded there
      // yet, so `resolveHeroMedia` returns null and the page would show
      // a bare gray placeholder box for the very first thing every
      // visitor sees. Falls back to the temporary bright placeholder
      // photo in sampleContent.ts until a real image is set in Sanity —
      // once one is, `resolveHeroMedia` returns non-null and this
      // fallback stops applying automatically, no code change needed.
      heroMedia:
        resolveMedia(doc.heroMedia, doc.heroVideoUrl, doc.heroHeading || "KIBO") ??
        sampleHomepage.heroMedia,
      seo: resolveSeo(doc.seo),
    };
  } catch {
    return sampleHomepage;
  }
}

type RawOurStory = {
  listeningMedia?: Image;
  listeningVideoUrl?: string;
  tiruppurMedia?: Image;
  tiruppurVideoUrl?: string;
  founderMedia?: Image;
  founderVideoUrl?: string;
};

const ourStoryQuery = `*[_type == "ourStory"][0]{
  listeningMedia, "listeningVideoUrl": listeningVideo.asset->url,
  tiruppurMedia, "tiruppurVideoUrl": tiruppurVideo.asset->url,
  founderMedia, "founderVideoUrl": founderVideo.asset->url
}`;

// `/our-story` page media — see OurStoryContent's own comment. Same
// per-field-fallback shape as `getHomepage` above, just 3 media fields
// instead of 1 (no heading/subheading text fields — those 3 sections'
// copy stays fixed/code-level, only their media became Sanity-editable).
export async function getOurStory(): Promise<OurStoryContent> {
  if (!isSanityConfigured) return sampleOurStory;

  try {
    const doc = await sanityClient.fetch<RawOurStory | null>(
      ourStoryQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return sampleOurStory;

    return {
      listeningMedia:
        resolveMedia(doc.listeningMedia, doc.listeningVideoUrl, "") ??
        sampleOurStory.listeningMedia,
      tiruppurMedia:
        resolveMedia(doc.tiruppurMedia, doc.tiruppurVideoUrl, "") ??
        sampleOurStory.tiruppurMedia,
      founderMedia:
        resolveMedia(doc.founderMedia, doc.founderVideoUrl, "") ??
        sampleOurStory.founderMedia,
    };
  } catch {
    return sampleOurStory;
  }
}

type RawArticle = {
  title: string;
  slug: { current: string };
  coverImage?: Image;
  excerpt?: string;
  body?: ArbitraryTypedObject[];
  publishedAt?: string;
  category?: string;
  linkedInUrl?: string;
  seo?: RawSeo;
};

const articlesQuery = `*[_type == "article"] | order(publishedAt desc){
  title, slug, coverImage, excerpt, publishedAt, category, seo
}`;
const articleBySlugQuery = `*[_type == "article" && slug.current == $slug][0]{
  title, slug, coverImage, excerpt, body, publishedAt, category, linkedInUrl, seo
}`;

function mapArticle(doc: RawArticle): ArticleContent {
  return {
    title: doc.title,
    slug: doc.slug.current,
    coverImage: resolveImage(doc.coverImage, doc.title),
    excerpt: doc.excerpt,
    body: doc.body || [],
    publishedAt: doc.publishedAt,
    category: doc.category,
    linkedInUrl: doc.linkedInUrl,
    seo: resolveSeo(doc.seo),
  };
}

export async function getArticles(): Promise<ArticleContent[]> {
  if (!isSanityConfigured) return sampleArticles;

  try {
    const docs = await sanityClient.fetch<RawArticle[]>(
      articlesQuery,
      {},
      { cache: "no-store" },
    );
    return docs.length ? docs.map(mapArticle) : sampleArticles;
  } catch {
    return sampleArticles;
  }
}

export async function getArticle(slug: string): Promise<ArticleContent | null> {
  if (!isSanityConfigured) {
    return sampleArticles.find((a) => a.slug === slug) ?? null;
  }

  try {
    const doc = await sanityClient.fetch<RawArticle | null>(
      articleBySlugQuery,
      { slug },
      { cache: "no-store" },
    );
    // Falls back to a matching sample article on a Sanity "not found"
    // result, not just on a thrown error — found and fixed 31 Aug 2026
    // while testing the new Blog listing: `getArticles()` (the list)
    // already falls back to sample data whenever Sanity returns zero
    // real articles, but this per-slug lookup previously only fell back
    // on an actual fetch error, so clicking through from that
    // sample-data list into a specific sample post 404'd once Sanity
    // was connected but still empty — the list and detail page
    // disagreed about whether sample content was "real." Same
    // simplification `getArticles()` already accepts: this doesn't
    // distinguish "no real articles exist at all" from "some exist, but
    // not this slug" — a real published article would only collide
    // with a sample slug in the extremely unlikely case of an editor
    // choosing the exact same internal placeholder slug.
    return doc ? mapArticle(doc) : sampleArticles.find((a) => a.slug === slug) ?? null;
  } catch {
    return sampleArticles.find((a) => a.slug === slug) ?? null;
  }
}

type RawSiteSettings = {
  footerBrandLines?: string[];
  footerAddress?: string;
  footerEmail?: string;
  enquiryEmail?: string;
  linkedInUrl?: string;
  instagramUrl?: string;
  whatsappNumber?: string;
  requireCatalogGate?: boolean;
  showBlogInNav?: boolean;
  getInTouchLabel?: string;
  navLabelHome?: string;
  navLabelProducts?: string;
  navLabelCatalog?: string;
  navLabelBlog?: string;
  navLabelOurStory?: string;
};

const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  footerBrandLines, footerAddress, footerEmail, enquiryEmail,
  linkedInUrl, instagramUrl, whatsappNumber, requireCatalogGate, showBlogInNav,
  getInTouchLabel, navLabelHome, navLabelProducts, navLabelCatalog, navLabelBlog, navLabelOurStory
}`;

// Hardcoded defaults for the global CTA label + nav labels (1 Sep
// 2026) — these mirror NAV_LINKS' own labels in lib/navigation.ts and
// the "Get in touch" text every trigger site-wide used before this
// field existed. Kept here (not in sampleContent.ts) since they're not
// placeholder/demo content — they're the actual current production
// copy, same reasoning fallbackProductCategories() below already
// documents for reusing real code data as a fallback rather than
// sampleContent.ts's usual placeholder pattern.
const DEFAULT_NAV_LABELS = {
  getInTouchLabel: "Get in touch",
  navLabelHome: "Home",
  navLabelProducts: "Products",
  navLabelCatalog: "Catalog",
  navLabelBlog: "Blog",
  navLabelOurStory: "Our Story",
};

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  if (!isSanityConfigured) {
    return {
      ...sampleSiteSettings,
      ...DEFAULT_NAV_LABELS,
      enquiryEmail: sampleSiteSettings.footerEmail,
      whatsappDigits: toWhatsAppDigits(sampleSiteSettings.whatsappNumber),
    };
  }

  try {
    const doc = await sanityClient.fetch<RawSiteSettings | null>(
      siteSettingsQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) {
      return {
        ...sampleSiteSettings,
        enquiryEmail: sampleSiteSettings.footerEmail,
        whatsappDigits: toWhatsAppDigits(sampleSiteSettings.whatsappNumber),
      };
    }

    return {
      footerBrandLines:
        doc.footerBrandLines?.length
          ? doc.footerBrandLines
          : sampleSiteSettings.footerBrandLines,
      footerAddress: doc.footerAddress || sampleSiteSettings.footerAddress,
      footerEmail: doc.footerEmail || sampleSiteSettings.footerEmail,
      // Falls back to the resolved `footerEmail` (not
      // `sampleSiteSettings.footerEmail` directly) — see this field's
      // own comment in types.ts: "where enquiries land" should default
      // to "wherever the footer email is," even if that itself came
      // from Sanity rather than the sample fallback.
      enquiryEmail:
        doc.enquiryEmail || doc.footerEmail || sampleSiteSettings.footerEmail,
      linkedInUrl: doc.linkedInUrl,
      instagramUrl: doc.instagramUrl,
      whatsappNumber: doc.whatsappNumber || sampleSiteSettings.whatsappNumber,
      whatsappDigits: toWhatsAppDigits(
        doc.whatsappNumber || sampleSiteSettings.whatsappNumber,
      ),
      // `??`, not `||` — `false` (gate explicitly turned OFF) is a real,
      // meaningful value that `||` would wrongly treat as "unset" and
      // fall back past. Only actual `undefined` (field never touched in
      // Sanity) falls back to the default-on sample value.
      requireCatalogGate: doc.requireCatalogGate ?? sampleSiteSettings.requireCatalogGate,
      // Same `??` reasoning as `requireCatalogGate` just above — `false`
      // is meaningful here too (though it also happens to be the
      // default, unlike the gate).
      showBlogInNav: doc.showBlogInNav ?? sampleSiteSettings.showBlogInNav,
      getInTouchLabel: doc.getInTouchLabel || DEFAULT_NAV_LABELS.getInTouchLabel,
      navLabelHome: doc.navLabelHome || DEFAULT_NAV_LABELS.navLabelHome,
      navLabelProducts: doc.navLabelProducts || DEFAULT_NAV_LABELS.navLabelProducts,
      navLabelCatalog: doc.navLabelCatalog || DEFAULT_NAV_LABELS.navLabelCatalog,
      navLabelBlog: doc.navLabelBlog || DEFAULT_NAV_LABELS.navLabelBlog,
      navLabelOurStory: doc.navLabelOurStory || DEFAULT_NAV_LABELS.navLabelOurStory,
    };
  } catch {
    return {
      ...sampleSiteSettings,
      ...DEFAULT_NAV_LABELS,
      enquiryEmail: sampleSiteSettings.footerEmail,
      whatsappDigits: toWhatsAppDigits(sampleSiteSettings.whatsappNumber),
    };
  }
}

// Product Categories (31 Aug 2026) — see productCategoryType.ts's own
// comment. Falls back to the existing PRODUCT_CATEGORIES code data
// (lib/productCategories.ts) — not sampleContent.ts's usual placeholder
// pattern, since that file's data IS the current real, live content,
// not a placeholder standing in for something better; converting it to
// this content type's shape keeps the grid unchanged until real
// documents exist in Sanity.
type RawProductCategory = {
  name: string;
  specs?: { label: string; value: string }[];
  note?: string;
  gallery?: { label: string; image?: Image }[];
};

const productCategoriesQuery = `*[_type == "productCategory"] | order(order asc){
  name, specs, note, gallery[]{label, image}
}`;

function fallbackProductCategories(): ProductCategoryContent[] {
  return PRODUCT_CATEGORIES.map((category) => ({
    name: category.name,
    specs: category.specs,
    note: category.note,
    gallery: category.gallery.map((frame) => ({
      label: frame.label,
      image: frame.image ? { url: frame.image, alt: frame.label } : null,
    })),
  }));
}

export async function getProductCategories(): Promise<ProductCategoryContent[]> {
  const fallback = fallbackProductCategories();
  if (!isSanityConfigured) return fallback;

  try {
    const docs = await sanityClient.fetch<RawProductCategory[]>(
      productCategoriesQuery,
      {},
      { cache: "no-store" },
    );
    if (!docs.length) return fallback;

    return docs.map((doc) => ({
      name: doc.name,
      specs: doc.specs ?? [],
      note: doc.note,
      gallery: (doc.gallery ?? []).map((frame) => ({
        label: frame.label,
        image: resolveImage(frame.image, frame.label),
      })),
    }));
  } catch {
    return fallback;
  }
}

// Custom Section images (31 Aug 2026) — see customSectionMediaType.ts's
// own comment. Per-field fallback to lib/customSection.ts's current
// local image paths, same pattern as every other media slot in this
// file — a document that exists but has some fields still empty keeps
// showing the current image in just those slots, not a broken/blank box.
type RawCustomSectionMedia = {
  processReference?: Image;
  processDevelopment?: Image;
  processCutting?: Image;
  processSample?: Image;
  processProduction?: Image;
  processFinished?: Image;
  swatchFabric?: Image;
  swatchColour?: Image;
  swatchFit?: Image;
  swatchConstruction?: Image;
  swatchPrint?: Image;
  swatchFinish?: Image;
};

const customSectionMediaQuery = `*[_type == "customSectionMedia"][0]{
  processReference, processDevelopment, processCutting,
  processSample, processProduction, processFinished,
  swatchFabric, swatchColour, swatchFit, swatchConstruction, swatchPrint, swatchFinish
}`;

function fallbackCustomSectionMedia(): CustomSectionMediaContent {
  const step = (number: string): ContentImage => {
    const found = CUSTOM_PROCESS_STEPS.find((s) => s.number === number);
    return found ? { url: found.image, alt: found.imageAlt } : null;
  };
  const attr = (icon: string): ContentImage => {
    const found = CUSTOM_ATTRIBUTES.find((a) => a.icon === icon);
    return found ? { url: found.image, alt: found.imageAlt } : null;
  };
  return {
    processReference: step("01"),
    processDevelopment: step("02"),
    processCutting: step("03"),
    processSample: step("04"),
    processProduction: step("05"),
    processFinished: step("06"),
    swatchFabric: attr("fabric"),
    swatchColour: attr("colour"),
    swatchFit: attr("fit"),
    swatchConstruction: attr("construction"),
    swatchPrint: attr("print"),
    swatchFinish: attr("finish"),
  };
}

export async function getCustomSectionMedia(): Promise<CustomSectionMediaContent> {
  const fallback = fallbackCustomSectionMedia();
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityClient.fetch<RawCustomSectionMedia | null>(
      customSectionMediaQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return fallback;

    return {
      processReference: resolveImage(doc.processReference, "Reference / specification") ?? fallback.processReference,
      processDevelopment: resolveImage(doc.processDevelopment, "Development") ?? fallback.processDevelopment,
      processCutting: resolveImage(doc.processCutting, "Cutting / sewing") ?? fallback.processCutting,
      processSample: resolveImage(doc.processSample, "Sample / inspection") ?? fallback.processSample,
      processProduction: resolveImage(doc.processProduction, "Production") ?? fallback.processProduction,
      processFinished: resolveImage(doc.processFinished, "Finished garment") ?? fallback.processFinished,
      swatchFabric: resolveImage(doc.swatchFabric, "Fabric") ?? fallback.swatchFabric,
      swatchColour: resolveImage(doc.swatchColour, "Colour") ?? fallback.swatchColour,
      swatchFit: resolveImage(doc.swatchFit, "Fit") ?? fallback.swatchFit,
      swatchConstruction: resolveImage(doc.swatchConstruction, "Construction") ?? fallback.swatchConstruction,
      swatchPrint: resolveImage(doc.swatchPrint, "Print") ?? fallback.swatchPrint,
      swatchFinish: resolveImage(doc.swatchFinish, "Finish") ?? fallback.swatchFinish,
    };
  } catch {
    return fallback;
  }
}

// Catalog (31 Aug 2026) — see catalogType.ts's own comment. No sample
// fallback needed beyond "nothing uploaded yet" (`pdfUrl: undefined,
// thumbnail: null`) — CatalogCtaSection.tsx already has its own
// placeholder-card UI for exactly that state, unchanged from before
// this content type existed.
type RawCatalog = { pdfUrl?: string; thumbnail?: Image };

const catalogQuery = `*[_type == "catalog"][0]{
  "pdfUrl": pdf.asset->url, thumbnail
}`;

export async function getCatalog(): Promise<CatalogContent> {
  const empty: CatalogContent = { pdfUrl: undefined, thumbnail: null };
  if (!isSanityConfigured) return empty;

  try {
    const doc = await sanityClient.fetch<RawCatalog | null>(
      catalogQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return empty;

    return {
      pdfUrl: doc.pdfUrl,
      thumbnail: resolveImage(doc.thumbnail, "KIBO Catalog"),
    };
  } catch {
    return empty;
  }
}

// Text-copy content (1 Sep 2026) — see each schema file's own comment
// (customSectionCopyType.ts etc.) for the full reasoning. Every
// getter follows the exact same per-field fallback pattern as the
// media/image content above: a document that exists but has some
// fields still empty keeps showing the current hardcoded copy in just
// those slots, not a blank string.

function fallbackCustomSectionCopy(): CustomSectionCopyContent {
  return {
    headline: CUSTOM_SECTION_HEADLINE,
    processSteps: CUSTOM_PROCESS_STEPS.map((s) => ({ trackerLabel: s.trackerLabel, caption: s.caption })),
    dividerLabel: CUSTOM_SECTION_DIVIDER_LABEL,
    attributes: CUSTOM_ATTRIBUTES.map((a) => ({ label: a.label, blurb: a.blurb })),
  };
}

type RawCustomSectionCopy = {
  headline?: string;
  processSteps?: { trackerLabel?: string; caption?: string }[];
  dividerLabel?: string;
  attributes?: { label?: string; blurb?: string }[];
};

const customSectionCopyQuery = `*[_type == "customSectionCopy"][0]{
  headline, processSteps[]{trackerLabel, caption}, dividerLabel, attributes[]{label, blurb}
}`;

// Arrays are zipped POSITIONALLY against the fixed 6-item fallback
// arrays — array order is the correspondence to each fixed image slot
// (Reference is always position 0, Fabric is always position 0 of
// attributes), same convention productCategory's own `gallery` array
// already uses. A document with fewer than 6 items just falls back to
// the remaining fixed entries for whichever positions are missing,
// rather than shrinking the tracker/grid to fewer than 6 columns.
export async function getCustomSectionCopy(): Promise<CustomSectionCopyContent> {
  const fallback = fallbackCustomSectionCopy();
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityClient.fetch<RawCustomSectionCopy | null>(
      customSectionCopyQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return fallback;

    return {
      headline: doc.headline || fallback.headline,
      processSteps: fallback.processSteps.map((step, i) => ({
        trackerLabel: doc.processSteps?.[i]?.trackerLabel || step.trackerLabel,
        caption: doc.processSteps?.[i]?.caption || step.caption,
      })),
      dividerLabel: doc.dividerLabel || fallback.dividerLabel,
      attributes: fallback.attributes.map((attr, i) => ({
        label: doc.attributes?.[i]?.label || attr.label,
        blurb: doc.attributes?.[i]?.blurb || attr.blurb,
      })),
    };
  } catch {
    return fallback;
  }
}

function fallbackSupplySectionCopy(): SupplySectionCopyContent {
  return {
    headlineLine1: SUPPLY_HEADLINE_LINE_1,
    headlineLine2: SUPPLY_HEADLINE_LINE_2,
    supportingLine1: SUPPLY_SUPPORTING_LINE_1,
    supportingLine2: SUPPLY_SUPPORTING_LINE_2,
    rows: SUPPLY_ROWS.map((r) => ({ label: r.label, copy: r.copy })),
  };
}

type RawSupplySectionCopy = {
  headlineLine1?: string;
  headlineLine2?: string;
  supportingLine1?: string;
  supportingLine2?: string;
  rows?: { label?: string; copy?: string }[];
};

const supplySectionCopyQuery = `*[_type == "supplySectionCopy"][0]{
  headlineLine1, headlineLine2, supportingLine1, supportingLine2, rows[]{label, copy}
}`;

export async function getSupplySectionCopy(): Promise<SupplySectionCopyContent> {
  const fallback = fallbackSupplySectionCopy();
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityClient.fetch<RawSupplySectionCopy | null>(
      supplySectionCopyQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return fallback;

    return {
      headlineLine1: doc.headlineLine1 || fallback.headlineLine1,
      headlineLine2: doc.headlineLine2 || fallback.headlineLine2,
      supportingLine1: doc.supportingLine1 || fallback.supportingLine1,
      supportingLine2: doc.supportingLine2 || fallback.supportingLine2,
      rows: fallback.rows.map((row, i) => ({
        label: doc.rows?.[i]?.label || row.label,
        copy: doc.rows?.[i]?.copy || row.copy,
      })),
    };
  } catch {
    return fallback;
  }
}

function fallbackLongRunSectionCopy(): LongRunSectionCopyContent {
  return {
    headlinePlain: LONG_RUN_HEADLINE_PLAIN,
    headlineAccent: LONG_RUN_HEADLINE_ACCENT,
    paragraph1Line1: LONG_RUN_PARAGRAPH_1_LINE_1,
    paragraph1Line2: LONG_RUN_PARAGRAPH_1_LINE_2,
    paragraph2Line1: LONG_RUN_PARAGRAPH_2_LINE_1,
    paragraph2Line2: LONG_RUN_PARAGRAPH_2_LINE_2,
  };
}

type RawLongRunSectionCopy = Partial<LongRunSectionCopyContent>;

const longRunSectionCopyQuery = `*[_type == "longRunSectionCopy"][0]{
  headlinePlain, headlineAccent, paragraph1Line1, paragraph1Line2, paragraph2Line1, paragraph2Line2
}`;

export async function getLongRunSectionCopy(): Promise<LongRunSectionCopyContent> {
  const fallback = fallbackLongRunSectionCopy();
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityClient.fetch<RawLongRunSectionCopy | null>(
      longRunSectionCopyQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return fallback;

    return {
      headlinePlain: doc.headlinePlain || fallback.headlinePlain,
      headlineAccent: doc.headlineAccent || fallback.headlineAccent,
      paragraph1Line1: doc.paragraph1Line1 || fallback.paragraph1Line1,
      paragraph1Line2: doc.paragraph1Line2 || fallback.paragraph1Line2,
      paragraph2Line1: doc.paragraph2Line1 || fallback.paragraph2Line1,
      paragraph2Line2: doc.paragraph2Line2 || fallback.paragraph2Line2,
    };
  } catch {
    return fallback;
  }
}

function fallbackCtaNudgeCopy(): CtaNudgeCopyContent {
  return {
    line1: CTA_NUDGE_LINE_1,
    line2: CTA_NUDGE_LINE_2,
    buttonLabel: CTA_NUDGE_BUTTON_LABEL,
  };
}

type RawCtaNudgeCopy = Partial<CtaNudgeCopyContent>;

const ctaNudgeCopyQuery = `*[_type == "ctaNudgeCopy"][0]{ line1, line2, buttonLabel }`;

export async function getCtaNudgeCopy(): Promise<CtaNudgeCopyContent> {
  const fallback = fallbackCtaNudgeCopy();
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityClient.fetch<RawCtaNudgeCopy | null>(
      ctaNudgeCopyQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return fallback;

    return {
      line1: doc.line1 || fallback.line1,
      line2: doc.line2 || fallback.line2,
      buttonLabel: doc.buttonLabel || fallback.buttonLabel,
    };
  } catch {
    return fallback;
  }
}

function fallbackOurStoryCopy(): OurStoryCopyContent {
  return {
    pageTitlePlain: OUR_STORY_PLAIN,
    pageTitleAccent: OUR_STORY_ACCENT,
    listeningHeadlineLine1: LISTENING_HEADLINE_LINE_1,
    listeningHeadlineLine2: LISTENING_HEADLINE_LINE_2,
    listeningParagraph1: LISTENING_PARAGRAPH_1,
    listeningParagraph2: LISTENING_PARAGRAPH_2,
    tiruppurHeadlinePlain: TIRUPPUR_HEADLINE_LINE_1,
    tiruppurHeadlineAccent: TIRUPPUR_HEADLINE_ACCENT,
    tiruppurSubBlocks: TIRUPPUR_SUB_BLOCKS.map((b) => ({ label: b.label, copy: b.copy })),
    tiruppurClosingBold: TIRUPPUR_CLOSING_BOLD,
    tiruppurClosingRest: TIRUPPUR_CLOSING_REST,
    founderHeadlineLine1: FOUNDER_HEADLINE_LINE_1,
    founderHeadlineLine2: FOUNDER_HEADLINE_LINE_2,
    founderParagraph1: FOUNDER_PARAGRAPH_1,
    founderParagraph2: FOUNDER_PARAGRAPH_2,
    founderParagraph3: FOUNDER_PARAGRAPH_3,
  };
}

type RawOurStoryCopy = Partial<Omit<OurStoryCopyContent, "tiruppurSubBlocks">> & {
  tiruppurSubBlocks?: { label?: string; copy?: string }[];
};

const ourStoryCopyQuery = `*[_type == "ourStoryCopy"][0]{
  pageTitlePlain, pageTitleAccent,
  listeningHeadlineLine1, listeningHeadlineLine2, listeningParagraph1, listeningParagraph2,
  tiruppurHeadlinePlain, tiruppurHeadlineAccent, tiruppurSubBlocks[]{label, copy},
  tiruppurClosingBold, tiruppurClosingRest,
  founderHeadlineLine1, founderHeadlineLine2, founderParagraph1, founderParagraph2, founderParagraph3
}`;

export async function getOurStoryCopy(): Promise<OurStoryCopyContent> {
  const fallback = fallbackOurStoryCopy();
  if (!isSanityConfigured) return fallback;

  try {
    const doc = await sanityClient.fetch<RawOurStoryCopy | null>(
      ourStoryCopyQuery,
      {},
      { cache: "no-store" },
    );
    if (!doc) return fallback;

    return {
      pageTitlePlain: doc.pageTitlePlain || fallback.pageTitlePlain,
      pageTitleAccent: doc.pageTitleAccent || fallback.pageTitleAccent,
      listeningHeadlineLine1: doc.listeningHeadlineLine1 || fallback.listeningHeadlineLine1,
      listeningHeadlineLine2: doc.listeningHeadlineLine2 || fallback.listeningHeadlineLine2,
      listeningParagraph1: doc.listeningParagraph1 || fallback.listeningParagraph1,
      listeningParagraph2: doc.listeningParagraph2 || fallback.listeningParagraph2,
      tiruppurHeadlinePlain: doc.tiruppurHeadlinePlain || fallback.tiruppurHeadlinePlain,
      tiruppurHeadlineAccent: doc.tiruppurHeadlineAccent || fallback.tiruppurHeadlineAccent,
      tiruppurSubBlocks: fallback.tiruppurSubBlocks.map((block, i) => ({
        label: doc.tiruppurSubBlocks?.[i]?.label || block.label,
        copy: doc.tiruppurSubBlocks?.[i]?.copy || block.copy,
      })),
      tiruppurClosingBold: doc.tiruppurClosingBold || fallback.tiruppurClosingBold,
      tiruppurClosingRest: doc.tiruppurClosingRest || fallback.tiruppurClosingRest,
      founderHeadlineLine1: doc.founderHeadlineLine1 || fallback.founderHeadlineLine1,
      founderHeadlineLine2: doc.founderHeadlineLine2 || fallback.founderHeadlineLine2,
      founderParagraph1: doc.founderParagraph1 || fallback.founderParagraph1,
      founderParagraph2: doc.founderParagraph2 || fallback.founderParagraph2,
      founderParagraph3: doc.founderParagraph3 || fallback.founderParagraph3,
    };
  } catch {
    return fallback;
  }
}

export type {
  HomepageContent,
  OurStoryContent,
  ArticleContent,
  SiteSettingsContent,
  ProductCategoryContent,
  ProductSpecContent,
  ProductGalleryFrameContent,
  CustomSectionMediaContent,
  CatalogContent,
  CustomProcessStepContent,
  CustomAttributeContent,
  CustomSectionCopyContent,
  SupplyRowContent,
  SupplySectionCopyContent,
  LongRunSectionCopyContent,
  CtaNudgeCopyContent,
  TiruppurSubBlockContent,
  OurStoryCopyContent,
  ContentImage,
  Media,
  Seo,
} from "./types";
