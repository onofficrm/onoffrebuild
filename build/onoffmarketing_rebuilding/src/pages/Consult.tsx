import EnhancedConsultationSection from '../components/EnhancedConsultationSection';

export default function Consult() {
  return (
    <main className="pt-20 bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 border-b border-slate-800 relative py-12 lg:py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="inline-block px-3.5 py-1 bg-blue-900/80 text-yellow-400 text-xs font-extrabold rounded-full mb-4 border border-blue-700/60">
            ON/OFF MARKETING CONSULTING
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-4 tracking-tight">
            비즈니스 목적에 맞는 <br className="hidden sm:block" />
            <span className="text-yellow-400">맞춤형 마케팅 솔루션</span>을 제안합니다.
          </h1>
          <p className="text-base md:text-lg text-slate-300 font-medium max-w-2xl mx-auto">
            홈페이지 제작부터 SEO/AEO 노출, 트래픽, 포스팅, 독자 플랫폼 구축까지 <br className="hidden sm:block" />
            원하시는 항목을 선택하고 빠르게 1:1 상담을 받아보세요.
          </p>
        </div>
      </section>

      {/* Enhanced Consultation Component */}
      <EnhancedConsultationSection />
    </main>
  );
}

