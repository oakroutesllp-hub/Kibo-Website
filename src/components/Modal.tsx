"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

// Generic overlay/modal — first used for the Products grid's spec-expand
// (KIBO_Brand_and_Copy_Direction.md, "Card interaction," corrected 26 Aug
// 2026: overlay/modal, not an in-grid accordion, which caused a real
// layout bug — expanding one card stretched its whole grid row, leaving
// blank space under still-collapsed sibling cards). Deliberately generic
// so it can be reused for the persistent "Talk to KIBO" CTA's
// enquiry-form modal when that's built (not yet — see PROJECT-SUMMARY.md).
//
// Portal to document.body so it always sits above page content
// regardless of where it's mounted in the tree; body scroll is locked
// while open; Escape and backdrop click both close it.
export function Modal({
  onClose,
  labelledBy,
  children,
}: {
  onClose: () => void;
  labelledBy: string;
  children: ReactNode;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[85vh] w-full max-w-md overflow-y-auto rounded-lg bg-background p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-charcoal/50 transition-colors hover:bg-charcoal/8 hover:text-charcoal"
        >
          <span aria-hidden="true" className="text-h4 leading-none">
            ✕
          </span>
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
