import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — KIBO",
};

// Placeholder only — deliberately NOT real legal content. The footer
// links here so the link isn't dead, but this page must be replaced with
// actual reviewed legal copy before the site collects any real user data
// (e.g. once the enquiry form, Architecture doc §9, goes live) or
// launches publicly. Flagged in PROJECT-SUMMARY.md as an open item.
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-24 text-center">
      {/* `text-h1`/`text-body` (29 Aug 2026, revised type scale). */}
      <h1 className="text-h1 font-semibold text-charcoal">Privacy Policy</h1>
      <p className="text-body text-charcoal/70">
        This page is a placeholder. KIBO&rsquo;s privacy policy will be
        published here before the site collects any personal information.
      </p>
    </div>
  );
}
