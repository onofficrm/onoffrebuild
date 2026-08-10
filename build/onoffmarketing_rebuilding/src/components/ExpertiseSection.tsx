import { Bot, CheckCircle2, SearchCode } from 'lucide-react';

export default function ExpertiseSection() {
  return (
    <section className="py-24 bg-slate-900 border-y border-slate-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
          
          <div>
            <div className="inline-block px-3 py-1 bg-slate-800 text-blue-400 text-xs font-bold rounded-full mb-6 border border-slate-700 uppercase tracking-wider">
              Core Competence
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
              검색엔진 SEO를 넘어, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">AI 검색 AEO까지</span> 준비합니다.
            </h2>
            <p className="text-lg text-slate-400 mb-10 leading-relaxed font-light">
              앞으로의 홈페이지는 단순한 예쁜 디자인을 넘어, 검색엔진 봇과 생성형 AI 모두가 이해하고 답변으로 채택할 수 있는 명확한 데이터 구조가 필수적입니다.
            </p>

            <div className="grid sm:grid-cols-2 gap-y-6 gap-x-8">
              {[
                '검색엔진이 이해하기 쉬운 사이트 구조',
                'AI가 답변에 참고하기 쉬운 콘텐츠 논리',
                '자연어 검색에 대응하는 질문형 콘텐츠',
                '구글 스니펫을 노리는 FAQ 구조화 설정',
                '사용자 의도에 맞춘 업종별 키워드 페이지',
                '홈페이지 - 블로그 - 카페 입체적 연결'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-blue-400 mr-3 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Infographic Graphic */}
          <div className="relative">
            <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-slate-700 p-8 shadow-2xl relative">
              
              <div className="flex flex-col space-y-6">
                
                {/* AI Entity */}
                <div className="flex items-center gap-4 bg-slate-900 rounded-xl p-4 border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-full bg-gradient-to-l from-yellow-500/10 to-transparent"></div>
                  <div className="p-3 bg-yellow-500/20 text-yellow-500 rounded-lg shrink-0">
                    <Bot size={24} />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-bold mb-1">AEO (AI Engine Optimization)</h4>
                    <p className="text-slate-400 text-xs">ChatGPT, Gemini 등 AI 답변 출처 최적화</p>
                  </div>
                </div>

                <div className="flex justify-center -my-2 opacity-50 z-10">
                  <div className="w-0.5 h-10 bg-gradient-to-b from-yellow-500 to-blue-500"></div>
                </div>

                {/* Central Data Structure */}
                <div className="text-center p-6 bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl border border-blue-800 shadow-inner">
                  <h3 className="text-blue-100 font-black tracking-wider mb-2">ON/OFF HOMEPAGE</h3>
                  <div className="flex justify-center gap-2 mb-4">
                    <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-[10px] font-bold rounded">#질문형_콘텐츠</span>
                    <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-[10px] font-bold rounded">#구조화데이터</span>
                    <span className="px-2 py-1 bg-blue-800/50 text-blue-200 text-[10px] font-bold rounded">#시맨틱태그</span>
                  </div>
                  <p className="text-xs text-blue-300">검색봇과 AI가 모두 좋아하는 데이터 구조</p>
                </div>

                <div className="flex justify-center -my-2 opacity-50 z-10">
                  <div className="w-0.5 h-10 bg-gradient-to-t from-emerald-500 to-blue-500"></div>
                </div>

                {/* Traditional SEO Entity */}
                <div className="flex items-center gap-4 bg-slate-900 rounded-xl p-4 border border-slate-700 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-20 h-full bg-gradient-to-r from-emerald-500/10 to-transparent"></div>
                  <div className="p-3 bg-emerald-500/20 text-emerald-500 rounded-lg shrink-0">
                    <SearchCode size={24} />
                  </div>
                  <div>
                     <h4 className="text-white text-sm font-bold mb-1">SEO (Search Engine Optimization)</h4>
                     <p className="text-slate-400 text-xs">구글, 네이버 등 전통적 검색엔진 상위노출</p>
                  </div>
                </div>

              </div>
              
            </div>
            
            {/* Connecting decorative nodes */}
            <div className="absolute -right-4 top-1/2 w-12 h-12 bg-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="absolute -left-4 top-1/4 w-8 h-8 bg-yellow-500 rounded-full blur-lg opacity-50 animate-pulse delay-700"></div>
          </div>

        </div>

      </div>
    </section>
  );
}
