import { useState } from 'react';
import { 
  TrendingUp, 
  Target, 
  Users, 
  Zap, 
  Search, 
  FileText, 
  Cpu, 
  Layers, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  X, 
  MonitorSmartphone,
  MousePointerClick,
  ShieldCheck,
  Building2,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

// 1. 성과 카드 데이터 (6개)
export interface PerformanceCardItem {
  id: string;
  icon: any;
  category: string;
  title: string;
  value: string;
  desc: string;
  highlight: string;
  badgeColor: string;
  barWidth: string;
  gradient: string;
}

export const performanceCardsData: PerformanceCardItem[] = [
  {
    id: 'perf-seo',
    icon: Search,
    category: 'SEO & AEO',
    title: '검색 노출 향상',
    value: '1페이지 92%+ 점유',
    desc: '네이버·구글 핵심 키워드 상위 점유 및 생성형 AI 검색(AEO/GEO) 최적화 노출 엔진 적용',
    highlight: '검색 노출 1위 지속',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    barWidth: 'w-[92%]',
    gradient: 'from-blue-600 to-indigo-600'
  },
  {
    id: 'perf-traffic',
    icon: Users,
    category: 'Traffic Scale',
    title: '유입 증가',
    value: '타겟 유입 +380%',
    desc: '허수 클릭 없는 고관여 실질 타겟층 중심의 멀티 채널 트래픽 유입 파이프라인 창출',
    highlight: '월간 오가닉 유입 급증',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    barWidth: 'w-[88%]',
    gradient: 'from-emerald-600 to-teal-600'
  },
  {
    id: 'perf-conversion',
    icon: MousePointerClick,
    category: 'Lead Conversion',
    title: '문의 전환 증가',
    value: '상담 전환율 +280%',
    desc: '직관적인 랜딩 동선 설계와 카카오톡·전화 Direct CTA 배치로 수임/상담 리드 수집',
    highlight: '실질 DB 수집률 상승',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    barWidth: 'w-[85%]',
    gradient: 'from-amber-500 to-yellow-500'
  },
  {
    id: 'perf-posting',
    icon: FileText,
    category: 'Content Assets',
    title: '포스팅 운영',
    value: '누적 12,000+ 건',
    desc: 'AI 스튜디오 및 전담 마케터의 협업으로 타겟 키워드 중심의 정기 고품질 블로그 콘텐츠 발행',
    highlight: '지속적 콘텐츠 자산화',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    barWidth: 'w-[90%]',
    gradient: 'from-purple-600 to-indigo-600'
  },
  {
    id: 'perf-automation',
    icon: Cpu,
    category: 'System Workflow',
    title: '자동화 구축',
    value: 'CS 리소스 85% 절감',
    desc: 'DB 수집 즉시 알림톡 발송, 담당자 매칭, CRM 리드 트래킹 24/7 무인 자동화 케어',
    highlight: '24시간 무인 처리',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    barWidth: 'w-[85%]',
    gradient: 'from-rose-600 to-pink-600'
  },
  {
    id: 'perf-platform',
    icon: Layers,
    category: 'Affiliate Ecosystem',
    title: '플랫폼 운영',
    value: '1,200+ 제휴 파트너',
    desc: '광고주와 마케터를 연결하는 온오프CPA 플랫폼 가동, 어뷰징 검증 및 자동 승인 정산',
    highlight: '유효 DB 50,000건+',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    barWidth: 'w-[95%]',
    gradient: 'from-cyan-600 to-blue-600'
  }
];

// 2. 사례 카드 데이터 (6개)
export interface CaseCardItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  badge: string;
  metric: string;
  demoUrl?: string;
  internalLink?: string;
  imagePlaceholderText: string;
  imageSrc?: string; // 향후 실제 이미지 경로로 용이하게 교체 가능
  bgGradient: string;
  keyFeatures: string[];
}

