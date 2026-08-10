import { ExternalLink, Layers, ArrowRight, ArrowUpRight, CheckCircle2, Megaphone, DollarSign, Cpu, Activity, ShieldCheck, Database, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OnoffCpaSection() {
  // 6-step flow diagram steps as requested
  const cpaFlowSteps = [
    { step: '01', title: '광고주 등록', desc: '캠페인 및 조건 세팅' },
    { step: '02', title: '상품 노출', desc: '파트너 피드에 등록' },
    { step: '03', title: '파트너 홍보', desc: '멀티 채널 유입 창출' },
    { step: '04', title: '유입 발생', desc: '실시간 타겟 트래픽' },
    { step: '05', title: '전환 관리', desc: '어뷰징 검증 & DB 수집' },
    { step: '06', title: '성과 정산', desc: '자동 승인 및 입금 처리' },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden border-b border-slate-800" id="onoff-cpa">
      {/* Decorative BG Blur & Grid */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/80 text-yellow-400 text-xs sm:text-sm font-extrabold mb-4 border border-blue-700/60 shadow-inner">
            <Layers size={16} className="mr-2" />
            온오프마케팅 핵심 제휴 플랫폼
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            광고주와 파트너를 연결하는 <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              성과형 제휴마케팅 플랫폼 [온오프CPA]
            </span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium mb-8">
            광고주 상품 등록부터 파트너 홍보, 리드 수집, 전환 관리, 정산 운영까지 연결되는 CPA/CPS 플랫폼입니다.
          </p>

          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://onoffcpa.icrm.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-extrabold text-base hover:bg-yellow-300 transition-all shadow-xl shadow-yellow-500/20 group border border-yellow-300"
            >
              온오프CPA 플랫폼 가기
              <ArrowUpRight className="ml-2 w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <Link
              to="/onoffcpa"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-base hover:bg-slate-700 transition-all shadow-md"
            >
              <Cpu className="w-5 h-5 mr-2 text-yellow-400" />
              온오프CPA 상세 안내 보기
            </Link>
          </div>
        </div>

        {/* Live Dashboard System Banner */}
        <div className="bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-700/80 shadow-xl mb-12 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-white">
              CPA/CPS Live Data Hub
            </span>
            <span className="text-xs font-medium text-slate-400 hidden sm:inline">
              | 어뷰징 필터링 & 실시간 수집 가동 중
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold text-slate-300">
            <div className="flex items-center text-emerald-400">
              <ShieldCheck size={14} className="mr-1" />
              보안 인증
            </div>
            <div className="flex items-center text-yellow-400">
              <Zap size={14} className="mr-1" />
              자동 승인 엔진
            </div>
            <div className="flex items-center text-blue-400">
              <Database size={14} className="mr-1" />
              iCRM 연동
            </div>
          </div>
        </div>

        {/* 3-Split Card Grid (광고주용 / 파트너용 / 플랫폼 운영용) */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          {/* Card A: 광고주용 */}
          <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-slate-700 hover:border-blue-500 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-blue-900/80 rounded-xl flex items-center justify-center text-blue-400 border border-blue-700/60 shadow-inner group-hover:scale-110 transition-transform">
                  <Megaphone size={24} />
                </div>
                <span className="px-3 py-1 bg-blue-950 text-blue-300 text-xs font-extrabold rounded-full border border-blue-800">
                  A. 광고주용
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-3">
                검증된 유효 리드 수집
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                허위 문의 없는 맑은 DB만 수집하세요. 성과 발생 시에만 과금되는 합리적 CPA 구조로 마케팅 ROI를 최고 수준으로 끌어올립니다.
              </p>

              {/* Required 4 key items */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/60 mb-6 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">핵심 기능 스택</div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-emerald-400 mr-2 shrink-0" />
                  상품 등록
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-emerald-400 mr-2 shrink-0" />
                  파트너 모집
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-emerald-400 mr-2 shrink-0" />
                  유입/전환 확인
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-emerald-400 mr-2 shrink-0" />
                  리드 관리 (iCRM 수집)
                </div>
              </div>
            </div>

            <a
              href="https://onoffcpa.icrm.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-blue-600 text-white text-center rounded-xl font-bold text-xs sm:text-sm hover:bg-blue-500 transition-colors flex items-center justify-center shadow-lg shadow-blue-600/30"
            >
              광고주 등록 바로가기
              <ExternalLink size={14} className="ml-1.5" />
            </a>
          </div>

          {/* Card B: 파트너용 */}
          <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-slate-700 hover:border-yellow-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-bl-full pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-yellow-900/60 rounded-xl flex items-center justify-center text-yellow-400 border border-yellow-700/60 shadow-inner group-hover:scale-110 transition-transform">
                  <DollarSign size={24} />
                </div>
                <span className="px-3 py-1 bg-yellow-950 text-yellow-300 text-xs font-extrabold rounded-full border border-yellow-800">
                  B. 파트너용
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-3">
                높은 단가 & 투명 정산
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                자신의 블로그, 소셜, 커뮤니티 채널을 활용해 승인된 캠페인을 홍보하고 정당한 마케팅 수익을 창출하세요.
              </p>

              {/* Required 4 key items */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/60 mb-6 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">핵심 기능 스택</div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-yellow-400 mr-2 shrink-0" />
                  상품 선택
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-yellow-400 mr-2 shrink-0" />
                  홍보 링크 운영
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-yellow-400 mr-2 shrink-0" />
                  성과 확인
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-yellow-400 mr-2 shrink-0" />
                  정산 확인
                </div>
              </div>
            </div>

            <a
              href="https://onoffcpa.icrm.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-yellow-400 text-slate-900 text-center rounded-xl font-extrabold text-xs sm:text-sm hover:bg-yellow-300 transition-colors flex items-center justify-center shadow-lg shadow-yellow-500/20"
            >
              파트너 가입하기
              <ExternalLink size={14} className="ml-1.5" />
            </a>
          </div>

          {/* Card C: 플랫폼 운영용 */}
          <div className="bg-slate-800/80 rounded-2xl p-8 border-2 border-slate-700 hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 bg-indigo-900/80 rounded-xl flex items-center justify-center text-indigo-400 border border-indigo-700/60 shadow-inner group-hover:scale-110 transition-transform">
                  <Cpu size={24} />
                </div>
                <span className="px-3 py-1 bg-indigo-950 text-indigo-300 text-xs font-extrabold rounded-full border border-indigo-800">
                  C. 플랫폼 운영용
                </span>
              </div>

              <h3 className="text-2xl font-extrabold text-white mb-3">
                자체 CPA 시스템 구축
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                온오프CPA와 동일한 수준의 제휴마케팅 솔루션 시스템을 독자 브랜드로 제작 및 도입할 수 있습니다.
              </p>

              {/* Required 4 key items */}
              <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-700/60 mb-6 space-y-2.5">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">핵심 기능 스택</div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-indigo-400 mr-2 shrink-0" />
                  다중 상품 관리
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-indigo-400 mr-2 shrink-0" />
                  데이터/리드 흐름 관리
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-indigo-400 mr-2 shrink-0" />
                  정산 및 상태 관리
                </div>
                <div className="flex items-center text-sm font-bold text-white">
                  <CheckCircle2 size={16} className="text-indigo-400 mr-2 shrink-0" />
                  확장 가능한 운영 구조
                </div>
              </div>
            </div>

            <Link
              to="/platform"
              className="w-full py-3.5 bg-indigo-600 text-white text-center rounded-xl font-bold text-xs sm:text-sm hover:bg-indigo-500 transition-colors flex items-center justify-center shadow-lg shadow-indigo-600/30"
            >
              플랫폼 제작 문의
              <ArrowRight size={14} className="ml-1.5" />
            </Link>
          </div>

        </div>

        {/* 6-Step Flow Diagram (간단한 흐름도) */}
        <div className="bg-slate-950 rounded-2xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Activity className="text-yellow-400 w-5 h-5" />
              <h3 className="text-white font-extrabold text-base sm:text-lg">
                온오프CPA 메커니즘 흐름도
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
              6-Step Workflow
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {cpaFlowSteps.map((step, idx) => (
              <div key={idx} className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 relative group hover:border-yellow-400/80 transition-colors">
                <span className="text-[10px] font-black text-yellow-400 block mb-1">
                  STEP {step.step}
                </span>
                <div className="text-sm font-extrabold text-white mb-1">
                  {step.title}
                </div>
                <div className="text-[11px] text-slate-400 font-medium leading-tight">
                  {step.desc}
                </div>

                {idx < cpaFlowSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-600">
                    <ArrowRight size={14} className="text-yellow-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

