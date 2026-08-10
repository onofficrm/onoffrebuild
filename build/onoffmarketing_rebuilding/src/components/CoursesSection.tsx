import { PlayCircle } from 'lucide-react';

const courses = [
  { title: '홈페이지제작 기초', color: 'bg-blue-100' },
  { title: 'SEO 실전 노하우', color: 'bg-emerald-100' },
  { title: '블로그 상위노출', color: 'bg-orange-100' },
  { title: '카페 상위노출 전략', color: 'bg-yellow-100' }
];

export default function CoursesSection() {
  return (
    <section className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">
            먼저 <span className="text-blue-700">배우고</span> 판단하세요.
          </h2>
          <p className="text-lg text-slate-600">
            홈페이지 제작, SEO 노하우, 블로그/카페 노출에 대한 무료 강의를 통해 온오프마케팅의 실전 방식을 미리 확인할 수 있습니다.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {courses.map((course, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all group">
              <div className={`h-32 ${course.color} relative border-b border-black/5`}>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                  <PlayCircle size={48} className="text-white drop-shadow-md" />
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-slate-800 mb-4">{course.title}</h3>
                <button className="px-5 py-2 text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg w-full transition-colors">
                  무료 강의 보기
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm text-center flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h4 className="text-xl font-bold text-slate-800 mb-2">직접 만들기 어렵다면 제작 의뢰도 가능합니다.</h4>
            <p className="text-slate-500 text-sm">전문가의 도움을 받아 시간과 리소스를 절약하세요.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto shrink-0">
            <button className="px-6 py-3 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-50">
              자체제작 강의 보기
            </button>
            <button className="px-6 py-3 bg-blue-900 text-white font-bold rounded-xl hover:bg-blue-800 shadow-md">
              홈페이지 제작 의뢰하기
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
