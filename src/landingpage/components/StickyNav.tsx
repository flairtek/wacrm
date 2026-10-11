"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { BUSINESS_DETAILS } from "../constants";

export const StickyNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { mode, toggleMode } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="#hero" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/landingpage/logo_small.png"
              alt="Flairtek Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="#features" className="transition hover:text-primary">
            Features
          </Link>
          <Link href="#benefits" className="transition hover:text-primary">
            Benefits
          </Link>
          <Link href="#how-it-works" className="transition hover:text-primary">
            How It Works
          </Link>
          <Link href="#ai-automation" className="transition hover:text-primary">
            AI Automation
          </Link>
          <Link href="#special-offer" className="transition hover:text-primary">
            Special Offer
          </Link>
          <Link href="#contact" className="transition hover:text-primary">
            Contact
          </Link>
        </nav>

        {/* Action Button & Theme Switcher */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleMode}
            type="button"
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            {mounted && mode === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
          <a
            href={BUSINESS_DETAILS.loginUrl}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Access Live Demo
          </a>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleMode}
            type="button"
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background p-2 text-muted-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            {mounted && mode === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={toggleMenu}
            aria-label="Toggle Menu"
            className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden border-b border-border bg-background px-4 pt-2 pb-4 space-y-1 sm:px-3">
          <Link
            href="#features"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            Features
          </Link>
          <Link
            href="#benefits"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            Benefits
          </Link>
          <Link
            href="#how-it-works"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            How It Works
          </Link>
          <Link
            href="#ai-automation"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            AI Automation
          </Link>
          <Link
            href="#special-offer"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            Special Offer
          </Link>
          <Link
            href="#contact"
            onClick={toggleMenu}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-accent"
          >
            Contact
          </Link>
          <div className="pt-2">
            <a
              href={BUSINESS_DETAILS.loginUrl}
              className="w-full flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-4 py-2"
            >
              Access Live Demo
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
