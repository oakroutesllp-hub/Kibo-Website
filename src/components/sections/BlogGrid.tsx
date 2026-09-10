"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import type { ArticleContent } from "@/lib/content";

// Blog listing — filter tabs over a card grid, built 31 Aug 2026
// following "Blog Page Ideas.docx"'s two reference layouts: Allbirds'
// "The Perch" (centered filter tabs, card = image + date + title +
// excerpt) and Stanley/Stella's "Journal" (search bar + sort dropdown,
// 3-col grid). Landed on a deliberate hybrid rather than picking one
// wholesale: Allbirds' tab mechanism (no search/sort control anywhere
// else on this site, and with a handful of posts a search bar has
// nothing meaningful to search) + Stanley/Stella's 3-column count
// (owner, on a screenshot: "show 3 tiles in one row... for all three
// tabs" — was 2 columns, this session's own first pass). A tab
// filtered down to fewer than 3 posts still renders in this same
// 3-column grid — no placeholder cards, that's just the grid's normal
// behavior with fewer children.
//
// Colors/type/spacing are KIBO's own throughout (sage-green accent,
// the site's card border/radius convention, the existing text-h3/
// text-support/text-micro scale) — the reference doc's own colors and
// fonts were never carried over, only its structural idea (tabs above
// a grid, that card anatomy).
//
// Categories are NOT a fixed, hardcoded list — they're derived from
// whatever `category` values actually exist across the posts passed
// in, so a new category typed into Sanity shows up as a new tab
// automatically, no code change needed (see articleType.ts's own field
// description for the same point from the content-editing side).
const UNCATEGORIZED = "Uncategorized";

export function BlogGrid({ articles }: { articles: ArticleContent[] }) {
  const categories = useMemo(() => {
    const set = new Set(articles.map((a) => a.category || UNCATEGORIZED));
    return ["All", ...Array.from(set).sort()];
  }, [articles]);

  const [activeCategory, setActiveCategory] = useState("All");
  // Search, 10 Sep 2026 (owner: "the one thing I would like to add to
  // the blog section is search... people can search by keywords") —
  // matches title OR excerpt, case-insensitive substring, combined
  // with the category tabs (both filters apply together, not either/
  // or) — a visitor on the "Company News" tab searching "certification"
  // should still only see Company News posts that match, not jump back
  // to "All". Client-side, same as the category filter already was —
  // fine at blog-post volumes; would move server-side (or to a real
  // search index) long before that stopped being true.
  const [query, setQuery] = useState("");

  const categoryFiltered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => (a.category || UNCATEGORIZED) === activeCategory);

  const trimmedQuery = query.trim().toLowerCase();
  const filtered = trimmedQuery
    ? categoryFiltered.filter(
        (a) =>
          a.title.toLowerCase().includes(trimmedQuery) ||
          (a.excerpt || "").toLowerCase().includes(trimmedQuery),
      )
    : categoryFiltered;

  // Tabs only make sense with something to filter between — a single
  // category (or zero posts) has nothing for "All" to differ from, so
  // hide the row entirely rather than show inert, always-identical tabs.
  const showTabs = categories.length > 2;

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {/* Search input, same day as the tabs above — deliberately its
          own row above the tabs (not squeezed alongside them): the
          reference doc's Stanley/Stella layout paired search with a
          3-column grid, same count this page already uses, so no
          layout change needed there, only a new control. `max-w-sm`
          keeps it from stretching full-width and looking like the
          page's main input on a wide desktop viewport — it's a filter,
          not the page's primary action. */}
      <div className="w-full max-w-sm">
        <label htmlFor="blog-search" className="sr-only">
          Search posts
        </label>
        <div className="relative">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts…"
            className="w-full rounded-full border border-charcoal/15 bg-background py-2.5 pl-10 pr-4 text-support text-charcoal placeholder:text-charcoal/40 focus:border-sage-green focus:outline-none"
          />
        </div>
      </div>

      {showTabs && (
        <div
          role="tablist"
          aria-label="Filter posts by category"
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {categories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setActiveCategory(category)}
                // `tracking-[0.1em]` → `tracking-[0.16em]` (1 Sep 2026,
                // owner-requested site-wide tracking unification — see
                // BackToHomeLink.tsx's own comment for the full list of
                // the four values this replaces). All three tabs share
                // this one class string, so they stay matched to each
                // other exactly, same as before.
                //
                // `uppercase` removed, 10 Sep 2026 (owner: "the text
                // shouldn't be all caps because that's not what we have
                // anywhere") — same standing rule Certifications'
                // heading was corrected against earlier ("we don't have
                // that [all-caps tracked label] typography design
                // anywhere in the website"). `tracking-[0.16em]` (the
                // letter-spacing) stays — that value was unified
                // site-wide independent of case — but the transform
                // that was actually rendering these as caps is gone;
                // each category now shows exactly as typed in Sanity
                // (sentence case, matching the field's own example
                // text: "Company News", not "COMPANY NEWS").
                className={`flex flex-col items-center gap-1.5 text-micro font-semibold tracking-[0.16em] transition-colors ${
                  active ? "text-charcoal" : "text-charcoal/50 hover:text-charcoal"
                }`}
              >
                {category}
                <span
                  aria-hidden="true"
                  className={`h-px w-full bg-sage-green transition-opacity ${active ? "opacity-100" : "opacity-0"}`}
                />
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-body text-charcoal/70">
          {trimmedQuery ? `No posts match "${query.trim()}".` : "No posts in this category yet."}
        </p>
      ) : (
        <>
          {/* `sm:grid-cols-2` → `sm:grid-cols-3` (31 Aug 2026, owner, on
              a screenshot: "show 3 tiles in one row... for all three
              tabs") — a deliberate hybrid now of the two reference
              layouts (still Allbirds' filter tabs, now Stanley/Stella's
              3-column count) rather than a pure copy of either. A
              filtered tab with fewer than 3 posts just renders that
              many cards in the same 3-column grid — no placeholder
              cards, no special-casing needed, that's the grid's normal
              behavior with fewer children. */}
          <div className="grid w-full grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <BlogCard key={article.slug} article={article} />
            ))}
          </div>
          {/* "Showing X of Y" count — a small, cheap-to-add touch
              straight from the reference doc's own card grid. */}
          <p className="text-micro text-charcoal/50">
            Showing {filtered.length} of {articles.length}{" "}
            {articles.length === 1 ? "post" : "posts"}
          </p>
        </>
      )}
    </div>
  );
}

