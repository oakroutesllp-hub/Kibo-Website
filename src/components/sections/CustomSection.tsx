import Image from "next/image";
import { CustomAttributeIcon } from "@/components/CustomAttributeIcon";
import { MediaPlaceholder } from "@/components/MediaPlaceholder";
import { CUSTOM_PROCESS_STEPS, CUSTOM_ATTRIBUTES } from "@/lib/customSection";
import type { CustomSectionMediaContent, CustomSectionCopyContent } from "@/lib/content";

// Maps each process step's fixed `number`/attribute's fixed `icon` to
// its Sanity field key, 31 Aug 2026 (see customSectionMediaType.ts's
// own comment) — the copy/order in customSection.ts stays fixed code
// data; only which image renders per slot is now Sanity-editable, via
// this lookup.
const STEP_MEDIA_KEY: Record<string, keyof CustomSectionMediaContent> = {
  "01": "processReference",
  "02": "processDevelopment",
  "03": "processCutting",
  "04": "processSample",
  "05": "processProduction",
  "06": "processFinished",
};
const ATTR_MEDIA_KEY: Record<string, keyof CustomSectionMediaContent> = {
  fabric: "swatchFabric",
  colour: "swatchColour",
  fit: "swatchFit",
  construction: "swatchConstruction",
  print: "swatchPrint",
  finish: "swatchFinish",
};

