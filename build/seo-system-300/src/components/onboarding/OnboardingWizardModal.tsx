import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Globe2,
  LayoutTemplate,
  Target,
  Search,
  BarChart3,
  TrendingUp,
  Layers,
  HelpCircle,
  Wrench,
  ExternalLink,
  Check,
  Briefcase,
  DollarSign,
  PhoneCall,
  ShoppingBag,
  MapPin,
  FileText,
  Building,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ProjectCreateInput } from '../../services/projectService';
import { Button } from '../common/Button';

export interface OnboardingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (payload: ProjectCreateInput) => void;
  onNavigateToTools?: (tool: string) => void;
}

export const OnboardingWizardModal: React.FC<OnboardingWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  onNavigateToTools
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [websiteStatus, setWebsiteStatus] = useState<string>('');
  const [domainStatus, setDomainStatus] = useState<string>('');
  const [existingDomain, setExistingDomain] = useState('');
  const [targetKeywords, setTargetKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [aiRecommending, setAiRecommending] = useState(false);

  // 3-Month Goals
  const [impressionsGoal, setImpressionsGoal] = useState<number>(30000);
  const [trafficGoal, setTrafficGoal] = useState<number>(3000);
  const [contentGoal, setContentGoal] = useState<number>(50);
  const [referringDomainGoal, setReferringDomainGoal] = useState<number>(30);

  // Completed Screen
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  const purposeOptions = [
    { id: 'Google 상위노출', icon: <TrendingUp className="w-5 h-5" />, desc: '핵심 검색어 1페이지 상위 랭킹' },
    { id: '문의/상담 확보', icon: <PhoneCall className="w-5 h-5" />, desc: '잠재고객 DB 및 상담 문의 수집' },
    { id: '상품 판매', icon: <ShoppingBag className="w-5 h-5" />, desc: '이커머스/자사몰 상품 직간접 판매' },
    { id: 'CPA 마케팅', icon: <DollarSign className="w-5 h-5" />, desc: '제휴마케팅 및 전환 수수료 창출' },
    { id: '지역 비즈니스', icon: <MapPin className="w-5 h-5" />, desc: '로컬 플레이스 및 오프라인 매장 유입' },
    { id: '애드센스/콘텐츠 수익', icon: <Briefcase className="w-5 h-5" />, desc: '트래픽 기반 구글 광고 패시브 인컴' },
    { id: '브랜드 홈페이지', icon: <Building className="w-5 h-5" />, desc: '기업/브랜드 신뢰도 및 포트폴리오' },
    { id: '기타', icon: <Target className="w-5 h-5" />, desc: '특수 목적 니치 사이트 운영' }
  ];

  const websiteOptions = [
    {
      id: '홈페이지 없음',
      title: '① 홈페이지 없음',
      desc: '아직 웹사이트가 없거나 SEO 친화적인 고속 사이트 제작이 필요합니다.',
      highlight: true
    },
    {
      id: '홈페이지 제작중',
      title: '② 홈페이지 제작중',
      desc: '현재 외주 또는 자체 템플릿으로 사이트를 제작하는 단계입니다.'
    },
    {
      id: '기존 홈페이지 있음',
      title: '③ 기존 홈페이지 있음',
      desc: '이미 운영 중인 워드프레스/그누보드/자사몰 사이트가 있습니다.'
    },
    {
      id: '어떤 방식이 좋은지 모르겠음',
      title: '④ 어떤 방식이 좋은지 모르겠음',
      desc: 'SEO SYSTEM 300 추천 최적화 구조 가이드가 필요합니다.'
    }
  ];

  const domainOptions = [
    {
      id: '도메인이 있습니다.',
      title: '도메인이 있습니다.',
      desc: '이미 구매하여 보유 중인 도메인을 연결합니다.',
      showInput: true
    },
    {
      id: '새 도메인이 필요합니다.',
      title: '새 도메인이 필요합니다.',
      desc: '프로젝트명에 맞는 신규 브랜드 도메인을 구매할 예정입니다.'
    },
    {
      id: '낙장도메인을 사용하고 싶습니다.',
      title: '낙장도메인을 사용하고 싶습니다.',
      desc: '과거 백링크 파워가 살아있는 고DA 만료도메인으로 샌드박스를 단축합니다.',
      showCatchDomainCta: true
    },
    {
      id: '잘 모르겠습니다.',
      title: '잘 모르겠습니다.',
      desc: 'SYSTEM 300 커리큘럼 추천 방식으로 결정하겠습니다.'
    }
  ];

  const togglePurpose = (purpose: string) => {
    if (selectedPurposes.includes(purpose)) {
      setSelectedPurposes(selectedPurposes.filter((p) => p !== purpose));
    } else {
      setSelectedPurposes([...selectedPurposes, purpose]);
    }
  };

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !targetKeywords.includes(keywordInput.trim())) {
      setTargetKeywords([...targetKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    setTargetKeywords(targetKeywords.filter((k) => k !== kw));
  };

  const handleAiKeywordRecommend = () => {
    setAiRecommending(true);
    setTimeout(() => {
      const recommendations = [
        '세부 자유여행 일정',
        '막탄 호핑투어 가격',
        '세부 가성비 리조트',
        '세부 환전소 추천',
        '세부 맛집 리스트 2026'
      ];
      const newKeywords = Array.from(new Set([...targetKeywords, ...recommendations]));
      setTargetKeywords(newKeywords);
      setAiRecommending(false);
    }, 600);
  };

  const handleApplyPresetGoals = () => {
    setImpressionsGoal(30000);
    setTrafficGoal(3000);
    setContentGoal(50);
    setReferringDomainGoal(30);
  };

  const handleFinish = () => {
    setIsFinished(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStartRoadmap = () => {
    onComplete({
      name: projectName || '신규 SEO 프로젝트',
      description: projectDescription,
      purposes: selectedPurposes,
      websiteStatus,
      domainStatus,
      domain: existingDomain,
      keywords: targetKeywords,
      impressionsGoal,
      trafficGoal,
      contentGoal,
      referringDomainGoal
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0F172A]/70 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#E2E8F0] overflow-hidden flex flex-col my-auto max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-[#E2E8F0] bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-center text-[#2563EB]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                  SEO 온보딩 위저드
                </span>
                <span className="text-xs font-semibold text-[#64748B]">
                  {!isFinished ? `STEP ${currentStep} / 6` : '완료'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] mt-0.5">
                새 SEO 프로젝트 만들기
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        {!isFinished && (
          <div className="w-full bg-[#F1F5F9] h-1.5 shrink-0 overflow-hidden">
            <div
              className="bg-[#2563EB] h-full transition-all duration-300 rounded-r-full"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 custom-scrollbar">
          {/* STEP 1 */}
          {!isFinished && currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">STEP 1</span>
                <h3 className="text-lg font-bold text-[#0F172A]">프로젝트 기본 정보를 입력해주세요</h3>
                <p className="text-xs text-[#64748B]">
                  진행할 사이트의 이름과 다루고자 하는 핵심 비즈니스/니치 주제를 정의합니다.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    프로젝트 이름 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="예: 세부여행사이트, 제주풀빌라 허브, B2B IT솔루션"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm text-[#0F172A] outline-hidden font-medium placeholder:text-[#94A3B8]"
                  />
                  <p className="text-[11px] text-[#64748B] mt-1">
                    추후 언제든지 수정할 수 있는 내부 관리용 프로젝트명입니다.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                    사업 / 사이트 설명 <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    placeholder="예: 필리핀 세부 여행정보 및 풀빌라 예약 사이트 (호핑투어, 마사지 등 현지 정보 제공)"
                    className="w-full px-4 py-3 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 text-xs sm:text-sm text-[#0F172A] outline-hidden font-medium placeholder:text-[#94A3B8]"
                  />
                  <p className="text-[11px] text-[#64748B] mt-1">
                    AI 코치와 키워드 추천 도구가 이 설명을 분석하여 맞춤형 롱테일 키워드를 생성합니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {!isFinished && currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">STEP 2</span>
                <h3 className="text-lg font-bold text-[#0F172A]">프로젝트의 주 목적을 선택해주세요 (복수 선택)</h3>
                <p className="text-xs text-[#64748B]">
                  사이트의 목적에 따라 최적화된 키워드 선정 및 백링크 전략이 달라집니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {purposeOptions.map((opt) => {
                  const isSelected = selectedPurposes.includes(opt.id);
                  return (
                    <div
                      key={opt.id}
                      onClick={() => togglePurpose(opt.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-2xs'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#64748B]'
                          }`}
                        >
                          {opt.icon}
                        </div>
                        <div>
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                            {opt.id}
                          </h4>
                          <p className="text-[11px] text-[#64748B] mt-0.5 leading-normal">{opt.desc}</p>
                        </div>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#CBD5E1]'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {!isFinished && currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">STEP 3</span>
                <h3 className="text-lg font-bold text-[#0F172A]">현재 홈페이지가 있나요?</h3>
                <p className="text-xs text-[#64748B]">
                  홈페이지 상태에 맞춰 필요한 다음 액션을 안내해 드립니다.
                </p>
              </div>

              <div className="space-y-3">
                {websiteOptions.map((opt) => {
                  const isSelected = websiteStatus === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setWebsiteStatus(opt.id)}
                      className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-2xs'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#2563EB]' : 'border-[#CBD5E1]'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                              {opt.title}
                            </h4>
                            <p className="text-[11px] text-[#64748B] mt-0.5">{opt.desc}</p>
                          </div>
                        </div>

                        {opt.highlight && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#DBEAFE] text-[#2563EB] shrink-0">
                            초보자 추천
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Highlight CTA when "홈페이지 없음" is selected */}
              {websiteStatus === '홈페이지 없음' && (
                <div className="p-4.5 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                      <LayoutTemplate className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#1E3A8A]">
                        SEO 최적화 홈페이지 제작부터 시작하기
                      </h5>
                      <p className="text-[11px] text-[#1E40AF] mt-0.5">
                        SYSTEM 300 전담 제작팀에 코어 웹 바이탈 90점+ 고속 스킨 웹사이트를 주문할 수 있습니다.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#2563EB] self-end sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-[#93C5FD]">
                    프로젝트 생성 후 즉시 연동
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4 */}
          {!isFinished && currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">STEP 4</span>
                <h3 className="text-lg font-bold text-[#0F172A]">도메인은 준비되셨나요?</h3>
                <p className="text-xs text-[#64748B]">
                  구글 상위노출 기간을 극적으로 단축하려면 검증된 만료도메인을 추천합니다.
                </p>
              </div>

              <div className="space-y-3">
                {domainOptions.map((opt) => {
                  const isSelected = domainStatus === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setDomainStatus(opt.id)}
                      className={`p-4.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#2563EB] bg-[#EFF6FF] shadow-2xs'
                          : 'border-[#E2E8F0] bg-white hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-[#2563EB]' : 'border-[#CBD5E1]'
                            }`}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#2563EB]" />}
                          </div>
                          <div>
                            <h4 className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>
                              {opt.title}
                            </h4>
                            <p className="text-[11px] text-[#64748B] mt-0.5">{opt.desc}</p>
                          </div>
                        </div>

                        {opt.showCatchDomainCta && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#92400E] shrink-0">
                            랭킹 가속화 강추
                          </span>
                        )}
                      </div>

                      {/* If input needed */}
                      {isSelected && opt.showInput && (
                        <div className="mt-3 pt-3 border-t border-[#DBEAFE]" onClick={(e) => e.stopPropagation()}>
                          <label className="block text-[11px] font-bold text-[#0F172A] mb-1">
                            보유 중인 도메인 주소 입력
                          </label>
                          <input
                            type="text"
                            value={existingDomain}
                            onChange={(e) => setExistingDomain(e.target.value)}
                            placeholder="예: mydomain.co.kr"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-[#CBD5E1] bg-white text-xs text-[#0F172A] outline-hidden focus:border-[#2563EB]"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Highlight CatchDomain Button */}
              {domainStatus === '낙장도메인을 사용하고 싶습니다.' && (
                <div className="p-4.5 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#D97706] text-white flex items-center justify-center shrink-0">
                      <Globe2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-[#92400E]">
                        CatchDomain에서 고DA 만료도메인 찾기
                      </h5>
                      <p className="text-[11px] text-[#B45309] mt-0.5">
                        DA 20+ 이상의 깨끗한 히스토리를 가진 만료도메인을 즉시 조회하고 선점할 수 있습니다.
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    onClick={() => {
                      if (onNavigateToTools) onNavigateToTools('catchdomain');
                    }}
                    className="self-end sm:self-auto shrink-0 bg-white border-[#FCD34D] text-[#92400E] hover:bg-[#FFFBEB]"
                  >
                    CatchDomain에서 찾기 →
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* STEP 5 */}
          {!isFinished && currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">STEP 5</span>
                <h3 className="text-lg font-bold text-[#0F172A]">타겟할 목표 키워드를 등록해주세요</h3>
                <p className="text-xs text-[#64748B]">
                  상위노출을 노릴 메인 키워드 및 롱테일 키워드를 입력하거나 AI 추천을 받아보세요.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="키워드 입력 (예: 세부 자유여행)"
                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:border-[#2563EB] text-xs sm:text-sm text-[#0F172A] outline-hidden placeholder:text-[#94A3B8]"
                  />
                  <Button variant="secondary" size="md" onClick={handleAddKeyword}>
                    추가
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    leftIcon={<Sparkles className="w-4 h-4" />}
                    onClick={handleAiKeywordRecommend}
                    disabled={aiRecommending}
                  >
                    {aiRecommending ? '생성 중...' : 'AI 키워드 추천'}
                  </Button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#0F172A]">
                      등록된 타겟 키워드 ({targetKeywords.length}개)
                    </span>
                    <span className="text-[11px] text-[#64748B]">클릭하여 삭제</span>
                  </div>

                  <div className="flex flex-wrap gap-2 p-3.5 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] min-h-[90px]">
                    {targetKeywords.map((kw) => (
                      <span
                        key={kw}
                        onClick={() => handleRemoveKeyword(kw)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#CBD5E1] text-xs font-bold text-[#0F172A] hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 transition-colors cursor-pointer shadow-2xs"
                      >
                        <span>{kw}</span>
                        <X className="w-3 h-3 text-[#94A3B8]" />
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6 */}
          {!isFinished && currentStep === 6 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#2563EB] tracking-wider uppercase">STEP 6</span>
                <h3 className="text-lg font-bold text-[#0F172A]">3개월 정량 목표를 설정해주세요</h3>
                <p className="text-xs text-[#64748B]">
                  현실적이고 검증된 3개월 SEO 성장 목표를 세팅하고 Control Center에서 달성률을 추적합니다.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white">
                  <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mb-2">
                    <span>Google 노출 (Impressions)</span>
                    <BarChart3 className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <input
                    type="number"
                    value={impressionsGoal}
                    onChange={(e) => setImpressionsGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-base font-bold text-[#0F172A] outline-hidden focus:border-[#2563EB]"
                  />
                  <span className="text-[11px] text-[#64748B] mt-1 block">추천 기준: 30,000회</span>
                </div>

                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white">
                  <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mb-2">
                    <span>Organic Traffic (순방문자)</span>
                    <TrendingUp className="w-4 h-4 text-[#10B981]" />
                  </div>
                  <input
                    type="number"
                    value={trafficGoal}
                    onChange={(e) => setTrafficGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-base font-bold text-[#0F172A] outline-hidden focus:border-[#2563EB]"
                  />
                  <span className="text-[11px] text-[#64748B] mt-1 block">추천 기준: 3,000명</span>
                </div>

                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white">
                  <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mb-2">
                    <span>콘텐츠 발행 (Articles)</span>
                    <FileText className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <input
                    type="number"
                    value={contentGoal}
                    onChange={(e) => setContentGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-base font-bold text-[#0F172A] outline-hidden focus:border-[#2563EB]"
                  />
                  <span className="text-[11px] text-[#64748B] mt-1 block">추천 기준: 50개</span>
                </div>

                <div className="p-4 rounded-2xl border border-[#E2E8F0] bg-white">
                  <div className="flex items-center justify-between text-xs font-bold text-[#64748B] mb-2">
                    <span>Referring Domain (백링크 출처)</span>
                    <Layers className="w-4 h-4 text-[#8B5CF6]" />
                  </div>
                  <input
                    type="number"
                    value={referringDomainGoal}
                    onChange={(e) => setReferringDomainGoal(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-[#E2E8F0] text-base font-bold text-[#0F172A] outline-hidden focus:border-[#2563EB]"
                  />
                  <span className="text-[11px] text-[#64748B] mt-1 block">추천 기준: 30개</span>
                </div>
              </div>

              <div className="flex justify-end">
                <Button variant="ghost" size="sm" onClick={handleApplyPresetGoals}>
                  ✨ SYSTEM 300 3개월 표준 목표 자동 적용
                </Button>
              </div>
            </div>
          )}

          {/* FINISHED SCREEN */}
          {isFinished && (
            <div className="text-center py-6 space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-[#ECFDF5] border border-[#A7F3D0] text-[#10B981] flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-black text-[#0F172A]">
                  SEO 프로젝트가 생성되었습니다! 🎉
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B]">
                  이제 SEO SYSTEM 300 실행 로드맵에 맞춰 순서대로 진행하면 됩니다.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left max-w-lg mx-auto space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                  <span className="text-xs text-[#64748B]">프로젝트명</span>
                  <span className="text-xs font-bold text-[#0F172A]">{projectName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                  <span className="text-xs text-[#64748B]">도메인 상태</span>
                  <span className="text-xs font-bold text-[#0F172A]">{domainStatus}</span>
                </div>
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
                  <span className="text-xs text-[#64748B]">타겟 키워드</span>
                  <span className="text-xs font-bold text-[#0F172A]">
                    {targetKeywords.slice(0, 3).join(', ')} {targetKeywords.length > 3 && `외 ${targetKeywords.length - 3}개`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">3개월 목표</span>
                  <span className="text-xs font-bold text-[#2563EB]">
                    노출 {impressionsGoal.toLocaleString()} / 트래픽 {trafficGoal.toLocaleString()} / 콘텐츠 {contentGoal}개
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleStartRoadmap}
                  className="w-full max-w-md mx-auto py-3.5 text-sm font-bold shadow-md"
                >
                  SEO Roadmap 시작하기 →
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer */}
        {!isFinished && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between shrink-0">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              이전
            </Button>

            {currentStep < 6 ? (
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setCurrentStep((prev) => Math.min(6, prev + 1))}
              >
                다음 단계
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleFinish}
              >
                프로젝트 생성 완료
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
