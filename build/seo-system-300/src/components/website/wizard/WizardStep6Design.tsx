import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Pipette,
  Eye,
  HelpCircle,
  Layers,
  Palette
} from 'lucide-react';
import { Button } from '../../common/Button';

export interface DesignStyleOption {
  id: string;
  title: string;
  desc: string;
  previewBg: string;
  accentColor: string;
  badge?: string;
  uiMock: {
    headerColor: string;
    heroStyle: string;
    cardBorder: string;
    tagText: string;
  };
}

export const DESIGN_STYLES: DesignStyleOption[] = [
  {
    id: 'clean_professional',
    title: '깔끔하고 전문적인',
    desc: '신뢰감을 주는 네이비/블루 포인트와 단정한 그리드 레이아웃',
    previewBg: 'bg-slate-50',
    accentColor: '#2563EB',
    badge: '추천 No.1',
    uiMock: {
      headerColor: 'bg-white border-b border-slate-200',
      heroStyle: 'bg-gradient-to-r from-blue-900 to-slate-900 text-white',
      cardBorder: 'border-slate-200 bg-white',
      tagText: '신뢰도 99% 기업형'
    }
  },
  {
    id: 'luxury_premium',
    title: '고급스러운',
    desc: '세련된 골드/샴페인 톤과 우아한 여백, 프리미엄 브랜딩',
    previewBg: 'bg-stone-900',
    accentColor: '#EAB308',
    badge: '호텔/전문직',
    uiMock: {
      headerColor: 'bg-stone-950 border-b border-stone-800 text-stone-200',
      heroStyle: 'bg-gradient-to-b from-stone-900 to-black text-amber-100',
      cardBorder: 'border-amber-500/30 bg-stone-900 text-stone-200',
      tagText: '하이엔드 럭셔리'
    }
  },
  {
    id: 'bright_friendly',
    title: '밝고 친근한',
    desc: '부드러운 라운드 코너와 따뜻한 파스텔, 직관적인 비주얼',
    previewBg: 'bg-amber-50/50',
    accentColor: '#10B981',
    uiMock: {
      headerColor: 'bg-white/90 border-b border-emerald-100',
      heroStyle: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white',
      cardBorder: 'border-emerald-100 bg-white shadow-xs',
      tagText: '친근한 소통형'
    }
  },
  {
    id: 'strong_marketing',
    title: '강력한 마케팅형',
    desc: '시선을 사로잡는 볼드 헤드라인과 즉시 문의/예약 고전환 CTA',
    previewBg: 'bg-slate-900',
    accentColor: '#F97316',
    badge: 'CPA/DB수집',
    uiMock: {
      headerColor: 'bg-slate-900 border-b border-slate-800 text-white',
      heroStyle: 'bg-gradient-to-r from-orange-600 to-rose-600 text-white font-black',
      cardBorder: 'border-orange-500/30 bg-slate-800 text-white',
      tagText: '전환율 극대화'
    }
  },
  {
    id: 'minimal',
    title: 'Minimal',
    desc: '군더더기 없는 광활한 화이트스페이스와 미니멀 폰트 위계',
    previewBg: 'bg-white',
    accentColor: '#0F172A',
    uiMock: {
      headerColor: 'bg-white border-b border-slate-100',
      heroStyle: 'bg-white text-slate-900 border border-slate-100',
      cardBorder: 'border-slate-100 bg-slate-50/50',
      tagText: '모던 미니멀'
    }
  },
  {
    id: 'dark_premium',
    title: 'Dark Premium',
    desc: '모던한 딥 다크 캔버스에 네온/사이버 블루 포인트 효과',
    previewBg: 'bg-slate-950',
    accentColor: '#38BDF8',
    uiMock: {
      headerColor: 'bg-slate-900 border-b border-slate-800',
      heroStyle: 'bg-slate-900 border border-sky-500/30 text-white',
      cardBorder: 'border-slate-800 bg-slate-900 text-slate-300',
      tagText: '테크 & 트렌디'
    }
  },
  {
    id: 'colorful',
    title: 'Colorful',
    desc: '생동감 넘치는 트렌디 그라데이션과 감각적인 크리에이티브',
    previewBg: 'bg-violet-50/40',
    accentColor: '#8B5CF6',
    uiMock: {
      headerColor: 'bg-white border-b border-purple-100',
      heroStyle: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white',
      cardBorder: 'border-purple-100 bg-white',
      tagText: '감각적 비주얼'
    }
  },
  {
    id: 'dont_know',
    title: '잘 모르겠어요',
    desc: '선택한 업종과 타겟층에 맞게 SEO SYSTEM 300이 가장 적합한 테마로 자동 기획',
    previewBg: 'bg-slate-50',
    accentColor: '#64748B',
    badge: '전문가 위임',
    uiMock: {
      headerColor: 'bg-white border-b border-slate-200',
      heroStyle: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
      cardBorder: 'border-slate-200 bg-white',
      tagText: '전문가 맞춤 선정'
    }
  }
];

