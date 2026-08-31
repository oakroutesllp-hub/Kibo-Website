"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { TalkToKiboModal } from "@/components/TalkToKiboModal";

// Site-wide "Talk to KIBO" enquiry modal — shared open/close state so
// every CTA that should open it (the secondary nudge on Products, and
// later the persistent nav/sticky-bar CTA per
// KIBO_Brand_and_Copy_Direction.md's "Persistent CTA") all trigger the
// exact same modal instance rather than each wiring up its own copy.
//
// Built 27 Aug 2026 as part of the Products page's secondary CTA nudge
// — the nudge's own spec explicitly requires it to "open the same
// 'Talk to KIBO' modal/overlay Enquiry form used by the persistent CTA
// elsewhere on the site (not a separate flow)," but the persistent CTA
// and its modal don't exist in the codebase yet (confirmed: no
// createContext/useContext usage anywhere before this file, and
// Modal.tsx's own comment says it was "deliberately generic so it can
// be reused for the persistent 'Talk to KIBO' CTA's enquiry-form modal
// when that's built (not yet)"). Rather than build a second, throwaway
// modal just for the nudge and a real one later for the persistent CTA
// — which would BE "a separate flow," the exact thing the spec rules
// out — this builds the shared trigger now so the persistent CTA (once
// built) is a one-line `useTalkToKibo().open()` away from reusing it.
//
// Provider mounted in `(site)/layout.tsx` so `useTalkToKibo()` is
// callable from any page/component in the site, not just Products.
type TalkToKiboContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const TalkToKiboContext = createContext<TalkToKiboContextValue | null>(null);

export function useTalkToKibo() {
  const ctx = useContext(TalkToKiboContext);
  if (!ctx) {
    throw new Error("useTalkToKibo must be used within <TalkToKiboProvider>");
  }
  return ctx;
}

export function TalkToKiboProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const value = useMemo(() => ({ isOpen, open, close }), [isOpen, open, close]);

  return (
    <TalkToKiboContext.Provider value={value}>
      {children}
      {isOpen && <TalkToKiboModal onClose={close} />}
    </TalkToKiboContext.Provider>
  );
}
