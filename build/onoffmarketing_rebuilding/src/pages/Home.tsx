import HeroSection from '../components/HeroSection';
import HomeConcernsSection from '../components/HomeConcernsSection';
import HomeHelpChoiceSection from '../components/HomeHelpChoiceSection';
import HomeSeoProcessSection from '../components/HomeSeoProcessSection';
import OnoffSeoSystemHomeSection from '../components/OnoffSeoSystemHomeSection';
import CasesShowcaseSection from '../components/CasesShowcaseSection';
import HomeSeoSystem300Section from '../components/HomeSeoSystem300Section';
import FinalConsultationCTA from '../components/FinalConsultationCTA';

/*
 * Simplified Home (rollback: re-enable imports below)
 * CoreServicesSummary, ProblemSolutionSection, RealResultsAndCasesSection,
 * OnoffCpaSection, AutomationFlowSection, FreeCoursesPromoSection,
 * TargetAudienceSection, ContactSection, EnhancedConsultationSection
 */

export default function Home() {
  return (
    <main>
      {/* 01 HERO */}
      <HeroSection />

      {/* 02 고객의 고민 */}
      <HomeConcernsSection />

      {/* 03 어떤 도움이 필요한가 */}
      <HomeHelpChoiceSection />

      {/* 04 SEO 진행 과정 */}
      <HomeSeoProcessSection />

      {/* 05 ONOFF SEO SYSTEM */}
      <OnoffSeoSystemHomeSection />

      {/* 06 실제 사례 */}
      <CasesShowcaseSection />

      {/* 07 SEO System 300 */}
      <HomeSeoSystem300Section />

      {/* 08 Final CTA */}
      <FinalConsultationCTA />
    </main>
  );
}
