import { ArrowRight, Search, Code2, PenTool, MessageSquareText, Zap, Blocks, CheckCircle2 } from 'lucide-react';

export default function Company() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-blue-900 border-b border-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-800 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-800/50 text-blue-200 border border-blue-700/50 rounded-full text-sm font-bold mb-6">
            회사 소개
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            홈페이지 제작 이후의 <br className="hidden md:block" />
            <span className="text-yellow-400">노출까지 생각하는</span> 온오프마케팅
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            온오프마케팅은 홈페이지를 만들고 끝내지 않습니다. <br className="hidden sm:block" />
            SEO/AEO 구조 설계부터 트래픽, 블로그, 카페포스팅까지 검색노출에 필요한 실행 전략을 함께 고민합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20">
              무료 상담 신청하기
            </button>
            <button className="px-8 py-4 bg-blue-800/50 text-white border border-blue-700 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors">
              서비스 보기
            </button>
          </div>
        </div>
      </section>

      {/* 1. 회사 소개 섹션 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              온오프마케팅은 <span className="text-blue-700">실행 중심의 온라인마케팅</span> 회사입니다.
            </h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Code2 size={32} />, title: '홈페이지 제작', color: 'text-blue-600', bg: 'bg-blue-50' },
              { icon: <Search size={32} />, title: 'SEO/AEO 구조 설계', color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { icon: <Zap size={32} />, title: '트래픽 서비스', color: 'text-yellow-600', bg: 'bg-yellow-50' },
              { icon: <PenTool size={32} />, title: '블로그포스팅', color: 'text-orange-600', bg: 'bg-orange-50' },
              { icon: <MessageSquareText size={32} />, title: '카페포스팅', color: 'text-purple-600', bg: 'bg-purple-50' },
              { icon: <Blocks size={32} />, title: '마케팅 자동화', color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { icon: <Code2 size={32} />, title: '플랫폼 제작 기획', color: 'text-pink-600', bg: 'bg-pink-50' }
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 rounded-2xl p-6 text-center border border-slate-100 hover:border-blue-200 transition-colors hover:shadow-md">
                <div className={`w-16 h-16 mx-auto ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 운영 철학 섹션 */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="max-w-3xl">
             <div className="inline-block px-3 py-1 bg-slate-800 text-yellow-400 text-xs font-bold rounded-full mb-6 uppercase tracking-wider">
               Our Philosophy
             </div>
             <h2 className="text-3xl md:text-4xl font-bold mb-10 tracking-tight leading-tight">
               예쁜 홈페이지보다 중요한 것은 <br className="hidden sm:block" />
               <span className="text-blue-400">검색되고 문의가 들어오는 구조</span>입니다.
             </h2>
             <ul className="space-y-6">
                {[
                  '만들고 끝나는 홈페이지가 아니라 노출되는 홈페이지',
                  '디자인보다 중요한 검색 구조의 설계',
                  '사업자가 직접 이해하고 운영할 수 있는 구조',
                  '홈페이지와 콘텐츠 마케팅이 유기적으로 연결되는 구조',
                  'SEO(검색엔진최적화)와 AEO(AI답변최적화)를 함께 고려하는 구조'
                ].map((text, idx) => (
                  <li key={idx} className="flex items-start text-lg text-slate-300 font-medium">
                    <span className="w-8 h-8 rounded-full bg-blue-900/50 text-blue-400 flex items-center justify-center mr-4 shrink-0 font-bold border border-blue-800">{idx + 1}</span>
                    <span className="mt-1">{text}</span>
                  </li>
                ))}
             </ul>
           </div>
         </div>
      </section>

      {/* 3. 온오프마케팅이 하는 일 */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              온오프마케팅이 하는 일
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: '홈페이지 제작', desc: '검색 노출과 문의 전환에 최적화된 반응형 웹사이트 및 랜딩페이지를 제작합니다.' },
              { title: 'SEO/AEO 기획', desc: '검색엔진(SEO)과 AI답변(AEO)에 모두 대응할 수 있는 사이트 구조와 콘텐츠 전략을 설계합니다.' },
              { title: '콘텐츠 포스팅', desc: '블로그와 커뮤니티(카페) 기반의 정보성 콘텐츠를 발행하여 잠재고객과 소통합니다.' },
              { title: '트래픽 실행', desc: '홈페이지와 콘텐츠에 안전한 방문자 흐름을 만들어 초기 활성화를 돕습니다.' },
              { title: '자동화 플랫폼', desc: 'iCRM, 채팅 챗봇, 애드센스 자동화 등 마케팅 효율을 높이는 플랫폼을 구축합니다.' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center mb-5 font-bold text-lg">
                  0{idx + 1}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 이런 고객에게 적합합니다 */}
      <section className="py-24 bg-white">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="bg-blue-50 rounded-3xl p-8 md:p-12 border border-blue-100">
             <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center tracking-tight">
               이런 분들께 <span className="text-blue-700">온오프마케팅</span>을 추천합니다
             </h2>
             <div className="space-y-4 max-w-2xl mx-auto">
               {[
                 '검색 노출이 잘 되는 홈페이지를 새로 만들고 싶은 사업자',
                 '기존 홈페이지가 있지만 유입과 문의가 없어 고민인 사업자',
                 '블로그와 카페를 통해 브랜드 신뢰도와 브랜딩이 필요한 사업자',
                 '앞으로 다가올 AI 검색 시대(AEO)에 대비하고 싶은 사업자',
                 '직접 홈페이지 구조를 이해하고 주도적으로 운영하고 싶은 사업자'
               ].map((text, idx) => (
                 <div key={idx} className="flex items-center bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                   <CheckCircle2 className="text-blue-600 mr-3 shrink-0" size={24} />
                   <span className="text-slate-700 font-bold">{text}</span>
                 </div>
               ))}
             </div>
           </div>
         </div>
      </section>

    </main>
  );
}