export const caseCardsData: CaseCardItem[] = [
  {
    id: 'case-website',
    category: '홈페이지 제작 사례',
    title: '온오프성형외과 & 메디컬 랜딩',
    desc: '고급스러운 병원 브랜딩, 시술 가이드, 카카오톡 Direct 상담 전환에 최적화된 홈페이지 제작 사례입니다.',
    badge: '병원/의료',
    metric: '상담 전환율 +280%',
    demoUrl: 'https://plastic.icrm.co.kr',
    imagePlaceholderText: '의료/병원 홈페이지 시안',
    bgGradient: 'from-blue-700 via-indigo-800 to-slate-900',
    keyFeatures: ['의료진/시술 가이드', '카카오톡 1:1 상담 연결', '반응형 모바일 최적화', '전화 직통 CTA 버튼']
  },
  {
    id: 'case-seo',
    category: 'SEO/AEO 적용 사례',
    title: '온오프회생법률센터 검색 최적화',
    desc: '개인회생/파산 핵심 키워드 구글·네이버 1페이지 상위점유 및 AI 검색엔진(AEO) 인덱싱 사례입니다.',
    badge: '법률/전문직',
    metric: '키워드 상위 92% 점유',
    demoUrl: 'https://recoverylaw.icrm.co.kr',
    imagePlaceholderText: '법률 SEO 1페이지 상위노출',
    bgGradient: 'from-slate-800 via-slate-900 to-blue-950',
    keyFeatures: ['구글·네이버 1페이지 점유', 'AEO/GEO 인덱싱 적용', '자가진단 문의폼 연동', '네이버 지도/플레이스 연동']
  },
  {
    id: 'case-blog',
    category: '블로그 포스팅 운영 사례',
    title: '온오프클린 입주청소 블로그 운영',
    desc: '청소 현장 전후 비교 포트폴리오와 지역 특화 키워드 매일 포스팅으로 지역 노출 및 견적 문의 확충 사례입니다.',
    badge: '홈케어/생활',
    metric: '지역키워드 1위 노출',
    demoUrl: 'https://clean.icrm.co.kr',
    imagePlaceholderText: '지역 키워드 블로그 포스팅',
    bgGradient: 'from-teal-700 via-emerald-800 to-slate-900',
    keyFeatures: ['작업 전후 사진 갤러리', '지역 키워드 타겟팅', '간편 견적 문의 폼', '네이버 블로그 최적화']
  },
  {
    id: 'case-traffic',
    category: '트래픽 운영 사례',
    title: '온오프더팰리스 아파트 분양 마케팅',
    desc: '입지 프리미엄, 평면도, 모델하우스 방문예약에 집중된 고관여 타겟 트래픽 유입 및 리드 수집 사례입니다.',
    badge: '분양/부동산',
    metric: '월 방문예약 350건+',
    demoUrl: 'https://palace.icrm.co.kr',
    imagePlaceholderText: '분양 타겟 트래픽 랜딩',
    bgGradient: 'from-amber-600 via-orange-700 to-slate-900',
    keyFeatures: ['입지/프리미엄 갤러리', '실시간 방문예약 DB', '타겟 소셜 트래픽 집결', 'SMS 자동 리마인드']
  },
  {
    id: 'case-automation',
    category: '마케팅자동화 사례',
    title: 'iCRM 고객 관리 & 알림톡 파이프라인',
    desc: '문의 DB 접수 즉시 카카오 알림톡 자동 발송, 담당자 자동 배정 및 진행 상태 실시간 트래킹 사례입니다.',
    badge: 'iCRM/자동화',
    metric: 'CS 리소스 85% 절감',
    internalLink: '/platform',
    imagePlaceholderText: '자동 알림톡 & CRM 워크플로우',
    bgGradient: 'from-purple-700 via-indigo-900 to-slate-950',
    keyFeatures: ['카카오 알림톡 자동 발송', '실시간 DB 수집 파이프라인', '담당자 자동 알림', '리드 상태 트래킹 대시보드']
  },
  {
    id: 'case-cpa',
    category: '온오프CPA 플랫폼 사례',
    title: '온오프CPA 성과형 제휴 마케팅 시스템',
    desc: '광고주와 1,200+ 마케터 파트너 연결, 어뷰징 검증 및 승인·정산 프로세스가 자동 처리되는 CPA/CPS 사례입니다.',
    badge: 'CPA/CPS 플랫폼',
    metric: '유효 DB 50,000건+ 누적',
    demoUrl: 'https://onoffcpa.icrm.co.kr/',
    imagePlaceholderText: '온오프CPA 플랫폼 가동',
    bgGradient: 'from-rose-700 via-pink-800 to-slate-950',
    keyFeatures: ['1,200+ 마케터 네트워크', '실시간 어뷰징 필터', 'iCRM 유효 DB 수집', '자동 정산 & 승인 엔진']
  }
];

