import { useState } from 'react';
import { Search, Bell, HelpCircle, Youtube, ChevronDown, ChevronUp, Play, ArrowRight, Calendar, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Community() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const notices = [
    { title: '온오프마케팅 서비스 개편 안내', date: '2023.11.15', views: '1,245' },
    { title: '홈페이지 제작 신규 포트폴리오 업데이트', date: '2023.10.28', views: '890' },
    { title: '온라인 마케팅 트렌드 기초 리포트 배포', date: '2023.09.05', views: '3,102' },
    { title: '추석 연휴 고객센터 휴무 안내', date: '2023.09.01', views: '450' },
    { title: '개인정보 처리방침 변경 사전 안내', date: '2023.08.15', views: '620' }
  ];

  const faqs = [
    { q: '홈페이지 제작 기간은 얼마나 걸리나요?', a: '페이지 스펙과 요구사항에 따라 다르지만, 일반적인 비즈니스 홈페이지의 경우 기획부터 디자인, 개발, 검수까지 약 4주에서 6주 정도 소요됩니다.' },
    { q: '직접 제작 강의만 듣고 만들 수 있나요?', a: '네, 제공해 드리는 강의는 초보자도 쉽게 따라 할 수 있도록 구성되어 있습니다. 아임웹 등 노코드 툴을 활용하여 기초부터 실전까지 직접 제작할 수 있는 가이드를 제공합니다.' },
    { q: '기존 홈페이지에도 SEO 서비스를 적용할 수 있나요?', a: '물론입니다. 기존에 구축된 홈페이지의 구조를 분석하여 검색엔진에 친화적인 구조로 개선하고, 키워드 최적화 및 메타데이터를 수정하는 작업을 진행할 수 있습니다.' },
    { q: '트래픽 서비스는 어떤 방식으로 진행되나요?', a: '서비스와 연관된 양질의 자연스러운 유입을 발생시켜 트래픽을 늘립니다. 어뷰징 방식이 아닌 실제 유저와 유사한 패턴으로 접근하여 검색 노출 점수에 긍정적인 영향을 줍니다.' },
    { q: '블로그포스팅과 카페포스팅은 같이 진행하는 게 좋나요?', a: '네, 두 가지를 병행하면 검색결과의 여러 영역(블로그탭, 카페탭)에서 브랜드를 노출시킬 수 있어 정보 확산과 신뢰도 향상에 훨씬 더 큰 시너지가 납니다.' },
    { q: '제작 후 관리도 가능한가요?', a: '홈페이지 오픈 후 발생하는 유지보수, 기능 추가, 정기적인 콘텐츠 업데이트 등 다방면으로 원활한 후속 관리를 지원해 드리고 있습니다.' },
    { q: 'SEO와 AEO는 어떤 차이가 있나요?', a: 'SEO(검색엔진 최적화)는 구글, 네이버 등에서 상위에 노출되도록 하는 작업이며, AEO(인공지능 답변 최적화)는 ChatGPT나 생성형 AI 검색 결과에서 우리 브랜드가 추천 답변으로 나오도록 최적화하는 작업입니다.' },
    { q: '홈페이지 제작 후 마케팅 서비스도 연결할 수 있나요?', a: '홈페이지 구축 후 고객 수집을 위한 iCRM 연동, 애드센스 적용, 블로그 및 카페 포스팅 등 온라인 마케팅 종합 인프라를 한 번에 설계하고 연결해 드립니다.' }
  ];

  const videos = [
    { title: '매출을 2배 올리는 홈페이지 기획법', desc: '랜딩페이지에서 이탈률을 낮추고 상담 전환을 높이는 핵심 카피라이팅과 구조 설계 노하우입니다.', date: '2023.11.01', thumb: 'bg-slate-200' },
    { title: '네이버 블로그 상위노출 키워드 전략', desc: '검색량이 적더라도 실제 구매로 이어지는 세부 키워드 발굴 방법과 블로그 작성 가이드입니다.', date: '2023.10.15', thumb: 'bg-slate-200' },
    { title: '카페 마케팅으로 지역 타겟팅하기', desc: '맘카페와 지역 커뮤니티에서 거부감 없이 자연스럽게 브랜드를 홍보하고 유입시키는 방법입니다.', date: '2023.09.28', thumb: 'bg-slate-200' },
    { title: '초보자도 1시간 만에 홈페이지 만들기', desc: '코딩 없이 제공되는 템플릿과 툴을 활용하여 빠르게 그럴듯한 웹사이트를 제작하는 실습 영상입니다.', date: '2023.09.10', thumb: 'bg-slate-200' }
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="py-20 lg:py-28 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-800 rounded-full blur-[120px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center px-4 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-sm font-bold mb-6 tracking-wide">
            COMMUNITY
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            온오프마케팅 <span className="text-blue-400">커뮤니티</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 mb-0 leading-relaxed font-medium max-w-3xl mx-auto">
            공지사항, 자주 묻는 질문, 유튜브 콘텐츠를 통해 <br className="hidden sm:block" />
            홈페이지 제작과 온라인마케팅 정보를 확인해보세요.
          </p>
        </div>
      </section>

      {/* 1. 커뮤니티 카테고리 카드 */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid md:grid-cols-3 gap-6">
            <div 
              onClick={() => document.getElementById('notices')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 cursor-pointer hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <Bell size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">공지사항</h3>
              <p className="text-slate-600 font-medium mb-6">온오프마케팅의 새로운 소식과 업데이트 내역을 전해드립니다.</p>
              <div className="text-indigo-600 font-bold flex items-center text-sm">
                바로가기 <ArrowRight size={16} className="ml-1" />
              </div>
            </div>

            <div 
              onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 cursor-pointer hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <HelpCircle size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">자주 묻는 질문</h3>
              <p className="text-slate-600 font-medium mb-6">서비스 이용에 대해 고객님들이 궁금해하시는 점들을 모았습니다.</p>
              <div className="text-blue-600 font-bold flex items-center text-sm">
                바로가기 <ArrowRight size={16} className="ml-1" />
              </div>
            </div>

            <div 
              onClick={() => document.getElementById('youtube')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 cursor-pointer hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                <Youtube size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">유튜브 콘텐츠</h3>
              <p className="text-slate-600 font-medium mb-6">마케팅 노하우와 홈페이지 제작 꿀팁을 영상으로 만나보세요.</p>
              <div className="text-red-600 font-bold flex items-center text-sm">
                바로가기 <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 공지사항 섹션 */}
      <section id="notices" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 flex items-center tracking-tight">
                <Bell className="mr-3 text-slate-400" size={32} /> 공지사항
              </h2>
            </div>
            <div className="relative max-w-sm w-full">
              <input type="text" placeholder="검색어를 입력하세요" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium" />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-slate-700">
                검색
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Desktop header */}
            <div className="hidden md:grid grid-cols-12 bg-slate-100 py-4 px-6 border-b border-slate-200 font-bold text-sm text-slate-600">
              <div className="col-span-2 text-center">카테고리</div>
              <div className="col-span-6">제목</div>
              <div className="col-span-2 text-center">등록일</div>
              <div className="col-span-2 text-center">조회수</div>
            </div>
            
            {/* List */}
            <div className="divide-y divide-slate-100">
              {notices.map((notice, idx) => (
                <div key={idx} className="hover:bg-slate-50 transition-colors cursor-pointer group px-4 py-4 md:py-0">
                  <div className="flex flex-col md:grid md:grid-cols-12 md:items-center py-0 md:py-5 px-0 md:px-2">
                    {/* Mobile: Category, Desktop: Category */}
                    <div className="md:col-span-2 md:text-center mb-2 md:mb-0">
                      <span className="bg-indigo-50 text-indigo-600 text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-100">공지</span>
                    </div>
                    {/* Title */}
                    <div className="md:col-span-6 font-bold text-slate-800 group-hover:text-blue-600 transition-colors mb-3 md:mb-0 text-lg md:text-base">
                      {notice.title}
                    </div>
                    {/* Mobile: Date & Views, Desktop: Date, Views in grid */}
                    <div className="md:col-span-4 flex items-center md:grid md:grid-cols-2 text-xs md:text-sm text-slate-500 font-medium">
                      <div className="flex items-center md:justify-center mr-4 md:mr-0">
                        <Calendar size={14} className="mr-1.5 md:hidden" /> {notice.date}
                      </div>
                      <div className="flex items-center md:justify-center">
                        <Eye size={14} className="mr-1.5 md:hidden" /> {notice.views}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pagination (Visual only) */}
          <div className="flex justify-center mt-8 space-x-2">
            <button className="w-10 h-10 rounded-xl bg-blue-600 text-white font-bold flex items-center justify-center shadow-sm">1</button>
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center">2</button>
            <button className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 flex items-center justify-center">3</button>
          </div>
        </div>
      </section>

      {/* 3. 자주묻는질문 섹션 */}
      <section id="faq" className="py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 inline-flex items-center tracking-tight">
              <HelpCircle className="mr-3 text-blue-500" size={32} /> 자주 묻는 질문
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'border-blue-300 shadow-md ring-1 ring-blue-50' : 'bg-white hover:border-slate-300'}`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full flex items-center justify-between p-5 md:p-6 text-left bg-white focus:outline-none"
                >
                  <span className="font-bold text-lg text-slate-800 pr-5 flex items-start">
                    <span className="text-blue-600 mr-3 hidden sm:inline-block">Q.</span> 
                    {faq.q}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${activeFaq === idx ? 'bg-blue-100 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                    {activeFaq === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </span>
                </button>
                
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === idx ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div className="p-5 md:p-6 pt-0 bg-blue-50/50 text-slate-600 font-medium leading-relaxed border-t border-slate-100 flex items-start">
                    <span className="text-slate-400 mr-3 font-bold hidden sm:inline-block">A.</span> 
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. 유튜브게시판 섹션 */}
      <section id="youtube" className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 flex items-center tracking-tight">
                <Youtube className="mr-3 text-red-500" size={32} /> 유튜브 콘텐츠
              </h2>
            </div>
            <a href="#" className="font-bold text-slate-600 hover:text-slate-900 flex items-center text-sm border bg-white border-slate-200 px-4 py-2 rounded-lg shadow-sm">
              유튜브 채널 이동 <ArrowRight size={16} className="ml-1" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {videos.map((video, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col h-full">
                {/* Thumbnail */}
                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                  {/* Generic placeholder logic since no images are provided here */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-slate-300 to-slate-200"></div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-colors">
                     <div className="w-14 h-14 bg-red-600/90 text-white rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                       <Play fill="currentColor" size={24} className="ml-1" />
                     </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">10:24</div>
                </div>
                
                {/* Info */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed flex-grow">
                    {video.desc}
                  </p>
                  <div className="flex items-center justify-between mt-auto text-xs font-medium text-slate-400">
                    <span>{video.date}</span>
                    <button className="text-blue-600 font-bold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors">
                      영상 보기
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
