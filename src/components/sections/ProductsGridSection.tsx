"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ProductCategoryCard } from "@/components/ProductCategoryCard";
import { PRODUCT_CATEGORIES } from "@/lib/productCategories";
import { useTalkToKibo } from "@/components/TalkToKiboProvider";

// Extracted from /products/page.tsx (26 Aug 2026) so the exact same markup
// can be reused wherever this grid needs to appear — originally built for
// a scroll-triggered route-change preview on Home (`HomeProductsHandoff.tsx`,
// deleted 28 Aug 2026), now simply rendered directly as Home's permanent
// place in the site's single continuous scroll (see `(site)/page.tsx`'s own
// comment for that architecture change) — same component, same reasoning
// for reuse, just a plainer reason now that there's no route swap to keep
// pixel-identical.
//
// `headingLevel` exists for that reuse: the real /products page wants
// this as its one <h1>, but Home already has its own <h1> in Hero, so the
// preview copy renders as an <h2> there to avoid two <h1>s on one document.
//
// `showBackToHome` (26 Aug 2026) — deliberate, click-based reverse
// navigation, added after owner feedback on the scroll-triggered
// transition: scrolling up from the top of /products doesn't carry you
// back into Hero (this is a genuinely separate page, nothing above it to
// reveal), which reads as "stuck." A *scroll-triggered* reverse (fire
// navigation on overscroll at the top) was considered and deliberately
// rejected — there's no reliable "scrolled past the top" signal the way
// there is for the bottom, so it would ride on wheel/touch overscroll
// detection, which fires on ordinary rubber-band bounce/re-reading
// gestures too, not just deliberate "take me back" intent. A visible,
// deliberate link avoids that ambiguity entirely. Only the real
// /products page passes `showBackToHome` — the Home preview copy (already
// on Home) would make it a redundant, confusing "back to home" link while
// still visually on Home.
//
// Absolutely positioned, not a normal flex child (confirmed by
// measurement this matters): the outer container is a `gap-10` flex
// column, so adding the link as a plain child inserted a real 40px gap
// before the heading on top of the link's own line height — the heading
// on the real page ended up ~42px lower than the identical heading in
// the Home preview, which is exactly the visible jump the shared-markup
// approach exists to prevent. Positioning it absolutely tucks it into
// the existing top padding instead, so it adds zero layout
// height and the heading sits at the exact same spot whether or not
// `showBackToHome` is set.
// `heading`/`showGetInTouch` added 30 Aug 2026 for the new Catalog page
// (owner: "essentially the Products page's range and specs, presented
// in the same card/flip treatment as the Products grid") — the Catalog
// page reuses this exact component (same cards, same flip mechanics,
// same data) rather than duplicating it, but needs its own page title
// ("Catalog," not "Products") and its own two CTAs below the grid
// ("Download Catalog" / "Talk to KIBO", side by side) instead of this
// section's own single "Get in touch" nudge, which would otherwise read
// as a redundant, differently-styled third CTA right above them.
export function ProductsGridSection({
  headingLevel = "h1",
  showBackToHome = false,
  heading = "Products",
  showGetInTouch = true,
}: {
  headingLevel?: "h1" | "h2";
  showBackToHome?: boolean;
  heading?: string;
  showGetInTouch?: boolean;
}) {
  const Heading = headingLevel;
  const { open: openTalkToKibo } = useTalkToKibo();

  // Which card (by category name) is currently flipped, shared across the
  // whole grid rather than owned by each card — 27 Aug 2026, per a
  // deliberate brainstorm with the owner (see ProductCategoryCard.tsx's
  // own comment): specs here are broad, not precise per-SKU attributes,
  // so side-by-side comparison between two open cards was judged unlikely
  // enough that auto-closing the previous card when a new one opens is
  // worth it for keeping the grid tidy while browsing one category at a
  // time — which needs exactly one "open" value up here, not six
  // independent ones.
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  // The category actually clicked most recently — separate from
  // `openCategory` so the auto-closed card (see above) can skip its own
  // flip *animation* entirely rather than just skip staying open. Without
  // this, clicking card B while A is open animates BOTH at once (A
  // rotating closed, B rotating open simultaneously) — flagged directly
  // by the owner as distracting. Only the card matching `lastToggled`
  // gets the animated transition; every other card's flip transform
  // changes instantly, no visible rotation, so at most one card is ever
  // seen mid-flip.
  const [lastToggled, setLastToggled] = useState<string | null>(null);

  // Auto-close the open card once it scrolls fully out of view, 30 Aug
  // 2026 (owner: "once I click specs — if I scroll down then scroll up,
  // at that time the spec should revert to the picture tile 01" — this
  // is the scroll-detection half; ProductCategoryCard.tsx's own
  // `flipped`-triggered reset is what actually restores frame 01 once
  // this fires). `cardRefs` holds each card's outer wrapper `<div>`
  // (see the `.map()` below), keyed by category name, so the effect can
  // look up just the one currently-open card's element without needing
  // a ref on every card watched at once.
  //
  // **`IntersectionObserver` → a plain `scroll` listener + manual
  // `getBoundingClientRect()` check, 30 Aug 2026** (owner: confirmed
  // live, after the first version shipped, that it still wasn't
  // resetting) — the `IntersectionObserver` version was logically the
  // same check, but couldn't be verified at all in this session's own
  // testing sandbox (confirmed separately: a bare, React-free
  // `IntersectionObserver` created directly in that sandbox never fires
  // its callback either, even after real scrolling), so a real bug in
  // that specific version couldn't be ruled out with any confidence.
  // Rather than keep guessing at an API this environment can't exercise
  // at all, switched to the more basic mechanism below — a `scroll`
  // event triggering a direct, synchronous geometry check has no
  // comparable "does the browser even fire this" uncertainty. Closes as
  // soon as the card's box is fully above OR fully below the viewport
  // (`rect.bottom <= 0 || rect.top >= window.innerHeight`) — either
  // scroll direction counts, matching "scroll down then scroll up"
  // landing on a reset either way.
  const cardRefs = useRef(new Map<string, HTMLDivElement>());

  useEffect(() => {
    if (!openCategory) return;

    const handleScroll = () => {
      const el = cardRefs.current.get(openCategory);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const outOfView = rect.bottom <= 0 || rect.top >= window.innerHeight;
      if (outOfView) setOpenCategory(null);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [openCategory]);

  // `pt-20 pb-10 sm:pt-28 sm:pb-14` (30 Aug 2026, owner, on a screenshot
  // of the Custom→Supply gap: "I like this spacing... make this gap
  // consistent between... the hero image and products") — was a flat
  // `py-16` (64px, both sides, no responsive step), an outlier from the
  // "every section shares one symmetric `py-10 sm:py-14` rule" standard
  // already applied everywhere else on the page (see CustomSection.tsx's
  // own comment). Split instead of just adopting that same symmetric
  // value, because this section's TOP neighbor is Hero, which
  // contributes zero bottom spacing of its own (`h-dvh`, no padding) —
  // so this section's top alone has to carry the FULL seam
  // (`pt-20 sm:pt-28`, 80px/112px, matching what two standard sides
  // would add up to), while its BOTTOM neighbor (Custom) already
  // supplies its own standard top half, so this section's bottom only
  // needs the matching standard half (`pb-10 sm:pb-14`).
  //
  // Whole seam standard exact-matched to Custom's own internal gap, same
  // day (owner, after the 30%-reduction pass still read as too large:
  // "make this gap the same as the gap between the bottom line of...
  // from reference to finished garment [and]... the top of [the tracker
  // numbers]" — measured live at 40px/32px, i.e. Custom's own
  // `gap-8 sm:gap-10`) — `pt-20 sm:pt-28` (80px/112px, the FULL seam,
  // since Hero contributes 0) → `pt-8 sm:pt-10` (32px/40px, matching
  // Custom's internal gap as a full value); `pb-10 sm:pb-14` (the
  // standard HALF) → `pb-4 sm:pb-5` (16px/20px, half of that same
  // 32/40 total). Every other section sharing this standard
  // (Custom/Supply/Long Run/CTA nudge/Listening/Founder) gets the
  // identical `py-4 sm:py-5` half-value in this same pass.
  return (
    <div className="relative mx-auto flex w-full max-w-[1728px] flex-1 flex-col gap-10 px-6 pt-8 pb-4 sm:px-10 sm:pt-10 sm:pb-5">
      {/* Centered (29 Aug 2026, owner: "center this") — was left-aligned
          by default (a plain block heading in a flex-col container with
          no alignment set).
          `text-h2` (30px, 30 Aug 2026, owner: "use H2 for products") —
          downgraded from `text-h1` (40px). Note this is independent of
          the `headingLevel` prop above, which only controls the actual
          semantic tag (h1 vs h2) for document-outline purposes, not the
          visual size — this section's own heading is now H2-sized
          regardless of which tag it renders as.

          Weight/tracking matched to Supply's headline, `font-bold
          leading-[1.1] tracking-tight` (30 Aug 2026, owner: "these fonts
          should look the same as you build your market, we build the
          supply behind it") — was `font-semibold`, no leading/tracking
          override. Dash anchor added below, same reasoning as Custom's
          and Supply's own headline dash (owner, on this heading: "give
          it a nice horizontal line treatment. It kind of looks
          unanchored"). */}
      <div className="flex flex-col items-center gap-5">
        {/* Back-to-Home link moved in-flow and enlarged, 31 Aug 2026
            (owner, testing live, on both mobile and desktop: "the icon
            is very tiny and misplaced... should be at the center and
            maybe even larger... not very obvious") — was `absolute
            left-6 top-6`, tucked in the page's own top-padding corner at
            `text-micro` (11px), deliberately kept out of flow so this
            component's heading lands at the identical y-position whether
            or not this link is showing (see this div's own original
            comment on why — the Home-page-embedded copy of this same
            component never shows the link). That pixel-matching only
            ever mattered for comparing two different pages against each
            other, which nobody actually does — worth giving up for a
            link that's now easy to actually see and tap: in normal flow,
            centered with the heading below it (same `items-center`
            column), `text-support` (13px, up from 11px). Still the same
            arrow + "Home" wording, same hover treatment. */}
        {showBackToHome && (
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-support font-semibold uppercase tracking-[0.14em] text-charcoal/50 transition-colors hover:text-charcoal"
          >
            <span aria-hidden="true">←</span> Home
          </Link>
        )}
        <Heading className="text-center text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          {heading}
        </Heading>
        <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />
      </div>

      {/*
        Thumbnails reduced to ~70% (28 Aug 2026, owner: "reduce the image
        thumbnails to 70%. Keep gutters narrower than what they are - let
        the whitespace be added to the extreme left and right") —
        supersedes the 27 Aug widened-gap approach below. Each card's
        image fills its card width (`ProductCategoryCard.tsx`'s
        `aspect-[4/5]`), so shrinking the card shrinks the thumbnail.
        Rather than stretching a `1fr` grid to fill the full section
        width and controlling card size only via gap (the old approach —
        more gap ⇒ smaller card, but the freed space always lands
        *between* cards), the grid itself now gets an explicit
        `max-w-[...]` and stays `mx-auto` — freed space lands as margin
        *outside* the grid instead, at the section's left/right edges,
        while the gap between cards actually shrinks (`gap-16`/`gap-10`
        → `gap-8`/`gap-6`) rather than growing.

        Math (reference: 1728px container, `sm:px-10` = 40px padding,
        matching how this container's own width was previously computed
        and documented in prior passes):
        - lg (3 col): old card width (1648−128)/3 ≈ 507px. First pass:
          max-w-[1140px], gap-8 (32px) → (1140−64)/3 ≈ 359px, a 70.8%
          ratio.
        - sm (2 col): old card width (1648−40)/2 = 804px. First pass:
          max-w-[1160px], gap-6 (24px) → (1160−24)/2 = 568px, a 70.6%
          ratio.
        - Mobile (1 col) intentionally left unscaled/full-width — there's
          no "gutter" to narrow with a single column, and inset margins
          on a phone-width screen would just look like wasted space
          rather than the intended breathing room.

        Second pass, same day (owner: "reduce product thumbnails by
        another 10 percent - reduce the gutter between images - assign
        extra white space to the extreme right and left") — "another
        10%" read as 10% off the *current* (already-70%) size, not back
        to the original, so each dimension below is 0.9× the first-pass
        number, same mechanism (narrower `max-w`, narrower gap, both
        freeing more edge whitespace via the same `mx-auto`):
        - lg: gap-8 → gap-4 (16px), max-w-[1140px] → max-w-[1000px] →
          (1000−32)/3 ≈ 323px, a 90.0% ratio on the first-pass 359px
          (≈63.7% of the original 507px overall).
        - sm: gap-6 → gap-4 (16px), max-w-[1160px] → max-w-[1038px] →
          (1038−16)/2 = 511px, a 90.0% ratio on the first-pass 568px
          (≈63.6% of the original 804px overall).

        Third pass — TRIAL VARIANT (29 Aug 2026, owner: "do you think we
        should reduce grid size for every card by 15-20%? Can you create
        that variant and we can take a call"). Claude Code's take, for
        the record: leaned against it — two passes already took cards to
        ~64% of their original size with generous edge whitespace, and
        another 15-20% off risked the photography reading as thumbnail-
        sized. Built anyway, gap left unchanged, ~18% off the second-pass
        numbers (the middle of the requested 15-20% range):
        - lg: max-w-[1000px] → max-w-[825px] → (825−32)/3 ≈ 264px, an
          81.8% ratio on the second-pass 323px.
        - sm: max-w-[1038px] → max-w-[856px] → (856−16)/2 = 420px, an
          82.2% ratio on the second-pass 511px.

        Fourth pass, same day (owner, after seeing the trial variant:
        "The grid size looks fine - maybe increase by 5-10%") — settles
        the trial in favor of keeping the third-pass approach, bumped up
        ~7.5% (middle of 5-10%) from the third-pass numbers:
        - lg: max-w-[825px] → max-w-[887px] → (887−32)/3 ≈ 285px, a
          107.8% ratio on the third-pass 264px.
        - sm: max-w-[856px] → max-w-[920px] → (920−16)/2 = 452px, a
          107.6% ratio on the third-pass 420px.
      */}
      <div className="mx-auto grid w-full grid-cols-1 gap-8 sm:max-w-[920px] sm:grid-cols-2 sm:gap-4 lg:max-w-[887px] lg:grid-cols-3 lg:gap-4">
        {PRODUCT_CATEGORIES.map((category) => (
          <div
            key={category.name}
            ref={(el) => {
              if (el) cardRefs.current.set(category.name, el);
              else cardRefs.current.delete(category.name);
            }}
          >
            <ProductCategoryCard
              category={category}
              flipped={openCategory === category.name}
              animateFlip={lastToggled === category.name}
              onToggleFlip={() => {
                setOpenCategory((current) => (current === category.name ? null : category.name));
                setLastToggled(category.name);
              }}
            />
          </div>
        ))}
      </div>

      {/*
        **Rewired to the real shared modal, 30 Aug 2026** (owner: "all
        Talk to KIBO and Get in touch buttons should open up the inquiry
        form") — was a plain `<Link href="/#contact">` placeholder
        anchor; same `useTalkToKibo().open()` trigger every "Talk to
        KIBO" button on the site already uses.
      */}
      {/* Centered (29 Aug 2026, owner: "center this"), same request as
          the "Products" heading above.

          **Restructured 30 Aug 2026** (owner, on a screenshot of the
          inline "— get in touch." text: "place below the line and in
          center - give the click same treatment as talk to kibo - the
          button et all") — was a plain underlined inline link at the
          end of the sentence; now its own centered pill button on the
          line below, styled identically to Nav.tsx's "Talk to KIBO"
          button (`rounded-full bg-charcoal ... text-support font-
          semibold text-background hover:bg-green-gray`, "Variant A"
          hover — see that file's own comment for the full hover-
          treatment history). The sentence above drops its trailing
          em-dash/lowercase "get in touch." tail and ends in a period on
          its own now that the CTA isn't part of the same sentence. */}
      {/* `showGetInTouch` (30 Aug 2026) — hidden on the Catalog page,
          which has its own two CTAs directly below this component
          instead (see that page's own comment). */}
      {showGetInTouch && (
        <div className="flex flex-col items-center gap-5">
          {/* Trailing full stop removed (31 Aug 2026, owner, on a
              screenshot of this exact line). */}
          <p className="text-center text-body text-charcoal/70">
            Looking for something else? We build to your spec
          </p>
          <button
            type="button"
            onClick={openTalkToKibo}
            className="rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray"
          >
            Get in touch
          </button>
        </div>
      )}
    </div>
  );
}