// Custom / Made to Specification — KIBO_Brand_and_Copy_Direction.md,
// section 3 ("From Reference to Finished Garment"). Built 26 Aug 2026
// against a supplied structural/visual reference mockup
// (`Custom_Made to spec section.png`) for page anatomy — headline, a
// six-step process tracker, six photo cards, a divider, then a six-column
// attribute grid — but NOT for its own spacing (deliberately built more
// generously, per owner direction the mockup itself read as too dense) or
// its own copy (several captions/blurbs were rewritten to active voice or
// corrected — see customSection.ts for the exact final wording).
//
// Revised same day after live owner review on the first pass:
// - Eyebrow ("03. Custom / Made to Specification") removed outright, per
//   owner request — no other section on the site currently uses this
//   numbered-eyebrow device either, so dropping it doesn't strand a
//   pattern anywhere else.
// - Tracker rebuilt with large sage-green numbers restored (the first
//   pass reduced the tracker to a bare dot, moving the numbers onto small
//   badges overlaid on the photos instead, which read badly) — numbers
//   now live only in the tracker; the photo cards no longer carry a
//   number badge at all.
// - Tracker's connecting line no longer relies on one absolutely-
//   positioned line + hand-measured pixel offsets to align with the dots
//   (fragile, easy to drift if type/spacing changes) — each step now
//   carries its own "line segment – dot – line segment" flex row, so the
//   connecting line is always exactly dot-height-centered by construction,
//   with no measurement required.
// - Tracker and the photo-card grid now switch to a 6-across layout at
//   the *same* breakpoint (`lg`) — the first pass had the tracker jump to
//   6 columns at `sm` while the photo grid stayed at 3 columns until
//   `lg`, so between those two breakpoints the photo grid wrapped into a
//   visibly misaligned second row underneath a tracker that was already
//   showing all 6. Confirmed directly at a 900px viewport (inside that
//   mismatched range) before fixing.
// - Attribute-grid icons redrawn closer to the reference mockup's own
//   icon art (a real woven-crosshatch medallion for Fabric, a real
//   sewing-machine silhouette for Construction, a denser Print dot-grid)
//   after owner feedback that the first pass's icons were too rudimentary
//   — see CustomAttributeIcon.tsx.
//
// Second revision, 27 Aug 2026 — after the "same size, same everything"
// requirement met the "max 3 lines" requirement head-on and lost:
// - The generated Print swatch was the actual problem behind an "awful,
//   rudimentary" complaint about the attribute images generally — a
//   side-by-side render of all 6 swatches at their real crop confirmed
//   it was the one clear outlier (a flat vector graphic next to 5 real
//   photographs), not the other 5. Rebuilt using a real fabric photo
//   (the Finish swatch's woven trim, darkened) as the base with the same
//   geometric print motif composited on top, rather than a fully
//   procedural graphic — reads as an actual printed garment detail now,
//   confirmed by re-rendering the same 6-across comparison.
// - Attribute grid reverted to the exact same columns AND gaps as the
//   photo grid (see its own comment below) — a brief 3-column detour
//   existed specifically to guarantee 3-line blurbs, which owner then
//   explicitly deprioritized in favor of true alignment with the photo
//   row ("forget the 3 line restriction").
//
// Third revision, 28 Aug 2026 — thumbnails shrunk, whitespace increased,
// narrower shared container (owner feedback: "pictures seem to be too
// large... focus on increasing white space between the pictures -
// reducing the thumbnail size", followed by several rounds of live
// tuning). Landed on, in order of how the problem was actually solved:
// 1. At the section's original ~1650px content width (6 columns), even
//    a 0px CSS gap left ~188px of empty margin around a small image —
//    the column itself is just too wide for a small thumbnail to look
//    intentional; shrinking the CSS gap alone couldn't fix that, since
//    the excess space was unused column width, not gap.
// 2. Owner's own proposed fix: narrow the CONTAINER the tracker/photo
//    grid/divider/attribute grid all sit in (independent of the
//    headline above and the rest of the page, which stay full-width),
//    to `max-w-[1400px]` — text and images both live in this same
//    narrower grid, so column alignment between them is fully preserved;
//    only the block's own width shrinks and centers, opening genuine
//    whitespace at the page's left/right edges.
// 3. Each thumbnail capped to 80% of its column width (`mx-auto
//    w-[80%]`) rather than filling it — combined with the narrower
//    container, this is what actually reads as "smaller pictures, more
//    air," verified via direct pixel measurement (not just visual
//    impression) at several iterations.
// 4. Horizontal grid gap dropped to 0 at `lg` (`lg:gap-x-0`) — with the
//    80% image cap already supplying real whitespace via each image's
//    own margin, an explicit CSS gap on top of that pushed the visible
//    gap well past what looked right; removing it landed the measured
//    visible gap between adjacent thumbnails at ~45px on a 1440px-wide
//    viewport, close to the owner's explicit "~48px" target. Mobile/
//    tablet gap (`gap-x-8`, i.e. unchanged from the original) was
//    deliberately NOT collapsed to 0 — this whole tuning pass was
//    reviewed on a laptop only ("I have only been testing this on my
//    laptop"), and 2–3 narrow mobile columns touching edge-to-edge at
//    0 gap would be a real regression nobody actually reviewed.
// 5. `line-clamp-3` reintroduced on the attribute blurbs — the narrower
//    columns brought back the exact overflow problem the "forget the
//    3-line restriction" call above was reacting to when the container
//    was still full-width. Owner's current instruction is an explicit
//    hard ceiling ("we want to keep three lines maximum"); Fabric's
//    blurb is long enough that it still visually wraps to 4 lines at
//    this width even with the wider container/bigger thumbnail this
//    pass landed on, so the clamp is doing real work, not just acting
//    as an unused safety net — it truncates Fabric's blurb with an
//    ellipsis. Owner explicitly chose to accept that trade-off rather
//    than shorten the copy or widen the container further (which would
//    have fought the whitespace goal this whole pass was about).
// 6. Colour's blurb ("An array of colour options. From neutrals to bold
//    shades.") is forced to break exactly between its two sentences
//    (owner request) rather than left to the browser's natural wrap
//    point, which didn't reliably land on that boundary at this width.
//
// Fourth revision, 28 Aug 2026 — same treatment as the Products grid
// (`ProductsGridSection.tsx`): owner asked to "reduce the thumbnail
// size by 20%. Increase white space on extreme left and right. Gutter
// space can be narrower. Text can spill over to 3 lines" for both the
// photo-card row and the attribute row (12 images total). One change
// covers all of it: the shared container the tracker/photo grid/divider/
// attribute grid all live in shrinks from `max-w-[1400px]` to
// `max-w-[1120px]` — a flat 20% reduction. Every column, and each
// image's 80%-of-column cap inside it, scales down with the container
// proportionally, so this is exactly a 20% thumbnail reduction (1400/6
// × 0.8 ≈ 187px → 1120/6 × 0.8 ≈ 149px per image) achieved without
// touching the 80% cap ratio itself — the two grids still share
// identical columns/gaps, so all 12 images (6 process + 6 attribute)
// stay perfectly aligned column-for-column, just uniformly smaller.
// `mx-auto` on the narrower container is what turns the freed space
// into extra whitespace at the section's left/right edges, same
// mechanism as the Products grid change. Gutters were already `0` at
// `lg` from the third revision above — owner's "gutter space can be
// narrower" note doesn't need a further change there; mobile/tablet
// gutters (`gap-x-8`) stay as-is for the same "only tested on laptop"
// reason documented in the third revision. `line-clamp-3` already caps
// the attribute blurbs at 3 lines (owner's "text can spill over to 3
// lines" is permission for that ceiling, not a new requirement) —
// added the same clamp to the photo captions below for parity, though
// their short captions are unlikely to actually hit it at this width.
//
// Fifth revision, same day — owner: "reduce by another 10-15%, gutter
// can be narrower. assign white space to extreme left and right.
// Constraint - text not to spill beyond 3 lines." Same single-lever
// mechanism again: shared container `max-w-[1120px]` → `max-w-[986px]`,
// a 12% cut (middle of the requested 10–15% range) — every column and
// each image's 80%-cap scale down with it (149px → 131px per image),
// freeing more edge whitespace via the same `mx-auto`, all 12 images
// staying column-aligned. Gutter was already `0` at `lg` (nothing left
// to narrow there); left mobile/tablet `gap-x-8` alone, same "only
// tested on laptop" reasoning as every prior pass. The "not to spill
// beyond 3 lines" constraint was already a hard ceiling via
// `line-clamp-3` on both the attribute blurbs and (fourth revision) the
// photo captions — a real CSS clamp with ellipsis truncation, not just
// a design target, so it holds automatically at any container width,
// including this narrower one.
//
// Photography: the six process photos and five of the six attribute
// swatches are cropped directly from the reference mockup (owner-approved
// as build-ready, not placeholders — see `public/custom-section/`). The
// sixth swatch (Print) was NOT reused: the mockup's own Print swatch shows
// a mountain-graphic print with "EXPLORE FURTHER" copy, which directly
// contradicts the site's locked, cross-project rule excluding all
// mountain/trekking imagery and messaging (KIBO_Brand_and_Copy_Direction.md,
// "What the site should explicitly NOT feel like" / PROJECT-SUMMARY.md's
// "Key decisions made") — owner explicitly re-confirmed keeping the
// abstract-geometric replacement over reversing that rule (26 Aug 2026).
//
// Lives on `/products` only (`products/page.tsx`), after the category
// grid — NOT part of the shared `ProductsGridSection` the Home→Products
// scroll handoff previews, since that preview is deliberately scoped to
// just the grid for the seam-matching the scroll transition depends on.
// `media` (31 Aug 2026) — see customSectionMediaType.ts's own comment.
// Fetched by the parent page (Home) via `getCustomSectionMedia()` and
// passed down, same pattern as every other Sanity-editable media slot
// on this site.
// `copy` (1 Sep 2026, owner: "make everything editable") — reverses
// this file's own long-standing "copy stays fixed/code-level" call.
// `CUSTOM_PROCESS_STEPS`/`CUSTOM_ATTRIBUTES` (lib/customSection.ts)
// are still imported for their fixed, non-editorial fields (`number`,
// `icon`, `imageAlt`) and to know how many steps/attributes to render
// — only the actual label/caption/blurb text now comes from `copy`,
// zipped positionally against those fixed arrays (see
// getCustomSectionCopy's own comment in lib/content/index.ts for why
// position, not a shared key, is the correspondence).
export function CustomSection({
  media,
  copy,
}: {
  media: CustomSectionMediaContent;
  copy: CustomSectionCopyContent;
}) {
  return (
    <section className="w-full bg-background">
      {/* Bottom padding split from the top (28 Aug 2026, owner: "this
          transition does not look coherent and smooth" — flagged from a
          live screenshot of the seam with SupplySection right below).
          Root cause: this section's own `py-28` (112px) bottom padding
          and SupplySection's own `py-28` top padding stack at their
          shared boundary, so the *visible* gap between Custom's last
          image row and Supply's headline was 224px — double either
          section's own intended rhythm, which read as an accidental
          collision rather than a deliberate transition.

          **Superseded 30 Aug 2026** (owner: "as far as possible keep
          some consistent rule of white space between topic changes") —
          rather than keep fixing each seam one at a time as it gets
          flagged (this file's own history above, then Custom↔Supply,
          then Long Run↔CTA nudge), every section on this page now
          shares one symmetric rule: `py-10 sm:py-14` (40px/56px) on
          BOTH top and bottom, so every seam between two sections measures
          the same 80px/112px total, always. See CTANudgeSection.tsx,
          SupplySection.tsx, LongRunSection.tsx, FounderSection.tsx for
          the same change applied identically. Tiruppur stays exempt —
          it's a deliberately full-bleed photo section, not part of this
          white-background rhythm family. */}
      {/* Headline-to-tracker gap cut roughly in half, `gap-16 sm:gap-20`
          (64px/80px) → `gap-8 sm:gap-10` (32px/40px) (30 Aug 2026, owner,
          on a screenshot of exactly this gap: "reduce white gap
          vertically - make a judgement call") — same family of fix as
          the tracker/photo-grid gaps already tightened below in this
          file, just not yet applied to this one (the largest of the
          three, and the one actually flagged this time). Halved rather
          than matched to the tighter `gap-6`/`gap-4` gaps further down —
          this one sits between the section's own title and its content,
          not between two rows of the same content, so it keeps a bit
          more separation than those. */}
      {/* Split top/bottom, same day, after live review (owner, on a
          screenshot of Supply/Long Run: "I want to take back one
          thing... the previous gap between the six thumbnails and you
          build your market... stays") — the exact-match `py-4 sm:py-5`
          above made the Products→Custom seam correctly hit 40px (kept,
          `pt-4 sm:pt-5`), but the owner wants Custom→Supply back to
          what it was just before that pass: `pb-7 sm:pb-[2.45rem]`
          (28px/39.2px), the 30%-reduction value. */}
      {/* Top padding `pt-4 sm:pt-5` → `pt-7 sm:pt-[2.45rem]` (1 Sep 2026,
          owner: "increase the space between 'Get in touch' and 'From
          reference to finished garment' — this space should be the same
          as the space between the six thumbnails' bottom edge and 'You
          build your market, we build the supply behind it'") — this
          section's own bottom half of the Custom→Supply seam is already
          `pb-7 sm:pb-[2.45rem]` (28px/39.2px), matched by Supply's own
          `pt-7 sm:pt-[2.45rem]` top half (SupplySection.tsx), for a
          56px/78.4px total. Giving this section's TOP half the identical
          `pt-7 sm:pt-[2.45rem]` (paired with the matching bump to
          ProductsGridSection's own bottom padding, see that file)
          reproduces that exact same 56px/78.4px total for the
          Products-grid→Custom seam — same symmetric-halves mechanism the
          rest of the page already uses at every section boundary, not a
          one-off value.

          **Headline-to-content gap `gap-8 sm:gap-10` → `gap-14
          sm:gap-[4.9rem]`, 1 Sep 2026** (owner: "the gap between the
          bottom line under 'From reference to finished garment' and
          [the tracker numbers] should be the same as the gap between
          the bottom line after 'Built around your requirements' and the
          [attribute] icons") — the latter gap is the inner group's own
          flex gap below (see that div's comment), bumped the same day
          to `gap-14 sm:gap-[4.9rem]` (56px/78.4px); matching this
          headline gap to the identical value satisfies the request
          directly, and keeps every major vertical gap in this section
          — Get in touch→headline, headline→tracker, captions→divider,
          divider→attribute icons — on the same single 56px/78.4px
          rhythm.

          **Split back apart, same day, follow-up** (owner, live review:
          "[headline→tracker] looks really large... decrease [it and
          divider→icons] slightly, and slightly increase [Get in
          touch→headline]") — the three gaps above stop sharing one
          number: this outer headline→tracker gap (and the matching
          inner divider→icons/captions→divider gap below) drops to
          `gap-12 sm:gap-16` (48px/64px, real scale tokens, no arbitrary
          value needed), while Get in touch→headline goes the other way,
          to `pt-8 sm:pt-11` (32px/44px) paired with ProductsGridSection's
          matching `pb-8 sm:pb-11` bump — 64px/88px total, still a
          symmetric-halves seam like every other section boundary, just
          no longer equal to the two gaps inside this section. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-12 px-6 pt-8 pb-8 sm:gap-16 sm:px-10 sm:pt-11 sm:pb-11">
        {/* Headline — stays full-width (not part of the narrower
            container below it), unaffected by this section's whitespace
            tuning. */}
        <div className="flex flex-col items-center gap-5 text-center">
          {/* Sentence case + `text-h2` (29 Aug 2026, font case 1.png:
              "'From reference to finished garment.' → H2, sentence
              case") — was Title Case at `text-4xl sm:text-5xl`. */}
          {/* Trailing full stop removed (30 Aug 2026, owner: "remove the
              full stop after from reference to finished garment").
              Weight/tracking matched to Supply's headline, `font-bold
              leading-[1.1] tracking-tight` (30 Aug 2026, owner: "these
              fonts should look the same as you build your market, we
              build the supply behind it") — was `font-semibold`, no
              leading/tracking override. Same change applied to
              Products'/Our story's/Listening's/Tiruppur's/Founder's own
              headlines in this same pass. */}
          {/* `text-h2` → `text-h3` (1 Sep 2026, owner: "'From reference
              to finished garment' and 'Built around your requirements'
              should be the same level of text — right now [this heading]
              is the same as [the 'Products' heading] and that's not the
              level it belongs to... bump it down one level") — Products'
              own heading (ProductsGridSection.tsx) is also `text-h2`;
              dropping this one to `text-h3` (18px) is what actually
              distinguishes it, and 'Built around your requirements'
              (below) is bumped up to the same `text-h3` to match, per
              the same instruction.

              **`text-h3` → `text-[1.25rem]`, same day, follow-up**
              (owner: "the text for both... bump it up a size") — the
              type scale's only defined step above `text-h3` (18px) is
              `text-h2` (30px), which would put this right back at
              Products' own size — the exact thing the change above was
              made to avoid. Landed on a custom 20px instead (Claude
              Code's call, offered when asked "what do you think?"): a
              real, visible bump up from 18px without re-triggering the
              Products conflict. Applied identically to 'Built around
              your requirements' below, so the two stay matched.

              **`font-bold leading-[1.1] tracking-tight` →
              `font-semibold`, same day, follow-up** (owner, after a
              typography audit flagged this heading and 'Built around
              your requirements' didn't actually match on weight/leading/
              tracking despite matching on size/color: "we want 'Built
              around your requirements' text to be sacred — copy that
              style to 'From reference to finished garment'") — this
              heading now takes on THAT element's own original
              `font-semibold`, default line-height/tracking, rather than
              the other way around (the reverse of this file's very next
              edit before this one, on 'Built around your requirements'
              itself — see that heading's own comment for the full
              back-and-forth).

              **`text-[1.25rem] font-semibold` → `text-h2 font-bold
              leading-[1.1] tracking-tight`, same day, final follow-up**
              (owner, reviewing a side-by-side mockup of both options:
              "match the text with Products' text... in terms of its
              attributes, size, pen width, spacing, everything") —
              reverses the two "avoid matching Products" edits above;
              this heading (and 'Built around your requirements' below,
              kept matched to it) now rejoins the same `font-bold
              leading-[1.1] tracking-tight` "major section heading"
              family as Products/Supply/Long Run/Listening/Tiruppur/
              Founder, at the identical 30px size — the owner explicitly
              decided the earlier "don't match Products" concern no
              longer applies. ONLY this heading's typography changed in
              this edit — thumbnails, captions, attribute icons, and
              every gap/spacing value on this page are untouched. */}
          <h2 className="max-w-3xl text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
            {copy.headline}
          </h2>
          <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />
        </div>

        {/* Narrower shared container (28 Aug 2026) — tracker, photo
            grid, divider, and attribute grid all live inside this
            `max-w-[1400px]` wrapper so they narrow and center together,
            opening real whitespace at the page's left/right edges while
            keeping every column perfectly aligned between the photo row
            and the attribute row (both still share the exact same grid
            columns/gaps, just within a narrower shared box). See the
            file-level comment above for the full tuning history.

            Outer vertical gap (between the photo-row group, the divider,
            and the attribute-row group) cut from `gap-16 sm:gap-20`
            (64px/80px) to `gap-6 sm:gap-8` (24px/32px) — owner: "decrease
            the white space vertically... two rows of images need to come
            closer" — a live screenshot showed this exact gap as the bulk
            of the dead space between the process captions and the
            "BUILT AROUND YOUR REQUIREMENTS" divider.

            **Mobile bumped back up slightly, 31 Aug 2026** (owner,
            testing live: "there should be a little more space between
            [the last caption] and 'built around your requirements'...
            just on the mobile") — `gap-6` (24px) → `gap-8` (32px) below
            `sm`, simply matching what `sm:gap-8` already was — mobile
            was the one breakpoint with LESS breathing room here than
            tablet/desktop, not a deliberate choice, just an oversight
            from the cut above. `sm:gap-8` itself is unchanged. */}
        {/* `gap-8` → `gap-10` (1 Sep 2026, owner: "increase the space
            between the bottom line [of captions]... and 'Built around
            your requirements'. Increase that gap slightly. Repeat that
            same gap between 'Built around your requirements' and the
            [attribute] icons... across mobile and desktop") — this one
            flex-column gap sits between all three children (photo-card
            block, divider, attribute grid), so a single bump applies to
            both requested gaps identically, at every breakpoint, exactly
            as asked ("repeat that same gap").

            **`gap-10` → `gap-14 sm:gap-[4.9rem]`, same day, follow-up**
            (owner: "increase further... keep it the same distance as
            the gap between 'Get in touch' and 'From reference to
            finished garment'") — that gap is `pt-7 sm:pt-[2.45rem]` +
            `pb-7 sm:pb-[2.45rem]` (56px/78.4px total, see this section's
            own top-padding comment + ProductsGridSection.tsx's matching
            bottom-padding comment); `gap-14 sm:gap-[4.9rem]` is the
            identical 56px/78.4px as a single flex gap. Still one value
            for both surrounding gaps (captions→divider, divider→
            attribute icons), so both land on the match, not just one.

            **`gap-14 sm:gap-[4.9rem]` → `gap-12 sm:gap-16`, same day,
            follow-up** (owner, live review: "decrease [this] slightly"
            — this is also the gap the owner wants matched to
            headline→tracker above, which moved to the identical
            `gap-12 sm:gap-16` (48px/64px) in the same request; see that
            div's own comment) — no longer tied to the Get in
            touch→headline gap (that one now moves the other way, up),
            just to headline→tracker instead.

            **`2xl:max-w-[1200px]` added, 2 Sep 2026** — same fix, same
            reasoning, same day as ProductsGridSection.tsx's own
            `2xl:max-w-[1100px]` addition (see that file's own comment
            for the full "friend feedback on a widescreen Mac" story and
            why this is deliberately NOT a repeat of this exact
            section's own earlier "yikes"'d widen attempt). Measured
            live at 1920px: this wrapper's flat `max-w-[986px]` (no
            upper-bound breakpoint at all, unlike the products grid's
            `lg:`-gated one) was producing 460px of empty margin per
            side. `2xl:` (1536px+) is a strictly ADDITIVE breakpoint on
            top of the existing unprefixed 986px base — every viewport
            below 1536px, including the 13" laptop and phone the owner
            confirmed already look right, renders identically to before
            this change. 1200px is a ~22% bump, matching
            ProductsGridSection's ~24% bump so the two sections (which
            visually read as one continuous block on Home) grow by
            roughly the same proportion.

            **`2xl:max-w-[1200px]` → `2xl:max-w-[1400px]`, same day,
            immediate follow-up** — same "stretch by another 15-20%"
            request and same ~18% bump as ProductsGridSection.tsx's own
            matching follow-up; see that file's own comment. */}
        <div className="mx-auto flex w-full max-w-[986px] flex-col gap-12 sm:gap-16 2xl:max-w-[1400px]">
          {/* Tracker-to-photo-grid gap cut the same way, same request
              ("reduce whitespace vertically here as well" — a follow-up
              screenshot showed this exact gap, between the tracker labels
              and the photo row below them, as the next biggest air pocket):
              `gap-12 sm:gap-14` (48px/56px) → `gap-4 sm:gap-6` (16px/24px). */}
          <div className="flex flex-col gap-4 sm:gap-6">
            {/* Six-step process tracker — only from `lg` up, the same
                breakpoint the photo grid below switches to 6-across at (see
                comment above on why these two must match). Below `lg`, the
                photo captions carry the sequence on their own. */}
            <ol className="hidden grid-cols-6 lg:grid">
              {CUSTOM_PROCESS_STEPS.map((step, i) => (
                <li key={step.number} className="flex flex-col items-center gap-3 text-center">
                  {/* `text-micro` (11px, 29 Aug 2026) — "01 / 02 / 03…"
                      is named explicitly as a micro-label example under
                      "Process" in the revised type scale (font case
                      1.png), replacing the decorative `text-4xl`. A
                      significant visual change from the large-numeral
                      tracker this was — flagged, not silently absorbed.
                      Bumped to `text-support` (13px, 30 Aug 2026, owner:
                      "increase the font size of 01-06") — the next step
                      up in the type scale from micro. */}
                  <span className="text-support font-semibold text-sage-green">{step.number}</span>
                  <div className="flex w-full items-center">
                    <div className={`h-px flex-1 ${i === 0 ? "bg-transparent" : "bg-charcoal/15"}`} />
                    <span aria-hidden="true" className="mx-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-sage-green" />
                    <div
                      className={`h-px flex-1 ${i === CUSTOM_PROCESS_STEPS.length - 1 ? "bg-transparent" : "bg-charcoal/15"}`}
                    />
                  </div>
                  {/* `text-micro` (30 Aug 2026, owner: "no other font
                      sizes floating around") replacing raw `text-xs` —
                      an uppercase tracker label, the same role `text-
                      micro` already serves elsewhere on the site.

                      `tracking-[0.12em]` → `tracking-[0.16em]` (1 Sep
                      2026, owner-requested site-wide tracking
                      unification — see BackToHomeLink.tsx's own comment
                      for the full list of the four values this
                      replaces). Same change applied to the attribute
                      labels below, which this element is required to
                      match exactly. */}
                  <span className="max-w-[8rem] text-micro font-semibold uppercase leading-snug tracking-[0.16em] text-charcoal/60">
                    {copy.processSteps[i]?.trackerLabel ?? step.trackerLabel}
                  </span>
                </li>
              ))}
            </ol>

            {/* Six process photo cards — each thumbnail capped to 80% of
                its column and centered (`mx-auto w-[80%]`), horizontal
                gap collapsed to 0 at `lg` (see file comment, point 3–4). */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0 lg:gap-y-6">
              {CUSTOM_PROCESS_STEPS.map((step, i) => {
                const stepCopy = copy.processSteps[i] ?? step;
                const stepMedia = media[STEP_MEDIA_KEY[step.number]];
                // `gap-4` → `gap-2 sm:gap-4` (1 Sep 2026, owner: "looks
                // very sparse... compact [label→thumbnail→description]
                // ... but keep the gap between [this card] and [the
                // next row] constant" — mobile only; `sm:gap-4` keeps
                // tablet/desktop exactly as they were. This is the
                // internal gap between the label, image, and caption
                // WITHIN one card, not the grid's own row gap
                // (`gap-y-8` on the grid two lines above, unchanged) —
                // tightening this makes label+image+caption read as one
                // grouped unit while the space between separate steps
                // (Reference/spec vs. Cutting/sewing) stays exactly as
                // wide as before, which is the actual ask: less air
                // inside a card, same air between cards. Same change
                // applied to the attribute cards below.
                return (
                <div key={step.number} className="flex flex-col gap-2 sm:gap-4">
                  {/* Step label restored below `lg`, 1 Sep 2026 (owner:
                      "it's missing the entire... reference/
                      specification to development... we still need to
                      show reference/spec, development, cutting/sewing,
                      sample/inspection, production, finished garment" —
                      caught live on mobile) — below `lg` the 6-step
                      tracker above is `hidden`, and this file's own
                      comment claimed "the photo captions carry the
                      sequence on their own," but the captions are plain
                      descriptive sentences ("You share a design, sample
                      or specification") that never actually name the
                      step, so the step identity was silently dropped on
                      mobile/tablet, not just de-emphasized. Restores
                      just `step.trackerLabel` ("Reference /
                      specification" etc.) — explicitly WITHOUT the
                      "01–06" numbers, per the owner's own "maybe we
                      don't want to do the 01 02" — styled identically to
                      the tracker's own label span (same size/case/color/
                      tracking) so it reads as the same element, just
                      without its number+dot row. `lg:hidden` since the
                      tracker above already shows this exact label at
                      that breakpoint.

                      **Positioned ABOVE the thumbnail, not below it**
                      (owner, immediate follow-up: "reference
                      specification needs to be above the thumbnail,
                      then the thumbnail, then the description below" —
                      the very first pass put this directly above the
                      caption instead, i.e. still below the image, which
                      wasn't the requested order) — label, then image,
                      then caption, top to bottom. Wrapped in the same
                      `mx-auto w-[80%]` as the image right below it so
                      the two share the same left/right edges.

                      **Fixed-height wrapper added, same day, second
                      follow-up** (owner: "the thumbnails are not
                      aligned... development thumbnail is above the
                      reference specification thumbnail... it's because
                      of the one line, two line title thing") — three
                      labels wrap to 2 lines ("Reference / specification,"
                      "Cutting / sewing," "Sample / inspection") and three
                      stay on 1 ("Development," "Production," "Finished
                      garment"); on a 2-column mobile grid, a shorter
                      1-line label in one card left its own image sitting
                      higher than its row partner's, even though the grid
                      row itself was tall enough for both — height
                      equalized the CARD, not the image's position inside
                      it, since nothing here pushes the image down to
                      compensate the way `flex-1` does for the attribute
                      grid's blurb-then-image order below (that trick only
                      works when the flexible element comes BEFORE the
                      thing needing alignment; here the label is first,
                      so it needs to reserve its own fixed space instead).
                      `h-8` (32px) measured live as enough for the
                      tallest real 2-line label (30.78px rendered) with a
                      hair of headroom; `items-end` bottom-aligns each
                      label inside that fixed box, so 1-line labels sit
                      right above the image with the same visual gap a
                      2-line label's second line would have — only the
                      empty space above a short label's single line
                      differs, never the image's own top position. */}
                  <div className="mx-auto w-[80%] lg:hidden">
                    <div className="flex h-8 items-end justify-center">
                      <span className="text-center text-micro font-semibold uppercase tracking-[0.16em] text-charcoal/60">
                        {stepCopy.trackerLabel}
                      </span>
                    </div>
                  </div>
                  <div className="mx-auto w-[80%]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                      {stepMedia ? (
                        // `sizes` (2 Sep 2026, performance pass) —
                        // matches this thumbnail's real rendered width
                        // (measured live at 131px on desktop, per the
                        // 6-column `max-w-[986px]` grid; 40vw is a safe
                        // approximation for the 2/3-column mobile/tablet
                        // rows) — was missing, defaulting to `100vw` and
                        // downloading a full-viewport image for a
                        // ~131px thumbnail. Same fix applied to the
                        // attribute swatch below.
                        <Image
                          src={stepMedia.url}
                          alt={stepMedia.alt || step.imageAlt}
                          fill
                          sizes="(min-width: 1024px) 131px, (min-width: 640px) 220px, 40vw"
                          className="object-cover"
                        />
                      ) : (
                        <MediaPlaceholder label={step.imageAlt} className="h-full w-full" />
                      )}
                    </div>
                  </div>
                  {/* `text-micro` (11px, 30 Aug 2026, owner, on a
                      screenshot of these six captions: "bump down font
                      size, remove full stops at the end of each
                      sentence") — was `text-support` (13px), the next
                      step down on the scale; trailing full stops
                      removed from all six captions in
                      customSection.ts.

                      **Bumped back up on mobile only, 31 Aug 2026**
                      (owner, testing live: "this text is really small,
                      we need to bump it up just on the mobile display
                      of it") — `text-support` below `sm`, back to the
                      original `text-micro` at `sm` and up, so desktop
                      (where this was actually a deliberate, reviewed
                      choice) is unaffected.

                      **`line-clamp-3` moved to `sm:` only, same day**
                      (owner, testing live: "we pack and ship your
                      finished garments, ready to... that text is
                      getting cut") — the 3-line clamp was tuned against
                      the original 11px mobile size; at the new 13px
                      mobile size the longest captions (this one
                      specifically) wrap to 4 lines at this column
                      width, so the clamp was silently truncating them
                      with an ellipsis. Removed below `sm` (captions just
                      wrap to however many lines they need — the grid
                      already handles uneven card heights fine, nothing
                      depends on a hard 3-line cap here); `sm:line-clamp-3`
                      keeps the original desktop/tablet behavior, where
                      the smaller `text-micro` size still fits inside it.

                      **`sm:line-clamp-3` removed + wrapped in the same
                      `mx-auto w-[80%]` as the image above it, 1 Sep 2026**
                      (owner: "each thumbnail has a left and a right edge
                      — the text for a particular thumbnail [should]
                      never spill outside of the left and right edge of
                      the thumbnail... we will see how many lines it
                      spills over to") — previously this `<p>` was a
                      direct child of the full-width column, so its text
                      could run wider than the 80%-capped image sitting
                      above it; the same `w-[80%]` wrapper used for the
                      image now applies here too, so the caption can
                      never extend past the image's own left/right edges.
                      The clamp is dropped at the same time, per the
                      explicit "let's see how many lines it spills over
                      to" — clamping would hide exactly the information
                      this change is meant to surface. */}
                  <div className="mx-auto w-[80%]">
                    <p className="text-center text-support text-charcoal/70 sm:text-micro">
                      {stepCopy.caption}
                    </p>
                  </div>
                </div>
                );
              })}
            </div>
          </div>

          {/* Divider — restructured 1 Sep 2026 (owner: "remove the two
              horizontal lines flanking 'Built around your requirements'
              on the left and right. Put a horizontal line below 'Built
              around your requirements', just like there is one below
              'From reference to finished garment'") — the two flanking
              `w-16` dashes are gone; a single short underline now sits
              below the heading instead, matching the headline's own
              `h-px w-12 bg-charcoal/20` accent exactly (same span,
              same `gap-5` column layout as the headline block above).

              Heading also bumped from `text-sage-green` to `text-charcoal`
              (owner: "keep them both black fonts") and from `sm:text-body`
              to a flat `text-h3` at every breakpoint, matching "From
              reference to finished garment" being brought down to the
              same `text-h3` size above — the two headings are now the
              same size and color everywhere, not just on desktop.

              **`text-h3` → `text-[1.25rem]`, same day, follow-up** —
              matches the identical bump on "From reference to finished
              garment" above (see that heading's own comment for the
              full reasoning); the two stay the same size.

              **Font weight/leading/tracking flagged, same day** (owner:
              "there seems to be a typography difference... is it the
              exact same font type, size, and thickness?" — caught via
              computed-style diff: same 20px/Montserrat/charcoal, but
              this heading was 600 weight against the headline's 700,
              with default line-height/tracking instead of the
              headline's `leading-[1.1] tracking-tight`). First attempt
              bumped THIS heading up to match the headline
              (`font-bold leading-[1.1] tracking-tight`) — **reversed
              immediately, same day** (owner: "we want 'Built around
              your requirements' text to be sacred — copy that style to
              'From reference to finished garment'") — this heading's
              own `font-semibold`, default leading/tracking stayed
              fixed; the headline changed instead (see its own comment
              above).

              **Final follow-up, same day** (owner: "match the text with
              Products' text... size, pen width, spacing, everything") —
              the headline above moved to Products' own `text-h2
              font-bold leading-[1.1] tracking-tight` (30px); this
              heading follows it to the identical class, so the two stay
              matched exactly, same as every prior round. */}
          <div className="flex flex-col items-center gap-5">
            <h3 className="text-center text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
              {copy.dividerLabel}
            </h3>
            <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />
          </div>

          {/* Attribute grid — same columns/gaps as the photo grid above
              it (see file comment) so the two rows stay column-aligned;
              same 80%-width thumbnail cap. Vertical gap stays
              independently larger (`gap-y-10`/`sm:gap-y-14`) since each
              attribute item has more content above its image (icon,
              title, blurb) than a photo card does. `h-full` on each item
              + `flex-1` on the blurb: without a growable element, a grid
              item with less content than its tallest row-sibling still
              gets stretched to match by the grid itself, but nothing
              tells the *content inside* to use that extra space, so the
              image would sit at a different Y position per column
              depending on that column's blurb length — making the blurb
              `flex-1` is what pushes every column's image down to the
              same row-relative position regardless of how many lines its
              own blurb took. */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 sm:gap-y-14 lg:grid-cols-6 lg:gap-x-0">
            {CUSTOM_ATTRIBUTES.map((attr, i) => {
              const attrCopy = copy.attributes[i] ?? attr;
              const attrMedia = media[ATTR_MEDIA_KEY[attr.icon]];
              return (
              <div key={attr.icon} className="flex h-full flex-col items-center gap-2 text-center sm:gap-4">
                {/* `gap-4` → `gap-2 sm:gap-4` (1 Sep 2026) — same mobile-
                    only internal-spacing tightening as the process cards
                    above (see that card's own comment); tablet/desktop
                    unchanged. The `flex-1` blurb below still does its
                    row-alignment job regardless of gap size. */}
                <CustomAttributeIcon name={attr.icon} className="h-9 w-9 text-sage-green" />
                {/* `text-h3` (18px, 29 Aug 2026) — "Fabric/Colour/Fit/
                    Construction/Print/Finish" named explicitly as H3
                    examples under "Requirements" in font case 1.png,
                    replacing `text-base`.

                    **Restyled 30 Aug 2026** (owner, on a screenshot of
                    these six headings: "Change attached to match
                    reference, cutting sewing, production, finished
                    garment font attributes") — supersedes the H3 sizing
                    above; now matches the process tracker's own step
                    LABELS ("Cutting / sewing", "Production", "Finished
                    garment", same file, `trackerLabel` span, NOT the
                    "01–06" numbers next to them — those were separately
                    bumped to `text-support` this same day, a different
                    element) exactly: `text-micro` (11px) uppercase,
                    tracked, muted charcoal — same size/case/color/
                    tracking, just a slightly wider `max-w` to fit these
                    labels' generally-shorter text without unnecessary
                    wrapping. (First pass here mistakenly used
                    `text-support` — caught and corrected against the
                    tracker labels' actual class, not the numbers'.) */}
                {/* `tracking-[0.12em]` → `tracking-[0.16em]` (1 Sep
                    2026, owner-requested site-wide tracking unification
                    — see BackToHomeLink.tsx's own comment for the full
                    list of the four values this replaces; the tracker
                    label above is required to match this exactly, so it
                    moved to the same value in the same pass). */}
                <h4 className="max-w-[8rem] text-micro font-semibold uppercase leading-snug tracking-[0.16em] text-charcoal/60">
                  {attrCopy.label}
                </h4>
                {/*
                  `line-clamp-3` REMOVED, 30 Aug 2026 (owner, on a
                  screenshot of Fabric's blurb: "doesn't read properly -
                  truncated") — Fabric's blurb (the longest of the six)
                  was still overflowing the 3-line cap even after the
                  font-size reduction below, cutting it off mid-word
                  ("...performanc…"). The cap existed to stop overflow
                  from misaligning the grid (see file comment, point 5),
                  but that risk is actually handled by this `<p>`'s own
                  `flex-1` (see this column's outer wrapper comment) —
                  the blurb already absorbs whatever height it needs and
                  pushes the image down by that same amount in every
                  column, so a taller blurb no longer breaks row
                  alignment, cap or no cap. Colour's own force-broken-at-
                  the-sentence-boundary special case (point 6) was
                  removed the same day once every blurb's trailing/mid
                  full stops were dropped (see customSection.ts) — that
                  mechanism split on ". ", which no longer exists in any
                  blurb; every blurb (including Colour) now renders as
                  one plain string like every other attribute.
                */}
                {/* `text-micro` (11px, 30 Aug 2026, owner: "bump down
                    the font size" for these six blurbs specifically —
                    the FABRIC/COLOUR/etc labels above are explicitly
                    NOT touched, only this description text) — was
                    `text-support` (13px), the next step down on the
                    scale.

                    **Bumped back up on mobile only, 31 Aug 2026**
                    (owner, testing live, same request/reasoning as the
                    process captions above: "all of this" — the process
                    captions and these attribute blurbs, named together
                    — "needs to be bumped up," mobile-only) — same
                    `text-support`-below-`sm` mechanism, desktop
                    unchanged.

                    **Wrapped in the same `mx-auto w-[80%]` as the image
                    below it, 1 Sep 2026** (owner: same "text should
                    never spill outside the thumbnail's left/right edge"
                    rule applied to all 12 captions/blurbs — see the
                    matching process-caption comment above for the full
                    reasoning) — the `flex-1` growable role that used to
                    live on this `<p>` (see this column's outer wrapper
                    comment above) moves onto the new wrapper `<div>`
                    instead, since it's now the wrapper, not the `<p>`
                    directly, that needs to grow and absorb the extra
                    row height. */}
                <div className="mx-auto w-[80%] flex-1">
                  <p className="text-center text-support text-charcoal/70 sm:text-micro">
                    {attrCopy.blurb}
                  </p>
                </div>
                <div className="mx-auto mt-1 w-[80%]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    {attrMedia ? (
                      <Image
                        src={attrMedia.url}
                        alt={attrMedia.alt || attr.imageAlt}
                        fill
                        sizes="(min-width: 1024px) 131px, (min-width: 640px) 220px, 40vw"
                        className="object-cover"
                      />
                    ) : (
                      <MediaPlaceholder label={attr.imageAlt} className="h-full w-full" />
                    )}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
