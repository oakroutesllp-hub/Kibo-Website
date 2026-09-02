import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SITE_URL } from "@/lib/siteUrl";
import { getSiteSettings } from "@/lib/content";

// Brand spec: "Primary typography direction: Montserrat... Bold/Semibold
// and Regular/Light weights." Montserrat is a variable font, so the full
// weight range is available via standard Tailwind utilities
// (font-light / font-normal / font-semibold / font-bold).
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

// `metadataBase` added 2 Sep 2026 (SEO pass) — without it, any relative
// URL used in metadata (e.g. a page missing its own absolute `og:image`)
// resolves against whatever host actually served the request, which for
// a Vercel deploy can be a preview URL, not the real domain. Every
// `ogImageUrl` this site sets today already comes from Sanity's own CDN
// as a full URL, so this is a correctness/best-practice addition rather
// than a fix for an active bug — but it's the base every future
// relative metadata URL resolves against, so it belongs here regardless.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "KIBO",
  description: "KIBO — B2B men's apparel merchant exporter from India.",
};

// Organization structured data (JSON-LD), 2 Sep 2026 (SEO pass) —
// tells search engines what kind of entity this site represents (not
// just what each page's text says), which can surface as a knowledge-
// panel-style result and is what most SEO checklists mean by
// "structured data." Site-wide on the root layout, not per-page, since
// an Organization only needs declaring once. Pulled from the same
// `getSiteSettings()` every other page already calls (cached the same
// 60 seconds as everything else) rather than hardcoded, so LinkedIn/
// Instagram/contact-email here always match what's actually live in
// the footer — `sameAs`/`email` are omitted entirely when unset rather
// than emitted empty, since an empty string in either is worse than no
// claim at all.
async function OrganizationJsonLd() {
  const settings = await getSiteSettings();
  const sameAs = [settings.linkedInUrl, settings.instagramUrl].filter(
    (url): url is string => Boolean(url),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "KIBO",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/kibo-logo.png`,
    ...(sameAs.length ? { sameAs } : {}),
    ...(settings.footerEmail ? { email: settings.footerEmail } : {}),
  };

  return (
    <script
      type="application/ld+json"
      // Safe here: `jsonLd` is built entirely from our own typed fields
      // above (a fixed name/url/logo plus site-settings strings already
      // rendered as plain text elsewhere on the site, e.g. the footer),
      // never from unsanitized third-party input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <OrganizationJsonLd />
        {children}
        {/* Vercel Analytics, 2 Sep 2026 (owner priority-2 fix, after the
            "no way to know if any of this is reaching real visitors"
            assessment) — chosen over Google Analytics specifically
            because it's cookieless: it counts aggregate page views and
            traffic sources without setting a tracking cookie or
            following any one visitor across other sites, so it doesn't
            trigger the "you must show a cookie consent banner" duty
            most jurisdictions attach to cross-site tracking cookies.
            Already free on Vercel's plan this site is hosted on — no
            new account, no new bill. Numbers show up in the Vercel
            dashboard (not visible on the site itself); nothing to wire
            up in Sanity, this isn't owner-editable content. */}
        <Analytics />
      </body>
    </html>
  );
}
