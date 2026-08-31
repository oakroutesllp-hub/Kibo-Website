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

  const filtered =
    activeCategory === "All"
      ? articles
      : articles.filter((a) => (a.category || UNCATEGORIZED) === activeCategory);

  // Tabs only make sense with something to filter between — a single
  // category (or zero posts) has nothing for "All" to differ from, so
  // hide the row entirely rather than show inert, always-identical tabs.
  const showTabs = categories.length > 2;

  return (
    <div className="flex w-full flex-col items-center gap-10">
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
                className={`flex flex-col items-center gap-1.5 text-micro font-semibold uppercase tracking-[0.1em] transition-colors ${
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
        <p className="py-10 text-center text-body text-charcoal/60">
          No posts in this category yet.
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
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {article.coverImage ? (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <MediaPlaceholder label={article.title} className="h-full w-full" />
        )}
        {/* Category pill, overlaid top-right of the image — same idea as
            the reference cards' own "Seasonal"/"Trending" pills, in
            KIBO's own pill styling (matches the site's other small
            translucent-badge pattern, e.g. MediaPlaceholder's label). */}
        {article.category && (
          <span className="absolute right-3 top-3 rounded-full bg-background/85 px-3 py-1 text-micro font-medium text-charcoal/70">
            {article.category}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 p-5">
        {dateLabel && <p className="text-micro text-charcoal/50">{dateLabel}</p>}
        <h3 className="text-h3 font-semibold text-charcoal transition-colors group-hover:text-sage-green">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="line-clamp-3 text-support text-charcoal/70">{article.excerpt}</p>
        )}
      </div>
    </Link>
  );
}
