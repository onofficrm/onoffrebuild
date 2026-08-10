import { ExternalLink, LineChart, MessageSquareText, PenTool } from 'lucide-react';

export default function ServicesSection() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            홈페이지 제작 후 노출을 만드는 <span className="text-blue-700">실행 서비스</span>
          </h2>
          <p className="text-lg text-slate-600">제작된 홈페이지에 생명력을 불어넣고 실제 잠재고객을 유입시킵니다.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          
          {/* Service 1 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <LineChart size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">트래픽 서비스</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 h-16">
              홈페이지와 콘텐츠에 안전한 방문자 흐름을 원활하게 만들어 검색노출과 사이트 활성화를 돕는 실행 서비스입니다.
            </p>
            <button className="flex items-center text-sm font-bold text-emerald-600 hover:text-emerald-700">
              트래픽 상담하기
              <ExternalLink size={16} className="ml-1" />
            </button>
          </div>

          {/* Service 2 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
              <PenTool size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">블로그포스팅</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 h-16">
              키워드 기반의 전문적인 블로그 콘텐츠를 기획·발행하여 브랜드 검색 노출 영역을 넓히고 신뢰도를 높입니다.
            </p>
            <button className="flex items-center text-sm font-bold text-blue-600 hover:text-blue-700">
              블로그포스팅 상담하기
              <ExternalLink size={16} className="ml-1" />
            </button>
          </div>

          {/* Service 3 */}
          <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-6">
              <MessageSquareText size={28} strokeWidth={2.5} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">카페포스팅</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-8 h-16">
              타겟 고객이 모여있는 커뮤니티 기반의 자연스러운 정보성 콘텐츠 배포로 검색 노출과 즉각적인 반응을 함께 만듭니다.
            </p>
            <button className="flex items-center text-sm font-bold text-orange-600 hover:text-orange-700">
              카페포스팅 상담하기
              <ExternalLink size={16} className="ml-1" />
            </button>
          </div>

        </div>

        {/* Small card */}
        <div className="bg-slate-200/50 rounded-2xl p-6 border border-slate-200 border-dashed flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0 text-center sm:text-left">
            <h4 className="text-base font-bold text-slate-700 flex items-center justify-center sm:justify-start">
              백링크 서비스
              <span className="ml-3 px-2 py-0.5 bg-slate-300 text-slate-600 text-xs font-bold rounded-md tracking-wide">준비 중</span>
            </h4>
            <p className="text-slate-500 text-sm mt-1">검색엔진 신뢰도(DA/PA) 상승을 위한 고품질 백링크 서비스는 추후 오픈 예정입니다.</p>
          </div>
          <button disabled className="px-5 py-2.5 bg-slate-300 text-slate-500 font-semibold text-sm rounded-lg cursor-not-allowed">
            오픈 알림 받기
          </button>
        </div>

      </div>
    </section>
  );
}
