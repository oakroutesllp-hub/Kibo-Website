"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { DownloadCatalogModal } from "@/components/DownloadCatalogModal";

// Site-wide "Download Catalog" modal — mirrors TalkToKiboProvider.tsx
// exactly (same shared open/close context pattern), added 30 Aug 2026 as
// part of the Catalog page build. Needs to be reachable from more than
// just the Catalog page itself: TalkToKiboModal's own thank-you state
// offers a "Download the catalog" button after a successful enquiry
// (owner spec), and that button can be tapped from ANY page Talk to KIBO
// was opened from, not just `/catalog` — so this needs the same
// site-wide provider treatment, not page-local state.
type DownloadCatalogContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const DownloadCatalogContext = createContext<DownloadCatalogContextValue | null>(null);

export function useDownloadCatalog() {
  const ctx = useContext(DownloadCatalogContext);
  if (!ctx) {
    throw new Error("useDownloadCatalog must be used within <DownloadCatalogProvider>");
  }
  return ctx;
}

// `requireGate` — owner-toggleable via Sanity Site Settings
// ("Require details before download (Catalog)"), 31 Aug 2026. Passed
// down from `(site)/layout.tsx` (which already fetches
// `getSiteSettings()` for Footer) straight through to the modal it
// renders — not part of the context value itself, since no consumer of
// `useDownloadCatalog()` needs to read it, only this provider needs to
// hand it to the one component that cares.
export function DownloadCatalogProvider({
  children,
  requireGate,
}: {
  children: ReactNode;
  requireGate: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <DownloadCatalogContext.Provider value={value}>
      {children}
      {isOpen && <DownloadCatalogModal onClose={close} requireGate={requireGate} />}
    </DownloadCatalogContext.Provider>
  );
}
