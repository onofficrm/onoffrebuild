import { LineChart, Activity, TrendingUp, BarChart2, MousePointerClick, Globe, Search, FileText, CheckCircle2, ShieldCheck, PenTool, LayoutTemplate, MessageSquareText, Rocket, RefreshCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Traffic() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-blue-900 border-b border-blue-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-800/40 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-blue-800/50 text-blue-200 border border-blue-700/50 rounded-full text-sm font-bold mb-6 tracking-wide">
            트래픽 실행 서비스
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            홈페이지에 <span className="text-yellow-400">방문자 흐름</span>을 만들어보세요.
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            홈페이지를 만들었지만 방문자가 없다면, <br className="hidden sm:block" />
            검색노출과 콘텐츠 활성화를 위한 트래픽 전략이 필요합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('traffic-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
            >
              트래픽 서비스 상담하기
            </button>
            <button 
              onClick={() => document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-800/50 text-white border border-blue-700 rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors"
            >
              진행 방식 보기
            </button>
          </div>
        </div>
      </section>

      {/* 1. 왜 트래픽이 필요한가 */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
              홈페이지는 방문자가 있어야 <br className="hidden sm:block" />
              <span className="text-blue-700">데이터와 반응</span>이 쌓입니다.
            </h2>
            <p className="text-lg text-slate-600">방문자가 없는 홈페이지는 고장 난 자판기와 같습니다. 올바른 초기 흐름을 만들어야 합니다.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Rocket size={28} />, title: '신규 홈페이지 초기 활성화', desc: '제작 직후 트래픽이 전무한 사이트에 초기 활성도 부여' },
              { icon: <Activity size={28} />, title: '콘텐츠 반응 보조', desc: '블로그 문서나 개별 페이지에 방문자 신호 발생' },
              { icon: <TrendingUp size={28} />, title: '검색노출 흐름 보완', desc: '다양한 마케팅 활동의 성과를 보조하기 위한 트래픽 연결' },
              { icon: <RefreshCcw size={28} />, title: '블로그/카페포스팅 연계', desc: '발행된 외부 포스팅과 홈페이지 간의 연결 흐름 보조' },
              { icon: <MousePointerClick size={28} />, title: '랜딩페이지 테스트', desc: '페이지 내 전환 동선과 UI/UX가 유효한지 1차적인 확인' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group">
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 이런 경우 추천 */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              이런 경우 트래픽 서비스가 필요합니다.
            </h2>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="space-y-4">
              {[
                '홈페이지를 만들었지만 방문자가 거의 없는 경우',
                '신규 페이지를 빠르게 활성화하고 싶은 경우',
                '자사명 외에 검색노출 기반이 약한 경우',
                '블로그/카페포스팅과 함께 유입 흐름을 만들고 싶은 경우',
                '특정 이벤트나 프로모션 페이지 방문을 늘리고 싶은 경우'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                  <CheckCircle2 className="text-blue-600 mr-4 shrink-0" size={28} />
                  <span className="text-slate-800 font-bold text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. 서비스 진행 방식 */}
      <section id="process-section" className="py-24 bg-slate-900 text-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">
              트래픽 서비스 진행 방식
            </h2>
            <p className="text-slate-400 text-lg">데이터 분석부터 실행, 결과 보고까지 체계적으로 진행됩니다.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { num: '01', title: '상담', icon: <MessageSquareText size={20} /> },
              { num: '02', title: 'URL 확인', icon: <Globe size={20} /> },
              { num: '03', title: '키워드 확인', icon: <Search size={20} /> },
              { num: '04', title: '플랜 설계', icon: <LineChart size={20} /> },
              { num: '05', title: '서비스 진행', icon: <Activity size={20} /> },
              { num: '06', title: '결과 리포트', icon: <FileText size={20} /> }
            ].map((step, idx) => (
              <div key={idx} className="bg-slate-800 p-6 rounded-2xl border border-slate-700 relative">
                <div className="text-blue-400 font-mono font-bold mb-4">{step.num}</div>
                <div className="text-slate-400 mb-3">{step.icon}</div>
                <h3 className="font-bold text-slate-200">{step.title}</h3>
                {idx < 5 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 text-slate-600 font-bold">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 함께 사용하면 좋은 서비스 */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              함께 사용하면 더 좋은 서비스
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: '홈페이지 제작', icon: <LayoutTemplate size={24} /> },
              { title: '블로그포스팅', icon: <PenTool size={24} /> },
              { title: '카페포스팅', icon: <MessageSquareText size={24} /> },
              { title: 'SEO 콘텐츠 설계', icon: <Search size={24} /> }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 text-center hover:border-blue-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 mx-auto bg-slate-100 text-slate-700 rounded-xl flex items-center justify-center mb-4">
                  {item.icon}
                </div>
                <h3 className="font-bold text-slate-800">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 주의 안내 섹션 */}
      <section className="py-20 bg-blue-50 border-b border-blue-100">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
           <ShieldCheck className="w-16 h-16 mx-auto text-blue-600 mb-6" />
           <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 tracking-tight">
             무리한 방식보다 안정적인 운영을 지향합니다.
           </h2>
           <p className="text-lg text-slate-700 leading-relaxed font-medium">
             온오프마케팅은 과장된 효과를 약속하기보다, <br className="hidden sm:block" />
             홈페이지와 콘텐츠 상황에 맞는 안정적인 실행 전략을 제안합니다. <br />
             데이터 오남용 문제가 없는 체계적인 서비스만 안내합니다.
           </p>
         </div>
      </section>

    </main>
  );
}
