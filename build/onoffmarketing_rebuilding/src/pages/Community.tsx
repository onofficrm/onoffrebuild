import { Bell, HelpCircle, Youtube, ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const boards = [
  {
    href: '/notice',
    title: '공지사항',
    desc: '온오프마케팅의 새로운 소식과 업데이트 내역을 전해드립니다.',
    icon: Bell,
    tone: {
      icon: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white',
      cta: 'text-indigo-600',
    },
  },
  {
    href: '/faq',
    title: '자주 묻는 질문',
    desc: '서비스 이용에 대해 고객님들이 궁금해하시는 점들을 모았습니다.',
    icon: HelpCircle,
    tone: {
      icon: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
      cta: 'text-blue-600',
    },
  },
  {
    href: '/youtube',
    title: '유튜브 콘텐츠',
    desc: '마케팅 노하우와 홈페이지 제작 꿀팁을 영상으로 만나보세요.',
    icon: Youtube,
    tone: {
      icon: 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white',
      cta: 'text-red-600',
    },
  },
] as const;

const highlights = [
  { title: '공지·업데이트', href: '/notice', label: '공지사항 바로가기', tip: '서비스 변경, 휴무, 신규 기능 안내' },
  { title: 'FAQ 검색', href: '/faq', label: 'FAQ 바로가기', tip: '제작 기간, SEO, 트래픽 등 자주 묻는 답변' },
  { title: '영상 가이드', href: '/youtube', label: '유튜브게시판 바로가기', tip: '실전 마케팅·홈페이지 제작 노하우' },
];

export default function Community() {
  return (
    <main className="pt-20">
      <section className="py-20 lg:py-28 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-bold mb-6 tracking-wide">
            COMMUNITY
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            온오프마케팅 <span className="text-blue-400">커뮤니티</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-0 leading-relaxed font-medium max-w-3xl mx-auto">
            공지사항, 자주 묻는 질문, 유튜브 콘텐츠를 통해 <br className="hidden sm:block" />
            홈페이지 제작과 온라인마케팅 정보를 확인해보세요.
          </p>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid md:grid-cols-3 gap-6">
            {boards.map((board) => {
              const Icon = board.icon;
              return (
                <a
                  key={board.href}
                  href={board.href}
                  className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl transition-all group block"
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-colors ${board.tone.icon}`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{board.title}</h3>
                  <p className="text-slate-600 font-medium mb-6">{board.desc}</p>
                  <div className={`font-bold flex items-center text-sm ${board.tone.cta}`}>
                    바로가기 <ArrowRight size={16} className="ml-1" />
                  </div>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">게시판 바로가기</h2>
              <p className="text-slate-500 mt-2 font-medium">실제 게시판으로 이동해 글 목록·보기·글쓰기를 이용하세요.</p>
            </div>
            <Link to="/consult" className="inline-flex items-center text-sm font-bold text-blue-700 hover:text-blue-900">
              상담이 필요하신가요? <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="space-y-4">
            {highlights.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-2xl px-6 py-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-1">
                    <Calendar size={14} /> COMMUNITY
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{item.title}</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">{item.tip}</p>
                </div>
                <span className="inline-flex items-center text-sm font-extrabold text-blue-700 shrink-0">
                  {item.label} <ArrowRight size={16} className="ml-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
