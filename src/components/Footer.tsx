"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { LinkedInIcon, InstagramIcon } from "./SocialIcons";
import { getVisibleNavLinks } from "@/lib/navigation";
import { useTalkToKibo } from "@/components/TalkToKiboProvider";
import type { SiteSettingsContent } from "@/lib/content";

// Site-wide footer — Footer Build Brief (21 Aug 2026). 5 columns +
// bottom bar; all copy comes from Sanity Site Settings (siteSettings
// singleton) via lib/content, falling back to the brief's approved
// placeholder copy if no document exists yet — same pattern as every
// other content type in this project.
//
// Mobile-first: single stacked column by default, expanding to a grid at
// sm/lg — per the brief, most of KIBO's target buyers are mobile-first
// users, so this isn't a desktop layout with mobile as an afterthought.
//
// Brand column spans 2 of 6 grid tracks (not 1 of 5) — per owner
// feedback (21 Aug 2026), its 3-line blurb must never wrap mid-sentence,
// so it gets extra width rather than being squeezed even with
// whitespace-nowrap forcing single lines.
export function Footer({ settings }: { settings: SiteSettingsContent }) {
  const year = new Date().getFullYear();
  // Blog nav-visibility toggle (31 Aug 2026) — see lib/navigation.ts's
  // own comment on `getVisibleNavLinks`. Footer already receives
  // `settings` as a prop, so it derives the filtered list itself rather
  // than needing a separate prop for this one thing.
  const navLinks = getVisibleNavLinks(settings.showBlogInNav);
  // `"use client"` added to this file, 30 Aug 2026, specifically so
  // "Talk to KIBO" below can open the real shared modal instead of the
  // `/#contact` placeholder anchor — see that link's own comment.
  const { open: openTalkToKibo } = useTalkToKibo();

  return (
    <footer>
      {/* Top divider inset from both edges, centered, instead of a
          full-bleed `border-t` on the `<footer>` itself (30 Aug 2026,
          owner, on a screenshot of this line: "don't keep it end to
          end... inset it to come in further, maybe an inch or so from
          both sides but centered" — the previous edge-to-edge line
          "looks very very flaky"). `mx-24` (96px each side, ≈1 inch at
          96dpi) on a plain `<div>` replacing the `<footer>`'s own
          `border-t`. */}
      <div className="mx-24 h-px bg-charcoal/10" />
      {/*
        gap-x wider than gap-y deliberately (owner feedback, 21 Aug
        2026): with equal-width columns but very different content
        lengths per column (Contact's address line vs. short Navigate/
        Buyers words), a narrower horizontal gap reads as uneven even
        though it's numerically uniform — the longer content just leaves
        less of its own column empty before the next one starts. Wider
        gap-x gives consistent breathing room regardless of content
        length. */}
      {/* **Restructured 30 Aug 2026** (owner, on a screenshot: "the left
          line of [the Brand column] should align with the left line of
          the What-led-to-KIBO video thumbnail... whatever the distance
          is between the KIBO logo and the left edge, leave the same
          between the right edge and the T of Connect") — supersedes the
          prior "content-hugging, centered in the raw viewport" fix
          (below). That fix made the row's own left/right margins
          symmetric relative to EACH OTHER, but not relative to the rest
          of the page — Footer was the only section not living inside
          the shared `max-w-[1728px]` container every other section
          uses, so its content started at a different x than, say,
          Founder's video column.
          Now: the whole footer content (columns row + bottom bar) sits
          inside that SAME shared container, with `lg:px-[15.36%]`
          padding on both sides — a percentage, not a flat pixel value,
          so it scales proportionally with the container rather than
          only being correct at one exact width. That percentage is a
          hand-measured match, not derived from a shared box model
          (Footer's shape has no natural equivalent to Founder's
          grid+border+`ml-auto` mechanism to inherit the position from
          "by construction") — measured live: Founder's video column
          left edge sits at 265px into the 1728px-wide container,
          265/1728 ≈ 15.36%. Re-measure and adjust this percentage if
          Founder's own column proportions ever change.
          `lg:justify-between` (was `lg:justify-center` + content-
          hugging `w-fit`) spreads the 4 non-Brand columns across the
          now-wider available span instead of clustering tightly
          together — the direct visual consequence of matching Founder's
          much-wider left/right insets is more horizontal room to fill,
          and even spacing across it reads better than leaving a large
          empty gap after a tightly-packed cluster. */}
      <div className="mx-auto w-full max-w-[1728px] lg:px-[15.36%]">
        {/* `py-14` → `py-10` (30 Aug 2026, owner, on a screenshot: "reduce
            the space between the horizontal line and the top of
            Navigate/Contact/Buyers/Connect... and reduce the gap between
            the bottom of Resources and the bottom horizontal line...
            make sure both gaps are equal") — both gaps were already
            equal by construction (same `py-14` value top and bottom of
            this one div), just both too generous; scaled down together
            (56px → 40px) to keep them equal rather than adjusting one
            side only. */}
        <div className="grid grid-cols-1 gap-y-10 gap-x-10 px-6 py-10 sm:px-10 md:grid-cols-2 lg:flex lg:flex-row lg:justify-between lg:gap-x-10 lg:gap-y-8 lg:px-0">
        {/* Brand */}
        {/* Centered below `lg`, 31 Aug 2026 (owner, testing live mobile:
            "the KIBO logo is... left aligned. I think it should be
            aligned at the center... this looks kind of weird") — this
            was the one column with no alignment override at all (every
            other column already uses `items-center text-center`), so it
            fell back to plain left-aligned block flow on the stacked
            mobile/tablet layout, inconsistent with its four siblings.
            `lg:items-start lg:text-left` keeps this column's original,
            unedited desktop reading (a left-anchored first column in the
            row) — this is a sub-`lg` change only. */}
        <div className="flex flex-col items-center gap-3 text-center md:col-span-2 lg:col-span-2 lg:items-start lg:text-left">
          {/* Sized to match Nav.tsx's logo exactly (30 Aug 2026, owner,
              on a screenshot of this column: "reduce logo size to match
              with top bar") — was a flat, non-responsive `width={112}`;
              now the identical `width={124}` (intrinsic/source size,
              same image-optimization headroom) + responsive className
              Nav uses.

              **Re-matched, 31 Aug 2026** — Nav's own mobile size moved
              37.57px → 46.96px the same day (owner: nav logo too small
              on mobile), which this file wasn't updated alongside at
              the time, quietly breaking the "matches Nav exactly" rule
              this comment itself states. Caught by the owner noticing
              the footer logo looked smaller than the top bar's on a
              live mobile screenshot — same underlying rule, just
              re-applied after Nav's own value changed. Desktop
              (`sm:w-[68.51px]`) was never touched by that Nav change,
              so it stays as-is here too. */}
          <Logo width={124} className="h-auto w-[46.96px] sm:w-[68.51px]" />
          {/* Bumped onto the real type scale, `text-micro` (11px, 30 Aug
              2026, owner: "increase description size bump up" — per the
              standing rule, "bump up" always lands on the next named
              token, never an arbitrary size) — supersedes the
              deliberate off-scale exception this line carried before
              (`text-[7px] sm:text-xs`, kept off-scale specifically to
              avoid overflowing this column). Re-verified the actual
              constraint before bumping rather than assuming it no
              longer applied: measured live at the column's narrowest
              real width (lg breakpoint edge, 267px) and `text-micro`'s
              longest line needs ~271px there — a few px over. Rather
              than refuse the bump or force an overflow, `whitespace-
              nowrap` is dropped (was forcing a hard single line); the
              longest line now simply wraps to 2 short lines at that one
              narrow edge instead of clipping, same graceful behavior
              every other multi-word label on this site already uses
              when space is tight. */}
          <div className="flex flex-col text-micro text-charcoal/60">
            {settings.footerBrandLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        {/* Navigate */}
        <div className="flex flex-col items-center gap-3 text-center">
          {/* `<h4 text-h4>` (14px, sentence case, 29 Aug 2026) replacing
              the shared `<Eyebrow>` micro-label component — font case
              1.png names H4 as "small subsections, mainly footer/nav
              group headings" specifically, distinct from the micro-label
              eyebrows (Hero, "Our Story") `<Eyebrow>` still correctly
              renders elsewhere. Same swap on Buyers/Contact/Connect
              below. */}
          <h4 className="text-h4 font-semibold text-charcoal">Navigate</h4>
          {/* `text-micro` (11px, 30 Aug 2026, owner, on the nav link
              list/contact block specifically — "Navigate Buyers Contact
              Connect seem fine" (the `<h4>` group headings above, left
              untouched), "but the home products our story resources...
              reduce the font on those, bump it down") — was
              `text-support` (13px), the next step down. Same change on
              Buyers' two links and the Contact block below. */}
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-micro text-charcoal/60 transition-colors hover:text-charcoal"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Buyers — reverted to 2nd column, its ORIGINAL position, 30 Aug
            2026 (owner, on a screenshot of the Contact/Buyers reorder
            from earlier the same day: "the correct sequence is Navigate
            Buyers Contact Connect — I don't know why this flipped") —
            the "distribute more logically" reorder from earlier this
            session swapped Contact and Buyers; this un-swaps them back
            to the original Navigate/Buyers/Contact/Connect order. */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h4 className="text-h4 font-semibold text-charcoal">Buyers</h4>
          <nav className="flex flex-col gap-2">
            {/*
              **Rewired to the real shared modal, 30 Aug 2026** (owner:
              "all Talk to KIBO and Get in touch buttons should open up
              the inquiry form") — was a plain `<Link href="/#contact">`
              placeholder anchor (the Final Enquiry section it originally
              targeted still doesn't exist, but the persistent CTA's
              modal — built 28 Aug 2026 — is the actual real destination
              per the brand doc, not that anchor). Same
              `useTalkToKibo().open()` trigger every other "Talk to
              KIBO" button on the site already uses (Nav, the mobile
              sticky bar, the Products-page CTA nudge) — a plain
              `<button>`, not a `<Link>`, since it opens an overlay
              rather than navigating.
            */}
            <button
              type="button"
              onClick={openTalkToKibo}
              className="text-micro text-charcoal/60 transition-colors hover:text-charcoal"
            >
              Talk to KIBO
            </button>
            {/* "Lookbook" → "Catalog" / `/lookbook` → `/catalog`, 30 Aug
                2026 — see navigation.ts's own comment on the same
                rename. */}
            <Link
              href="/catalog"
              className="text-micro text-charcoal/60 transition-colors hover:text-charcoal"
            >
              Catalog
            </Link>
          </nav>
        </div>

        {/* Contact — reverted to 3rd column, see Buyers' comment above. */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h4 className="text-h4 font-semibold text-charcoal">Contact</h4>
          {/* `text-micro` (11px, 30 Aug 2026, owner: "reduce the font on
              those, bump it down" — nav links + this contact block,
              explicitly NOT the group headings, which "seem fine") —
              was `text-support` (13px), the next step down. */}
          <div className="flex flex-col gap-2 text-micro text-charcoal/60">
            {settings.footerAddress && <p>{settings.footerAddress}</p>}
            {settings.footerEmail && (
              <a
                href={`mailto:${settings.footerEmail}`}
                className="transition-colors hover:text-charcoal"
              >
                {settings.footerEmail}
              </a>
            )}
            {settings.whatsappNumber && (
              <a
                href={
                  settings.whatsappDigits
                    ? `https://wa.me/${settings.whatsappDigits}`
                    : undefined
                }
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-charcoal"
              >
                {settings.whatsappNumber}
              </a>
            )}
          </div>
        </div>

        {/* Connect — always shown (owner preference, 21 Aug 2026), and
            always a real, clickable <a> rather than an inert element
            while the URL is unset — same "#" placeholder pattern already
            used for "Talk to KIBO" above. Add the real LinkedIn/
            Instagram URLs in Sanity whenever those pages/accounts are
            ready; no code change needed then. See PROJECT-SUMMARY.md
            pre-launch checklist.

            Icon-overflow fix, 30 Aug 2026 (owner, on a screenshot: "the
            Instagram logo with its circle is crossing the vertical line
            where the T of connect ends... it needs to be constrained
            within that vertical line") — root cause, confirmed by
            measurement: this column's flex-stretched `<h4>` box was
            exactly as wide as the 2-icon row (84px) even though the word
            "Connect" itself only needs ~61px, so the icons — which fill
            their own row edge to edge — visibly overran the (invisible)
            extra ~23px past where the word's own last letter actually
            ends. Originally fixed with `items-end`/`text-right`
            (sharing a common RIGHT edge); **switched to
            `items-center`/`text-center`, same day**, once every other
            column was centered under its own heading (owner: "center
            the underlying text around the column heads") — centering
            both the heading and the icon row within the same
            widest-child-determined box fixes the overflow exactly the
            same way (they still share one true edge, now the box's
            horizontal center instead of its right edge), so this
            column's own icon-overflow fix isn't lost by joining the
            other three columns' new alignment. */}
        <div className="flex flex-col items-center gap-3 text-center">
          <h4 className="text-h4 font-semibold text-charcoal">Connect</h4>
          <div className="flex justify-center gap-3">
            <a
              href={settings.linkedInUrl || "#"}
              {...(settings.linkedInUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label="KIBO on LinkedIn"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={settings.instagramUrl || "#"}
              {...(settings.instagramUrl
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              aria-label="KIBO on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/70 transition-colors hover:border-charcoal/40 hover:text-charcoal"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
        </div>

        {/* Bottom legal bar. Lives inside the same shared
            `max-w-[1728px] lg:px-[15.36%]` wrapper as the columns row
            above (see that wrapper's own comment) — `lg:w-full` here
            means "full width of that shared, padded box," so its own
            edges land on the exact same x-positions as Brand's left
            edge and Connect's right edge, by construction.

            **Case fixed, 30 Aug 2026** (owner: "2026 KIBO is fine, but
            Privacy Policy / Terms & Conditions should be sentence case
            or first-letter-of-every-word caps") — the `uppercase`
            transform is gone; the underlying copy was already authored
            as "Privacy Policy" / "Terms & Conditions" (title case), so
            removing the CSS transform alone gets there, no copy change
            needed. `tracking-[0.08em]` dropped with it — that letter-
            spacing was tuned for all-caps micro-label text and reads too
            loose on mixed-case words.

            **Rearranged, same day** (owner: "equally spaced doesn't
            look very good — other ways to arrange these three?" — asked
            for options, chose "left + right pair"): copyright now
            anchors the left edge alone; Privacy Policy and Terms &
            Conditions sit together as a tight-gapped pair anchored to
            the right edge, `justify-between` between the two groups
            supplies the one big gap in the middle instead of three even
            gaps. */}
        {/* `py-5` → `py-3.5` (20px → 14px, 30 Aug 2026, owner: "reduce
            the padding slightly... that whole bar can be a little
            shorter in the y-axis") — this bar's own vertical padding is
            what sets its height (nothing else pads it). */}
        <div className="flex flex-col items-center gap-3 border-t border-charcoal/8 px-6 py-3.5 text-center text-micro text-charcoal/50 sm:flex-row sm:justify-between sm:px-10 lg:w-full lg:px-0">
          <p>© {year} KIBO</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-charcoal">
              Privacy Policy
            </Link>
            <Link href="/terms-conditions" className="hover:text-charcoal">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
