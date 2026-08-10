import { ArrowRight, BarChart2, MousePointerClick, Search } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30 mix-blend-multiply"></div>
      
      {/* Decorative background blur */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[100px] -z-10 mix-blend-multiply"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-300/20 rounded-full blur-[80px] -z-10 mix-blend-multiply"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          <div className="max-w-2xl">
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold mb-6 shadow-sm border border-blue-200/50">
              <span className="w-2 h-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
              실행형 디지털 마케팅 에이전시
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              SEO와 AEO를 고려한 <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-600">홈페이지 제작,</span>
              <br/>
              이제 만들고 끝내지 마세요.
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed font-normal">
              온오프마케팅은 홈페이지 제작부터 트래픽, 블로그포스팅, 카페포스팅까지 <strong className="font-semibold text-slate-800">검색 노출에 필요한 실행 서비스를 함께 제공합니다.</strong>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center px-8 py-4 bg-blue-900 text-white rounded-xl font-semibold text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/30 group">
                제작 의뢰하기
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center justify-center px-8 py-4 bg-white text-slate-800 border-2 border-slate-200 rounded-xl font-semibold text-lg hover:border-slate-300 hover:bg-slate-50 transition-all">
                직접 만들기 강의 보기
              </button>
            </div>
          </div>

          <div className="relative lg:ml-auto w-full max-w-lg">
            {/* Abstract visual representing dashboard and SEO */}
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-500"></div>
              
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                 <div className="flex space-x-2">
                   <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                   <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                   <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                 </div>
                 <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Search Performance</div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-blue-100 text-blue-700 rounded-lg">
                    <Search size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">상위 노출 최적화 (SEO/AEO)</h4>
                    <div className="w-48 h-2 bg-slate-200 rounded-full mt-2">
                      <div className="w-[85%] h-full bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4">
                  <div className="p-3 bg-yellow-100 text-yellow-700 rounded-lg">
                    <MousePointerClick size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">전환율 & 문의 상승</h4>
                    <div className="flex items-end gap-2 mt-2">
                      <div className="w-3 h-6 bg-slate-200 rounded-sm"></div>
                      <div className="w-3 h-8 bg-slate-200 rounded-sm"></div>
                      <div className="w-3 h-12 bg-slate-300 rounded-sm"></div>
                      <div className="w-3 h-16 bg-blue-400 rounded-sm"></div>
                      <div className="w-3 h-24 bg-blue-700 rounded-sm"></div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-4 mx-4 -mr-8 shadow-sm">
                  <div className="p-3 bg-emerald-100 text-emerald-700 rounded-lg">
                    <BarChart2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1">유기적 트래픽 유입</h4>
                    <p className="text-xs text-slate-500 font-medium">+342% 증가 (최근 3개월)</p>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Floating elements */}
            <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-slate-50 flex items-center gap-3 animate-bounce" style={{animationDuration: '3s'}}>
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xl">A</div>
              <div>
                <p className="text-xs text-slate-400 font-medium">AI 검색 최적화</p>
                <p className="text-sm font-bold text-slate-800">AEO Ready</p>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </section>
  );
}
