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
  // Google Search Console site-ownership verification (3 Sep 2026,
  // owner priority: set up now that a real sitemap exists) — Next's
  // built-in `verification.google` field renders the exact
  // `<meta name="google-site-verification" content="...">` tag Google
  // asked for, so ownership is proven the moment this deploys, without
  // waiting on a DNS record to propagate.
  verification: {
    google: "qNheJY44R4GJrv1ioTt0rEK4y0uKvcB_b0m7VNBfPhg",
  },
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
      {/* `overflow-x-hidden` on <html>/<body> added 9 Sep 2026 as a
          "defense in depth" layer alongside the real root-cause fix in
          TrustedByRow.tsx/CertificationsRow.tsx (see those files' own
          comments — an invisible measuring row wasn't clipped by its
          own container in the default state, letting its full width
          silently expand the page). REVERTED the same day, immediately
          after deploying: owner reported the live site couldn't be
          scrolled down past the first fold on a real phone at all —
          classic mobile-Safari behavior where forcing `overflow-x` on
          the ROOT element(s) can disable native touch/momentum
          scrolling entirely, not just the horizontal axis. This local
          dev environment's automated checks (`window.scrollTo`,
          `document.scrollX`) couldn't catch that: programmatic scroll
          calls bypass real touch-gesture handling, so they kept
          reporting success even though real touch scrolling was
          broken. The actual root-cause fix (the two components' own
          containers now correctly clip their invisible measuring row)
          doesn't touch `<html>`/`<body>` scroll behavior at all and
          was independently confirmed to stop the horizontal-overflow
          bug on its own — this global rule was only ever a belt-and-
          suspenders addition on top of that, not load-bearing, so
          removing it costs nothing but the extra safety margin. If a
          similar bug ever resurfaces, fix it at the component level
          (clip the specific offending element), not by touching
          `<html>`/`<body>` overflow again without testing on a real
          phone first. */}
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