function BlogCard({ article }: { article: ArticleContent }) {
  const dateLabel = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-charcoal/10 bg-background transition-colors hover:border-charcoal/25"
    >
      {/* `aspect-[4/3]` (landscape) → `aspect-square`, 10 Sep 2026
          (owner: "I would want the image to be maybe sixty, seventy
          percent of the tile and then text to be thirty to forty
          percent") — measured live before changing anything: the old
          4:3 image against this card's real text block (date + title
          + 3-line excerpt) landed at 49% image / 51% text, genuinely
          the ~half-and-half the owner was reacting to, not just a
          feeling. A taller image aspect ratio is the real lever here —
          the text block's own height is set by its content/line-clamp,
          not by the image, so growing the image is what shifts the
          balance. Paired with trimming the excerpt from 3 lines to 2
          and `p-5` down to `p-4` (below) to keep the text side from
          creeping back up as it would with a taller image alone —
          together these land at ~65% image / 35% text, measured live
          after the change (see this file's own git history for the
          before/after numbers). */}
      <div className="relative aspect-square w-full overflow-hidden">
        {article.coverImage ? (
          // `sizes` (2 Sep 2026, performance pass) — matches this
          // card's real width in the listing page's 3/2/1-column grid
          // (`max-w-5xl` container ≈ 293px per card at `lg`); was
          // missing, defaulting to `100vw`.
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            fill
            sizes="(min-width: 1024px) 293px, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <MediaPlaceholder label={article.title} className="h-full w-full" />
        )}
        {/* Category pill, overlaid top-right of the image — same idea as
            the reference cards' own "Seasonal"/"Trending" pills, in
            KIBO's own pill styling (matches the site's other small
            translucent-badge pattern, e.g. MediaPlaceholder's label).

            `text-charcoal/70` → `text-charcoal/60` (1 Sep 2026, owner-
            requested unification after a typography audit found this
            badge slightly darker than the same pill style elsewhere —
            MediaPlaceholder.tsx and CatalogCtaSection.tsx both already
            use `/60`, so this one moves to match rather than the other
            two. All three moved back to `/70` together, 3 Sep 2026 —
            a real Lighthouse audit flagged `/60` (4.29:1) as under
            WCAG AA's 4.5:1 minimum; same fix applied site-wide
            wherever `text-charcoal/60` appeared, not just here. */}
        {article.category && (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 px-3 py-1 text-micro font-medium text-charcoal/70">
            {article.category}
          </span>
        )}
      </div>

      {/* Title + excerpt share ONE flexible clamp budget (not two
          independent caps) — 10 Sep 2026, owner tried the independent-
          caps alternative (title max 4 lines own "…", excerpt max 2
          lines own "…"), then: "what you had built earlier is fine" —
          back to this version, which is what actually eliminates blank
          space at a card's bottom: a short title hands its unused
          lines to the excerpt instead of reserving empty space in its
          own box. `line-clamp-6` on this wrapping div (title's own
          reference max, ~4 lines, + a steady 2-line excerpt = 6) clips
          across BOTH the title and excerpt `span`s as one continuous
          flow, since `line-clamp` counts rendered lines through nested
          `block` children, not just direct text.
          `min-h-[Npx]` reserves that same height even when title+
          excerpt together are short of the full 6 lines, so every
          card in a row is genuinely the same height. Value re-measured
          live after the title font-size bump-down just below (a
          smaller title has a shorter line-height, so the old 164px
          from the `text-h3` version no longer applied as-is). */}
      <div className="flex flex-col gap-2 p-4">
        {dateLabel && <p className="text-micro text-charcoal/50">{dateLabel}</p>}
        <div className="line-clamp-6 min-h-[145px] text-charcoal">
          {/* `text-h3` → `text-body` (18px → 15px), 10 Sep 2026, owner:
              "bump down the blog title text size by one" — per the
              standing "bump up/down always lands on the next named
              token" rule, one step down from `text-h3` on the type
              scale (h1 40 / h2 30 / h3 18 / body 15 / support 13 /
              micro 11) is `text-body`, not an arbitrary size. */}
          <span className="block text-body font-semibold transition-colors group-hover:text-sage-green">
            {article.title}
          </span>
          {article.excerpt && (
            <span className="mt-1 block text-support text-charcoal/70">{article.excerpt}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
