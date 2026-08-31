import { defineField, defineType } from "sanity";

// Article/blog infrastructure per Master Brief §8 — "may exist even before
// content is published." Minimal fields for the Phase 1 checkpoint.
//
// **Relabeled "Blog Post" in Studio, 31 Aug 2026** (owner: "a 'Blog
// Post' document type with title, slug, cover image, excerpt, body,
// published date, and category/tag fields") — the schema `name` stays
// `article` (unchanged, so `_type == "article"` in every existing query
// still matches, and no data migration is needed for the one sample
// article that already exists) — only the Studio-facing `title` below
// changes, matching the new Blog page's own naming (nav label, page
// heading) that superseded "Articles"/"Resources" earlier.
export const articleType = defineType({
  name: "article",
  title: "Blog Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "category",
      title: "Category",
      description:
        "Powers the filter tabs on the Blog page — whatever categories actually exist across your published posts become the tabs shown, automatically, no code change needed. Pick one of the two already in use, or type a new one to start a new tab (keep wording short and consistent — e.g. always \"Company News\", not sometimes \"News\" — so posts that should share a tab actually do). Leave empty to file the post under \"Uncategorized\".",
      type: "string",
      // Dropdown of known values added 31 Aug 2026 (owner, looking at
      // Studio: "I see like three bifurcations [on the live site]... I
      // don't see any of that on Sanity, so how will we know how to
      // publish... not very clear") — a plain text field gave no hint
      // that "Company News" and "Sourcing & Manufacturing" were the two
      // real tabs already live (the visible "third" is the always-
      // present "All" tab, generated automatically, not a category
      // anyone sets). This list is suggestions, not a hard constraint —
      // Sanity's string `options.list` still allows typing any other
      // value, which is required here since a new category should
      // still be possible without a code/schema change (per this
      // field's own next line).
      options: {
        list: ["Company News", "Sourcing & Manufacturing"],
      },
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "linkedInUrl",
      title: "Original LinkedIn post (optional)",
      type: "url",
      description:
        "If this article started as a LinkedIn post, paste its URL here to show a credit link on the article.",
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seo",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt", media: "coverImage" },
  },
});
