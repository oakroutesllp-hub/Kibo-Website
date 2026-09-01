"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { getVisibleNavLinks } from "@/lib/navigation";
import { useTalkToKibo } from "@/components/TalkToKiboProvider";

// Site-wide navigation — Phase 2. Supersedes the logo-only Masthead from
// Phase 1 (which deliberately reserved this compositional slot without
// building nav links yet). Scoped to pages that actually exist — no dead
// links to sections that aren't built. The link list is shared with
// Footer.tsx (see lib/navigation.ts's `NAV_LINKS`/`getVisibleNavLinks`)
// so the two never drift out of sync.
//
// Home-only overlay treatment (25 Aug 2026, "Hero height & top nav
// treatment"): on Home, the nav floats transparently over the full-bleed
// Hero image instead of sitting in normal flow above it — `fixed`, no
// background of its own. Hero supplies its own light top scrim for
// legibility (see Hero.tsx) rather than the nav inverting to light
// text/logo, since the current logo asset is a dark gradient with no
// light/reversed version (same constraint that's kept the footer light).
// Every other page keeps the original solid, in-flow sticky bar
// unchanged.
//
// `scrolledPastHero` (26 Aug 2026) — the transparent treatment was
// designed back when Home was Hero-only (one viewport, nothing to scroll
// to). Now that Home scrolls into the Products grid directly below Hero
// (originally via a scroll-triggered route change, `HomeProductsHandoff.tsx`
// — deleted 28 Aug 2026 when Home became one continuous page, see
// `(site)/page.tsx`'s own comment), a still-transparent nav kept floating
// over that plain content with no image behind it anymore and no
// background of its own — reported directly by the owner testing on an
// actual phone as a logo floating in empty space, "not a solid bar."
// Fixed by watching Hero itself (`id="hero"`) with an IntersectionObserver
// and giving the nav a solid background/border the instant Hero has fully
// scrolled out of view — the same seam that used to trigger the route
// change now just marks where the Products content visually takes over
// within the one continuous page.
//
// Revised again same day: that fix alone didn't address the owner's
// actual complaint on retest — the logo and hamburger still read as two
// separate floating things, not one bar, *while still over Hero*, which
// this fix never touched (fully transparent there was the original
// design, not a bug the first fix was aimed at). With placeholder gray
// media rather than a real photo, a fully invisible bar has nothing to
// visually ground it. Given a light frosted tint even over Hero
// (`bg-background/25 backdrop-blur-[2px]`, well short of the full solid
// treatment) — enough for the logo and hamburger to read as sitting on
// one continuous bar, while staying light enough not to fight a real
// hero photo once one exists. This does revise part of the "nav floats
// fully transparent over Hero" call in "Hero height & top nav treatment"
// (25 Aug 2026) — worth re-confirming once real photography is in, since
// this was tuned against a gray placeholder.
//
// Deliberately only the *visual* style toggles here, not the positioning
// mode: `position` stays `fixed` throughout Home regardless of scroll
// (only the non-Home case uses `sticky`, in flow). Switching a `fixed`
// header (which reserves no flow space) to `sticky` (which does) mid-
// scroll would suddenly insert ~89px of flow height above everything,
// reflowing the whole page under the visitor's feet — confirmed by
// reasoning through the box model, not worth risking on a phone. This
// works because Hero itself is the thing occupying that space —
// Hero is deliberately tall/full-height specifically so real content
// sits correctly under the `fixed` nav (see "Hero height & top nav
// treatment"); everything after Hero on Home (28 Aug 2026: the whole
// rest of the page, not just a Products preview) just flows normally
// starting where Hero ends, no manual offset needed anywhere.
// `showBlogInNav` (31 Aug 2026) — see lib/navigation.ts's own comment
// on `getVisibleNavLinks`. Passed down from `(site)/layout.tsx`, which
// already fetches `getSiteSettings()` for Footer.
export function Nav({ showBlogInNav }: { showBlogInNav: boolean }) {
  const navLinks = getVisibleNavLinks(showBlogInNav);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const isHome = pathname === "/";
  // Renamed on destructure — `open` is already this component's own
  // mobile-hamburger-menu state; `useTalkToKibo()`'s `open` is an
  // unrelated function (opens the enquiry modal) that would otherwise
  // silently shadow it.
  const { open: openTalkToKibo } = useTalkToKibo();

  useEffect(() => {
    if (!isHome) return;

    const hero = document.getElementById("hero");
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => setScrolledPastHero(!entry.isIntersecting), {
      threshold: 0,
    });
    observer.observe(hero);
    // Reset in the cleanup (fires when `isHome` flips away, e.g. leaving
    // Home) rather than synchronously in the effect body — setState
    // directly in an effect body triggers cascading renders and is a lint
    // error; a cleanup callback is the correct place to react to the
    // external transition away from Home.
    return () => {
      observer.disconnect();
      setScrolledPastHero(false);
    };
  }, [isHome]);

  const showSolidBar = !isHome || scrolledPastHero;

  return (
    <header
      className={`${isHome ? "fixed" : "sticky"} inset-x-0 top-0 z-40 ${
        showSolidBar
          ? "border-b border-charcoal/8 bg-background backdrop-blur"
          : "bg-background/45 backdrop-blur-[2px]"
      }`}
    >
      {/*
        Opacity increased (30 Aug 2026, owner: "has to be a little more
        opaque... keep it more opaque than what it currently is") — the
        solid state (`showSolidBar`, i.e. every page except Home before
        it's scrolled past Hero) went `bg-background/95` → plain
        `bg-background` (fully opaque, no see-through at all); the
        floats-over-Hero state went `bg-background/25` → `bg-background/45`
        — still meaningfully transparent (Hero's own image reads through
        it, which is the whole point of that state existing) but
        noticeably more solid than before.

        Mobile bar height reduced (27 Aug 2026, owner feedback: "too big
        as in high") — `py-5` (20px top+bottom) shrunk to `py-3` (12px) on
        mobile only, `sm:py-5` keeps the original desktop size unchanged.

        Reduced another 35% (28 Aug 2026, owner: "reduce top sticky bar
        size by 35%"), both breakpoints — `py-3` (0.75rem) → 0.4875rem,
        `sm:py-5` (1.25rem) → 0.8125rem.

        Reduced another ~15% (30 Aug 2026, owner: "a little more narrow
        maybe another 15 percent or so") — 0.4875rem → 0.4144rem,
        0.8125rem → 0.6906rem (both × 0.85). Arbitrary rem values rather
        than the next size down on Tailwind's scale, same reasoning as
        every prior pass in this history, so the exact ratio holds.
      */}
      <div className="mx-auto flex max-w-[1728px] items-center justify-between px-6 py-[0.4144rem] sm:px-10 sm:py-[0.6906rem]">
        <Link href="/" onClick={() => setOpen(false)} className="shrink-0">
          {/*
            Responsive size — owner feedback testing on an actual phone,
            twice: first pass (26 Aug) took it from a fixed 124px down to
            80px on mobile; second pass (27 Aug, "another 15% or so")
            takes it to 68px/124px (mobile/desktop). Reduced another 35%
            (28 Aug 2026, owner: "reduce ... the logo size also by 35%")
            → 44.2px/80.6px.

            Reduced another 15% (30 Aug 2026, same pass as the bar's own
            height reduction above — owner asked for the bar "a little
            more narrow," not the logo explicitly, but shrinking the bar
            without shrinking the logo to match risked the logo crowding
            the now-shorter padding, the same coupling this file's own
            history already established twice before) — 44.2px/80.6px →
            37.57px/68.51px (× 0.85).

            Mobile size increased 25%, 31 Aug 2026 (owner, testing the
            live mobile site directly: "the KIBO logo is very small. It
            needs to be bigger, maybe by another 20-30%") — the mobile
            side of this shrink history went one step too far; 37.57px →
            46.96px (× 1.25, middle of the owner's given range). Desktop
            (`sm:w-[68.51px]`) is unchanged — this complaint was mobile-
            only.

            Bumped again, same day (owner, comparing it directly against
            the Hero heading: "the logo looks really tiny as compared to
            'Men's Apparel for African Market'... increase the logo by
            10 percent or so," separately also said "15 20 percent" —
            15%, the middle of the two figures given, landed on) —
            46.96px → 54px (× 1.15). Desktop unchanged, same reasoning
            as the pass above. `width={124}` stays the *intrinsic*
            source size (comfortably above the rendered size at every
            breakpoint, so nothing is upscaled/blurred); the className
            is what actually controls the size.
          */}
          <Logo width={124} priority className="h-auto w-[54px] sm:w-[68.51px]" />
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                // Scroll-to-top fallback for "Home" when already on Home
                // (1 Sep 2026, owner: "when you click home from the
                // footer, it does not go to the home page") — Home is
                // one continuous scrolling page (`(site)/page.tsx`), so
                // clicking a link to "/" while already on "/" is a
                // same-route no-op for Next's router: the URL is already
                // correct, so nothing visibly happens if you're scrolled
                // deep into, say, Founder's section — reading as "this
                // button is broken," not "you're already home." Same fix
                // applied to the mobile menu below and Footer.tsx's own
                // Home link.
                onClick={() => {
                  if (link.href === "/" && pathname === "/") {
                    // `behavior: "smooth"` → `"auto"` (instant) — a
                    // direct `window.scrollTo({behavior:"smooth"})` call
                    // produced no visible movement at all when verified
                    // live in this session's own testing sandbox (same
                    // class of environment gap this codebase has hit
                    // before with `IntersectionObserver`, see
                    // ProductsGridSection.tsx's own comment on that) —
                    // `"auto"` was confirmed working directly. Real
                    // browsers do support smooth scroll, but per this
                    // project's own established rule, an unverifiable
                    // mechanism doesn't ship over one that's confirmed.
                    window.scrollTo({ top: 0, behavior: "auto" });
                  }
                }}
                aria-current={active ? "page" : undefined}
                className={`text-support font-medium transition-colors ${
                  active ? "text-charcoal" : "text-charcoal/60 hover:text-charcoal"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {/*
            **Label "Talk to KIBO" → "Get in touch", 1 Sep 2026** (owner,
            relaying friend feedback: he hesitated to click "Talk to
            KIBO" thinking it would open an AI chatbot) — trigger/modal
            unchanged, label only; see Footer.tsx's own comment for the
            full reasoning and the complete list of renamed sites.

            Persistent "Talk to KIBO" CTA — desktop half (28 Aug 2026).
            KIBO_Brand_and_Copy_Direction.md: "in addition to the
            persistent CTA (nav button on desktop, sticky bar on
            mobile, live on every page)" — this is the nav-button half;
            the mobile half is `TalkToKiboStickyBar.tsx`, mounted once
            in `(site)/layout.tsx` rather than duplicated here, so it
            isn't hidden inside the hamburger dropdown. Opens the same
            shared modal every other "Talk to KIBO" trigger on the site
            uses (see TalkToKiboProvider.tsx) — "modal, not navigate"
            was resolved 24 Aug 2026.

            Hover treatment — "Variant A" (30 Aug 2026, owner, after
            reviewing 5 live-hoverable options, then settling on "A and
            E - just like you suggested"): a plain, flat black→Green Gray
            color swap, no movement, no ring. Same treatment applied to
            every other clickable button site-wide (the Products "Specs"
            pill, the enquiry modal, the mobile sticky bar, this nav CTA)
            — one hover language across all of them. Hero's own CTA is
            the one exception, on "Variant E" (A plus an arrow nudge) —
            see that file's own comment for why only that one differs.
          */}
          <button
            type="button"
            onClick={openTalkToKibo}
            className="rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray"
          >
            Get in touch
          </button>
        </nav>

        {/* Hit area + icon reduced ~20%, 31 Aug 2026 (owner, testing live
            mobile: "make the hamburger slightly more compact and
            smaller") — `h-9 w-9` (36px) → `h-8 w-8` (32px) hit area;
            bars `w-5` (20px) → `w-4` (16px), positions/translate amounts
            scaled by the same ~0.8 ratio (`top-[7px]`→`top-[5.5px]`,
            `top-[14px]`→`top-[11px]`) so the X-shape open state still
            meets cleanly at the icon's own vertical center. */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-8 w-8 items-center justify-center sm:hidden"
        >
          <span className="relative block h-[13px] w-4">
            <span
              className={`absolute left-0 top-0 h-0.5 w-4 bg-charcoal transition-transform ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute left-0 top-[5.5px] h-0.5 w-4 bg-charcoal transition-opacity ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute left-0 top-[11px] h-0.5 w-4 bg-charcoal transition-transform ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      {open && (
        <nav
          className={`flex flex-col border-t border-charcoal/8 px-6 py-2 sm:hidden ${
            isHome ? "bg-background/95 backdrop-blur" : ""
          }`}
        >
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                // Same Home-while-on-Home scroll-to-top fallback as the
                // desktop nav above, 1 Sep 2026 — see that link's own
                // comment.
                onClick={() => {
                  setOpen(false);
                  if (link.href === "/" && pathname === "/") {
                    // `behavior: "smooth"` → `"auto"` (instant) — a
                    // direct `window.scrollTo({behavior:"smooth"})` call
                    // produced no visible movement at all when verified
                    // live in this session's own testing sandbox (same
                    // class of environment gap this codebase has hit
                    // before with `IntersectionObserver`, see
                    // ProductsGridSection.tsx's own comment on that) —
                    // `"auto"` was confirmed working directly. Real
                    // browsers do support smooth scroll, but per this
                    // project's own established rule, an unverifiable
                    // mechanism doesn't ship over one that's confirmed.
                    window.scrollTo({ top: 0, behavior: "auto" });
                  }
                }}
                aria-current={active ? "page" : undefined}
                className={`py-3 text-body font-medium ${active ? "text-charcoal" : "text-charcoal/60"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
