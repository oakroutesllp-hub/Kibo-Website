import Image from "next/image";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { BackToHomeLink } from "@/components/BackToHomeLink";
import type { Media } from "@/lib/content";
import {
  OUR_STORY_PLAIN,
  OUR_STORY_ACCENT,
  LISTENING_HEADLINE_LINE_1,
  LISTENING_HEADLINE_LINE_2,
  LISTENING_PARAGRAPH_1,
  LISTENING_PARAGRAPH_2,
} from "@/lib/ourStory";

// "We Started by Listening" — first section of the new `/our-story`
// page, at anchor `#listening`. KIBO_Brand_and_Copy_Direction.md, "Our
// Story — We Started by Listening — page anatomy" (LOCKED 27 Aug 2026).
// Built directly against `kibo_our_story_option_1.png` for layout
// proportions/spacing/typography weight/underline accents/placeholder
// styling — same rule as every other mockup-referenced section on this
// site: the mockup is a structural/visual target, not a type or color
// source. Same brand palette (sage green / charcoal / warm off-white)
// and same brand typography as the rest of the site, no new fonts or
// colors.
//
// Two-column split, ~35/65, deliberately NO vertical rule between the
// columns — unlike Custom/Supply/Built for the Long Run, which all use
// one. Implemented as a plain two-column grid with a gap, no
// `lg:border-l` this time (that's the mechanism those three sections
// use for their rule; simply omitting it here is the whole
// difference).
//
// Right column — still a placeholder, no video file wired up yet
// (owner explicit: don't block this build on having the final edited
// video), but as of 28 Aug 2026 it's a real photo the owner supplied
// (`listening-placeholder.jpg`, "Placeholder - we started by.png" as
// delivered) rather than the diagonal-hatch texture this originally
// shipped with — a light dark-to-transparent overlay keeps the centered
// play button legible against whatever the photo's own tones are. Swap
// this `<Image>` for a real `<video>`/embed once the researcher/Evodias
// footage is edited — see "Video/photo medium plan per section" in the
// brand doc. The click-to-play button/interaction itself is unchanged.
//
// "Condensed" headline treatment: same approximation already used for
// Built for the Long Run's headline (`tracking-tighter` + a heavy
// weight at large size within the existing brand typeface) rather than
// a genuinely condensed second font family, which the brand doc rules
// out.
//
// Anchor: `id="listening"` on the section itself — a plain native
// URL-fragment anchor, no JS scroll-tracking library, per the brand
// doc's explicit "close to zero marginal weight" instruction for these
// anchors.
// `media` — Sanity-editable image/video slot, 30 Aug 2026 (see
// OurStoryContent in lib/content/types.ts). Falls back to the current
// placeholder photo via sampleContent.ts if unset; callers ((site)/page.tsx
// and (site)/our-story/page.tsx) fetch it once via `getOurStory()` and
// pass it down, same top-level-fetch-then-prop-drill pattern Hero already
// uses for its own media.
// `showBackToHome` (31 Aug 2026) — same pattern as
// `ProductsGridSection.tsx`'s own prop of the same name/purpose: this
// component renders both on Home (as the "Our Story" preview, no back
// link needed — already home) and standalone on `/our-story` (a real,
// separate destination, per the owner's "add the same back-to-Home link
// everywhere" instruction). Only `(site)/our-story/page.tsx` passes
// `true`; `(site)/page.tsx`'s own Home usage leaves it at the default
// `false`.
export function WeStartedByListeningSection({
  media,
  showBackToHome = false,
}: {
  media: Media;
  showBackToHome?: boolean;
}) {
  return (
    <section id="listening" className="w-full scroll-mt-24 bg-background">
      {/* "OUR STORY" pulled out of the left column and made its own
          centered, larger banner above the two-column content (29 Aug
          2026, owner: "Remove our story from here and place it on top
          at center with a larger font size") — was a small eyebrow
          tucked above the headline inside the left column (matching the
          size/weight every other section's eyebrow/kicker uses); now a
          standalone, page-title-scale line spanning the section, same
          sage-green/bold/uppercase/tracked treatment just at headline
          size instead of eyebrow size. Removing it from the left column
          also means that column's own content (dash/headline/
          paragraphs) is shorter now, so it naturally centers closer to
          the video next to it — the "move this closer to the video"
          half of the same request, resolved as a side effect of the
          eyebrow's removal rather than a separate spacing change (the
          two-column grid below is unchanged; Built for the Long Run's
          own rhythm — text and headline both vertically centered
          against each other — is exactly what `justify-center` on the
          left column already gives here). */}
      {/* Sized to match Products' own heading for one pass (29 Aug 2026,
          owner: "same font type and size as Products"), then reverted
          the same day once the owner's revised type scale arrived
          (font size.png/font case 1.png/font case 2.png) — that spec
          explicitly classifies '"Our story" → micro label, ALL CAPS',
          which supersedes the earlier ad hoc size match. Went to
          `text-micro` (11px) at that point, matching the rest of the
          site's eyebrows/kickers.

          **Promoted back to a real page title, 30 Aug 2026** (owner:
          "Our story is a main title - I would think you want to treat
          this as products. no?") — supersedes that font-case-doc
          classification. The doc's ruling made sense when this was just
          a label inside one section of a longer scroll; now that
          `/our-story` is a real standalone page (see that page's own
          comment on the 30 Aug restructure), its title should get the
          exact same treatment `/products`'s own `<Heading>` gets:
          `text-h2 font-semibold text-charcoal`, centered, no uppercase,
          no tracking, no sage-green accent — a literal match, not a
          similar-but-distinct style. Copy re-cased to sentence case in
          ourStory.ts ("Our story") since the CSS no longer forces
          uppercase. */}
      {/* Vertical padding cut 20% (29 Aug 2026, owner: "reduce blank
          space by 20% verticallu") — `pt-20 sm:pt-28` (80px/112px) →
          `pt-16 sm:pt-[5.6rem]` (64px/89.6px), each exactly 0.8× the
          prior value.

          Standardized again, 30 Aug 2026 (owner: "consistent rule of
          white space between topic changes") — this banner carries the
          section's ENTIRE top padding now (the grid below it, which
          used to add its own separate `pt-8 sm:pt-[2.8rem]` on top of
          this, now has none — see that div's own comment), so the
          combined top padding matches every other section's new
          standard: `pt-10 sm:pt-14` (40px/56px).

          `pb-10 sm:pb-14` added, same day, right after the title's own
          promotion to `text-h2` (owner, on a screenshot: "no white space
          between Our story and we started by listening") — this banner
          had zero bottom padding/margin before, which read fine when
          the title was an 11px micro-label sitting flush above its
          content, but a full 30px page title needs real breathing room
          before the next block starts. Matches the ~40px gap Products'
          own `<Heading>` keeps from its grid via that section's `gap-10`
          container. */}
      {/* Top reverted, same day, after live review (owner: "give me more
          gap between talk to keyboard button and our story... keep it
          the same as the six thumbnails bottom line and you build your
          market" — Custom→Supply's own reverted value) — `pt-7
          sm:pt-[2.45rem]` (28px/39.2px), matching CTANudgeSection.tsx's
          own reverted bottom.

          Bottom bumped too, same day (owner, on a screenshot of this
          exact gap: "more white space needed between our story and the
          top edge of the video thumbnail") — `pb-4 sm:pb-5` (16px/20px)
          → `pb-7 sm:pb-[2.45rem]` (28px/39.2px), matching the top
          padding above for a symmetric, more generous banner overall. */}
      {/* Left-aligned to the video's own left edge at `lg`+ (30 Aug 2026,
          owner: "mirror both the scenarios... in the we started by
          listening section the video thumbnail is on the left and the
          text is on the right... align our story to the left and put it
          in the same line as the left edge of the video thumbnail") —
          supersedes the earlier right-alignment version (from when the
          video sat on the right). Same box-model-mirroring principle as
          before, just flipped: this column now uses the EXACT same
          wrapper/box mechanism the video column below uses (`lg:pr-16`
          wrapper, `lg:border-r`, box `lg:ml-auto lg:w-[70%]`) — since
          the geometry is identical, this box's own left edge lands
          exactly on the video's left edge, by construction, with no
          separate tuning needed. `text-left` inside that box (was
          `text-right`) puts the visible text flush at that shared edge.
          Below `lg` (stacked layout) the title stays centered. */}
      {/* **Restructured to a single centered column, 30 Aug 2026**
          (owner, on a screenshot: "center Our story — even centered it
          still looks loosely placed, suggest some graphic interventions
          to anchor it") — supersedes the left-aligned-at-`lg` version
          below (the 2-column grid mirroring the video's own box model,
          `lg:text-left` at the `lg` breakpoint). That version left-hugged
          the title to match the video column beneath it, which is
          exactly what read as "loosely placed": a big lone headline
          sitting off-center at the top of the page, floating in mostly
          empty space with nothing else nearby to relate it to.
          Two changes: (1) plain centering at every breakpoint now — the
          2-column grid/`lg:border-r`-mirroring machinery is gone
          entirely, replaced with a simple centered flex column;
          (2) a matching dash ABOVE the headline, not just below — the
          single bottom dash read as an underline/footnote, easy to miss
          as an anchor; bracketing the title between two short accent
          lines gives it a real frame instead of floating text. Both
          dashes changed from `bg-charcoal/20` to `bg-sage-green` at the
          same time — more visual weight/presence than a faint grey
          hairline had, doing more actual "anchoring" work. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-3 px-6 pt-7 pb-7 text-center sm:px-10 sm:pt-[2.45rem] sm:pb-[2.45rem]">
        {/* `showBackToHome` (31 Aug 2026) — see this component's own
            prop comment above. Sits above the top dash, same position
            Products'/Catalog's own back link takes above their titles. */}
        {showBackToHome && <BackToHomeLink />}
        {/* Top dash hidden below `sm`, 31 Aug 2026 (owner, testing live:
            "our story need not have the top horizontal line — that
            anchoring was more for desktop, I don't think mobile version
            needs that") — the bottom dash (below) stays at every
            breakpoint; only this top one is desktop/tablet-only now. */}
        <span aria-hidden="true" className="hidden h-px w-12 bg-sage-green/60 sm:block" />
        <h2 className="text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
          {OUR_STORY_PLAIN}
          <span className="text-sage-green">{OUR_STORY_ACCENT}</span>
        </h2>
        <span aria-hidden="true" className="h-px w-12 bg-sage-green/60" />
      </div>

      {/* Grid changed from a 35/65 fractional split to a plain 50/50 one
          with `lg:gap-0` (29 Aug 2026, owner: "align the we are listening
          video placeholder with the vertical line at the centre from the
          built for the long run section") — the two sections previously
          used different column ratios (this one 35fr/65fr, Long Run a
          plain 50/50 `grid-cols-2`), so the video's left edge and Long
          Run's centre rule landed at two different x-positions on the
          page despite sharing the exact same outer container. Matching
          the ratio (and removing the grid `gap`, replacing it with
          `lg:pr-8` padding on the left column only) means the video's
          left edge is now the container's literal midpoint — the same
          midpoint Long Run's `border-l` rule sits on — by construction,
          not a hand-tuned pixel value. */}
      {/* Vertical padding cut 20%, same request — `pt-10 sm:pt-14`
          (40px/56px) → `pt-8 sm:pt-[2.8rem]` (32px/44.8px);
          `pb-20 sm:pb-28` (80px/112px) → `pb-16 sm:pb-[5.6rem]`
          (64px/89.6px).

          Standardized again, 30 Aug 2026 (owner: "consistent rule of
          white space between topic changes") — top padding dropped
          entirely (`pt-8 sm:pt-[2.8rem]` → none): the banner div above
          now supplies the section's whole top padding on its own (see
          that div's own comment), so this grid stacking its own on top
          would double it, the same bug this whole pass exists to stop.
          Bottom: `pb-16 sm:pb-[5.6rem]` → `pb-10 sm:pb-14` (40px/56px),
          matching every other section's new standard bottom padding. */}
      {/* `pb-[2.7rem] sm:pb-[3.375rem]` (43.2px/54px, 30 Aug 2026, owner,
          on a screenshot of this Listening→Tiruppur seam: "the gap...
          is again too low... keep it the exact same as the gap between
          bottom of the where apparel runs deep [and] the top of the
          video thumbnail for story behind Kibo") — that Tiruppur→Founder
          seam is FounderSection.tsx's own `py-[2.7rem] sm:py-[3.375rem]`
          (see that file's own comment). Since Tiruppur is full-bleed
          with zero padding of its own, this section's bottom alone has
          to carry that FULL value, not a half — was `pb-4 sm:pb-5`
          (16px/20px, the standard seam HALF, which is what made this
          gap read as noticeably thinner than the Tiruppur→Founder one
          right below it). */}
      {/* **Column order flipped 30 Aug 2026** (owner: "mirror both the
          scenarios attached such that in the we started by listening
          section the video thumbnail is on the left and the text is on
          the right and the vertical line remains as is") — reverses
          this file's own prior arrangement (text left, video right).
          Video is now the FIRST grid child (left), text SECOND (right).
          The divider ("the vertical line") stays in the same physical
          position — the centre of the grid — since the columns are
          still a plain 50/50 split; only which content sits in which
          column changed. Per-column mechanism is a straight mirror of
          the old one: video column now uses `lg:pr-16 lg:border-r` +
          `lg:ml-auto` (was `lg:pl-16 lg:border-l`, box left-aligned);
          text column now just `lg:pl-16` with plain left-aligned block
          content (was `lg:items-end lg:pr-8` + a shared box, needed
          there specifically because right-hugging requires one shared
          box — text naturally left-aligns by default, so hugging the
          divider from the right side needs no flex tricks at all, just
          the padding gap). */}
      <div className="mx-auto grid w-full max-w-[1728px] grid-cols-1 gap-12 px-6 pb-[2.7rem] sm:px-10 sm:pb-[3.375rem] lg:grid-cols-2 lg:gap-0">
        {/* Left column — video placeholder. Light diagonal-hatch fill
            (matching the mockup) via a repeating linear-gradient of
            thin charcoal-tinted stripes over the section's own
            off-white background — not a new color, just a very light
            (4% opacity) texture on top of `bg-background`.

            `lg:pr-16` — mirrors what used to be `lg:pl-16` when this
            column was on the right; the divider now draws at this
            column's own right edge (the shared boundary) instead of its
            left. `lg:ml-auto` on the box below pushes it to hug that
            boundary (mirroring the old left-alignment), so the unused
            30% of `w-[70%]` falls toward the page's outer LEFT edge now
            instead of the outer right.

            **Divider converted from a CSS `border-r` to a solid `w-px`
            block, 30 Aug 2026** (owner: "the vertical line... needs to
            be the same thickness as the horizontal line below Our
            story") — measured directly: the `border-r` rendered at
            0.57px, not the 1px its `border` utility claims, a real
            display-scaling rounding artifact on borders specifically
            (confirmed the dash accent's `h-px` background block, same
            nominal 1px, rendered at a true 1px on the same page/screen —
            a solid filled box doesn't round the same way a border stroke
            does). Same fix, same technique as the dash: an actual
            `w-px bg-charcoal/10` element instead of a border, which
            paints as a real 1px box regardless of device scaling. */}
        {/* Mobile centering fix, 31 Aug 2026 (owner, testing live mobile:
            "the video should be at the center it is not at the center" —
            plus, separately, "the video thumbnail looks really tiny on
            mobile") — `ml-auto` was unconditional, so below `lg` (where
            this column is the only thing on its row, not sharing a grid
            line with the text column) it still right-hugged the frame
            instead of centering it; `w-[70%]` was also the *desktop*
            proportion (sized to look right splitting a row with text
            next to it), too small once it's the only thing on the row.
            `mx-auto` below `lg`, `lg:ml-auto lg:w-[70%]` restores the
            exact original desktop box (position and size both) — only
            the mobile/tablet state changes.

            Widened again, same day, same conversation, on a second live
            pass (owner: "We started by listening and What led to KIBO
            video thumbnails... need to be larger, I think they are
            show-stealers and right now not getting enough focus") —
            85% → 95% below `lg`.

            **Widened a third time, same day** (owner, a follow-up live
            pass: "I want the thumbnail... even larger... this still
            seems smaller") — 95% → 100% (full width of the column,
            i.e. flush with the page's own `px-6` edge padding, not the
            viewport edge) below `lg`. Same fix, same reasoning, applied
            to FounderSection.tsx's identical video box. */}
        <div className="relative lg:pr-16">
          <span
            aria-hidden="true"
            className="absolute inset-y-0 right-0 hidden w-px bg-charcoal/10 lg:block"
          />
          <div className="relative mx-auto flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-lg border border-charcoal/10 bg-background lg:ml-auto lg:w-[70%]">
            {/* Media slot made Sanity-editable, 30 Aug 2026 — same
                image/video/placeholder branching Hero.tsx already uses.
                Not autoplaying/looping even in video mode (unlike
                Tiruppur's ambient background video) — this is a
                click-to-play thumbnail, so a video source just supplies
                its poster frame (or first frame, sans poster) as the
                static preview; actual playback isn't wired up yet (see
                the button below, still non-functional). */}
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
              <Image src={media.url} alt={media.alt} fill className="object-cover" />
            ) : (
              <MediaPlaceholder
                label="We Started by Listening — image/video placeholder"
                className="h-full w-full"
              />
            )}
            <div aria-hidden="true" className="absolute inset-0 bg-charcoal/15" />

            {/* Reduced 20% (29 Aug 2026, owner: "reduce the size of the
                white play button by 20%. Make sure that this size is
                duplicated on the we arelistenign video") — same exact
                values as FounderSection.tsx's button, per that explicit
                "duplicated" instruction: `h-16 w-16` → `h-[3.2rem]
                w-[3.2rem]`, icon `h-6 w-6` → `h-[1.2rem] w-[1.2rem]`.
                **Reduced again, 30 Aug 2026** (owner: "video play
                buttons need to be smaller") — `h-[3.2rem] w-[3.2rem]`
                (51.2px) → `h-10 w-10` (40px, ~22% smaller), icon
                `h-[1.2rem] w-[1.2rem]` (19.2px) → `h-4 w-4` (16px).
                Same values duplicated across all 3 "our story" media
                sections' buttons (Listening/Tiruppur/Founder), same
                "keep them all matching" rule as the original 29 Aug
                reduction. */}
            <button
              type="button"
              aria-label="Play video — We Started by Listening (video coming soon)"
              className="relative flex h-10 w-10 items-center justify-center rounded-full bg-background shadow-md transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-4 w-4 fill-charcoal" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Right column — text. Plain `lg:pl-16` gap off the divider;
            content left-aligns by default block flow, no flex/items
            trick needed (unlike the old left-side text column, which
            needed `items-end` specifically to right-hug the divider —
            hugging from the LEFT side of a right column is just the
            browser's own default text direction, free). */}
        {/* Mobile centering fix, 31 Aug 2026, same pass as the video
            column above (owner: "'We started by listening' is left
            aligned and it does not really look good") — this column had
            no alignment override for the stacked (below `lg`) layout at
            all, so it fell back to the browser's plain left-aligned
            block flow, inconsistent with the centered eyebrow banner
            above it and the centered video box next to it.
            `items-center text-center` below `lg`, `lg:items-start
            lg:text-left` restores the exact original desktop reading
            direction (text hugging the divider from the right column's
            left edge) unchanged. */}
        <div className="flex flex-col items-center justify-center gap-6 text-center lg:items-start lg:pl-16 lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start">
            {/* `uppercase` dropped (29 Aug 2026, owner: "sentence case",
                on a screenshot of this all-caps headline) — the copy in
                ourStory.ts was already typed sentence-case ("We started
                by" / "listening."); `uppercase` was overriding that with
                all-caps the whole time, same fix already applied to
                Supply's and Long Run's headlines earlier this project.

                `text-h2` (30px, revised type scale) replacing
                `text-4xl sm:text-5xl` — font case 1.png names "We started
                by listening." explicitly as "H2, sentence case."

                Weight/tracking matched to Supply's headline, `font-bold
                leading-[1.1] tracking-tight` (30 Aug 2026, owner: "these
                fonts should look the same as you build your market, we
                build the supply behind it").

                Second line sage-green, same day, same conversation
                (owner: "change 'listening' to the green grey sage,
                just like 'we build the supply behind it'") — matches
                Supply's own two-tone headline treatment (plain line +
                sage-green line); `LISTENING_HEADLINE_LINE_2` is already
                just the single word "listening" on its own line, so no
                further split was needed. */}
            <h2 className="text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
              <span className="block">{LISTENING_HEADLINE_LINE_1}</span>
              <span className="block text-sage-green">{LISTENING_HEADLINE_LINE_2}</span>
            </h2>

            <p className="max-w-sm text-body text-charcoal/70">{LISTENING_PARAGRAPH_1}</p>

            <span aria-hidden="true" className="h-px w-9 bg-charcoal/20" />

            <p className="max-w-sm text-body text-charcoal/70">{LISTENING_PARAGRAPH_2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
