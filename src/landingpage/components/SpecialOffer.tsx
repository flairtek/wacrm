import React from "react";
import { BUSINESS_DETAILS } from "../constants";

export const SpecialOffer: React.FC = () => {
  const whatsappUrl = `${BUSINESS_DETAILS.whatsappUrl}?text=${encodeURIComponent(
    "Hello Flairtek, I would like to request the special offer for Flairtek WhatsApp CRM."
  )}`;

  return (
    <section id="special-offer" className="py-20 bg-background border-y border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-sm font-semibold tracking-wider text-primary uppercase">Exclusive Opportunity</span>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Get a Special Offer on Flairtek WhatsApp CRM
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Discover how Flairtek WhatsApp CRM can help your business manage enquiries, organize leads, and improve customer follow-ups.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="#demo-form"
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-6 transition-all"
            >
              Request Special Offer
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-6 transition-all"
            >
              WhatsApp Our Team
            </a>
            <a
              href={BUSINESS_DETAILS.loginUrl}
              className="inline-flex items-center justify-center rounded-lg text-sm font-semibold border border-border bg-card shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-6 transition-all"
            >
              Access Live Demo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
