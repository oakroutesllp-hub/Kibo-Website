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
import type {
  ContentImage,
  Media,
  HomepageContent,
  OurStoryContent,
  ArticleContent,
  SiteSettingsContent,
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
};

const siteSettingsQuery = `*[_type == "siteSettings"][0]{
  footerBrandLines, footerAddress, footerEmail, enquiryEmail,
  linkedInUrl, instagramUrl, whatsappNumber, requireCatalogGate, showBlogInNav
}`;

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  if (!isSanityConfigured) {
    return {
      ...sampleSiteSettings,
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
    };
  } catch {
    return {
      ...sampleSiteSettings,
      enquiryEmail: sampleSiteSettings.footerEmail,
      whatsappDigits: toWhatsAppDigits(sampleSiteSettings.whatsappNumber),
    };
  }
}

export type {
  HomepageContent,
  OurStoryContent,
  ArticleContent,
  SiteSettingsContent,
  ContentImage,
  Media,
  Seo,
} from "./types";
