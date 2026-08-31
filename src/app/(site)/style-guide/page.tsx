import type { Metadata } from "next";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Style Guide — KIBO",
};

const colors = [
  { name: "Sage Green", token: "sage-green", hex: "#6F7F6E" },
  { name: "Green Gray", token: "green-gray", hex: "#8F988E" },
  { name: "Warm Stone", token: "warm-stone", hex: "#DECDC3" },
  { name: "Soft Taupe", token: "soft-taupe", hex: "#BB8044" },
  { name: "Charcoal", token: "charcoal", hex: "#222222" },
] as const;

const typeScale = [
  { label: "display", className: "text-display" },
  { label: "6xl", className: "text-6xl" },
  { label: "5xl", className: "text-5xl" },
  { label: "4xl", className: "text-4xl" },
  { label: "3xl", className: "text-3xl" },
  { label: "2xl", className: "text-2xl" },
  { label: "xl", className: "text-xl" },
  { label: "lg", className: "text-lg" },
  { label: "base", className: "text-base" },
  { label: "sm", className: "text-sm" },
  { label: "xs", className: "text-xs" },
] as const;

const weights = [
  { label: "Light 300", className: "font-light" },
  { label: "Regular 400", className: "font-normal" },
  { label: "Semibold 600", className: "font-semibold" },
  { label: "Bold 700", className: "font-bold" },
] as const;

const spacingSteps = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32] as const;

export default function StyleGuide() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-16 px-6 py-16">
      <header className="flex flex-col gap-2 border-b border-charcoal/10 pb-8">
        <p className="text-sm font-semibold tracking-[0.2em] text-green-gray uppercase">
          KIBO
        </p>
        <h1 className="text-4xl font-semibold text-charcoal">Design System — Phase 1</h1>
        <p className="max-w-2xl text-base text-charcoal/70">
          Foundation tokens only. Colours are the approved brand palette; type
          scale and spacing are placeholder defaults pending sign-off (see
          DESIGN-SYSTEM.md).
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-charcoal">Logo</h2>
        <p className="text-sm text-charcoal/60">
          Static only — the animated K described in the brand spec is
          deferred until real separated vector paths are available. This is
          the flattened PNG as supplied, unmodified.
        </p>
        <div className="flex items-center gap-8 rounded-md border border-charcoal/10 p-6">
          <Logo width={160} />
          <Logo width={80} />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-charcoal">Colour palette</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {colors.map((color) => (
            <div key={color.token} className="flex flex-col gap-2">
              <div
                className="h-20 w-full rounded-md border border-charcoal/10"
                style={{ backgroundColor: color.hex }}
              />
              <div className="text-sm">
                <p className="font-medium text-charcoal">{color.name}</p>
                <p className="text-charcoal/60">
                  {color.hex} · bg-{color.token}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-charcoal">
          Typography — Montserrat
        </h2>
        <div className="flex flex-col gap-3">
          {typeScale.map((step) => (
            <div key={step.label} className="flex items-baseline gap-4">
              <span className="w-16 shrink-0 font-mono text-xs text-charcoal/50">
                {step.label}
              </span>
              <span className={`${step.className} font-semibold text-charcoal`}>
                Men&rsquo;s apparel for African markets
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 border-t border-charcoal/10 pt-4">
          {weights.map((weight) => (
            <p key={weight.label} className={`${weight.className} text-lg text-charcoal`}>
              {weight.label} — Exported from India.
            </p>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-charcoal">Spacing scale</h2>
        <p className="text-sm text-charcoal/60">
          Tailwind&rsquo;s default 4px-based scale (no brand-specific spacing
          was defined) — used directly via standard p-*, gap-*, py-* utilities.
        </p>
        <div className="flex flex-col gap-2">
          {spacingSteps.map((step) => (
            <div key={step} className="flex items-center gap-4">
              <span className="w-10 shrink-0 font-mono text-xs text-charcoal/50">
                {step}
              </span>
              <div className="h-3 bg-sage-green" style={{ width: `${step * 0.25}rem` }} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
