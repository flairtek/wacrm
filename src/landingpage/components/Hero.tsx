import React from "react";
import { BUSINESS_DETAILS } from "../constants";

export const Hero: React.FC = () => {
  const whatsappUrl = `${BUSINESS_DETAILS.whatsappUrl}?text=${encodeURIComponent(
    BUSINESS_DETAILS.prefilledWhatsAppMessage
  )}`;

  return (
    <section id="hero" className="relative overflow-hidden py-20 md:py-32 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Copy */}
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6 w-fit mx-auto lg:mx-0">
              Transform Your Customer Outreach
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-foreground">
              Turn WhatsApp Conversations Into{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Customers.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Manage customer conversations, organize leads, streamline sales follow-ups,
              and explore AI-powered business automation with Flairtek WhatsApp CRM.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href={BUSINESS_DETAILS.loginUrl}
                className="inline-flex items-center justify-center rounded-lg text-sm font-semibold bg-primary text-primary-foreground shadow hover:bg-primary/90 h-11 px-6 transition-all"
              >
                Access Live Demo
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg text-sm font-semibold border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-11 px-6 transition-all"
              >
                Chat With Us on WhatsApp
              </a>
            </div>
          </div>

          {/* Interface Mockup */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="relative rounded-2xl border border-border bg-card p-4 shadow-2xl backdrop-blur">
              <div className="flex items-center gap-2 border-b border-border pb-3 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500/80"></div>
                <div className="h-3 w-3 rounded-full bg-green-500/80"></div>
                <span className="text-xs text-muted-foreground ml-2">WARCM Workspace Preview</span>
              </div>
              <div className="grid grid-cols-3 gap-2 h-64 sm:h-80">
                {/* Mock sidebar */}
                <div className="col-span-1 border-r border-border pr-2 space-y-2">
                  <div className="h-8 rounded bg-muted/60 animate-pulse"></div>
                  <div className="h-6 rounded bg-muted/40"></div>
                  <div className="h-6 rounded bg-muted/40"></div>
                  <div className="h-6 rounded bg-muted/40"></div>
                </div>
                {/* Mock chat area */}
                <div className="col-span-2 flex flex-col justify-between pl-2">
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500/20 flex-shrink-0"></div>
                      <div className="rounded-lg bg-muted p-2 text-xs max-w-[80%]">
                        Hello! Can I get more details about your enterprise services?
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <div className="rounded-lg bg-primary text-primary-foreground p-2 text-xs max-w-[80%]">
                        Certainly! Let me share our brochure and automated setup details with you right away.
                      </div>
                    </div>
                  </div>
                  <div className="h-10 border border-border rounded-md bg-background flex items-center px-3 text-xs text-muted-foreground">
                    Type a message or trigger an AI Agent...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
