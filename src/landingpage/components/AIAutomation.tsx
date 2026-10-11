import React from "react";
import { BUSINESS_DETAILS } from "../constants";

export const AIAutomation: React.FC = () => {
  return (
    <section id="ai-automation" className="py-20 bg-muted/40 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-sm font-semibold text-purple-600 dark:text-purple-400 mb-6">
              Next-Gen Conversational Intelligence
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
              Intelligent AI Agents & Interactive Flows
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Leverage autonomous intelligence to deliver instantaneous answers, qualify incoming prospects, and seamlessly pass complex deals to human reps.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2 text-primary mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">AI-Powered Rapid Responses</h4>
                  <p className="text-sm text-muted-foreground mt-1">Generate dynamic contextual replies using your business knowledge base.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2 text-primary mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Lead Qualification</h4>
                  <p className="text-sm text-muted-foreground mt-1">Automatically capture intent, budget, and requirements before assigning to your team.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-primary/10 p-2 text-primary mt-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Interactive Chat Flows</h4>
                  <p className="text-sm text-muted-foreground mt-1">Design visual branching flows that guide users with buttons, lists, and structured prompts.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Sample AI Flow</h3>
            <div className="space-y-4 text-sm">
              <div className="bg-muted p-3 rounded-lg max-w-[85%]">
                <span className="font-semibold block text-xs mb-1 text-primary">Inbound Lead</span>
                Hi, do you offer integration with custom billing systems?
              </div>
              <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg max-w-[85%] ml-auto">
                <span className="font-semibold block text-xs mb-1 text-primary">AI Agent</span>
                Yes, Flairtek WARCM includes full webhooks and API support to seamlessly connect with billing and payment systems! Would you like a demo?
              </div>
              <div className="flex justify-center my-2">
                <span className="text-xs bg-muted/60 text-muted-foreground px-2 py-1 rounded-full border border-border">AI tagged lead: High Priority</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
