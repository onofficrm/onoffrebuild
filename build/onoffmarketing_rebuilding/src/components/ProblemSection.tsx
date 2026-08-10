import { FileQuestion, Layers, SearchX, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: <SearchX className="w-8 h-8 text-slate-400" />,
    title: '검색에 노출되지 않는 홈페이지',
    desc: '검색엔진과 AI가 이해하기 어려운 구조라면 좋은 디자인도 노출로 이어지기 어렵습니다.'
  },
  {
    icon: <FileQuestion className="w-8 h-8 text-slate-400" />,
    title: '콘텐츠가 부족한 홈페이지',
    desc: '업종 키워드와 질문형 콘텐츠가 부족하면 고객이 검색해도 발견되기 어렵습니다.'
  },
  {
    icon: <TrendingDown className="w-8 h-8 text-slate-400" />,
    title: '방문자 흐름이 없는 홈페이지',
    desc: '홈페이지는 있지만 유입이 없다면 문의 전환도 만들어지기 어렵습니다.'
  },
  {
    icon: <Layers className="w-8 h-8 text-slate-400" />,
    title: 'SEO/AEO 구조가 없는 홈페이지',
    desc: '검색엔진과 AI 답변 환경에 맞는 최적의 구조 설계가 필요합니다.'
  }
];

export default function ProblemSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
            홈페이지는 있는데, <span className="text-yellow-600">왜 문의가 없을까요?</span>
          </h2>
          <div className="w-20 h-1 bg-yellow-400 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {problems.map((item, idx) => (
            <div key={idx} className="bg-slate-50 rounded-2xl p-8 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all">
              <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center shadow-sm mb-6">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-3 leading-snug">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto bg-blue-900 rounded-3xl p-8 md:p-10 text-center shadow-xl shadow-blue-900/20 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-800 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-30"></div>
          
          <p className="relative z-10 text-xl md:text-2xl font-semibold text-white leading-relaxed">
            "홈페이지 제작의 목적은 예쁜 디자인이 아니라, <br className="hidden md:block" />
            <span className="text-yellow-400">검색되고 문의가 들어오는 구조</span>를 만드는 것입니다."
          </p>
        </div>

      </div>
    </section>
  );
}
