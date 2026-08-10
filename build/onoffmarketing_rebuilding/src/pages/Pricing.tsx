import { CheckCircle2, ChevronDown, MoveRight, Sparkles, Settings, MousePointerClick, Building2, Stethoscope, Scale, Activity, Home, Briefcase, Coffee, Video, Users, Phone, MessageCircle, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    if (openFaq === idx) {
      setOpenFaq(null);
    } else {
      setOpenFaq(idx);
    }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqs = [
    { q: '49만원 상품과 79만원 상품의 차이는 무엇인가요?', a: '49만원 상품은 기본 세팅 중심이고, 79만원 상품은 AI를 활용한 문구, 섹션, 상담 전환 구조, SEO 기본 구조까지 함께 정리하는 상품입니다.' },
    { q: '150만원 이상 상품은 언제 선택해야 하나요?', a: '서브페이지, 게시판, 맞춤 디자인, 콘텐츠 기획, 브랜드 구성, 복잡한 기능이 필요한 경우 맞춤 제작형을 추천합니다.' },
    { q: '도메인 연결도 해주나요?', a: '상품 범위에 따라 도메인 연결 안내 또는 기본 연결을 지원할 수 있습니다.' },
    { q: '기존 홈페이지에도 적용할 수 있나요?', a: '가능합니다. 다만 기존 홈페이지 구조와 제작 방식에 따라 적용 범위가 달라질 수 있습니다.' },
    { q: 'SEO 상위노출도 보장되나요?', a: 'SEO 기본 구조는 잡아드릴 수 있지만, 상위노출은 콘텐츠 품질, 운영 기간, 경쟁도, 트래픽, 백링크 등 여러 요소가 함께 작용합니다.' },
    { q: '결제 전에 상담할 수 있나요?', a: '네. 업종과 필요한 기능을 확인한 뒤 적합한 상품을 안내해드립니다.' }
  ];

  const industries = [
    { name: '병원/성형외과', icon: <Stethoscope size={24} /> },
    { name: '치과', icon: <Activity size={24} /> },
    { name: '개인회생 법률사무소', icon: <Scale size={24} /> },
    { name: '아파트 분양', icon: <Building2 size={24} /> },
    { name: '지역 커뮤니티', icon: <Users size={24} /> },
    { name: '유학원/어학원', icon: <Briefcase size={24} /> },
    { name: '풀빌라/숙박', icon: <Home size={24} /> },
    { name: '골프 과정', icon: <Activity size={24} /> },
    { name: '부동산', icon: <Building2 size={24} /> },
    { name: '교회/단체', icon: <Users size={24} /> },
    { name: '기업/제조업', icon: <Building2 size={24} /> },
    { name: '음식점/예약', icon: <Coffee size={24} /> },
    { name: '라이브커머스/후원 플랫폼', icon: <Video size={24} /> }
  ];

  return (
    <main className="pt-20 pb-16 md:pb-0 relative">
      {/* 플로팅 메뉴 (Desktop) */}
      <div className="hidden md:flex flex-col fixed right-6 top-1/2 -translate-y-1/2 z-50 space-y-3">
        <button onClick={() => scrollTo('pricing-section')} className="w-14 h-14 bg-white rounded-full shadow-[0_4px_20px_-5px_rgba(0,0,0,0.1)] border border-slate-200 flex flex-col items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-all hover:-translate-y-1 group">
          <BarChart size={24} />
          <span className="text-[10px] font-bold mt-1 group-hover:text-blue-600">상품비교</span>
        </button>
        <Link to="/consult" className="w-14 h-14 bg-blue-900 rounded-full shadow-[0_4px_20px_-5px_rgba(29,78,216,0.4)] flex flex-col items-center justify-center text-white hover:bg-blue-800 transition-all hover:-translate-y-1 group">
          <MousePointerClick size={24} />
          <span className="text-[10px] font-bold mt-1 text-blue-100">상담신청</span>
        </Link>
        <a href="http://pf.kakao.com/_MTlNK/chat" target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#FEE500] rounded-full shadow-[0_4px_20px_-5px_rgba(254,229,0,0.4)] flex flex-col items-center justify-center text-[#371D1E] hover:bg-[#FDD800] transition-all hover:-translate-y-1 group">
          <MessageCircle size={24} />
          <span className="text-[10px] font-bold mt-1">카톡상담</span>
        </a>
        <a href="tel:0503-6982-1200" className="w-14 h-14 bg-emerald-500 rounded-full shadow-[0_4px_20px_-5px_rgba(16,185,129,0.4)] flex flex-col items-center justify-center text-white hover:bg-emerald-400 transition-all hover:-translate-y-1 group">
          <Phone size={24} />
          <span className="text-[10px] font-bold mt-1 text-emerald-100">전화상담</span>
        </a>
      </div>

      {/* 플로팅 메뉴 (Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-3 z-50 flex justify-around shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <button onClick={() => scrollTo('pricing-section')} className="flex flex-col items-center text-slate-600 active:text-blue-600">
          <BarChart size={22} className="mb-1" />
          <span className="text-[10px] font-bold">상품비교</span>
        </button>
        <Link to="/consult" className="flex flex-col items-center text-blue-600">
          <MousePointerClick size={22} className="mb-1" />
          <span className="text-[10px] font-bold">상담신청</span>
        </Link>
        <a href="http://pf.kakao.com/_MTlNK/chat" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-[#371D1E]">
          <MessageCircle size={22} className="mb-1 text-[#371D1E]" />
          <span className="text-[10px] font-bold text-[#371D1E]">카톡상담</span>
        </a>
        <a href="tel:0503-6982-1200" className="flex flex-col items-center text-emerald-600">
          <Phone size={22} className="mb-1" />
          <span className="text-[10px] font-bold">전화상담</span>
        </a>
      </div>

      {/* Hero Section */}
      <section className="py-24 bg-blue-900 border-b border-blue-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-800 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <p className="text-yellow-400 font-bold mb-4 tracking-wider">온오프빌더 유료상품 안내</p>
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight mb-6 tracking-tight">
            AI 홈페이지 제작, <br className="hidden sm:block" />
            <span className="text-yellow-400">내 상황에 맞게 선택하세요</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed font-medium max-w-3xl mx-auto">
            온오프빌더는 AI로 홈페이지를 빠르게 만들 수 있도록 도와주고,<br className="hidden md:block" />
            온오프마케팅은 실제 운영에 필요한 세팅, 상담 버튼, 지도, 문의폼, SEO 구조까지 적용해드립니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => scrollTo('pricing-section')}
              className="px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
            >
              상품 비교하기
            </button>
            <Link 
              to="/consult"
              className="px-8 py-4 bg-blue-800 text-white border border-blue-700 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
            >
              상담 후 선택하기
            </Link>
            <Link 
              to="/free-courses"
              className="px-8 py-4 bg-transparent text-blue-200 border border-blue-400/50 rounded-xl font-bold text-lg hover:bg-blue-800/50 hover:text-white transition-colors"
            >
              무료강의 먼저 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Section 1. 왜 유료 세팅이 필요한가요? */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">
              AI로 만들 수 있지만, <br className="hidden sm:block" />
              <span className="text-blue-700">실제 적용은 따로 필요합니다</span>
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              AI와 빌더를 활용하면 홈페이지의 구조와 디자인은 빠르게 만들 수 있습니다.<br className="hidden md:block" />
              하지만 실제 운영을 위해서는 도메인 연결, 문의폼, 상담 버튼, 카카오톡 연결, 네이버플레이스, 구글지도, 게시판, SEO 기본 구조, 모바일 최적화 같은 세팅이 필요합니다.
            </p>
            <p className="text-lg font-bold text-slate-800 mt-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              온오프빌더 유료상품은 단순히 화면을 만드는 것이 아니라, <br className="hidden sm:block" />
              내 사업에 맞게 홈페이지가 실제로 작동하도록 적용하는 서비스입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: <Settings size={28} />, title: '빠른 제작', desc: 'AI와 빌더로 홈페이지 구조를 빠르게 구성' },
              { icon: <Building2 size={28} />, title: '실전 세팅', desc: '문의폼, 상담 버튼, 지도, 도메인 등 운영 기능 적용' },
              { icon: <MousePointerClick size={28} />, title: '전환 설계', desc: '방문자가 문의하도록 CTA와 콘텐츠 흐름 구성' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center hover:border-blue-300 transition-colors">
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-800 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2. 상품 비교표 */}
      <section id="pricing-section" className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">상품 비교표</h2>
            <p className="text-lg text-slate-600">내 사업 상황과 목표에 맞는 상품을 선택해보세요.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* 기본 세팅형 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">기본 세팅형</h3>
              <div className="text-4xl font-extrabold text-blue-700 mb-6">490,000<span className="text-lg font-medium text-slate-500">원</span></div>
              
              <div className="bg-slate-50 p-5 rounded-xl mb-8 border border-slate-100">
                <p className="font-bold text-slate-800 mb-2">추천 대상</p>
                <ul className="text-sm text-slate-600 space-y-2 list-disc list-inside">
                  <li>온오프빌더로 만든 페이지 세팅</li>
                  <li>도메인, 버튼, 문의폼 단기 적용</li>
                  <li>직접 운영하며 도움받고 싶은 분</li>
                </ul>
              </div>

              <div className="mb-8 flex-1">
                <p className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">포함 내용</p>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />기본 랜딩페이지 구조 점검</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />도메인 연결 안내/기본 지원</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />전화걸기 버튼 적용</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />카카오톡 상담 버튼 적용</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />기본 문의폼 적용</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />네이버/구글지도 연결</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />모바일 화면 기본 점검</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-2 shrink-0" />기본 CTA 버튼 정리</li>
                </ul>
              </div>
              
              <Link to="/consult" className="block w-full py-4 text-center rounded-xl bg-slate-100 font-bold text-slate-700 hover:bg-slate-200 hover:text-slate-900 transition-colors">
                기본 세팅형 상담하기
              </Link>
            </div>

            {/* AI 적용형 */}
            <div className="bg-white rounded-3xl p-8 border-2 border-blue-600 shadow-xl shadow-blue-900/10 flex flex-col relative transform lg:-translate-y-4 z-10 w-full">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-blue-600 text-white font-bold text-sm rounded-full shadow-md flex items-center">
                <Sparkles size={16} className="mr-2 text-yellow-300" /> 가장 많이 선택
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 mt-4">AI 적용형</h3>
              <div className="text-4xl font-extrabold text-blue-700 mb-6">790,000<span className="text-lg font-medium text-slate-500">원</span></div>
              
              <div className="bg-blue-50 p-5 rounded-xl mb-8 border border-blue-100">
                <p className="font-bold text-blue-900 mb-2">추천 대상</p>
                <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                  <li>구조와 문구를 AI로 정리</li>
                  <li>상담 전환 중심 랜딩페이지 개선</li>
                  <li>SEO 콘텐츠 구조 동시 설계</li>
                  <li>무료강의 후 실제 사업용 구축</li>
                </ul>
              </div>

              <div className="mb-8 flex-1">
                <p className="font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">포함 내용</p>
                <ul className="space-y-3 text-sm text-slate-700">
                  <li className="flex items-start font-bold text-emerald-600"><CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2 shrink-0" />기본 세팅형 전체 포함</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />업종별 홈페이지 구조 점검</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />AI 문구 및 섹션 구성 정리</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />메인 카피 개선</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />상담 전환 버튼 적용</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />문의/상담 신청폼 적용</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />FAQ 구성</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />SEO 기본 구조 점검</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-blue-600 mr-2 shrink-0" />기본 프롬프트 제공</li>
                </ul>
              </div>
              
              <Link to="/consult" className="block w-full py-4 text-center rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                AI 적용형 상담하기
              </Link>
            </div>

            {/* 맞춤 제작형 */}
            <div className="bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/10 rounded-full blur-2xl"></div>
              <h3 className="text-2xl font-bold text-white mb-2 relative z-10">맞춤 제작형</h3>
              <div className="text-4xl font-extrabold text-yellow-400 mb-6 relative z-10">1,500,000<span className="text-lg font-medium text-slate-400">원 이상</span></div>
              
              <div className="bg-slate-800/80 p-5 rounded-xl mb-8 border border-slate-700 relative z-10">
                <p className="font-bold text-yellow-400 mb-2">추천 대상</p>
                <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                  <li>업종별 맞춤 홈페이지 제작</li>
                  <li>서브페이지/게시판 확장이 필요한 분</li>
                  <li>브랜드/콘텐츠/SEO 통합 기획 구축</li>
                  <li>구조가 복잡하거나 메뉴 리뉴얼 시</li>
                </ul>
              </div>

              <div className="mb-8 flex-1 relative z-10">
                <p className="font-bold text-white mb-4 pb-2 border-b border-slate-700">포함 내용</p>
                <ul className="space-y-3 text-sm text-slate-300">
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />맞춤 홈페이지 기획</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />메인 및 서브페이지 구성</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />게시판 구조 설계</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />상담 전환 동선 설계</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />업종별 SEO 콘텐츠 구조 설계</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />AI 프롬프트 맞춤 제작</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />모바일 최적화</li>
                  <li className="flex items-start"><CheckCircle2 className="w-5 h-5 text-yellow-400 mr-2 shrink-0" />필요시 그누보드/워드프레스 적용</li>
                </ul>
                <p className="text-xs text-slate-500 mt-4">* 프로젝트 범위에 따른 별도 견적 진행</p>
              </div>
              
              <Link to="/consult" className="block w-full py-4 text-center rounded-xl bg-yellow-400 font-bold text-slate-900 hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20 relative z-10">
                맞춤 제작 상담하기
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3. 어떤 상품을 선택해야 할까요? */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">어떤 상품을 선택해야 할까요?</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center flex flex-col justify-center items-center h-full">
              <p className="text-slate-600 mb-4 font-medium">간단한 랜딩페이지 적용이면</p>
              <p className="text-2xl font-bold text-blue-700">기본 세팅형 49만원</p>
            </div>
            <div className="bg-blue-600 p-6 rounded-2xl shadow-md border border-blue-500 text-center text-white transform md:-translate-y-2 flex flex-col justify-center items-center h-full">
              <p className="text-blue-100 mb-4 font-medium">AI 문구, 섹션, SEO 구조까지 잡고 싶다면</p>
              <p className="text-2xl font-bold text-yellow-300">AI 적용형 79만원</p>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-800 text-center flex flex-col justify-center items-center h-full">
              <p className="text-slate-400 mb-4 font-medium">서브페이지, 게시판, 맞춤 디자인까지 필요하다면</p>
              <p className="text-2xl font-bold text-white">맞춤 제작형 150만원 이상</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4. 업종별 적용 가능 사례 */}
      <section className="py-24 bg-white border-t border-slate-200">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">다양한 업종에 적용할 수 있습니다</h2>
             <p className="text-lg text-slate-600">내 업종에 맞게 커스텀 적용이 가능합니다.</p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
             {industries.map((ind, idx) => (
               <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 group hover:border-blue-300 hover:bg-blue-50 transition-colors flex flex-col items-center justify-center text-center">
                 <div className="text-slate-400 group-hover:text-blue-600 mb-4 transition-colors">
                   {ind.icon}
                 </div>
                 <h3 className="font-bold text-sm text-slate-800 mb-4 w-full h-10 flex items-center justify-center">{ind.name}</h3>
                 <Link to="/consult" className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-600 transition-colors w-full tracking-wide">
                    상담하기
                 </Link>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* Section 5. 진행 순서 */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white tracking-tight">진행은 이렇게 됩니다</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 lg:gap-2">
            {[
              '상담 신청', '업종과 목표 확인', '기존 홈페이지 여부 확인', '필요한 상품 선택',
              'AI 기획 또는\n맞춤 기획', '빌더 적용\n및 세팅', '최종 확인', '운영 안내'
            ].map((step, idx) => (
              <div key={idx} className="relative z-10 text-center bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[140px]">
                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mb-3">
                   {idx + 1}
                 </div>
                 <p className="text-sm font-bold text-slate-200 leading-tight whitespace-pre-wrap">{step}</p>
                 {idx < 7 && (
                   <div className="hidden lg:block absolute top-1/2 -right-[15px] w-5 text-slate-600 transform -translate-y-1/2 z-20">
                     <MoveRight size={20} />
                   </div>
                 )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6. FAQ */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">자주 묻는 질문</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button 
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center font-bold text-slate-800 hover:bg-slate-50/50 focus:outline-none"
                >
                  <span className="pr-8">{faq.q}</span>
                  <ChevronDown className={`shrink-0 transition-transform ${openFaq === idx ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} size={20} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 7. 최종 CTA */}
      <section className="py-24 bg-blue-900 text-center relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-800 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            내 홈페이지에는 <span className="text-yellow-400">어떤 상품이 맞을까요?</span>
          </h2>
          <p className="text-lg text-blue-100 mb-10 leading-relaxed font-medium">
            간단한 세팅이면 49만원,<br className="hidden sm:block" />
            AI 적용과 전환 구조까지 필요하면 79만원,<br className="hidden sm:block" />
            맞춤 제작이 필요하면 150만원 이상 상품을 추천드립니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button
               onClick={() => scrollTo('pricing-section')}
               className="w-full sm:w-auto px-8 py-4 bg-yellow-400 text-slate-900 rounded-xl font-bold text-lg hover:bg-yellow-300 transition-colors shadow-lg shadow-yellow-500/20"
            >
              상담 후 상품 선택하기
            </button>
            <a
               href="http://pf.kakao.com/_MTlNK/chat"
               target="_blank"
               rel="noopener noreferrer"
               className="w-full sm:w-auto px-8 py-4 bg-[#FEE500] text-[#371D1E] rounded-xl font-bold text-lg hover:bg-[#FDD800] transition-colors shadow-lg shadow-yellow-500/10 flex items-center justify-center"
            >
              <MessageCircle size={20} className="mr-2" />
              카카오톡으로 문의하기
            </a>
            <a
               href="tel:0503-6982-1200"
               className="w-full sm:w-auto px-8 py-4 bg-transparent border border-blue-400 text-blue-100 rounded-xl font-bold text-lg hover:bg-blue-800 hover:text-white transition-colors flex items-center justify-center"
            >
              <Phone size={20} className="mr-2" />
              전화상담하기
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
