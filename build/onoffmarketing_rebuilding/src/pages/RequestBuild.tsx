import { SearchX, MousePointerClick, MessageSquareText, Settings, Search, CheckCircle2, ShieldCheck, Cpu, Code2, LineChart, MoveRight, Layers, LayoutTemplate, Building2, Server } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RequestBuild() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-blue-900 border-b border-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-800 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              홈페이지 제작, 이제 단순 디자인이 아니라 <br className="hidden md:block" />
              <span className="text-yellow-400">마케팅 구조까지 설계</span>해야 합니다.
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-medium">
              온오프마케팅은 홈페이지 제작부터 SEO 구조, 문의 전환, <br className="hidden sm:block" />
              AI 콘텐츠 운영까지 연결되는 사업용 홈페이지를 제작합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/consult"
                className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20 text-center"
              >
                홈페이지 제작 상담하기
              </Link>
              <Link 
                to="/portfolio"
                className="px-8 py-4 bg-blue-800/50 text-white border border-blue-700 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors text-center"
              >
                제작 사례 보기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 1. 고객 문제 제기 */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              홈페이지는 만들었는데 문의가 없다면, <br className="hidden sm:block" />
              <span className="text-blue-700">구조가 잘못된 것입니다.</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <LayoutTemplate size={28} />, title: '디자인은 예쁜데 검색 노출이 안 됨' },
              { icon: <MousePointerClick size={28} />, title: '방문자는 있는데 문의가 없음' },
              { icon: <CheckCircle2 size={28} />, title: '블로그와 홈페이지가 따로 움직임' },
              { icon: <SearchX size={28} />, title: 'SEO 설정이 되어 있지 않음' },
              { icon: <Cpu size={28} />, title: 'AI 시대에 맞는 콘텐츠 구조가 없음' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all">
                <div className="w-14 h-14 bg-red-50 text-red-500 rounded-xl flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 온오프마케팅 제작 방식 */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              제작 이후 운영까지 생각한 <br className="hidden sm:block" />
              홈페이지를 만듭니다.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '업종 분석', icon: <Search size={28} className="text-blue-600" /> },
              { title: 'SEO 키워드 구조 설계', icon: <Layers size={28} className="text-blue-600" /> },
              { title: '문의 전환형 화면 구성', icon: <MousePointerClick size={28} className="text-blue-600" /> },
              { title: 'AI 콘텐츠 운영 구조', icon: <Server size={28} className="text-blue-600" /> }
            ].map((item, idx) => (
              <div key={idx} className="bg-blue-50 p-8 rounded-2xl border border-blue-100 text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-xl">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 제작 프로세스 */}
      <section className="py-24 bg-slate-900 border-y border-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              제작 프로세스
            </h2>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {[
                { title: '1단계', desc: '상담 및 업종 분석' },
                { title: '2단계', desc: '사이트맵 및 키워드 설계' },
                { title: '3단계', desc: '메인/서브 디자인 제작' },
                { title: '4단계', desc: '게시판/문의폼/SEO 세팅' },
                { title: '5단계', desc: '오픈 및 운영 안내' }
              ].map((step, idx) => (
                <div key={idx} className="relative z-10 text-center">
                  <div className="w-16 h-16 mx-auto bg-slate-800 border-4 border-slate-900 rounded-full flex items-center justify-center text-yellow-400 font-bold text-xl mb-6 shadow-xl">
                    {idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-slate-400 font-medium">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. 추천 대상 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              이런 분들께 추천합니다
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              '병원, 학원, 법률, 인테리어, 로컬 비즈니스',
              'SEO 상위노출이 필요한 업체',
              '홈페이지를 제대로 운영하고 싶은 사업자',
              'AI 콘텐츠 자동화까지 연결하고 싶은 사업자'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center p-6 bg-slate-50 border border-slate-200 rounded-xl">
                <CheckCircle2 className="text-emerald-500 mr-4 shrink-0" size={24} />
                <span className="text-lg font-bold text-slate-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 상담 CTA */}
      <section className="py-24 bg-slate-50 relative border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-8">
            홈페이지 제작을 고민 중이라면, <br className="hidden sm:block" />
            현재 업종과 목표 키워드부터 상담해보세요.
          </h2>
          <Link
            to="/consult"
            className="inline-flex items-center px-10 py-5 bg-blue-900 text-white rounded-xl font-bold text-xl hover:bg-blue-800 transition-colors shadow-xl shadow-blue-900/20"
          >
            홈페이지 제작 상담하기 <MoveRight className="ml-3" size={24} />
          </Link>
        </div>
      </section>

    </main>
  );
}
