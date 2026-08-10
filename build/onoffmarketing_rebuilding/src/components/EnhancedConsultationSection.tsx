import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  BarChart3, 
  Cpu, 
  Network, 
  GraduationCap, 
  CheckCircle2, 
  Sparkles, 
  Send, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  X, 
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { submitConsultNotify } from '../lib/submitConsult';

export interface ConsultationPurpose {
  id: string;
  icon: React.ElementType;
  title: string;
  badge: string;
  shortDesc: string;
  hint: string;
}

export const consultationPurposes: ConsultationPurpose[] = [
  {
    id: 'website',
    icon: Globe,
    title: '홈페이지 제작 상담',
    badge: '웹사이트/랜딩',
    shortDesc: '고전환 UI/UX & SEO/AEO 기반 신규 및 리뉴얼 제작',
    hint: '업종별 맞춤형 디자인 및 카카오톡 상담 동선 설계'
  },
  {
    id: 'seo',
    icon: Search,
    title: 'SEO/AEO 상담',
    badge: '검색상위/AEO',
    shortDesc: '구글·네이버 1페이지 상위 점유 & AI 검색 엔진 노출',
    hint: '키워드 진단 및 생성형 AI 검색엔진 최적화 구조 세팅'
  },
  {
    id: 'traffic',
    icon: BarChart3,
    title: '트래픽/포스팅 상담',
    badge: '유입/콘텐츠',
    shortDesc: '타겟 유입 트래픽 & 블로그·카페 정기 포스팅 대행',
    hint: '고관여 오가닉 유입 및 지역 키워드 매일 포스팅 운영'
  },
  {
    id: 'platform',
    icon: Cpu,
    title: '플랫폼 제작 상담',
    badge: 'iCRM/자동화',
    shortDesc: 'iCRM, 채팅자동화, 애드센스 독자 플랫폼 시스템 구축',
    hint: '고객 DB 수집 즉시 카카오 알림톡 자동 발송 파이프라인'
  },
  {
    id: 'cpa',
    icon: Network,
    title: '온오프CPA 문의',
    badge: 'CPA/CPS제휴',
    shortDesc: '광고주 성과형 DB 수집 & 1,200+ 파트너 제휴 입점',
    hint: '어뷰징 필터링 및 승인·정산 프로세스 자동화 시스템'
  },
  {
    id: 'course',
    icon: GraduationCap,
    title: '무료온라인강의 문의',
    badge: '실전 교육',
    shortDesc: '홈페이지 자체제작, SEO 노하우, 마케팅 실전 강의',
    hint: '초보자도 따라 할 수 있는 100% 무료 VOD 수강 안내'
  }
];

