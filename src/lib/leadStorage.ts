"use client";

// Cross-form "already known" recognition, 30 Aug 2026 — owner spec:
// "store a browser-local flag when either form is successfully
// submitted... on a later visit from the same browser, skip re-showing
// a gate/field already filled." Deliberately `localStorage`, not a
// login/account system or cross-device sync — explicitly out of scope
// per the same spec ("don't build cross-device recognition... no magic
// links, no login/account system"). This only ever recognizes the SAME
// browser that submitted before.
//
// Shared by both TalkToKiboModal.tsx (source: "enquiry") and
// DownloadCatalogModal.tsx (source: "catalog_download") — whichever form
// is submitted first writes here; the other reads it to pre-fill/skip
// fields it would otherwise ask for again.
const STORAGE_KEY = "kibo-lead-info";

export type StoredLead = {
  name: string;
  email: string;
  phone?: string;
  productInterest?: string;
};

// Wrapped in try/catch throughout — localStorage can throw (private
// browsing modes, disabled storage, storage quota) and this is a
// convenience feature, not a critical path; every caller should degrade
// to "nothing known yet" rather than crash the form.
export function getStoredLead(): StoredLead | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.name === "string" && typeof parsed?.email === "string") {
      return parsed as StoredLead;
    }
    return null;
  } catch {
    return null;
  }
}

// Merges with whatever's already stored rather than overwriting outright
// — e.g. if Talk to KIBO already recorded name/email/phone/productInterest,
// a later Download Catalog submission (name + email only) shouldn't erase
// the phone/productInterest that were learned earlier.
export function storeLead(lead: StoredLead): void {
  try {
    const existing = getStoredLead();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...lead }));
  } catch {
    // Storage unavailable — the site still works, it just won't
    // remember this visitor next time.
  }
}
