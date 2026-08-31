import { redirect } from "next/navigation";

// "Lookbook" renamed to "Catalog" (30 Aug 2026, owner: "we're renaming
// 'Lookbook' to 'Catalog' and fully defining it") — this route now just
// redirects to `/catalog` rather than being deleted outright, so any
// existing link/bookmark to `/lookbook` (nav, footer, or external)
// still lands somewhere real instead of 404ing. The actual page content
// lives at `(site)/catalog/page.tsx` now.
export default function LookbookPage() {
  redirect("/catalog");
}
