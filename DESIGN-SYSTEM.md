# KIBO Design System — Phase 1

Status: foundation only. This covers the tokens set up in `src/app/globals.css`
and demoed at `/style-guide`. It is not the homepage build — see
`../KIBO-Website Architrcture.docx` and `../KIBO_Website_Master_Brief.docx`
for that.

## Colour

Source of truth: `../KIBO_Logo_and_Brand_Specification.docx` §8 and the
`Kibo Brand Identity.png` mood board. Reproduced exactly, no additions:

| Token         | Hex       | Name       |
| ------------- | --------- | ---------- |
| `sage-green`  | `#6F7F6E` | Sage Green |
| `green-gray`  | `#8F988E` | Green Gray |
| `warm-stone`  | `#DECDC3` | Warm Stone |
| `soft-taupe`  | `#BB8044` | Soft Taupe |
| `charcoal`    | `#222222` | Charcoal   |

Plus `background` (`#FFFFFF`) and `foreground` (= `charcoal`), since the
brand spec calls for a white/very light background and doesn't name a
separate text colour. No dark mode — the brand spec only describes a light,
white-background system.

Available as Tailwind utilities directly: `bg-sage-green`, `text-charcoal`,
`border-warm-stone`, etc.

**Resolved by owner (overrides the mood board where they conflict):**

- **No mountain/Kilimanjaro imagery.** The mood board's name-origin callout,
  full-bleed mountain photo, and any trekking/adventure/peak association are
  superseded. Current direction is modern, understated, credible B2B men's
  apparel for African markets — nothing mountain-themed in visual language
  or messaging anywhere on the site.
- **Logo: use the supplied PNG statically, as-is.** This settles the
  solid-vs-gradient question in §4/§8 by using what's actually been
  supplied (the gradient version) rather than picking between the two
  written descriptions.

## Typography

Source of truth: brand spec §7 — "Primary typography direction: Montserrat,"
clean/modern/legible, with Bold/Semibold and Regular/Light weight samples
shown. Loaded via `next/font/google` as a variable font in
`src/app/layout.tsx`, exposed as the default `font-sans`.

Weights map onto Tailwind's standard utilities, which already line up with
the spec's own naming:

| Utility          | Weight |
| ----------------- | ------ |
| `font-light`       | 300    |
| `font-normal`       | 400    |
| `font-semibold`     | 600    |
| `font-bold`         | 700    |

**Type scale is not defined anywhere in the brand documents.** The scale in
`globals.css` (`text-xs` through `text-6xl`, plus one added `text-display`
step for hero-scale headlines) is a conservative default close to Tailwind's
own scale — a placeholder to build against, not an approved spec. Flag any
real design decision here before it goes live broadly.

## Logo

`src/components/Logo.tsx` renders the supplied `Kibo Logo Latest.png`
(copied to `public/brand/kibo-logo.png`) via `next/image`, statically, at a
caller-specified width. Demoed at `/style-guide` and used on the Phase 1
placeholder homepage.

**Not animated.** The brand spec describes a code-driven K→mountain→K
animation built from three separated vector path components, but only a
flattened PNG has been supplied. Do not approximate or hand-reconstruct
those vector paths — treat the animation as a deferred enhancement to pick
up once real SVG/AI/EPS masters with editable K components arrive from the
logo freelancer.

## Spacing

Not defined in the brand documents either. Using Tailwind's default 4px-based
spacing scale as-is (`p-*`, `gap-*`, `py-*`, …) rather than inventing
KIBO-specific spacing tokens — deliberate, to avoid overengineering a system
with no source spec to build from (Master Brief §8).

## Open questions for the owner

1. **Type scale and spacing** above are implementation placeholders, not
   approved brand specs — flag if you want something specific here instead.
2. **Logo vector masters.** Still waiting on SVG/AI/EPS masters with
   separated K components before the animation can be built for real.

Logo usage and mountain/Kilimanjaro imagery are resolved (see above) and no
longer block homepage section work.
