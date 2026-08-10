import { useState } from 'react';
import { Calculator, TrendingUp, DollarSign, Users, Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function CpaRoiCalculator() {
  const [mode, setMode] = useState<'advertiser' | 'partner'>('advertiser');

  // Advertiser state
  const [targetDbCount, setTargetDbCount] = useState<number>(300); // 월 목표 DB 수
  const [valuePerDb, setValuePerDb] = useState<number>(250000); // DB 1건당 평균 예상 매출 가치 (원)
  const [cpaPayout, setCpaPayout] = useState<number>(35000); // 1건당 파트너 지급 CPA 단가 (원)

  // Partner state
  const [dailyVisitors, setDailyVisitors] = useState<number>(3000); // 일 평균 방문자 수
  const [conversionRate, setConversionRate] = useState<number>(2.5); // 예상 DB 전환율 (%)
  const [partnerCpaRate, setPartnerCpaRate] = useState<number>(35000); // 선택 캠페인 평균 CPA 단가 (원)

  // Advertiser Calculations
  const totalRevenue = targetDbCount * valuePerDb; // 예상 총 매출액
  const totalMarketingCost = targetDbCount * cpaPayout; // 총 CPA 광고비
  const netProfit = totalRevenue - totalMarketingCost; // 예상 순수익
  const roi = totalMarketingCost > 0 ? Math.round((netProfit / totalMarketingCost) * 100) : 0;
  // 기존 CPC(클릭당 과금) 광고 대비 절감율 추정 (평균 CPC 이탈비용 감안)
  const estimatedCpcCost = totalRevenue * 0.35; // CPC 시 발생 비용 추정
  const savedAmount = Math.max(0, estimatedCpcCost - totalMarketingCost);

  // Partner Calculations
  const monthlyVisitors = dailyVisitors * 30;
  const monthlyDbs = Math.round((monthlyVisitors * (conversionRate / 100)));
  const monthlyIncome = monthlyDbs * partnerCpaRate;
  const yearlyIncome = monthlyIncome * 12;

  const formatKrw = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <section id="roi-calculator" className="py-20 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white relative overflow-hidden">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold mb-4 backdrop-blur-md">
            <Sparkles size={14} className="text-yellow-400" />
            <span>실시간 수익성 시뮤레이터</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-4 leading-tight">
            온오프CPA 도입 시 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-yellow-300">예상 ROI & 수익금</span> 계산기
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed">
            광고주와 파트너 마케터 모두의 관점에서 예상 DB 수량과 단가를 설정하여, 실시간으로 기대되는 매출 증대액과 예상 수익금을 산출해 보세요.
          </p>

          {/* Mode Switcher Toggle */}
          <div className="inline-flex p-1.5 bg-slate-800/90 rounded-2xl border border-slate-700/80 mt-8 shadow-inner">
            <button
              onClick={() => setMode('advertiser')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'advertiser'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2Icon size={16} />
              <span>광고주 ROI 시뮬레이션</span>
            </button>
            <button
              onClick={() => setMode('partner')}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                mode === 'partner'
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users size={16} />
              <span>파트너 마케터 수익 시뮬레이션</span>
            </button>
          </div>
        </div>

        {/* Calculator Body Grid */}
        {mode === 'advertiser' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Controls Column */}
            <div className="lg:col-span-7 bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-700/60">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Calculator className="mr-2 text-blue-400" size={20} />
                    광고주 캠페인 조건 설정
                  </h3>
                  <span className="text-xs text-blue-300 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-700/50 font-mono">
                    CPA 성과형 과금 모델
                  </span>
                </div>

                {/* Slider 1: Target DB Count */}
                <div className="mb-7">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-200">
                      월 목표 유효 DB 수 (상담/신청건)
                    </label>
                    <span className="text-base font-black text-blue-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {targetDbCount.toLocaleString()} 건
                    </span>
                  </div>
                  <input
                    type="range"
                    min="30"
                    max="2000"
                    step="10"
                    value={targetDbCount}
                    onChange={(e) => setTargetDbCount(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>30건</span>
                    <span>500건</span>
                    <span>1,000건</span>
                    <span>2,000건</span>
                  </div>
                </div>

                {/* Slider 2: DB Unit Sales Value */}
                <div className="mb-7">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-200">
                      DB 1건당 평균 계약/매출 가치
                    </label>
                    <span className="text-base font-black text-emerald-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {formatKrw(valuePerDb)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="1000000"
                    step="10000"
                    value={valuePerDb}
                    onChange={(e) => setValuePerDb(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>5만원</span>
                    <span>25만원</span>
                    <span>50만원</span>
                    <span>100만원</span>
                  </div>
                </div>

                {/* Slider 3: CPA Payout per DB */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-200">
                      파트너 지급 CPA 단가 (건당 성과 수수료)
                    </label>
                    <span className="text-base font-black text-yellow-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {formatKrw(cpaPayout)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="150000"
                    step="5000"
                    value={cpaPayout}
                    onChange={(e) => setCpaPayout(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>1만원</span>
                    <span>3.5만원</span>
                    <span>8만원</span>
                    <span>15만원</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <ShieldCheck size={14} className="text-blue-400 mr-1.5" />
                  실시간 허위/중복 DB 자동차단 적용
                </span>
                <span>불량 DB 승인거절 시 0원 처리</span>
              </div>
            </div>

            {/* Right Output Column */}
            <div className="lg:col-span-5 bg-gradient-to-b from-blue-900/90 to-slate-900 p-6 sm:p-8 rounded-3xl border border-blue-500/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <TrendingUp size={160} className="text-blue-300" />
              </div>

              <div>
                <div className="text-xs font-bold text-blue-300 uppercase tracking-widest mb-1 font-mono">
                  EXPECTED ADVERTISER PERFORMANCE
                </div>
                <h4 className="text-xl font-extrabold text-white mb-6">
                  월 예상 성과 리포트
                </h4>

                {/* Primary Metrics */}
                <div className="space-y-4 mb-6">
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-blue-500/30">
                    <div className="text-xs text-slate-400 font-medium mb-1">예상 월 매출 창출액</div>
                    <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
                      {formatKrw(totalRevenue)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-1">총 CPA 광고비</div>
                      <div className="text-lg font-bold text-yellow-400 font-mono">
                        {formatKrw(totalMarketingCost)}
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-1">예상 마케팅 ROI</div>
                      <div className="text-lg font-extrabold text-emerald-400 font-mono flex items-center">
                        <TrendingUp size={16} className="mr-1" />
                        +{roi}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-950/80 p-4 rounded-2xl border border-blue-400/30">
                    <div className="text-xs text-blue-200 font-bold mb-1 flex items-center">
                      <CheckCircle2 size={14} className="mr-1 text-yellow-300" />
                      CPC(클릭과금) 대비 예상 비용 절감
                    </div>
                    <div className="text-base font-extrabold text-yellow-300 font-mono">
                      약 {formatKrw(savedAmount)} 절감 효과
                    </div>
                  </div>
                </div>
              </div>

              <Link
                to="/consult"
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-2xl text-sm font-extrabold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 group"
              >
                <span>광고주 플랫폼 무료 도입 상담 신청</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ) : (
          /* Partner Calculator Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Controls */}
            <div className="lg:col-span-7 bg-slate-800/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-700/60">
                  <h3 className="text-lg font-bold text-white flex items-center">
                    <Calculator className="mr-2 text-amber-400" size={20} />
                    파트너 트래픽 및 전환 조건 설정
                  </h3>
                  <span className="text-xs text-amber-300 bg-amber-900/50 px-3 py-1 rounded-full border border-amber-700/50 font-mono">
                    마케터 제휴 수익금
                  </span>
                </div>

                {/* Slider 1: Daily Visitors */}
                <div className="mb-7">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-200">
                      보유 채널 일 평균 방문자 (블로그/SNS/카페/웹사이트)
                    </label>
                    <span className="text-base font-black text-amber-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {dailyVisitors.toLocaleString()} 명/일
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={dailyVisitors}
                    onChange={(e) => setDailyVisitors(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>500명</span>
                    <span>10,000명</span>
                    <span>30,000명</span>
                    <span>50,000명</span>
                  </div>
                </div>

                {/* Slider 2: DB Conversion Rate */}
                <div className="mb-7">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-200">
                      예상 DB 전환율 (%)
                    </label>
                    <span className="text-base font-black text-sky-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {conversionRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="8.0"
                    step="0.1"
                    value={conversionRate}
                    onChange={(e) => setConversionRate(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-sky-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>0.5% (일반)</span>
                    <span>2.5% (타겟팅)</span>
                    <span>5.0% (고전환)</span>
                    <span>8.0% (전문)</span>
                  </div>
                </div>

                {/* Slider 3: Campaign CPA Rate */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs sm:text-sm font-bold text-slate-200">
                      선택 캠페인 평균 CPA 수수료 단가
                    </label>
                    <span className="text-base font-black text-emerald-400 font-mono bg-slate-900 px-3 py-1 rounded-lg border border-slate-700">
                      {formatKrw(partnerCpaRate)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="15000"
                    max="100000"
                    step="5000"
                    value={partnerCpaRate}
                    onChange={(e) => setPartnerCpaRate(Number(e.target.value))}
                    className="w-full h-2.5 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                    <span>1.5만원</span>
                    <span>3.5만원</span>
                    <span>6만원</span>
                    <span>10만원</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center">
                  <Sparkles size={14} className="text-amber-400 mr-1.5" />
                  투명한 실시간 승인 집계 및 주/월 정기 출금
                </span>
                <span>원클릭 고유 홍보링크 제공</span>
              </div>
            </div>

            {/* Right Output Column */}
            <div className="lg:col-span-5 bg-gradient-to-b from-amber-950/90 to-slate-900 p-6 sm:p-8 rounded-3xl border border-amber-500/40 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <DollarSign size={160} className="text-amber-300" />
              </div>

              <div>
                <div className="text-xs font-bold text-amber-300 uppercase tracking-widest mb-1 font-mono">
                  ESTIMATED PARTNER EARNINGS
                </div>
                <h4 className="text-xl font-extrabold text-white mb-6">
                  파트너 예상 수익 리포트
                </h4>

                <div className="space-y-4 mb-6">
                  <div className="bg-slate-950/70 p-4 rounded-2xl border border-amber-500/30">
                    <div className="text-xs text-slate-400 font-medium mb-1">예상 월 수입</div>
                    <div className="text-2xl sm:text-3xl font-black text-yellow-300 font-mono tracking-tight">
                      {formatKrw(monthlyIncome)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-1">월 수집 DB 수</div>
                      <div className="text-lg font-extrabold text-white font-mono">
                        {monthlyDbs.toLocaleString()} 건
                      </div>
                    </div>

                    <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                      <div className="text-xs text-slate-400 font-medium mb-1">연간 추정 수익</div>
                      <div className="text-lg font-bold text-emerald-400 font-mono">
                        {formatKrw(yearlyIncome)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-950/60 p-4 rounded-2xl border border-amber-500/30">
                    <div className="text-xs text-amber-200 font-bold mb-1 flex items-center">
                      <CheckCircle2 size={14} className="mr-1 text-amber-400" />
                      실시간 트래킹 모니터링
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed">
                      클릭 수, 유효 DB 접수 수, 승인률 및 예상 정산액을 실시간 파트너 마이페이지에서 투명하게 확인 가능합니다.
                    </div>
                  </div>
                </div>
              </div>

              <a
                href="https://onoffcpa.icrm.co.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 rounded-2xl text-sm font-extrabold transition-all shadow-lg shadow-amber-500/30 flex items-center justify-center space-x-2 group"
              >
                <span>온오프CPA 파트너 가입 및 수익 시작하기</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform text-slate-950" />
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function Building2Icon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4" />
      <path d="M10 10h4" />
      <path d="M10 14h4" />
      <path d="M10 18h4" />
    </svg>
  );
}
