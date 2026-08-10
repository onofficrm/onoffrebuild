import { PlayCircle, Clock, BookOpen, Layers, Target, BarChart, ArrowRight, Settings, Plus, Play, MousePointerClick, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FreeCourses() {
  const courses = [
    {
      title: '홈페이지제작',
      desc: '홈페이지 제작의 기본 구조와 직접 제작 방향을 배울 수 있습니다.',
      difficulty: '입문',
      time: '약 45분',
      related: '의뢰하기, 자체제작',
      icon: <Settings size={20} className="text-blue-500" />
    },
    {
      title: 'SEO노하우',
      desc: '검색엔진이 이해하기 쉬운 홈페이지와 콘텐츠 구조를 배울 수 있습니다.',
      difficulty: '초급',
      time: '약 60분',
      related: '홈페이지제작, 콘텐츠 기획',
      icon: <Target size={20} className="text-indigo-500" />
    },
    {
      title: '블로그상위노출',
      desc: '블로그 키워드 선정과 콘텐츠 작성 방향을 배울 수 있습니다.',
      difficulty: '초중급',
      time: '약 50분',
      related: '블로그포스팅',
      icon: <BarChart size={20} className="text-emerald-500" />
    },
    {
      title: '카페상위노출',
      desc: '카페포스팅과 커뮤니티 기반 노출 전략을 배울 수 있습니다.',
      difficulty: '중급',
      time: '약 40분',
      related: '카페포스팅',
      icon: <MousePointerClick size={20} className="text-orange-500" />
    }
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-24 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-blue-600 rounded-full blur-[150px] pointer-events-none opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-blue-900/50 text-blue-300 border border-blue-800/50 rounded-full text-sm font-bold mb-6 tracking-wide">
            <PlayCircle size={16} className="mr-2" />
            무료온라인강의
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            먼저 <span className="text-yellow-400">무료로 배우고,</span> <br className="hidden md:block" />
            필요한 서비스를 선택하세요.
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            홈페이지 제작, SEO 노하우, 블로그 상위노출, 카페 상위노출에 대한 무료 강의를 통해 <br className="hidden sm:block" />
            온오프마케팅의 실전 방식을 확인해보세요.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
            >
              무료 강의 보기
            </button>
            <Link 
              to="/diy"
              className="px-8 py-4 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors inline-block"
            >
              자체제작 강의 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 1. 강의 카테고리 섹션 */}
      <section id="courses" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              무료로 확인할 수 있는 실전 강의
            </h2>
            <p className="text-lg text-slate-600 mt-4">회원가입 없이 누구나 시청할 수 있습니다.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {courses.map((course, idx) => (
              <div key={idx} className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-row md:items-stretch">
                {/* Thumbnail Area */}
                <div className="w-1/3 md:w-2/5 bg-slate-100 flex-shrink-0 relative overflow-hidden group-hover:bg-slate-200 transition-colors aspect-square md:aspect-video flex items-center justify-center">
                  <div className="w-10 h-10 md:w-16 md:h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-600">
                    <Play size={20} className="ml-1 md:w-6 md:h-6" />
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-4 md:p-8 flex-grow flex flex-col justify-between">
                  <div className="mb-2 md:mb-0">
                    <div className="hidden md:flex items-center mb-3">
                      <span className="bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold px-2 py-1 rounded inline-flex items-center">
                        {course.icon} <span className="ml-1.5">{course.title}</span>
                      </span>
                    </div>
                    <div className="flex items-center mb-1 md:mb-3">
                      <div className="md:hidden mr-1.5">
                         {course.icon}
                      </div>
                      <h3 className="text-sm md:text-2xl font-bold text-slate-900 line-clamp-1 md:line-clamp-none">{course.title} 기초 강의</h3>
                    </div>
                    <p className="text-slate-500 md:text-slate-600 font-medium md:mb-6 leading-snug md:leading-relaxed text-xs md:text-base line-clamp-2">
                      {course.desc}
                    </p>
                  </div>
                  
                  <div className="space-y-3 mt-auto hidden md:block">
                    <div className="flex flex-wrap gap-4 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <span className="flex items-center"><Target size={16} className="mr-1.5 text-slate-400" /> <span className="font-bold text-slate-700 mr-1">난이도:</span> {course.difficulty}</span>
                      <span className="flex items-center"><Clock size={16} className="mr-1.5 text-slate-400" /> <span className="font-bold text-slate-700 mr-1">시청:</span> {course.time}</span>
                      <span className="flex items-center w-full"><Layers size={16} className="mr-1.5 text-slate-400" /> <span className="font-bold text-slate-700 mr-1">관련 서비스:</span> {course.related}</span>
                    </div>
                    
                    <button className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-md flex items-center justify-center">
                      <PlayCircle size={18} className="mr-2" /> 무료 강의 보기
                    </button>
                  </div>

                  {/* Mobile meta */}
                  <div className="mt-2 md:hidden flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{course.difficulty}</span>
                      <span>•</span>
                      <span>{course.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. 무료 강의 이후 연결 섹션 */}
      <section className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              배우고 나서 <br className="hidden sm:block" />
              <span className="text-blue-700">직접 만들거나, 제작을 맡길 수 있습니다.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200 relative overflow-hidden group">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-indigo-200">
                <BookOpen size={28} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">직접 만들고 싶다면</h3>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start text-slate-600 font-medium">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 shrink-0 text-sm font-bold">✓</div>
                  자체제작 유료강의 보기
                </li>
                <li className="flex items-start text-slate-600 font-medium">
                  <div className="mt-1 w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mr-3 shrink-0 text-sm font-bold">✓</div>
                  홈페이지 구조를 직접 배우고 운영
                </li>
              </ul>
              <Link 
                to="/diy"
                className="w-full py-4 bg-white border border-slate-300 text-slate-800 rounded-xl font-bold hover:bg-slate-100 transition-colors inline-block text-center shadow-sm block relative z-10"
              >
                자체제작 강의 보기
              </Link>
            </div>

            <div className="bg-blue-600 rounded-3xl p-8 border border-blue-700 text-white relative overflow-hidden group shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-[40px] pointer-events-none"></div>
              <div className="w-14 h-14 bg-blue-700 text-blue-100 rounded-2xl flex items-center justify-center mb-6 shadow-md border border-blue-500 relative z-10">
                <TrendingUp size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10">맡기고 싶다면</h3>
              <ul className="space-y-4 mb-8 relative z-10">
                <li className="flex items-start text-blue-100 font-medium">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-3 shrink-0 text-sm font-bold text-white">✓</div>
                  홈페이지 제작 의뢰하기
                </li>
                <li className="flex items-start text-blue-100 font-medium">
                  <div className="mt-1 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center mr-3 shrink-0 text-sm font-bold text-white">✓</div>
                  SEO/AEO 구조까지 전문가에게 의뢰
                </li>
              </ul>
              <Link 
                to="/request"
                className="w-full py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold hover:bg-yellow-300 transition-colors inline-block text-center shadow-md block relative z-10"
              >
                홈페이지 제작 의뢰하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. 관련 서비스 연결 */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              홈페이지 제작 후 <span className="text-blue-700">필요한 실행 서비스</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: '트래픽 서비스', path: '/traffic', icon: <TrendingUp size={24} /> },
              { title: '블로그포스팅', path: '/blog', icon: <BarChart size={24} /> },
              { title: '카페포스팅', path: '/cafe', icon: <MousePointerClick size={24} /> }
            ].map((service, idx) => (
              <Link to={service.path} key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 text-center hover:border-blue-400 hover:shadow-md transition-all group">
                <div className="w-16 h-16 mx-auto bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 rounded-2xl flex items-center justify-center mb-6 transition-colors border border-slate-100">
                  {service.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-2">{service.title}</h3>
                <div className="inline-flex items-center text-sm font-bold text-blue-600 mt-4">
                  자세히 보기 <ArrowRight size={16} className="ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
