import Image from "next/image";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { MediaCarousel } from "@/components/MediaCarousel";
import type { HomepageContent } from "@/lib/content";

// Website Architecture §01 HERO, rebuilt taller/more immersive per
// KIBO_Brand_and_Copy_Direction.md "Hero height & top nav treatment"
// (resolved 25 Aug 2026) — supersedes the earlier stacked "text block,
// then media block below it" layout.
//
// Full-bleed: media fills the entire section as an absolute background
// layer; text overlays directly on top of it, rather than sitting in its
// own band above the media. The nav (see Nav.tsx) floats transparently
// over this same section — a light top-to-middle scrim keeps both the
// nav and the heading/subheading legible over the photo, without
// depending on a light/reversed logo variant that doesn't exist (a dark
// scrim + light text would need one; this doesn't).
//
// `dvh` not `100vh` (per the doc's explicit technical note): raw `100vh`
// jumps as mobile Safari's address bar shows/hides; `dvh` tracks the
// real visible area instead.
//
// Text content is padded from the top enough to clear the fixed nav
// (~89px, see Nav.tsx) — re-measure and adjust `pt-28`/`sm:pt-32` below
// if Nav's height changes.
export function Hero({
  content,
  carouselSeconds,
}: {
  content: HomepageContent;
  carouselSeconds?: number;
}) {
  return (
    <section id="hero" className="relative h-dvh min-h-[32rem] w-full overflow-hidden">
      <div className="absolute inset-0">
        {content.heroMedia?.type === "video" ? (
          <video
            src={content.heroMedia.url}
            poster={content.heroMedia.poster ?? undefined}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        ) : content.heroMedia?.type === "carousel" ? (
          <MediaCarousel images={content.heroMedia.images} sizes="100vw" intervalSeconds={carouselSeconds} />
        ) : content.heroMedia?.type === "image" ? (
          // `sizes="100vw"` (2 Sep 2026, performance pass — owner:
          // "lazy loading or other techniques... better this
          // [Lighthouse] rating") — every `fill` image site-wide was
          // missing an explicit `sizes` prop, which makes Next.js
          // default to `sizes="100vw"` and always request the largest
          // responsive variant regardless of the image's actual
          // rendered size. Hero genuinely IS full-viewport-width, so
          // `100vw` is correct here — made explicit rather than
          // relying on the (correct, in this one case) default, same
          // as every other `fill` image in this pass.
          <Image
            src={content.heroMedia.url}
            alt={content.heroMedia.alt}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
        ) : (
          <MediaPlaceholder label="Hero video/image placeholder" className="h-full w-full" />
        )}
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[65%] bg-gradient-to-b from-background/95 via-background/55 to-transparent"
      />

      <div className="relative z-10 mx-auto flex h-full w-full max-w-[1728px] flex-col items-center px-6 pt-28 text-center sm:px-10 sm:pt-32">
        {/* Eyebrow removed (29 Aug 2026, owner: "B2B Apparel Export —
            India to Africa - remove this"). */}
        {/* `text-h1` (40px, 29 Aug 2026) — the one "primary page heading"
            per the owner's revised type scale (font size.png), replacing
            the fluid `text-display` clamp (which maxed at 50.4px). Named
            explicitly as the H1 example in that spec
            ("Men's apparel for African markets"). */}
        {/* `text-h2` (30px) below `sm`, 31 Aug 2026 (owner, testing live
            mobile, comparing it against the nav logo: "bump the logo up
            as compared to 'Men's Apparel for African Market'... reduce
            [this heading] to a smaller text, maybe but only one size
            small as per our template") — one step down from `text-h1`
            (40px) on the site's own named scale; `sm:text-h1` restores
            the original desktop size unchanged. */}
        <h1 className="mt-3 max-w-3xl text-h2 font-semibold text-charcoal sm:text-h1">
          {content.heroHeading}
        </h1>

        {/* `text-h3` (18px) `font-semibold`, 30 Aug 2026 — second bump
            same day (owner: "bump up 'Exported from India', try making
            it bold, try variants"). Offered 3 concrete options (15px
            bold / 18px semibold / 18px bold); owner picked "the next
            size above [text-support/text-body], semi bold" — `text-h3`
            (18px, the next named token up from `text-body`'s 15px) with
            `font-semibold`. Was `text-body text-charcoal/70` (15px,
            regular weight, 70% opacity) from the immediately-prior bump
            earlier the same day; `text-charcoal/70` dropped to full
            `text-charcoal` too — a semibold weight at 70% opacity reads
            muddier than the plain-weight version did, undercutting the
            point of bumping this up for more presence. */}
        <p className="mt-3 max-w-xl text-h3 font-semibold text-charcoal">
          {content.heroSubheading}
        </p>

        {/* Sentence case, not uppercase (29 Aug 2026, font case 1.png:
            "'Explore products' → button, sentence case") — was
            all-caps ("EXPLORE PRODUCTS" via `uppercase`) with the label
            typed in title case; both dropped.
            `text-micro` (30 Aug 2026, owner: "I don't want any other
            font sizes floating around" — every size site-wide must come
            from the 8 named tokens) replacing raw `text-xs` — supersedes
            this comment's own earlier "size unchanged" note.
            `text-support` (30 Aug 2026, same-day follow-up, owner: "All
            clickable buttons to have the same font size - same as talk
            to Kibo") — supersedes the `text-micro` bump above; every
            "Talk to KIBO" button uses `text-support`, so this one now
            matches. Hover also changed `hover:bg-sage-green` →
            `hover:bg-green-gray` ("each button if black changes to sage
            green grey when hovered on") — plain Sage Green isn't this
            palette's grey; Green Gray is the token every other black
            button's hover now uses, for consistency.
            `hover:bg-green-gray` → `hover:bg-green-gray-deep` (2 Sep
            2026) — accessibility pass, see globals.css's own comment on
            the new token; same rename applied to every button site-wide.
            Settled on "Variant E" (30 Aug 2026, owner: "Lets go with A
            and E - just like you suggested") — this is the one button
            site-wide that carries an arrow, so it gets A's flat color
            swap plus a small rightward nudge on the arrow; every other
            button (no arrow) just gets plain Variant A, see Nav.tsx's
            own comment. `group` on the `<Link>` lets the arrow span
            react to the link's own hover via `group-hover`. */}
        {/* `mt-6` → `mt-9` (30 Aug 2026, owner, on a screenshot: "shift
            Explore products slightly lower") — nudges the button further
            from the subheading above without touching the subheading's
            own spacing. */}
        {/* `tracking-[0.14em]` → `tracking-[0.16em]` (1 Sep 2026, owner-
            requested site-wide tracking unification — see
            BackToHomeLink.tsx's own comment for the full list of the
            four values this replaces). */}
        <Link
          href="/products"
          className="group mt-9 inline-flex items-center gap-2 rounded-full bg-charcoal px-7 py-3.5 text-support font-semibold tracking-[0.16em] text-background transition-colors hover:bg-green-gray-deep active:bg-green-gray-deep"
        >
          Explore products
          {/* Drawn SVG chevron replacing the plain "→" character, 31 Aug
              2026 (owner, testing live: same complaint and same fix as
              BackToHomeLink.tsx's own arrow — "either get rid of it or
              do a chevron there as well" — a bare text arrow renders
              however the font happens to draw it, not as a designed
              icon). Same thin-stroke chevron style as that component
              (and the product gallery's own prev/next arrows), just
              pointed right instead of left. Hover nudge unchanged
              ("Variant E," the one arrow-carrying button on the site —
              see file comment above). */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 shrink-0 transition-transform group-hover:translate-x-[3px]"
            aria-hidden="true"
          >
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </Link>
      </div>

      {/*
        Scroll cue — a discoverability hint that more content follows
        below (the Products grid and everything after it, all part of
        Home's one continuous page as of 28 Aug 2026, see
        `(site)/page.tsx`'s own comment). Carries no logic of its own —
        purely visual, harmless regardless of how the page below it is
        structured.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-6 z-10 flex flex-col items-center gap-1 text-charcoal/60"
      >
        {/* Was text-[10px] — scaled to 70% along with the rest of the
            site's type, 28 Aug 2026 site-wide font-size reduction.
            `text-micro` (11px, 30 Aug 2026, owner: "only 8 named font
            sizes, nowhere else" — a full-site audit) replacing the raw
            `text-[7px]` this was left on — missed by earlier sweeps
            because those searched for the OLD Tailwind scale class
            names (`text-xs` etc.), not raw arbitrary values like this
            one. The smallest named token, matching this element's own
            decorative/micro role. */}
        <span className="text-micro font-semibold uppercase tracking-[0.16em]">
          Scroll to explore
        </span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-4 w-4 animate-bounce"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
