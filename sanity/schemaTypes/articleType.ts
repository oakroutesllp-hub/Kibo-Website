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
        "Powers the filter tabs on the Blog page — whatever categories actually exist across your published posts become the tabs shown, automatically, no code change needed. Keep the wording short and consistent between posts (e.g. always \"Company News\", not sometimes \"News\" and sometimes \"Company Updates\") so posts that should share a tab actually do. Leave empty to file the post under \"Uncategorized\".",
      type: "string",
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
