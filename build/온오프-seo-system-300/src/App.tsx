import React from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TrustSection } from './components/TrustSection';
import { WhyAndRoadmapSection } from './components/WhyAndRoadmapSection';
import { SystemShowcaseSection } from './components/SystemShowcaseSection';
import { ClassMethodSection } from './components/ClassMethodSection';
import { ValueStackSection } from './components/ValueStackSection';
import { TargetAndFaqSection } from './components/TargetAndFaqSection';
import { FinalCtaSection } from './components/FinalCtaSection';
import { Footer } from './components/Footer';
import { StickyFloatingCta } from './components/StickyFloatingCta';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-sky-500 selection:text-white relative">
      {/* Top Header */}
      <Header />

      {/* Main Sections */}
      <main>
        {/* Step 1: HERO Section */}
        <HeroSection />

        {/* Step 2: 2018~ Practical Experience & 1:1 Coaching Trust Section */}
        <TrustSection />

        {/* Step 3: Why SEO SYSTEM 300 & 5-Step Connected Roadmap */}
        <WhyAndRoadmapSection />

        {/* Step 4: Real Working Systems & Lifelong Assets */}
        <SystemShowcaseSection />

        {/* Step 5: How The Class Works (1:1 Google Meet Education) */}
        <ClassMethodSection />

        {/* Step 6: Value Stack & 3,000,000 KRW Breakdown */}
        <ValueStackSection />

        {/* Step 7: Target Audience, Anti-Target, Case Process, & FAQ */}
        <TargetAndFaqSection />

        {/* Step 8: Final Conversion CTA */}
        <FinalCtaSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating Action Buttons (Desktop & Mobile) */}
      <StickyFloatingCta />
    </div>
  );
}