export interface ColorPaletteOption {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  meaning: string;
}

export const COLOR_PALETTES: ColorPaletteOption[] = [
  {
    id: 'blue_white',
    name: 'Blue / White',
    primary: '#2563EB',
    secondary: '#1E293B',
    accent: '#EFF6FF',
    meaning: '신뢰, 안정, 스마트한 전문성'
  },
  {
    id: 'black_gold',
    name: 'Black / Gold',
    primary: '#0F172A',
    secondary: '#EAB308',
    accent: '#FEF08A',
    meaning: '럭셔리, 프리미엄, 고급 브랜드'
  },
  {
    id: 'green_white',
    name: 'Green / White',
    primary: '#10B981',
    secondary: '#064E3B',
    accent: '#ECFDF5',
    meaning: '친환경, 힐링, 건강/의료'
  },
  {
    id: 'orange_dark',
    name: 'Orange / Dark',
    primary: '#F97316',
    secondary: '#1E293B',
    accent: '#FFF7ED',
    meaning: '활력, 빠른 전환, 다이내믹'
  },
  {
    id: 'purple_white',
    name: 'Purple / White',
    primary: '#8B5CF6',
    secondary: '#4C1D95',
    accent: '#F5F3FF',
    meaning: '크리에이티브, 뷰티, 감성'
  },
  {
    id: 'custom',
    name: '직접 선택',
    primary: '#3B82F6',
    secondary: '#1E293B',
    accent: '#F1F5F9',
    meaning: '원하는 브랜드 헥스(Hex) 컬러 직접 지정'
  }
];

