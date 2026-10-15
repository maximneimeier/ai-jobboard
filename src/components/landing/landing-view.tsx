"use client";

import { DashboardPreview } from "./dashboard-preview";
import { FeatureCards } from "./feature-cards";
import { FinalCta } from "./final-cta";
import { HowItWorks } from "./how-it-works";
import { JobSearch } from "./job-search";
import { LandingFooter } from "./landing-footer";
import { LandingNav } from "./landing-nav";
import { PersonalizationPreview } from "./personalization-preview";
import { PricingSection } from "./pricing-section";

export function LandingView() {
  return (
    <div id="top" className="flex min-h-full flex-col bg-canvas">
      <LandingNav />
      <main>
        <section className="hero-wash">
          <div className="mx-auto max-w-[860px] px-5 pt-16 pb-20 text-center md:pt-24 md:pb-28">
            <p className="rise inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-[13px] font-medium text-accent">
              <span aria-hidden>✦</span> Your AI Career Copilot
            </p>
            <h1 className="rise rise-delay-1 font-display mx-auto mt-6 max-w-[16ch] text-[40px] leading-[1.05] font-semibold tracking-[-0.04em] text-ink sm:text-[56px] lg:text-[64px]">
              Find a job that{" "}
              <span className="text-accent">actually fits</span> you.
            </h1>
            <p className="rise rise-delay-2 mx-auto mt-5 max-w-[46ch] text-[17px] leading-7 text-body">
              Create your profile once. We match you to roles based on your
              experience — not just keywords.
            </p>
            <div className="rise rise-delay-3 mt-10">
              <JobSearch />
            </div>
          </div>
        </section>
        <DashboardPreview />
        <HowItWorks />
        <FeatureCards />
        <PersonalizationPreview />
        <PricingSection />
        <FinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
