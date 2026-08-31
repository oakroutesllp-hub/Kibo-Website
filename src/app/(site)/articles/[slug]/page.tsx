import { redirect } from "next/navigation";

// Forwards `/articles/[slug]` → `/blog/[slug]`, same reasoning and
// pattern as the sibling `/articles` → `/blog` redirect one level up.
export default async function ArticleSlugRedirect(
  props: PageProps<"/articles/[slug]">,
) {
  const { slug } = await props.params;
  redirect(`/blog/${slug}`);
}
