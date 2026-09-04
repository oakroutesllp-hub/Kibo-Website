import { CertificationsRow } from "@/components/CertificationsRow";
import type { CertificationContent } from "@/lib/content";

// Certifications — new Home section, 4 Sep 2026, owner: "let's build
// the certifications section" (bundled with Brands/Testimonials as
// the day's main build). Hidden until both `showCertifications` (Site
// Settings) is on AND at least one real Certification document
// exists — same "won't go live now" toggle pattern as Blog/
// Testimonials; returns null here defensively even if a future caller
// forgets to check the toggle itself.
//
// **Layout, brainstormed with 3 mocked-up options before building**
// (owner: "I like A" — a minimal trust bar, not cards with
// descriptions). Centering (1 entry dead center, 2 mirrored, 3 with
// the middle one centered and one flanking each side, and so on) and
// the auto-scroll-when-it-overflows behavior both live in
// CertificationsRow.tsx (a Client Component, since it measures its
// own width) — see that file's own comment for the full mechanism.
//
// **Icon + name, always paired, every entry — 4 Sep 2026, confirmed
// through two follow-up rounds** (owner: "a lot of suggestions I'm
// getting are that we cannot use government marks as logos... we'll
// use icons and names instead," then: "why will OEKO-TEX not have an
// icon? Everything will have an icon. We build it for that.") — a
// generic icon (never the certifying body's own official logo/
// trademark) is created for every certification as part of adding it,
// so there's no supported "name only" display case anymore. Both icon
// and name render in flat `sage-green-deep` (owner: "in the sage
// green gray color... to match the font"), no hover state.
//
// **Placement**: owner's final call — below The Person Behind KIBO
// (the last Our Story section), just above the footer, NOT before Our
// Story. See `(site)/page.tsx` for the actual insertion point — this
// section no longer needs to avoid Supply/Long Run/Testimonials/CTA's
// conditional color-banding cluster the way its first placement did,
// since it now sits well past all of that; kept as a plain,
// unconditional white background regardless.
export function CertificationsSection({
  certifications,
  show,
  scrollSpeed,
}: {
  certifications: CertificationContent[];
  show: boolean;
  scrollSpeed?: number;
}) {
  if (!show || certifications.length === 0) return null;

  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-8 px-6 py-12 sm:px-10 sm:py-16">
        {/* "Certifications" alone, not "Certifications / Registrations"
            — asked directly, owner left the final call open: at this
            small uppercase tracked-label size, the longer phrase reads
            dense rather than clean. Easy to change if the owner wants
            the fuller phrase back — just this one string. */}
        <p className="text-center text-micro font-semibold uppercase tracking-[0.16em] text-sage-green-deep">
          Certifications
        </p>
        <CertificationsRow certifications={certifications} scrollSpeed={scrollSpeed} />
      </div>
    </section>
  );
}
