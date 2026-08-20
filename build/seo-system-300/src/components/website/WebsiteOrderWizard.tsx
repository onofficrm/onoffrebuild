import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Building2,
  MapPin,
  Stethoscope,
  Target,
  ShoppingBag,
  Palmtree,
  BookOpen,
  DollarSign,
  MoreHorizontal,
  Search,
  Check,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Send,
  Clock,
  Layers,
  FileCheck,
  PhoneCall,
  MessageCircle,
  TrendingUp,
  Globe2,
  Calendar,
  Shield,
  Edit3,
  GripVertical,
  Palette,
  Zap,
  UploadCloud
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { WizardStep6Design } from './wizard/WizardStep6Design';
import { WizardStep7Features } from './wizard/WizardStep7Features';
import { WizardStep8UploadCenter } from './wizard/WizardStep8UploadCenter';
import { WizardStep9Review } from './wizard/WizardStep9Review';

export interface WebsiteOrderWizardProps {
  onSubmitOrder: (orderData: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  onSaveDraft?: (orderData: Record<string, unknown>) => void | Promise<void>;
  initialValues?: Record<string, unknown> | null;
  files?: import('./wizard/WizardStep8UploadCenter').UploadedFileItem[];
  uploading?: boolean;
  uploadProgress?: number;
  uploadError?: string;
  onUploadFiles?: (categoryId: string, files: FileList) => void;
  onDeleteFile?: (id: string) => void;
  onUpdateFileMemo?: (id: string, memo: string) => void;
  onReplaceFile?: (id: string, file: File) => void;
  saveError?: string;
  saveStatus?: 'idle' | 'saving' | 'saved';
}

// 8 Wizard Steps + intro + success
export type WizardStep =
  | 'intro'
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8'
  | 'step9'
  | 'success';

// Step 1 Site Types
interface SiteTypeOption {
  id: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  badge?: string;
}

const SITE_TYPE_OPTIONS: SiteTypeOption[] = [
  {
    id: 'company',
    title: '회사 홈페이지',
    desc: '신뢰도 높은 기업 소개, 서비스 안내 및 포트폴리오',
    icon: <Building2 className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'local_service',
    title: '지역 서비스',
    desc: '지역 기반 출장, 예약, 청소, 인테리어, 이사 등',
    icon: <MapPin className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'professional',
    title: '병원 / 법률 / 전문직',
    desc: '전문가 프로필, 시술/승소 사례, 상담신청 특화',
    icon: <Stethoscope className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'cpa_landing',
    title: 'CPA 랜딩페이지',
    desc: '고전환율 단일 페이지 DB 수집 및 마케팅 광고 전용',
    icon: <Target className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'shopping',
    title: '쇼핑몰',
    desc: '자사몰 상품 판매, 결제 시스템 및 주문 관리 연동',
    icon: <ShoppingBag className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'travel',
    title: '여행 / 숙박',
    desc: '풀빌라, 펜션, 투어 상품 예약 및 여행 정보 가이드',
    icon: <Palmtree className="w-6 h-6 text-[#2563EB]" />,
    badge: '인기'
  },
  {
    id: 'info_blog',
    title: '정보형 블로그',
    desc: '구글 검색 상위노출 및 애드센스 광고 수익 특화',
    icon: <BookOpen className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'seo_affiliate',
    title: 'SEO 수익형 사이트',
    desc: '제휴마케팅(쿠팡, 알리, 어필리에이트) 비교 추천형',
    icon: <DollarSign className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'other',
    title: '기타',
    desc: '위 유형에 해당하지 않는 맞춤형 웹사이트',
    icon: <MoreHorizontal className="w-6 h-6 text-[#2563EB]" />
  },
  {
    id: 'dont_know',
    title: '잘 모르겠어요',
    desc: '아직 확정하지 못함 (SEO 전문가와 상담 및 니치 추천)',
    icon: <HelpCircle className="w-6 h-6 text-[#F59E0B]" />,
    badge: '추천 가이드'
  }
];

// Step 2 Purpose Options
interface PurposeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const PURPOSE_OPTIONS: PurposeOption[] = [
  { id: 'phone', label: '전화문의', icon: <PhoneCall className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'consult', label: '상담신청', icon: <MessageCircle className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'sales', label: '상품판매', icon: <ShoppingBag className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'google', label: 'Google 유입', icon: <Globe2 className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'naver', label: 'Naver 유입', icon: <Search className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'intro', label: '회사소개', icon: <Building2 className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'landing', label: '광고 랜딩', icon: <Target className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'members', label: '회원 확보', icon: <Shield className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'reservation', label: '예약', icon: <Calendar className="w-4 h-4 text-[#2563EB]" /> },
  { id: 'adsense', label: '애드센스 / SEO 수익', icon: <TrendingUp className="w-4 h-4 text-[#2563EB]" /> }
];

// Step 3 Category List
const CATEGORY_LIST = [
  '자동차',
  '법률',
  '병원',
  '부동산',
  '여행',
  '교육',
  '인테리어',
  '청소',
  '이사',
  '렌터카',
  '식당',
  '뷰티',
  '금융',
  '온라인마케팅',
  '기타'
];

export interface MenuItem {
  id: string;
  title: string;
  isSubItem?: boolean;
  parentTitle?: string;
}

export const WebsiteOrderWizard: React.FC<WebsiteOrderWizardProps> = ({
  onSubmitOrder,
  onCancel,
  onSaveDraft,
  initialValues,
  files,
  uploading,
  uploadProgress,
  uploadError,
  onUploadFiles,
  onDeleteFile,
  onUpdateFileMemo,
  onReplaceFile,
  saveError,
  saveStatus = 'idle'
}) => {
  const init = initialValues || {};
  const [currentStep, setCurrentStep] = useState<WizardStep>(
    (init.wizardStep as WizardStep) || 'intro'
  );
  const hydratedStepRef = useRef(false);
  useEffect(() => {
    if (hydratedStepRef.current) return;
    const step = initialValues?.wizardStep as WizardStep | undefined;
    if (!step || step === 'intro') return;
    setCurrentStep(step);
    hydratedStepRef.current = true;
  }, [initialValues?.wizardStep]);

  const [selectedSiteType, setSelectedSiteType] = useState<string>((init.siteType as string) || '');
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>(
    Array.isArray(init.purposes) ? (init.purposes as string[]) : []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>((init.industry as string) || '');
  const [customCategoryInput, setCustomCategoryInput] = useState<string>('');
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');

  const [siteName, setSiteName] = useState((init.siteName as string) || '');
  const [brandName, setBrandName] = useState((init.brandName as string) || '');
  const [phone, setPhone] = useState((init.phone as string) || '');
  const [email, setEmail] = useState((init.email as string) || '');
  const [location, setLocation] = useState((init.region as string) || '');
  const [businessDesc, setBusinessDesc] = useState((init.businessDescription as string) || '');
  const [existingUrl, setExistingUrl] = useState((init.currentUrl as string) || '');

  // STEP 5 Structure State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    Array.isArray(init.menus) && (init.menus as MenuItem[]).length
      ? (init.menus as MenuItem[])
      : [{ id: 'm1', title: 'HOME', isSubItem: false }]
  );
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [isAiRegenerating, setIsAiRegenerating] = useState(false);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuIsSub, setNewMenuIsSub] = useState(false);

