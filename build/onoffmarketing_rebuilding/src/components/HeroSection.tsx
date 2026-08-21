import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SERVICE_URLS } from './seo-system/data/servicesData';

const flow = ['사이트', '콘텐츠', '백링크', '방문자', '검색 결과'];

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative pt-28 pb-16 sm:pt-36 sm:pb-24 lg:pt-44 lg:pb-28 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-slate-50 to-white" />
      <div className="absolute top-24 right-[-10%] w-[420px] h-[420px] bg-blue-200/30 rounded-full blur-[100px]" />
      <div className="absolute bottom-0 left-[-5%] w-[320px] h-[320px] bg-cyan-100/40 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-extrabold text-blue-800 tracking-wide mb-5">온오프마케팅</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-5">
            검색에서 고객을 만나는
            <br />
            방법을 만듭니다.
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium mb-8 max-w-2xl mx-auto">
            홈페이지 제작부터 콘텐츠, 백링크, 트래픽까지
            <br className="hidden sm:block" />
            검색 노출에 필요한 작업을 하나의 전략으로 연결합니다.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-12">
            <button
              type="button"
              onClick={() => navigate('/consult')}
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-blue-900 text-white text-base font-extrabold hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition-colors"
            >
              SEO 상담받기
              <ArrowRight className="w-5 h-5" />
            </button>
            <a
              href={SERVICE_URLS.seoSystem300}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white border border-slate-200 text-slate-800 text-base font-extrabold hover:border-blue-200 hover:bg-slate-50 transition-colors"
            >
              직접 SEO 배우기
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Plain-language flow */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-sm font-extrabold text-slate-700">
            {flow.map((label, i) => (
              <span key={label} className="inline-flex items-center gap-2 sm:gap-3">
                <span className="px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm">{label}</span>
                {i < flow.length - 1 ? (
                  <span className="text-slate-300" aria-hidden>
                    →
                  </span>
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
