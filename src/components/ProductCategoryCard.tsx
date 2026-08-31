"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type TouchEvent } from "react";
import Image from "next/image";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import type { ProductCategoryContent } from "@/lib/content";

// Each of the 6 Products-grid cards shows a title, a multi-image gallery
// (tap the image, or the arrow buttons, to cycle pattern/color variants +
// mannequin/on-model shots — placeholder frames for now, real photography
// later), and flips in place to reveal its full spec list on the back.
//
// Card-flip, not a modal or an in-grid accordion (26 Aug 2026, replacing
// a modal built earlier the same day) — owner review flagged the modal's
// grey background dim as unwanted; requirements were flip in place, same
// footprint, no scrim, only the tapped card affected. The modal itself
// had replaced an even earlier in-grid accordion, which had its own real
// bug (expanding one card stretched its whole grid row, leaving blank
// space under still-collapsed siblings) — the flip implementation below
// avoids that same trap the same way the modal did: the back face is
// `absolute inset-0` over the front face rather than pushing content
// below it in normal flow, so the card's outer box is always sized by
// the front face alone (image + title row) and never grows the grid row.
// The back face's own spec list scrolls internally (`overflow-y-auto`)
// if it doesn't fit that footprint, rather than the card growing to fit it.
//
// Hit-zone split, revised 27 Aug 2026 — the whole front face used to be
// one flip trigger (arrows excepted). Owner feedback: that made the image
// itself dead space for gallery browsing (only the tiny arrow buttons
// cycled it) and conflated two different actions in one big tap target.
// Now: the image area is its own click zone that advances the gallery
// (same action as the "next" arrow — the explicit arrow buttons stay for
// precise/keyboard-friendly prev/next control, this is just a bigger,
// more discoverable "tap to see more" surface); the flip trigger is
// scoped to just the bottom title bar. Arrow buttons still call
// `stopPropagation()` so clicking one doesn't *also* advance the gallery
// a second time via the image area's own click handler underneath it.
//
// `flipped`/`onToggleFlip` are owned by the parent grid
// (`ProductsGridSection`), not local state here (27 Aug 2026) — a
// deliberate brainstorm with the owner first: specs here are broad
// (Various colours, Slim/Regular/Relaxed) rather than precise per-SKU
// attributes, so a buyer comparing two cards side by side is unlikely in
// practice; the more likely pattern is browsing one category at a time.
// Auto-closing whichever other card was open when a new one is flipped
// keeps the grid tidy for that browsing pattern, at the cost of a
// (judged low-value) side-by-side comparison case — which needs the flip
// state to live one level up so opening one card can close another.
//
// **Crossfade, not a 3D flip (27 Aug 2026, replacing the rotateY version
// built the day before)** — the owner reported gallery-arrow taps and the
// flip trigger simply not registering on an actual phone. First suspect
// was `OverscrollBackGuard`'s global touchmove handler; removing it
// entirely did NOT fix it, ruling that out. With no way to reproduce or
// even observe real touch-event behaviour from this environment (every
// test available here dispatches a synthetic `.click()`, which never
// exercises the touch pipeline at all), continuing to patch the 3D setup
// blind wasn't a good bet — `perspective` / `transform-style: preserve-3d`
// / `backface-visibility: hidden` are exactly the kind of properties with
// known, real hit-testing quirks on some mobile browsers (touches not
// landing where the visual layer suggests, once a 3D rendering context is
// involved). Rebuilt without any of them: both faces are plain
// `position: absolute` layers cross-fading via `opacity` +
// `pointer-events`/`aria-hidden`, which has no equivalent history of
// mobile hit-testing problems. Loses the 3D rotation flourish; keeps
// everything structural that mattered (front face defines the footprint
// via being the one non-absolutely-positioned child, back face still
// can't stretch the grid row).
export function ProductCategoryCard({
  category,
  flipped,
  animateFlip,
  onToggleFlip,
}: {
  category: ProductCategoryContent;
  flipped: boolean;
  animateFlip: boolean;
  onToggleFlip: () => void;
}) {
  // `imageIndex` renamed `displayIndex`, 31 Aug 2026 — see `incoming`
  // below for why a single index is no longer enough to represent the
  // gallery's state during a transition.
  const [displayIndex, setDisplayIndex] = useState(0);
  // Two-layer transition state, 31 Aug 2026 (owner, testing live
  // mobile: "the next picture comes when I click the left and right
  // buttons — it should also happen with a slide," then, after the
  // first single-image-swap version shipped: "images toggle... this
  // should happen with a slide too — that would be the natural
  // tendency") — the first version gave the new `<Image>` a fresh
  // `key` and animated it in alone, which replaced the old photo
  // immediately at the DOM level; on a slower mobile connection the new
  // image's bytes hadn't arrived yet when the animation played, so the
  // frame was blank/white for the ~0.3s the slide was supposed to be
  // visible, and by the time the photo actually loaded the animation
  // had already finished — reading as an instant toggle, not a slide,
  // exactly the report. Fixed by never removing the settled photo from
  // the DOM during a transition: `displayIndex` is the STATIC base
  // layer (always rendered, never animated, never blank), `incoming` is
  // an OVERLAY layer that slides in on top of it and only takes over as
  // the base once its slide-in animation actually finishes
  // (`onAnimationEnd` → `settleIncoming` below) — so the old photo stays
  // visible underneath for the entire transition regardless of how long
  // the new one takes to load, and the swap only becomes permanent once
  // the animation has genuinely played all the way through.
  const [incoming, setIncoming] = useState<{ index: number; direction: 1 | -1 } | null>(null);

  // Reset the gallery back to frame 01 whenever this card un-flips, 30
  // Aug 2026 (owner: "once I click specs — if I scroll down then scroll
  // up, at that time the spec should revert to the picture tile 01") —
  // covers every way a card un-flips, not just the scroll-triggered
  // auto-close this request specifically named (see
  // ProductsGridSection.tsx's own IntersectionObserver comment for that
  // half): clicking the title bar again, or another card opening and
  // auto-closing this one, land here too. `flipped` going false is the
  // one signal all of those share.
  //
  // "Adjusting state when a prop changes," done during render rather
  // than in a `useEffect` (React's own recommended pattern for exactly
  // this — see react.dev's "You Might Not Need An Effect") — an effect
  // here would call `setImageIndex` synchronously on mount/every flip
  // change, an extra render pass this render-phase version skips
  // entirely; the lint rule (`react-hooks/set-state-in-effect`) flags
  // the effect version specifically for that reason.
  const [prevFlipped, setPrevFlipped] = useState(flipped);
  if (prevFlipped !== flipped) {
    setPrevFlipped(flipped);
    if (!flipped) {
      setDisplayIndex(0);
      setIncoming(null);
    }
  }

  const frameCount = category.gallery.length;
  const currentFrame = category.gallery[displayIndex];
  const incomingFrame = incoming ? category.gallery[incoming.index] : null;
  // 29 Aug 2026 — every category is currently down to a single real
  // photo (see productCategories.ts's own comment), so the arrow/dot
  // gallery controls have nothing to cycle to. Rather than leave them
  // visible-but-inert (a next/prev button that visibly does nothing
  // reads as broken, not "nothing more to see yet"), they're hidden
  // outright whenever there's 1 or fewer frames — the whole gallery
  // affordance reappears automatically once a category's `gallery`
  // array grows past 1 again, no separate flag to maintain.
  const hasMultipleFrames = frameCount > 1;

  const handleFlipKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onToggleFlip();
    }
  };

  // Standard wraparound: for N frames (indices 0..N-1), next is
  // (i+1) % N and prev is (i-1+N) % N — both correctly visit every
  // index exactly once before repeating, for any N. Verified directly
  // in the browser at N=8 (every frame reachable, no skip) after the
  // owner flagged a possible off-by-one to check when the count went
  // from 3 to 6–8.
  //
  // `advance` starts a transition (sets `incoming`) rather than jumping
  // straight to the new index — see the `incoming` state's own comment
  // above for why. A tap/click/swipe mid-transition just retargets
  // `incoming` to the next index in that direction from wherever it
  // currently points, so rapid repeated taps still feel responsive
  // (each one restarts the slide-in animation from the same edge)
  // rather than queuing up or getting ignored.
  const advance = (direction: 1 | -1) => {
    const from = incoming ? incoming.index : displayIndex;
    const nextIndex = (from + direction + frameCount) % frameCount;
    setIncoming({ index: nextIndex, direction });
  };

  // Fires when the incoming layer's slide-in animation actually
  // finishes — this is what makes the transition permanent (folds
  // `incoming` into `displayIndex`), not a timer or the click handler
  // itself. See the `incoming` state's own comment for why that
  // distinction is the whole point of this two-layer approach.
  const settleIncoming = () => {
    setIncoming((current) => {
      if (!current) return current;
      setDisplayIndex(current.index);
      return null;
    });
  };

  // Fallback settle timer, 31 Aug 2026 — belt-and-suspenders alongside
  // `onAnimationEnd` above, not a replacement for it. `animationend` is
  // a standard, reliable browser event and is expected to fire on a
  // real phone; it's called out separately here because this exact
  // testing environment has one prior, confirmed case of an unrelated
  // browser API (`IntersectionObserver`, see ProductsGridSection.tsx's
  // own comment) simply never firing in its sandbox even though the
  // same code worked in reasoning through the spec — so rather than
  // trust `animationend` alone and risk a transition that visually
  // finishes (the incoming layer has fully covered the old one either
  // way) but never actually folds into `displayIndex` in React state,
  // this timer force-settles shortly after the animation's own 300ms
  // duration if the event hasn't already done it. Cleared and re-armed
  // every time `incoming` changes, so a rapid second tap mid-transition
  // doesn't fire a stale timer against the wrong target index.
  useEffect(() => {
    if (!incoming) return;
    const timer = setTimeout(settleIncoming, 350);
    return () => clearTimeout(timer);
  }, [incoming]);

  const goToPrevImage = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    advance(-1);
  };

  const goToNextImage = () => {
    advance(1);
  };

  // Swipe gesture, 31 Aug 2026 (owner: "to go from one pic to another I
  // should be able to swipe right/left in addition to clicking on the
  // arrows") — deliberately touchend-only, no `touchmove` tracking or
  // `preventDefault()` mid-gesture. This codebase already has one
  // documented case of a hand-rolled touch interceptor in this exact
  // area causing real, unresolved problems on an actual phone
  // (`OverscrollBackGuard`, removed 27 Aug 2026 — see
  // `(site)/layout.tsx`'s own comment) with no way to test real
  // touch-event sequences from this environment to keep iterating
  // blind. Comparing start vs. end position on `touchend` alone avoids
  // that whole class of risk — no passive-listener/`preventDefault`
  // interaction to get wrong — at the cost of not blocking the page's
  // own vertical scroll during the gesture. `justSwiped` suppresses the
  // image area's own tap-to-advance handler from ALSO firing on the
  // synthetic click that follows a touch interaction, so a swipe never
  // double-advances.
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const justSwipedRef = useRef(false);
  const SWIPE_THRESHOLD_PX = 50;

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start || !hasMultipleFrames) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    // Require the horizontal movement to clearly dominate (1.5x the
    // vertical) so an ordinary vertical scroll that drifts slightly
    // sideways doesn't get mistaken for a swipe.
    if (Math.abs(dx) >= SWIPE_THRESHOLD_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
      justSwipedRef.current = true;
      advance(dx < 0 ? 1 : -1);
    }
  };

  const handleImageAreaClick = () => {
    if (justSwipedRef.current) {
      justSwipedRef.current = false;
      return;
    }
    goToNextImage();
  };

  const fadeClass = animateFlip ? "transition-opacity duration-300" : "";

  return (
    <div className="relative">
      {/* FRONT — gallery + title. Normal-flow (not absolutely positioned),
          so this is what actually defines the card's footprint.
          Opacity via inline `style`, not a Tailwind class (confirmed by
          direct measurement this matters): toggling between the
          `opacity-0`/`opacity-100` utility classes left the DOM's
          `className` correct but the *computed* opacity stuck at the
          old value — some cascade/ordering conflict between the two
          utilities, not a transition timing issue (checked well past
          the transition's own duration). An inline style always wins
          regardless of whatever that conflict actually is. */}
      <div
        aria-hidden={flipped}
        style={{ opacity: flipped ? 0 : 1 }}
        className={`overflow-hidden rounded-lg border border-charcoal/10 bg-background ${fadeClass} ${
          flipped ? "pointer-events-none" : ""
        }`}
      >
        {/* Image area — tapping anywhere here (outside the arrow hit
            zones) advances to the next frame, same as the "next" arrow.

            Aspect ratio changed from `4/5` (portrait) to landscape, 29
            Aug 2026, owner: "the pics need to fit and they arent -
            theyre gettign cut" — the `*-kibo.jpg` photos (see
            productCategories.ts) are crops of a fixed composite, and
            forcing them into the old portrait `4/5` box via
            `object-cover` meant scaling up until the box's height was
            satisfied and cropping the excess width — visibly cutting
            off the hand/hanger at the top and the garment's outer
            edges.

            Ratio updated again same day after a second owner report
            ("weird white spaces on all cards") — the first landscape
            ratio (`6/5`, 1.2:1) was tuned to the *original* cell crop
            (~541×455, ≈1.19:1), which turned out to still include the
            composite's own ~66px outer page margin on the cell's outer
            edge (confirmed by pixel-scanning the source at multiple
            rows — an exact, unvarying 66px on every row, i.e. a fixed
            margin, not part of any photo's actual composition) — that
            plain margin read as a dead gap once actually on the card.
            Re-cropped all 6 photos to trim that margin (owner-approved:
            "trim the frame boundary inward" rather than leave it), which
            changed their real ratio to ~475×455/477×455 (≈1.05:1) —
            `aspect-[6/5]` now overshoots that, which would start
            cropping the hand/hanger again. `aspect-[21/20]` (1.05:1)
            matched that source ratio.

            Height increased 20% (30 Aug 2026, owner: "images... were
            more in height - now they look squarish... increase height
            by 20%") — `object-cover` means the taller box just crops
            more off the sides rather than distorting the photo, same
            mechanism as every other ratio change here. 21/20 → 21/24
            (height × 1.2, width unchanged) simplifies to 7/8 (0.875:1,
            portrait again).

            Height increased another 20% (30 Aug 2026, same-day follow-
            up, owner: "increase height by 20%" again) — 7/8 → 7/9.6
            (height × 1.2 again, width unchanged) simplifies to 35/48
            (≈0.729:1). */}
        <div
          className={hasMultipleFrames ? "relative aspect-[35/48] cursor-pointer" : "relative aspect-[35/48]"}
          onClick={hasMultipleFrames ? handleImageAreaClick : undefined}
          onTouchStart={hasMultipleFrames ? handleTouchStart : undefined}
          onTouchEnd={hasMultipleFrames ? handleTouchEnd : undefined}
        >
          {/* Base layer — the settled photo. Always present, never
              animated, never removed from the DOM during a transition;
              see the `incoming` state's own comment for why that's the
              whole fix. */}
          {currentFrame.image ? (
            <Image
              src={currentFrame.image.url}
              alt={`${category.name} — ${currentFrame.label}`}
              fill
              className="object-cover"
            />
          ) : (
            <MediaPlaceholder label={currentFrame.label} className="h-full w-full" />
          )}

          {/* Incoming layer — only exists while a transition is in
              flight, slides in on top of the base layer above and
              becomes the new base once its animation actually finishes
              (`onAnimationEnd` → `settleIncoming`). `key={incoming.index}`
              forces a fresh element per transition so the animation
              replays correctly even if the same frame is re-targeted
              mid-gesture. */}
          {incomingFrame && (
            <div
              key={incoming!.index}
              className={`absolute inset-0 ${
                incoming!.direction === 1
                  ? "animate-[kibo-slide-in-right_0.3s_ease-out]"
                  : "animate-[kibo-slide-in-left_0.3s_ease-out]"
              }`}
              onAnimationEnd={settleIncoming}
            >
              {incomingFrame.image ? (
                <Image
                  src={incomingFrame.image.url}
                  alt={`${category.name} — ${incomingFrame.label}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <MediaPlaceholder label={incomingFrame.label} className="h-full w-full" />
              )}
            </div>
          )}

          {hasMultipleFrames && (
            <>
              {/* Reduced 15% (30 Aug 2026, owner: "circle around swipe
                  arrow... too big - reduce 10-20% take a call") —
                  h-8/w-8 (32px) → h-[27px]/w-[27px], the midpoint of the
                  requested range. */}
              <button
                type="button"
                onClick={goToPrevImage}
                aria-label={`Previous image — ${category.name}`}
                className="absolute left-2 top-1/2 flex h-[27px] w-[27px] -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-charcoal shadow-sm transition-colors hover:bg-background"
              >
                <span aria-hidden="true">‹</span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextImage();
                }}
                aria-label={`Next image — ${category.name}`}
                className="absolute right-2 top-1/2 flex h-[27px] w-[27px] -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-charcoal shadow-sm transition-colors hover:bg-background"
              >
                <span aria-hidden="true">›</span>
              </button>

              {/* Active dot tracks `incoming.index` during a transition
                  (not the still-settled `displayIndex`) — 31 Aug 2026,
                  same pass as the two-layer rewrite above — so the dots
                  move the instant a swipe/tap/arrow fires, in step with
                  the slide that's visibly already underway, rather than
                  waiting for the animation to finish. */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {category.gallery.map((frame, i) => (
                  <span
                    key={frame.label}
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === (incoming ? incoming.index : displayIndex) ? "bg-charcoal/70" : "bg-charcoal/25"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Bottom bar — the flip trigger, scoped to just this row. */}
        <div
          role="button"
          tabIndex={flipped ? -1 : 0}
          aria-label={`${category.name} — show specifications`}
          onClick={onToggleFlip}
          onKeyDown={handleFlipKeyDown}
          className="group flex cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
        >
          {/* `text-h4` (14px, 30 Aug 2026, owner: "H4 for each of the
              card label") — downgraded from `text-h3` (18px). */}
          <span className="text-h4 font-medium text-charcoal">{category.name}</span>
          {/*
            Flip affordance, labelled (27 Aug 2026) — a bare rotate icon
            was still ambiguous on first encounter; pairing it with
            "Specs" removes any doubt about what tapping the bar does.
            Still `aria-hidden` — the bar itself carries the real label.

            30 Aug 2026, owner feedback:
            - Background changed `bg-charcoal` → `bg-green-gray`
              ("black button to sage green grey" — Green Gray, #8F988E,
              is this palette's actual sage-green-grey token; Sage Green
              itself, #6F7F6E, reads as plain green rather than grey).
            - Rotate-arrows icon removed outright ("remove the arrows
              next to spec") — the label text alone still carries the
              same meaning, the bar itself is still the full tap target.
            - Label bumped `text-xs` (8.4px, this site's own scaled-down
              generic step) → `text-micro` (11px) — "increase the font
              size of 'specs' to the next one" — the next defined step
              up in the semantic type scale.

            30 Aug 2026, same-day follow-up (owner: "All clickable
            buttons to have the same font size - same as talk to Kibo.
            Each button if black changes to sage green grey when
            hovered on and each sage green grey button to change to
            black when hovered on"):
            - Label bumped again, `text-micro` → `text-support` (13px),
              matching every "Talk to KIBO" button's own size.
            - This pill is already sage-green-grey at rest, so it's the
              "grey → black on hover" half of the swap — `group-hover:
              bg-charcoal` on the pill (the row above got `group` added
              for this), triggered by hovering anywhere on the row, not
              just the small pill itself, since the whole row is the
              real click target. */}
          <span
            aria-hidden="true"
            // `group-active:bg-charcoal` added 31 Aug 2026 (owner, testing
            // live mobile: "the specs button does not change color") —
            // `group-hover:bg-charcoal` alone never fires on a touchscreen
            // (there's no cursor to hover with), so this pill's black-on-
            // interaction feedback simply never happened on mobile — the
            // one place most visitors will actually tap it. `:active`
            // covers the touch-and-hold moment a tap produces, which
            // hover can't; `group-hover` stays too, unchanged, for
            // desktop's actual mouse-hover case.
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-green-gray px-3 text-background transition-colors group-hover:bg-charcoal group-active:bg-charcoal"
          >
            {/* Sentence case, not uppercase (29 Aug 2026, font case
                1.png: "'Specs' → button label, sentence case") — the
                label was already typed "Specs" (sentence case); only
                the `uppercase` transform forcing it to "SPECS" visually
                is removed. */}
            <span className="text-support font-semibold tracking-wide">Specs</span>
          </span>
        </div>
      </div>

      {/* BACK — full spec list. `absolute inset-0` over the front face's
          box is what keeps the card's own footprint fixed to the front
          face's size — this content scrolls internally instead of
          growing the card if it doesn't fit. */}
      <div
        role="button"
        tabIndex={flipped ? 0 : -1}
        aria-hidden={!flipped}
        aria-label={`${category.name} — back to gallery`}
        onClick={onToggleFlip}
        onKeyDown={handleFlipKeyDown}
        style={{ opacity: flipped ? 1 : 0 }}
        className={`absolute inset-0 flex cursor-pointer flex-col overflow-hidden rounded-lg border border-charcoal/10 bg-background p-5 text-left ${fadeClass} ${
          flipped ? "" : "pointer-events-none"
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFlip();
          }}
          aria-label="Back to gallery"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:bg-charcoal/8 hover:text-charcoal"
        >
          {/* `text-h4` (30 Aug 2026, owner: "no other font sizes floating
              around" — every size must come from the 8 named tokens)
              replacing raw `text-base` on this close icon and the title
              below it, and `text-support`/`text-micro` replacing
              `text-xs`/`text-sm` on the spec list and note. Title
              matches the front face's own name size (also `text-h4`,
              same owner instruction). */}
          <span aria-hidden="true" className="text-h4 leading-none">
            ✕
          </span>
        </button>

        <span className="pr-8 text-h4 font-medium text-charcoal">{category.name}</span>

        <dl className="mt-4 flex flex-1 flex-col gap-2 overflow-y-auto text-support">
          {category.specs.map((spec) => (
            <div key={spec.label} className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
              <dt className="shrink-0 font-medium text-charcoal sm:w-24">{spec.label}</dt>
              <dd className="text-charcoal/70">{spec.value}</dd>
            </div>
          ))}
        </dl>
        {category.note && (
          <p className="mt-2 border-t border-charcoal/10 pt-2 text-micro text-charcoal/50">
            {category.note}
          </p>
        )}
      </div>
    </div>
  );
}
