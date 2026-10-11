import React from "react";

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      step: "01",
      title: "Connect WhatsApp Account",
      desc: "Easily integrate your supported WhatsApp Business API account securely in a few simple clicks.",
    },
    {
      step: "02",
      title: "Manage in One Workspace",
      desc: "Unify chats, teams, contact histories, and pipeline visibility inside a modern shared dashboard.",
    },
    {
      step: "03",
      title: "Automate Customer Workflows",
      desc: "Deploy custom conversational rules, auto-replies, and AI triggers to streamline responses 24/7.",
    },
    {
      step: "04",
      title: "Track Leads & Drive Growth",
      desc: "Move prospects through your sales pipeline, assign owners, and scale personalized outbound reach.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A frictionless path to turn daily messaging into structured, measurable sales performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-start p-6 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors"
            >
              <span className="text-4xl font-extrabold text-primary/20 mb-4">{item.step}</span>
              <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
