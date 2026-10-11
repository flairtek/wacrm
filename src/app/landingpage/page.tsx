import type { Metadata } from "next";
import { StickyNav } from "@/landingpage/components/StickyNav";
import { Hero } from "@/landingpage/components/Hero";
import { Features } from "@/landingpage/components/Features";
import { HowItWorks } from "@/landingpage/components/HowItWorks";
import { AIAutomation } from "@/landingpage/components/AIAutomation";
import { SpecialOffer } from "@/landingpage/components/SpecialOffer";
import { DemoForm } from "@/landingpage/components/DemoForm";
import { Footer } from "@/landingpage/components/Footer";
import { FloatingWhatsApp } from "@/landingpage/components/FloatingWhatsApp";
import { SpecialOfferPopup } from "@/landingpage/components/SpecialOfferPopup";

export const metadata: Metadata = {
  title: "Flairtek WARCM — Modern WhatsApp CRM for Sales & Growth",
  description:
    "Turn WhatsApp conversations into paying customers. Centralized inbox, lead pipelines, broadcasting, AI agents, and workflow automations tailored for modern teams.",
  alternates: {
    canonical: "https://warcm.flairtek.com/landingpage/",
  },
  openGraph: {
    title: "Flairtek WARCM — WhatsApp CRM for Sales & Growth",
    description:
      "Turn WhatsApp conversations into paying customers. Centralized inbox, lead pipelines, broadcasting, AI agents, and workflow automations tailored for modern teams.",
    url: "https://warcm.flairtek.com/landingpage/",
    siteName: "Flairtek WARCM",
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground scroll-smooth">
      <StickyNav />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
        <AIAutomation />
        <SpecialOffer />
        <DemoForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <SpecialOfferPopup />
    </div>
  );
}
