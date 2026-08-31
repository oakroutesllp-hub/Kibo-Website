import Image from "next/image";
import { CustomAttributeIcon } from "@/components/CustomAttributeIcon";
import { CUSTOM_PROCESS_STEPS, CUSTOM_ATTRIBUTES } from "@/lib/customSection";

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
export function CustomSection() {
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
      <div className="mx-auto flex w-full max-w-[1728px] flex-col gap-8 px-6 pt-4 pb-7 sm:gap-10 sm:px-10 sm:pt-5 sm:pb-[2.45rem]">
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
          <h2 className="max-w-3xl text-h2 font-bold leading-[1.1] tracking-tight text-charcoal">
            From reference to finished garment
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
            "BUILT AROUND YOUR REQUIREMENTS" divider. */}
        <div className="mx-auto flex w-full max-w-[986px] flex-col gap-6 sm:gap-8">
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
                      micro` already serves elsewhere on the site. */}
                  <span className="max-w-[8rem] text-micro font-semibold uppercase leading-snug tracking-[0.12em] text-charcoal/60">
                    {step.trackerLabel}
                  </span>
                </li>
              ))}
            </ol>

            {/* Six process photo cards — each thumbnail capped to 80% of
                its column and centered (`mx-auto w-[80%]`), horizontal
                gap collapsed to 0 at `lg` (see file comment, point 3–4). */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-0 lg:gap-y-6">
              {CUSTOM_PROCESS_STEPS.map((step) => (
                <div key={step.number} className="flex flex-col gap-4">
                  <div className="mx-auto w-[80%]">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                      <Image src={step.image} alt={step.imageAlt} fill className="object-cover" />
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
                      choice) is unaffected. */}
                  <p className="line-clamp-3 text-center text-support text-charcoal/70 sm:text-micro">
                    {step.caption}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <span aria-hidden="true" className="h-px w-8 bg-charcoal/25 sm:w-16" />
            {/* Reclassified as a micro label, not H2 (29 Aug 2026, font
                case 1.png: "'Built around your requirements.' → I would
                make this a micro label, not H2, because visually and
                structurally it functions as an eyebrow/section label")
                — `text-micro` (11px) replacing `text-sm sm:text-base`.
                Stays uppercase — that's the case rule for micro labels.
                Bumped to `text-support` (13px, 30 Aug 2026, owner, on a
                screenshot of this exact line: "increase font size") —
                the next step up in the type scale from micro. */}
            {/* Trailing full stop removed (30 Aug 2026, owner: "remove
                the full stop after requirements"). */}
            {/* Sentence case + sage-green, 30 Aug 2026 (owner, on a
                screenshot: "make this sentence case or each-word-
                capitalized — I think sentence case makes more sense,
                take a judgment call — and sage green grey, just like the
                entire graphic") — judgment call taken as invited:
                sentence case over Title Case, since every other
                headline/label on the site (Supply, Long Run, Listening,
                Tiruppur) already uses sentence case, not Title Case —
                Title Case here would be the one inconsistent label.
                `uppercase` dropped (the copy itself now IS the display
                casing, same fix pattern as every other de-capped label
                on this site) and `tracking-[0.18em]` dropped with it —
                that wide letter-spacing was tuned for all-caps and reads
                too loose on mixed case, same reasoning as the footer's
                own uppercase→sentence-case fix earlier this session.
                `text-charcoal` → `text-sage-green`.

                `text-body` (15px, 30 Aug 2026, owner, on a screenshot of
                this exact line: "bump up font size") — was `text-support`
                (13px), the next step up on the scale.

                **`text-center` added + bumped again on mobile, 31 Aug
                2026** (owner, testing live: "'built around your
                requirements' that text is not centered at all and I
                think its size also needs to be bumped up") — this line
                wraps to 2 lines at mobile widths, and with no
                `text-center` a wrapped `<h3>` falls back to plain
                left-aligned block text by default, which reads as
                off-center between its two flanking dash accents (the
                ROW itself was already `justify-center`, but that only
                centers the row as a whole — it says nothing about how
                text wraps *inside* the h3's own box). `text-h3` (18px)
                below `sm`, back to the original `text-body` (15px) at
                `sm` and up — desktop, where this was already a
                specifically-tuned size, is unaffected. */}
            <h3 className="text-center text-h3 font-semibold text-sage-green sm:text-body">
              Built around your requirements
            </h3>
            <span aria-hidden="true" className="h-px w-8 bg-charcoal/25 sm:w-16" />
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
            {CUSTOM_ATTRIBUTES.map((attr) => (
              <div key={attr.label} className="flex h-full flex-col items-center gap-4 text-center">
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
                <h4 className="max-w-[8rem] text-micro font-semibold uppercase leading-snug tracking-[0.12em] text-charcoal/60">
                  {attr.label}
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
                    unchanged. */}
                <p className="flex-1 text-support text-charcoal/70 sm:text-micro">
                  {attr.blurb}
                </p>
                <div className="mx-auto mt-1 w-[80%]">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-lg">
                    <Image src={attr.image} alt={attr.imageAlt} fill className="object-cover" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
