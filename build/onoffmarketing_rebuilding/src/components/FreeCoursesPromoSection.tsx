import { GraduationCap, Play, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const courseCards = [
  {
    category: '홈페이지 제작',
    title: 'AI & 온오프빌더 웹사이트 5분 완성',
    desc: '개발 지식 없이도 고전환 홈페이지 구조와 SEO 메타데이터를 직접 세팅하는 실전 가이드',
    badge: '입문/기초',
    duration: '강의 8강 (무료)',
    bg: 'bg-gradient-to-br from-blue-900 to-indigo-900'
  },
  {
    category: 'SEO/AEO 노하우',
    title: '구글/네이버 상위 노출 10가지 절대 원칙',
    desc: '검색엔진 로봇과 AI 답변 추천 알고리즘이 내 사이트를 첫 번째로 뽑게 만드는 가이드',
    badge: 'SEO 핵심',
    duration: '강의 12강 (무료)',
    bg: 'bg-gradient-to-br from-indigo-900 to-purple-900'
  },
  {
    category: '블로그 상위노출',
    title: '검색 알고리즘을 관통하는 원고 기획',
    desc: '상위 노출되는 블로그 키워드 추출법과 C-Rank, DIA+ 스코어를 만족하는 원고 작성법',
    badge: '바이럴 실행',
    duration: '강의 10강 (무료)',
    bg: 'bg-gradient-to-br from-slate-900 to-blue-900'
  },
  {
    category: '카페 상위노출',
    title: '타겟 커뮤니티 침투 & 바이럴 공식',
    desc: '자연스러운 후기 포스팅과 질의응답 포맷으로 고단가 리드를 끌어당기는 침투 마케팅',
    badge: '커뮤니티',
    duration: '강의 6강 (무료)',
    bg: 'bg-gradient-to-br from-amber-900 to-slate-900'
  }
];

export default function FreeCoursesPromoSection() {
  return (
    <section className="py-24 bg-white border-b border-slate-200/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-yellow-100 text-yellow-900 text-xs sm:text-sm font-extrabold mb-4 border border-yellow-200">
            <GraduationCap size={18} className="mr-2" />
            100% 무료 마케팅 교육
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-4">
            "직접 배우고 <span className="text-blue-700">직접 운영</span>해보세요"
          </h2>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            비싼 마케팅 강의에 속지 마세요. 온오프마케팅이 실전 현장에서 검증한 SEO, 포스팅, 홈페이지 제작 노하우를 무료로 공개합니다.
          </p>
        </div>

        {/* 4 Preview Course Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {courseCards.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Card Visual Banner */}
                <div className={`${item.bg} p-6 text-white relative overflow-hidden h-40 flex flex-col justify-between`}>
                  <div className="flex items-center justify-between relative z-10">
                    <span className="px-2.5 py-0.5 bg-yellow-400 text-slate-900 text-xs font-black rounded">
                      {item.badge}
                    </span>
                    <span className="text-xs font-bold text-slate-300 flex items-center">
                      <BookOpen size={12} className="mr-1" />
                      {item.duration}
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-yellow-400 group-hover:scale-110 transition-transform">
                      <Play size={18} className="ml-0.5 fill-yellow-400" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-yellow-300 block">{item.category}</span>
                      <h3 className="text-base font-extrabold text-white leading-snug line-clamp-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <p className="text-slate-600 text-xs sm:text-sm font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <div className="p-6 pt-0">
                <Link
                  to="/free-courses"
                  className="w-full py-2.5 bg-blue-50 text-blue-800 text-xs font-extrabold rounded-xl hover:bg-blue-900 hover:text-white transition-all flex items-center justify-center"
                >
                  강의 수강하기
                  <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button to All Courses */}
        <div className="text-center">
          <Link
            to="/free-courses"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-900 text-white rounded-xl font-extrabold text-base sm:text-lg hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 group"
          >
            <Sparkles size={20} className="mr-2 text-yellow-400" />
            전체 무료 온라인 강의 둘러보기
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
