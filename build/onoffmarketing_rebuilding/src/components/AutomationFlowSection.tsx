import { ArrowRight, Bot, Database, MessageSquare, Zap, Network, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

const pipelineSteps = [
  { step: '01', title: '홈페이지 제작', desc: '고전환 UI/UX & 브랜드 세팅' },
  { step: '02', title: 'SEO/AEO 세팅', desc: '검색엔진 & AI 답변 최적화' },
  { step: '03', title: '콘텐츠/트래픽', desc: '블로그·카페·오가닉 유입망' },
  { step: '04', title: '타겟 유입', desc: '진성 고객 검색 방문 창출' },
  { step: '05', title: '고전환 상담', desc: '직통 카카오 & CPA 리드 수집' },
  { step: '06', title: 'iCRM 데이터', desc: '고객 정보 세분화 수집' },
  { step: '07', title: '마케팅 자동화', desc: '재구매 유도 & 24시간 케어' },
];

const platforms = [
  {
    icon: <Database className="w-8 h-8 text-blue-600" />,
    badge: 'iCRM System',
    title: '마케팅자동화 (iCRM)',
    desc: '고객 DB 자동 수집, 세그먼트 분류, 카카오 알림톡 및 리마인드 메시지 자동 발송으로 재방문/재구매율 증대',
    link: '/platform'
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-indigo-600" />,
    badge: '24H Chat Bot',
    title: '채팅자동화',
    desc: '24시간 공백 없는 맞춤 상담 및 미팅 예약 시나리오로 CS 업무 리소스를 80% 이상 절감하는 스마트 채팅 시스템',
    link: '/platform'
  },
  {
    icon: <Zap className="w-8 h-8 text-amber-600" />,
    badge: 'AdSense Traffic',
    title: '애드센스자동화',
    desc: '구글 애드센스 수익형 미디어 및 웹사이트의 콘텐츠 발행과 트래픽 유입 동선을 연동하는 자동화 파이프라인',
    link: '/platform'
  },
  {
    icon: <Network className="w-8 h-8 text-rose-600" />,
    badge: 'Affiliate Platform',
    title: '온오프CPA',
    desc: '광고주와 제휴 마케터 파트너를 직통으로 연결하여 리드 수집과 정산까지 원스톱 처리하는 제휴 플랫폼 솔루션',
    externalLink: 'https://onoffcpa.icrm.co.kr/'
  }
];

export default function AutomationFlowSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs sm:text-sm font-extrabold mb-4 border border-blue-200">
            <Bot size={16} className="mr-2 text-blue-600" />
            선순환 선행 프로세스
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            "사이트 제작 이후 <span className="text-blue-700">운영까지 자동화</span>합니다"
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            단순히 만들어놓고 방치하는 웹사이트가 아니라, 검색 노출부터 유입, 상담, 데이터 수집, 재구매 자동화까지 이어지는 마케팅 선순환 파이프라인을 완성합니다.
          </p>
        </div>

        {/* Visual Pipeline Diagram */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 mb-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Layers className="text-yellow-400 w-5 h-5" />
              <span className="text-white font-extrabold text-base sm:text-lg">온오프마케팅 원스톱 자동화 파이프라인</span>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              End-to-End Flow
            </span>
          </div>

          {/* Pipeline Steps Grid / Scroll */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 relative">
            {pipelineSteps.map((item, idx) => (
              <div key={idx} className="relative group">
                <div className="bg-slate-800/90 rounded-2xl p-4 border border-slate-700/80 group-hover:border-yellow-400 transition-colors h-full flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-black text-yellow-400 block mb-1">
                      STEP {item.step}
                    </span>
                    <h4 className="text-white font-extrabold text-sm mb-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs font-medium leading-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {idx < pipelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-500">
                    <ArrowRight size={14} className="text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 4 Connected Platform Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {platforms.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 hover:bg-white hover:shadow-xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="text-xs font-extrabold text-blue-900 bg-blue-100 px-2.5 py-1 rounded-full">
                    {item.badge}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-sm font-medium leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60">
                {item.externalLink ? (
                  <a
                    href={item.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-xs font-extrabold text-blue-700 hover:text-blue-900 group-hover:translate-x-1 transition-all"
                  >
                    플랫폼 이동
                    <ArrowRight size={14} className="ml-1" />
                  </a>
                ) : (
                  <Link
                    to={item.link!}
                    className="inline-flex items-center text-xs font-extrabold text-blue-700 hover:text-blue-900 group-hover:translate-x-1 transition-all"
                  >
                    자동화 연동 보기
                    <ArrowRight size={14} className="ml-1" />
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
