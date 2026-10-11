import React from "react";
import Link from "next/link";
import { BUSINESS_DETAILS } from "../constants";

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-background border-t border-border py-12">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link href="#hero" className="inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/landingpage/logo_small.png"
                alt="Flairtek Logo"
                className="h-9 w-auto object-contain"
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              Empowering sales and support teams to drive maximum business impact on WhatsApp.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#features" className="hover:text-primary transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#ai-automation" className="hover:text-primary transition-colors">
                  AI Agents
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <a href={BUSINESS_DETAILS.loginUrl} className="hover:text-primary transition-colors">
                  Live Demo Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                Email:{" "}
                <a href={`mailto:${BUSINESS_DETAILS.email}`} className="hover:text-primary transition-colors">
                  {BUSINESS_DETAILS.email}
                </a>
              </li>
              <li>
                Phone:{" "}
                <a href={`tel:${BUSINESS_DETAILS.phone.replace(/[^0-9+]/g, "")}`} className="hover:text-primary transition-colors">
                  {BUSINESS_DETAILS.phone}
                </a>
              </li>
              <li>
                Website:{" "}
                <a href={BUSINESS_DETAILS.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                  {BUSINESS_DETAILS.website.replace("https://", "")}
                </a>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Get Started</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Speak with a product specialist or access the preview platform directly.
            </p>
            <a
              href={BUSINESS_DETAILS.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 text-xs font-semibold"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {BUSINESS_DETAILS.brand}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href={BUSINESS_DETAILS.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
              Official Website
            </a>
            <a href={BUSINESS_DETAILS.loginUrl} className="hover:underline">
              WARCM Portal
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
