"use client";

import React, { useState, useEffect } from "react";
import { BUSINESS_DETAILS } from "../constants";

export const SpecialOfferPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only trigger if not already dismissed in this session
    const hasDismissed = sessionStorage.getItem("warcm_offer_dismissed");
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 8000); // 8 second delay
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("warcm_offer_dismissed", "true");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="offer-popup-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6 overflow-hidden">
        <button
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-4">
          <span className="inline-block rounded-full bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1">
            Special Offer
          </span>
          <h3 id="offer-popup-title" className="text-xl font-bold tracking-tight text-foreground">
            Ready to Improve Your WhatsApp Lead Management?
          </h3>
          <p className="text-sm text-muted-foreground">
            Explore Flairtek WhatsApp CRM and ask our team about the current special offer.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <a
              href="#demo-form"
              onClick={handleClose}
              className="inline-flex flex-1 items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 transition-all"
            >
              Request Special Offer
            </a>
            <a
              href={BUSINESS_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex flex-1 items-center justify-center rounded-lg text-sm font-semibold border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-4 transition-all"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
