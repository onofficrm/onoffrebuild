import { ArrowRight, BookOpen, Code2, PlusCircle } from 'lucide-react';

export default function ProductsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            직접 만들거나, 전문가에게 맡기거나
          </h2>
          <p className="text-lg text-slate-600">상황과 예산에 맞는 최적의 홈페이지 구축 방식을 선택하세요.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Product 1: DIY */}
          <div className="group rounded-3xl bg-slate-50 border border-slate-200 overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
            <div className="px-8 pt-10 pb-8 bg-white">
              <div className="w-16 h-16 bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center mb-6">
                <BookOpen size={32} />
              </div>
              <div className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full mb-4">온라인 강의</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">홈페이지 자체제작</h3>
              <p className="text-slate-600 font-medium h-12">
                유료강의를 통해 홈페이지 제작 구조를 배우고, 직접 운영 가능한 반응형 홈페이지를 만듭니다.
              </p>
            </div>
            
            <div className="p-8 bg-slate-50 flex-grow flex flex-col">
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  '홈페이지 제작 실전 인강',
                  'SEO(검색엔진최적화) 기본 구조',
                  '키워드 기반 페이지 설계법',
                  '직접 수정 및 관리 가능한 시스템',
                  '마케팅 자동화 기능 확장 지원',
                  '블로그·카페·트래픽 서비스 연결 가능'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-slate-700 font-medium">
                    <PlusCircle size={18} className="text-slate-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full flex items-center justify-center py-4 bg-white border-2 border-slate-300 text-slate-800 rounded-xl font-bold hover:bg-slate-100 hover:border-slate-400 transition-colors group-hover:text-blue-700 group-hover:border-blue-200">
                자체제작 과정 보기
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product 2: Request */}
          <div className="group rounded-3xl bg-blue-900 border border-blue-800 overflow-hidden flex flex-col hover:shadow-2xl hover:shadow-blue-900/30 transition-all duration-300 relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-800 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="px-8 pt-10 pb-8 relative z-10">
              <div className="w-16 h-16 bg-blue-800 text-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                <Code2 size={32} />
              </div>
              <div className="inline-block px-3 py-1 bg-yellow-400/20 text-yellow-400 text-xs font-semibold rounded-full mb-4 border border-yellow-400/30">맞춤 제작</div>
              <h3 className="text-2xl font-bold text-white mb-3">홈페이지 제작 의뢰하기</h3>
              <p className="text-blue-100 font-medium h-12">
                시간이 부족하다면, 온오프마케팅이 업종과 키워드를 고려해 검색노출에 유리한 구조로 대신 제작합니다.
              </p>
            </div>
            
            <div className="p-8 bg-blue-800/40 border-t border-blue-800 flex-grow flex flex-col relative z-10">
              <ul className="space-y-4 mb-10 flex-grow">
                {[
                  '1:1 업종별 맞춤형 홈페이지 기획',
                  'SEO 및 AEO 기본 세팅 완료',
                  '문의 전환 중심의 UX/UI 구조',
                  '메인 및 서브페이지 풀 구성',
                  '블로그·카페·트래픽 서비스 연동',
                  '제작 후 유지보수 및 관리 지원'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center text-blue-50 font-medium">
                    <PlusCircle size={18} className="text-yellow-500 mr-3 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
              
              <button className="w-full flex items-center justify-center py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20">
                제작 의뢰 상담하기
                <ArrowRight className="ml-2 w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
