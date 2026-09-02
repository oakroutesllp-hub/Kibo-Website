"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "@/components/Modal";
import { getStoredLead, storeLead } from "@/lib/leadStorage";
import { useDownloadCatalog } from "@/components/DownloadCatalogProvider";

// The "Talk to KIBO" enquiry form, in the shared Modal.tsx overlay — see
// TalkToKiboProvider.tsx for why this exists now instead of waiting for
// the persistent CTA.
//
// Field set — per KIBO_Brand_and_Copy_Direction.md's "The Enquiry form":
// "Exact final field set not yet designed; working assumption from the
// CTA conversation is name, phone, email, and product interest." That
// doc is explicit the form itself is "Not yet built" and the field list
// isn't finally locked — this uses exactly that 4-field working
// assumption, not an invented list, but should be revisited once the
// owner locks the real field set.
//
// **Wired to a real backend, 30 Aug 2026** — `handleSubmit` POSTs to the
// generic `/api/leads` route (`source: "enquiry"`), which forwards to a
// configurable webhook. Originally POSTed to a Resend-based
// `/api/enquiry` (deleted) — superseded the same day by an owner
// architecture decision to use a free webhook (Google Apps Script →
// Google Sheet) shared with the new "Download Catalog" form, rather than
// a per-form email integration. See `/api/leads/route.ts`'s own comment
// for the full reasoning.
//
// **Pre-fill + cross-form offer, same day** (owner spec, "Cross-form
// 'already known' logic"): if `getStoredLead()` already has a name/email
// (from a previous Download Catalog or Talk to KIBO submission, same
// browser), those two fields pre-fill here, leaving only phone/product
// interest to enter. On a successful submission, the thank-you state
// offers a one-tap "Download the catalog" button — no additional form,
// since we already have their name + email — which opens
// DownloadCatalogModal (site-wide, via DownloadCatalogProvider) already
// knowing their details.
// `label` (1 Sep 2026, owner: "make everything editable") — the global
// "Get in touch" button label, now Sanity-editable; see
// TalkToKiboProvider.tsx's own comment.
export function TalkToKiboModal({ onClose, label }: { onClose: () => void; label: string }) {
  const knownLead = getStoredLead();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { open: openDownloadCatalog } = useDownloadCatalog();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "");
    const phone = String(data.get("phone") ?? "");
    const email = String(data.get("email") ?? "");
    const productInterest = String(data.get("productInterest") ?? "");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "enquiry", name, phone, email, productInterest }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      storeLead({ name, email, phone, productInterest });
      setSubmitted(true);
    } catch {
      setError("Something went wrong sending your enquiry — please try again, or reach us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadCatalogClick = () => {
    onClose();
    openDownloadCatalog();
  };

  return (
    <Modal onClose={onClose} labelledBy="talk-to-kibo-heading">
      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <h2 id="talk-to-kibo-heading" className="text-h3 font-semibold text-charcoal">
            Thanks — we&apos;ll be in touch.
          </h2>
          <p className="max-w-xs text-support text-charcoal/60">
            We&apos;ve received your enquiry. Someone from KIBO will get back to you shortly.
          </p>
          {/* "Download the catalog" cross-offer — see file comment above. */}
          <button
            type="button"
            onClick={handleDownloadCatalogClick}
            className="mt-2 rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray-deep"
          >
            Download the catalog
          </button>
        </div>
      ) : (
        <>
          {/* `text-h3`/`text-support` (30 Aug 2026, owner: "no other font
              sizes floating around" — every size must come from the 8
              named tokens) replacing raw `text-xl`/`text-sm` throughout
              this modal, including the confirmation state above and the
              form fields/button below. */}
          {/* "Talk to KIBO" → "Get in touch" (1 Sep 2026) — see
              Footer.tsx's own comment for the full reasoning (friend
              feedback: read as an AI chatbot trigger). `id` kept as-is —
              internal, not user-visible, and other elements still
              reference it via `aria-labelledby`. */}
          <h2 id="talk-to-kibo-heading" className="pr-8 text-h3 font-semibold text-charcoal">
            {label}
          </h2>
          <p className="mt-1.5 text-support text-charcoal/60">
            Looking for men&apos;s apparel? Tell us what you need.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            {/* Required-field asterisks added 31 Aug 2026 (owner: "so
                someone filling the form knows what is the minimum they
                need to fill without having to guess, half-fill, and
                feel frustrated") — same convention on every required
                field across this modal and DownloadCatalogModal's own
                form. `aria-hidden` on the asterisk since the `input`'s
                own `required` attribute is what actually communicates
                this to assistive tech; the visible `*` is a sighted-user
                affordance layered on top, not a duplicate announcement. */}
            <label className="flex flex-col gap-1.5 text-support">
              <span className="font-medium text-charcoal">
                Name <span aria-hidden="true" className="text-sage-green">*</span>
              </span>
              <input
                type="text"
                name="name"
                required
                defaultValue={knownLead?.name}
                className="rounded-md border border-charcoal/15 bg-background px-3 py-2 text-charcoal outline-none focus:border-sage-green"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-support">
              <span className="font-medium text-charcoal">
                Phone / WhatsApp <span aria-hidden="true" className="text-sage-green">*</span>
              </span>
              <input
                type="tel"
                name="phone"
                required
                defaultValue={knownLead?.phone}
                className="rounded-md border border-charcoal/15 bg-background px-3 py-2 text-charcoal outline-none focus:border-sage-green"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-support">
              <span className="font-medium text-charcoal">
                Email <span aria-hidden="true" className="text-sage-green">*</span>
              </span>
              <input
                type="email"
                name="email"
                required
                defaultValue={knownLead?.email}
                className="rounded-md border border-charcoal/15 bg-background px-3 py-2 text-charcoal outline-none focus:border-sage-green"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-support">
              <span className="font-medium text-charcoal">Product Interest</span>
              <input
                type="text"
                name="productInterest"
                placeholder="e.g. Crew Neck T-Shirt, Woven Shirt"
                defaultValue={knownLead?.productInterest}
                className="rounded-md border border-charcoal/15 bg-background px-3 py-2 text-charcoal outline-none focus:border-sage-green"
              />
            </label>

            {/* Error state, 30 Aug 2026 — only reachable now that
                submitting is a real network request that can actually
                fail (the previous fake `setSubmitted(true)` could
                never fail). */}
            {error && <p className="text-support text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              // Padding matched to Nav's own CTA button, `px-4 py-2` (30
              // Aug 2026, owner: button-size consistency pass across
              // every "Talk to KIBO"-style trigger) — was `px-5 py-3`.
              className="mt-2 rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray-deep disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Send Enquiry"}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
