import { Globe, Search, BarChart3, Edit3, Bot, Network, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    icon: <Globe className="w-7 h-7 text-blue-600" />,
    badge: '제작 & 기획',
    title: '홈페이지 제작',
    desc: 'SEO/AEO 최적화와 고객 설득 동선을 결합한 온오프빌더 맞춤 고전환 웹사이트 제작',
    link: '/request',
    btnText: '제작 상세 보기'
  },
  {
    icon: <Search className="w-7 h-7 text-indigo-600" />,
    badge: '검색 노출',
    title: 'SEO/AEO 최적화',
    desc: '네이버, 구글 검색 상위 노출과 ChatGPT, Perplexity 등 AI 답변 엔진 추천 구조화 세팅',
    link: '/seo-aeo',
    btnText: 'SEO/AEO 서비스 보기'
  },
  {
    icon: <BarChart3 className="w-7 h-7 text-emerald-600" />,
    badge: '유입 증대',
    title: '트래픽 서비스',
    desc: '타겟 고객 키워드 기반 유기적 방문 유입 증대 및 세션/체류시간 관리 솔루션',
    link: '/traffic',
    btnText: '트래픽 정보 보기'
  },
  {
    icon: <Edit3 className="w-7 h-7 text-amber-600" />,
    badge: '콘텐츠 바이럴',
    title: '블로그 & 카페 포스팅',
    desc: '검색 알고리즘을 뚫는 업종별 맞춤 원고 작성 및 네이버 블로그/카페 포스팅 실행 대행',
    link: '/blog',
    btnText: '포스팅 대행 보기'
  },
  {
    icon: <Bot className="w-7 h-7 text-purple-600" />,
    badge: '시스템 자동화',
    title: '마케팅 자동화',
    desc: 'iCRM 고객 관리, 24시간 채팅자동화, 애드센스 수익 웹사이트 자동화 시스템 구축',
    link: '/platform',
    btnText: '자동화 솔루션'
  },
  {
    icon: <Network className="w-7 h-7 text-rose-600" />,
    badge: '제휴 플랫폼',
    title: '온오프CPA 플랫폼',
    desc: '광고주와 마케터 파트너를 직접 연결하여 유효 리드 수집과 정산까지 다이렉트 처리',
    externalUrl: 'https://onoffcpa.icrm.co.kr/',
    btnText: '온오프CPA 이동'
  }
];

export default function CoreServicesSummary() {
  return (
    <section className="py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100/80 text-blue-900 text-xs sm:text-sm font-extrabold mb-4 border border-blue-200">
            실행형 디지털 마케팅 스택
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            "온오프마케팅은 <span className="text-blue-700 underline decoration-yellow-400 decoration-4 underline-offset-4">홈페이지만 만드는 곳</span>이 아닙니다"
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            홈페이지 제작부터 SEO/AEO, 콘텐츠 바이럴, 트래픽 운영, 마케팅 자동화, CPA 플랫폼까지<br className="hidden sm:block" />
            고객 유입과 실질 문의 전환에 필요한 모든 마케팅 실행 서비스를 한눈에 제공합니다.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-0 group-hover:bg-blue-50/60 transition-colors"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-bold rounded-full border border-slate-200">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-800 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium">
                  {item.desc}
                </p>
              </div>

              <div className="relative z-10 pt-4 border-t border-slate-100">
                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center font-bold text-sm text-blue-700 hover:text-blue-900 group-hover:translate-x-1 transition-all"
                  >
                    {item.btnText}
                    <ArrowRight size={16} className="ml-1.5" />
                  </a>
                ) : (
                  <Link
                    to={item.link!}
                    className="inline-flex items-center font-bold text-sm text-blue-700 hover:text-blue-900 group-hover:translate-x-1 transition-all"
                  >
                    {item.btnText}
                    <ArrowRight size={16} className="ml-1.5" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
