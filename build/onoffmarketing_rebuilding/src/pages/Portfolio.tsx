import { Target, ExternalLink, ShieldCheck, CheckCircle2, ChevronDown, MoveRight, MonitorSmartphone, MousePointerClick, PlayCircle, MessageCircle, Link as LinkIcon, PenTool, LayoutTemplate, X, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import RealResultsAndCasesSection from '../components/RealResultsAndCasesSection';

export default function Portfolio() {
  const [filter, setFilter] = useState('전체');
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    '전체', '병원/의료', '법률', '분양/부동산', '교육', '숙박/여행', '커뮤니티', '기업', '음식점', '플랫폼'
  ];

  const cases = [
    {
      title: '온오프성형외과',
      category: '병원/의료',
      url: 'https://plastic.icrm.co.kr',
      desc: '고급스러운 브랜딩, 시술 소개, 상담 전환 버튼이 중요한 의료 홈페이지 사례입니다.',
      tags: ['의료', '성형외과', '상담전환', '고급디자인', '모바일최적화'],
      bg: 'bg-gradient-to-br from-blue-100 to-indigo-100'
    },
    {
      title: '온오프피부클리닉',
      category: '병원/의료',
      url: 'https://skin.icrm.co.kr',
      desc: '시술 전후, 이벤트 안내, 빠른 상담 예약이 돋보이는 피부과 홈페이지 사례입니다.',
      tags: ['피부과', '의료', '이벤트', '상담예약', '깔끔한디자인'],
      bg: 'bg-gradient-to-br from-rose-100 to-pink-100'
    },
    {
      title: '온오프한의원',
      category: '병원/의료',
      url: 'https://koreanclinic.icrm.co.kr',
      desc: '진료과목, 특화 클리닉 소개, 온라인 예약 기능이 포함된 한의원 홈페이지 사례입니다.',
      tags: ['한의원', '의료', '진료안내', '온라인예약', '신뢰도'],
      bg: 'bg-gradient-to-br from-emerald-100 to-teal-100'
    },
    {
      title: '온오프더팰리스 아파트분양',
      category: '분양/부동산',
      url: 'https://palace.icrm.co.kr',
      desc: '입지, 프리미엄, 평면도, 방문예약을 강조하는 분양형 랜딩페이지 사례입니다.',
      tags: ['분양', '랜딩페이지', '방문예약', '입지소개', '고급브랜딩'],
      bg: 'bg-gradient-to-br from-amber-100 to-orange-100'
    },
    {
      title: '온오프회생법률센터',
      category: '법률',
      url: 'https://recoverylaw.icrm.co.kr',
      desc: '신뢰도, 상담신청, 자격진단, 성공사례가 중요한 법률 마케팅 홈페이지 사례입니다.',
      tags: ['법률', '개인회생', '상담신청', '자격진단', 'SEO'],
      bg: 'bg-gradient-to-br from-slate-200 to-slate-400'
    },
    {
      title: '온오프이혼법률센터',
      category: '법률',
      url: 'https://divorcelaw.icrm.co.kr',
      desc: '비밀 보장, 승소 사례, 빠른 1:1 상담 연결을 강조하는 이혼 전문 법률사무소 사례입니다.',
      tags: ['법률', '이혼소송', '상담신청', '비밀보장', '신뢰도'],
      bg: 'bg-gradient-to-br from-indigo-100 to-purple-100'
    },
    {
      title: '온오프모터스 중고자동차',
      category: '기업',
      url: 'https://motors.icrm.co.kr',
      desc: '매물 검색, 허위매물 근절 안내, 빠른 시세 조회 및 상담 신청이 중심이 되는 중고차 홈페이지입니다.',
      tags: ['중고차', '차량매물', '시세조회', '상담신청', '모바일최적화'],
      bg: 'bg-gradient-to-br from-gray-200 to-stone-300'
    },
    {
      title: '온오프풀빌라',
      category: '숙박/여행',
      url: 'https://poolvilla.icrm.co.kr',
      desc: '객실, 위치, 예약, 이미지 중심 구성이 중요한 숙박/풀빌라 홈페이지 사례입니다.',
      tags: ['풀빌라', '숙박', '예약', '여행', '이미지중심'],
      bg: 'bg-gradient-to-br from-cyan-100 to-blue-200'
    },
    {
      title: '온오프영어학원',
      category: '교육',
      url: 'https://english.icrm.co.kr',
      desc: '프로그램 소개, 커리큘럼, 상담 신청, 합격 후기 콘텐츠가 중요한 교육 홈페이지 사례입니다.',
      tags: ['학원', '어학원', '교육', '상담', '프로그램소개'],
      bg: 'bg-gradient-to-br from-yellow-100 to-amber-200'
    },
    {
      title: '온오프클린 입주청소',
      category: '기업',
      url: 'https://clean.icrm.co.kr',
      desc: '청소 전후 비교, 서비스 절차, 간편 견적 문의 등 홈케어 서비스에 최적화된 사례입니다.',
      tags: ['입주청소', '홈케어', '견적문의', '서비스소개', '포트폴리오'],
      bg: 'bg-gradient-to-br from-sky-100 to-blue-200'
    },
    {
      title: '온오프커뮤니티',
      category: '커뮤니티',
      url: 'https://community.icrm.co.kr',
      desc: '다양한 게시판, 회원 참여, 지역 정보, 제보 기능을 갖춘 커뮤니티 홈페이지 사례입니다.',
      tags: ['커뮤니티', '게시판', '회원가입', '지역정보', '제보함'],
      bg: 'bg-gradient-to-br from-teal-100 to-emerald-100'
    },
    {
      title: '온오프브로우 반영구눈썹',
      category: '병원/의료',
      url: 'https://brow.icrm.co.kr',
      desc: '시술 갤러리, 가격 안내, 원장 이력, 빠른 카카오톡 예약이 강조된 뷰티샵 사례입니다.',
      tags: ['뷰티', '반영구', '갤러리', '카톡예약', '원장소개'],
      bg: 'bg-gradient-to-br from-pink-100 to-rose-200'
    },
    {
      title: '온오프스페이스 인테리어',
      category: '기업',
      url: 'https://space.icrm.co.kr',
      desc: '시공 평수별 포트폴리오, 3D 도면, 견적 시뮬레이션 및 상담을 제공하는 인테리어 사례입니다.',
      tags: ['인테리어', '포트폴리오', '견적문의', '시공사례', '이미지중심'],
      bg: 'bg-gradient-to-br from-stone-200 to-slate-300'
    }
  ];

  const filteredCases = filter === '전체' ? cases : cases.filter(c => c.category === filter);

  const getPrompt = (title: string) => `당신은 업종별 홈페이지 전문 기획자입니다.\n${title}를 제작하려고 합니다.\n방문자가 첫 화면에서 신뢰감을 느끼고 상담 버튼을 클릭하도록 메인 카피, 섹션 구성, CTA 버튼, FAQ, SEO용 콘텐츠 구조까지 포함해서 홈페이지를 설계해주세요.\n전화걸기, 카카오톡 상담, 네이버플레이스, 구글지도, 문의폼 버튼이 자연스럽게 배치되도록 구성해주세요.\nPC와 모바일에서 모두 보기 좋은 랜딩페이지 구조로 제안해주세요.`;

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    { q: '제작사례에 있는 샘플은 실제 사이트인가요?', a: '샘플 페이지는 온오프빌더와 AI를 활용해 제작 가능한 업종별 홈페이지 예시입니다. 일부는 실제 도메인에 연결된 데모 사이트로 확인할 수 있습니다.' },
    { q: '샘플을 그대로 사용할 수 있나요?', a: '샘플은 참고용입니다. 실제 사용을 위해서는 업종 정보, 사진, 연락처, 지도, 문의폼, 도메인 연결 등의 적용 과정이 필요합니다.' },
    { q: '직접 만들고 배포할 수 있나요?', a: '가능합니다. 무료강의에서 AI로 홈페이지를 기획하고 온오프빌더로 구성하는 기본 흐름을 안내합니다.' },
    { q: '홈페이지 제작 경험이 없어도 가능한가요?', a: '가능합니다. 업종, 키워드, 원하는 스타일을 입력하고 AI가 제안하는 구조를 바탕으로 시작할 수 있습니다.' },
    { q: 'SEO 구조도 함께 만들 수 있나요?', a: 'AI를 활용해 기본적인 키워드 방향, 섹션 구조, FAQ, 콘텐츠 제목을 설계할 수 있습니다. 다만 상위노출은 운영 기간, 콘텐츠 품질, 경쟁도 등 여러 요소가 함께 필요합니다.' },
    { q: '유료 세팅 상품은 어디서 확인하나요?', a: '유료 세팅 상품은 별도 상품 안내(요금제) 페이지에서 확인할 수 있습니다. 제작사례 페이지에서는 무료강의 신청을 중심으로 안내합니다.' }
  ];

  return (
    <main className="pt-20 relative bg-slate-50">
      
      {/* Toast Notification */}
      {isCopied && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-slate-800 text-white px-6 py-3 rounded-full font-bold shadow-xl flex items-center animate-in slide-in-from-top-4 fade-in duration-300">
          <Check size={18} className="mr-2 text-emerald-400" />
          프롬프트가 복사되었습니다
        </div>
      )}

      {/* 1. 제작사례 소개 히어로 */}
      <section className="py-24 bg-white border-b border-slate-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] pointer-events-none opacity-60"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tight">
              AI로 만든 홈페이지 사례를 <br className="hidden sm:block" />
              <span className="text-blue-700">직접 확인해보세요</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-6 leading-relaxed">
              온오프마케팅은 AI와 온오프빌더를 활용해 업종별 홈페이지 구조, 문구, 상담 동선, SEO 콘텐츠 방향까지 빠르게 기획합니다. <br className="hidden md:block" />
              아래 제작 사례를 통해 내 업종에 맞는 홈페이지 방향을 확인해보세요.
            </p>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-10 w-fit">
              <p className="font-bold text-blue-900 flex items-center">
                <CheckCircle2 size={20} className="text-blue-600 mr-2 shrink-0" />
                샘플을 보고, 프롬프트를 확인하고, 직접 만들어볼 수 있습니다.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#samples" className="px-6 py-4 border border-slate-200 text-slate-700 rounded-xl font-bold text-center hover:bg-slate-50 transition-colors shadow-sm">
                샘플 사례 보기
              </a>
              <a href="https://aistudio.google.com/apps/45221816-f921-4e7d-a00f-f9d191098db1?showPreview=true&showAssistant=true&fullscreenApplet=true" target="_blank" rel="noopener noreferrer" className="px-6 py-4 border border-slate-200 bg-white text-slate-700 rounded-xl font-bold text-center hover:bg-slate-50 transition-colors shadow-sm flex items-center justify-center">
                제작 사례 직접 만들기
              </a>
              <Link to="/free-courses" className="px-6 py-4 bg-blue-700 text-white rounded-xl font-bold text-center hover:bg-blue-800 transition-colors shadow-md shadow-blue-700/20">
                무료강의 신청하기
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[500px] h-[400px] bg-slate-100 rounded-3xl border-8 border-slate-200 shadow-2xl overflow-hidden flex flex-col">
              {/* Fake browser header */}
              <div className="h-10 bg-slate-200 flex items-center px-4 space-x-2 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                <div className="mx-auto h-5 w-48 bg-white/50 rounded-md"></div>
              </div>
              <div className="p-6 bg-white flex-1 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="absolute top-10 left-10 w-24 h-24 bg-blue-100 rounded-full blur-xl"></div>
                <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-100 rounded-full blur-xl"></div>
                <MonitorSmartphone size={80} className="text-blue-500 mb-6 drop-shadow-sm relative z-10" />
                <p className="font-bold text-slate-800 text-xl mb-2 relative z-10">AI 홈페이지 샘플 미리보기</p>
                <p className="text-slate-500 text-sm text-center px-6 relative z-10">
                  PC와 모바일 화면에 맞춰 최적화된 홈페이지 구조를 바로 확인하세요.
                </p>
                
                {/* Mock Phone overlapping */}
                <div className="absolute -bottom-10 -right-4 w-32 h-48 bg-white border-4 border-slate-800 rounded-2xl shadow-xl flex flex-col overflow-hidden transform -rotate-6">
                   <div className="h-4 bg-slate-800 w-full rounded-b-xl flex justify-center"><div className="w-6 h-1 bg-slate-600 rounded-full mt-1"></div></div>
                   <div className="flex-1 bg-slate-50 p-2 space-y-2">
                     <div className="h-10 bg-indigo-100 rounded-md"></div>
                     <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                     <div className="h-4 w-1/2 bg-slate-200 rounded"></div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 실제 성과와 사례 섹션 */}
      <RealResultsAndCasesSection />

      {/* 2. AI 샘플 홈페이지 사례 & 3. 업종별 필터 */}
      <section id="samples" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">AI 샘플 홈페이지 사례</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              업종별로 필요한 홈페이지 구조는 다릅니다. 온오프마케팅은 AI를 활용해 업종별 고객 흐름, 상담 버튼, 콘텐츠 구조, SEO 방향을 빠르게 설계합니다. 아래 샘플 사례를 클릭하면 실제 데모 페이지를 새창에서 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex overflow-x-auto pb-4 mb-8 scrollbar-hide gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
                  filter === cat 
                  ? 'bg-slate-800 text-white border border-slate-800 transform scale-105' 
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* 4. 사례 카드 리스트 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCases.map((c, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group">
                <div className={`h-48 ${c.bg} flex flex-col items-center justify-center relative overflow-hidden px-6 text-center`}>
                  <div className="absolute inset-0 bg-white/10 group-hover:bg-white/0 transition-colors"></div>
                  <MonitorSmartphone size={40} className="text-slate-700/30 mb-3 drop-shadow-sm" />
                  <h3 className="font-extrabold text-2xl text-slate-800 drop-shadow-sm relative z-10">{c.title}</h3>
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm">
                    {c.category}
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <p className="text-slate-600 mb-5 leading-relaxed text-sm">
                    {c.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6 flex-1">
                    {c.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <a 
                      href={c.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-blue-50 text-blue-700 border border-blue-100 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                    >
                      샘플 보기 <ExternalLink size={16} className="ml-2" />
                    </a>
                    <div className="grid grid-cols-2 gap-2">
                       <button
                         onClick={() => setSelectedCase(c)}
                         className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                       >
                         제작 프롬프트
                       </button>
                       <Link
                         to="/free-courses"
                         className="w-full py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-sm flex items-center justify-center hover:bg-slate-50 transition-colors whitespace-nowrap px-2"
                       >
                         무료강의 신청
                       </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 mt-8">
              <MonitorSmartphone size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">해당 카테고리의 사례가 아직 준비되지 않았습니다.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. 제작 프롬프트 보기 모달 */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800 flex items-center">
                <PenTool size={20} className="mr-2 text-blue-500" />
                {selectedCase.title} 제작 프롬프트
              </h3>
              <button 
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-700 p-2 hover:bg-slate-200 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-white relative group">
              <pre className="whitespace-pre-wrap font-mono text-sm text-slate-600 bg-slate-50 p-6 rounded-xl border border-slate-200 leading-relaxed">
                {getPrompt(selectedCase.title)}
              </pre>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-3 justify-end items-center">
              <span className="text-sm text-slate-500 mr-auto hidden sm:block">프롬프트를 복사하여 AI 스튜디오에 붙여넣어보세요.</span>
              <button 
                onClick={() => handleCopyPrompt(getPrompt(selectedCase.title))}
                className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 border border-slate-300 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center shadow-sm"
              >
                <Copy size={18} className="mr-2 text-slate-500" /> 복사하기
              </button>
              <Link 
                to="/free-courses"
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center shadow-sm"
              >
                무료강의 신청
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 6. 직접 만들고 배포하기 CTA */}
      <section className="py-24 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl mb-8 transform rotate-3">
            <LayoutTemplate size={32} />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">내 업종 홈페이지도 직접 만들어보세요</h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-4 max-w-2xl mx-auto">
            AI를 활용하면 홈페이지 기획을 빠르게 시작할 수 있습니다.<br className="hidden sm:block"/>
            업종, 키워드, 고객 유형을 입력하면 홈페이지 구조, 메인 문구, 상담 버튼, FAQ, SEO 콘텐츠 방향까지 확인할 수 있습니다.
          </p>
          <p className="text-lg font-medium text-slate-700 leading-relaxed max-w-2xl mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200 mb-10">
            온오프마케팅은 AI로 만든 시안을 온오프빌더로 적용하고, 실제 도메인에 배포하는 방법까지 안내합니다.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
             <a 
               href="https://aistudio.google.com/apps/45221816-f921-4e7d-a00f-f9d191098db1?showPreview=true&showAssistant=true&fullscreenApplet=true" 
               target="_blank" 
               rel="noopener noreferrer"
               className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
             >
               제작 사례 직접 만들기
             </a>
             <Link 
               to="/free-courses"
               className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm"
             >
               무료강의 신청하기
             </Link>
             <Link 
               to="/consult"
               className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-300 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors shadow-sm"
             >
               상담 문의하기
             </Link>
          </div>
        </div>
      </section>

      {/* 7. 무료강의 신청 CTA */}
      <section className="py-24 bg-slate-900 overflow-hidden relative">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-tight leading-tight">
            AI 홈페이지 제작 방법을 <br className="hidden sm:block" />
            <span className="text-yellow-400">무료강의에서 확인하세요</span>
          </h2>
          <p className="text-lg text-slate-300 mb-10 leading-relaxed font-medium max-w-2xl mx-auto">
            샘플 사례를 보는 것에서 끝나지 않고, 직접 만드는 방법까지 배워보세요.<br className="hidden sm:block" />
            무료강의에서는 AI로 업종별 홈페이지를 기획하고, 온오프빌더로 랜딩페이지를 구성하는 흐름을 안내합니다.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/free-courses"
              className="w-full sm:w-auto px-10 py-5 bg-blue-600 text-white rounded-xl font-bold text-xl hover:bg-blue-500 transition-colors shadow-xl shadow-blue-600/20"
            >
              무료강의 신청하기
            </Link>
            <a 
              href="http://pf.kakao.com/_MTlNK/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-5 bg-[#FEE500] text-[#371D1E] rounded-xl font-bold text-lg hover:bg-[#FDD800] transition-colors flex items-center justify-center shrink-0"
            >
              <MessageCircle size={20} className="mr-2" /> 카카오톡 상담하기
            </a>
            <Link 
              to="/pricing"
              className="w-full sm:w-auto px-8 py-5 bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-lg hover:bg-slate-700 transition-colors"
            >
              온오프빌더 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
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

    </main>
  );
}
