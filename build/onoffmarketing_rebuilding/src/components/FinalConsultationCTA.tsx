import { MessageSquare, Globe, Search, BarChart3, Cpu, Network, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const ctaOptions = [
  {
    icon: <Globe className="w-5 h-5 text-blue-600" />,
    label: '홈페이지 제작 상담',
    desc: 'SEO/AEO 최적화 & 고전환 UI/UX 웹사이트 기획',
    type: 'request',
    link: '/request'
  },
  {
    icon: <Search className="w-5 h-5 text-indigo-600" />,
    label: 'SEO / AEO 진단 상담',
    desc: '네이버·구글 1페이지 상위 노출 & AI 검색 답변 세팅',
    type: 'seo',
    link: '/consult'
  },
  {
    icon: <BarChart3 className="w-5 h-5 text-amber-600" />,
    label: '트래픽 / 포스팅 문의',
    desc: '실시간 타겟 유입 및 블로그·카페 포스팅 대행',
    type: 'traffic',
    link: '/blog'
  },
  {
    icon: <Cpu className="w-5 h-5 text-purple-600" />,
    label: '플랫폼 제작 상담',
    desc: 'iCRM, 채팅자동화, 애드센스 맞춤 플랫폼 구축',
    type: 'platform',
    link: '/platform'
  },
  {
    icon: <Network className="w-5 h-5 text-rose-600" />,
    label: '온오프CPA 제휴 문의',
    desc: '광고주 리드 수집 & 제휴 파트너십 가입',
    type: 'cpa',
    externalUrl: 'https://onoffcpa.icrm.co.kr/'
  }
];

export default function FinalConsultationCTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white relative overflow-hidden" id="final-cta-section">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/80 text-yellow-400 text-xs sm:text-sm font-extrabold mb-4 border border-blue-700/60 shadow-inner">
            <Sparkles size={16} className="mr-2" />
            1:1 맞춤형 마케팅 무료 컨설팅
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6">
            "어떤 방식이 맞는지 <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400">무료로 상담</span>받아보세요"
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            비즈니스의 현재 상황과 예산에 맞춰 가장 빠르게 유입과 문의를 만들어낼 수 있는 전술을 안내해 드립니다.
          </p>
        </div>

        {/* 5 Selective CTA Buttons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
          {ctaOptions.map((item, idx) => (
            <div key={idx} className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 hover:border-yellow-400 transition-all duration-300 flex flex-col justify-between group hover:bg-slate-800">
              <div>
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60 w-fit mb-4 group-hover:scale-105 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-base font-extrabold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                  {item.label}
                </h3>
                <p className="text-slate-400 text-xs leading-relaxed font-medium mb-6">
                  {item.desc}
                </p>
              </div>

              <div>
                {item.externalUrl ? (
                  <a
                    href={item.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-yellow-400 text-slate-900 text-xs font-black rounded-xl hover:bg-yellow-300 transition-colors flex items-center justify-center shadow-md shadow-yellow-500/20"
                  >
                    바로가기
                    <ArrowRight size={14} className="ml-1" />
                  </a>
                ) : (
                  <Link
                    to={item.link!}
                    className="w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center shadow-md shadow-blue-600/30"
                  >
                    상담 신청
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Main Big Contact Box */}
        <div className="bg-slate-900/90 rounded-3xl p-8 sm:p-12 border border-blue-800/60 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-block px-3 py-1 bg-blue-900 text-blue-200 text-xs font-extrabold rounded-full mb-3">
              빠른 카카오톡 & 전화 직통 연결
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              더 궁금하신 점이 있나요?
            </h3>
            <p className="text-slate-300 text-sm font-medium">
              전문 에이전트가 1:1로 실시간 친절하고 상세하게 답변드립니다.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <Link
              to="/consult"
              className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-black text-base hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center"
            >
              <MessageSquare size={18} className="mr-2" />
              1:1 맞춤 무료 상담
            </Link>
            <a
              href="https://onoffcpa.icrm.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-slate-800 border border-slate-700 text-white rounded-xl font-bold text-base hover:bg-slate-700 transition-all flex items-center justify-center"
            >
              온오프CPA 플랫폼 이동
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
