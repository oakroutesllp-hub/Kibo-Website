// Centralised env access for the Sanity connection. Everything here is
// optional/undefined until a real project exists — see DESIGN-SYSTEM.md
// and PROJECT-SUMMARY.md. Nothing in the app should import next-sanity
// directly without going through `isSanityConfigured`.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-01-01";

export const isSanityConfigured = Boolean(projectId);
