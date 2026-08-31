import type { Metadata } from "next";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { getArticle } from "@/lib/content";

// Route renamed `/articles/[slug]` → `/blog/[slug]`, 31 Aug 2026 — see
// `../page.tsx`'s own comment for the reasoning.
export async function generateMetadata(
  props: PageProps<"/blog/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) return {};

  return {
    title: article.seo.metaTitle || `${article.title} — KIBO`,
    description: article.seo.metaDescription || article.excerpt,
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-8 px-6 py-16">
      <div className="aspect-video w-full overflow-hidden rounded-md bg-charcoal/4">
        {article.coverImage ? (
          <Image
            src={article.coverImage.url}
            alt={article.coverImage.alt}
            width={1200}
            height={675}
            className="h-full w-full object-cover"
          />
        ) : (
          <MediaPlaceholder label="Article cover" className="h-full w-full" />
        )}
      </div>

      {/* Date/category line added 31 Aug 2026, matching BlogGrid.tsx's
          own card treatment (same `dateLabel` formatting) — this page
          previously showed neither. */}
      {(article.publishedAt || article.category) && (
        <div className="flex items-center gap-3 text-micro text-charcoal/50">
          {article.publishedAt && (
            <span>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          {article.category && (
            <span className="rounded-full bg-charcoal/[0.06] px-3 py-1 font-medium text-charcoal/70">
              {article.category}
            </span>
          )}
        </div>
      )}

      {/* `text-h1`/`text-body` (29 Aug 2026, revised type scale) replacing
          `text-3xl`/`text-base`. */}
      <h1 className="text-h1 font-semibold text-charcoal">{article.title}</h1>

      <div className="flex flex-col gap-4 text-body leading-relaxed text-charcoal/80">
        <PortableText value={article.body} />
      </div>

      {article.linkedInUrl && (
        <a
          href={article.linkedInUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-support text-charcoal/60 underline decoration-charcoal/20 underline-offset-4 hover:text-charcoal"
        >
          Originally posted on LinkedIn ↗
        </a>
      )}
    </div>
  );
}
