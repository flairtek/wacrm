import React from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  items: string[];
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, items }) => (
  <div className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
    <h3 className="text-xl font-bold tracking-tight text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    <ul className="mt-4 space-y-2 border-t border-border pt-4 text-sm text-muted-foreground">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
            Built for Modern Business Communication
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Everything your team needs to capture leads, hold engaging conversations, and close deals faster on WhatsApp.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            title="WhatsApp CRM"
            description="Manage conversations and organize contacts with full historical context."
            icon="crm"
            items={[
              "Centralized customer conversations",
              "Contact management & context",
              "Complete conversation history",
              "Quick notes and lead detail tracking",
            ]}
          />
          <FeatureCard
            title="Shared Inbox"
            description="Enable seamless team collaboration across incoming WhatsApp requests."
            icon="inbox"
            items={[
              "Multi-agent conversation routing",
              "Assignment to sales/support reps",
              "Real-time notifications & updates",
              "Rich media sharing and templates",
            ]}
          />
          <FeatureCard
            title="Contact & Lead Management"
            description="Structure prospects and monitor customer lifecycles effectively."
            icon="contacts"
            items={[
              "Rich contact profiles & tags",
              "Segmentation for targeted campaigns",
              "Lifecycle stage management",
              "Custom fields and interaction logs",
            ]}
          />
          <FeatureCard
            title="Broadcasts & Campaigns"
            description="Scale outreach without losing personal connection."
            icon="broadcasts"
            items={[
              "Audience targeting & segmentation",
              "Meta-approved template messaging",
              "Campaign performance metrics",
              "Automated schedule and delivery",
            ]}
          />
          <FeatureCard
            title="Sales Pipelines"
            description="Visualize your sales pipeline and track deal progression effortlessly."
            icon="pipelines"
            items={[
              "Kanban-style visual deal tracking",
              "Custom sales stages per workflow",
              "Visibility into potential revenue",
              "Follow-up scheduling & reminders",
            ]}
          />
          <FeatureCard
            title="Workflow Automation"
            description="Automate repetitive communication and customer operations."
            icon="automation"
            items={[
              "Trigger-action based workflow rules",
              "Auto-responders and drip messages",
              "Lead status transitions",
              "Time-saving template dispatch",
            ]}
          />
        </div>
      </div>
    </section>
  );
};