  // STEP 6 Design State
  const [selectedStyle, setSelectedStyle] = useState<string>((init.designStyle as string) || '');
  const [selectedColorPalette, setSelectedColorPalette] = useState<string>(
    (init.primaryColor as string) || ''
  );
  const [customPrimaryColor, setCustomPrimaryColor] = useState<string>(
    (init.customColor as string) || '#2563EB'
  );
  const [referenceUrls, setReferenceUrls] = useState<string[]>(
    Array.isArray(init.references)
      ? (init.references as Array<string | { url?: string }>)
          .map((r) => (typeof r === 'string' ? r : String(r.url || '')))
          .filter(Boolean)
      : []
  );

  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    Array.isArray(init.features) ? (init.features as string[]) : []
  );
  const initContacts = (init.contacts && typeof init.contacts === 'object' ? init.contacts : {}) as Record<
    string,
    string
  >;
  const [contacts, setContacts] = useState<Record<string, string>>(initContacts);
  const [extraRequest, setExtraRequest] = useState((init.extraRequest as string) || '');
  const [customSecondaryColor, setCustomSecondaryColor] = useState<string>(
    (init.accentColor as string) || (init.secondaryColor as string) || '#1E293B'
  );

  const collectPayload = (step: WizardStep = currentStep) => ({
    wizardStep: step,
    siteType: selectedSiteType,
    purposes: selectedPurposes,
    industry: customCategoryInput.trim() || selectedCategory,
    siteName,
    brandName,
    phone,
    email,
    region: location,
    businessDescription: businessDesc,
    currentUrl: existingUrl,
    designStyle: selectedStyle,
    primaryColor: selectedColorPalette,
    customColor: customPrimaryColor,
    targetRegion: location,
    secondaryStyle: '',
    colorPreset: selectedColorPalette,
    accentColor: customSecondaryColor,
    menus: menuItems.map((m) => ({
      id: m.id,
      title: m.title,
      label: m.title,
      isSubItem: Boolean(m.isSubItem),
      parentTitle: m.parentTitle
    })),
    features: selectedFeatures,
    references: referenceUrls.filter(Boolean).map((url) => ({ url, memo: '' })),
    contacts,
    extraRequest
  });

  const skipSave = useRef(true);
  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    if (!onSaveDraft || currentStep === 'success' || currentStep === 'intro') return;
    if ((init.status as string) && init.status !== 'draft') return;
    const timer = window.setTimeout(() => {
      void onSaveDraft(collectPayload(currentStep));
    }, 800);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentStep,
    selectedSiteType,
    selectedPurposes,
    selectedCategory,
    customCategoryInput,
    siteName,
    brandName,
    phone,
    email,
    location,
    businessDesc,
    existingUrl,
    menuItems,
    selectedStyle,
    selectedColorPalette,
    customPrimaryColor,
    customSecondaryColor,
    referenceUrls,
    selectedFeatures,
    contacts,
    extraRequest
  ]);

  const handleTogglePurpose = (id: string) => {
    if (selectedPurposes.includes(id)) {
      if (selectedPurposes.length > 1) {
        setSelectedPurposes(selectedPurposes.filter((p) => p !== id));
      }
    } else {
      setSelectedPurposes([...selectedPurposes, id]);
    }
  };

  // Filtered categories
  const filteredCategories = useMemo(() => {
    if (!categorySearchQuery.trim()) return CATEGORY_LIST;
    return CATEGORY_LIST.filter((cat) =>
      cat.toLowerCase().includes(categorySearchQuery.toLowerCase().trim())
    );
  }, [categorySearchQuery]);

  // AI Structure Generator based on selected siteType & category
  const generateAiStructure = (siteType: string, category: string) => {
    setIsAiRegenerating(true);
    setTimeout(() => {
      let recommended: MenuItem[] = [];

      if (siteType === 'travel' || category === '여행') {
        recommended = [
          { id: `m-${Date.now()}-1`, title: 'HOME', isSubItem: false },
          { id: `m-${Date.now()}-2`, title: '풀빌라 / 숙소', isSubItem: false },
          { id: `m-${Date.now()}-3`, title: '막탄 풀빌라', isSubItem: true, parentTitle: '풀빌라 / 숙소' },
          { id: `m-${Date.now()}-4`, title: '세부시티 풀빌라', isSubItem: true, parentTitle: '풀빌라 / 숙소' },
          { id: `m-${Date.now()}-5`, title: '투어 & 액티비티', isSubItem: false },
          { id: `m-${Date.now()}-6`, title: '요금안내', isSubItem: false },
          { id: `m-${Date.now()}-7`, title: '여행 꿀팁 가이드', isSubItem: false },
          { id: `m-${Date.now()}-8`, title: '이용후기', isSubItem: false },
          { id: `m-${Date.now()}-9`, title: 'FAQ & 공지', isSubItem: false },
          { id: `m-${Date.now()}-10`, title: '실시간 예약문의', isSubItem: false }
        ];
      } else if (siteType === 'professional' || category === '병원' || category === '법률') {
        recommended = [
          { id: `m-${Date.now()}-1`, title: 'HOME', isSubItem: false },
          { id: `m-${Date.now()}-2`, title: '전문가 소개', isSubItem: false },
          { id: `m-${Date.now()}-3`, title: '주요 업무분야 / 진료과목', isSubItem: false },
          { id: `m-${Date.now()}-4`, title: '성공사례 / 전후사진', isSubItem: false },
          { id: `m-${Date.now()}-5`, title: '비용 및 절차 안내', isSubItem: false },
          { id: `m-${Date.now()}-6`, title: '오시는 길 & 진료시간', isSubItem: false },
          { id: `m-${Date.now()}-7`, title: '1:1 비밀 상담신청', isSubItem: false }
        ];
      } else if (siteType === 'cpa_landing' || siteType === 'local_service') {
        recommended = [
          { id: `m-${Date.now()}-1`, title: 'HOME (Hero 메인)', isSubItem: false },
          { id: `m-${Date.now()}-2`, title: '서비스 소개', isSubItem: false },
          { id: `m-${Date.now()}-3`, title: '가격 및 패키지', isSubItem: false },
          { id: `m-${Date.now()}-4`, title: '실제 작업/시공 갤러리', isSubItem: false },
          { id: `m-${Date.now()}-5`, title: '고객 만족 후기', isSubItem: false },
          { id: `m-${Date.now()}-6`, title: '자주 묻는 질문', isSubItem: false },
          { id: `m-${Date.now()}-7`, title: '무료 견적/상담 신청', isSubItem: false }
        ];
      } else if (siteType === 'info_blog' || siteType === 'seo_affiliate') {
        recommended = [
          { id: `m-${Date.now()}-1`, title: 'HOME', isSubItem: false },
          { id: `m-${Date.now()}-2`, title: '메인 가이드', isSubItem: false },
          { id: `m-${Date.now()}-3`, title: '추천 비교 Top 10', isSubItem: false },
          { id: `m-${Date.now()}-4`, title: '심층 솔직 리뷰', isSubItem: false },
          { id: `m-${Date.now()}-5`, title: '할인 프로모션 / 쿠폰', isSubItem: false },
          { id: `m-${Date.now()}-6`, title: '초보자 팁', isSubItem: false },
          { id: `m-${Date.now()}-7`, title: '문의 및 제휴', isSubItem: false }
        ];
      } else {
        recommended = [
          { id: `m-${Date.now()}-1`, title: 'HOME', isSubItem: false },
          { id: `m-${Date.now()}-2`, title: '회사소개', isSubItem: false },
          { id: `m-${Date.now()}-3`, title: '주요 사업 및 솔루션', isSubItem: false },
          { id: `m-${Date.now()}-4`, title: '포트폴리오', isSubItem: false },
          { id: `m-${Date.now()}-5`, title: '고객지원 & FAQ', isSubItem: false },
          { id: `m-${Date.now()}-6`, title: '온라인 문의', isSubItem: false }
        ];
      }

      setMenuItems(recommended);
      setIsAiRegenerating(false);
    }, 500);
  };

  const moveMenuItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= menuItems.length) return;
    const updated = [...menuItems];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setMenuItems(updated);
  };

  const deleteMenuItem = (id: string) => {
    if (menuItems.length <= 2) {
      alert('최소 2개 이상의 메뉴 항목이 필요합니다.');
      return;
    }
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  const handleAddMenuItem = () => {
    if (!newMenuTitle.trim()) return;
    const newItem: MenuItem = {
      id: `m-custom-${Date.now()}`,
      title: newMenuTitle.trim(),
      isSubItem: newMenuIsSub
    };
    setMenuItems([...menuItems, newItem]);
    setNewMenuTitle('');
    setNewMenuIsSub(false);
  };

  const handleUpdateMenuTitle = (id: string, newTitle: string) => {
    setMenuItems(
      menuItems.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  // Final Submit Action after Step 8
  const handleFinalSubmit = () => {
    void Promise.resolve(onSubmitOrder(collectPayload('step9'))).then(() => {
      setCurrentStep('success');
    });
  };

  // Helper for Step Number calculation
  const stepNumberMap: Record<WizardStep, number> = {
    intro: 0,
    step1: 1,
    step2: 2,
    step3: 3,
    step4: 4,
    step5: 5,
    step6: 6,
    step7: 7,
    step8: 8,
    step9: 9,
    success: 10
  };
  const currentStepNum = stepNumberMap[currentStep];
  const totalSteps = 9;

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-xs">
      {/* 8-Step Progress Header (Visible on step1 ~ step8) */}
      {currentStep !== 'intro' && currentStep !== 'success' && (
        <div className="mb-8 pb-6 border-b border-[#E2E8F0] space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <span className="px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] font-bold text-xs border border-[#DBEAFE] shrink-0">
                STEP {currentStepNum} / {totalSteps}
              </span>
              <h2 className="text-sm font-bold text-[#0F172A] truncate">
                {currentStep === 'step1' && '홈페이지 종류 선택'}
                {currentStep === 'step2' && '홈페이지 목적 설정'}
                {currentStep === 'step3' && '업종 카테고리'}
                {currentStep === 'step4' && '기본 정보 입력'}
                {currentStep === 'step5' && '추천 메뉴구조 & Silo 기획'}
                {currentStep === 'step6' && '디자인 스타일 & 브랜드 컬러'}
                {currentStep === 'step7' && '필요한 기능 선택'}
                {currentStep === 'step8' && '제작 자료 업로드 센터'}
                {currentStep === 'step9' && '최종 확인 및 제작 요청'}
              </h2>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {saveStatus === 'saving' ? (
                <span className="text-xs font-bold text-[#64748B]">저장 중...</span>
              ) : saveStatus === 'saved' ? (
                <span className="text-xs font-bold text-[#10B981]">✓ 자동 저장됨</span>
              ) : null}
              <span className="text-xs font-bold text-[#2563EB]">
                {Math.round((currentStepNum / totalSteps) * 100)}% 진행
              </span>
            </div>
          </div>

          <div className="w-full bg-[#F1F5F9] rounded-full h-2 overflow-hidden">
            <div
              className="bg-[#2563EB] h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStepNum / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 0. INTRO SCREEN */}
      {/* ========================================================================= */}
      {currentStep === 'intro' && (
        <div className="max-w-2xl mx-auto py-8 text-center space-y-8 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-3xl bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] flex items-center justify-center mx-auto shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F1F5F9] text-[#475569] text-xs font-bold border border-[#E2E8F0]">
              <FileCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>초보자 맞춤형 쉬운 기획 위저드</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">
              나에게 맞는 홈페이지 만들기
            </h1>

            <p className="text-sm sm:text-base text-[#64748B] leading-relaxed max-w-lg mx-auto">
              전문적인 지식이 없어도 괜찮습니다.<br />
              몇 가지 질문에 답하면 <strong className="text-[#2563EB]">SEO SYSTEM 300</strong>이
              구글 상위노출에 최적화된 홈페이지 구조와 자료를 알아서 정리해드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <span>예상 소요시간</span>
              </div>
              <p className="text-xs text-[#64748B]">약 5~10분 (간단 답변)</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <Layers className="w-4 h-4 text-[#2563EB]" />
                <span>업종별 메뉴 & 기능 추천</span>
              </div>
              <p className="text-xs text-[#64748B]">업종별 Silo 및 기능 자동선정</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F172A]">
                <UploadCloud className="w-4 h-4 text-[#10B981]" />
                <span>올인원 자료 제출</span>
              </div>
              <p className="text-xs text-[#64748B]">별도 전송 없이 플랫폼 접수</p>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-5 h-5" />}
              onClick={() => setCurrentStep('step1')}
              className="w-full sm:w-auto px-8 py-3.5 text-sm font-bold shadow-xs bg-[#2563EB] hover:bg-blue-700"
            >
              홈페이지 기획 시작하기
            </Button>
            {onCancel && (
              <Button variant="ghost" size="md" onClick={onCancel} className="text-xs text-[#64748B]">
                닫기 / 목록으로
              </Button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. STEP 1: 홈페이지 종류 */}
      {/* ========================================================================= */}
      {currentStep === 'step1' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              어떤 홈페이지를 만들고 싶으세요?
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              만들고자 하는 웹사이트의 가장 가까운 형태를 선택해주세요. (1개 선택)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SITE_TYPE_OPTIONS.map((item) => {
              const isSelected = selectedSiteType === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedSiteType(item.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20 shadow-xs'
                      : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/50 hover:bg-[#F8FAFC]'
                  }`}
                >
                  {item.badge && (
                    <span className="absolute top-4 right-4 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#2563EB] text-white">
                      {item.badge}
                    </span>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#2563EB]'
                      }`}
                    >
                      {item.icon}
                    </div>

                    <div className="min-w-0 pr-6">
                      <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-xs text-[#64748B] mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9]">
                    <span className="text-[11px] font-semibold text-[#64748B]">
                      {isSelected ? '선택됨' : '선택하기'}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'border border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wizard-cta-bar">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep('intro')}
            >
              이전 (인트로)
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setCurrentStep('step2')}
              disabled={!selectedSiteType}
            >
              다음: 목적 선택하기
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STEP 2: 홈페이지 목적 */}
      {/* ========================================================================= */}
      {currentStep === 'step2' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                홈페이지의 가장 중요한 목적은 무엇인가요?
              </h3>
              <span className="text-xs text-[#2563EB] font-bold">복수 선택 가능 ({selectedPurposes.length}개 선택)</span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B]">
              가장 집중하고 싶은 전환 목표를 선택해주시면 해당 CTA를 우선 배치합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {PURPOSE_OPTIONS.map((item) => {
              const isSelected = selectedPurposes.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleTogglePurpose(item.id)}
                  className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/15'
                      : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/40 hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#2563EB]'
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A]">{item.label}</span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md flex items-center justify-center text-xs transition-colors ${
                      isSelected
                        ? 'bg-[#2563EB] text-white'
                        : 'border-2 border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="wizard-cta-bar">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep('step1')}
            >
              이전 단계
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setCurrentStep('step3')}
              disabled={selectedPurposes.length === 0}
            >
              다음: 업종 선택하기
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. STEP 3: 업종 선택 */}
      {/* ========================================================================= */}
      {currentStep === 'step3' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              어떤 업종의 홈페이지인가요?
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              카테고리를 검색하거나 선택하고, 직접 입력을 통해 세부 업종을 기재할 수 있습니다.
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              placeholder="업종명 검색 (예: 여행, 부동산, 법률, 청소, 인테리어...)"
              className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-2xl focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden bg-white"
            />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-[#64748B] block">카테고리 선택</span>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => {
                const isSelected = selectedCategory === cat && !customCategoryInput.trim();

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setCustomCategoryInput('');
                    }}
                    className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-xs'
                        : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#334155] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
            <label className="block text-xs font-bold text-[#0F172A]">
              직접 입력하기 (선택한 카테고리 외 구체적인 세부 업종이 있을 경우)
            </label>
            <input
              type="text"
              value={customCategoryInput}
              onChange={(e) => setCustomCategoryInput(e.target.value)}
              placeholder="예: 필리핀 세부 독채 풀빌라 큐레이션 및 호핑투어"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:outline-hidden bg-white"
            />
          </div>

          <div className="wizard-cta-bar">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep('step2')}
            >
              이전 단계
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setCurrentStep('step4')}
            >
              다음: 기본정보 입력
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. STEP 4: 기본 정보 입력 */}
      {/* ========================================================================= */}
      {currentStep === 'step4' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="space-y-1">
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              웹사이트 기본 정보를 입력해주세요
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B]">
              홈페이지 헤더, 푸터, 메타태그 및 스키마 구조화 데이터에 자동 적용될 기본 사항입니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                사이트명 <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="예: 세부 트립 풀빌라 앤 리조트"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                회사 / 브랜드명 <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="예: (주)트립커넥트 또는 세부트립"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                대표 연락처 <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678 또는 카카오 채널"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                이메일 <span className="text-[#EF4444]">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@yourdomain.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white font-mono"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                지역 (오프라인 위치 또는 주요 서비스 타겟 지역)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 필리핀 세부 / 서울 강남구 / 전국 대상"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                간단한 사업소개 <span className="text-[#EF4444]">*</span>
              </label>
              <textarea
                value={businessDesc}
                onChange={(e) => setBusinessDesc(e.target.value)}
                rows={3}
                placeholder="예: 필리핀 세부 막탄 지역의 독채 풀빌라 및 프라이빗 호핑투어, 픽업샌딩 예약 전문 여행사입니다."
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0F172A] mb-1.5">
                기존 홈페이지 또는 벤치마킹 참고 URL (선택)
              </label>
              <input
                type="url"
                value={existingUrl}
                onChange={(e) => setExistingUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white font-mono"
              />
            </div>
          </div>

          <div className="wizard-cta-bar">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep('step3')}
            >
              이전 단계
            </Button>
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => {
                generateAiStructure(selectedSiteType, customCategoryInput || selectedCategory);
                setCurrentStep('step5');
              }}
              disabled={!siteName.trim() || !businessDesc.trim()}
            >
              AI 추천 메뉴구조 생성하기 →
            </Button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. STEP 5: 홈페이지 구조 & AI 추천 메뉴 */}
      {/* ========================================================================= */}
      {currentStep === 'step5' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
                  AI 추천 홈페이지 Silo 구조
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B]">
                앞서 입력하신 정보({siteName} / {customCategoryInput || selectedCategory})를 바탕으로 구글 상위노출에 최적화된 메뉴 구조를 생성했습니다.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 text-[#2563EB] ${isAiRegenerating ? 'animate-spin' : ''}`} />}
              onClick={() => generateAiStructure(selectedSiteType, customCategoryInput || selectedCategory)}
              disabled={isAiRegenerating}
            >
              다시 추천받기
            </Button>
          </div>

          <div className="p-4 rounded-2xl bg-[#EFF6FF] border border-[#DBEAFE] flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1E40AF]">구글 친화적 Silo 카테고리 아키텍처</h4>
                <p className="text-[11px] text-[#1E3A8A] mt-0.5">
                  내부 링크(Internal Linking) 가중치와 검색 크롤러 탐색 효율을 극대화한 추천 구조입니다.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsEditingMenu(!isEditingMenu)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                isEditingMenu
                  ? 'bg-[#2563EB] text-white'
                  : 'bg-white text-[#2563EB] border border-[#DBEAFE] hover:bg-[#EFF6FF]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingMenu ? '수정 완료' : '직접 수정'}</span>
            </button>
          </div>

          <div className="space-y-2 bg-[#F8FAFC] p-5 rounded-3xl border border-[#E2E8F0]">
            <div className="flex items-center justify-between pb-2 text-xs font-bold text-[#64748B] border-b border-[#E2E8F0]">
              <span>추천 메뉴 및 하위 구조 ({menuItems.length}개)</span>
              <span>순서 변경 / 하위메뉴 설정</span>
            </div>

            {menuItems.map((item, idx) => (
              <div
                key={item.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 bg-white ${
                  item.isSubItem
                    ? 'ml-6 sm:ml-8 border-l-4 border-l-[#2563EB] border-[#E2E8F0]'
                    : 'border-[#E2E8F0] shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="text-[#94A3B8] cursor-grab">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <span className="text-xs font-mono font-bold text-[#94A3B8] w-5">
                    {idx + 1}
                  </span>

                  {item.isSubItem && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] shrink-0">
                      하위메뉴
                    </span>
                  )}

                  {isEditingMenu ? (
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleUpdateMenuTitle(item.id, e.target.value)}
                      className="px-2.5 py-1 text-xs font-bold border border-[#2563EB] rounded-lg bg-[#EFF6FF]/20 flex-1 max-w-sm"
                    />
                  ) : (
                    <span className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                      {item.title}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isEditingMenu && (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuItems(
                          menuItems.map((m) =>
                            m.id === item.id ? { ...m, isSubItem: !m.isSubItem } : m
                          )
                        );
                      }}
                      className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-colors cursor-pointer ${
                        item.isSubItem
                          ? 'bg-[#EFF6FF] text-[#2563EB] border-[#DBEAFE]'
                          : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]'
                      }`}
                    >
                      {item.isSubItem ? '메인으로' : '하위로'}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => moveMenuItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-30 cursor-pointer text-[#64748B]"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveMenuItem(idx, 'down')}
                    disabled={idx === menuItems.length - 1}
                    className="p-1 rounded-lg hover:bg-[#F1F5F9] disabled:opacity-30 cursor-pointer text-[#64748B]"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isEditingMenu && (
                    <button
                      type="button"
                      onClick={() => deleteMenuItem(item.id)}
                      className="p-1 rounded-lg hover:bg-rose-50 text-rose-500 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {isEditingMenu && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  placeholder="새 메뉴명 입력..."
                  className="px-3 py-2 text-xs border border-[#E2E8F0] rounded-xl bg-white flex-1"
                />
                <label className="flex items-center gap-1.5 text-xs text-[#64748B] shrink-0 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newMenuIsSub}
                    onChange={(e) => setNewMenuIsSub(e.target.checked)}
                    className="rounded text-[#2563EB]"
                  />
                  <span>하위 메뉴로 추가</span>
                </label>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  onClick={handleAddMenuItem}
                >
                  추가
                </Button>
              </div>
            )}
          </div>

          <div className="wizard-cta-bar flex-wrap gap-3">
            <Button
              variant="outline"
              size="md"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => setCurrentStep('step4')}
            >
              이전 (기본정보)
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="lg"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => setCurrentStep('step6')}
                className="bg-[#2563EB] hover:bg-blue-700 font-bold px-6"
              >
                다음: 디자인 스타일 & 컬러 선택 →
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. STEP 6: 디자인 스타일 & 브랜드 컬러 */}
      {/* ========================================================================= */}
      {currentStep === 'step6' && (
        <WizardStep6Design
          selectedStyle={selectedStyle}
          setSelectedStyle={setSelectedStyle}
          selectedColorPalette={selectedColorPalette}
          setSelectedColorPalette={setSelectedColorPalette}
          customPrimaryColor={customPrimaryColor}
          setCustomPrimaryColor={setCustomPrimaryColor}
          customSecondaryColor={customSecondaryColor}
          setCustomSecondaryColor={setCustomSecondaryColor}
          referenceUrls={referenceUrls}
          setReferenceUrls={setReferenceUrls}
          onPrev={() => setCurrentStep('step5')}
          onNext={() => setCurrentStep('step7')}
        />
      )}

      {/* ========================================================================= */}
      {/* 7. STEP 7: 필요한 기능 선택 (규칙 기반 추천) */}
      {/* ========================================================================= */}
      {currentStep === 'step7' && (
        <WizardStep7Features
          selectedFeatures={selectedFeatures}
          setSelectedFeatures={setSelectedFeatures}
          siteType={selectedSiteType}
          category={customCategoryInput || selectedCategory}
          onPrev={() => setCurrentStep('step6')}
          onNext={() => setCurrentStep('step8')}
        />
      )}

      {/* ========================================================================= */}
      {/* 8. STEP 8: 홈페이지 제작 자료 업로드 센터 */}
      {/* ========================================================================= */}
      {currentStep === 'step8' && (
        <WizardStep8UploadCenter
          onPrev={() => setCurrentStep('step7')}
          onSubmitFinal={() => setCurrentStep('step9')}
          files={files}
          uploading={uploading}
          uploadProgress={uploadProgress}
          uploadError={uploadError}
          onUploadFiles={onUploadFiles}
          onDeleteFile={onDeleteFile}
          onUpdateFileMemo={onUpdateFileMemo}
          onReplaceFile={onReplaceFile}
          contacts={contacts}
          setContacts={setContacts}
        />
      )}

      {currentStep === 'step9' && (
        <WizardStep9Review
          siteType={selectedSiteType}
          purposes={selectedPurposes}
          industry={customCategoryInput.trim() || selectedCategory}
          siteName={siteName}
          brandName={brandName}
          phone={phone}
          email={email}
          region={location}
          businessDesc={businessDesc}
          designStyle={selectedStyle}
          colorPreset={selectedColorPalette}
          customPrimaryColor={customPrimaryColor}
          customSecondaryColor={customSecondaryColor}
          references={referenceUrls.filter(Boolean).map((url) => ({ url }))}
          menus={menuItems}
          features={selectedFeatures}
          filesCount={(files || []).length}
          materialsPercent={
            files && files.length
              ? Math.round(
                  (new Set(files.map((f) => f.categoryId)).size / 10) * 100
                )
              : 0
          }
          extraRequest={extraRequest}
          setExtraRequest={setExtraRequest}
          contacts={contacts}
          onEdit={(step) => setCurrentStep(step)}
          onPrev={() => setCurrentStep('step8')}
          onSubmit={handleFinalSubmit}
        />
      )}

      {/* ========================================================================= */}
      {/* 9. SUCCESS SCREEN */}
      {/* ========================================================================= */}
      {currentStep === 'success' && (
        <div className="max-w-xl mx-auto py-10 text-center space-y-6 animate-in fade-in duration-200">
          <div className="w-16 h-16 rounded-3xl bg-[#ECFDF5] text-[#10B981] border border-[#A7F3D0] flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
              접수 완료
            </span>
            <h2 className="text-2xl font-black text-[#0F172A]">
              기획 & 자료 완비 주문서가 성공적으로 접수되었습니다!
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed max-w-md mx-auto">
              SEO SYSTEM 300 전담 퍼블리싱팀이 위저드에서 전달된 8단계 기획서와 업로드 자료를 바탕으로
              구글 상위노출 고속 테마 셋업을 시작합니다.
            </p>
          </div>

          {/* Submission Info Card */}
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-left text-xs space-y-2.5">
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">주문번호:</span>
              <span className="font-bold text-[#0F172A]">
                {(init.orderNo as string) || '접수 처리 중'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">사이트명:</span>
              <span className="font-bold text-[#0F172A]">{siteName}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">디자인 스타일 & 컬러:</span>
              <span className="font-bold text-[#2563EB]">{selectedStyle} / {selectedColorPalette}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">선택된 핵심 기능:</span>
              <span className="font-bold text-[#0F172A]">{selectedFeatures.length}개 적용</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">담당 퍼블리셔:</span>
              <span className="font-bold text-[#2563EB]">SEO SYSTEM 300 제작팀</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-[#64748B]">예상 제작 소요기간:</span>
              <span className="font-bold text-[#10B981]">접수 후 3~5영업일 이내</span>
            </div>
          </div>

          <div className="pt-2 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                if (onCancel) onCancel();
              }}
              className="bg-[#2563EB] hover:bg-blue-700"
            >
              제작현황 타임라인 확인하기 →
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
