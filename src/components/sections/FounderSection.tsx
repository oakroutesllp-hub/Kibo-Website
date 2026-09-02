import Image from "next/image";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import type { Media, OurStoryCopyContent } from "@/lib/content";

// "The Person Behind KIBO" — third section of `/our-story`, directly
// below The Tiruppur Story, at anchor `#founder`.
// KIBO_Brand_and_Copy_Direction.md, "Our Story — The Person Behind
// KIBO — page anatomy" (LOCKED 27 Aug 2026, reference: `Our Story.png`).
// Built directly against that mockup for layout proportions, spacing,
// and photo/play-button placement — same rule as every other mockup-
// referenced section on this site: the mockup is a structural/visual
// target, not a type or color source (see color override below, the
// one place this rule actually mattered enough to need calling out).
//
// Two-column split, ~40/60, deliberately NO vertical rule between the
// columns — same as We Started by Listening and Tiruppur (only the
// Products page sections use a vertical rule). Text column: dash
// accent, headline, three plain stacked paragraphs — no icon/bullet
// rows this time, unlike Supply's row list or Custom's attribute grid.
//
// Column order: text first (left), video second (right) — flipped to
// "video left, text right" on 29 Aug 2026, then flipped BACK here on
// 30 Aug 2026 (owner: "I want the video to go to the right... and the
// story behind Kibo to go to the left. This should be exactly like the
// we started by listening section") — see the grid's own comment below
// for the full mechanism.
//
// No "OUR STORY" eyebrow — consistent with Tiruppur's omission; only
// We Started by Listening (the first piece on this page) carries that
// label.
//
// COLOR OVERRIDE (owner decision, 28 Aug 2026): the mockup itself uses
// gold/amber for "KIBO" and the accent dash, and a dark navy (not the
// site's own charcoal) for headline/body text — a real departure from
// the sage-green/charcoal palette every other section has stayed
// within. Owner was asked directly and chose to override this rather
// than follow the mockup's own colors: sage-green replaces gold
// wherever it appears (the dash, both "KIBO" mentions), charcoal
// replaces navy (headline, body text). Everything else about the
// mockup — layout, copy, photo, play-button placement — is followed
// exactly as shown.
//
// Photo/placeholder: unlike We Started by Listening's generic
// diagonal-hatch-turned-photo placeholder, or Tiruppur's autoplay stock
// video, this section's placeholder is the mockup's OWN photo — the
// founder on a Tiruppur-style street, talking with her hands — cropped
// directly from `Our Story.png` (owner's own words: "use the same pic
// (static) as a placeholder. In reality this is a video."). This is
// real, non-negotiable future production (a dedicated shoot, not
// existing footage repurposed), so the photo is a deliberate stand-in,
// not a generic gray box — swap it for the real video once that shoot
// happens. Same click-to-play interaction as We Started by Listening
// (static image + play button the visitor taps) — deliberately NOT the
// autoplay/muted/looping pattern Tiruppur uses; those two playback
// treatments stay distinct per the brand doc.
//
// Play button positioned left-of-center over the street scene (roughly
// 14% from the left, vertically centered) rather than dead-center over
// the photo — matches the mockup exactly, keeps the button off the
// founder's face. Measured directly from the mockup crop rather than
// eyeballed. No dark scrim over the photo (unlike We Started by
// Listening's placeholder box) — this is a real, naturally-lit photo,
// not a generic placeholder that needs dimming for contrast; the
// button's own opaque background supplies enough contrast on its own,
// and that exact spot in the photo already sits in tree shade.
// **Superseded 29 Aug 2026** — the button was later re-centered (see
// below), and the crop itself carried the mockup's own baked-in dark
// play-button graphic at this original 14%/49% spot — once our real
// button moved to dead-center, that baked-in one just sat there
// unexplained ("remove the black arrow with play button its
// redundant"). Since it's pixel content, not a DOM element, it can't be
// deleted outright — `founder-placeholder.jpg` was re-processed with a
// heavy local blur over that exact region (`sharp`, blur radius 30,
// composited back over the original) so it reads as soft background
// blur rather than a second button, without touching anything else in
// the frame.
//
// **Photo swapped 30 Aug 2026** (owner: "Delete this one from the
// website. Use the one from the folder - it is called our story 2") —
// `founder-placeholder.jpg` (the baked-in-button crop above) replaced
// wholesale by `founder-placeholder-2.jpg`, cropped fresh from the
// project root's `Our story 2.png` the same way (`sharp .extract`,
// scanning inward from the source's own cream card-border edges rather
// than eyeballing a box) — this source has no baked-in play button or
// any other UI chrome in the photo itself, so no blur patch is needed
// this time. Old file left in place, just unreferenced, in case it's
// wanted again.
//
// Anchor: `id="founder"` on the section itself, `scroll-mt-24` — same
// plain native URL-fragment pattern as `#listening`/`#tiruppur`.
// `media` — Sanity-editable image/video slot, 30 Aug 2026 (see
// OurStoryContent in lib/content/types.ts) — same mechanism as
// WeStartedByListeningSection's own `media` prop.
// `copy` (1 Sep 2026, owner: "make everything editable") — reverses
// founderSection.ts's own "fixed, code-level" call. Takes the full
// `OurStoryCopyContent` (same singleton also feeds Listening/Tiruppur)
// and reads only its own Founder fields.
export function FounderSection({ media, copy }: { media: Media; copy: OurStoryCopyContent }) {
  // Both "KIBO" mentions render in the accent color — split each string
  // at "KIBO." rather than storing the prefix/accent word as separate
  // constants, since the accent word is always the fixed literal "KIBO."
  // and this keeps founderSection.ts's exports matching the copy 1:1
  // with what the mockup shows, one string per line.
  // Headline's own `.replace` target dropped its trailing "." (30 Aug
  // 2026, matching FOUNDER_HEADLINE_LINE_2's own full-stop removal —
  // see that constant's comment); PARAGRAPH_3 keeps its period (a real
  // sentence-ending full stop, not the same case), so its own replace
  // target is unchanged.
  const headlineLine2Prefix = copy.founderHeadlineLine2.replace("KIBO", "");
  const paragraph3Prefix = copy.founderParagraph3.replace("KIBO.", "");

  return (
    <section id="founder" className="w-full scroll-mt-24 bg-background">
      {/* Grid — plain 50/50 split, `lg:gap-0` (gap carried entirely by
          each column's own padding wrapper below), matching Listening's
          grid exactly.

          `py-8 sm:py-10` (32px/40px, both top AND bottom, 30 Aug 2026,
          owner, on a screenshot of the Tiruppur→Founder seam on
          `/our-story`: "increase the gap between the bottom line of the
          video from the tiruppur section and the video thumbnail for
          the story behind kibo... too thin a line... flaky... match the
          distance between the bottom line of the hero image... and
          products... keep that gap that way on top and similar on
          bottom") — was `py-4 sm:py-5` (16px/20px); the Hero→Products
          seam being referenced is `ProductsGridSection.tsx`'s own
          `pt-8 sm:pt-10`, so this section now uses that identical value
          on both sides rather than just the general seam standard.

          Bumped again 35% same day (owner, on a live screenshot: "still
          find the gap to be a lesser on top and bottom... increase this
          by another maybe thirty forty percent") — `py-8 sm:py-10`
          (32px/40px) → `py-[2.7rem] sm:py-[3.375rem]` (43.2px/54px),
          both ×1.35 (the middle of the requested 30–40% range). This
          now exceeds the Hero→Products reference value on purpose —
          the owner's live-reviewed follow-up is more recent and more
          specific than the earlier "match that seam" instruction.

          Top DOUBLED, same day (owner, on a screenshot of the
          Tiruppur→Founder seam specifically: "double the white space
          between base edge of the apparel runs deep video and top edge
          of the story behind kibo") — `pt-[2.7rem] sm:pt-[3.375rem]`
          (43.2px/54px) → `pt-[5.4rem] sm:pt-[6.75rem]` (86.4px/108px),
          ×2. Bottom (to Footer) initially stayed at
          `pb-[2.7rem] sm:pb-[3.375rem]` here — not flagged in that pass,
          so only pt/pb split, not both sides scaled. **Bottom matched to
          top, 30 Aug 2026** (owner: "the gap between the bottom of the
          apparel-runs-deep video and the What-led-to-KIBO thumbnail —
          measure that gap, it should be the same as the gap between the
          bottom edge of the What-led-to-KIBO thumbnail and the
          horizontal line below it") — that referenced top gap IS this
          `pt` value (86.4px/108px, this section's own top padding is the
          entire Tiruppur→Founder seam, no other spacing between them);
          `pb` raised from `[2.7rem]`/`[3.375rem]` to match it exactly,
          `pb-[5.4rem] sm:pb-[6.75rem]`, so the section is now
          symmetric top/bottom.

          **Column order flipped AGAIN, 30 Aug 2026** (owner: "mirror
          both the scenarios attached... for the story behind keyboard,
          flip the arrangement, keep the central vertical line as is and
          then move the video thumbnail to the left and text to the
          right. Now the left edge of the story behind keyboard
          thumbnail... and the left vertical edge of the we started by
          listening thumbnail should be aligned") — reverses the
          previous same-day flip (text left, video right, matching
          Listening's OLD arrangement). Video is now the FIRST grid
          child (left), text SECOND (right) — matching Listening's NEW
          arrangement instead (see that file's own comment for the same
          flip). Because both sections share the identical container
          max-width, grid split, and column mechanism (`lg:pr-16
          lg:border-r` wrapper + `lg:ml-auto` box), their two video
          boxes' left edges land at the exact same x-position by
          construction — confirmed live. */}
      {/* Bottom (to Footer) reduced on mobile only, 31 Aug 2026 (owner,
          testing live: "before the footer, 'that became KIBO' and the
          horizontal line after that — the gap is too large") — `pb-
          [5.4rem]` (86.4px) was deliberately matched to this section's
          OWN top padding, which is calibrated as the entire Tiruppur→
          Founder seam (see this div's own comment above); that symmetry
          was true and correct for the Tiruppur↔Founder gap it was
          copying, but "the gap before Footer" is a different seam that
          just happened to reuse the same value, and reads as too
          generous there specifically once seen on a real phone.
          `pb-10` (40px, the site's general standalone seam size) below
          `sm`; `sm:pb-[6.75rem]` (unchanged) keeps this section's
          previously-tuned desktop/tablet spacing exactly as it was —
          this is a mobile-only reduction, not a re-tuning of the whole
          section. */}
      <div className="mx-auto grid w-full max-w-[1728px] grid-cols-1 gap-12 px-6 pt-[5.4rem] pb-10 sm:px-10 sm:pt-[6.75rem] sm:pb-[6.75rem] lg:grid-cols-2 lg:gap-0">
        {/* Left column — founder photo placeholder, click-to-play.
            `lg:pr-16` — mirrors Listening's own left (video) column
            exactly. `ml-auto` on the box hugs the divider-side boundary,
            so the unused 30% of `w-[70%]` falls toward the page's outer
            left edge.

            **Divider converted from `border-r` to a solid `w-px` block,
            30 Aug 2026** — same fix, same reasoning as Listening's
            identical divider (see that file's own comment): a CSS
            border rendered at 0.57px instead of the claimed 1px under
            this display's scaling, a rounding artifact borders are
            prone to that a solid filled box isn't. Kept matching
            Listening's mechanism exactly, per this section's own
            "mirrors Listening's column exactly" rule above. */}
        {/* Mobile centering + sizing fix, 31 Aug 2026 — identical bug and
            identical fix as WeStartedByListeningSection's own video
            column (see that file's own comment for the full reasoning):
            `ml-auto`/`w-[70%]` were unconditional, so below `lg` (where
            this is the only thing on its row) the photo box stayed
            right-hugged and undersized instead of centered and full-
            width-appropriate. `mx-auto` below `lg`, `lg:ml-auto
            lg:w-[70%]` keeps the desktop box exactly as it was.

            Widened again, same day (owner: "We started by listening and
            What led to KIBO video thumbnails... need to be larger...
            show-stealers... not getting enough focus") — 85% → 95%
            below `lg`, same change, same reasoning, as that file's
            identical video box.

            **Widened a third time, same day** (owner: "I want the
            thumbnail... even larger... still seems smaller") — 95% →
            100% (full column width) below `lg`, same as Listening's own
            box. */}
        {/* `bg-charcoal/10` → `bg-charcoal/20`, 31 Aug 2026 — same fix,
            same reasoning, as Listening's identical divider (owner,
            testing live desktop: "the vertical line between... 'What
            led to KIBO' and the thumbnail [is] much fainter... make
            sure the pen width matches with the rest of the accent
            lines"). */}
        <div className="relative lg:pr-16">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-px bg-charcoal/20 lg:block"
          />
          <div className="relative mx-auto flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-charcoal/10 bg-background lg:ml-auto lg:w-[70%]">
            {/* Media slot made Sanity-editable, 30 Aug 2026 — same
                image/video/placeholder branching as Listening's own
                column. This is the one section where a real video shoot
                is "an absolute must" per the brand doc, so the video
                branch here is the one most likely to actually get used
                first once that shoot happens. */}
            {media?.type === "video" ? (
              <video
                src={media.url}
                poster={media.poster ?? undefined}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover"
              />
            ) : media?.type === "image" ? (
              // `sizes` (2 Sep 2026, performance pass) — same panel
              // shape as WeStartedByListeningSection.tsx's own image
              // (see that file's comment); was missing, defaulting to
              // `100vw`.
              <Image src={media.url} alt={media.alt} fill sizes="(min-width: 1024px) 577px, 100vw" className="object-cover" />
            ) : (
              <MediaPlaceholder
                label="The Person Behind KIBO — image/video placeholder"
                className="h-full w-full"
              />
            )}

            {/* White play button — `h-10 w-10` (40px), icon `h-4 w-4`
                (16px), duplicated exactly from We Started by Listening's
                own button (30 Aug 2026 sizing, see that file's own
                comment — reduced from the original 51.2px/19.2px, owner:
                "video play buttons need to be smaller"). */}
            <button
              type="button"
              aria-label="Play video — The Person Behind KIBO (video coming soon)"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-4 w-4 fill-charcoal" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right column — text. `uppercase` dropped from the headline
            (29 Aug 2026, owner: "Text should be sentence case not all
            caps") — the copy in founderSection.ts was already typed
            sentence-case ("The story" / "behind KIBO."); `uppercase` was
            overriding that with all-caps, same fix already applied to
            Supply/Long Run/We Started by Listening's headlines earlier
            this project. Plain `lg:pl-16` — text left-aligns by default
            block flow, no flex/items trick needed on the right side of
            a divider, same as Listening's own text column now. */}
        {/* Mobile centering fix, 31 Aug 2026 — same bug and fix as
            WeStartedByListeningSection's own text column (owner: "the
            text is left aligned... does not look good," said about both
            this section and that one). `items-center text-center` below
            `lg`, `lg:items-start lg:text-left` restores the exact
            original desktop reading direction unchanged. */}
        <div className="flex flex-col items-center justify-center gap-6 text-center lg:items-start lg:pl-16 lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start">
            {/* Top dash reintroduced (30 Aug 2026, owner: "introduce that
                same horizontal line anchor, anchoring pattern if you can"
                — referring to Custom/Tiruppur's dash-above-headline
                device). The paragraph 1/2 dash below stays too — this
                section carries two dashes, matching that same anchoring
                pattern. */}
            <span aria-hidden="true" className="h-px w-9 bg-sage-green/60" />

            {/* `text-h2` (30px), weight/tracking matched to Supply's
                headline, `font-bold leading-[1.1] tracking-tight`
                (30 Aug 2026, owner: "these fonts should look the same as
                you build your market, we build the supply behind it"). */}
            <h2 className="text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
              <span className="block">{copy.founderHeadlineLine1}</span>
              <span className="block">
                {headlineLine2Prefix}
                <span className="text-sage-green">KIBO</span>
              </span>
            </h2>

            {/* `text-body` (15px). Dash inserted after the first
                paragraph — Listening has exactly one dash, between its
                two paragraphs; Founder has three paragraphs rather than
                two, so the same "one paragraph, then a dash, then the
                rest" rhythm lands here, between paragraph 1 and 2. */}
            {/* `items-center lg:items-start` added, 31 Aug 2026 (owner,
                testing live: "under 'I set out to build something on my
                own,' the horizontal line needs to be centered, it's
                currently on the left side") — this inner wrapper had no
                alignment override of its own, unlike its two ancestors
                (both already fixed earlier this same pass); a flex
                column with no `items-*` defaults to `stretch`, which for
                a fixed-width child like the `w-9` dash (or a `max-w-sm`-
                capped paragraph) resolves to flush-left, not centered —
                the outer centering never actually reached this specific
                span. */}
            <div className="flex flex-col items-center gap-4 lg:items-start">
              <p className="max-w-sm text-body text-charcoal/70">{copy.founderParagraph1}</p>
              <span aria-hidden="true" className="h-px w-9 bg-charcoal/20" />
              <p className="max-w-sm text-body text-charcoal/70">{copy.founderParagraph2}</p>
              <p className="max-w-sm text-body text-charcoal/70">
                {paragraph3Prefix}
                <span className="text-sage-green">KIBO.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
