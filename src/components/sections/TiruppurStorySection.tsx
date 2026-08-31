import { Fragment } from "react";
import Image from "next/image";
import type { Media } from "@/lib/content";
import {
  TIRUPPUR_HEADLINE_LINE_1,
  TIRUPPUR_HEADLINE_ACCENT,
  TIRUPPUR_SUB_BLOCKS,
  TIRUPPUR_CLOSING_BOLD,
  TIRUPPUR_CLOSING_REST,
  TIRUPPUR_PHOTO,
} from "@/lib/tiruppurSection";

// "The Tiruppur Story" — second section of `/our-story`, directly below
// We Started by Listening, at anchor `#tiruppur`.
// KIBO_Brand_and_Copy_Direction.md, "Our Story — The Tiruppur Story —
// page anatomy" (LOCKED 27 Aug 2026, reference: `Tiruppur.png`).
// Within-page only — no separate route, no scroll-triggered transition
// (unlike Home→Products or Products→Our Story, both real page changes;
// this is just the next section on the same page you scroll past).
//
// **Restructured 30 Aug 2026** (owner: "where apparel runs deep should
// be a horizontal heading above the video just like... you build your
// market we build the supply behind it in terms of font and everything
// right so that is above the video not in that text box... the symbols
// on the left of a long heritage specialized ecosystems... they can go
// don't need them") — three changes from the original single-panel
// design:
// 1. "Where apparel runs deep" moves OUT of the translucent panel
//    entirely, into its own plain white banner above the full-bleed
//    photo — styled identically to Supply's own headline (`text-h2
//    font-bold leading-[1.1] tracking-tight`, centered, dash below),
//    not just similarly sized. This does genuinely break from "every
//    piece of text in the panel stays untouched" (an earlier, narrower
//    instruction about a different edit) — the owner's explicit new
//    instruction to relocate this specific line supersedes that.
// 2. The panel itself now only holds the two sub-blocks (label + copy,
//    no headline, no icon) and the closing statement — genuinely
//    smaller/simpler than before.
// 3. Sub-block icons (thread/people) removed outright — label + copy
//    only, no icon circle. `TiruppurIcon` import removed since nothing
//    renders it anymore; the icon files/component stay in place
//    unused, in case a future pass wants them back.
//
// Otherwise still deliberately a different visual pattern from every
// other section on the site — full-bleed cinematic photo background
// with a translucent text panel, not a white two-column split with a
// vertical rule. This is intentional per the brand doc, not an
// inconsistency to fix.
//
// **Video replaced with a static photo + CSS pan/zoom, 30 Aug 2026**
// (owner: "I am not sure about how this video shows - first its
// pixelated... I am ok with just a nicer picture and panning through it
// or a high res video this is too pixelated") — the autoplay stock clip
// this shipped with (`tiruppur-placeholder.mp4`, a real but low-
// resolution Pexels video) became visibly blocky once stretched full-
// bleed across an 85vh section via `object-cover`. No dedicated
// Tiruppur shoot exists yet, so rather than keep hunting for a
// genuinely high-res video, this moved to still photography instead.
// `tiruppur-placeholder.mp4` left in `public/our-story/`, unreferenced,
// in case a real high-res video edit arrives later and this should
// revert to a video-based treatment.
//
// **Single photo → scrolling filmstrip → back to single photo, same
// day.** The filmstrip (4 photos, normalized to section height, laid
// edge-to-edge, auto-scrolling, blended seams via `mask-image`) was
// built and does work mechanically — parked, not deleted, see
// TIRUPPUR_PHOTO_SEQUENCE in tiruppurSection.ts. Owner asked to step
// back to basics first: one single photo filling the frame (like the
// very first version), specifically to check how it actually resolves
// before investing further in the multi-photo layout — see
// tiruppurSection.ts's resolution caveat on the current source
// (`tiruppur-photo-1.jpg`, only 1000px wide natively, upscaled to fill
// this banner). `kibo-ken-burns` (globals.css) supplies the pan/zoom.
//
// **Dark-to-transparent gradient scrim added, same day** (owner: "In
// its static form overlay with black for the text to pop and reduce
// opacity to zero where the video becomes important... The reference is
// just for the dark to light variation") — a new absolute layer sits
// between the photo and the panel: opaque-ish black behind/around the
// panel on the left, fading to fully transparent by roughly the frame's
// midpoint so the factory-floor photo reads clearly, unobscured, past
// that point. The reference image supplying this direction was a
// different section's own mockup (dark navy/gold, unrelated layout) —
// only the dark→light gradient *behavior* was taken from it, not its
// color palette or structure.
// `media` — Sanity-editable image/video slot, 30 Aug 2026 (see
// OurStoryContent in lib/content/types.ts), with a fallback to the
// current `TIRUPPUR_PHOTO` constant if unset (that constant stays
// defined either way — it's also `sampleOurStory.tiruppurMedia`'s own
// `url`, see sampleContent.ts). A play button was added, same day
// (owner: "add a play button to this... video/image option, build
// functionality for both"), matching Listening/Founder's own
// click-to-play affordance — this section previously had none since it
// only ever held an ambient background photo, not a click-to-play
// video.
export function TiruppurStorySection({ media }: { media?: Media }) {
  // "KIBO" split out of TIRUPPUR_CLOSING_BOLD, 31 Aug 2026 (owner,
  // testing live mobile, after a brief back-and-forth: "I think we just
  // say KIBO bold and then 'works within ecosystems like these' can be
  // regular font on mobile") — same `.replace` pattern
  // FounderSection.tsx already uses for its own "KIBO" split, rather
  // than editing tiruppurSection.ts's copy itself (that constant is
  // still the correct, unchanged BOLD/REST split for desktop — see the
  // render below, `lg:font-semibold` restores the full original bold
  // phrase at `lg` and up, this is mobile-only).
  const closingBoldRest = TIRUPPUR_CLOSING_BOLD.replace("KIBO", "");

  // Sub-blocks + closing statement, pulled into a variable 31 Aug 2026
  // so the same content can render twice below — once inside the
  // desktop overlay panel, once as its own plain block under the photo
  // on mobile (see that split's own comment further down for why).
  // Sub-block copy and the closing statement bumped `text-body` (15px),
  // `lg:text-support` (13px, back to the original desktop-overlay size),
  // 31 Aug 2026 (owner, testing live: "it kind of looks out of whack...
  // that small text does not make sense because everything is now
  // vertically placed") — 13px reads fine packed into a narrow ~282px
  // side panel (its whole design constraint), but the same size in the
  // new full-width mobile block (see the split below) has much more
  // room per line and reads as disproportionately small next to it. The
  // breakpoint is `lg` (not `sm`), matching where this content actually
  // switches from the mobile block to the desktop overlay panel.
  const panelBody = (
    <>
      {/* Gap widened below `lg` + a divider inserted between the two
          sub-blocks, 31 Aug 2026 (owner, testing live: "between 'A long
          heritage' and 'Specialised ecosystems' we need a little more
          gap and we need that horizontal line accent treatment also —
          the shorter horizontal line treatment we used between 'before
          building for the market...' and 'what we learned showed...'"
          — i.e. Listening's own `h-px w-9` paragraph-divider style) —
          this pairing had only a plain `1.05rem` gap and no divider at
          all before; fine as a compact side-panel pairing at `lg`+
          (unchanged there), but read as too tight/undifferentiated once
          this content became a full-width mobile block (see the
          mobile/desktop split further down). `gap-[1.75rem]` below `lg`
          (was `1.05rem` uniformly), `lg:gap-[1.05rem]` restores the
          original desktop value exactly. */}
      {/* `items-center` added, 31 Aug 2026 (owner, testing live: "the
          horizontal accent line under 'A long heritage' is left aligned
          instead of center") — same bug, same fix, as FounderSection's
          own paragraph divider earlier this pass: this flex column had
          no alignment override of its own, so the fixed-width `w-9`
          dash below defaulted to flush-left instead of centered.
          `lg:items-stretch` makes the previously-implicit desktop
          default explicit, so the sub-block wrapper's own width (and
          therefore its `text-right` alignment) is provably unchanged at
          `lg` and up — the dash itself doesn't even render there
          (`lg:hidden`, see its own comment), so only the mobile
          rendering actually changes here. */}
      <div className="flex flex-col items-center gap-[1.75rem] lg:items-stretch lg:gap-[1.05rem]">
        {TIRUPPUR_SUB_BLOCKS.map((block, i) => (
          <Fragment key={block.label}>
            {i > 0 && (
              <span aria-hidden="true" className="h-px w-9 bg-charcoal/20 lg:hidden" />
            )}
            <div className="flex flex-col gap-[0.175rem]">
              <h3 className="text-h3 font-semibold text-charcoal">{block.label}</h3>
              <p className="text-body text-charcoal/70 lg:text-support">{block.copy}</p>
            </div>
          </Fragment>
        ))}
      </div>

      {/* Matched to Listening's own short accent-dash style below `lg`,
          31 Aug 2026 (owner: "give the same treatment to the horizontal
          line [after 'Tiruppur is one of the most vibrant examples']...
          the shorter horizontal line treatment... don't change the
          desktop version, that's fine") — was a full-width, lighter
          `bg-charcoal/15` rule at every breakpoint; now `w-9 bg-charcoal
          /20` (Listening's exact paragraph-divider values) below `lg`,
          `lg:w-full lg:bg-charcoal/15` restores the original desktop
          rule unchanged. */}
      <span
        aria-hidden="true"
        className="mt-[1.05rem] block h-px w-9 bg-charcoal/20 lg:w-full lg:bg-charcoal/15"
      />

      <p className="mt-[1.05rem] text-body text-charcoal lg:text-support">
        <span className="font-semibold">KIBO</span>
        <span className="font-normal lg:font-semibold">{closingBoldRest}</span>
        {TIRUPPUR_CLOSING_REST}
      </p>
    </>
  );

  return (
    <section id="tiruppur" className="relative w-full scroll-mt-24 overflow-hidden">
      {/* Standalone banner, matching Supply's own headline treatment
          exactly (see file comment) — plain white background, not part
          of the full-bleed photo below it. `pt-7 sm:pt-[2.45rem]`
          matches the site's current standard inter-section seam value
          (the gap above, from Listening's video).

          Bottom bumped separately, same day (owner, on a screenshot:
          "white gap between bottom edge of we are listening video
          placeholder and where apparel runs deep should be the same
          [as] the gap between where apparel runs deep and top edge of
          [this section's own] video placeholder") — measured both live:
          Listening→heading was 93.2px, heading→this-section's-own-video
          was only 56.2px (`pb-7 sm:pb-[2.45rem]` symmetric with the
          top). Bumped the bottom to `pb-[54px] sm:pb-[76px]` so the
          total heading→video gap (that padding + the row-gap + dash
          height above it) now matches the 93.2px top gap exactly,
          rather than shrinking the top to match the smaller bottom.

          **Reduced again, 30 Aug 2026** (owner, on a screenshot: "reduce
          the gap between 'where apparel runs deep' and the top edge of
          the video thumbnail") — the exact-match value above made this
          one seam noticeably more generous than the site's usual rhythm
          once actually seen live; back to the standard seam-half value,
          `pb-4 sm:pb-5` (16px/20px), no longer tied to matching
          Listening's own top gap. */}
      {/* `pb-4` → `pb-7` below `sm`, 31 Aug 2026 (owner, testing live:
          "the gap between [this dash] and the top edge of the video
          thumbnail is less as compared to... the base of the horizontal
          line and top edge of the We started by listening video
          thumbnail... make that consistent") — matches Listening's own
          mobile value exactly (`pt-7`/`pb-7` on that section's banner,
          see WeStartedByListeningSection.tsx). `sm:pb-5` unchanged —
          not flagged, mobile-only per this whole feedback session's
          standing rule. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-4 px-6 pt-7 pb-7 text-center sm:px-10 sm:pt-[2.45rem] sm:pb-5">
        {/* Single line (30 Aug 2026, owner: "where apparel runs deep
            needs to be a single line") — was two hard-`block` lines
            (matching the old in-panel layout's narrower column, where
            it needed to wrap); now a plain, unbroken line, since this
            banner is full-width and has plenty of room for it.

            "deep" sage-green, same day (owner: "do a green grey sage for
            deep") — matches the same two-tone treatment now applied to
            Supply/Long Run/Listening's own headlines. */}
        <h2 className="text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          {TIRUPPUR_HEADLINE_LINE_1}{" "}
          <span className="text-sage-green">{TIRUPPUR_HEADLINE_ACCENT}</span>
        </h2>
        <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />
      </div>

      {/* `h-[60vh] min-h-[420px]` (30 Aug 2026, owner: "the white space
          underneath it and the whole video should appear in the entire
          fold itself. It should not spill over the fold. So reduce the
          height of the video itself") — was `h-[85vh] min-h-[600px]`;
          both scaled down by the same ratio (60/85 ≈ 0.71) so the
          min-height safety net for short viewports stays proportional. */}
      <div className="relative h-[60vh] min-h-[420px] w-full overflow-hidden">
        {/* Media slot made Sanity-editable, 30 Aug 2026 — same
            image/video toggle as Listening/Founder, with one difference:
            the Ken Burns pan (ambient motion standing in for a real
            video) only applies to the image branch — once a real video
            is set, the video itself supplies the motion, so panning it
            too would be redundant/distracting. `autoPlay muted loop`
            here (unlike Listening/Founder's click-to-play video, which
            deliberately doesn't autoplay) matches this section's own
            established autoplay-ambient-background pattern from before
            it was a static photo — the new play button below is an
            explicit owner addition on top of that, not a replacement
            for the autoplay. */}
        {media?.type === "video" ? (
          <video
            src={media.url}
            poster={media.poster ?? undefined}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div
            aria-hidden="true"
            className="absolute inset-0 h-full w-full animate-[kibo-ken-burns_24s_ease-in-out_infinite_alternate]"
          >
            <Image
              src={media?.type === "image" ? media.url : TIRUPPUR_PHOTO}
              alt=""
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Play button, added 30 Aug 2026 (owner: "add a play button to
            this") — this section previously had none (it only ever held
            an ambient background photo/video, not a click-to-play
            interaction). Centered in the frame rather than off to one
            side — unlike Founder's deliberately-positioned button, there
            's no single "safe" spot here since the panel can be a
            different width at different breakpoints; centered stays
            clear of the panel (right side, max ~20rem wide) on any
            viewport wide enough for this section's own min-width.
            Non-functional for now, same "coming soon" pattern as
            Listening/Founder's own buttons — wire up real playback once
            there's an actual video to play. `h-10 w-10`/icon `h-4 w-4`
            — same reduced size as those two buttons (30 Aug 2026, owner:
            "video play buttons need to be smaller"), matched from the
            start rather than shipped oversized then fixed. */}
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            type="button"
            aria-label="Play video — Where apparel runs deep (video coming soon)"
            className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md transition-transform hover:scale-105"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-4 w-4 fill-charcoal" aria-hidden="true">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>

        {/* Dark-to-transparent scrim — see file comment above. Sits above
            the photo, below the text panel. Flipped to `bg-gradient-to-l`
            (30 Aug 2026, following the panel's own move to the right
            edge, see that div's comment) — the dark side of the
            gradient has to stay behind wherever the panel actually is,
            so it moved from the left edge to the right edge with it.
            `to-transparent` at ~55% of the frame width is still where
            "the video becomes important" (the factory-floor detail)
            takes over unobscured, just mirrored. */}
        {/* Scrim restricted to `lg:block`, 31 Aug 2026 — see the panel
            split below for the full reasoning. This gradient exists to
            keep the overlay panel's text legible against the photo
            behind it; below `lg` there's no overlay panel anymore (it's
            a plain block under the photo instead), so a right-side
            darkening with nothing sitting on top of it would just dim
            part of the photo for no reason. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-gradient-to-l from-black/75 via-black/35 via-45% to-transparent to-55% lg:block"
        />

        {/* Translucent overlay panel — `lg` and up only, 31 Aug 2026 (see
            file comment on `panelBody` above). Original design, unedited
            at this breakpoint: a full-height rectangle (not a floating
            card, 30 Aug 2026 — "extend to the top edge of the video and
            the bottom edge of the video... remove the rounded boxing"),
            pinned to the right edge (30 Aug 2026 — "move this text box
            to the right edge of the screen"), text-right, translucent +
            blurred so the photo reads through it.

            Below `lg` this panel is `hidden` outright, not just resized
            — found while checking the live site on mobile (owner: "we
            just see like a tiny vertical of the video" — a screenshot of
            "Where apparel runs deep" on a phone). Root cause: this
            panel's width was already capped at a fixed `max-w-[17.64rem]`
            (282px) with no smaller mobile value, plus the dark scrim
            behind it — together those covered the photo almost
            completely on a ~375px-wide phone (282px panel + the scrim's
            own darkened region past it), leaving only a thin strip of
            actual photo visible, which is exactly the "tiny vertical"
            description. A photo-with-side-panel composition doesn't
            have a smaller version that still works once the panel's own
            readable width (this content doesn't compress much smaller
            without becoming illegible) is most of the available screen
            width — so below `lg` this becomes a plain full-width block
            *under* the photo instead (see `panelBody`'s second render,
            just below this section), the same "stack instead of
            overlay" fix already applied to Supply's row and Listening's
            two-column split earlier this same pass. */}
        <div className="absolute inset-y-0 right-0 hidden w-full max-w-[20.16rem] flex-col justify-center bg-background/70 p-[2.1rem] text-right backdrop-blur-md lg:flex">
          {panelBody}
        </div>
      </div>

      {/* Mobile/tablet stacked panel, 31 Aug 2026 — `lg:hidden` mirror of
          the overlay panel above, see that div's own comment. Plain
          in-flow block below the photo, not translucent/blurred (nothing
          underneath it to blend with), full width, centered rather than
          right-aligned — this is no longer hugging a shared edge with
          anything, so there's no reason to keep the desktop's
          right-alignment, and centered matches how every other stacked
          mobile section on this page (Listening, Founder) now reads.

          `pb-0` (was `py-8`, i.e. 32px on both sides), 31 Aug 2026 (owner,
          testing live: "the gap between 'KIBO works within ecosystems...'
          and the top edge of the [Founder section's] video thumbnail...
          is large, that gap needs to reduce") — FounderSection.tsx's own
          top padding (`pt-[5.4rem]`, 86.4px) was deliberately calibrated
          as the ENTIRE Tiruppur→Founder gap, back when Tiruppur
          contributed zero bottom spacing of its own (see that file's own
          comment: "since Tiruppur is full-bleed with zero padding of its
          own, this section's bottom alone has to carry that FULL value").
          This new mobile block breaks that assumption by existing at
          all — its own bottom padding was stacking on top of Founder's
          already-complete 86.4px, not sharing it. Dropping this block's
          bottom padding to 0 restores the original single-source-of-gap
          design Founder's own spacing already assumes, rather than
          shrinking Founder's own carefully-tuned value to compensate for
          an unrelated new element. */}
      <div className="flex w-full flex-col items-center gap-[1.05rem] bg-background px-6 pt-8 pb-0 text-center sm:px-10 lg:hidden">
        {panelBody}
      </div>
    </section>
  );
}
