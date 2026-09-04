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
// descriptions) — a centered `flex flex-wrap justify-center` row,
// same centering mechanism TestimonialsSection.tsx's own static grid
// uses: correctly centers 1 logo, 2, 5, or any count, and would still
// center a wrapped second row if enough certifications are ever added
// — no special-casing needed per count, by construction.
//
// **Logo color, owner's own explicit call, immediate follow-up**: "I
// am not very kicked about the greyscale logos... build them in the
// sage green color, the same color as the text... I don't want
// hovering and brightening... flat color... modest presence." Each
// logo renders as a flat solid-color SILHOUETTE via a CSS mask (the
// logo image supplies only its alpha-channel shape; the visible color
// is a plain `background-color`, not the logo's own original colors)
// rather than a `filter: grayscale()` approximation — precise
// regardless of what colors the uploaded logo file actually contains,
// and with no hover state at all (no `transition`, no hover class) per
// the explicit "no brightening" instruction. Text-fallback entries
// (no logo uploaded) use the exact same color token, so a mixed
// logo/text row still reads as one consistent, monotone strip.
//
// **Placement**: owner chose "Home, near Testimonials." Deliberately
// placed AFTER the CTA nudge (not directly beside Testimonials) — my
// own call, disclosed rather than silently made: Supply/Long Run/
// Testimonials/CTA already form a fragile, deliberately-conditional
// color-banding cluster (exactly one of Supply/Long Run is tinted at
// a time, swapping based on whether Testimonials is visible — see
// SupplySection.tsx's own comment). Inserting a new section INSIDE
// that cluster would mean either duplicating that conditional logic a
// third time or risking a white gap splitting an otherwise-continuous
// tinted band on the "Testimonials off" path. Sitting just after it
// instead keeps Certifications in the same general "trust content"
// neighborhood without touching that fragile system — plain,
// unconditional white background, no coupling to any other section's
// visibility.
export function CertificationsSection({
  certifications,
  show,
}: {
  certifications: CertificationContent[];
  show: boolean;
}) {
  if (!show || certifications.length === 0) return null;

  return (
    <section className="w-full bg-background">
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-8 px-6 py-12 sm:px-10 sm:py-16">
        <p className="text-center text-micro font-semibold uppercase tracking-[0.16em] text-sage-green-deep">
          Certifications
        </p>
        <div className="flex w-full max-w-[1230px] flex-wrap items-center justify-center gap-x-10 gap-y-6">
          {certifications.map((cert) =>
            cert.logo ? (
              <a
                key={cert.name}
                // Only wrapped in a link when a verification URL exists —
                // otherwise a plain non-interactive marker, no dead link,
                // no misleading pointer cursor.
                {...(cert.verificationUrl
                  ? { href: cert.verificationUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                role="img"
                aria-label={cert.name}
                className="h-10 w-28 flex-none bg-sage-green-deep"
                style={{
                  maskImage: `url(${cert.logo.url})`,
                  WebkitMaskImage: `url(${cert.logo.url})`,
                  maskSize: "contain",
                  WebkitMaskSize: "contain",
                  maskRepeat: "no-repeat",
                  WebkitMaskRepeat: "no-repeat",
                  maskPosition: "center",
                  WebkitMaskPosition: "center",
                }}
              />
            ) : (
              // Text fallback (owner: "in case some of those don't have
              // logos") — same `text-sage-green-deep` color token as the
              // logo masks above, so a mixed row still reads as one
              // consistent monotone strip rather than an odd one out.
              <a
                key={cert.name}
                {...(cert.verificationUrl
                  ? { href: cert.verificationUrl, target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex h-10 items-center text-support font-semibold text-sage-green-deep"
              >
                {cert.name}
              </a>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
