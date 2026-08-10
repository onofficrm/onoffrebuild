import { MonitorSmartphone, Rocket, Search } from 'lucide-react';

const steps = [
  {
    num: '01',
    icon: <Search className="w-10 h-10 text-blue-600" />,
    title: 'SEO / AEO 구조 설계',
    items: [
      '검색엔진이 이해하기 쉬운 메뉴 구조',
      'AI 검색에 대응하는 질문형 콘텐츠 구조',
      '업종별 키워드 페이지 설계'
    ]
  },
  {
    num: '02',
    icon: <MonitorSmartphone className="w-10 h-10 text-blue-600" />,
    title: '홈페이지 제작 / 직접 제작 교육',
    items: [
      '직접 제작 가능한 온라인 강의 제공',
      '맞춤형 홈페이지 제작 의뢰 가능',
      '수정과 확장이 쉬운 웹 빌더 구조'
    ]
  },
  {
    num: '03',
    icon: <Rocket className="w-10 h-10 text-blue-600" />,
    title: '트래픽 · 블로그 · 카페포스팅 실행',
    items: [
      '홈페이지 제작 후 즉각적인 노출 실행',
      '양질의 콘텐츠 발행 및 커뮤니티 확산',
      '검색 유입을 보조하는 트래픽 서비스'
    ]
  }
];

export default function SolutionSection() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            온오프마케팅은 홈페이지 제작 후 <br className="hidden md:block" />
            <span className="text-blue-700">노출까지 함께 설계</span>합니다.
          </h2>
          <p className="text-lg text-slate-600">제작으로 끝나는 것이 아닌, 실제 트래픽과 문의를 만들어내는 3단계 프로세스</p>
        </div>

        <div className="relative">
          {/* Timeline connecting line for desktop */}
          <div className="hidden lg:block absolute top-[120px] left-0 right-0 h-0.5 bg-blue-200"></div>

          <div className="grid lg:grid-cols-3 gap-10 lg:gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative z-10 pt-8 lg:pt-0">
                <div className="hidden lg:flex absolute top-[102px] left-1/2 -translate-x-1/2 w-10 h-10 bg-white border-4 border-blue-100 rounded-full items-center justify-center -z-10 shadow-sm">
                   <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                </div>
                
                <div className="bg-white rounded-2xl p-8 shadow-lg shadow-slate-200/50 border border-slate-100 h-full flex flex-col relative mt-0 lg:mt-32">
                  <div className="absolute -top-10 left-8">
                    <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center shadow-inner border border-blue-100">
                      {step.icon}
                    </div>
                  </div>
                  
                  <div className="absolute top-6 right-6 text-6xl font-black text-slate-50 opacity-50 select-none pointer-events-none">
                    {step.num}
                  </div>

                  <div className="pt-10 flex-grow">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">
                      <span className="text-blue-700 text-sm font-semibold tracking-wider block mb-2">{step.num} STEP</span>
                      {step.title}
                    </h3>
                    <ul className="space-y-4">
                      {step.items.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="w-5 h-5 flex-shrink-0 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5">✓</span>
                          <span className="text-slate-600 text-sm font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
