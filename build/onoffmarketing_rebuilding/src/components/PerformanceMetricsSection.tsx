import { TrendingUp, Target, Users, Zap, Award, Sparkles, CheckCircle } from 'lucide-react';

const metrics = [
  {
    icon: <Target className="w-6 h-6 text-blue-600" />,
    badge: 'SEO & AEO Target',
    value: '94.2%',
    label: '검색 노출 최적화',
    subtext: '목표 타겟 키워드 네이버/구글 1페이지 노출 달성률',
    chartWidth: 'w-[94%]',
    color: 'from-blue-600 to-indigo-600'
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
    badge: 'Organic Traffic',
    value: '+340%',
    label: '유기적 트래픽 증가',
    subtext: 'SEO 및 콘텐츠 작업 3개월 후 월간 오가닉 유입 상승폭',
    chartWidth: 'w-[88%]',
    color: 'from-emerald-600 to-teal-600'
  },
  {
    icon: <Zap className="w-6 h-6 text-amber-600" />,
    badge: 'Lead Conversion',
    value: '4.8배',
    label: '문의 전환율 향상',
    subtext: '고전환 UI/UX 개편 후 방문자 대비 실질 상담 문의율',
    chartWidth: 'w-[82%]',
    color: 'from-amber-500 to-yellow-500'
  },
  {
    icon: <Award className="w-6 h-6 text-purple-600" />,
    badge: 'Automation Efficiency',
    value: '80% 절감',
    label: '콘텐츠 자동 운영',
    subtext: 'iCRM 및 자동 발행 시스템 도입 시 마케팅 소요시간',
    chartWidth: 'w-[80%]',
    color: 'from-purple-600 to-indigo-600'
  },
  {
    icon: <Users className="w-6 h-6 text-rose-600" />,
    badge: 'CPA Platform Scale',
    value: '1,200+',
    label: '플랫폼 확장성 (온오프CPA)',
    subtext: '활성화된 제휴 파트너 네트워크 & 리드 승인 시스템',
    chartWidth: 'w-[92%]',
    color: 'from-rose-600 to-pink-600'
  }
];

export default function PerformanceMetricsSection() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-yellow-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/80 text-yellow-400 text-xs sm:text-sm font-extrabold mb-4 border border-blue-700/60 shadow-inner">
            <Sparkles size={16} className="mr-2" />
            데이터와 수치로 증명하는 퍼포먼스
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            "보이는 결과를 만드는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500">실행형 마케팅</span>"
          </h2>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            추상적인 브랜딩을 넘어, 실제 검출되는 노출 순위, 오가닉 유입량, 문의 리드 전환 수치로 마케팅 성과를 지표화합니다.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {metrics.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-800/80 rounded-2xl p-7 border border-slate-700/80 hover:border-blue-500/80 transition-all duration-300 shadow-xl relative overflow-hidden group"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-700/60 shadow-inner">
                  {item.icon}
                </div>
                <span className="text-xs font-extrabold text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-700">
                  {item.badge}
                </span>
              </div>

              <div className="mb-4">
                <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight block mb-1 group-hover:text-yellow-400 transition-colors">
                  {item.value}
                </span>
                <h3 className="text-lg font-bold text-slate-200">
                  {item.label}
                </h3>
              </div>

              {/* Progress bar simulation */}
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden mb-4 border border-slate-700/50">
                <div className={`h-full bg-gradient-to-r ${item.color} rounded-full ${item.chartWidth} transition-all duration-1000`}></div>
              </div>

              <p className="text-slate-400 text-xs sm:text-sm font-medium leading-relaxed flex items-center">
                <CheckCircle size={14} className="text-emerald-400 mr-1.5 shrink-0" />
                {item.subtext}
              </p>
            </div>
          ))}

          {/* Special 6th Card: Live Performance Guarantee */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-800 rounded-2xl p-7 border border-blue-500/50 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
            <div>
              <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-300 text-xs font-bold rounded-full mb-4 border border-yellow-400/30">
                실행 커스텀 지표
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                맞춤 대시보드 연동
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium mb-6">
                프로젝트 착수 후 키워드 랭킹, 트래픽 유입 현황, 문의 접수 리드를 실시간 데이터로 투명하게 공유합니다.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-yellow-400 font-bold">
              <span>* 실시간 투명 리포팅 제공</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
