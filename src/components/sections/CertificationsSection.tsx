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
      {/* Top divider, 4 Sep 2026 — owner, comparing section-separation
          options live: Our Story and this section both stay white, so
          this inset line is what actually marks the boundary between
          them (the footer right below picks up its own separation a
          different way — a dark background, see Footer.tsx's own
          comment — so this section doesn't need to also carry that
          job on its bottom edge). Same inset-from-both-edges technique
          Footer.tsx's own top divider used before it was replaced by a
          background-color change instead (see that file) — reused
          here rather than a full-bleed `border-t`, per the owner's own
          standing preference against edge-to-edge lines on this site
          ("looks very very flaky"). */}
      <div className="mx-24 h-px bg-charcoal/10" />
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-8 px-6 py-12 sm:px-10 sm:py-16">
        {/* Heading matched exactly to Long Run/Supply/Testimonials' own
            treatment, 4 Sep 2026 (owner: "certifications text cannot be
            all caps... do it the same as built for the long run font
            size and all the font parameters" — then, after seeing both
            a same-size and one-size-down mockup: "Option 1 — exact
            match... do this for certifications") — was an uppercase,
            letter-spaced `text-micro` label, inconsistent with every
            other major section heading on this page (all sentence
            case, `text-h2 font-bold leading-[1.1] tracking-tight`, no
            letter-spacing). Sentence case, identical classes, same
            30px size as Long Run/Supply/Testimonials — genuinely the
            same heading treatment, not just a similar one. */}
        <h2 className="text-center text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          Certifications
        </h2>
        <CertificationsRow certifications={certifications} scrollSpeed={scrollSpeed} />
      </div>
    </section>
  );
}
