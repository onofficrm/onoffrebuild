import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  CheckCircle2, 
  MousePointerClick, 
  Database, 
  ShieldCheck, 
  DollarSign, 
  ExternalLink, 
  ArrowRight, 
  BarChart3, 
  Layers, 
  Zap, 
  Check, 
  ShoppingBag, 
  UserPlus, 
  FileCheck, 
  CreditCard, 
  Globe, 
  Sparkles, 
  Share2, 
  HelpCircle, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Scale, 
  Car, 
  Shield, 
  Home, 
  Building2, 
  GraduationCap, 
  Smartphone, 
  Truck, 
  HeartPulse, 
  Cpu, 
  Link2, 
  Server, 
  PhoneCall, 
  Activity, 
  FileText,
  Send,
  Search,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import EnhancedConsultationSection from '../components/EnhancedConsultationSection';
import CpaRoiCalculator from '../components/CpaRoiCalculator';
import CpaVsCpcComparison from '../components/CpaVsCpcComparison';
import LiveFraudFilterDemo from '../components/LiveFraudFilterDemo';

export default function OnoffCpa() {
  const [dashboardTab, setDashboardTab] = useState<'partner' | 'advertiser'>('partner');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // 1. Full Operational Workflow Steps Data
  const fullWorkflowSteps = [
    { step: '01', title: '광고상품 등록', actor: '광고주', icon: FileCheck, desc: 'CPA 단가, 승인 조건 및 캠페인 가이드 설정' },
    { step: '02', title: '파트너 모집', actor: '플랫폼', icon: UserPlus, desc: '전문 제휴 파트너 승인 및 캠페인 공개' },
    { step: '03', title: '파트너 홍보', actor: '파트너', icon: Share2, desc: '고유 추적 URL로 블로그, SNS, 커뮤니티 배포' },
    { step: '04', title: '고객 유입', actor: '고객', icon: MousePointerClick, desc: '타겟 트래픽 유입 및 랜딩페이지 방문' },
    { step: '05', title: 'CPA DB / CPS 주문', actor: '시스템', icon: Database, desc: '상담 DB 수집 또는 결제 완료 건 즉시 집계' },
    { step: '06', title: '광고주 확인', actor: '광고주', icon: ShieldCheck, desc: '실시간 DB 수집 알림 및 내용 확인' },
    { step: '07', title: '승인 / 취소', actor: '광고주/시스템', icon: CheckCircle2, desc: '유효 DB 검증 후 승인 또는 불량 사유 입력' },
    { step: '08', title: '파트너 정산', actor: '플랫폼', icon: DollarSign, desc: '정산주기에 따른 수익금 투명 지급' },
  ];

  // 2. Use Cases / Portfolio Data (With Real Visual Images)
  const useCaseCards = [
    {
      category: 'CPA 플랫폼 구축',
      title: '[사례 예시] 기업 전용 독립 CPA/CPS 제휴 플랫폼 구축',
      desc: '독립 브랜드 도메인에 광고주센터, 파트너센터, 어드민 제어 시스템을 풀패키지로 구축한 대형 마케팅 플랫폼 사례입니다.',
      tag: '플랫폼 구축',
      badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: '광고주센터 구축',
      title: '[사례 예시] B2B 광고주 실시간 캠페인 & 예산 관리 시스템',
      desc: '캠페인 단가 설정, 선불 충전금 차감, 실시간 승인/취소 통제 및 중복 DB 자동 필터링 대시보드 구축 사례입니다.',
      tag: '광고주 대시보드',
      badgeColor: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: '파트너센터 구축',
      title: '[사례 예시] 1,000+ 제휴 파트너 트래킹 & 수익 정산 시스템',
      desc: '파라미터 포함 고유 홍보링크 원클릭 발급, 실시간 클릭/전환 집계, 정기 출금 신청 및 명세서 자동 생성 사례입니다.',
      tag: '파트너 트래킹',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
      imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: '상담DB 관리',
      title: '[사례 예시] 실시간 DB 연동 & 카카오 알림톡 자동화',
      desc: '상담 DB 접수 즉시 광고주 단톡방 및 담당자 알림톡 전송, 어뷰징 IP/중복 번호 실시간 자동차단 시스템 사례입니다.',
      tag: 'DB 자동화',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: 'CPA 랜딩페이지',
      title: '[사례 예시] DB 전환율 35% 달성 고관여 타겟 전용 랜딩',
      desc: 'PC 및 모바일 환경에 최적화된 고전환 DB 수집 폼 및 간편 설문형 유입 구조로 이탈률을 극대화 감소시킨 사례입니다.',
      tag: '고전환 랜딩',
      badgeColor: 'bg-purple-100 text-purple-900 border-purple-200',
      imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80'
    },
    {
      category: '마케팅 자동화',
      title: '[사례 예시] 유입-성과-승인-정산 전과정 마케팅 오토메이션',
      desc: '수기 DB 검증과 정산 업무를 iCRM 및 모듈형 백엔드로 자동화하여 운영 리소스를 80% 이상 절감한 사례입니다.',
      tag: '프로세스 자동화',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-200',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    }
  ];

  // 3. Target Audience Data (With Target Visual Thumbnails)
  const targetAudienceList = [
    {
      title: '성과형 광고를 시작하고 싶은 광고주',
      badge: '광고주 추천',
      desc: '단순 클릭이나 노출에 비용을 허비하지 않고, 검증된 실제 상담 DB나 구매 전환이 발생했을 때만 투명하게 광고비를 지출하고 싶은 기업',
      actionText: '광고주로 시작하기',
      actionUrl: 'https://onoffcpa.icrm.co.kr/',
      isExternal: true,
      color: 'border-blue-200 hover:border-blue-500 bg-white',
      imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: '온라인 채널을 수익화하고 싶은 파트너',
      badge: '파트너 추천',
      desc: '보유한 블로그, 카페, SNS, 커뮤니티, 웹사이트의 트래픽을 고단가 CPA/CPS 성과 수익으로 확실하게 창출하고 싶은 마케터 및 창작자',
      actionText: '파트너 수익 시작하기',
      actionUrl: 'https://onoffcpa.icrm.co.kr/',
      isExternal: true,
      color: 'border-amber-200 hover:border-amber-500 bg-white',
      imageUrl: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'CPA 플랫폼을 직접 운영하고 싶은 기업',
      badge: '독자 구축 추천',
      desc: '외부 플랫폼 이용에 국한되지 않고, 자체 브랜드와 자사 도메인으로 파트너와 광고주를 수용할 제휴 마케팅 SaaS 시스템을 구축하려는 기업',
      actionText: '자체 플랫폼 구축 상담',
      actionUrl: '/consult',
      isExternal: false,
      color: 'border-indigo-200 hover:border-indigo-500 bg-white',
      imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: '기존 광고 시스템을 자동화하고 싶은 업체',
      badge: '시스템 자동화',
      desc: '수기 DB 관리, 중복 번호 검증, 파트너 정산 요청 등 번거롭고 반복되는 관리를 자동으로 처리하여 인건비와 시간을 대폭 줄이고 싶은 대행사',
      actionText: '자동화 시스템 문의',
      actionUrl: '/consult',
      isExternal: false,
      color: 'border-emerald-200 hover:border-emerald-500 bg-white',
      imageUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: '광고주와 파트너를 동시에 관리해야 하는 운영사',
      badge: '통합 제어 추천',
      desc: '다수의 캠페인과 수백 명의 제휴 파트너, 어뷰징 감지, 세금계산서 정산까지 단일 어드민에서 손쉽게 제어하려는 마케팅 에이전시',
      actionText: '통합 어드민 상담',
      actionUrl: '/consult',
      isExternal: false,
      color: 'border-slate-300 hover:border-slate-600 bg-white',
      imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // 4. FAQ List
  const faqList = [
    {
      q: 'CPA가 무엇인가요?',
      a: 'CPA(Cost Per Action)는 단순한 노출이나 클릭이 아니라, 유입된 고객이 상담신청, 회원가입, 견적요청 등 광고주가 지정한 특정 성과 행동을 완료했을 때만 광고비가 발생하는 합리적인 성과형 마케팅 모델입니다.'
    },
    {
      q: 'CPA와 CPS는 무엇이 다른가요?',
      a: 'CPA는 상담DB 접수, 회원가입 등 특정 "행동"을 기준으로 건당 단가가 정산되는 방식이며, CPS(Cost Per Sale)는 파트너 홍보링크를 통해 실제 "상품 결제 및 판매"가 이루어졌을 때 결제 금액의 일정 비율(%) 또는 고정 수수료를 정산받는 방식입니다.'
    },
    {
      q: '광고주는 어떻게 이용하나요?',
      a: '온오프CPA 광고주센터 가입 후 캠페인 상품(CPA/CPS), DB 단가, 유효 승인 조건 및 가이드라인을 등록합니다. 예산 충전 후 승인되면 1,200+ 제휴 파트너들에게 캠페인이 즉시 공개되어 홍보가 시작됩니다.'
    },
    {
      q: '파트너는 어떻게 수익을 얻나요?',
      a: '파트너센터에 등록된 다양한 광고 캠페인 중 내 매체(블로그, 카페, SNS 등)에 어울리는 상품을 선택하여 고유 트래킹 URL을 발급받습니다. 해당 링크로 유입된 타겟이 성과를 달성하면 정해진 단가만큼 수익금이 자동 적립됩니다.'
    },
    {
      q: '어떤 상품을 등록할 수 있나요?',
      a: '병원/시술, 법률/세무, 중고차/장기렌트, 인터넷가입, 이사/청소, 금융/보험 등 상담DB 접수가 필요한 대표 업종부터, 쇼핑몰, VOD 교육 강좌, B2B SaaS 등 실제 결제가 이루어지는 모든 상품을 제한 없이 등록할 수 있습니다.'
    },
    {
      q: '성과는 어떻게 확인하나요?',
      a: '온오프CPA 대시보드에서 실시간 클릭수, 유입 매체, DB 접수 현황, 승인/취소 내역, 정산 예정 금액을 일별·월별·캠페인별 그래프로 24시간 투명하게 확인하실 수 있습니다.'
    },
    {
      q: '승인과 취소는 어떻게 처리되나요?',
      a: '광고주는 수집된 DB의 유효성(전화번호 오류, 중복 접수, 타겟 조건 부합 여부 등)을 검증하여 승인 또는 취소를 등록합니다. 중복 접수 및 어뷰징 IP는 온오프CPA 차단 엔진에서 1차로 자동 걸러집니다.'
    },
    {
      q: '정산은 어떻게 진행되나요?',
      a: '승인 완료된 유효 성과에 대해 미리 설정된 정산주기(주간/월간 등)에 맞춰 파트너가 출금 신청을 하면, 원천징수 세금 처리 후 등록된 지정 계좌로 안전하게 수익금이 지급됩니다.'
    },
    {
      q: '자체 CPA 플랫폼도 제작 가능한가요?',
      a: '네, 온오프마케팅에서는 온오프CPA와 동일한 수준의 독자적인 CPA/CPS 제휴 마케팅 시스템을 독립 도메인과 원하는 브랜드 디자인으로 신속하게 커스텀 제작해 드립니다.'
    },
    {
      q: '기존 프로그램과 API 연동이 가능한가요?',
      a: '네, 완벽히 연동됩니다. 자사 ERP, CRM(iCRM), 카카오 알림톡, 전화 콜트래킹, 외부 랜딩페이지 및 타사 DB와 RESTful API / Webhook 방식으로 양방향 실시간 수신 및 발신이 가능합니다.'
    }
  ];

  // 5. Industry Cases Data
  const industryCases = [
    { name: '개인회생 / 개인파산', icon: Scale, example: '법률 상담 DB 수집 및 자격 진단 신청' },
    { name: '중고차 / 자동차금융', icon: Car, example: '내 차 팔기 시세 조회 및 장기렌트/리스 견적' },
    { name: '보험 서비스', icon: Shield, example: '맞춤형 보험료 비교 견적 및 보장 분석 상담' },
    { name: '렌탈 서비스', icon: Home, example: '가전/정수기/비데 렌탈 신청 및 월 요금 문의' },
    { name: '부동산 / 분양', icon: Building2, example: '분양 현장 방문 예약 및 투자 상담 접수' },
    { name: '교육 / 자격증', icon: GraduationCap, example: '자격증 수강 문의 및 무료 인강 샘플 신청' },
    { name: '통신 / 인터넷가입', icon: Smartphone, example: '인터넷/TV 가입 사은품 비교 및 개통 상담' },
    { name: '포장이사', icon: Truck, example: '포장이사 견적 비교 및 지역 업체 예약' },
    { name: '청소 / 생활케어', icon: HeartPulse, example: '입주청소/가전케어 출장 예약 문의' },
    { name: '병원 / 시술 상담', icon: Activity, example: '성형/치과/피부과 시술 이벤트 예약' },
    { name: '쇼핑몰 / 커머스', icon: ShoppingBag, example: 'CPS 기반 자사몰 상품 판매 수수료 연동' },
    { name: '온라인 SaaS / B2B', icon: Globe, example: 'SaaS 회원가입 및 데모 신청 유입' },
  ];

  // 6. Platform Building Feature Cards Data
  const platformBuildFeatures = [
    { title: '광고주센터', desc: '캠페인 등록, 예산 관리 및 실시간 승인 관리 기능' },
    { title: '파트너센터', desc: '고유 트래킹 링크 발급 및 실시간 수익 리포트' },
    { title: '관리자센터', desc: '전체 유저, 캠페인, 승인/취소, 정산 총괄제어' },
    { title: 'CPA DB 관리', desc: '중복 DB 필터링 및 어뷰징 탐지 보안 시스템' },
    { title: 'CPS 주문관리', desc: '결제/취소 연동 및 판매 수수료 자동 계산' },
    { title: '광고비 관리', desc: '선불 충전, 잔액 차감 및 세금계산서 연동' },
    { title: '파트너 정산', desc: '출금 신청 검토 및 정산 자동 내역서 발행' },
    { title: '홍보링크 발급', desc: '파라미터 포함 단축 URL 및 원클릭 생성' },
    { title: '랜딩페이지 연동', desc: 'DB 접수 폼 및 커스텀 랜딩페이지 연결' },
    { title: '통계 리포트', desc: '일별, 매체별, 캠페인별 정밀 그래프' },
    { title: 'API 확장연동', desc: '외부 CRM, 알림톡, 데이터베이스 양방향 송수신' },
  ];

  return (
    <main className="pt-20 bg-slate-50 min-h-screen text-slate-800 pb-20 lg:pb-0">
      
      {/* ==================================================
          1. HERO SECTION (SEO & Visual Landing)
         ================================================== */}
      <section className="bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white relative overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-amber-400/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Copy & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-blue-900/80 text-yellow-400 text-xs sm:text-sm font-extrabold border border-blue-700/60 shadow-inner">
                <Sparkles size={16} className="mr-2" />
                ON/OFF CPA & CPS AFFILIATE PLATFORM
              </div>

              {/* H1 SEO Tag - Explicit Keyword Hierarchy */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                CPA·CPS 제휴마케팅 플랫폼 | <span className="text-yellow-400">온오프CPA</span>
              </h1>

              <p className="text-lg sm:text-xl font-bold text-blue-100 leading-snug">
                광고주와 파트너를 연결하고 <br className="hidden sm:block" />
                유입부터 성과, 승인, 정산까지 하나의 시스템에서 관리하세요.
              </p>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 text-sm text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0 backdrop-blur-sm">
                <p className="mb-2">
                  <strong className="text-white font-extrabold">광고주</strong>는 상담신청, 회원가입, 구매 등 <span className="text-yellow-400 font-bold">실제 성과가 발생했을 때만</span> 광고비를 지출하여 무분별한 비용 낭비를 막습니다.
                </p>
                <p>
                  <strong className="text-white font-extrabold">파트너</strong>는 홈페이지, 블로그, SNS, 커뮤니티 등 다양한 채널을 활용하여 광고상품을 홍보하고 <span className="text-yellow-400 font-bold">확실한 성과 수익</span>을 창출할 수 있습니다.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="https://onoffcpa.icrm.co.kr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 rounded-xl font-black text-base hover:brightness-105 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center"
                >
                  <span>온오프CPA 바로가기</span>
                  <ExternalLink size={18} className="ml-2" />
                </a>

                <Link
                  to="/consult"
                  className="w-full sm:w-auto px-7 py-4 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl font-extrabold text-base transition-colors flex items-center justify-center"
                >
                  <span>CPA 플랫폼 제작 상담</span>
                  <ArrowRight size={18} className="ml-2 text-slate-400" />
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-400 pt-2 font-medium">
                <span className="flex items-center"><CheckCircle2 size={14} className="text-emerald-400 mr-1.5" /> 100% 성과 기반 차감</span>
                <span className="flex items-center"><CheckCircle2 size={14} className="text-emerald-400 mr-1.5" /> 어뷰징 자동 검증</span>
                <span className="flex items-center"><CheckCircle2 size={14} className="text-emerald-400 mr-1.5" /> 투명한 실시간 대시보드</span>
              </div>
            </div>

            {/* Right SaaS Dashboard Preview UI */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700 rounded-3xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
                <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-xs font-bold text-slate-400 ml-2">onoffcpa.icrm.co.kr</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/30">
                    Dashboard Preview
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3.5 mb-5">
                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80">
                    <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                      <span>오늘 발생 DB</span>
                      <Database size={14} className="text-blue-400" />
                    </div>
                    <div className="text-2xl font-black text-white">125 <span className="text-xs font-normal text-emerald-400">+12%</span></div>
                  </div>

                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80">
                    <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                      <span>승인 대기</span>
                      <Clock size={14} className="text-yellow-400" />
                    </div>
                    <div className="text-2xl font-black text-yellow-400">38건</div>
                  </div>

                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80">
                    <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                      <span>운영 캠페인</span>
                      <Layers size={14} className="text-indigo-400" />
                    </div>
                    <div className="text-2xl font-black text-white">36개</div>
                  </div>

                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80">
                    <div className="text-xs text-slate-400 font-bold mb-1 flex items-center justify-between">
                      <span>이번달 전환</span>
                      <TrendingUp size={14} className="text-emerald-400" />
                    </div>
                    <div className="text-2xl font-black text-emerald-400">4,238</div>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="text-xs font-extrabold text-slate-300 mb-2.5 flex items-center justify-between">
                    <span>실시간 성과 수집 현황</span>
                    <span className="flex items-center text-[10px] text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1"></span> Live Sync
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800">
                      <span className="text-slate-300 font-medium">[병원/시술] 김** 010-***-1234</span>
                      <span className="text-emerald-400 font-extrabold">CPA 접수</span>
                    </div>
                    <div className="p-2.2 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800">
                      <span className="text-slate-300 font-medium">[법률/상담] 이** 010-***-8821</span>
                      <span className="text-emerald-400 font-extrabold">CPA 접수</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded-lg flex items-center justify-between border border-slate-800">
                      <span className="text-slate-300 font-medium">[렌탈/견적] 박** 결제 완료</span>
                      <span className="text-yellow-400 font-extrabold">CPS 전환</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-center text-[11px] text-slate-500 font-medium">
                  * 위 화면은 온오프CPA 관리자 및 파트너 대시보드 예시 화면입니다.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ==================================================
          2. 숫자로 보는 온오프CPA (PERFORMANCE DASHBOARD METRICS)
         ================================================== */}
      <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-slate-800 gap-4">
            <div>
              <span className="text-xs font-black text-amber-400 uppercase tracking-widest bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 mb-2 inline-block">
                Platform Performance Dashboard
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                숫자로 보는 온오프CPA
              </h2>
            </div>
            <div className="text-xs text-slate-400 font-medium bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/80 w-fit">
              <span className="text-emerald-400 font-bold mr-1">● Live Framework</span>
              실제 운영 데이터 연동 영역
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative overflow-hidden group hover:border-yellow-400/60 transition-all">
              <div className="text-xs font-extrabold text-slate-400 mb-2 tracking-wider uppercase">ACTIVE CAMPAIGNS</div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">36<span className="text-yellow-400 text-2xl">+</span></div>
              <p className="text-xs text-slate-400 font-medium">운영 중인 성과형 캠페인</p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center">
                <span>API SYNC READY</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative overflow-hidden group hover:border-yellow-400/60 transition-all">
              <div className="text-xs font-extrabold text-slate-400 mb-2 tracking-wider uppercase">PARTNERS</div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">1,280<span className="text-yellow-400 text-2xl">+</span></div>
              <p className="text-xs text-slate-400 font-medium">등록 제휴 마케터 및 파트너</p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center">
                <span>REALTIME METRIC</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative overflow-hidden group hover:border-yellow-400/60 transition-all">
              <div className="text-xs font-extrabold text-slate-400 mb-2 tracking-wider uppercase">MONTHLY LEADS</div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">48.5K<span className="text-yellow-400 text-2xl">+</span></div>
              <p className="text-xs text-slate-400 font-medium">월간 수집 및 처리 DB 건수</p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center">
                <span>DATA PIPELINE</span>
              </div>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 relative overflow-hidden group hover:border-yellow-400/60 transition-all">
              <div className="text-xs font-extrabold text-slate-400 mb-2 tracking-wider uppercase">SUPPORTED SERVICES</div>
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">12<span className="text-yellow-400 text-2xl">+</span></div>
              <p className="text-xs text-slate-400 font-medium">적용 가능 대표 산업 서비스</p>
              <div className="mt-4 pt-3 border-t border-slate-700/60 text-[10px] font-mono text-emerald-400 flex items-center">
                <span>SCALABLE CORE</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500 font-medium bg-slate-950 p-3 rounded-xl border border-slate-800 max-w-2xl mx-auto">
            * 본 대시보드는 온오프CPA 솔루션의 실제 API 데이터 연동을 고려하여 설계된 대시보드 샘플 UI입니다.
          </div>

        </div>
      </section>


      {/* ==================================================
          3. 온오프CPA란? (CONCEPT & FLOW)
         ================================================== */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100 mb-3 inline-block">
              WHAT IS ONOFF CPA?
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              성과가 발생했을 때 비용을 지불하는 마케팅
            </h2>
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
              일반적인 광고는 단순히 클릭이나 노출만 되어도 예산이 소진될 수 있지만, <br className="hidden sm:block" />
              <strong className="text-blue-900">CPA/CPS</strong>는 상담신청, 회원가입, 견적문의, 실제 구매 등 <br className="hidden sm:block" />
              <strong>광고주가 원하는 실질적인 결과가 발생했을 때만</strong> 비용이 차감되는 가장 합리적인 성과형 구조입니다.
            </p>
          </div>

          {/* Workflow Steps */}
          <div className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
            <h3 className="text-center font-extrabold text-slate-800 text-lg mb-8">
              온오프CPA 원스톱 성과 창출 데이터 프로세스
            </h3>

            {/* Mobile Vertical Timeline & Desktop Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              {fullWorkflowSteps.map((wf, idx) => {
                const IconComp = wf.icon;
                return (
                  <div key={wf.step} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-black text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                          STEP {wf.step}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {wf.actor}
                        </span>
                      </div>

                      <div className="p-2.5 bg-blue-50 text-blue-900 rounded-xl w-fit mb-3">
                        <IconComp size={18} />
                      </div>

                      <h4 className="text-base font-extrabold text-slate-900 mb-1">
                        {wf.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {wf.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center text-xs text-slate-500 font-medium">
              * 광고주와 파트너 간 승인·정산 절차는 온오프CPA 전용 검증 엔진을 통해 자동 투명하게 진행됩니다.
            </div>
          </div>

        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <CpaRoiCalculator />


      {/* ==================================================
          4. [NEW] 실제 활용 사례 (USE CASES - PLACEHOLDER SYSTEM)
         ================================================== */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-100 px-3.5 py-1.5 rounded-full border border-blue-200 mb-3 inline-block">
              PORTFOLIO & USE CASES
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              “실제 운영 경험을 기반으로 만들었습니다”
            </h2>
            <p className="text-slate-600 text-base font-medium leading-relaxed">
              CPA 제휴마케팅 플랫폼 구축부터 파트너 및 광고주 센터, DB 자동화 및 고전환 랜딩페이지까지 <br className="hidden sm:block" />
              향후 실제 구축 결과물로 손쉽게 교체 가능한 표준 모듈형 사례 프레임입니다.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCaseCards.map((card, idx) => (
              <div 
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Visual Image with Overlay */}
                  <div className="h-44 relative overflow-hidden border-b border-slate-200">
                    <img 
                      src={card.imageUrl} 
                      alt={card.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between z-10">
                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border shadow-sm ${card.badgeColor}`}>
                          {card.category}
                        </span>
                        <span className="text-[10px] font-mono text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded border border-white/20">
                          CASE #0{idx + 1}
                        </span>
                      </div>

                      <div className="z-10">
                        <div className="text-xs text-yellow-300 font-bold mb-0.5 flex items-center drop-shadow">
                          <Sparkles size={13} className="mr-1 text-yellow-400" />
                          ON/OFF CPA SYSTEM
                        </div>
                        <div className="text-sm font-black text-white line-clamp-1 drop-shadow-md">
                          {card.tag} 프레임워크
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <h3 className="text-base font-extrabold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium text-[11px]">실제 운영 사례 모듈</span>
                  <Link
                    to="/consult"
                    className="font-extrabold text-blue-900 hover:text-blue-700 flex items-center"
                  >
                    <span>자세히 보기</span>
                    <ArrowRight size={14} className="ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-blue-50 border border-blue-200/80 rounded-2xl p-5 text-center text-xs text-blue-900 font-medium max-w-2xl mx-auto">
            * 현재 실제 고객사의 비공개 데이터 보호를 위해 시스템 템플릿 형태로 제공되며, 관리자 페이지에서 신규 사례로 상시 업데이트하실 수 있습니다.
          </div>

        </div>
      </section>

      {/* Live AI Fraud Detection Demo Simulator */}
      <LiveFraudFilterDemo />


      {/* ==================================================
          5. [NEW] 이용 대상 ("이런 분들에게 추천합니다")
         ================================================== */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-amber-900 uppercase tracking-wider bg-amber-50 px-3.5 py-1.5 rounded-full border border-amber-200 mb-3 inline-block">
              TARGET AUDIENCE
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              “이런 분들에게 추천합니다”
            </h2>
            <p className="text-slate-600 text-base font-medium leading-relaxed">
              광고비 효율이 시급한 광고주부터 트래픽을 수익화하려는 파트너, 독자 CPA 플랫폼을 다루려는 운영사까지
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetAudienceList.map((item, idx) => (
              <div 
                key={idx}
                className={`rounded-3xl border-2 transition-all shadow-sm hover:shadow-lg overflow-hidden flex flex-col justify-between group ${item.color}`}
              >
                <div>
                  {/* Top Image Banner */}
                  <div className="h-36 relative overflow-hidden border-b border-slate-200/80">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/30 to-transparent p-4 flex items-end justify-between">
                      <span className="text-[11px] font-extrabold text-white bg-blue-900/90 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-700/50 shadow-sm">
                        {item.badge}
                      </span>
                      <span className="text-xs font-black text-white font-mono bg-black/50 backdrop-blur-sm px-2.5 py-0.5 rounded border border-white/20">0{idx + 1}</span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-extrabold text-slate-900 mb-2">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 font-medium leading-relaxed mb-4">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6">
                  {item.isExternal ? (
                    <a
                      href={item.actionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center shadow-sm"
                    >
                      <span>{item.actionText}</span>
                      <ExternalLink size={14} className="ml-2 text-yellow-400" />
                    </a>
                  ) : (
                    <Link
                      to={item.actionUrl}
                      className="w-full py-3 px-4 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-extrabold transition-colors flex items-center justify-center shadow-sm"
                    >
                      <span>{item.actionText}</span>
                      <ArrowRight size={14} className="ml-2 text-yellow-400" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Feature & Cost Comparison Section */}
      <CpaVsCpcComparison />


      {/* ==================================================
          6. 대시보드 미리보기 (TABBED SAAS DASHBOARD MOCKUP)
         ================================================== */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-100 px-3 py-1 rounded-full border border-blue-200 mb-3 inline-block">
              INTEGRATED DASHBOARD
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              필요한 정보를 한눈에 확인하세요
            </h2>
            <p className="text-slate-600 text-base font-medium">
              파트너와 광고주 전용 인터페이스로 복잡한 정산과 DB를 실시간 통합 관리할 수 있습니다.
            </p>
          </div>

          {/* Interactive Dashboard Mockup Frame */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-6xl mx-auto">
            
            {/* Top Bar with Tabs */}
            <div className="bg-slate-900 px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 gap-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className="text-xs font-bold text-slate-400 ml-2 font-mono">onoffcpa.icrm.co.kr/app</span>
              </div>

              {/* Tab Toggle Buttons */}
              <div className="flex bg-slate-800 p-1 rounded-xl w-full sm:w-auto justify-center">
                <button
                  onClick={() => setDashboardTab('partner')}
                  className={`px-6 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center ${
                    dashboardTab === 'partner'
                      ? 'bg-yellow-400 text-slate-900 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Users size={14} className="mr-1.5" />
                  파트너센터 미리보기
                </button>
                <button
                  onClick={() => setDashboardTab('advertiser')}
                  className={`px-6 py-2 rounded-lg text-xs font-extrabold transition-all flex items-center ${
                    dashboardTab === 'advertiser'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Building2 size={14} className="mr-1.5" />
                  광고주센터 미리보기
                </button>
              </div>
            </div>

            {/* Dashboard Content Panel */}
            <div className="p-6 sm:p-8 bg-slate-50/50">
              
              {/* TAB 1: PARTNER CENTER */}
              {dashboardTab === 'partner' && (
                <div className="space-y-6">
                  {/* Partner Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">오늘 수익</span>
                      <div className="text-xl sm:text-2xl font-black text-blue-900 mt-1">₩340,000</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">이번달 누적 수익</span>
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">₩4,850,000</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">승인 대기</span>
                      <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">18건</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">총 클릭수</span>
                      <div className="text-xl sm:text-2xl font-black text-slate-800 mt-1">3,420회</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
                      <span className="text-xs font-extrabold text-slate-500">누적 전환수</span>
                      <div className="text-xl sm:text-2xl font-black text-indigo-600 mt-1">42건</div>
                    </div>
                  </div>

                  {/* Partner Details Table Simulation */}
                  <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-extrabold text-slate-900 flex items-center">
                          <Database size={16} className="text-blue-900 mr-2" />
                          최근 발생 DB 및 성과 내역
                        </h4>
                        <span className="text-[11px] font-bold text-slate-400">최신 5건 표시</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-extrabold">
                              <th className="p-2.5">캠페인명</th>
                              <th className="p-2.5">접수시간</th>
                              <th className="p-2.5">단가</th>
                              <th className="p-2.5">상태</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            <tr>
                              <td className="p-2.5 font-bold text-slate-900">[CPA] 개인회생 무료상담</td>
                              <td className="p-2.5 text-slate-500">10분 전</td>
                              <td className="p-2.5 text-blue-900 font-extrabold">₩45,000</td>
                              <td className="p-2.5"><span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">승인대기</span></td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-bold text-slate-900">[CPA] 장기렌트카 비교견적</td>
                              <td className="p-2.5 text-slate-500">32분 전</td>
                              <td className="p-2.5 text-blue-900 font-extrabold">₩38,000</td>
                              <td className="p-2.5"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">승인완료</span></td>
                            </tr>
                            <tr>
                              <td className="p-2.5 font-bold text-slate-900">[CPS] 가전 렌탈 결제</td>
                              <td className="p-2.5 text-slate-500">1시간 전</td>
                              <td className="p-2.5 text-blue-900 font-extrabold">₩75,000</td>
                              <td className="p-2.5"><span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">승인완료</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
                      <div>
                        <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center">
                          <Sparkles size={16} className="text-amber-500 mr-2" />
                          파트너 추천 높은 단가 상품
                        </h4>
                        <div className="space-y-2.5 text-xs">
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="font-extrabold text-slate-900 mb-0.5">[법률] 변호사 전문 상담</div>
                            <div className="text-blue-900 font-black">CPA ₩55,000 / 건</div>
                          </div>
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="font-extrabold text-slate-900 mb-0.5">[금융] 햇살론/대환대출 문의</div>
                            <div className="text-blue-900 font-black">CPA ₩48,000 / 건</div>
                          </div>
                        </div>
                      </div>
                      <a 
                        href="https://onoffcpa.icrm.co.kr/" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-4 text-center text-xs font-extrabold text-blue-900 hover:underline block"
                      >
                        전체 캠페인 보러가기 →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ADVERTISER CENTER */}
              {dashboardTab === 'advertiser' && (
                <div className="space-y-6">
                  {/* Advertiser Metrics Row */}
                  <div className="grid grid-cols-2 md:grid-cols-6 gap-3 sm:gap-4">
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">운영 캠페인</span>
                      <div className="text-xl sm:text-2xl font-black text-blue-900 mt-1">12개 Active</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">오늘 접수 DB</span>
                      <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">84건</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">승인 대기</span>
                      <div className="text-xl sm:text-2xl font-black text-amber-500 mt-1">24건</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">승인 건수</span>
                      <div className="text-xl sm:text-2xl font-black text-emerald-600 mt-1">52건</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                      <span className="text-xs font-extrabold text-slate-500">취소 건수</span>
                      <div className="text-xl sm:text-2xl font-black text-rose-500 mt-1">8건</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
                      <span className="text-xs font-extrabold text-slate-500">광고비 잔액</span>
                      <div className="text-xl sm:text-2xl font-black text-blue-900 mt-1">₩2,450,000</div>
                    </div>
                  </div>

                  {/* Advertiser Status Row */}
                  <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center">
                        <Users size={16} className="text-blue-900 mr-2" />
                        캠페인별 파트너 참여 현황
                      </h4>
                      <div className="space-y-2 text-xs font-medium">
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                          <span className="font-bold text-slate-800">[의료] 치과 임플란트 이벤트</span>
                          <span className="text-blue-900 font-extrabold">84명 파트너 활동중</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                          <span className="font-bold text-slate-800">[금융] 중고차 할부 리스 상담</span>
                          <span className="text-blue-900 font-extrabold">62명 파트너 활동중</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-extrabold text-slate-900 mb-3 flex items-center">
                        <ShieldCheck size={16} className="text-emerald-600 mr-2" />
                        어뷰징 자동 필터링 수치
                      </h4>
                      <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2 font-medium">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">중복 전화번호 필터링:</span>
                          <span className="text-emerald-400 font-bold">100% 정상 차단</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">동일 IP 다중 접수 차단:</span>
                          <span className="text-emerald-400 font-bold">자동 감지 완료</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 text-center text-[11px] text-slate-400 font-medium">
                * 위 대시보드는 SaaS Mockup 예시 화면이며 실제 플랫폼 접속 시 동일한 구조로 이용하실 수 있습니다.
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ==================================================
          7. [NEW] FAQ (자주 묻는 질문 - ACCORDION FORMAT)
         ================================================== */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100 mb-3 inline-block">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mb-4">
              자주 묻는 질문 (FAQ)
            </h2>
            <p className="text-slate-600 text-base font-medium">
              CPA 제휴마케팅 이용방법, 정산, 승인 절차 및 플랫폼 구축에 관한 대표 질문 모음입니다.
            </p>
          </div>

          <div className="space-y-3">
            {faqList.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={index}
                  className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-white"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-extrabold text-slate-900 hover:bg-slate-50 transition-colors text-sm sm:text-base"
                  >
                    <span className="flex items-center">
                      <span className="text-blue-900 font-black mr-3 text-xs bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        Q{index + 1}
                      </span>
                      {item.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp size={20} className="text-blue-900 shrink-0" />
                    ) : (
                      <ChevronDown size={20} className="text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed font-medium bg-slate-50/60 border-t border-slate-100">
                      <p className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-inner">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>


      {/* ==================================================
          8. [NEW] SEO / AEO KNOWLEDGE BASE & KEYWORDS
         ================================================== */}
      <section className="py-16 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-3.5 py-1.5 rounded-full border border-yellow-400/30 mb-2 inline-block">
              SEARCH & AI ENGINE OPTIMIZED SUMMARY
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              CPA 제휴마케팅 핵심 요약 안내
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 text-xs text-slate-300 font-medium leading-relaxed">
            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <h3 className="text-sm font-extrabold text-yellow-400 mb-2 flex items-center">
                <CheckCircle2 size={16} className="mr-1.5 text-emerald-400" />
                CPA 플랫폼 정의 및 특징
              </h3>
              <p>
                <strong>CPA 제휴마케팅</strong>은 광고주가 유효한 상담 DB, 회원가입, 견적 요청 등 특정 성과가 발생했을 때만 비용을 차감하는 합리적 마케팅 솔루션입니다.
              </p>
            </div>

            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <h3 className="text-sm font-extrabold text-yellow-400 mb-2 flex items-center">
                <CheckCircle2 size={16} className="mr-1.5 text-emerald-400" />
                광고주 이용 방법
              </h3>
              <p>
                광고주는 온오프CPA 플랫폼에 <strong>CPA 광고</strong> 캠페인을 등록하고, 단가와 승인 가이드를 지정한 후 실시간 접수된 DB의 유효성을 클릭 한 번으로 검증 관리할 수 있습니다.
              </p>
            </div>

            <div className="p-5 bg-slate-800/80 rounded-2xl border border-slate-700/80">
              <h3 className="text-sm font-extrabold text-yellow-400 mb-2 flex items-center">
                <CheckCircle2 size={16} className="mr-1.5 text-emerald-400" />
                파트너 수익 창출
              </h3>
              <p>
                제휴 파트너는 고유 <strong>파트너 마케팅</strong> 트래킹 URL을 발급받아 블로그, 카페, SNS에 홍보하고 발생한 전환에 따라 안정적인 정산 수익을 지급받습니다.
              </p>
            </div>
          </div>

          {/* Keywords Tag Cloud */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="font-bold text-slate-300 mr-2">주요 검색 키워드:</span>
            {['CPA 플랫폼', 'CPA 제휴마케팅', 'CPA 광고', 'CPA 마케팅', 'CPS 플랫폼', '제휴마케팅 플랫폼', 'CPA 프로그램', '파트너 마케팅', 'CPA 사이트', 'CPA 솔루션'].map((kw, i) => (
              <span key={i} className="px-2.5 py-1 bg-slate-800 rounded-lg border border-slate-700/80 font-medium">
                #{kw}
              </span>
            ))}
          </div>

        </div>
      </section>


      {/* ==================================================
          9. [NEW] 내부 서비스 연결 파크 (INTERNAL LINK STRUCTURE)
         ================================================== */}
      <section className="py-16 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs font-extrabold text-blue-900 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 mb-2 inline-block">
              ON/OFF MARKETING SERVICES
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              온오프마케팅 통합 성장 서비스 바로가기
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              CPA 플랫폼과 함께 결합하여 폭발적인 유입과 성과를 만드는 전문 서비스로 이동하실 수 있습니다.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <Link to="/request" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <Globe size={18} className="mx-auto mb-1.5 text-blue-900 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">홈페이지 제작</div>
            </Link>

            <Link to="/traffic" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <BarChart3 size={18} className="mx-auto mb-1.5 text-emerald-600 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">SEO / AEO</div>
            </Link>

            <Link to="/traffic" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <TrendingUp size={18} className="mx-auto mb-1.5 text-amber-500 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">트래픽 서비스</div>
            </Link>

            <Link to="/blog" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <FileText size={18} className="mx-auto mb-1.5 text-sky-500 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">블로그포스팅</div>
            </Link>

            <Link to="/cafe" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <Users size={18} className="mx-auto mb-1.5 text-indigo-500 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">카페포스팅</div>
            </Link>

            <Link to="/platform" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <Cpu size={18} className="mx-auto mb-1.5 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">마케팅자동화</div>
            </Link>

            <Link to="/platform" className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all text-center group">
              <Database size={18} className="mx-auto mb-1.5 text-rose-500 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-extrabold text-slate-900">플랫폼 제작의뢰</div>
            </Link>

            <Link to="/consult" className="p-3.5 bg-blue-900 text-white rounded-xl border border-blue-900 hover:bg-blue-800 transition-all text-center group">
              <Send size={18} className="mx-auto mb-1.5 text-yellow-400 group-hover:scale-110 transition-transform" />
              <div className="text-xs font-black">무료 상담신청</div>
            </Link>
          </div>

        </div>
      </section>


      {/* ==================================================
          10. [NEW] 최종 CTA (FINAL CONVERSION AREA)
         ================================================== */}
      <section className="py-20 bg-gradient-to-br from-blue-950 via-slate-900 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-yellow-400/10 text-yellow-400 text-xs font-extrabold border border-yellow-400/30 mb-6">
            <Sparkles size={16} className="mr-2" />
            ON/OFF CPA SYSTEM CONVERSION
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
            “성과형 마케팅, <br />
            이제 직접 운영해보세요.”
          </h2>

          <p className="text-blue-100 text-base sm:text-lg font-medium leading-relaxed max-w-2xl mx-auto mb-10">
            광고주와 파트너를 연결하고 유입부터 성과, 승인, 정산까지 <br className="hidden sm:block" />
            하나의 시스템에서 관리하세요.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
            <a
              href="https://onoffcpa.icrm.co.kr/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-1/2 py-4 px-8 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 font-black rounded-2xl hover:brightness-105 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center text-base"
            >
              <span>온오프CPA 바로가기</span>
              <ExternalLink size={18} className="ml-2" />
            </a>

            <Link
              to="/consult"
              className="w-full sm:w-1/2 py-4 px-8 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-extrabold rounded-2xl transition-colors flex items-center justify-center text-base"
            >
              <span>CPA 플랫폼 제작 상담</span>
              <ArrowRight size={18} className="ml-2 text-yellow-400" />
            </Link>
          </div>

        </div>
      </section>


      {/* ==================================================
          11. ENHANCED CONSULTATION FORM INTEGRATION
         ================================================== */}
      <EnhancedConsultationSection />


      {/* ==================================================
          12. [NEW] MOBILE STICKY BOTTOM CTA BAR
         ================================================== */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 border-t border-slate-800 p-3 backdrop-blur-md shadow-2xl flex items-center justify-between gap-2.5">
        <a
          href="https://onoffcpa.icrm.co.kr/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 bg-gradient-to-r from-yellow-400 to-amber-400 text-slate-900 font-black text-xs rounded-xl text-center flex items-center justify-center truncate shadow-md"
        >
          <span>온오프CPA 시작하기</span>
          <ExternalLink size={14} className="ml-1 shrink-0" />
        </a>

        <Link
          to="/consult"
          className="flex-1 py-3 px-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl text-center flex items-center justify-center truncate shadow-md"
        >
          <span>상담하기</span>
          <ArrowRight size={14} className="ml-1 shrink-0 text-yellow-400" />
        </Link>
      </div>

    </main>
  );
}
