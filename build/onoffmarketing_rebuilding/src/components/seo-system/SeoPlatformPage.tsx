import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Search, 
  Monitor, 
  FileText, 
  Sparkles, 
  Link as LinkIcon, 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  ExternalLink,
  ArrowRight,
  ChevronRight,
  Layers,
  HelpCircle,
  BarChart3,
  Check,
  Workflow,
  GraduationCap,
  BookOpen,
  Target,
  Code2,
  Rocket,
  Shield,
  Activity,
  ArrowUpRight,
  FileCheck,
  Award,
  Cpu
} from 'lucide-react';
import { SERVICE_URLS } from './data/servicesData';

export default function SeoPlatformPage() {
  const navigate = useNavigate();
  const [activeDashboardStep, setActiveDashboardStep] = useState<number>(0);
  const openConsult = () => {
    navigate('/consult');
  };

  const problemCards = [
    {
      id: 1,
      num: '01',
      title: '어떤 키워드를 공략해야 하는지 모름',
      desc: '실제 구매 전환으로 이어지는 검색 의도(Intent) 쿼리를 파악하지 못해 무의미한 조회수용 콘텐츠만 누적됩니다.',
      solutionTag: 'AI CONTENT & KEYWORD MINING',
      tool: 'AI Content 기획 엔진'
    },
    {
      id: 2,
      num: '02',
      title: '어떤 도메인이 좋은지 판단하기 어려움',
      desc: '신규 도메인의 긴 샌드박스 기간(3~6개월)과 과거 스팸 페널티 이력을 검증하지 못해 시작부터 색인이 지연됩니다.',
      solutionTag: 'CATCHDOMAIN ANALYSIS',
      tool: 'CatchDomain 검증 도구'
    },
    {
      id: 3,
      num: '03',
      title: '콘텐츠를 지속적으로 만들기 어려움',
      desc: '구글 E-E-A-T 기준을 충족하는 양질의 전문 원고를 매주 꾸준히 기획하고 발행할 전담 인력과 리소스가 부족합니다.',
      solutionTag: 'CONTINUOUS CONTENT PRODUCTION',
      tool: 'AI & 전문 에디터 협업 시스템'
    },
    {
      id: 4,
      num: '04',
      title: '어떤 백링크가 필요한지 모름',
      desc: '출처 불명의 저품질 PBN 백링크를 구매했다가 검색엔진 페널티를 받거나, 도메인 권위를 올릴 실질 링크를 확보하지 못합니다.',
      solutionTag: 'ALGORITHM-SAFE SEOFLOW',
      tool: 'SEOFLOW 구축 시스템'
    },
    {
      id: 5,
      num: '05',
      title: '작업 후 효과를 판단하기 어려움',
      desc: '개별 작업들이 오가닉 순위 상승과 실제 유입 전환에 얼마나 기여했는지 데이터 파이프라인으로 측정되지 않습니다.',
      solutionTag: 'TRAFFIC & RESULT TRACKING',
      tool: '실시간 순위 & 유입 대시보드'
    }
  ];

  const dashboardFlowSteps = [
    {
      id: 'DOMAIN',
      title: 'DOMAIN',
      sub: 'CatchDomain',
      icon: Globe,
      status: 'Live Active',
      stat: 'DA 48+ / Zero Spam',
      desc: '과거 신뢰 이력과 클린 아카이브를 전수 검증한 고권위 도메인 선점',
      metricLabel: '초기 샌드박스 단축',
      metricVal: '85% 절감',
      lineColor: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'WEBSITE',
      title: 'WEBSITE',
      sub: 'SEO Website',
      icon: Monitor,
      status: 'Engineered',
      stat: 'Tech 300 Passed',
      desc: 'Core Web Vitals 95점+ 및 JSON-LD 구조화 데이터 탑재',
      metricLabel: '크롤링 인덱스율',
      metricVal: '99.4%',
      lineColor: 'from-cyan-500 to-amber-500'
    },
    {
      id: 'CONTENT',
      title: 'CONTENT',
      sub: 'AI Content',
      icon: FileText,
      status: 'Intent Sync',
      stat: 'E-E-A-T Verified',
      desc: '구매 의도 키워드 기반 주간 정기 전문 콘텐츠 발행',
      metricLabel: '롱테일 키워드 점유',
      metricVal: '+320개 노출',
      lineColor: 'from-amber-500 to-emerald-500'
    },
    {
      id: 'SEOFLOW',
      title: 'SEOFLOW',
      sub: 'Backlink & Off-page SEO',
      icon: LinkIcon,
      status: 'Tier 1 Distributed',
      stat: 'Do-Follow Authority',
      desc: '알고리즘 안전 계층형 백링크 분산 배포 및 권위 강화',
      metricLabel: '도메인 파워(DR)',
      metricVal: 'DA 52 달성',
      lineColor: 'from-emerald-500 to-indigo-500'
    },
    {
      id: 'TRAFFIC',
      title: 'TRAFFIC',
      sub: 'Traffic Signals',
      icon: TrendingUp,
      status: 'Active Sessions',
      stat: 'Real User Signals',
      desc: '실제 유저 반응 체류 시간 및 CTR 클릭 시그널 활성화',
      metricLabel: '오가닉 체류 시간',
      metricVal: '3분 42초',
      lineColor: 'from-indigo-500 to-violet-500'
    },
    {
      id: 'RESULT',
      title: 'RESULT',
      sub: 'Measured Growth',
      icon: BarChart3,
      status: 'Pipeline Complete',
      stat: 'Organic Focus',
      desc: '모든 파이프라인이 결합된 독보적인 오가닉 검색 점유율',
      metricLabel: '월간 유입 성장',
      metricVal: '성장 측정',
      lineColor: 'from-violet-500 to-blue-500'
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-20">
      
      {/* Top Breadcrumb Bar — sits under fixed site Header (h ≈ 80px → top-20) */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium min-w-0">
            <Link to="/" className="hover:text-blue-600 font-bold text-slate-600 shrink-0">홈</Link>
            <ChevronRight className="w-3 h-3 shrink-0" />
            <span className="text-blue-600 font-bold truncate">ONOFF SEO SYSTEM PLATFORM</span>
          </div>
          <button
            type="button"
            onClick={openConsult}
            className="shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
          >
            SEO 상담
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. HERO SECTION (With High-Tech SaaS Dashboard System Graphic) */}
      {/* ============================================================ */}
      <section className="bg-white border-b border-slate-200 pt-12 pb-20 lg:pt-16 lg:pb-28 relative overflow-hidden">
        
        {/* Subtle Background Glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Eyebrow, H1, Sub Copy, CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-black tracking-wider uppercase shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-blue-600" />
                <span>ONOFF SEO SYSTEM</span>
              </div>

              {/* H1 */}
              <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.15]">
                SEO를 분석에서 실행까지.
              </h1>

              {/* Sub Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                도메인, 홈페이지, 콘텐츠, 백링크, 트래픽.<br className="hidden sm:inline" />
                서로 분리된 SEO 작업을 하나의 전략으로 연결합니다.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => scrollToSection('customer-type-recommendation')}
                  className="px-7 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Search className="w-4 h-4" />
                  <span>내게 필요한 SEO 찾기</span>
                </button>

                <button
                  onClick={() => scrollToSection('seo-journey-section')}
                  className="px-6 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 flex items-center justify-center gap-2 transition-colors"
                >
                  <Layers className="w-4 h-4 text-slate-600" />
                  <span>전체 시스템 보기</span>
                </button>
              </div>

              {/* Trust Metric Row */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-xl font-black text-slate-900">5대 영역</div>
                  <div className="text-xs text-slate-500 font-medium">단일 연계 실행</div>
                </div>
                <div>
                  <div className="text-xl font-black text-blue-600">300+</div>
                  <div className="text-xs text-slate-500 font-medium">테크니컬 온페이지 룰</div>
                </div>
                <div>
                  <div className="text-xl font-black text-slate-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium">정품 Do-Follow 링크</div>
                </div>
              </div>

            </div>

            {/* Right Column: High-Tech SaaS Dashboard System Graphic */}
            <div className="lg:col-span-6">
              <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-800 relative overflow-hidden">
                
                {/* Top Window Bar */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <span className="font-mono text-slate-400 text-[11px] ml-2">onoff-system-engine://pipeline-stream</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>DATA SYNC: ACTIVE</span>
                  </div>
                </div>

                {/* Dashboard Stream Content */}
                <div className="pt-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                    <span>INTEGRATED SYSTEM DATA FLOW</span>
                    <span className="text-blue-400 text-[11px]">클릭하여 모듈 세부 상태 확인</span>
                  </div>

                  {/* 6 Connected Steps */}
                  <div className="space-y-2 relative">
                    {dashboardFlowSteps.map((step, idx) => {
                      const IconComp = step.icon;
                      const isSelected = activeDashboardStep === idx;
                      return (
                        <div key={step.id} className="relative">
                          
                          {/* Connected Node Box */}
                          <div 
                            onClick={() => setActiveDashboardStep(idx)}
                            className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected 
                                ? 'bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500/30' 
                                : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                                isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-800 text-slate-300 border-slate-700'
                              }`}>
                                <IconComp className="w-4 h-4" />
                              </div>

                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-black text-white tracking-wider">
                                    {step.title}
                                  </span>
                                  <span className="text-[10px] text-blue-400 font-mono">
                                    {step.sub}
                                  </span>
                                </div>
                                <div className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-[260px]">
                                  {step.desc}
                                </div>
                              </div>
                            </div>

                            <div className="text-right shrink-0">
                              <div className="text-xs font-mono font-bold text-emerald-400">
                                {step.metricVal}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {step.metricLabel}
                              </div>
                            </div>
                          </div>

                          {/* Data Line Connection to next node */}
                          {idx < dashboardFlowSteps.length - 1 && (
                            <div className="flex items-center justify-center my-0.5">
                              <div className="w-0.5 h-2.5 bg-gradient-to-b from-blue-500/60 to-indigo-500/60"></div>
                            </div>
                          )}

                        </div>
                      );
                    })}
                  </div>

                  {/* Active Step Live Telemetry Banner */}
                  <div className="mt-4 p-3 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-300">
                        선택 모듈: <strong className="text-white">{dashboardFlowSteps[activeDashboardStep].title} ({dashboardFlowSteps[activeDashboardStep].sub})</strong>
                      </span>
                    </div>
                    <span className="text-cyan-300 font-mono text-[11px] font-bold">
                      {dashboardFlowSteps[activeDashboardStep].stat}
                    </span>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. PROBLEM SECTION                                          */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Title */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-100 text-rose-700 text-xs font-bold">
              <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
              <span>THE CORE SEO BOTTLENECK</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              SEO가 어려운 이유는<br />
              해야 할 일이 너무 많기 때문입니다.
            </h2>

            <p className="text-sm sm:text-base text-slate-500 leading-relaxed font-normal">
              대부분의 기업은 도메인, 개발, 원고 작성, 백링크 작업을 개별적으로 진행하다 
              전략의 단절로 인해 막대한 시간과 비용을 낭비합니다.
            </p>
          </div>

          {/* 5 Problem Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problemCards.map((card, index) => (
              <div 
                key={card.id}
                className={`bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-7 hover:bg-white hover:border-blue-500/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
                  index === 4 ? 'md:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-black flex items-center justify-center shadow-2xs">
                      {card.num}
                    </span>
                    <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {card.solutionTag}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 leading-snug">
                    {card.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span className="text-slate-400">해결 솔루션:</span>
                  <span className="text-blue-700 font-bold">{card.tool}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Distinct Statement */}
          <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-blue-50 border border-blue-100 text-center max-w-4xl mx-auto shadow-2xs">
            <p className="text-base sm:text-lg lg:text-xl font-black text-blue-950 leading-relaxed">
              온오프마케팅은 각각의 문제를 별도의 도구와 실행 시스템으로 해결합니다.
            </p>
            <p className="text-xs sm:text-sm text-blue-700 mt-1 font-medium">
              CatchDomain &middot; SEO Website &middot; AI Content &middot; SEOFLOW &middot; Traffic
            </p>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. SEO JOURNEY: STEP 01 -> STEP 04 (Core Integrated Flow)    */}
      {/* ============================================================ */}
      <section id="seo-journey-section" className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-black tracking-wider uppercase">
              <Workflow className="w-3.5 h-3.5 text-blue-600" />
              <span>THE UNIFIED SEO JOURNEY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
              각각의 솔루션을 하나의 여정으로 연결합니다
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              단순 상품 카드의 나열이 아닙니다. 도메인 기반 선점부터 콘텐츠, 백링크, 실제 유입 전환까지 
              완결된 4단계 SEO Journey 파이프라인을 경험하세요.
            </p>
          </div>

          {/* Journey Steps Stack */}
          <div className="space-y-12">
            
            {/* ---------------------------------------------------- */}
            {/* STEP 01: DOMAIN INTELLIGENCE (CatchDomain)           */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs hover:border-blue-500/60 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Content */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-blue-600 text-white text-xs font-black tracking-widest uppercase">
                      STEP 01
                    </span>
                    <span className="text-xs font-mono font-bold text-blue-600 tracking-wider">
                      DOMAIN INTELLIGENCE
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    좋은 기반부터 시작합니다.<br />
                    <span className="text-blue-600">CatchDomain</span>
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    등록 가능한 도메인만 찾는 것이 아니라<br className="hidden sm:inline" />
                    <strong>SEO에 실제 활용할 가치가 있는 도메인을 분석합니다.</strong>
                  </p>

                  <div className="pt-2">
                    <a
                      href={SERVICE_URLS.catchDomain}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm transition-all group"
                    >
                      <span>CatchDomain 시작하기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right Feature Dashboard Preview UI */}
                <div className="lg:col-span-6">
                  <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 text-white shadow-xl space-y-4">
                    
                    {/* Dashboard Header Bar */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-slate-200">CatchDomain &middot; Intelligence Scanner</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/40 text-blue-400 text-[10px] font-mono">
                        VERIFIED METRICS
                      </span>
                    </div>

                    {/* 6 Grid Feature Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      
                      {/* 1. Domain History */}
                      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Domain History</div>
                        <div className="text-sm font-black text-cyan-300 mt-1">7.4 Years</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Archive Clean 100%</div>
                      </div>

                      {/* 2. Backlink Data */}
                      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Backlink Data</div>
                        <div className="text-sm font-black text-emerald-400 mt-1">2,840+ Live</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Do-Follow 88%</div>
                      </div>

                      {/* 3. Referring Domains */}
                      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Referring Domains</div>
                        <div className="text-sm font-black text-blue-400 mt-1">142 Root Domains</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">High DA Clusters</div>
                      </div>

                      {/* 4. Google / Naver Data */}
                      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Google / Naver 활용 데이터</div>
                        <div className="text-sm font-black text-amber-300 mt-1">Index Active</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">0-Day Penalty Free</div>
                      </div>

                      {/* 5. Spam / Risk */}
                      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Spam / Risk</div>
                        <div className="text-sm font-black text-emerald-400 mt-1">0% (Zero Risk)</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Deep Spam Scan Pass</div>
                      </div>

                      {/* 6. Topic Relevance */}
                      <div className="bg-slate-950/70 rounded-xl p-3 border border-slate-800/80">
                        <div className="text-[10px] font-mono text-slate-400 uppercase">Topic Relevance</div>
                        <div className="text-sm font-black text-indigo-300 mt-1">Exact Match</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">Category Authority</div>
                      </div>

                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/60">
                      <span>과거 신뢰 데이터를 즉시 흡수하여 초기 샌드박스 기간을 건너뜁니다.</span>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* STEP 02: CONTENT AUTOMATION (AI Content System)      */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs hover:border-amber-500/60 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Content */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black tracking-widest uppercase">
                      STEP 02
                    </span>
                    <span className="text-xs font-mono font-bold text-amber-600 tracking-wider">
                      CONTENT AUTOMATION
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    검색될 콘텐츠를 만듭니다.
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    단순히 AI가 글을 작성하는 것이 아니라<br className="hidden sm:inline" />
                    <strong>키워드와 SEO 전략에 맞춰 콘텐츠 제작 업무를 시스템화합니다.</strong>
                  </p>

                  <div className="pt-2">
                    <a
                      href={SERVICE_URLS.contentTraffic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-bold text-sm shadow-sm transition-all group"
                    >
                      <span>콘텐츠 시스템 보기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right Flow Visualization */}
                <div className="lg:col-span-6">
                  <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-2xl p-5 sm:p-6 border border-amber-100 space-y-4">
                    
                    <div className="flex items-center justify-between text-xs text-amber-900 font-bold">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        <span>CONTENT SYSTEM PIPELINE FLOW</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono">
                        E-E-A-T CERTIFIED
                      </span>
                    </div>

                    {/* Horizontal / Vertical 5-Step Pipeline */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
                      
                      {/* 1. Keyword */}
                      <div className="bg-white rounded-xl p-3 border border-amber-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1 text-xs font-black">
                          01
                        </div>
                        <div className="text-xs font-black text-slate-800">Keyword</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">검색 의도 마이닝</div>
                      </div>

                      {/* 2. Content Planning */}
                      <div className="bg-white rounded-xl p-3 border border-amber-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1 text-xs font-black">
                          02
                        </div>
                        <div className="text-xs font-black text-slate-800">Content Planning</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">구조화 목차 기획</div>
                      </div>

                      {/* 3. AI Creation */}
                      <div className="bg-white rounded-xl p-3 border border-amber-500/80 ring-2 ring-amber-200/60 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center mb-1 text-xs font-black">
                          <Sparkles className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs font-black text-amber-900">AI Creation</div>
                        <div className="text-[10px] text-amber-700 mt-0.5">전문 원고 생성</div>
                      </div>

                      {/* 4. Publishing */}
                      <div className="bg-white rounded-xl p-3 border border-amber-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1 text-xs font-black">
                          04
                        </div>
                        <div className="text-xs font-black text-slate-800">Publishing</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">정기 배포 관리</div>
                      </div>

                      {/* 5. SEO 활용 */}
                      <div className="bg-white rounded-xl p-3 border border-amber-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1 text-xs font-black">
                          05
                        </div>
                        <div className="text-xs font-black text-slate-800">SEO 활용</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">롱테일 색인 점유</div>
                      </div>

                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-amber-100 text-xs text-slate-600 flex items-center justify-between">
                      <span>단순 글 생성이 아닌 <strong>내부 링크 구조와 질문형 쿼리(PAA)</strong>를 전략적으로 배치합니다.</span>
                      <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* STEP 03: OFF-PAGE SEO (SEOFLOW)                      */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs hover:border-emerald-500/60 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Content */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-emerald-600 text-white text-xs font-black tracking-widest uppercase">
                      STEP 03
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-600 tracking-wider">
                      OFF-PAGE SEO
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    필요한 백링크를 찾습니다.<br />
                    <span className="text-emerald-600">SEOFLOW</span>
                  </h3>

                  {/* Highlight sentence */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-950 font-black text-base sm:text-lg">
                    “백링크의 개수보다<br className="hidden sm:inline" />
                    어떤 사이트에서 받는지가 중요합니다.”
                  </div>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    사이트와 외부 SEO 데이터를 분석하고<br className="hidden sm:inline" />
                    <strong>적합한 백링크 및 외부 SEO 작업을 관리합니다.</strong>
                  </p>

                  <div className="pt-2">
                    <a
                      href={SERVICE_URLS.seoflow}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-sm transition-all group"
                    >
                      <span>SEOFLOW 알아보기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right UI Card: Example Data Comparison Box */}
                <div className="lg:col-span-6">
                  <div className="bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-800 text-white shadow-xl space-y-4">
                    
                    {/* Card Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <LinkIcon className="w-4 h-4 text-emerald-400" />
                        <span className="font-bold text-slate-200">SEOFLOW &middot; Backlink &amp; Off-page SEO Analyzer</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono">
                        GAP AUDIT
                      </span>
                    </div>

                    {/* 4 Metric Stats Cards */}
                    <div className="grid grid-cols-2 gap-3">
                      
                      {/* Current Referring Domains */}
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                        <div className="text-[11px] text-slate-400 font-medium">Current Referring Domains</div>
                        <div className="text-2xl sm:text-3xl font-black text-white mt-1">27</div>
                        <div className="text-[10px] text-slate-500 mt-1">현재 보유 참조 도메인</div>
                      </div>

                      {/* Competitor Average */}
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800">
                        <div className="text-[11px] text-slate-400 font-medium">Competitor Average</div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-300 mt-1">74</div>
                        <div className="text-[10px] text-slate-500 mt-1">경쟁사 1페이지 평균</div>
                      </div>

                      {/* Backlink Gap */}
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-rose-900/60 bg-rose-950/20">
                        <div className="text-[11px] text-rose-300 font-medium">Backlink Gap</div>
                        <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-1">-47</div>
                        <div className="text-[10px] text-rose-300/70 mt-1">보완 필요 권위 격차</div>
                      </div>

                      {/* Recommended Opportunities */}
                      <div className="bg-slate-950/80 rounded-xl p-4 border border-emerald-500/40 bg-emerald-950/20">
                        <div className="text-[11px] text-emerald-300 font-medium">Recommended Opportunities</div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">12</div>
                        <div className="text-[10px] text-emerald-300/70 mt-1">고효율 Do-Follow 추천처</div>
                      </div>

                    </div>

                    {/* Mandatory Disclaimer notice */}
                    <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800">
                      <span className="italic">* 본 데이터는 화면 구성을 위한 예시 데이터(Example Data)입니다.</span>
                      <span className="text-slate-400">알고리즘 세이프 100% 보증</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>

            {/* ---------------------------------------------------- */}
            {/* STEP 04: TRAFFIC (Real User Engagement Signals)      */}
            {/* ---------------------------------------------------- */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-xs hover:border-indigo-500/60 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left Content */}
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black tracking-widest uppercase">
                      STEP 04
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 tracking-wider">
                      TRAFFIC
                    </span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
                    콘텐츠에 실제 유입을 연결합니다.
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                    좋은 페이지를 만들었다면 <strong>실제 사용자가 유입될 수 있는 마케팅도 필요합니다.</strong>
                  </p>

                  <div className="pt-2">
                    <a
                      href={SERVICE_URLS.contentTraffic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition-all group"
                    >
                      <span>트래픽 서비스 보기</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>

                {/* Right Flow Visualization: Campaign -> Landing Page -> Traffic -> Engagement -> Conversion */}
                <div className="lg:col-span-6">
                  <div className="bg-gradient-to-br from-indigo-50/60 to-blue-50/40 rounded-2xl p-5 sm:p-6 border border-indigo-100 space-y-4">
                    
                    <div className="flex items-center justify-between text-xs text-indigo-900 font-bold">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                        <span>TRAFFIC CONVERSION PIPELINE</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-mono">
                        REAL USER SIGNALS
                      </span>
                    </div>

                    {/* 5-Step Flow Nodes */}
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 relative">
                      
                      {/* 1. Campaign */}
                      <div className="bg-white rounded-xl p-3 border border-indigo-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1 text-xs font-black">
                          01
                        </div>
                        <div className="text-xs font-black text-slate-800">Campaign</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">유입 타겟팅</div>
                      </div>

                      {/* 2. Landing Page */}
                      <div className="bg-white rounded-xl p-3 border border-indigo-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1 text-xs font-black">
                          02
                        </div>
                        <div className="text-xs font-black text-slate-800">Landing Page</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">전환 랜딩 도달</div>
                      </div>

                      {/* 3. Traffic */}
                      <div className="bg-white rounded-xl p-3 border border-indigo-500 ring-2 ring-indigo-200/60 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center mb-1 text-xs font-black">
                          <Users className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs font-black text-indigo-950">Traffic</div>
                        <div className="text-[10px] text-indigo-700 mt-0.5">실사용자 유입</div>
                      </div>

                      {/* 4. Engagement */}
                      <div className="bg-white rounded-xl p-3 border border-indigo-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1 text-xs font-black">
                          04
                        </div>
                        <div className="text-xs font-black text-slate-800">Engagement</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">체류&상호작용</div>
                      </div>

                      {/* 5. Conversion */}
                      <div className="bg-white rounded-xl p-3 border border-indigo-200/80 shadow-2xs text-center flex flex-col justify-center items-center">
                        <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-1 text-xs font-black">
                          05
                        </div>
                        <div className="text-xs font-black text-slate-800">Conversion</div>
                        <div className="text-[10px] text-slate-500 mt-0.5">매출 및 문의 전환</div>
                      </div>

                    </div>

                    <div className="p-3 bg-white/90 rounded-xl border border-indigo-100 text-xs text-slate-600 flex items-center justify-between">
                      <span>검색엔진 체류 시간(Dwell Time)과 CTR 시그널을 활성화하여 <strong>상위 랭킹을 견고하게 유지</strong>합니다.</span>
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    </div>

                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. CUSTOMER TYPE RECOMMENDATION ("어떤 서비스가 필요한지...") */}
      {/* ============================================================ */}
      <section id="customer-type-recommendation" className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
              <Target className="w-3.5 h-3.5 text-blue-600" />
              <span>PERSONALIZED RECOMMENDATION</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              어떤 서비스가 필요한지 모르시겠나요?
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-normal">
              SEO에 익숙하지 않아도 괜찮습니다. 현재 상황에 꼭 맞는 추천 파이프라인을 확인하세요.
            </p>
          </div>

          {/* 4 Customer Type Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* TYPE A */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:border-blue-500 hover:bg-white hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-black tracking-wider uppercase">
                  TYPE A
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug min-h-[50px]">
                  홈페이지도 없고<br />SEO를 처음 시작합니다.
                </h3>
                
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-400 block mb-2">추천:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold">Website</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold">Content</span>
                    <span className="px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold">SEO Consulting</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  onClick={() => openConsult()}
                  className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>SEO 시작 상담</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TYPE B */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:border-cyan-500 hover:bg-white hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 text-xs font-black tracking-wider uppercase">
                  TYPE B
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug min-h-[50px]">
                  사이트는 있지만<br />검색 노출이 부족합니다.
                </h3>
                
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-400 block mb-2">추천:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold">Content</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">SEOFLOW</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold">Traffic</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  onClick={() => openConsult()}
                  className="w-full py-3 rounded-full bg-slate-900 hover:bg-cyan-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>사이트 진단하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TYPE C */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-500 hover:bg-white hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black tracking-wider uppercase">
                  TYPE C
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug min-h-[50px]">
                  콘텐츠는 있는데<br />순위가 올라가지 않습니다.
                </h3>
                
                <div className="pt-3 border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-400 block mb-2">추천:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold">Competitor Analysis</span>
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">SEOFLOW</span>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 text-xs font-bold">Traffic</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-200">
                <button
                  onClick={() => openConsult()}
                  className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>외부 SEO 확인하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* TYPE D (Highlighted Standard Card) */}
            <div className="bg-gradient-to-b from-indigo-50/60 to-purple-50/40 rounded-3xl border border-indigo-200 p-6 sm:p-7 flex flex-col justify-between hover:border-indigo-500 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-black tracking-wider uppercase">
                  TYPE D
                </div>
                <h3 className="text-lg font-black text-slate-900 leading-snug min-h-[50px]">
                  SEO를 직접 배우고<br />운영하고 싶습니다.
                </h3>
                
                <div className="pt-3 border-t border-indigo-200/60">
                  <span className="text-xs font-bold text-indigo-900 block mb-2">추천:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-black shadow-2xs">SEO System 300</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    단순한 SEO 이론 강의가 아니라 실제 SEO 도구와 시스템을 이용해 프로젝트를 진행하는 실전 교육입니다.
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-indigo-200/60">
                <a
                  href={SERVICE_URLS.seoSystem300}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <span>SEO System 300 자세히 보기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>

          {/* ============================================================ */}
          {/* TYPE D: PREMIUM HIGHLIGHT CARD (Full Spectrum Visualization) */}
          {/* ============================================================ */}
          <div className="mt-12 bg-slate-900 text-white rounded-3xl border border-slate-800 p-8 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
              
              <div className="lg:col-span-6 space-y-4 text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-300 text-xs font-black uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>PREMIUM PRACTICAL PROGRAM</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                  SEO System 300<br />
                  <span className="text-indigo-400">실전 운영 마스터 프로그램</span>
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
                  단순한 SEO 이론 강의가 아니라<br className="hidden sm:inline" />
                  <strong>실제 SEO 도구와 시스템을 이용해 프로젝트를 진행하는 실전 교육입니다.</strong>
                </p>

                <div className="pt-2">
                  <a
                    href={SERVICE_URLS.seoSystem300}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-7 py-4 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo-600/30 transition-all group"
                  >
                    <span>SEO System 300 자세히 보기</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Right: Visual Inclusion 6 Core Blocks (CatchDomain, Website, Content, Backlink, Traffic, 1:1 Training) */}
              <div className="lg:col-span-6">
                <div className="bg-slate-950/80 rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-400 flex items-center justify-between pb-2 border-b border-slate-800">
                    <span>포함 영역 시각화 (ALL-IN-ONE INCLUDED)</span>
                    <span className="text-indigo-400 font-mono text-[10px]">6 CORE CURRICULUM</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1">
                    
                    {/* 1. CatchDomain */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center shrink-0 border border-blue-800/40 text-xs">
                        <Globe className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-200">CatchDomain</span>
                    </div>

                    {/* 2. Website */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0 border border-cyan-800/40 text-xs">
                        <Monitor className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-200">Website</span>
                    </div>

                    {/* 3. Content */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 border border-amber-800/40 text-xs">
                        <FileText className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-200">Content</span>
                    </div>

                    {/* 4. Backlink */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/40 text-xs">
                        <LinkIcon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-200">Backlink</span>
                    </div>

                    {/* 5. Traffic */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-950 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-800/40 text-xs">
                        <TrendingUp className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-slate-200">Traffic</span>
                    </div>

                    {/* 6. 1:1 Training */}
                    <div className="bg-slate-900 p-3 rounded-xl border border-indigo-500/40 ring-1 ring-indigo-500/20 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 text-xs">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-black text-indigo-300">1:1 Training</span>
                    </div>

                  </div>

                  <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/60">
                    <span>수강생 전용 실무 SaaS 도구 및 프라이빗 멘토링 세션 제공</span>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. SEO SYSTEM 300 DEDICATED SECTION (Distinct Atmosphere)     */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 text-white border-b border-slate-800 relative overflow-hidden">
        
        {/* Ambient Grid Pattern & Lights */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative space-y-8">
          
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-widest uppercase shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            <span>LEARN THE SYSTEM</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            이 시스템을 직접 운영하고 싶다면?
          </h2>

          {/* Body Text */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            SEO System 300에서는 단순히 강의를 듣는 것에 그치지 않고<br className="hidden sm:inline" />
            실제 프로젝트를 만들고 필요한 SEO 작업을 직접 실행합니다.
          </p>

          {/* 3 Core Highlights Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left max-w-3xl mx-auto">
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 space-y-1">
              <div className="text-indigo-400 font-mono text-xs font-bold">PRACTICAL PROJECT</div>
              <div className="text-sm font-bold text-white">실제 도메인&사이트 구축</div>
              <div className="text-xs text-slate-400">수강생 본인 프로젝트 직접 운영</div>
            </div>
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 space-y-1">
              <div className="text-indigo-400 font-mono text-xs font-bold">TOOL WORKFLOW</div>
              <div className="text-sm font-bold text-white">실무 도구 파이프라인 연동</div>
              <div className="text-xs text-slate-400">AI 콘텐츠 & 백링크 엔진 실습</div>
            </div>
            <div className="bg-slate-900/80 border border-indigo-500/20 rounded-2xl p-4 space-y-1">
              <div className="text-indigo-400 font-mono text-xs font-bold">1:1 CODE AUDIT</div>
              <div className="text-sm font-bold text-white">온페이지 코드 전수 감사</div>
              <div className="text-xs text-slate-400">300가지 테크니컬 체크리스트</div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-6">
            <a
              href={SERVICE_URLS.seoSystem300}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-9 py-4 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all group"
            >
              <span>SEO System 300 보기</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 6. CASE STUDY SECTION (Component Architecture with SAMPLE)   */}
      {/* ============================================================ */}
      <section id="case-studies" className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide">
              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
              <span>PROVEN TRACK RECORD STRUCTURE</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              실제 검증을 위한 성과 데이터 구조
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              확인되지 않은 과장된 순위나 매출 수치를 임의로 기재하지 않습니다.<br className="hidden sm:inline" />
              실제 프로젝트 데이터를 검증하여 기록할 수 있는 표준화된 케이스 스터디 프레임워크입니다.
            </p>

            {/* Explanatory Notice */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium text-left">
              <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">SAMPLE</span>
              <span>아래 카드는 실제 데이터 입력 및 연동을 위한 예시 템플릿(SAMPLE) 구조입니다.</span>
            </div>
          </div>

          {/* Case Study Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-slate-50/70 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-7 space-y-5 relative transition-all group hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between">
              
              {/* Top Header & Sample Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                    Case #01
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black tracking-wider uppercase">
                      SAMPLE
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-blue-600 mb-0.5">B2B SaaS 솔루션</div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                    기업용 협업 툴 플랫폼
                  </h3>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500">Target Keyword</div>
                  <div className="text-xs font-bold text-slate-800 truncate font-mono">
                    "클라우드 업무 협업 툴 추천"
                  </div>
                </div>
              </div>

              {/* Metric Comparison Metrics */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-200/80">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Before Rank</div>
                  <div className="text-sm font-bold text-slate-500 font-mono">
                    순위권 밖 (50위+)
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">After Rank</div>
                  <div className="text-base font-black text-blue-600 font-mono flex items-center gap-1">
                    <span>1페이지 3위</span>
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">Traffic Change</div>
                  <div className="text-xs font-bold text-emerald-600 font-mono">
                    오가닉 유입 +280%
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">Period</div>
                  <div className="text-xs font-bold text-slate-700 font-mono">
                    90일 (3개월)
                  </div>
                </div>
              </div>

              {/* Used Services Tags */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500">Used Services</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    CatchDomain
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    AI Content
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    SEOFLOW
                  </span>
                </div>
              </div>

            </div>

            {/* Card 2 */}
            <div className="bg-slate-50/70 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-7 space-y-5 relative transition-all group hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between">
              
              {/* Top Header & Sample Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                    Case #02
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black tracking-wider uppercase">
                      SAMPLE
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-emerald-600 mb-0.5">글로벌 이커머스</div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    프리미엄 뷰티 라이프스타일 샵
                  </h3>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500">Target Keyword</div>
                  <div className="text-xs font-bold text-slate-800 truncate font-mono">
                    "비건 스킨케어 브랜드 순위"
                  </div>
                </div>
              </div>

              {/* Metric Comparison Metrics */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-200/80">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Before Rank</div>
                  <div className="text-sm font-bold text-slate-500 font-mono">
                    3페이지 28위
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">After Rank</div>
                  <div className="text-base font-black text-emerald-600 font-mono flex items-center gap-1">
                    <span>1페이지 2위</span>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">Traffic Change</div>
                  <div className="text-xs font-bold text-emerald-600 font-mono">
                    클릭수 +340% 증가
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">Period</div>
                  <div className="text-xs font-bold text-slate-700 font-mono">
                    60일 (2개월)
                  </div>
                </div>
              </div>

              {/* Used Services Tags */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500">Used Services</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    SEO Website
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    AI Content
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    Traffic Signal
                  </span>
                </div>
              </div>

            </div>

            {/* Card 3 */}
            <div className="bg-slate-50/70 border border-slate-200 hover:border-blue-300 rounded-3xl p-6 sm:p-7 space-y-5 relative transition-all group hover:shadow-lg hover:shadow-slate-100 flex flex-col justify-between">
              
              {/* Top Header & Sample Badge */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 font-mono text-[11px] font-bold">
                    Case #03
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-black tracking-wider uppercase">
                      SAMPLE
                    </span>
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-indigo-600 mb-0.5">전문직 법률/세무 서비스</div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-700 transition-colors">
                    상속·증여 전문 법무법인
                  </h3>
                </div>

                <div className="p-3 bg-white rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-[11px] font-semibold text-slate-500">Target Keyword</div>
                  <div className="text-xs font-bold text-slate-800 truncate font-mono">
                    "상속세 절세 전문 상담"
                  </div>
                </div>
              </div>

              {/* Metric Comparison Metrics */}
              <div className="grid grid-cols-2 gap-3 py-2 border-y border-slate-200/80">
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">Before Rank</div>
                  <div className="text-sm font-bold text-slate-500 font-mono">
                    신규 도메인 (0위)
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] text-slate-500 font-medium">After Rank</div>
                  <div className="text-base font-black text-indigo-600 font-mono flex items-center gap-1">
                    <span>1페이지 1위 점유</span>
                    <TrendingUp className="w-3.5 h-3.5 text-indigo-600" />
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">Traffic Change</div>
                  <div className="text-xs font-bold text-emerald-600 font-mono">
                    상담 문의 월 45건+
                  </div>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-[11px] text-slate-500 font-medium">Period</div>
                  <div className="text-xs font-bold text-slate-700 font-mono">
                    120일 (4개월)
                  </div>
                </div>
              </div>

              {/* Used Services Tags */}
              <div className="space-y-2">
                <div className="text-[11px] font-semibold text-slate-500">Used Services</div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    CatchDomain
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    SEO System 300
                  </span>
                  <span className="px-2 py-1 bg-white border border-slate-200 text-slate-700 text-[11px] font-bold rounded-lg">
                    SEOFLOW
                  </span>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Note */}
          <div className="text-center text-xs text-slate-400">
            * 고객사 데이터 보호를 위해 실제 계약 프로젝트의 고유 식별자는 비식별 처리되어 등록됩니다.
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 7. WHY ONOFF (4 Key Differentiators)                          */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
        
        {/* Background Lights */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
          
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>THE ONOFF DIFFERENCE</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              도구만 만든 회사가 아닙니다.
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              온오프마케팅은 단순한 소프트웨어 공급자나 이론적 보고서 작성자가 아닙니다.<br className="hidden sm:inline" />
              실제 검색 환경에서 부딪히며 검증된 실무 기술을 하나의 실행 체계로 구현했습니다.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* Pillar 1: SEO Practitioner */}
            <div className="bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/60 rounded-3xl p-7 sm:p-9 space-y-4 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Activity className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">PILLAR 01</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-blue-400 tracking-wider">SEO PRACTITIONER</div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  실무 SEO 경험을 기반으로 개발
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                검색엔진의 수많은 코어 알고리즘 업데이트, 색인 누락 현상, 불공정 페널티 해제 등 현장에서 직접 체득한 수백 건의 실전 대응 데이터와 필드 노하우를 모든 솔루션에 내재화했습니다.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-blue-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>현장 중심의 알고리즘 대응 및 E-E-A-T 검증 프로토콜</span>
              </div>
            </div>

            {/* Pillar 2: Own Technology */}
            <div className="bg-slate-800/80 border border-slate-700/80 hover:border-cyan-500/60 rounded-3xl p-7 sm:p-9 space-y-4 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                  <Code2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">PILLAR 02</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-cyan-400 tracking-wider">OWN TECHNOLOGY</div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  필요한 기능을 직접 시스템화
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                외부 유료 툴에 의존하여 단편적인 데이터만 전달하지 않습니다. CatchDomain, SEOFLOW 등 검색엔진 최적화에 필요한 독자적인 자체 SaaS 기술 인프라를 직접 구축하여 영속적인 품질을 제공합니다.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-cyan-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>CatchDomain &amp; SEOFLOW 등 독자 기술 인프라 보유</span>
              </div>
            </div>

            {/* Pillar 3: Connected Workflow */}
            <div className="bg-slate-800/80 border border-slate-700/80 hover:border-indigo-500/60 rounded-3xl p-7 sm:p-9 space-y-4 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Workflow className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">PILLAR 03</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-indigo-400 tracking-wider">CONNECTED WORKFLOW</div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  도메인부터 콘텐츠·백링크·트래픽까지 연결
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                각 작업이 고립되지 않습니다. 도메인의 신뢰 자산 선점부터 테크니컬 온페이지 최적화, 정기 전문 콘텐츠 발행, 알고리즘 세이프 Do-Follow 백링크, 실유저 트래픽 시그널까지 유기적인 하나의 파이프라인으로 순환합니다.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-indigo-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>5단계 원스톱 통합 파이프라인으로 시너지 극대화</span>
              </div>
            </div>

            {/* Pillar 4: Execution Focused */}
            <div className="bg-slate-800/80 border border-slate-700/80 hover:border-amber-500/60 rounded-3xl p-7 sm:p-9 space-y-4 transition-all group">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Rocket className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-500">PILLAR 04</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs font-mono font-bold text-amber-400 tracking-wider">EXECUTION FOCUSED</div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  분석에서 끝나지 않고 실제 실행까지 고려
                </h3>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed font-normal">
                수십 페이지의 이론적인 보고서만 전달하고 클라이언트에게 숙제를 남기지 않습니다. 웹사이트 코드 수정, E-E-A-T 원고 발행, 백링크 배포 등 순위를 올리기 위해 필요한 모든 구체적 액션을 온오프마케팅이 직접 실행합니다.
              </p>

              <div className="pt-2 flex items-center gap-2 text-xs text-amber-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>기획/보고서에 머물지 않고 실제 프로덕션 코드&콘텐츠 직접 구현</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 8. FINAL CTA SECTION (Large SaaS CTA with Precise Copy)      */}
      {/* ============================================================ */}
      <section className="py-20 lg:py-28 bg-slate-50 border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 sm:p-14 lg:p-16 shadow-2xl relative overflow-hidden text-center space-y-8 border border-slate-800">
            
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative max-w-3xl mx-auto space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>START YOUR SEO ARCHITECTURE</span>
              </div>

              {/* Requested Heading */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight sm:leading-tight">
                SEO에서 지금 무엇부터 해야 할지<br />
                <span className="text-blue-400">확인해보세요.</span>
              </h2>

              {/* Requested Body Text */}
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
                사이트가 있다면 현재 상황부터 확인하고<br className="hidden sm:inline" />
                사이트가 없다면 구축 단계부터 함께 설계할 수 있습니다.
              </p>

              {/* CTA Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                
                {/* Primary CTA */}
                <button
                  onClick={() => openConsult()}
                  className="w-full sm:w-auto min-h-[48px] px-9 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>SEO 상담 시작하기</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Secondary CTA */}
                <a
                  href="#services-journey"
                  className="w-full sm:w-auto min-h-[48px] px-8 py-4 rounded-full bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-base border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <span>서비스 전체 보기</span>
                </a>

              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>알고리즘 안전 가이드라인 준수</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-blue-400" />
                  <span>과장 수치 및 무리한 약속 배제</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>단계별 독립 또는 올인원 선택 가능</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
