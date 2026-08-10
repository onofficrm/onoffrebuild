import { Target, CheckCircle2, LayoutTemplate, Compass, Layers, Link as LinkIcon, Smartphone, Settings, Navigation, PlayCircle, MessageCircle, PenTool, Lightbulb, UserCheck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DiyCourse() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-indigo-900 border-b border-indigo-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-800 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
              제작 사례 직접 만들고 <br className="hidden md:block"/>
              <span className="text-yellow-400">배포하기</span>
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-6 leading-relaxed font-medium">
              업종만 입력하면 AI가 홈페이지 구조, 문구, 상담 버튼, SEO 콘텐츠 방향까지 제안합니다.<br className="hidden sm:block" />
              온오프마케팅은 AI로 만든 홈페이지 시안을 온오프빌더로 적용하고, 실제 도메인에 배포하는 흐름까지 안내합니다.
            </p>
            <p className="text-base md:text-lg text-indigo-200 mb-10 leading-relaxed font-medium">
              성형외과, 법률사무소, 분양, 유학원, 풀빌라, 커뮤니티, 치과, 부동산 등 다양한 업종의 제작 사례를 직접 확인하고 내 업종에 맞는 홈페이지를 만들어보세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <button
                className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20 text-center flex justify-center items-center"
              >
                제작 사례 직접 만들기
              </button>
              <Link 
                to="/portfolio"
                className="px-8 py-4 bg-indigo-800/80 text-white border border-indigo-700 rounded-xl font-bold text-lg hover:bg-indigo-800 transition-colors text-center"
              >
                샘플 홈페이지 보기
              </Link>
              <Link 
                to="/free-courses"
                className="px-8 py-4 bg-transparent text-indigo-200 border border-indigo-400/50 rounded-xl font-bold text-lg hover:bg-indigo-800/50 hover:text-white transition-colors text-center"
              >
                무료강의 신청하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1. 소개 */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight">
              AI로 기획한 랜딩페이지를 <br className="hidden sm:block" />
              <span className="text-indigo-600">실제 사이트처럼 확인하세요</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              온오프마케팅은 업종별 홈페이지 제작 사례를 직접 만들어보고, <br className="hidden md:block"/>
              AI로 기획한 랜딩페이지를 실제 사이트처럼 확인할 수 있는 샘플 제작 환경을 제공합니다.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-indigo-600">
                <Target size={32} />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-4">1. 업종 및 목표 선택</h3>
              <p className="text-slate-600">방문자는 업종을 선택하고, 원하는 홈페이지 방향을 입력합니다.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-indigo-600">
                <Lightbulb size={32} />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-4">2. AI 맞춤 제안</h3>
              <p className="text-slate-600">AI가 제안하는 홈페이지 구조, 메인 문구, 섹션 구성 등을 확인합니다.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-indigo-600">
                <LayoutTemplate size={32} />
              </div>
              <h3 className="font-bold text-xl text-slate-800 mb-4">3. 실제 구조 적용</h3>
              <p className="text-slate-600">상담 버튼, SEO 방향 등 실제 운영에 필요한 요소를 함께 구성합니다.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2. 이런 분들에게 추천합니다 */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8 tracking-tight">이런 분들에게 추천합니다</h2>
              <ul className="space-y-4">
                {[
                  '홈페이지를 직접 만들어보고 싶은 분',
                  'AI로 랜딩페이지를 빠르게 기획하고 싶은 분',
                  '업종별 제작 사례를 참고하고 싶은 분',
                  '홈페이지 제작업을 시작하거나 확장하고 싶은 분',
                  '상담 전환이 되는 홈페이지 구조를 배우고 싶은 분',
                  'SEO 콘텐츠 구조까지 고려한 홈페이지를 만들고 싶은 분'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <CheckCircle2 className="text-indigo-600 mr-4 shrink-0" size={24} />
                    <span className="font-bold text-slate-800">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-900 rounded-3xl p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-800 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
              <h3 className="text-2xl font-bold mb-6 relative z-10">AI 홈페이지 제작, <br className="hidden sm:block"/>이제 쉽게 시작하세요</h3>
              <p className="text-indigo-100 mb-8 leading-relaxed relative z-10">
                이제 홈페이지 제작은 처음부터 어렵게 시작하지 않아도 됩니다. AI로 빠르게 만들고, 온오프빌더로 적용하고, 실제 도메인에 배포하는 흐름까지 경험해보세요.
              </p>
              <div className="flex flex-col gap-4 relative z-10">
                <Link to="/free-courses" className="px-6 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-center hover:bg-yellow-300 transition-colors">
                  무료강의 신청하기
                </Link>
                <Link to="/pricing" className="px-6 py-4 bg-indigo-800 border border-indigo-700 text-white rounded-xl font-bold text-center hover:bg-indigo-700 transition-colors">
                  온오프빌더 알아보기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3. 직접 확인할 수 있는 내용 */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">직접 확인할 수 있는 내용</h2>
            <p className="text-lg text-slate-600">샘플 제작 환경에서 다음과 같은 요소들을 직접 구성해볼 수 있습니다.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Compass size={24} />, title: '업종별 홈페이지 구조' },
              { icon: <PenTool size={24} />, title: '메인 카피와 서브 카피' },
              { icon: <MessageCircle size={24} />, title: '상담 버튼 구성' },
              { icon: <LinkIcon size={24} />, title: '전화/카톡/지도 연결 버튼' },
              { icon: <ShieldCheck size={24} />, title: 'FAQ 구성' },
              { icon: <Layers size={24} />, title: 'SEO용 콘텐츠 방향' },
              { icon: <Smartphone size={24} />, title: 'PC/모바일 화면 구성' },
              { icon: <PlayCircle size={24} />, title: '실제 제작 사례 미리보기' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 flex items-center group hover:bg-indigo-50 hover:border-indigo-200 transition-colors">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shadow-sm mr-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
                <span className="font-bold text-slate-800">{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4. 안내 문구 & 최종 CTA */}
      <section className="py-24 bg-slate-900 text-center relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8 mb-12 text-left">
            <h3 className="text-xl font-bold text-emerald-400 mb-4 flex items-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mr-3"></span>
              안내 문구
            </h3>
            <p className="text-slate-300 leading-relaxed mb-4">
              AI로 만든 홈페이지 시안은 빠르게 방향을 잡는 데 도움이 됩니다. <br className="hidden md:block"/>
              다만 실제 운영을 위해서는 도메인 연결, 문의폼, 카카오톡 상담, 지도 연결, 게시판, SEO 설정, 모바일 최적화 등 별도 적용 과정이 필요할 수 있습니다.
            </p>
            <p className="text-slate-300 leading-relaxed">
              무료강의에서는 AI로 홈페이지를 기획하고, 온오프빌더를 활용해 실제 제작 사례로 발전시키는 방법을 안내합니다.
            </p>
          </div>

          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">
            지금 바로 AI 홈페이지 기획을 시작해보세요
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              className="px-10 py-5 bg-yellow-400 text-slate-900 rounded-xl font-bold text-xl hover:bg-yellow-300 transition-colors shadow-xl shadow-yellow-500/20"
            >
              제작 사례 직접 만들기
            </button>
            <Link
              to="/free-courses"
              className="px-10 py-5 bg-indigo-600 text-white rounded-xl font-bold text-xl hover:bg-indigo-500 transition-colors border border-indigo-500 shadow-xl shadow-indigo-600/20"
            >
              무료강의 신청하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
