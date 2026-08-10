import { Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function CommonCTA() {
  const location = useLocation();
  
  // 상담 페이지에서는 공통 CTA를 숨깁니다.
  if (location.pathname === '/consult') {
    return null;
  }

  return (
    <section className="py-24 bg-slate-50 border-t border-slate-200 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
          홈페이지 제작, 직접 할지 맡길지 고민된다면 <br className="hidden sm:block" />
          <span className="text-blue-700">상담부터 받아보세요.</span>
        </h2>
        <p className="text-lg text-slate-600 mb-10">
          온오프마케팅이 현재 상황에 맞게 제작 의뢰형과 직접 제작형 중 더 적합한 방식을 안내해드립니다.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link 
            to="/consult"
            className="inline-flex justify-center items-center px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
          >
            <Sparkles size={20} className="mr-2" />
            홈페이지 제작 상담하기
          </Link>
          <Link 
            to="/pricing"
            className="inline-flex justify-center items-center px-8 py-4 bg-blue-900 text-white rounded-xl font-bold text-lg hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
          >
            온오프빌더 요금 보기
          </Link>
          <a
            href="http://pf.kakao.com/_MTlNK/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center px-8 py-4 bg-[#FEE500] text-slate-900 rounded-xl font-bold text-lg hover:bg-[#f3dc00] transition-colors shadow-sm"
          >
            카카오톡 상담하기
          </a>
        </div>
      </div>
    </section>
  );
}