export interface WizardStep6DesignProps {
  selectedStyle: string;
  setSelectedStyle: (val: string) => void;
  selectedColorPalette: string;
  setSelectedColorPalette: (val: string) => void;
  customPrimaryColor: string;
  setCustomPrimaryColor: (val: string) => void;
  customSecondaryColor: string;
  setCustomSecondaryColor: (val: string) => void;
  referenceUrls: string[];
  setReferenceUrls: (urls: string[]) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const WizardStep6Design: React.FC<WizardStep6DesignProps> = ({
  selectedStyle,
  setSelectedStyle,
  selectedColorPalette,
  setSelectedColorPalette,
  customPrimaryColor,
  setCustomPrimaryColor,
  customSecondaryColor,
  setCustomSecondaryColor,
  referenceUrls,
  setReferenceUrls,
  onPrev,
  onNext
}) => {
  const [newUrlInput, setNewUrlInput] = useState('');
  const [isNoRefSites, setIsNoRefSites] = useState(referenceUrls.length === 0);

  const handleAddUrl = () => {
    if (!newUrlInput.trim()) return;
    setReferenceUrls([...referenceUrls, newUrlInput.trim()]);
    setNewUrlInput('');
    setIsNoRefSites(false);
  };

  const handleRemoveUrl = (index: number) => {
    setReferenceUrls(referenceUrls.filter((_, i) => i !== index));
  };

  const handleToggleNoRefSites = () => {
    if (!isNoRefSites) {
      setIsNoRefSites(true);
      setReferenceUrls([]);
    } else {
      setIsNoRefSites(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Design Visual Style Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              어떤 느낌의 홈페이지를 원하세요?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B]">
            실제 사이트 레이아웃 감성을 미리 확인하고 선호하는 디자인 스타일을 선택해주세요. (1개 선택)
          </p>
        </div>

        {/* Visual Style Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DESIGN_STYLES.map((style) => {
            const isSelected = selectedStyle === style.id;

            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyle(style.id)}
                className={`rounded-3xl border transition-all cursor-pointer overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EFF6FF]/40 ring-2 ring-[#2563EB]/20 shadow-xs'
                    : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/40 hover:shadow-xs'
                }`}
              >
                {/* Visual Site Mini Preview */}
                <div className={`p-3 border-b border-slate-100 ${style.previewBg}`}>
                  <div className="rounded-xl overflow-hidden border border-slate-200/80 shadow-2xs space-y-1.5 p-2 bg-white text-[10px]">
                    {/* Mock Browser Header */}
                    <div className={`p-1.5 rounded-lg flex items-center justify-between ${style.uiMock.headerColor}`}>
                      <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      </div>
                      <span className="font-bold text-[9px] truncate max-w-[80px]">{style.uiMock.tagText}</span>
                    </div>

                    {/* Mock Hero Area */}
                    <div className={`p-3 rounded-lg text-center font-bold ${style.uiMock.heroStyle}`}>
                      <div className="text-[10px] truncate">헤드라인 비주얼</div>
                      <div className="mt-1 inline-block px-2 py-0.5 rounded-md bg-white/20 text-[8px]">
                        CTA 버튼
                      </div>
                    </div>

                    {/* Mock Card Row */}
                    <div className="grid grid-cols-2 gap-1 pt-0.5">
                      <div className={`p-1.5 rounded-md border text-[8px] ${style.uiMock.cardBorder}`}>
                        특징 01
                      </div>
                      <div className={`p-1.5 rounded-md border text-[8px] ${style.uiMock.cardBorder}`}>
                        특징 02
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Text & Status */}
                <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
                        {style.title}
                      </h4>
                      {style.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-[#EFF6FF] text-[#2563EB] shrink-0 border border-[#DBEAFE]">
                          {style.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed line-clamp-2">
                      {style.desc}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                    <span className="text-[11px] font-bold text-[#64748B]">
                      {isSelected ? '선택됨' : '선택하기'}
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'border border-[#CBD5E1] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Brand Color Palette Selection */}
      <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Pipette className="w-4 h-4 text-[#2563EB]" />
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
              브랜드 대표 컬러 선택
            </h3>
          </div>
          <p className="text-xs text-[#64748B]">
            홈페이지의 포인트 컬러 및 로고/버튼에 일관되게 적용될 팔레트를 지정합니다.
          </p>
        </div>

        {/* Palette Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {COLOR_PALETTES.map((palette) => {
            const isSelected = selectedColorPalette === palette.id;

            return (
              <div
                key={palette.id}
                onClick={() => setSelectedColorPalette(palette.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/20 shadow-xs'
                    : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/40'
                }`}
              >
                {/* Swatches */}
                <div className="flex items-center gap-1">
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-2xs"
                    style={{
                      backgroundColor:
                        palette.id === 'custom' ? customPrimaryColor : palette.primary
                    }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-2xs -ml-1.5"
                    style={{
                      backgroundColor:
                        palette.id === 'custom' ? customSecondaryColor : palette.secondary
                    }}
                  />
                  <div
                    className="w-5 h-5 rounded-full border border-black/10 shadow-2xs -ml-1.5"
                    style={{ backgroundColor: palette.accent }}
                  />
                </div>

                <div>
                  <h5 className="text-xs font-bold text-[#0F172A]">{palette.name}</h5>
                  <p className="text-[10px] text-[#64748B] truncate mt-0.5">{palette.meaning}</p>
                </div>

                <div className="flex justify-end">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'bg-[#2563EB] text-white'
                        : 'border border-[#CBD5E1] bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Color Picker UI (Shown when 'custom' is selected) */}
        {selectedColorPalette === 'custom' && (
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3 animate-in fade-in duration-150">
            <h5 className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
              <Pipette className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>직접 컬러 커스텀 지정</span>
            </h5>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#64748B]">
                  메인 포인트 컬러 (Primary)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customPrimaryColor}
                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-[#E2E8F0] cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={customPrimaryColor}
                    onChange={(e) => setCustomPrimaryColor(e.target.value)}
                    placeholder="#2563EB"
                    className="px-3 py-2 text-xs font-mono font-bold border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white flex-1"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-[#64748B]">
                  서브 텍스트/헤더 컬러 (Secondary)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customSecondaryColor}
                    onChange={(e) => setCustomSecondaryColor(e.target.value)}
                    className="w-9 h-9 rounded-xl border border-[#E2E8F0] cursor-pointer p-0.5 bg-white"
                  />
                  <input
                    type="text"
                    value={customSecondaryColor}
                    onChange={(e) => setCustomSecondaryColor(e.target.value)}
                    placeholder="#1E293B"
                    className="px-3 py-2 text-xs font-mono font-bold border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white flex-1"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Reference Sites Section */}
      <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
        <div className="space-y-1">
          <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
            좋아하는 홈페이지나 벤치마킹 사이트가 있나요?
          </h3>
          <p className="text-xs text-[#64748B]">
            디자인, 폰트, 구성 등을 참고할 수 있는 URL을 등록해주시면 퍼블리셔가 적극 반영합니다.
          </p>
        </div>

        {/* Quick 'No Ref' checkbox toggle */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-xs font-bold text-[#0F172A] cursor-pointer">
            <input
              type="checkbox"
              checked={isNoRefSites}
              onChange={handleToggleNoRefSites}
              className="rounded text-[#2563EB] focus:ring-[#2563EB]"
            />
            <span>없음 (SYSTEM 300 전담팀의 업종별 최적화 추천 템플릿 사용)</span>
          </label>
        </div>

        {!isNoRefSites && (
          <div className="space-y-3">
            {/* URL Input Bar */}
            <div className="flex items-center gap-2">
              <input
                type="url"
                value={newUrlInput}
                onChange={(e) => setNewUrlInput(e.target.value)}
                placeholder="https://example.com 또는 벤치마킹할 사이트 URL"
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm border border-[#E2E8F0] rounded-xl focus:ring-2 focus:ring-[#2563EB] bg-white font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddUrl();
                  }
                }}
              />
              <Button
                type="button"
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                onClick={handleAddUrl}
              >
                추가
              </Button>
            </div>

            {/* List of Added URLs */}
            {referenceUrls.length > 0 && (
              <div className="space-y-2">
                {referenceUrls.map((url, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-bold text-[#2563EB] font-mono">#{i + 1}</span>
                      <span className="font-mono text-[#0F172A] truncate">{url}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1 rounded-md hover:bg-white text-[#64748B] hover:text-[#2563EB]"
                        title="새 창에서 열기"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveUrl(i)}
                        className="p-1 rounded-md hover:bg-rose-50 text-rose-500"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="wizard-cta-bar">
        <Button
          variant="outline"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onPrev}
        >
          이전 (STEP 5 메뉴구조)
        </Button>
        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onNext}
          disabled={!selectedStyle}
        >
          다음: 필요한 기능 선택하기 →
        </Button>
      </div>
    </div>
  );
};