export default function EnhancedConsultationSection() {
  const [selectedPurposeId, setSelectedPurposeId] = useState<string>('website');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    companyOrSite: '',
    interestedServices: ['홈페이지 제작 상담'] as string[],
    message: '',
    privacyAgree: false,
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');

  // Handle purpose card click
  const handlePurposeSelect = (purpose: ConsultationPurpose) => {
    setSelectedPurposeId(purpose.id);
    // Auto sync selected purpose into interest list
    if (!formData.interestedServices.includes(purpose.title)) {
      setFormData(prev => ({
        ...prev,
        interestedServices: [purpose.title]
      }));
    }
  };

  // Handle interest checkbox toggle
  const toggleInterestService = (title: string) => {
    setFormData(prev => {
      const exists = prev.interestedServices.includes(title);
      if (exists) {
        if (prev.interestedServices.length === 1) return prev; // keep at least 1
        return {
          ...prev,
          interestedServices: prev.interestedServices.filter(s => s !== title)
        };
      } else {
        return {
          ...prev,
          interestedServices: [...prev.interestedServices, title]
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setSubmitError('');
    setIsSubmitting(true);
    try {
      const result = await submitConsultNotify({
        name: formData.name,
        phone: formData.phone,
        company: formData.companyOrSite,
        services: formData.interestedServices.join(', '),
        message: formData.message,
        formType: 'consult',
        privacyAgree: formData.privacyAgree,
      });
      if (!result.success) {
        setSubmitError(result.message);
        return;
      }
      setIsSubmitted(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : '접수 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activePurposeObj = consultationPurposes.find(p => p.id === selectedPurposeId) || consultationPurposes[0];

  return (
    <section 
      id="consultation-form" 
      className="py-24 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden border-b border-slate-800"
    >
      {/* Background Glow Effects */}
      <div className="absolute top-1/4 left-10 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-yellow-400/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-blue-900/80 text-yellow-400 text-xs sm:text-sm font-extrabold mb-4 border border-blue-700/60 shadow-inner">
            <Sparkles size={16} className="mr-2" />
            1:1 맞춤 실행 마케팅 무료 상담
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            어떤 마케팅 솔루션이 필요하신가요?
          </h2>
          
          {/* Pre-consultation Guidance Text (필수 요구사항) */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 sm:p-5 text-center mt-6 shadow-lg max-w-2xl mx-auto">
            <p className="text-yellow-400 font-extrabold text-sm sm:text-base mb-1">
              “필요한 서비스를 선택하면 가장 적합한 방향으로 안내해드립니다.”
            </p>
            <p className="text-slate-300 font-medium text-xs sm:text-sm">
              “막연한 문의보다, 목적에 맞는 상담으로 더 빠르게 제안받을 수 있습니다.”
            </p>
          </div>
        </div>

        {/* 2. 상담 목적 선택 UI (6개 카드로 구성) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-700/80">
            <div className="flex items-center space-x-2">
              <HelpCircle className="text-yellow-400 w-5 h-5" />
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                1단계: 상담 목적을 선택해주세요 (Service Purpose)
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-400 bg-slate-800 px-3 py-1 rounded-full border border-slate-700">
              6 Selective Options
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {consultationPurposes.map((purpose) => {
              const IconComponent = purpose.icon;
              const isSelected = selectedPurposeId === purpose.id;

              return (
                <button
                  key={purpose.id}
                  type="button"
                  onClick={() => handlePurposeSelect(purpose)}
                  className={`p-4 rounded-2xl text-left border transition-all duration-200 flex flex-col justify-between relative group ${
                    isSelected 
                      ? 'bg-blue-900/90 border-yellow-400 shadow-xl shadow-blue-900/40 ring-2 ring-yellow-400/30' 
                      : 'bg-slate-800/80 border-slate-700/80 hover:bg-slate-800 hover:border-slate-500'
                  }`}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-xl ${
                      isSelected ? 'bg-yellow-400 text-slate-900' : 'bg-slate-900 text-blue-400'
                    }`}>
                      <IconComponent size={18} />
                    </div>
                    {isSelected && (
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-ping"></span>
                    )}
                  </div>

                  {/* Title & Badge */}
                  <div>
                    <span className={`text-[10px] font-extrabold block mb-1 ${
                      isSelected ? 'text-yellow-300' : 'text-slate-400'
                    }`}>
                      {purpose.badge}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white leading-snug">
                      {purpose.title}
                    </h4>
                  </div>

                  {/* Selected Indicator Check */}
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between">
                    <span className={`text-[10px] font-bold ${
                      isSelected ? 'text-yellow-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}>
                      {isSelected ? '선택됨' : '클릭선택'}
                    </span>
                    <CheckCircle2 size={13} className={isSelected ? 'text-yellow-400' : 'text-slate-600'} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Main Form & Side Trust Card Container */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Box (8 Cols) */}
          <div className="lg:col-span-7 bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700">
              <div>
                <span className="text-xs font-extrabold text-yellow-400 uppercase tracking-wider block mb-1">
                  Step 2: 문의 정보 입력
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                  [{activePurposeObj.title}] 문의하기
                </h3>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 bg-slate-900 text-slate-300 text-xs font-bold rounded-full border border-slate-700">
                무료 1:1 진단
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 항목 1: 이름 */}
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 mb-2">
                  1. 이름 / 담당자명 <span className="text-yellow-400">*</span>
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="예: 홍길동 팀장" 
                  className="w-full px-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-400 text-white placeholder-slate-500 text-sm font-medium transition-colors"
                />
              </div>

              {/* 항목 2: 연락처 */}
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 mb-2">
                  2. 연락처 <span className="text-yellow-400">*</span>
                </label>
                <input 
                  type="tel" 
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="예: 010-1234-5678" 
                  className="w-full px-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-400 text-white placeholder-slate-500 text-sm font-medium transition-colors"
                />
              </div>

              {/* 항목 3: 회사명 또는 사이트주소 */}
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 mb-2">
                  3. 회사명 또는 사이트주소 <span className="text-slate-400 text-xs font-normal">(선택)</span>
                </label>
                <input 
                  type="text" 
                  value={formData.companyOrSite}
                  onChange={(e) => setFormData({ ...formData, companyOrSite: e.target.value })}
                  placeholder="예: (주)온오프마케팅 또는 https://example.com" 
                  className="w-full px-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-400 text-white placeholder-slate-500 text-sm font-medium transition-colors"
                />
              </div>

              {/* 항목 4: 관심 서비스 (6가지 선택지 연동 + 다중 선택 가능) */}
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 mb-2">
                  4. 관심 서비스 <span className="text-yellow-400">*</span>
                  <span className="text-xs font-normal text-slate-400 ml-2">(다중 선택 가능)</span>
                </label>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {consultationPurposes.map((p) => {
                    const isChecked = formData.interestedServices.includes(p.title);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => toggleInterestService(p.title)}
                        className={`p-3 rounded-xl border text-xs font-extrabold text-left transition-all flex items-center justify-between ${
                          isChecked
                            ? 'bg-yellow-400 text-slate-900 border-yellow-300 shadow-md'
                            : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <span className="truncate mr-1">{p.title}</span>
                        <CheckCircle2 size={14} className={isChecked ? 'text-slate-900 shrink-0' : 'text-slate-600 shrink-0'} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 항목 5: 문의내용 */}
              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-slate-200 mb-2">
                  5. 문의내용 <span className="text-yellow-400">*</span>
                </label>
                <textarea 
                  rows={4} 
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="현재 고민, 공략하고 싶은 대표 키워드, 희망 예산, 진행 시기 등을 자유롭게 적어주세요. 상기 선택하신 목적에 맞춰 가장 빠른 실행 솔루션을 제안해드립니다." 
                  className="w-full px-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-yellow-400 text-white placeholder-slate-500 text-sm font-medium resize-none transition-colors"
                ></textarea>
              </div>

              {/* Privacy */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.privacyAgree}
                  onChange={(e) => setFormData({ ...formData, privacyAgree: e.target.checked })}
                  className="mt-1 w-4 h-4 rounded border-slate-600 bg-slate-900 text-yellow-400 focus:ring-yellow-400"
                  required
                />
                <span className="text-xs text-slate-300 leading-relaxed">
                  개인정보 수집·이용에 동의합니다. <span className="text-yellow-400">*</span>
                  <span className="block text-slate-500 mt-1">수집 항목: 이름, 연락처, 문의내용 · 목적: 상담 응대 · 보관: 상담 완료 후 1년 이내</span>
                </span>
              </label>

              {submitError && (
                <p className="text-sm text-red-300 bg-red-950/50 border border-red-800/60 rounded-xl px-4 py-3 font-medium" role="alert">
                  {submitError}
                </p>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-5 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-slate-900 rounded-xl font-black text-base sm:text-lg hover:brightness-105 transition-all shadow-xl shadow-yellow-500/20 flex items-center justify-center cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <span className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mr-2"></span>
                      상담 데이터 접수 중...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send size={20} className="mr-2" />
                      무료 상담 신청하기 (1:1 전문가 진단)
                    </span>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-3 font-medium">
                  * 상담 접수 시 입력하신 정보는 담당자의 1:1 맞춤 컨설팅 용도로만 사용됩니다.
                </p>
              </div>

            </form>
          </div>

          {/* Side Trust Copy & Alternative Quick Channels (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* 4. 보조 신뢰 문구 카드 (필수 요구사항) */}
            <div className="bg-slate-800/90 rounded-3xl p-6 sm:p-8 border border-slate-700/80 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full pointer-events-none"></div>

              <div className="flex items-center space-x-2 text-yellow-400 font-extrabold text-xs uppercase tracking-wider mb-3">
                <ShieldCheck size={18} />
                <span>온오프마케팅 실전 보증</span>
              </div>

              <h4 className="text-xl font-extrabold text-white mb-6 leading-tight">
                "단순 자문을 넘어 <br />
                <span className="text-yellow-400">실제 유입과 전환</span>을 만듭니다"
              </h4>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60 flex items-start space-x-3">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-white">
                      홈페이지 제작부터 검색유입까지 함께 설계합니다
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-medium">
                      단순 디자인이 아닌 구글·네이버 상위노출과 AEO 인덱싱 구조 탑재
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60 flex items-start space-x-3">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-white">
                      상황에 맞는 실행형 마케팅 방향을 제안합니다
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-medium">
                      예산과 업종 특성에 맞춘 오가닉 트래픽 및 정기 포스팅 집행
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/90 rounded-xl border border-slate-700/60 flex items-start space-x-3">
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-extrabold text-white">
                      플랫폼/자동화 문의도 가능합니다
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5 font-medium">
                      iCRM, 카카오 알림톡 자동화, CPA 제휴마케팅 시스템 구축 지원
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Channel Box */}
            <div className="bg-slate-950 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl">
              <h4 className="text-base font-extrabold text-white mb-4 flex items-center justify-between">
                <span>빠른 다이렉트 상담</span>
                <span className="text-xs font-bold text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full border border-yellow-400/30">
                  실시간 연결
                </span>
              </h4>

              <div className="space-y-3">
                <a
                  href="tel:0503-6982-1200"
                  className="flex items-center justify-between p-4 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-white transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-900/80 rounded-lg text-yellow-400">
                      <Phone size={18} />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-bold">전화 직통 상담</div>
                      <div className="text-sm font-extrabold text-white group-hover:text-yellow-300">0503-6982-1200</div>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </a>

                <a
                  href="http://pf.kakao.com/_MTlNK/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-[#FEE500] hover:bg-[#f3dc00] rounded-xl text-slate-900 font-extrabold transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare size={20} className="text-slate-900" />
                    <span className="text-sm">카카오톡 1:1 상담 연결</span>
                  </div>
                  <ArrowRight size={16} className="text-slate-800" />
                </a>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Submission Success Modal */}
      {isSubmitted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative">
            <button
              onClick={() => setIsSubmitted(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-colors"
            >
              <X size={18} />
            </button>

            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 size={36} />
            </div>

            <h3 className="text-2xl font-extrabold text-white mb-2">
              상담 신청이 완료되었습니다!
            </h3>

            <p className="text-slate-300 text-sm font-medium leading-relaxed mb-6">
              입력하신 <strong className="text-yellow-400">[{formData.interestedServices.join(', ')}]</strong> 목적으로 담당 마케팅 디렉터가 확인 후 빠르게 연락드리겠습니다.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-xs text-slate-400 text-left space-y-1.5">
              <div><strong className="text-slate-200">신청자:</strong> {formData.name}</div>
              <div><strong className="text-slate-200">연락처:</strong> {formData.phone}</div>
              {formData.companyOrSite && <div><strong className="text-slate-200">회사/사이트:</strong> {formData.companyOrSite}</div>}
            </div>

            <div className="flex flex-col gap-2">
              <a
                href="http://pf.kakao.com/_MTlNK/chat"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#FEE500] text-slate-900 font-extrabold text-sm rounded-xl hover:bg-[#f3dc00] transition-colors flex items-center justify-center"
              >
                카카오톡으로 즉시 상담 이어가기
              </a>
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full py-3 bg-slate-800 text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}
