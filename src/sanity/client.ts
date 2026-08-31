import { createClient } from "next-sanity";
import { projectId, dataset, apiVersion, isSanityConfigured } from "./env";

// `projectId` falls back to a placeholder so createClient doesn't throw
// when Sanity isn't configured yet — callers must check
// `isSanityConfigured` (via lib/content.ts) before relying on real data.
//
// useCdn is false here deliberately: Sanity's CDN (apicdn.sanity.io) is
// eventually-consistent and can take up to ~60s to reflect a publish,
// which reads as "my edit didn't save" during content review. The direct
// API is always immediately consistent. Worth revisiting for production
// performance once the site is live and edits aren't being checked
// second-by-second.
export const sanityClient = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
});

export { isSanityConfigured };
