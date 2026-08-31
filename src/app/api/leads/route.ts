import { NextResponse } from "next/server";

// Generic lead-capture backend, 30 Aug 2026 — supersedes the previous
// `/api/enquiry` route (deleted), which sent "Talk to KIBO" submissions
// via Resend directly to an email inbox. Superseded per an explicit
// owner architecture decision (Zapier vs. Google Apps Script pricing
// comparison, done outside this codebase): free-tier Zapier caps at 100
// tasks/month and one action per Zap, so a genuinely free, uncapped path
// was preferred — a single webhook this route forwards every submission
// to, with a Google Apps Script Web App on the other end writing rows
// into a Google Sheet. Provider-agnostic by construction: this route
// (and every form that calls it) has no idea what's listening at
// `LEADS_WEBHOOK_URL` — repointing that one env var at a CRM later needs
// no code change here.
//
// Both "Talk to KIBO" (TalkToKiboModal.tsx) and "Download Catalog"
// (DownloadCatalogModal.tsx) POST here now, distinguished by `source`
// ("enquiry" / "catalog_download") — one endpoint, one webhook
// destination, per the owner's explicit spec ("Both forms should POST
// to a single webhook URL").
//
// **Not live until `LEADS_WEBHOOK_URL` is set** (see
// `.env.local.example`) — same honest-degraded-mode pattern the old
// `/api/enquiry` route used: without it, the visitor still sees success,
// but the submission is only logged to the server console, not sent
// anywhere a person will see it.
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { source, name, email, phone, productInterest } = (body ?? {}) as Record<
    string,
    unknown
  >;

  if (
    (source !== "enquiry" && source !== "catalog_download") ||
    typeof name !== "string" ||
    !name.trim() ||
    typeof email !== "string" ||
    !email.trim()
  ) {
    return NextResponse.json(
      { error: "A valid source, name, and email are required." },
      { status: 400 },
    );
  }

  // Phone and product interest are only meaningful for the enquiry form
  // — the catalog-download gate deliberately asks for name + email only
  // (owner spec: "no phone"). Sent through as-is (empty string if
  // absent) rather than omitted, so the sheet/CRM on the other end of
  // the webhook always sees the same column shape regardless of source.
  const payload = {
    timestamp: new Date().toISOString(),
    source,
    name,
    email,
    phone: typeof phone === "string" ? phone : "",
    productInterest: typeof productInterest === "string" ? productInterest : "",
  };

  const webhookUrl = process.env.LEADS_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn(
      "[leads] LEADS_WEBHOOK_URL is not configured — lead NOT forwarded anywhere, logging only:",
      payload,
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error(
        `[leads] Webhook responded with ${res.status} ${res.statusText} for`,
        payload,
      );
      return NextResponse.json({ error: "Failed to record lead." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, delivered: true });
  } catch (err) {
    console.error("[leads] Unexpected error forwarding to webhook:", err);
    return NextResponse.json({ error: "Failed to record lead." }, { status: 500 });
  }
}
