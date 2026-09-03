import { SupplyRowIcon } from "@/components/SupplyRowIcon";
import { SUPPLY_ROWS } from "@/lib/supplySection";
import type { SupplySectionCopyContent } from "@/lib/content";

// "The Supply Behind Your Market" — KIBO_Brand_and_Copy_Direction.md,
// "The Supply Behind Your Market — page anatomy" (LOCKED 27 Aug 2026).
// Section 4 in the real built page order (Hero → Products grid → Custom
// → Supply), directly below CustomSection on `/products`. Originally
// built against "Section 4 visual reference.png" ("Option 2 · Split
// Layout") — see below for the 30 Aug 2026 relayout that moved away
// from that split-column structure. "Section 4 logos.pdf" still governs
// icon style — see SupplyRowIcon.tsx.
//
// **Relayed out 30 Aug 2026** (owner, after reviewing several live-
// rendered variants: "I like A for the top part... now the right
// manufacturing capability, simplified supply and on the ground know-
// how — try to put that in a single row with vertical dividers instead
// of one under the other with horizontal dividers... Lets go with A2")
// — this replaces the section's entire prior structure:
// - Was a two-column split around a central vertical rule (headline
//   mirrored to the left of the rule, the 3 feature rows stacked
//   vertically to its right, each pair divided by a horizontal rule).
// - Now: one centered column top-to-bottom. Headline + supporting line
//   centered, full width. The 3 feature items sit in a single
//   horizontal row underneath, separated by vertical dividers instead
//   of the old horizontal ones — a literal transpose of the previous
//   row axis, per the owner's own word for it.
// - "A2" specifically (as opposed to the "A1"/"A3" variants also shown)
//   means the vertical dividers are INSET — they stop short of the
//   row's top/bottom edge by a small margin, rather than running the
//   full height of the row — reading as a soft separator between ideas
//   rather than a hard cell wall between table columns.
// - Explicitly NOT a font-size/hierarchy change (owner: "keeping the
//   font hierarchy the same") — every text element below keeps the
//   exact class it had in the split-column version (`text-h2` headline,
//   `text-body` supporting line, `text-h3` row titles, `text-support`
//   row copy); only the arrangement changed.
// `copy` (1 Sep 2026, owner: "make everything editable") — reverses
// this file's own "fixed, code-level" call. `SUPPLY_ROWS`
// (lib/supplySection.ts) still supplies each row's fixed `icon`
// (zipped positionally against `copy.rows`, same convention as
// CustomSection.tsx's own copy wiring) — only label/copy text and the
// two headline/supporting lines are now Sanity-editable.
// `bg-background` → `bg-sage-green/10`, 3 Sep 2026 (owner: "remove the
// green gray sage background from built for the long run... add it to
// you build your market we build the supply behind it") — this
// section is now the one carrying the tinted band Long Run used to
// have (same exact token, `sage-green/10`), not a new color. Padding
// increased along with it, same request, same day ("add some more
// padding on the top and some more padding on the bottom") — matches
// the scale Long Run's own tinted-band padding used before this
// change (`pt-16 sm:pt-[5.6rem]`), since a tinted "band" section reads
// better with more breathing room than a plain white one, same
// reasoning that section's own history already documents. Bottom
// bumped proportionally from this section's own existing `pb-14
// sm:pb-[4.9rem]` (56px/78.4px, already a deliberate exception to the
// site's shared rhythm value — see the comment above) to `pb-20
// sm:pb-24` (80px/96px).
// **Made conditional on `testimonialsVisible`, 3 Sep 2026, later
// follow-up** (owner: "when the testimonials aren't showing, you
// build your market stays in white... built for the long run...
// stays that sage green background") — this section's tint was
// always standing in for "whichever section leads into the tinted
// band," which shifts depending on whether Testimonials renders
// between Long Run and the CTA nudge (see LongRunSection.tsx's own
// matching comment for the full mechanism — exactly one of
// {this section, Long Run} is tinted at a time, never both). White
// when Testimonials is hidden, so this section reads as a continuation
// of Custom's own white above it instead of an isolated tinted island
// with white on both sides.
export function SupplySection({
  copy,
  testimonialsVisible,
}: {
  copy: SupplySectionCopyContent;
  testimonialsVisible: boolean;
}) {
  return (
    <section className={`w-full ${testimonialsVisible ? "bg-sage-green/10" : "bg-background"}`}>
      {/* `py-10 sm:py-14` — the site's standardized inter-section
          rhythm (30 Aug 2026, "consistent rule of white space between
          topic changes"), unchanged by this relayout. */}
      {/* Top reverted, same day, after live review (owner: "the previous
          gap between the six thumbnails and you build your market...
          stays") — `pt-7 sm:pt-[2.45rem]` (28px/39.2px), matching
          Custom's own reverted bottom (see that file's own comment) so
          this one seam goes back to what it was before the exact-match
          pass. */}
      {/* Bottom increased, 30 Aug 2026 (owner, on a screenshot of the
          Supply→Long-Run seam: "increase white space between the bottom
          of 'handled behind the scenes' and top of green sage grey
          band") — was the exact-match `pb-4 sm:pb-5` (16px/20px), the one
          seam left at that smaller value while every other one around it
          got reverted back up. First bumped to match this section's OWN
          top (`pb-7 sm:pb-[2.45rem]`, 28px/39.2px) — symmetric top/bottom
          on this section, and back in line with the "consistent rhythm"
          value used everywhere else.

          **Bumped again, same day** (owner, on a fresh screenshot of the
          same seam: still reads tight) — measured live: with the
          standard-rhythm value the actual gap from the text's own
          bottom edge to the sage-tinted band's top edge was 39.2px,
          numerically the same as every other inter-section seam, but a
          plain white→white seam and a white→tinted-band seam don't read
          the same at an identical pixel value — the color change itself
          draws the eye to the boundary, making the same gap look
          tighter here. Doubled, matching the precedent already set for
          this exact class of complaint (Tiruppur→Founder's seam was
          doubled for the same reason): `pb-7 sm:pb-[2.45rem]` →
          `pb-14 sm:pb-[4.9rem]` (56px/78.4px). A deliberate, logged
          exception to the shared rhythm value, not a silent drift from
          it — Supply's own `pt` and every other seam on the site keep
          the standard value. */}
      <div className="mx-auto flex w-full max-w-[1728px] flex-col items-center gap-10 px-6 pt-16 pb-20 text-center sm:px-10 sm:pt-[5.6rem] sm:pb-24">
        {/* Headline + supporting line — centered (was right-hugging a
            central rule; that rule and the two-column grid it lived in
            are both gone now, see file comment). `text-h2` (30px)/
            `text-body` (15px) unchanged from the split-column version. */}
        <div className="flex max-w-2xl flex-col items-center gap-4">
          <h2 className="text-h2 font-bold leading-[1.1] tracking-tight">
            <span className="block text-charcoal">{copy.headlineLine1}</span>
            <span className="block text-sage-green">{copy.headlineLine2}</span>
          </h2>

          {/* Dash anchor added (30 Aug 2026, owner: "I like this
              horizontal line pattern... it's inconsistent [that] I
              don't see where... you build your market we build the
              supply behind it" [has one] — use the same device Custom's
              headline uses (a single dash below it). */}
          <span aria-hidden="true" className="h-px w-12 bg-charcoal/20" />

          <p className="text-body text-charcoal/70">
            <span className="block">{copy.supportingLine1}</span>
            <span className="block">{copy.supportingLine2}</span>
          </p>
        </div>

        {/* Feature row — the 3 items that used to be a vertical,
            horizontally-divided list are now one horizontal row with
            vertical dividers between them ("A2": inset, not full-
            height). `items-stretch` on the row is what lets each
            divider's `my-2` inset actually stretch to (and inset
            within) the row's own height rather than collapsing to zero
            — a divider with no intrinsic height needs a stretched
            flex parent to have any height to inset from. */}
        {/* Mobile stacking fix, 31 Aug 2026 — found while checking the
            live site on a real mobile width, not requested by name but
            a genuine bug: this row had no responsive behavior at all.
            Three `w-[15rem]` (240px) columns plus their icon/padding/
            dividers need 700px+ side by side, but a phone viewport is
            ~375px — the row overflowed horizontally, which dragged the
            *entire page's* layout width wide along with it (confirmed:
            `document.documentElement.scrollWidth` was 621px against a
            375px device), which in turn stretched the `fixed inset-x-0`
            header wide too, shoving the mobile menu button off the
            right edge of the visible screen — the menu button wasn't
            broken itself, it was just no longer inside the visible
            375px strip. `flex-col` (stacked, one under another) below
            `sm`, `sm:flex-row` (this section's existing side-by-side
            layout) at `sm` and up — the fix is confined to breakpoint
            classes, no change to anything at `sm` and above. */}
        <div className="flex w-full max-w-4xl flex-col items-center sm:flex-row sm:items-stretch sm:justify-center">
          {SUPPLY_ROWS.map((row, i) => {
            const rowCopy = copy.rows[i] ?? row;
            return (
            <div key={row.icon} className="flex flex-col items-center sm:flex-row sm:items-stretch">
              {/* Divider follows the same stack/row flip: a horizontal
                  rule between stacked items on mobile, the existing
                  inset vertical rule (`my-6 w-px`, see the comment this
                  replaced) once the row goes side-by-side at `sm`. Same
                  24px inset value in both orientations — `my-6` on
                  mobile is the vertical gap around the horizontal line,
                  `sm:my-6` restores it as the original top/bottom inset
                  once the line turns vertical. */}
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="my-6 h-px w-40 shrink-0 bg-charcoal/10 sm:my-6 sm:h-auto sm:w-px sm:self-stretch"
                />
              )}
              <div className="flex flex-col items-center gap-3 px-6 text-center sm:px-8">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-sage-green/40">
                  <SupplyRowIcon name={row.icon} className="h-5 w-5 text-sage-green" />
                </span>
                {/* `w-[15rem]` shared by both children (30 Aug 2026,
                    owner: "Centre descriptions under titles") —
                    previously the title and description each shrink-
                    wrapped to their OWN natural width independently
                    (this div had no explicit width, so the outer
                    `items-center` just centered each child's own box);
                    measured directly and found a real ~21px mismatch
                    between the title's center and the description's
                    center in the "manufacturing capability" column
                    specifically — its 2-line title's widest line and its
                    description's own wrapped width happened to differ.
                    Giving this wrapper a single fixed width (matching
                    the description's own `max-w-[15rem]`) forces both
                    children to share one box and one center, by
                    construction, rather than by coincidence. */}
                <div className="flex w-[15rem] flex-col gap-1.5">
                  {/* Fixed 2-line-tall slot (30 Aug 2026, owner: "check
                      for white space consistency between the verticals -
                      something seems off") — "The right manufacturing
                      capability" and "On-the-ground know-how" wrap to 2
                      lines, "Simplified supply" fits on 1; without a
                      shared minimum height here, the 1-line column's
                      description started noticeably higher than the
                      other two, even though every icon above it lines up
                      identically (confirmed: row/divider geometry was
                      already pixel-identical across all 3 columns — this
                      was purely a title-height mismatch, not a layout
                      bug). `min-h-[46.8px]` = `text-h3`'s own line-height
                      (18px × 1.3) × 2.

                      **`items-center` → `items-start`, 30 Aug 2026**
                      (owner, on a screenshot: "'Simplified supply' is not
                      aligned with 'The right manufacturing' and 'On the
                      ground' — needs to shift up") — centering the
                      1-line title within the 2-line slot was a
                      deliberate choice when this was first built, but on
                      review it reads as misaligned rather than
                      intentional. Confirmed directly: all three `<h3>`
                      BOXES already shared an identical top edge (the
                      `min-h` slot mechanism was working correctly), but
                      `items-center` was centering "Simplified supply"'s
                      own line of TEXT within that box's full 2-line
                      height — visibly ~14px lower than the 2-line
                      titles' own first line, which fills the box from
                      its top. `items-start` pins the text to the box's
                      top edge instead, matching the other two. */}
                  <h3 className="flex min-h-[46.8px] items-start justify-center text-h3 font-semibold text-charcoal">
                    {rowCopy.label}
                  </h3>
                  <p className="text-support text-charcoal/70">{rowCopy.copy}</p>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
