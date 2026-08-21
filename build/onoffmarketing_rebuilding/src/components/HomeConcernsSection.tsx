import { Search, FileText, Users } from 'lucide-react';

const concerns = [
  {
    icon: <Search className="w-6 h-6" />,
    title: '검색 노출이 안 돼요',
    desc: '홈페이지는 있지만 네이버나 구글에서 잘 보이지 않습니다.',
    tone: 'bg-blue-50 text-blue-700',
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: '콘텐츠 관리가 어려워요',
    desc: '무슨 글을 써야 할지 모르고 꾸준히 관리하기 어렵습니다.',
    tone: 'bg-amber-50 text-amber-700',
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: '방문자가 부족해요',
    desc: '홈페이지를 만들었지만 실제 방문과 문의가 부족합니다.',
    tone: 'bg-emerald-50 text-emerald-700',
  },
];

export default function HomeConcernsSection() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80" aria-labelledby="home-concerns-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          id="home-concerns-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center tracking-tight mb-10 sm:mb-12"
        >
          이런 고민이 있으신가요?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {concerns.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-slate-200 p-6 text-left shadow-sm">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${item.tone}`}>{item.icon}</div>
              <h3 className="text-lg font-extrabold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
