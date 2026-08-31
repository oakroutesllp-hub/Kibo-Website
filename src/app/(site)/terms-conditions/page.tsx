import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions — KIBO",
};

// Placeholder only — deliberately NOT real legal content. See the same
// note in privacy-policy/page.tsx: must be replaced with real, reviewed
// terms before public launch. Flagged in PROJECT-SUMMARY.md as an open
// item.
export default function TermsConditionsPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 px-6 py-24 text-center">
      {/* `text-h1`/`text-body` (29 Aug 2026, revised type scale). */}
      <h1 className="text-h1 font-semibold text-charcoal">Terms &amp; Conditions</h1>
      <p className="text-body text-charcoal/70">
        This page is a placeholder. KIBO&rsquo;s terms and conditions will
        be published here.
      </p>
    </div>
  );
}
