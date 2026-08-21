import React from 'react';
import { 
  Globe, 
  Search, 
  Monitor, 
  Layout, 
  FileText, 
  Sparkles, 
  Link as LinkIcon, 
  Network, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  ExternalLink,
  ChevronRight,
  Zap,
  ArrowDown
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SERVICE_URLS } from './data/servicesData';

interface SeoSystemFlowSummaryProps {
  onOpenInquiry: (defaultService?: string) => void;
  onNavigateToPlatform?: () => void;
}

export const SeoSystemFlowSummary: React.FC<SeoSystemFlowSummaryProps> = ({
  onOpenInquiry,
  onNavigateToPlatform
}) => {
  const navigate = useNavigate();
  const openConsult = (label?: string) => {
    if (onOpenInquiry) onOpenInquiry(label || '');
    else navigate('/consult');
  };
  const steps = [
    {
      step: '01',
      category: 'DOMAIN',
      title: 'CatchDomain',
      desc: '좋은 도메인을 찾고\n과거 이력과 SEO 데이터를 분석합니다.',
      icon1: Globe,
      icon2: Search,
      buttonText: '도메인 찾기',
      link: SERVICE_URLS.catchDomain,
      isExternal: true,
      accentColor: 'blue',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-100',
      iconBgClass: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      btnClass: 'bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white'
    },
    {
      step: '02',
      category: 'WEBSITE',
      title: 'SEO Website',
      desc: '검색엔진과 사용자를 고려한\nSEO 중심 홈페이지를 구축합니다.',
      icon1: Monitor,
      icon2: Layout,
      buttonText: '홈페이지 제작 알아보기',
      link: '#',
      isExternal: false,
      onAction: () => onOpenInquiry('SEO Website 제작'),
      accentColor: 'cyan',
      badgeClass: 'bg-cyan-50 text-cyan-700 border-cyan-100',
      iconBgClass: 'bg-cyan-50 text-cyan-700 group-hover:bg-cyan-700 group-hover:text-white',
      btnClass: 'bg-slate-100 hover:bg-slate-900 text-slate-800 hover:text-white'
    },
    {
      step: '03',
      category: 'CONTENT',
      title: 'AI Content',
      desc: '키워드를 기반으로\n검색될 콘텐츠를 지속적으로 제작합니다.',
      icon1: FileText,
      icon2: Sparkles,
      buttonText: '콘텐츠 시스템 보기',
      link: SERVICE_URLS.contentTraffic,
      isExternal: true,
      accentColor: 'amber',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-100',
      iconBgClass: 'bg-amber-50 text-amber-700 group-hover:bg-amber-700 group-hover:text-white',
      btnClass: 'bg-slate-100 hover:bg-amber-600 text-slate-800 hover:text-white'
    },
    {
      step: '04',
      category: 'BACKLINK',
      title: 'BACKLINK',
      desc: '사이트에 필요한 백링크와\n외부 SEO 작업을 관리합니다.',
      icon1: LinkIcon,
      icon2: Network,
      buttonText: 'BACKLINK 알아보기',
      link: SERVICE_URLS.seoflow,
      isExternal: true,
      accentColor: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      iconBgClass: 'bg-emerald-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white',
      btnClass: 'bg-slate-100 hover:bg-emerald-600 text-slate-800 hover:text-white'
    },
    {
      step: '05',
      category: 'TRAFFIC',
      title: 'Traffic',
      desc: '만든 페이지와 콘텐츠에\n실제 유입 캠페인을 연결합니다.',
      icon1: TrendingUp,
      icon2: Users,
      buttonText: '트래픽 서비스 보기',
      link: SERVICE_URLS.contentTraffic,
      isExternal: true,
      accentColor: 'indigo',
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      iconBgClass: 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-700 group-hover:text-white',
      btnClass: 'bg-slate-100 hover:bg-indigo-600 text-slate-800 hover:text-white'
    }
  ];

  const handleCtaClick = () => {
    if (onNavigateToPlatform) {
      onNavigateToPlatform();
    } else {
      navigate('/seo-platform');
    }
  };

  return (
    <section id="seo-system-summary" className="py-20 lg:py-28 bg-white border-b border-slate-200 relative overflow-hidden">
      {/* Background Decorative Accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[500px] bg-gradient-to-r from-blue-50/50 via-slate-50 to-indigo-50/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold shadow-xs">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>INTEGRATED SEO EXECUTION PIPELINE</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            ONOFF SEO SYSTEM
          </h2>

          <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
            SEO에 필요한 도구와 실행 서비스를 하나로 연결했습니다.
          </p>
        </div>

        {/* ============================================================ */}
        {/* PC / Large Screen: Horizontal Process Flow (5 Columns)        */}
        {/* ============================================================ */}
        <div className="hidden xl:block">
          <div className="relative">
            
            {/* Horizontal Connecting Guide Line */}
            <div className="absolute top-28 left-12 right-12 h-0.5 bg-gradient-to-r from-blue-200 via-amber-200 to-indigo-200 z-0"></div>

            <div className="grid grid-cols-5 gap-4 relative z-10">
              {steps.map((item, idx) => {
                const Icon1 = item.icon1;
                const Icon2 = item.icon2;
                return (
                  <div key={idx} className="flex flex-col h-full">
                    
                    {/* Node Card */}
                    <div className="group bg-white rounded-3xl border border-slate-200 p-5 hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col justify-between h-full relative">
                      
                      {/* Top Header: Step Badge & Dual Icons */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black tracking-wider uppercase border ${item.badgeClass}`}>
                            {item.step} {item.category}
                          </span>
                          
                          {/* Dual Icon Badges */}
                          <div className="flex items-center -space-x-1.5">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-white shadow-xs transition-colors duration-200 ${item.iconBgClass}`}>
                              <Icon1 className="w-4 h-4" />
                            </div>
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border border-white shadow-xs transition-colors duration-200 ${item.iconBgClass}`}>
                              <Icon2 className="w-4 h-4" />
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.title}
                        </h3>

                        {/* Description */}
                        <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line min-h-[48px]">
                          {item.desc}
                        </p>
                      </div>

                      {/* Bottom Button */}
                      <div className="mt-5 pt-3 border-t border-slate-100">
                        {item.isExternal ? (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`w-full py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${item.btnClass}`}
                          >
                            <span>{item.buttonText}</span>
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                        ) : (
                          <button
                            onClick={item.onAction}
                            className={`w-full py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs ${item.btnClass}`}
                          >
                            <span>{item.buttonText}</span>
                            <ArrowRight className="w-3 h-3 opacity-70" />
                          </button>
                        )}
                      </div>

                    </div>

                    {/* Step Flow Arrow Indicator (between steps on PC) */}
                    {idx < steps.length - 1 && (
                      <div className="hidden">
                        {/* Reserved */}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* Tablet Screen: 2-3 Grid Flow with Connectors                 */}
        {/* ============================================================ */}
        <div className="hidden md:block xl:hidden">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {steps.map((item, idx) => {
              const Icon1 = item.icon1;
              const Icon2 = item.icon2;
              return (
                <div 
                  key={idx} 
                  className={`group bg-white rounded-3xl border border-slate-200 p-6 hover:border-blue-500 hover:shadow-md transition-all flex flex-col justify-between ${
                    idx === 4 ? 'col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase border ${item.badgeClass}`}>
                        {item.step} {item.category}
                      </span>
                      <div className="flex items-center -space-x-1.5">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white shadow-xs ${item.iconBgClass}`}>
                          <Icon1 className="w-4 h-4" />
                        </div>
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border border-white shadow-xs ${item.iconBgClass}`}>
                          <Icon2 className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 leading-relaxed whitespace-pre-line">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-slate-100">
                    {item.isExternal ? (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${item.btnClass}`}
                      >
                        <span>{item.buttonText}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                      </a>
                    ) : (
                      <button
                        onClick={item.onAction}
                        className={`w-full py-2.5 px-4 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${item.btnClass}`}
                      >
                        <span>{item.buttonText}</span>
                        <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Mobile Screen: Vertical Timeline Flow                       */}
        {/* ============================================================ */}
        <div className="md:hidden">
          <div className="relative pl-6 space-y-6">
            
            {/* Vertical Connecting Line */}
            <div className="absolute top-4 bottom-4 left-2.5 w-0.5 bg-gradient-to-b from-blue-300 via-amber-300 to-indigo-300"></div>

            {steps.map((item, idx) => {
              const Icon1 = item.icon1;
              const Icon2 = item.icon2;
              return (
                <div key={idx} className="relative">
                  
                  {/* Timeline Milestone Dot */}
                  <div className="absolute -left-[27px] top-6 w-6 h-6 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center text-[10px] font-black text-blue-600 shadow-xs z-10">
                    {idx + 1}
                  </div>

                  {/* Mobile Card */}
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black tracking-wider uppercase border ${item.badgeClass}`}>
                        {item.step} {item.category}
                      </span>
                      <div className="flex items-center -space-x-1">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border border-white shadow-2xs ${item.iconBgClass}`}>
                          <Icon1 className="w-3.5 h-3.5" />
                        </div>
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center border border-white shadow-2xs ${item.iconBgClass}`}>
                          <Icon2 className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed whitespace-pre-line">
                        {item.desc}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      {item.isExternal ? (
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`w-full py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 ${item.btnClass}`}
                        >
                          <span>{item.buttonText}</span>
                          <ExternalLink className="w-3 h-3 opacity-70" />
                        </a>
                      ) : (
                        <button
                          onClick={item.onAction}
                          className={`w-full py-2.5 px-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 ${item.btnClass}`}
                        >
                          <span>{item.buttonText}</span>
                          <ArrowRight className="w-3 h-3 opacity-70" />
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Downward indicator between mobile steps */}
                  {idx < steps.length - 1 && (
                    <div className="flex justify-center -my-3 relative z-10">
                      <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        <ArrowDown className="w-3 h-3" />
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* Bottom Banner: Large Statement & CTA to /seo-platform/       */}
        {/* ============================================================ */}
        <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 lg:p-14 shadow-md relative overflow-hidden">
          
          {/* Subtle glow circle */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -left-20 -top-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative max-w-4xl mx-auto text-center space-y-6">
            
            {/* Big Headline */}
            <div className="space-y-2">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
                각각의 SEO 작업을 따로 하지 마세요.
              </h3>
              <p className="text-xl sm:text-2xl lg:text-3xl font-black text-blue-400 tracking-tight">
                하나의 전략으로 연결해야 합니다.
              </p>
            </div>

            {/* Explanatory description */}
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
              도메인 선점부터 테크니컬 온페이지, 인텐트 콘텐츠, 고품질 백링크, 실제 트래픽 유입까지.
              모든 과정이 하나의 유기적인 엔진으로 연결될 때 독보적인 검색 점유율이 완성됩니다.
            </p>

            {/* Major CTA Button -> /seo-platform/ */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleCtaClick}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm sm:text-base font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2.5 transition-all active:scale-95 group"
              >
                <span>ONOFF SEO SYSTEM 자세히 보기</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => onOpenInquiry('통합 시스템 맞춤 전략 상담')}
                className="w-full sm:w-auto px-7 py-4 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-sm sm:text-base font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all"
              >
                <span>1:1 통합 구축 상담 신청</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