export default function RealResultsAndCasesSection() {
  const [selectedCaseModal, setSelectedCaseModal] = useState<CaseCardItem | null>(null);

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden border-b border-slate-800" id="real-results">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/80 text-yellow-400 text-xs sm:text-sm font-extrabold mb-4 border border-blue-700/60 shadow-inner">
            <Sparkles size={16} className="mr-2" />
            실전 운영 & 증명된 성과
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            “실제 운영과 실행 경험을 바탕으로 합니다”
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
            추상적인 이론이 아닌, 실전 비즈니스 현장에서 구체적인 숫자와 사례로 입증된 온오프마케팅의 핵심 퍼포먼스를 확인하세요.
          </p>
        </div>

        {/* 2. 성과 카드 영역 (6가지 핵심 지표) */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/80">
            <div className="flex items-center space-x-2">
              <Activity className="text-yellow-400 w-5 h-5" />
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                핵심 실행 성과 지표 (Performance Metrics)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              6 Core Indicators
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {performanceCardsData.map((perf) => {
              const IconComp = perf.icon;
              return (
                <div 
                  key={perf.id}
                  className="bg-slate-800/90 rounded-2xl p-6 border border-slate-700/80 hover:border-yellow-400/80 transition-all duration-300 shadow-xl relative overflow-hidden group flex flex-col justify-between"
                >
                  <div>
                    {/* Top row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60 text-yellow-400 group-hover:scale-105 transition-transform">
                        <IconComp size={22} />
                      </div>
                      <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${perf.badgeColor}`}>
                        {perf.category}
                      </span>
                    </div>

                    {/* Title & Value */}
                    <div className="mb-3">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {perf.title}
                      </div>
                      <div className="text-2xl sm:text-3xl font-black text-white tracking-tight group-hover:text-yellow-300 transition-colors">
                        {perf.value}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-4 border border-slate-700/50">
                      <div className={`h-full bg-gradient-to-r ${perf.gradient} rounded-full ${perf.barWidth}`}></div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-4">
                      {perf.desc}
                    </p>
                  </div>

                  {/* Highlight tag */}
                  <div className="pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-400">
                    <span className="flex items-center">
                      <CheckCircle2 size={14} className="mr-1.5 shrink-0" />
                      {perf.highlight}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">VERIFIED</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. 사례 카드 영역 (6가지 대표 사례) */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-700/80">
            <div className="flex items-center space-x-2">
              <Building2 className="text-blue-400 w-5 h-5" />
              <h3 className="text-lg sm:text-xl font-extrabold text-white">
                실제 적용 및 운영 사례 (Case Studies)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              6 Real Cases
            </span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {caseCardsData.map((item) => (
              <div 
                key={item.id}
                className="bg-slate-800/90 rounded-2xl border border-slate-700/80 overflow-hidden shadow-xl hover:shadow-2xl hover:border-blue-400/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* 대표 썸네일 (Visual Thumbnail Area - easily replaceable with <img>) */}
                  <div className={`h-48 bg-gradient-to-br ${item.bgGradient} p-6 text-white flex flex-col justify-between relative overflow-hidden`}>
                    
                    {/* Background Decorative Pattern */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                    {/* Category Tag & Metric Badge */}
                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-3 py-1 bg-black/40 backdrop-blur-md text-yellow-300 text-xs font-extrabold rounded-full border border-yellow-400/30">
                        {item.category}
                      </span>
                      <span className="text-xs font-bold text-white bg-white/10 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/20">
                        {item.badge}
                      </span>
                    </div>

                    {/* Thumbnail Center Placeholder Visual */}
                    <div className="relative z-10 flex items-center space-x-3 my-2">
                      {item.imageSrc ? (
                        <img 
                          src={item.imageSrc} 
                          alt={item.title} 
                          className="w-full h-full object-cover rounded-lg border border-white/20"
                        />
                      ) : (
                        <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 w-full">
                          <MonitorSmartphone size={24} className="text-yellow-400 shrink-0" />
                          <span className="text-xs font-bold text-slate-200 truncate">
                            {item.imagePlaceholderText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Title & Key Metric */}
                    <div className="relative z-10">
                      <div className="text-xs font-black text-emerald-400 mb-0.5 flex items-center">
                        <CheckCircle2 size={13} className="mr-1" />
                        {item.metric}
                      </div>
                      <h4 className="text-lg font-extrabold text-white tracking-tight drop-shadow-md">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* 카드 본문 (Category, Title, Short Description) */}
                  <div className="p-6">
                    <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                      {item.desc}
                    </p>

                    {/* Key features bullet points */}
                    <div className="space-y-2 mb-2">
                      {item.keyFeatures.slice(0, 2).map((feat, fIdx) => (
                        <div key={fIdx} className="flex items-center text-xs font-bold text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mr-2 shrink-0"></span>
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 자세히 보기 버튼 */}
                <div className="p-6 pt-0 space-y-2">
                  <button
                    onClick={() => setSelectedCaseModal(item)}
                    className="w-full py-3 bg-slate-900 border border-slate-700 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-yellow-400 hover:text-slate-900 hover:border-yellow-400 transition-all flex items-center justify-center group-hover:border-yellow-400/50 shadow-md"
                  >
                    사례 자세히 보기
                    <ArrowRight size={15} className="ml-1.5" />
                  </button>

                  {item.demoUrl && (
                    <a
                      href={item.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 bg-slate-800/80 border border-slate-700/60 text-slate-300 font-bold text-xs rounded-xl hover:bg-slate-700 hover:text-white transition-all flex items-center justify-center"
                    >
                      실제 사이트 접속 <ExternalLink size={13} className="ml-1 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Bottom Consultation CTA Link */}
        <div className="mt-16 text-center bg-slate-800/60 rounded-2xl p-8 border border-slate-700/80 shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-xl font-extrabold text-white mb-1">
              귀사의 업종에 맞는 퍼포먼스 사례가 궁금하신가요?
            </h4>
            <p className="text-slate-300 text-sm font-medium">
              키워드 노출, 트래픽 유입, 홈페이지 제작, CPA 시스템 도입을 1:1 진단해 드립니다.
            </p>
          </div>
          <Link
            to="/consult"
            className="shrink-0 px-7 py-4 bg-yellow-400 text-slate-900 rounded-xl font-black text-sm hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-500/20 flex items-center"
          >
            맞춤 마케팅 진단 신청
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>

      </div>

      {/* 5. Detailed Case Modal */}
      {selectedCaseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-800 border-b border-slate-700 flex items-center justify-between">
              <div>
                <span className="px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-extrabold rounded-full mr-2">
                  {selectedCaseModal.category}
                </span>
                <span className="text-xs text-slate-400 font-bold">
                  {selectedCaseModal.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                  {selectedCaseModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCaseModal(null)}
                className="p-2 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-400 mb-0.5">핵심 달성 성과</div>
                  <div className="text-xl font-black text-yellow-400">{selectedCaseModal.metric}</div>
                </div>
                <CheckCircle2 size={28} className="text-emerald-400" />
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">사례 개요</h4>
                <p className="text-slate-200 leading-relaxed font-medium bg-slate-800/50 p-4 rounded-xl border border-slate-700/60">
                  {selectedCaseModal.desc}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">주요 적용 스택 및 핵심 기능</h4>
                <div className="grid sm:grid-cols-2 gap-2">
                  {selectedCaseModal.keyFeatures.map((kf, idx) => (
                    <div key={idx} className="bg-slate-800 p-3 rounded-lg border border-slate-700 flex items-center text-xs font-bold text-white">
                      <ShieldCheck size={14} className="text-yellow-400 mr-2 shrink-0" />
                      {kf}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-slate-800 border-t border-slate-700 flex flex-col sm:flex-row gap-3 justify-end">
              {selectedCaseModal.demoUrl && (
                <a
                  href={selectedCaseModal.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center"
                >
                  데모 사이트 보기
                  <ExternalLink size={14} className="ml-1.5" />
                </a>
              )}
              {selectedCaseModal.internalLink && (
                <Link
                  to={selectedCaseModal.internalLink}
                  onClick={() => setSelectedCaseModal(null)}
                  className="px-6 py-3 bg-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-xl hover:bg-blue-500 transition-colors flex items-center justify-center"
                >
                  자세히 보기
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              )}
              <Link
                to="/consult"
                onClick={() => setSelectedCaseModal(null)}
                className="px-6 py-3 bg-yellow-400 text-slate-900 font-extrabold text-xs sm:text-sm rounded-xl hover:bg-yellow-300 transition-colors flex items-center justify-center"
              >
                비슷한 사례 구축 문의
              </Link>
            </div>

          </div>
        </div>
      )}

    </section>
  );
}
