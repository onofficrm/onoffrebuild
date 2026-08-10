import { Briefcase, Search, Edit3, Network, Bot, CheckCircle2 } from 'lucide-react';

const targetList = [
  {
    icon: <Briefcase className="w-6 h-6 text-blue-700" />,
    title: '사업용 홈페이지가 필요한 대표님',
    desc: '보기만 예쁜 웹사이트가 아닌, 검색 노출과 카카오/전화 상담 문의로 직결되는 고전환 홈페이지가 필요한 사업주'
  },
  {
    icon: <Search className="w-6 h-6 text-indigo-700" />,
    title: '검색유입을 늘리고 싶은 업체',
    desc: '매월 소모되는 키워드 광고비를 절감하고, 네이버·구글 유기적 검색 1페이지 상위 노출 자산을 확보하려는 기업'
  },
  {
    icon: <Edit3 className="w-6 h-6 text-amber-700" />,
    title: '콘텐츠 마케팅이 필요한 운영자',
    desc: '꾸준한 업종 특화 원고 작성과 실행형 블로그/카페 바이럴 마케팅을 통해 브랜딩 노출을 극대화하려는 운영자'
  },
  {
    icon: <Network className="w-6 h-6 text-rose-700" />,
    title: 'CPA/CPS 플랫폼을 시작하려는 사업자',
    desc: '자체 유효 리드 수집 시스템 및 파트너 제휴 정산 플랫폼 구축으로 제휴마케팅 비즈니스를 개설하고 싶은 대표님'
  },
  {
    icon: <Bot className="w-6 h-6 text-purple-700" />,
    title: 'AI/자동화를 활용하고 싶은 마케터',
    desc: 'iCRM 고객 데이터 관리, 24시간 채팅자동화 시스템을 통해 상담/CS 리소스를 80% 이상 줄이고 싶은 담당자'
  }
];

export default function TargetAudienceSection() {
  return (
    <section className="py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-900 text-xs sm:text-sm font-extrabold mb-4 border border-blue-200">
            신뢰와 검증의 파트너십
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            "이런 분들에게 <span className="text-blue-700">적합</span>합니다"
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            실질적인 비즈니스 성장과 지속 가능한 유입 생태계를 원하는 분들에게 최상의 마케팅 실행 솔루션을 제공합니다.
          </p>
        </div>

        {/* 5 Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {targetList.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl p-7 border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs flex items-center justify-center border border-slate-200">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center text-xs font-extrabold text-blue-800">
                <CheckCircle2 size={16} className="text-emerald-500 mr-1.5 shrink-0" />
                맞춤형 실전 마케팅 프로세스 적용
              </div>
            </div>
          ))}

          {/* 6th Card: Guaranteed Partner Callout */}
          <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-slate-800 rounded-2xl p-7 text-white border border-blue-800 shadow-xl flex flex-col justify-between">
            <div>
              <div className="inline-block px-3 py-1 bg-yellow-400 text-slate-900 text-xs font-black rounded mb-4">
                1:1 전문가 맞춤 진단
              </div>
              <h3 className="text-xl font-extrabold text-white mb-2">
                맞춤형 마케팅 방향 진단
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                우리 회사 상황에 딱 맞는 홈페이지 제작과 SEO, 트래픽, 포스팅 조합을 무료로 진단해드립니다.
              </p>
            </div>

            <a
              href="#final-cta-section"
              className="w-full py-3 bg-yellow-400 text-slate-900 rounded-xl font-black text-xs sm:text-sm text-center hover:bg-yellow-300 transition-colors shadow-md shadow-yellow-500/20"
            >
              1:1 무료 상담 신청하기
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
