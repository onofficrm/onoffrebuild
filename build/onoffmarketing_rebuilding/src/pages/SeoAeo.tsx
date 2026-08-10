import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  BarChart3, 
  Database, 
  Code2, 
  ShieldCheck, 
  Globe, 
  Cpu, 
  Layers, 
  AlertCircle, 
  MousePointerClick, 
  MessageSquare, 
  Check, 
  Phone,
  SearchCheck,
  FileText,
  HelpCircle,
  Network,
  Filter,
  Layers3,
  GitBranch,
  Target,
  Workflow,
  Share2,
  Zap,
  TrendingUp,
  LayoutGrid,
  Link2,
  FileCode,
  Building2,
  Bot,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  Globe2,
  ArrowUpRight,
  Sparkle,
  XCircle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SeoAeo() {
  const [selectedAuditTab, setSelectedAuditTab] = useState<'all' | 'technical' | 'content' | 'aeo'>('all');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Self Diagnostic Calculator State
  const [calcChecklist, setCalcChecklist] = useState<boolean[]>([false, false, false, false, false]);

  const calcQuestions = [
    { title: 'sitemap.xml 및 robots.txt 제출 완료', desc: '구글 서치콘솔 및 네이버 서치어드바이저에 사이트맵이 정상 등록되어 있나요?' },
    { title: '페이지별 Meta Title 및 Description 설정', desc: '대표 페이지마다 타겟 키워드와 클릭을 유도하는 메타 태그가 고유하게 세팅되어 있나요?' },
    { title: '질문-답변(FAQ) 및 Schema 구조화 데이터', desc: 'AI 검색 로봇이 직관적으로 인식할 수 있는 JSON-LD 형식의 Schema.org 마크업이 포함되어 있나요?' },
    { title: '모바일 반응형 최적화 및 로딩 속도 (Core Web Vitals)', desc: '모바일 기기에서 깨짐 없이 빠르게 동작하며 3초 이내에 주요 화면이 노출되나요?' },
    { title: 'ChatGPT / Gemini 브랜드 상호 인지 여부', desc: 'AI 챗봇에 당사 상호명이나 주요 서비스를 물어봤을 때 정확한 정보와 추천 답변이 나오나요?' }
  ];

  const calcScore = calcChecklist.filter(Boolean).length * 20;

  const toggleCalcCheck = (index: number) => {
    setCalcChecklist(prev => {
      const updated = [...prev];
      updated[index] = !updated[index];
      return updated;
    });
  };

  // AI Engine Simulator Tab State
  const [activeAiEngine, setActiveAiEngine] = useState<'chatgpt' | 'gemini' | 'perplexity'>('chatgpt');

  // Diagnostic Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    website: '',
    keyword: '',
    concern: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    document.title = "SEO·AEO 컨설팅 | 구글·네이버·AI 검색 최적화 | 온오프마케팅";
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('성함과 연락처를 입력해주시기 바랍니다.');
      return;
    }
    // Simulation / Decoupled handler ready for Gnuboard / API endpoint
    setIsSubmitted(true);
  };

  const auditItems = [
    { id: '01', title: '사이트 구조', category: 'technical', desc: '검색 크롤러가 쉽게 탐색할 수 있는 계층적 URL 및 파이프라인 구조' },
    { id: '02', title: '검색엔진 색인', category: 'technical', desc: '구글 및 네이버 검색봇의 정상 수집 및 Indexing 상태 검증' },
    { id: '03', title: 'Title / Meta Description', category: 'content', desc: '페이지별 고유 타이틀 및 클릭률(CTR)을 극대화하는 메타 설명' },
    { id: '04', title: 'H1 / H2 구조', category: 'content', desc: '콘텐츠의 위계질서를 명확히 하는 헤더 태그 세팅' },
    { id: '05', title: '키워드 구조', category: 'content', desc: '구매 의도가 높은 메인·세부 키워드의 배치 및 밀도 최적화' },
    { id: '06', title: '콘텐츠 품질', category: 'content', desc: 'E-E-A-T(경험·전문성·권위성·신뢰성) 기준에 부합하는 콘텐츠 평가' },
    { id: '07', title: '내부링크', category: 'technical', desc: '관련 페이지 간의 유기적 링크 네트워크 및 앵커 텍스트 연결' },
    { id: '08', title: '백링크', category: 'technical', desc: '외부 고신뢰도 도메인으로부터의 레퍼런스 및 신뢰 지수 점검' },
    { id: '09', title: '페이지 속도', category: 'technical', desc: 'Core Web Vitals 성능 지표 및 로딩 속도 최적화' },
    { id: '10', title: '모바일 최적화', category: 'technical', desc: '반응형 레이아웃, 모바일 가독성 및 터치 영역 점검' },
    { id: '11', title: 'Sitemap', category: 'technical', desc: 'sitemap.xml 최신화 및 검색엔진 자동 제출 구조' },
    { id: '12', title: 'Canonical', category: 'technical', desc: '중복 URL 방지를 위한 대표 주소(Canonical Tag) 표준화' },
    { id: '13', title: 'Schema', category: 'aeo', desc: 'AI 및 검색엔진이 직관적으로 이해하는 구조화 데이터(JSON-LD)' },
    { id: '14', title: 'FAQ 구조', category: 'aeo', desc: '질문-답변형 마크업을 통한 AI 검색 결과 및 스니펫 점유' },
    { id: '15', title: '브랜드 정보', category: 'aeo', desc: 'Entity 기반 브랜드 개체 식별 및 정보 신뢰도 수립' },
    { id: '16', title: 'AI 검색 친화도', category: 'aeo', desc: 'ChatGPT, Gemini, Perplexity의 챗봇 답변 인지 가능성 평가' },
    { id: '17', title: '경쟁사이트 비교', category: 'content', desc: '동일 키워드 상위 노출 경쟁업체와의 점유율 및 구조 격차 분석' },
  ];

  const filteredAudits = selectedAuditTab === 'all' 
    ? auditItems 
    : auditItems.filter(item => item.category === selectedAuditTab);

  return (
    <main className="pt-20">
      {/* 1. HERO SECTION */}
      <section className="py-20 md:py-28 bg-slate-900 border-b border-slate-800 relative overflow-hidden text-white">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[160px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 text-left space-y-6">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full text-blue-300 text-sm font-bold tracking-wide">
                <Sparkles size={16} className="text-blue-400 animate-pulse" />
                <span>SEO + AEO 통합 최적화</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                검색엔진과 AI 답변엔진에<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  동시에 노출되는 사이트
                </span>를 만듭니다
              </h1>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
                구글·네이버 검색뿐 아니라 <strong className="text-white font-semibold">ChatGPT, Gemini</strong> 등 AI 검색 및 답변 환경에서도 우리 회사와 콘텐츠를 더 쉽게 이해하고 발견할 수 있도록
                사이트 구조, 콘텐츠, 키워드, 기술 SEO, AEO 구조를 종합적으로 분석하고 개선합니다.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-4">
                <a
                  href="http://pf.kakao.com/_MTlNK/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                >
                  <Search size={18} />
                  <span>무료 SEO/AEO 진단 상담</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </a>
                <button
                  onClick={() => document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
                >
                  <span>서비스 진행과정 보기</span>
                </button>
              </div>

              {/* Trust highlights */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-400 text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">Google & Naver</div>
                  <div className="text-slate-400">검색엔진 상위점유</div>
                </div>
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">ChatGPT & Gemini</div>
                  <div className="text-slate-400">AI 답변엔진 대응</div>
                </div>
                <div>
                  <div className="font-bold text-white text-base sm:text-lg">17개 항목</div>
                  <div className="text-slate-400">정밀 종합 진단</div>
                </div>
              </div>
            </div>

            {/* Hero Right Dashboard Mockup */}
            <div className="lg:col-span-5">
              <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl relative backdrop-blur-sm">
                {/* Sample Tag Badge */}
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4 mb-5">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs font-mono text-slate-400 ml-2">seo-aeo-audit-dashboard</span>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-md text-[11px] font-bold">
                    Sample Analysis
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Item 1: Google Search */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                        GO
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">GOOGLE SEARCH</div>
                        <div className="text-sm font-bold text-white">검색 노출 개선</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                        +240% 색인증가
                      </span>
                    </div>
                  </div>

                  {/* Item 2: Naver Search */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400 font-bold text-xs">
                        NV
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">NAVER SEARCH</div>
                        <div className="text-sm font-bold text-white">콘텐츠 최적화</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full border border-green-500/20">
                        상위 1페이지 노출
                      </span>
                    </div>
                  </div>

                  {/* Item 3: AI Search */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs">
                        AI
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">AI SEARCH</div>
                        <div className="text-sm font-bold text-white">AEO Ready</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-full border border-purple-500/20">
                        ChatGPT/Gemini 인지
                      </span>
                    </div>
                  </div>

                  {/* Item 4: Structured Data */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-xs">
                        JSON
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">STRUCTURED DATA</div>
                        <div className="text-sm font-bold text-white">Schema Ready</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                        JSON-LD 적용완료
                      </span>
                    </div>
                  </div>

                  {/* Item 5: Content Authority */}
                  <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-700/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                        E-A-T
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 font-semibold">CONTENT AUTHORITY</div>
                        <div className="text-sm font-bold text-white">콘텐츠 신뢰도</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                        전문성 검증
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-700/60 text-center">
                  <span className="text-[11px] text-slate-400">
                    * 위 화면은 SEO/AEO 종합 진단 리포트의 예시이며, 실제 분석 결과는 웹사이트마다 달라집니다.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SEO와 AEO 차이 */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">SEO vs AEO Comparison</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “SEO만으로 충분할까요?”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              기존 검색엔진 최적화(SEO)를 넘어, 생성형 AI 답변시대의 핵심인 AEO까지 동시에 준비해야 합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Card 1: SEO */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md font-extrabold text-xs">기존 검색 최적화</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">SEO</h3>
                    <p className="text-xs text-slate-400 font-medium">Search Engine Optimization</p>
                  </div>
                  <Globe className="text-blue-600 w-10 h-10 p-2 bg-blue-50 rounded-xl" />
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">📌 핵심 목표</h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                    <strong className="text-slate-900">Google, Naver</strong> 등 검색엔진에서 웹사이트와 콘텐츠가 검색되기 좋은 구조를 만드는 것.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">🛠️ 주요 요소</h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-slate-700">
                    {[
                      '키워드',
                      '콘텐츠',
                      '사이트 구조',
                      '내부링크',
                      '백링크',
                      '색인',
                      '페이지 속도',
                      '기술 SEO'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-white p-2.5 rounded-lg border border-slate-200">
                        <CheckCircle2 size={14} className="text-blue-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-500">
                🔍 주요 노출 채널: 구글 검색결과, 네이버 웹사이트/VIEW 탭
              </div>
            </div>

            {/* Card 2: AEO */}
            <div className="bg-white rounded-2xl border-2 border-indigo-200 p-8 shadow-md hover:shadow-lg transition-shadow relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-full pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6 border-b border-indigo-100 pb-4">
                  <div>
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-md font-extrabold text-xs">AI 시대의 신개념</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">AEO</h3>
                    <p className="text-xs text-indigo-500 font-medium">Answer Engine Optimization</p>
                  </div>
                  <Cpu className="text-indigo-600 w-10 h-10 p-2 bg-indigo-50 rounded-xl" />
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">📌 핵심 목표</h4>
                  <p className="text-slate-600 text-sm leading-relaxed bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
                    <strong className="text-slate-900">ChatGPT, Gemini, AI 검색, AI 답변서비스</strong> 등이 질문에 답할 때 우리 회사와 콘텐츠를 더 쉽게 이해할 수 있도록 만드는 것.
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3">🛠️ 주요 요소</h4>
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold text-slate-700">
                    {[
                      '질문/답변 구조',
                      'FAQ',
                      '브랜드 정보',
                      '전문 콘텐츠',
                      'Schema',
                      'Entity 정보',
                      '관련 콘텐츠 연결',
                      '정보 신뢰도'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2 bg-indigo-50/30 p-2.5 rounded-lg border border-indigo-100">
                        <CheckCircle2 size={14} className="text-indigo-600 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-indigo-100 text-xs text-indigo-600 font-medium">
                🤖 주요 노출 채널: ChatGPT 답변, Gemini, Perplexity, 구글 SGE/AI Overviews
              </div>
            </div>
          </div>

          {/* Highlight Banner */}
          <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-indigo-900 rounded-2xl p-6 sm:p-8 text-center text-white shadow-xl border border-blue-800/50">
            <div className="inline-flex items-center space-x-2 text-yellow-300 text-sm font-bold mb-2">
              <Sparkles size={18} />
              <span>온오프마케팅의 차별화 핵심 메시지</span>
            </div>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight">
              “검색되는 것에서 끝나지 않고<br className="sm:hidden" /> AI가 이해하기 쉬운 구조까지 준비합니다.”
            </h3>
          </div>
        </div>
      </section>

      {/* 3. 고객 문제 영역 */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Pain Points</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “사이트는 있는데 왜 검색에 안 나올까요?”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              많은 사업주분들이 겪고 계신 8가지 대표적인 검색 노출 문제점을 해결해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { num: '01', title: '홈페이지는 있는데 검색유입이 거의 없다', desc: '검색엔진 수집 로봇이 접근하지 못하거나 색인 생성이 막혀있는 상태입니다.' },
              { num: '02', title: '구글에 페이지가 제대로 노출되지 않는다', desc: 'Sitemap, Robots.txt, Canonical 태그 세팅 미비로 구글 크롤링이 불가능합니다.' },
              { num: '03', title: '네이버 검색 결과가 약하다', desc: '네이버 서치어드바이저 미연동 및 타겟 키워드 메타데이터 부재 문제입니다.' },
              { num: '04', title: '콘텐츠를 만들어도 유입이 늘지 않는다', desc: '검색 의도에 맞지 않는 단어 배치와 위계 구조(H1/H2) 미준수로 점유율 저하.' },
              { num: '05', title: '어떤 키워드를 공략해야 할지 모르겠다', desc: '실제 구매 전환으로 직결되는 가치 높은 키워드 데이터 분석이 미흡합니다.' },
              { num: '06', title: '경쟁사는 나오는데 우리 업체만 안 나온다', desc: '경쟁사 대비 사이트 신뢰도(백링크, 도메인 파워) 및 온페이지 SEO 열세.' },
              { num: '07', title: 'AI 검색에서 회사가 잘 발견되지 않는다', desc: 'ChatGPT나 Gemini가 브랜드를 식별할 수 있는 Schema 구조화 데이터 부족.' },
              { num: '08', title: '블로그와 홈페이지가 따로 놀고 있다', desc: '외부 바이럴과 자사몰 사이의 링크 파이프라인이 단절되어 시너지 미흡.' },
            ].map((item, idx) => (
              <div key={idx} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/30 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-black text-blue-600 bg-blue-100 px-2.5 py-1 rounded-md font-mono">
                      PROBLEM {item.num}
                    </span>
                    <AlertCircle size={18} className="text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-base text-slate-800 mb-2.5 group-hover:text-blue-900 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Problem Solution CTA */}
          <div className="mt-12 text-center bg-blue-50 p-6 rounded-2xl border border-blue-100 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">위 문제점 중 하나라도 해당되시나요?</h4>
              <p className="text-xs sm:text-sm text-slate-600">온오프마케팅 전문가가 사이트의 근본적인 원인을 정확히 찾아드립니다.</p>
            </div>
            <a
              href="http://pf.kakao.com/_MTlNK/chat"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shrink-0 transition-colors"
            >
              원원 진단 받아보기
            </a>
          </div>
        </div>
      </section>

      {/* 4. SEO/AEO 진단 */}
      <section className="py-20 md:py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden" id="audit-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold">
              <ShieldCheck size={14} />
              <span>Full Technical & Content Audit</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              “사이트 전체를 먼저 진단합니다”
            </h2>
            <p className="text-slate-300 text-base md:text-lg">
              17가지 핵심 진단 항목을 바탕으로 웹사이트의 검색 노출 장애 요인과 AI 답변 인지도 상태를 철저히 정밀 검사합니다.
            </p>
          </div>

          {/* Diagnostic Score Board */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-6 mb-8">
              <div>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-md text-xs font-mono font-bold mr-2">
                  Sample SEO Audit
                </span>
                <span className="text-xs text-slate-400 font-medium">진단 종합 리포트 지표 예시</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>실시간 진단 엔진 가동 준비됨</span>
              </div>
            </div>

            {/* Score Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700/60 text-center">
                <div className="text-xs font-bold text-slate-400 mb-1">SEO SCORE</div>
                <div className="text-3xl sm:text-4xl font-black text-blue-400">88<span className="text-xs text-slate-500 font-normal">/100</span></div>
                <div className="text-[11px] text-slate-400 mt-1">검색엔진 색인 및 노출</div>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700/60 text-center">
                <div className="text-xs font-bold text-slate-400 mb-1">AEO SCORE</div>
                <div className="text-3xl sm:text-4xl font-black text-indigo-400">92<span className="text-xs text-slate-500 font-normal">/100</span></div>
                <div className="text-[11px] text-slate-400 mt-1">AI 답변엔진 인지도</div>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700/60 text-center">
                <div className="text-xs font-bold text-slate-400 mb-1">CONTENT SCORE</div>
                <div className="text-3xl sm:text-4xl font-black text-amber-400">85<span className="text-xs text-slate-500 font-normal">/100</span></div>
                <div className="text-[11px] text-slate-400 mt-1">키워드 및 정보성 품질</div>
              </div>

              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-700/60 text-center">
                <div className="text-xs font-bold text-slate-400 mb-1">TECHNICAL SCORE</div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-400">95<span className="text-xs text-slate-500 font-normal">/100</span></div>
                <div className="text-[11px] text-slate-400 mt-1">사이트 기술 및 속도</div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 border-b border-slate-700/60 pb-4">
              {[
                { id: 'all', name: '전체 항목 (17개)' },
                { id: 'technical', name: '기술 & 구조 SEO' },
                { id: 'content', name: '콘텐츠 & 키워드' },
                { id: 'aeo', name: 'AI & AEO 구조' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedAuditTab(tab.id as any)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedAuditTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-900/70 text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Audit Items List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAudits.map((audit) => (
                <div
                  key={audit.id}
                  className="bg-slate-900/80 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/50 transition-colors flex items-start space-x-3"
                >
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 shrink-0">
                    {audit.id}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1">{audit.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{audit.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. 서비스 진행과정 */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200" id="process-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Process Roadmap</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “분석에서 실행까지 함께합니다”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              체계적인 6단계 프로세스를 통해 진단부터 최적화 실행, 성과 모니터링까지 원스톱으로 제공합니다.
            </p>
          </div>

          {/* Desktop Timeline (Horizontal) / Mobile Timeline (Vertical) */}
          <div className="relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6 relative z-10">
              {[
                {
                  step: '01',
                  title: '웹사이트 분석',
                  desc: '사이트 현황, 검색 색인 상태, 기술적 결함 및 AEO 인지도 종합 진단',
                  icon: <Search className="w-5 h-5 text-blue-600" />
                },
                {
                  step: '02',
                  title: '키워드 & 경쟁사 분석',
                  desc: '타겟 고객의 검색 의도 파악, 핵심/세부 키워드 도출 및 경쟁사 비교',
                  icon: <BarChart3 className="w-5 h-5 text-indigo-600" />
                },
                {
                  step: '03',
                  title: 'SEO/AEO 전략 수립',
                  desc: '검색엔진 노출 및 AI 답변 인지를 위한 기술 & 콘텐츠 마스터 플랜 수립',
                  icon: <Sparkles className="w-5 h-5 text-amber-600" />
                },
                {
                  step: '04',
                  title: '구조 & 콘텐츠 개선',
                  desc: '메타태그, H1/H2 구조, Schema 데이터, FAQ 및 질문/답변형 콘텐츠 고도화',
                  icon: <Code2 className="w-5 h-5 text-emerald-600" />
                },
                {
                  step: '05',
                  title: '검색엔진 등록·최적화',
                  desc: 'Search Console, Naver Search Advisor 등록, Sitemap/Canonical 동기화',
                  icon: <Globe className="w-5 h-5 text-sky-600" />
                },
                {
                  step: '06',
                  title: '성과 확인 & 지속 개선',
                  desc: '유입 트래픽 트래킹, 검색 순위 모니터링 및 주기적 튜닝 보고서 제공',
                  icon: <ShieldCheck className="w-5 h-5 text-purple-600" />
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative group">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-black font-mono text-white bg-blue-600 px-2.5 py-1 rounded-md">
                        STEP {item.step}
                      </span>
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 mb-2">{item.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-normal">{item.desc}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 font-medium">
                    단계별 밀착 피드백
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== PHASE 2 NEW SECTIONS ==================== */}

      {/* 6 (NEW 1). 키워드 전략 */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Keyword Strategy</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “검색량보다 사업에 도움이 되는 키워드를 찾습니다”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              단순 조회수 위주의 무의미한 키워드가 아닌, 실제 고객 구매 전환으로 이어지는 3단계 키워드 아키텍처를 구축합니다.
            </p>
          </div>

          {/* 3-Tier Keyword Funnel / Tree UI */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
              {/* Tier 1: 대표 키워드 */}
              <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-sm flex flex-col justify-between relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                  TIER 01
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-blue-500/20">
                    <Target size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">대표 키워드</h3>
                  <p className="text-xs text-slate-500 mb-4">브랜드 인지도 구축 및 메인 서비스 카테고리</p>

                  <div className="space-y-2">
                    {['홈페이지제작', 'SEO', '온라인마케팅'].map((kw, i) => (
                      <div key={i} className="flex items-center space-x-2 bg-blue-50/60 text-blue-900 px-3 py-2 rounded-xl border border-blue-100 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                        <span>{kw}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  특징: 높음 검색량, 브랜딩 및 포괄적 유입
                </div>
              </div>

              {/* Tier 2: 세부 키워드 */}
              <div className="bg-white rounded-2xl p-6 border-2 border-indigo-200 shadow-sm flex flex-col justify-between relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                  TIER 02
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-indigo-500/20">
                    <GitBranch size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">세부 키워드</h3>
                  <p className="text-xs text-slate-500 mb-4">명확한 니즈를 가진 타겟 고객층 공략</p>

                  <div className="space-y-2">
                    {['기업 홈페이지 제작', '검색엔진 최적화 업체', 'SEO 홈페이지 제작'].map((kw, i) => (
                      <div key={i} className="flex items-center space-x-2 bg-indigo-50/60 text-indigo-900 px-3 py-2 rounded-xl border border-indigo-100 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                        <span>{kw}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  특징: 높은 관심도, 실질적 서비스 탐색층
                </div>
              </div>

              {/* Tier 3: 롱테일 키워드 */}
              <div className="bg-white rounded-2xl p-6 border-2 border-emerald-200 shadow-sm flex flex-col justify-between relative">
                <div className="absolute top-4 right-4 text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">
                  TIER 03
                </div>
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-emerald-500/20">
                    <Sparkles size={20} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">롱테일 키워드</h3>
                  <p className="text-xs text-slate-500 mb-4">즉각적인 상담 및 구매 전환으로 이어지는 고가치 검색어</p>

                  <div className="space-y-2">
                    {['구글 검색에 잘 나오는 홈페이지 제작', 'AI 검색 노출 홈페이지', '중소기업 SEO 컨설팅'].map((kw, i) => (
                      <div key={i} className="flex items-center space-x-2 bg-emerald-50/60 text-emerald-900 px-3 py-2 rounded-xl border border-emerald-100 text-xs font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                        <span>{kw}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
                  특징: 낮은 경쟁도, 최고 수준의 매출 전환율
                </div>
              </div>
            </div>
          </div>

          {/* Keyword Selection 5 Criteria */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-slate-900 text-center mb-8">온오프마케팅 키워드 엄선 5대 기준</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { title: '검색량', sub: 'Search Volume', icon: <BarChart3 className="text-blue-600" /> },
                { title: '검색 의도', sub: 'Search Intent', icon: <Target className="text-indigo-600" /> },
                { title: '경쟁도', sub: 'Competition Level', icon: <Filter className="text-amber-600" /> },
                { title: '전환 가능성', sub: 'Conversion Potential', icon: <TrendingUp className="text-emerald-600" /> },
                { title: '콘텐츠 확장성', sub: 'Content Scalability', icon: <Layers3 className="text-purple-600" /> },
              ].map((c, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 text-center shadow-sm hover:border-blue-300 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-3">
                    {c.icon}
                  </div>
                  <div className="font-bold text-slate-900 text-sm mb-0.5">{c.title}</div>
                  <div className="text-[11px] text-slate-400 font-medium">{c.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlight Quote */}
          <div className="bg-blue-50 rounded-2xl p-6 text-center border border-blue-200 max-w-3xl mx-auto">
            <p className="text-lg sm:text-xl font-extrabold text-blue-950">
              “검색량이 많은 키워드가 항상 좋은 키워드는 아닙니다.”
            </p>
            <p className="text-xs sm:text-sm text-blue-700 mt-1">
              실제 결제 의도가 담긴 세부 키워드를 선점할 때 적은 유입으로도 가장 큰 마케팅 성과를 만들어냅니다.
            </p>
          </div>
        </div>
      </section>

      {/* 7 (NEW 2). SEO 실행 서비스 */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Execution Services</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “진단 결과를 실제 사이트에 적용합니다”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              분석으로 끝나지 않고 사이트 내부 코드 수정부터 콘텐츠 발행, 외부 백링크까지 5대 실행 분야를 완벽하게 보완합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Technical SEO */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 font-black text-xs rounded-md">01</span>
                  <Code2 className="text-blue-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Technical SEO</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[36px]">
                  검색엔진 로봇이 사이트를 오류 없이 수집하고 빠르게 불러올 수 있도록 로딩 속도와 기술적 설계를 교정합니다.
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {['사이트 구조', '페이지 속도', '검색엔진 색인', 'Sitemap', 'Canonical', '모바일 최적화'].map((tag, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-700 font-medium">
                      <Check size={14} className="text-blue-600 mr-2 shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. On-Page SEO */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 font-black text-xs rounded-md">02</span>
                  <FileText className="text-indigo-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">On-Page SEO</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[36px]">
                  각 페이지별 제목, 메타설명, H 태그와 키워드 배치를 최적화하여 페이지의 핵심 주제를 검색엔진에 명확히 전달합니다.
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {['Title 메타태그', 'Meta Description', 'Heading (H1/H2) 구조', 'Keyword 밀도 최적화', 'Internal Link (내부링크)'].map((tag, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-700 font-medium">
                      <Check size={14} className="text-indigo-600 mr-2 shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Content SEO */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-black text-xs rounded-md">03</span>
                  <SearchCheck className="text-emerald-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Content SEO</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[36px]">
                  고객이 실제로 검색하는 의도를 반영하고, 질문과 답변이 체계적으로 정리된 고품질 정보를 작성합니다.
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {['검색의도 부합성', '콘텐츠 위계 구조', '롱테일 콘텐츠 기획', 'FAQ 세트 작성', '주제별 전문 콘텐츠'].map((tag, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-700 font-medium">
                      <Check size={14} className="text-emerald-600 mr-2 shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. Off-Page SEO */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 font-black text-xs rounded-md">04</span>
                  <Link2 className="text-amber-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Off-Page SEO</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[36px]">
                  외부 고신뢰도 사이트 및 미디어로부터의 인용과 백링크를 구축하여 사이트 전체의 도메인 파워를 높입니다.
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {['고품질 백링크 연결', '외부 미디어 인용', '도메인 신뢰도 지수 상승', '안전한 링크 파이프라인'].map((tag, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-700 font-medium">
                      <Check size={14} className="text-amber-600 mr-2 shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Brand / Local SEO */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between md:col-span-2 lg:col-span-1">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 font-black text-xs rounded-md">05</span>
                  <Building2 className="text-purple-600 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Brand / Local SEO</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4 min-h-[36px]">
                  브랜드명과 대표 사업자 정보를 검색엔진에 명확히 등록하여 브랜드 키워드 및 지역 검색 상위 노출을 강화합니다.
                </p>

                <div className="space-y-1.5 pt-3 border-t border-slate-100">
                  {['브랜드 프로필 세팅', '기업 정보 개체화', '지역 검색 노출 최적화', '온·오프라인 신뢰도 인증'].map((tag, i) => (
                    <div key={i} className="flex items-center text-xs text-slate-700 font-medium">
                      <Check size={14} className="text-purple-600 mr-2 shrink-0" />
                      <span>{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8 (NEW 3). AEO 실행 서비스 */}
      <section className="py-20 md:py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-full text-xs font-bold">
              <Bot size={14} />
              <span>AEO Core Capabilities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              “AI가 이해하기 쉬운 콘텐츠 구조를 만듭니다”
            </h2>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              AI 답변엔진은 단순히 키워드가 많은 페이지보다 <strong className="text-white">질문에 대한 명확한 답변, 구조화된 정보, 전문성과 신뢰성이 있는 콘텐츠, 관련 주제가 잘 연결된 사이트</strong>를 더 쉽게 이해합니다.
            </p>
          </div>

          {/* 10 Applicable Elements Grid */}
          <div className="mb-16">
            <h3 className="text-lg font-bold text-slate-300 mb-6 text-center">AEO 구축 10대 핵심 적용 요소</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {[
                'FAQ 콘텐츠',
                '질문형 페이지',
                '명확한 서비스 설명',
                'Organization 정보',
                'Author 정보',
                'Schema Markup',
                'Entity 정보',
                '콘텐츠 내부 연결',
                '주제별 Topic Cluster',
                '출처 및 근거 구조'
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 text-center hover:border-purple-500/50 transition-colors">
                  <span className="text-[11px] font-mono text-purple-400 font-bold block mb-1">ELEM {idx + 1}</span>
                  <span className="text-xs font-bold text-white">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Workflow Visual Chart */}
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl">
            <h3 className="text-base sm:text-lg font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
              <Workflow size={20} className="text-purple-400" />
              <span>AI 답변 엔진 수집 및 추천 메커니즘 (AEO Workflow)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative items-center">
              {[
                { step: '01', name: '사용자 질문', desc: 'ChatGPT / Gemini 질의 입력', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                { step: '02', name: '페이지/콘텐츠 분석', desc: '크롤봇의 파싱 & 구조화 파악', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
                { step: '03', name: 'Context / Entity 이해', desc: 'Schema 마크업 기반 개체 인식', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
                { step: '04', name: 'Answer Extraction', desc: '핵심 답변 데이터 추출', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                { step: '05', name: 'AI Search / Answer Engine', desc: '최종 답변 내 출처 & 추천 노출', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
              ].map((wf, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className={`w-full p-4 rounded-xl border ${wf.color} text-center`}>
                    <span className="text-[10px] font-mono font-bold uppercase block opacity-75">{wf.step}</span>
                    <div className="text-sm font-bold text-white my-1">{wf.name}</div>
                    <div className="text-[11px] text-slate-300">{wf.desc}</div>
                  </div>
                  {idx < 4 && (
                    <div className="md:hidden py-2 text-slate-500">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9 (NEW 4). Topic Cluster 콘텐츠 전략 */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Content Architecture</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “한 페이지가 아니라 주제 전체를 구축합니다”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              단일 문서 생성이 아닌, 해당 분야의 권위성(Authority)을 입증하는 토픽 클러스터(Topic Cluster) 구조를 완성합니다.
            </p>
          </div>

          {/* Topic Cluster Interactive Diagram UI */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-10 mb-10 relative overflow-hidden">
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                Topic Cluster Diagram Architecture
              </span>
            </div>

            {/* Central Pillar Page surrounded by Cluster Nodes */}
            <div className="max-w-4xl mx-auto">
              {/* Central Pillar */}
              <div className="bg-blue-600 text-white rounded-2xl p-6 text-center max-w-md mx-auto shadow-xl shadow-blue-600/20 border-2 border-blue-400 mb-8 relative z-10">
                <span className="text-[10px] font-mono font-bold uppercase bg-blue-800 px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  Pillar Page (핵심 서비스)
                </span>
                <h3 className="text-2xl font-black">SEO 컨설팅</h3>
                <p className="text-xs text-blue-100 mt-1">모든 세부 주제가 집약되는 메인 기둥 페이지</p>
              </div>

              {/* Connecting Sub Cluster Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 relative z-10">
                {[
                  'SEO란?',
                  'SEO 비용',
                  'SEO 업체 선택방법',
                  'SEO 사례',
                  'SEO와 광고 차이',
                  '구글 SEO',
                  '네이버 SEO',
                  'AEO란?',
                  'AI 검색 최적화',
                  'SEO FAQ'
                ].map((cluster, i) => (
                  <div key={i} className="bg-white p-3.5 rounded-xl border border-slate-200 text-center shadow-sm hover:border-blue-400 hover:scale-105 transition-all">
                    <div className="text-[10px] text-blue-600 font-bold mb-0.5">Cluster Node</div>
                    <div className="text-xs font-bold text-slate-800">{cluster}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Highlight Quote */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 text-center border border-slate-800 max-w-3xl mx-auto">
            <p className="text-base sm:text-lg font-bold text-slate-200">
              “검색엔진과 AI가 이 사이트가 어떤 분야에 전문성이 있는지 이해할 수 있도록 콘텐츠를 유기적으로 연결합니다.”
            </p>
          </div>
        </div>
      </section>

      {/* 10 (NEW 5). 온오프마케팅의 차별점 */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Why OnOff Marketing</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “진단 보고서만 전달하고 끝내지 않습니다”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              타 컨설팅 업체와 달리 진단 후 개발, 포스팅, 백링크, AI 자원까지 한꺼번에 실행하여 실제 유입으로 연결합니다.
            </p>
          </div>

          {/* Hub Diagram Design */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 md:p-12 shadow-sm mb-10">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-slate-400">All-In-One Execution Hub</span>
            </div>

            <div className="max-w-4xl mx-auto">
              {/* Center Hub */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 text-center max-w-xs mx-auto shadow-xl mb-10 border border-blue-400">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  Core Engine
                </span>
                <h3 className="text-2xl font-black">SEO + AEO</h3>
                <p className="text-xs text-blue-100">통합 최적화 컨트롤 타워</p>
              </div>

              {/* Connected Services Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { name: '홈페이지 제작', desc: '고전환 UI/UX 연동' },
                  { name: '블로그포스팅', desc: 'SEO 가이드라인 발행' },
                  { name: '카페포스팅', desc: '커뮤니티 침투 바이럴' },
                  { name: '백링크', desc: '고신뢰 도메인 연결' },
                  { name: '트래픽', desc: '유기적 유입 활성화' },
                  { name: 'AI 콘텐츠', desc: '구조화 답변 데이터' },
                  { name: '마케팅자동화', desc: 'CPA/DB 수집 연동' },
                  { name: '콘텐츠 제작', desc: 'E-E-A-T 검증글' },
                ].map((s, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center hover:bg-blue-50/50 hover:border-blue-300 transition-all">
                    <div className="text-xs font-bold text-slate-900 mb-1">{s.name}</div>
                    <div className="text-[11px] text-slate-500">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Differentiator Message Banner */}
          <div className="bg-blue-600 text-white rounded-2xl p-6 sm:p-8 text-center max-w-3xl mx-auto shadow-lg shadow-blue-600/20">
            <h3 className="text-xl sm:text-2xl font-black">
              “문제를 찾고, 직접 수정하고, 콘텐츠를 만들고, 실제 유입까지 연결합니다.”
            </h3>
          </div>
        </div>
      </section>

      {/* 11 (NEW 6). 홈페이지 제작 서비스와 연결 */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold inline-block">
                Web Development + SEO/AEO
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                “처음부터 검색을 고려한<br className="hidden sm:block" /> 홈페이지를 구축하세요”
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                일반 홈페이지는 디자인과 기능을 먼저 만든 후 SEO를 나중에 추가하는 경우가 많습니다.<br />
                온오프마케팅은 <strong className="text-white">사이트 구조 + 키워드 + 콘텐츠 + SEO + AEO</strong>를 처음부터 함께 설계하여 최상의 노출 효율을 발휘합니다.
              </p>
            </div>

            <div className="shrink-0 w-full sm:w-auto">
              <Link
                to="/request"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
              >
                <span>SEO/AEO 홈페이지 제작 보기</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 12 (RECOMMENDED FEATURE 1). 실시간 SEO/AEO 점수 셀프 진단 위젯 */}
      <section className="py-20 md:py-24 bg-slate-900 text-white border-b border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold inline-block">
              Self Diagnostic Widget
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              “우리 사이트 SEO/AEO 준비도 1분 점검”
            </h2>
            <p className="text-slate-300 text-sm md:text-base">
              아래 5가지 항목을 직접 체크해보세요. 웹사이트의 현재 검색엔진 및 AI 답변 노출 준비 상태를 즉시 계산해 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-slate-800/90 rounded-3xl p-6 sm:p-10 border border-slate-700/80 shadow-2xl">
            {/* Checklist items (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-base font-bold text-slate-200 mb-2 flex items-center gap-2">
                <CheckCircle2 className="text-blue-400" size={20} />
                <span>체크리스트 선택 (해당하는 항목을 체크하세요)</span>
              </h3>

              {calcQuestions.map((q, idx) => (
                <div
                  key={idx}
                  onClick={() => toggleCalcCheck(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3.5 ${
                    calcChecklist[idx]
                      ? 'bg-blue-950/70 border-blue-500 text-white shadow-md'
                      : 'bg-slate-900/60 border-slate-700/80 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-colors font-bold text-xs ${
                      calcChecklist[idx] ? 'bg-blue-600 text-white' : 'border border-slate-600 bg-slate-800 text-transparent'
                    }`}
                  >
                    ✓
                  </div>
                  <div>
                    <div className={`text-sm font-bold ${calcChecklist[idx] ? 'text-white' : 'text-slate-300'}`}>
                      {q.title}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 leading-relaxed">{q.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Score Result Gauge Card (5 cols) */}
            <div className="lg:col-span-5 bg-slate-900 rounded-2xl p-6 sm:p-8 border border-slate-700 text-center flex flex-col justify-between h-full space-y-6">
              <div>
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Estimated SEO/AEO Score
                </div>

                {/* Circular / Progress Badge */}
                <div className="relative w-36 h-36 mx-auto flex flex-col items-center justify-center rounded-full bg-slate-800 border-4 border-slate-700 shadow-inner mb-4">
                  <span
                    className={`text-5xl font-black transition-all ${
                      calcScore <= 40 ? 'text-red-400' : calcScore <= 80 ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {calcScore}
                  </span>
                  <span className="text-xs text-slate-400 font-bold mt-1">/ 100점</span>
                </div>

                {/* Status Message */}
                <div className="space-y-2">
                  <div className="text-sm font-bold">
                    {calcScore <= 40 && <span className="text-red-400">⚠️ 수집·노출 제한 위험 상태</span>}
                    {calcScore > 40 && calcScore <= 80 && <span className="text-amber-400">⚡ 보완 필요 (기본 구조 미흡)</span>}
                    {calcScore === 100 && <span className="text-emerald-400">🎉 검색엔진 및 AI 친화적 우수 상태</span>}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed px-2">
                    {calcScore <= 40 && '검색 크롤러 수집 오류 및 AI 답변 생략 가능성이 매우 높습니다. 구조 교정이 시급합니다.'}
                    {calcScore > 40 && calcScore <= 80 && '일부 태그는 갖추어졌으나 AEO 구조화 마크업 및 키워드 아키텍처 보완이 필요합니다.'}
                    {calcScore === 100 && '기본 구조가 훌륭합니다! 지속적인 토픽 클러스터 콘텐츠 수립으로 유입을 극대화하세요.'}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => document.getElementById('diagnosis-form')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
              >
                <Sparkles size={16} />
                <span>정밀 종합 진단 리포트 신청</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 13 (PHASE 3-1). SEO/AEO 적용 사례 */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Case Studies</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “실제 SEO/AEO 적용 사례”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              다양한 업종에서 검증된 사이트 구조 개선 사례를 확인하세요. (신규 프로젝트 맞춤 진단 가능)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: 'CASE 01',
                category: 'B2B IT / 테크',
                problem: '검색엔진에 메인페이지 외 세부 서비스 수집 안됨, AI 검색 시 회사 정보 미인식',
                solution: 'Technical SEO 교정, Schema Markup (Organization/Service) 구축, FAQ 데이터 세트 등록',
                result: '전체 색인 정상화 및 AI 챗봇 답변 내 브랜드 개체 식별',
                tag: 'B2B SaaS'
              },
              {
                id: 'CASE 02',
                category: '전문직 (법률 / 변호사)',
                problem: '키워드 광고 비용 부담 급증, 오가닉 검색 유입 및 세부 키워드 노출 부족',
                solution: '3단 키워드 아키텍처 설계, Topic Cluster 기반 분야별 법률 콘텐츠 연결',
                result: '세부 검색 유입 증대 및 자발적 상담 문의 전환 경로 형성',
                tag: '법률 서비스'
              },
              {
                id: 'CASE 03',
                category: '의료 / 피부·성형',
                problem: '네이버/구글 검색 시 브랜드명 외 세부 시술 키워드 검색 노출 미흡',
                solution: 'On-Page SEO 최적화, H1/H2 헤더 구조 정립, 사용자 FAQ 텍스트 데이터화',
                result: '시술 연관 키워드 기회 확장 및 사이트 평균 체류시간 증가',
                tag: '의료 에이전시'
              },
              {
                id: 'CASE 04',
                category: '제조 / B2B 수출',
                problem: '국문/영문 웹사이트 검색엔진 색인 오류, 해외 구글 크롤링 수집 실패',
                solution: 'Hreflang / Sitemap / Canonical 태그 정비, 메타설명 CTR 개선',
                result: '해외 구글 크롤링 정상화 및 카탈로그 상세페이지 수집 활성화',
                tag: '글로벌 B2B'
              },
              {
                id: 'CASE 05',
                category: '쇼핑몰 / e-Commerce',
                problem: '카테고리/상품 페이지 중복 URL 발생, 백링크 부족으로 도메인 파워 저하',
                solution: '중복 URL 대표 주소(Canonical) 지정, 고신뢰 외부 백링크 파이프라인 구축',
                result: '카테고리 관련성 지수 상승 및 오가닉 검색 유입선 다양화',
                tag: '커머스'
              },
              {
                id: 'CASE 06',
                category: '교육 / 프랜차이즈',
                problem: '수강생 유입이 온라인 광고에만 의존, 브랜드 키워드 이외 검색 노출 제로',
                solution: '무료 교육 및 칼럼 기반 Content SEO, 지식패널 브랜드 정보 연동',
                result: '브랜드 공신력 증대 및 검색 유입을 통한 자발적 가맹/수강 문의 증가',
                tag: '교육 사업'
              }
            ].map((item, index) => (
              <div key={index} className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-300 hover:shadow-lg transition-all flex flex-col justify-between">
                <div>
                  {/* Thumbnail Placeholder Header */}
                  <div className="bg-slate-900 text-white p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800/50">
                        {item.id}
                      </span>
                      <span className="text-[11px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {item.tag}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                      <Building2 size={18} className="text-blue-400" />
                      <span>{item.category}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">맞춤형 SEO/AEO 컨설팅 적용 사례</div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <div className="text-xs font-bold text-red-600 mb-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        <span>기존 문제점 (Before)</span>
                      </div>
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {item.problem}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-blue-600 mb-1 flex items-center gap-1">
                        <Code2 size={14} />
                        <span>적용 내용 (Optimization)</span>
                      </div>
                      <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                        {item.solution}
                      </p>
                    </div>

                    <div>
                      <div className="text-xs font-bold text-emerald-600 mb-1 flex items-center gap-1">
                        <CheckCircle2 size={14} />
                        <span>개선 결과 (After)</span>
                      </div>
                      <p className="text-xs text-slate-800 font-semibold bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 leading-relaxed">
                        {item.result}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => document.getElementById('diagnosis-form')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full py-2.5 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-600 border border-slate-200 hover:border-blue-200 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>동일 업종 무료 진단 신청</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-100 rounded-2xl p-4 text-center border border-slate-200 text-xs text-slate-500">
            * 위 사례는 온오프마케팅의 실제 최적화 가이드라인 프로세스이며, 귀사의 웹사이트 구조에 맞춘 1:1 맞춤 진단을 무료로 제공해 드립니다.
          </div>
        </div>
      </section>

      {/* 14 (PHASE 3-2). Before / After UI */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Structural Transformation</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “사이트 개선 전후 비교 (Before & After)”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              과장된 순위 보장이 아닌, 검색엔진과 AI가 웹사이트를 올바르게 인지할 수 있는 웹 표준 구조의 변화를 보여드립니다.
            </p>
          </div>

          {/* Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* BEFORE Card */}
            <div className="bg-white border-2 border-slate-200 rounded-3xl p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-slate-100 text-slate-500 font-mono font-bold text-xs px-4 py-1.5 rounded-bl-2xl uppercase">
                Current / Unoptimized
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <XCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">BEFORE (최적화 전)</h3>
                  <p className="text-xs text-slate-500">검색 수집 제한 및 AI 답변 인지 불가능 구조</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: '검색 색인 문제', desc: 'Sitemap 미제출 및 크롤링 오류로 세부 페이지 수집 누락' },
                  { title: '키워드 구조 부족', desc: '단편적 페이지 구성으로 검색 의도 키워드 매칭 실패' },
                  { title: '콘텐츠 연결 부족', desc: '페이지 간 내부링크가 없어 체류시간이 짧고 이탈률 높음' },
                  { title: 'FAQ / Schema 없음', desc: '구조화 데이터 부재로 AI 챗봇 및 검색 스니펫 추출 불가' },
                  { title: '사이트 구조 불명확', desc: 'H1/H2 태그 혼용 및 복잡한 URL 레벨로 신뢰도 저하' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-red-50/50 p-3.5 rounded-xl border border-red-100">
                    <span className="text-red-500 font-bold shrink-0 mt-0.5">✕</span>
                    <div>
                      <div className="text-xs font-bold text-red-950 mb-0.5">{item.title}</div>
                      <div className="text-[11px] text-red-700">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AFTER Card */}
            <div className="bg-slate-900 text-white border-2 border-blue-500/80 rounded-3xl p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-600 text-white font-mono font-bold text-xs px-4 py-1.5 rounded-bl-2xl uppercase shadow-md">
                ONOFF Optimized
              </div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold border border-blue-500/30">
                  <CheckCircle size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">AFTER (최적화 후)</h3>
                  <p className="text-xs text-slate-400">검색엔진 & AI 친화적 고전환 사이트 구조</p>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { title: '검색엔진 친화 구조', desc: 'Canonical, Sitemap, Robot.txt 정비로 수집 및 색인율 극대화' },
                  { title: '키워드별 페이지 정리', desc: '대표-세부-롱테일 3단계 키워드 아키텍처 완벽 배치' },
                  { title: 'Topic Cluster 구축', desc: 'Pillar 페이지와 Cluster 콘텐츠 간 유기적 링킹' },
                  { title: 'FAQ / Schema 적용', desc: 'JSON-LD 데이터 마크업으로 AI 검색엔진 답변 추천율 상승' },
                  { title: '내부링크 및 전환 경로', desc: '자연스러운 탐색 동선 구축으로 상담 CTA 전환 유도' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3 bg-blue-950/60 p-3.5 rounded-xl border border-blue-500/30">
                    <span className="text-blue-400 font-bold shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="text-xs font-bold text-blue-200 mb-0.5">{item.title}</div>
                      <div className="text-[11px] text-slate-300">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 15 (RECOMMENDED FEATURE 2). AI 검색엔진(ChatGPT/Gemini/Perplexity) 인용 시뮬레이터 */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">AI Engine Simulator</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “AI 챗봇은 당신의 브랜드를 어떻게 추천할까요?”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              AEO(Answer Engine Optimization) 적용 여부에 따른 ChatGPT, Gemini, Perplexity의 답변 차이를 직접 체험해보세요.
            </p>
          </div>

          {/* AI Engine Tabs */}
          <div className="flex justify-center mb-8">
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 flex space-x-1 sm:space-x-2">
              {[
                { id: 'chatgpt', label: 'ChatGPT (OpenAI)', icon: '🤖' },
                { id: 'gemini', label: 'Gemini (Google)', icon: '✨' },
                { id: 'perplexity', label: 'Perplexity AI', icon: '🔍' }
              ].map((engine) => (
                <button
                  key={engine.id}
                  onClick={() => setActiveAiEngine(engine.id as 'chatgpt' | 'gemini' | 'perplexity')}
                  className={`px-4 sm:px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center space-x-2 ${
                    activeAiEngine === engine.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  <span>{engine.icon}</span>
                  <span>{engine.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Mock Interface */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center space-x-2 font-mono">
                <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
                <span className="ml-2 text-slate-300 font-bold">
                  {activeAiEngine === 'chatgpt' && 'ChatGPT-4o Answer Simulator'}
                  {activeAiEngine === 'gemini' && 'Google Gemini 1.5 Pro Simulator'}
                  {activeAiEngine === 'perplexity' && 'Perplexity Pro Search Simulator'}
                </span>
              </div>
              <span className="bg-blue-950 text-blue-400 font-mono px-2.5 py-1 rounded border border-blue-800/60 text-[11px]">
                AEO JSON-LD Schema Mode
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-6">
              {/* User Prompt */}
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  User
                </div>
                <div className="bg-slate-800 text-slate-200 p-4 rounded-2xl rounded-tl-none text-sm font-medium border border-slate-700 max-w-2xl leading-relaxed">
                  "○○ 분야에서 신뢰할 수 있는 전문 업체와 주요 서비스 추천해줘. 가격이나 FAQ 정보도 알 수 있어?"
                </div>
              </div>

              {/* AI Response Comparison Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* Before AEO */}
                <div className="bg-slate-950/80 p-5 rounded-2xl border border-red-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-red-400 border-b border-red-500/20 pb-2">
                    <span className="flex items-center gap-1.5">
                      <XCircle size={14} />
                      AEO 최적화 미적용 사이트
                    </span>
                    <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded">추천 누락</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    "해당 분야의 업체를 검색해보았으나, 웹상에 명확히 검증된 공식 구조화 데이터(Schema)나 식별 가능한 FAQ 정보가 부족합니다.
                    특정 브랜드를 명확히 추천하기 어려우며 일반적인 선택 기준만 안내해 드립니다..."
                  </p>
                </div>

                {/* After AEO */}
                <div className="bg-blue-950/60 p-5 rounded-2xl border border-blue-500/50 space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-300 border-b border-blue-500/30 pb-2">
                    <span className="flex items-center gap-1.5">
                      <CheckCircle size={14} className="text-blue-400" />
                      온오프 AEO 최적화 완결 사이트
                    </span>
                    <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-mono">Top Cited Answer</span>
                  </div>
                  <div className="text-xs text-slate-200 leading-relaxed space-y-2">
                    <p className="font-semibold text-blue-200">
                      "추천 업체: <strong className="text-white bg-blue-900/80 px-1.5 py-0.5 rounded border border-blue-700">[온오프 고객사 A]</strong>"
                    </p>
                    <p className="text-slate-300 text-[11px]">
                      공식 검증 데이터(Organization Schema)에 따르면 해당 회사는 10년 경력의 전문 인력과 투명한 공정 시스템을 제공합니다.
                    </p>
                    <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-700/80 text-[10px] text-slate-300 space-y-1">
                      <div className="font-bold text-blue-400 flex items-center gap-1">
                        <Sparkles size={12} />
                        <span>AI가 인용한 검증 FAQ:</span>
                      </div>
                      <div>• Q: 서비스 진행 절차는 어떻게 되나요?</div>
                      <div>• A: 1:1 맞춤 진단 후 4주 이내에 키워드 및 사이트 최적화 완결</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 16 (RECOMMENDED FEATURE 3). SEO/AEO 4주 실행 프로세스 & Deliverables 타임라인 */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Execution & Deliverables</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “4주 만에 완성되는 체계적 컨설팅 프로세스”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              진단부터 키워드 아키텍처 설계, Schema 마크업 적용, 토픽 클러스터 구축까지 명확한 주차별 산출물을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                week: 'WEEK 01',
                title: '기술적 진단 & 기술 SEO 교정',
                desc: '사이트 구조 분석, sitemap/robots.txt 수집 오류 교정, Canonical 태그 표준화 및 속도 개선',
                deliverable: 'Technical SEO 종합 진단 리포트 (PDF)',
                icon: FileCode
              },
              {
                week: 'WEEK 02',
                title: '키워드 아키텍처 & On-Page',
                desc: '구매 전환 대표·세부·롱테일 키워드 3단계 설계, Title, H1/H2 태그 및 메타 설명 수립',
                deliverable: '키워드 아키텍처 맵 (Excel) & Meta 세팅서',
                icon: SearchCheck
              },
              {
                week: 'WEEK 03',
                title: 'Schema 마크업 & AEO 구축',
                desc: 'JSON-LD 형식 구조화 데이터 적용(Organization, Service), FAQ 질문-답변 데이터 세트 등록',
                deliverable: 'Schema.org JSON-LD 마크업 파일 & FAQ 세트',
                icon: Bot
              },
              {
                week: 'WEEK 04',
                title: '토픽 클러스터 & 백링크 연결',
                desc: 'Pillar 페이지와 Cluster 콘텐츠 간 내부링크 연동, 고신뢰 도메인 외부 백링크 파이프라인 구축',
                deliverable: '발행 콘텐츠 세트 & 월간 오가닉 성과 보고서',
                icon: BarChart3
              }
            ].map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 rounded-bl-full -mr-6 -mt-6 pointer-events-none"></div>

                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {step.week}
                      </span>
                      <StepIcon size={24} className="text-slate-700" />
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">{step.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">{step.desc}</p>
                  </div>

                  {/* Deliverable Badge */}
                  <div className="pt-4 border-t border-slate-100">
                    <div className="text-[11px] font-bold text-blue-900 mb-1 flex items-center gap-1">
                      <FileText size={13} className="text-blue-600" />
                      <span>제공 산출물 (Deliverables)</span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                      {step.deliverable}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 15 (PHASE 3-3). 무료 SEO/AEO 진단 CTA (Diagnostic Form) */}
      <section id="diagnosis-form" className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-slate-700/60">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <span className="px-3 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold inline-block">
                Free Diagnostic Request
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                “우리 사이트의 검색 상태가 궁금하세요?”
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                현재 사이트의 SEO/AEO 구조를 확인하고 우선 개선이 필요한 부분부터 맞춤 상담해드립니다.
              </p>
            </div>

            {isSubmitted ? (
              <div className="bg-blue-950/80 border border-blue-500/50 rounded-2xl p-8 text-center space-y-4 max-w-lg mx-auto my-6">
                <div className="w-16 h-16 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mx-auto border border-blue-400">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-2xl font-extrabold text-white">진단 신청이 완료되었습니다!</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  신청해주신 웹사이트 주소와 연락처를 바탕으로 담당 마케터가 SEO/AEO 분석 후 빠른 시일 내에 안내해 드리겠습니다.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-all"
                >
                  새로운 진단 신청하기
                </button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="space-y-6 max-w-2xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 이름 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      이름 <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        placeholder="홍길동"
                        required
                        className="w-full bg-slate-800/90 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* 연락처 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      연락처 <span className="text-blue-400">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleFormChange}
                        placeholder="010-1234-5678"
                        required
                        className="w-full bg-slate-800/90 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* 웹사이트 주소 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      웹사이트 주소 (URL)
                    </label>
                    <div className="relative">
                      <Globe2 size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleFormChange}
                        placeholder="https://example.com"
                        className="w-full bg-slate-800/90 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                      />
                    </div>
                  </div>

                  {/* 관심 키워드 */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-2">
                      관심 키워드
                    </label>
                    <div className="relative">
                      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        name="keyword"
                        value={formData.keyword}
                        onChange={handleFormChange}
                        placeholder="예: 홈페이지 제작, 변호사 상담"
                        className="w-full bg-slate-800/90 text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* 현재 고민 */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    현재 고민
                  </label>
                  <select
                    name="concern"
                    value={formData.concern}
                    onChange={handleFormChange}
                    className="w-full bg-slate-800/90 text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                  >
                    <option value="">선택해주세요</option>
                    <option value="검색노출">구글/네이버에 사이트 검색이 안 됩니다</option>
                    <option value="광고비부담">키워드 광고 비용이 부담스럽습니다</option>
                    <option value="AI검색">ChatGPT/AI 검색 노출에 대비하고 싶습니다</option>
                    <option value="신규제작">홈페이지 제작과 함께 SEO를 진행하고 싶습니다</option>
                    <option value="기타">기타 마케팅 상담</option>
                  </select>
                </div>

                {/* 문의내용 */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-2">
                    문의내용
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleFormChange}
                    placeholder="사이트 진단 시 참고할 추가 요청사항을 자유롭게 작성해 주세요."
                    className="w-full bg-slate-800/90 text-white p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 text-sm font-medium transition-colors"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-extrabold text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
                >
                  <Send size={18} />
                  <span>[ 무료 SEO/AEO 진단 신청 ]</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 16 (PHASE 3-4). 이런 분에게 추천 */}
      <section className="py-20 md:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Target Audience</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              “이런 사업자에게 추천합니다”
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              지속 가능한 오가닉 검색 유입 및 AI 검색 추천을 고민하는 모든 기업에 최적의 솔루션을 제공합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: '홈페이지는 있지만 검색유입이 없는 업체',
                desc: '사이트를 개설했으나 구글·네이버에 브랜드명 외 세부 키워드 검색 노출이 안 되는 기업'
              },
              {
                title: '구글·네이버 검색 노출을 늘리고 싶은 업체',
                desc: '대표 키워드 및 타겟 고객이 검색하는 롱테일 키워드 상위 점유를 목표로 하는 사업자'
              },
              {
                title: '온라인 광고 의존도를 낮추고 싶은 사업자',
                desc: '매달 지출되는 CPC 키워드 광고비 부담을 줄이고 오가닉 자연 유입 비중을 높이고 싶은 기업'
              },
              {
                title: '콘텐츠를 꾸준히 운영하고 싶은 업체',
                desc: '블로그, 칼럼, FAQ 등 전문 콘텐츠를 체계적인 토픽 클러스터 구조로 자산화하고 싶은 브랜드'
              },
              {
                title: 'AI 검색 시대를 준비하고 싶은 기업',
                desc: 'ChatGPT, Gemini, Perplexity 등 챗봇 답변에서 추천 브랜드로 인지되고 싶은 혁신 기업'
              },
              {
                title: '홈페이지 제작과 SEO를 함께 진행하려는 업체',
                desc: '초기 제작 단계부터 검색엔진 및 AI 최적화 아키텍처를 적용하여 재작업 비용을 아끼려는 사업자'
              }
            ].map((card, idx) => (
              <div key={idx} className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-sm mb-4">
                    0{idx + 1}
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 leading-snug">{card.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 17 (PHASE 3-5). FAQ */}
      <section className="py-20 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-blue-600 font-bold text-sm tracking-widest uppercase">Frequently Asked Questions</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              SEO와 AEO 컨설팅에 관해 자주 물어보시는 내용을 명확하게 답변해 드립니다.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'SEO와 AEO의 차이는 무엇인가요?',
                a: 'SEO(검색엔진 최적화)는 구글, 네이버 등 검색엔진에서 키워드 검색 시 사이트가 상위에 노출되도록 하는 작업입니다. AEO(답변엔진 최적화)는 ChatGPT, Gemini 같은 AI 챗봇이 질문에 답할 때 우리 회사의 정보를 정확히 인용하고 추천하도록 구조화 데이터(Schema)와 질문-답변형 콘텐츠를 최적화하는 작업입니다.'
              },
              {
                q: 'SEO를 하면 바로 상위노출되나요?',
                a: '아니오, SEO는 유료 키워드 광고처럼 결제 즉시 상위에 노출되는 방식이 아닙니다. 검색엔진의 크롤링, 색인, 평가 과정을 거쳐 보통 1~3개월 후부터 점진적인 검색 반영 효과가 나타납니다. 과장된 보장 대신 정직한 기술 개선과 콘텐츠 구조화로 지속 가능한 오가닉 유입을 만듭니다.'
              },
              {
                q: '기존 홈페이지도 SEO 작업이 가능한가요?',
                a: '네, 가능합니다. 워드프레스, 아임웹, 식스샵, 그누보드, 자체 개발 사이트 등 대부분의 웹사이트에 대해 진단 및 기술/콘텐츠 SEO 작업이 가능합니다. 관리자 권한 및 소스 수정이 일부 제한된 경우 가능한 영역 위주로 최적화해 드립니다.'
              },
              {
                q: '네이버와 구글을 함께 작업하나요?',
                a: '네, 온오프마케팅은 구글의 웹마스터 가이드라인과 네이버 서치어드바이저 수집 기준을 모두 준수하여 통합 최적화를 진행합니다. 두 검색엔진이 공통으로 요구하는 웹 표준, 로딩 속도, 메타 태그, 콘텐츠 위계 구조를 구축합니다.'
              },
              {
                q: 'AI 검색 최적화는 어떻게 진행하나요?',
                a: 'AI 검색 로봇이 웹사이트를 정확히 식별하도록 JSON-LD 형식의 Schema.org 마크업(Organization, Service, FAQ 등)을 적용하고, 질문과 답변이 명확히 연결된 FAQ 세트 및 토픽 클러스터 콘텐츠를 구축하여 AI 답변 추천율을 높입니다.'
              },
              {
                q: '콘텐츠는 얼마나 필요한가요?',
                a: '업종과 경쟁도에 따라 차이가 있지만, 주요 서비스별 필러(Pillar) 페이지 1~2개와 이를 뒷받침하는 롱테일 클러스터 콘텐츠 5~10개 이상이 기본 구성으로 추천됩니다. 온오프마케팅에서 콘텐츠 기획 및 가이드라인을 함께 제공합니다.'
              },
              {
                q: '백링크가 꼭 필요한가요?',
                a: '백링크는 검색엔진(특히 구글)이 사이트의 신뢰도와 권위성(Authority)을 평가하는 핵심 지표 중 하나입니다. 무분별한 스팸성 백링크는 오히려 페널티 원인이 되므로, 고신뢰 도메인 중심의 안전한 오가닉 백링크 파이프라인을 구축해 드립니다.'
              },
              {
                q: 'SEO 작업 기간은 얼마나 걸리나요?',
                a: '사이트 진단 및 초기 기술 교정은 보통 1~2주 소요되며, 키워드 아키텍처 수립 및 토픽 클러스터 콘텐츠 구축/반영은 4주 내외가 소요됩니다. 이후 검색엔진 색인 안정화 및 오가닉 유입 모니터링이 연속적으로 진행됩니다.'
              },
              {
                q: '홈페이지 제작과 같이 진행할 수 있나요?',
                a: '네, 가장 효과적이고 추천해 드리는 방식입니다. 홈페이지 제작 단계부터 SEO/AEO 아키텍처를 적용하면 추후 재작업 비용 없이 완벽한 검색엔진 친화 웹사이트를 즉시 확보할 수 있습니다.'
              },
              {
                q: 'SEO 진단만 받을 수도 있나요?',
                a: '네, 가능합니다. 무료 SEO/AEO 기본 진단 신청을 통해 현재 사이트의 기술적 오류, 색인 문제, 키워드 구조를 먼저 점검받아보실 수 있으며, 진단 리포트를 바탕으로 후속 작업을 자유롭게 결정하실 수 있습니다.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden transition-all">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left p-5 sm:p-6 bg-slate-50 hover:bg-slate-100/80 flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base transition-colors"
                >
                  <div className="flex items-center space-x-3 pr-4">
                    <span className="text-blue-600 font-mono font-bold text-sm shrink-0">Q{idx + 1}.</span>
                    <span>{faq.q}</span>
                  </div>
                  {openFaqIndex === idx ? <ChevronUp size={20} className="text-blue-600 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
                </button>
                {openFaqIndex === idx && (
                  <div className="p-5 sm:p-6 bg-white border-t border-slate-200 text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 18 (PHASE 3-6). 최종 CTA */}
      <section className="py-20 md:py-28 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full text-xs font-bold mb-6">
            SEO & AEO Final Call
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
            “검색되는 홈페이지에서<br />선택되는 홈페이지로”
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            SEO와 AEO를 함께 고려하여 검색엔진과 AI 검색 환경에 맞는 사이트 구조를 준비하세요.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <button
              onClick={() => document.getElementById('diagnosis-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-base transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 group"
            >
              <Search size={18} />
              <span>무료 SEO/AEO 상담</span>
            </button>
            <Link
              to="/request"
              className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
            >
              <Building2 size={18} />
              <span>홈페이지 제작 상담</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 19 (PHASE 3-7). 내부링크 (온오프마케팅 연계 서비스) */}
      <section className="py-16 bg-slate-950 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-8 mb-8 gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">온오프마케팅 관련 연계 서비스</h3>
              <p className="text-xs text-slate-400">SEO/AEO 구조 최적화부터 실제 유입 실행까지 원스톱 마케팅 서비스</p>
            </div>
            <Link to="/consult" className="text-xs text-blue-400 font-bold flex items-center gap-1 hover:underline">
              <span>맞춤형 서비스 통합 상담하기</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {[
              { name: '홈페이지 제작', path: '/request', desc: '고전환 UI/UX' },
              { name: '트래픽 서비스', path: '/traffic', desc: '검색 노출 활성화' },
              { name: '블로그포스팅', path: '/blog', desc: '타겟 키워드 대행' },
              { name: '카페포스팅', path: '/cafe', desc: '침투 바이럴' },
              { name: '백링크 구축', path: '/traffic', desc: '도메인 파워 상승' },
              { name: '마케팅자동화', path: '/platform', desc: 'iCRM DB수집' },
              { name: '무료온라인강의', path: '/free-courses', desc: 'SEO 노하우 VOD' },
              { name: '무료 상담', path: '/consult', desc: '1:1 맞춤 문의' },
            ].map((link, i) => (
              <Link
                key={i}
                to={link.path}
                className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-xl hover:border-blue-500 hover:bg-slate-800 transition-all text-center block"
              >
                <div className="text-xs font-bold text-white mb-0.5">{link.name}</div>
                <div className="text-[10px] text-slate-400">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

