"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Modal } from "@/components/Modal";
import { getStoredLead, storeLead } from "@/lib/leadStorage";

// "Download Catalog" gate — Name + Email only, deliberately no phone
// (owner spec, distinguishing it from "Talk to KIBO"'s fuller field
// set). POSTs to the same generic `/api/leads` endpoint TalkToKiboModal
// uses, tagged `source: "catalog_download"` — see that route's own
// comment for the shared webhook mechanism.
//
// **No real PDF exists yet** (owner: "the actual downloadable PDF will
// be supplied later by our creative agency — you don't need to generate
// it") — the thank-you state says so honestly rather than faking a
// download or linking to a broken file. `CATALOG_PDF_URL` below is the
// one line to fill in once that file exists; until then it stays
// `null` and the confirmation copy reflects that.

// `CATALOG_PDF_URL` removed, 31 Aug 2026 — was a hardcoded `null`
// constant right in this file, the "one line to fill in" per the
// comment that used to sit here. Now a real Sanity-editable slot (see
// catalogType.ts) — `pdfUrl` is a prop instead, threaded down from
// `(site)/layout.tsx` → `DownloadCatalogProvider` → here, same pattern
// as `requireGate`. `null`/`undefined` (no PDF uploaded yet) keeps the
// exact same honest "being finalized" copy this always showed; once the
// owner uploads a real file in Sanity, this becomes an actual working
// download link with zero further code changes.
//
// "Already known" skip, per owner spec ("on a later visit... skip
// re-showing a gate/field already filled") — if `getStoredLead()` has a
// name + email already (from a previous Download Catalog OR Talk to
// KIBO submission, same browser), this form is skipped entirely.
//
// **Auto-submits on open, 31 Aug 2026** (owner, on a screenshot of the
// once-intermediate "Download Catalog" heading + "Download" button:
// "even this is redundant... you click Download Catalog, then you click
// Download, it doesn't make sense") — previously the known-lead branch
// still needed one manual button press inside the modal (removing the
// explanatory sentence, per the owner's immediately preceding request,
// wasn't enough on its own — the redundant SECOND click was the real
// complaint). Now: opening this modal with a known lead fires the
// submission immediately via the effect below, no click required at
// all — the visitor goes straight from tapping "Download Catalog" on
// the page to the "Thanks!" result. The manual button only reappears if
// that automatic attempt fails (a real network error), where a retry
// action is genuinely needed, not redundant.
//
// **`requireGate`, 31 Aug 2026** — owner-toggleable in Sanity (Site
// Settings → "Require details before download"), not hard-coded. `true`
// (the default) is everything described above, unchanged. `false`
// skips the gate entirely — no form, no known-lead auto-submit, no
// `/api/leads` call at all, straight to the result state on open. This
// is a genuine trade-off the owner is choosing, not a bug: turning the
// gate off means catalog downloads stop generating lead records: `Talk
// to KIBO` and its own lead capture are completely unaffected either
// way — this only touches the Catalog download's own gate.
export function DownloadCatalogModal({
  onClose,
  requireGate,
  pdfUrl,
}: {
  onClose: () => void;
  requireGate: boolean;
  pdfUrl: string | null;
}) {
  const knownLead = getStoredLead();
  // Lazy initializers, not mount effects — starting `submitted` true
  // when the gate is off means the very first render already shows the
  // result, no flash of a form/heading that's about to be skipped.
  // Starting `submitting` true for a known lead (gate ON) means the
  // very first render shows "Sending…" instead of the now-unused button
  // state before the effect below gets a chance to run. Both keep their
  // respective effects free of any synchronous `setState` call,
  // satisfying `react-hooks/set-state-in-effect` — see that effect's own
  // comment.
  const [submitted, setSubmitted] = useState(() => !requireGate);
  const [submitting, setSubmitting] = useState(() => requireGate && !!knownLead);
  const [error, setError] = useState<string | null>(null);

  // Pure request, no state — used by both the manual submit path
  // (`submitLead` below) and the auto-submit effect, so the effect never
  // needs to call a function that itself calls `setState` synchronously
  // (see that effect's own comment on why that distinction matters).
  const postLead = async (name: string, email: string) => {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source: "catalog_download", name, email }),
    });
    if (!res.ok) throw new Error("Request failed");
    storeLead({ name, email });
  };

  // Manual path — the plain gate form's submit, and the retry button
  // after a failed auto-submit. Called from event handlers, not an
  // effect, so setting `submitting`/`error` synchronously up front is
  // fine here (that's the normal, recommended pattern for a form submit
  // handler).
  const submitLead = async (name: string, email: string) => {
    setError(null);
    setSubmitting(true);
    try {
      await postLead(name, email);
      setSubmitted(true);
    } catch {
      setError("Something went wrong — please try again, or reach us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  // Auto-submit for a known lead — see file comment above. `submitting`
  // already starts `true` via the lazy initializer above, so this
  // effect's own body never calls `setState` synchronously itself; the
  // `setSubmitted`/`setError`/`setSubmitting` calls below all happen
  // inside the promise's `.then`/`.catch`/`.finally`, after the fetch
  // resolves — not during the effect's own synchronous execution.
  // Deliberately fire-once-on-mount: `knownLead` is a fresh object from
  // `getStoredLead()` on every render, so including it in the deps array
  // would re-run this on every render, not just mount.
  useEffect(() => {
    if (!requireGate || !knownLead) return;
    postLead(knownLead.name, knownLead.email)
      .then(() => setSubmitted(true))
      .catch(() => setError("Something went wrong — please try again, or reach us directly."))
      .finally(() => setSubmitting(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    submitLead(String(data.get("name") ?? ""), String(data.get("email") ?? ""));
  };

  const handleRetryClick = () => {
    if (knownLead) submitLead(knownLead.name, knownLead.email);
  };

  return (
    <Modal onClose={onClose} labelledBy="download-catalog-heading">
      {submitted ? (
        <div className="flex flex-col items-center gap-3 py-6 text-center">
          <h2 id="download-catalog-heading" className="text-h3 font-semibold text-charcoal">
            Thanks!
          </h2>
          {/* Honest placeholder copy when no PDF exists yet — see file
              comment on the `pdfUrl` prop. Real link once one's uploaded
              in Sanity. */}
          {pdfUrl ? (
            <a
              href={pdfUrl}
              download
              className="mt-2 rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray-deep active:bg-green-gray-deep"
            >
              Download PDF
            </a>
          ) : (
            <p className="max-w-xs text-support text-charcoal/60">
              Our catalog PDF is being finalized — we&apos;ll email it to you as soon
              as it&apos;s ready.
            </p>
          )}
        </div>
      ) : knownLead ? (
        // No button in the normal case, 31 Aug 2026 — see file comment
        // on the auto-submit effect above. `submitting` is true almost
        // immediately after mount (the effect fires on the very first
        // render), so in practice a visitor sees this heading for a
        // brief instant, then the "Thanks!" state, no click needed.
        // The button only appears if the automatic attempt actually
        // failed — a real retry action, not a redundant confirmation.
        <div className="flex flex-col items-center gap-4 py-2 text-center">
          <h2 id="download-catalog-heading" className="pr-8 text-h3 font-semibold text-charcoal">
            Download Catalog
          </h2>
          {error ? (
            <>
              <p className="text-support text-red-600">{error}</p>
              <button
                type="button"
                onClick={handleRetryClick}
                disabled={submitting}
                className="mt-2 rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray-deep active:bg-green-gray-deep disabled:opacity-60"
              >
                {submitting ? "Sending…" : "Try again"}
              </button>
            </>
          ) : (
            <p className="text-support text-charcoal/60">Sending…</p>
          )}
        </div>
      ) : (
        <>
          <h2 id="download-catalog-heading" className="pr-8 text-h3 font-semibold text-charcoal">
            Download Catalog
          </h2>
          <p className="mt-1.5 text-support text-charcoal/60">
            Enter your details to get the KIBO product catalog.
          </p>

          {/* Required-field asterisks, 31 Aug 2026 — see
              TalkToKiboModal.tsx's own comment for the full reasoning;
              both fields here happen to be required, so both get one. */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-support">
              <span className="font-medium text-charcoal">
                Name <span aria-hidden="true" className="text-sage-green">*</span>
              </span>
              <input
                type="text"
                name="name"
                required
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
                className="rounded-md border border-charcoal/15 bg-background px-3 py-2 text-charcoal outline-none focus:border-sage-green"
              />
            </label>

            {error && <p className="text-support text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-full bg-charcoal px-4 py-2 text-support font-semibold text-background transition-colors hover:bg-green-gray-deep active:bg-green-gray-deep disabled:opacity-60"
            >
              {submitting ? "Sending…" : "Download Catalog"}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
}
