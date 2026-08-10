import HeroSection from '../components/HeroSection';
import CoreServicesSummary from '../components/CoreServicesSummary';
import ProblemSolutionSection from '../components/ProblemSolutionSection';
import RealResultsAndCasesSection from '../components/RealResultsAndCasesSection';
import OnoffCpaSection from '../components/OnoffCpaSection';
import AutomationFlowSection from '../components/AutomationFlowSection';
import CasesShowcaseSection from '../components/CasesShowcaseSection';
import FreeCoursesPromoSection from '../components/FreeCoursesPromoSection';
import TargetAudienceSection from '../components/TargetAudienceSection';
import ContactSection from '../components/ContactSection';
import EnhancedConsultationSection from '../components/EnhancedConsultationSection';
import FinalConsultationCTA from '../components/FinalConsultationCTA';

export default function Home() {
  return (
    <main>
      {/* Hero Visual */}
      <HeroSection />

      {/* 1. 핵심 서비스 요약 섹션 */}
      <CoreServicesSummary />

      {/* 2. 문제-해결 섹션 */}
      <ProblemSolutionSection />

      {/* 3. 실제 성과와 사례 섹션 (실제 운영과 실행 경험을 바탕으로 합니다) */}
      <RealResultsAndCasesSection />

      {/* 4. 온오프CPA 핵심 플랫폼 소개 섹션 */}
      <OnoffCpaSection />

      {/* 5. 플랫폼 / 자동화 파이프라인 연결 섹션 */}
      <AutomationFlowSection />

      {/* 6. 실전 포트폴리오 & 업종별 샘플 사례 섹션 */}
      <CasesShowcaseSection />

      {/* 7. 무료 온라인 강의 유도 섹션 */}
      <FreeCoursesPromoSection />

      {/* 8. 신뢰 요소 / 적합한 대상 고객 섹션 */}
      <TargetAudienceSection />

      {/* Interactive AI Diagnostic Section */}
      <ContactSection />

      {/* 9. 목적별 맞춤 1:1 무료 상담 신청 폼 섹션 */}
      <EnhancedConsultationSection />

      {/* 10. 최종 선택형 상담 CTA 섹션 */}
      <FinalConsultationCTA />
    </main>
  );
}

