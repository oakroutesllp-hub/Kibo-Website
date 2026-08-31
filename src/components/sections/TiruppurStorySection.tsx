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
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-4 px-6 pt-7 pb-4 text-center sm:px-10 sm:pt-[2.45rem] sm:pb-5">
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
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-l from-black/75 via-black/35 via-45% to-transparent to-55%"
        />

        {/* Translucent panel — a full-height rectangle, not a floating
            rounded card (30 Aug 2026, owner: "extend to the top edge of
            the video and the bottom edge of the video... remove the
            rounded boxing"). `rounded-2xl` dropped. Content stays
            vertically centered via `flex-col justify-center` on the
            panel itself.

            **Moved from the left edge to the right edge, same day**
            (owner, on a screenshot: "move this text box to the right
            edge of the screen instead of keeping it left aligned...
            the text doesn't have to change, the text box remains as
            is, just align it to the right") — `absolute inset-y-0
            left-0` → `absolute inset-y-0 right-0` (`left` unset instead
            of `right`, panel's own width still comes from `max-w`, not
            a stretched-to-fill box). Text itself stays exactly as it
            was (`text-right`, both sub-blocks and the closing
            statement) — the owner was explicit this move is position-
            only, not a text-alignment change, so nothing else in this
            panel touched. The scrim gradient (previous div) was flipped
            to match — see that div's own comment. */}
        <div className="absolute inset-y-0 right-0 flex w-full max-w-[17.64rem] flex-col justify-center bg-background/70 p-[1.4rem] text-right backdrop-blur-md sm:max-w-[20.16rem] sm:p-[1.75rem] lg:p-[2.1rem]">
          {/* Sub-blocks — icon circles removed (30 Aug 2026, owner:
              "the symbols on the left of a long heritage specialized
              ecosystems... they can go don't need them"); label + copy
              only now, no leading icon. `text-h3`/`text-support` sizes
              unchanged from before. */}
          <div className="flex flex-col gap-[1.05rem]">
            {TIRUPPUR_SUB_BLOCKS.map((block) => (
              <div key={block.label} className="flex flex-col gap-[0.175rem]">
                <h3 className="text-h3 font-semibold text-charcoal">{block.label}</h3>
                <p className="text-support text-charcoal/70">{block.copy}</p>
              </div>
            ))}
          </div>

          <span aria-hidden="true" className="mt-[1.05rem] block h-px w-full bg-charcoal/15" />

          <p className="mt-[1.05rem] text-support text-charcoal">
            <span className="font-semibold">{TIRUPPUR_CLOSING_BOLD}</span>
            {TIRUPPUR_CLOSING_REST}
          </p>
        </div>
      </div>
    </section>
  );
}
