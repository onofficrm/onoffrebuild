import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  FileText,
  PhoneCall,
  MessageCircle,
  Send,
  MessageSquare,
  Image,
  BookOpen,
  UserCheck,
  Calendar,
  CreditCard,
  Globe2,
  MapPin,
  Star,
  Layers,
  Smartphone,
  Mail,
  Zap,
  HelpCircle
} from 'lucide-react';
import { Button } from '../../common/Button';
import { recommendFeatureKeys } from '../../../services/featureRecommendService';

export interface FeatureOption {
  id: string;
  name: string;
  desc: string;
  category: 'contact' | 'content' | 'interactive' | 'marketing';
  icon: React.ReactNode;
  recommendedFor: string[]; // siteTypes or categories where this is recommended
}

export const ALL_FEATURES: FeatureOption[] = [
  {
    id: 'inquiry_form',
    name: '문의폼',
    desc: '고객 DB 수집 및 맞춤 견적 문의 양식 (이메일/SMS 실시간 발송)',
    category: 'contact',
    icon: <FileText className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['all', 'company', 'local_service', 'professional', 'cpa_landing']
  },
  {
    id: 'phone_call',
    name: '전화문의',
    desc: '모바일 원클릭 직통 전화걸기 플로팅 버튼 및 통화 전환 트래킹',
    category: 'contact',
    icon: <PhoneCall className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['local_service', 'professional', 'cpa_landing', 'travel']
  },
  {
    id: 'kakaotalk',
    name: '카카오톡',
    desc: '카카오톡 채널 실시간 1:1 상담 플로팅 위젯 연동',
    category: 'contact',
    icon: <MessageCircle className="w-5 h-5 text-[#F59E0B]" />,
    recommendedFor: ['all', 'travel', 'local_service', 'professional', 'shopping']
  },
  {
    id: 'telegram',
    name: 'Telegram',
    desc: '텔레그램 봇 자동 상담 및 채널 바로가기 링크',
    category: 'contact',
    icon: <Send className="w-5 h-5 text-[#0284C7]" />,
    recommendedFor: ['seo_affiliate', 'other']
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    desc: '해외/외국인 고객 타겟 실시간 왓츠앱 상담 위젯',
    category: 'contact',
    icon: <MessageSquare className="w-5 h-5 text-[#10B981]" />,
    recommendedFor: ['travel', 'seo_affiliate', 'multilingual']
  },
  {
    id: 'board',
    name: '게시판',
    desc: '공지사항, 자료실, 1:1 비밀 Q&A 게시판 시스템',
    category: 'content',
    icon: <Layers className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['company', 'shopping']
  },
  {
    id: 'gallery',
    name: '갤러리',
    desc: '고화질 시공/객실/제품 포트폴리오 반응형 갤러리 그리드',
    category: 'content',
    icon: <Image className="w-5 h-5 text-[#8B5CF6]" />,
    recommendedFor: ['travel', 'local_service', 'professional']
  },
  {
    id: 'blog',
    name: 'Blog',
    desc: '구글 SEO 검색 상위노출용 카테고리별 아티클/매거진 피드',
    category: 'content',
    icon: <BookOpen className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['all', 'info_blog', 'seo_affiliate', 'company', 'travel']
  },
  {
    id: 'membership',
    name: '회원가입',
    desc: '간편 소셜 로그인 (카카오/구글/네이버) 및 회원 관리',
    category: 'interactive',
    icon: <UserCheck className="w-5 h-5 text-[#0F172A]" />,
    recommendedFor: ['shopping', 'info_blog']
  },
  {
    id: 'reservation',
    name: '예약',
    desc: '캘린더 날짜/시간 선택 실시간 예약 및 일정 관리',
    category: 'interactive',
    icon: <Calendar className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['travel', 'professional', 'local_service']
  },
  {
    id: 'payment',
    name: '결제',
    desc: '국내외 신용카드/간편결제 PG 연동 및 무통장 입금',
    category: 'interactive',
    icon: <CreditCard className="w-5 h-5 text-[#10B981]" />,
    recommendedFor: ['shopping', 'travel']
  },
  {
    id: 'multilingual',
    name: '다국어',
    desc: '한국어/영어/일본어/중국어 언어 전환 스위처 및 SEO hreflang 세팅',
    category: 'interactive',
    icon: <Globe2 className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['travel', 'company']
  },
  {
    id: 'map',
    name: '지도',
    desc: '카카오맵 / 구글맵 위치 표시 및 길찾기 링크 연동',
    category: 'interactive',
    icon: <MapPin className="w-5 h-5 text-[#EF4444]" />,
    recommendedFor: ['local_service', 'professional', 'travel', 'company']
  },
  {
    id: 'review',
    name: '리뷰',
    desc: '실제 이용 고객 평점, 리뷰 슬라이더 및 네이버/구글 후기 임베드',
    category: 'marketing',
    icon: <Star className="w-5 h-5 text-[#F59E0B]" />,
    recommendedFor: ['all', 'travel', 'local_service', 'professional', 'shopping']
  },
  {
    id: 'popup',
    name: 'Popup',
    desc: '이벤트 할인, 프로모션 안내, 이탈 방지 Exit-Intent 팝업',
    category: 'marketing',
    icon: <Zap className="w-5 h-5 text-[#F97316]" />,
    recommendedFor: ['cpa_landing', 'shopping', 'travel']
  },
  {
    id: 'sms',
    name: 'SMS',
    desc: '문의/예약 접수 시 관리자 및 고객 자동 안내 문자 발송',
    category: 'contact',
    icon: <Smartphone className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['local_service', 'professional', 'travel']
  },
  {
    id: 'email_notify',
    name: 'Email Notification',
    desc: '새로운 리드 인입 즉시 관리자 메일함으로 실시간 리포트 발송',
    category: 'contact',
    icon: <Mail className="w-5 h-5 text-[#2563EB]" />,
    recommendedFor: ['all', 'company', 'cpa_landing', 'info_blog']
  }
];

export interface WizardStep7FeaturesProps {
  selectedFeatures: string[];
  setSelectedFeatures: (features: string[]) => void;
  siteType: string;
  category: string;
  onPrev: () => void;
  onNext: () => void;
}

export const WizardStep7Features: React.FC<WizardStep7FeaturesProps> = ({
  selectedFeatures,
  setSelectedFeatures,
  siteType,
  category,
  onPrev,
  onNext
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | 'contact' | 'content' | 'interactive' | 'marketing'>('all');
  const [aiAppliedAnim, setAiAppliedAnim] = useState(false);

  // Check if a feature is recommended
  const isRecommended = (feature: FeatureOption) => {
    if (feature.recommendedFor.includes('all')) return true;
    if (feature.recommendedFor.includes(siteType)) return true;
    if (siteType === 'travel' && (feature.id === 'reservation' || feature.id === 'gallery' || feature.id === 'whatsapp' || feature.id === 'kakaotalk' || feature.id === 'multilingual')) return true;
    if (siteType === 'professional' && (feature.id === 'reservation' || feature.id === 'map' || feature.id === 'phone_call' || feature.id === 'inquiry_form')) return true;
    if (siteType === 'cpa_landing' && (feature.id === 'inquiry_form' || feature.id === 'phone_call' || feature.id === 'popup' || feature.id === 'email_notify')) return true;
    return false;
  };

  // Rule-based recommend (not an external AI)
  const handleRecommendSelect = () => {
    setAiAppliedAnim(true);
    const recommendedIds = recommendFeatureKeys(siteType, category);
    setSelectedFeatures(Array.from(new Set([...selectedFeatures, ...recommendedIds])));
    setTimeout(() => setAiAppliedAnim(false), 800);
  };

  // Toggle single feature
  const handleToggle = (id: string) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== id));
    } else {
      setSelectedFeatures([...selectedFeatures, id]);
    }
  };

  const filteredList = ALL_FEATURES.filter((f) =>
    filterCategory === 'all' ? true : f.category === filterCategory
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[#2563EB]" />
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A]">
              홈페이지에 어떤 기능이 필요하신가요?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#64748B]">
            상담창구, 예약, 결제, SEO 블로그 등 필요한 기능들을 자유롭게 선택해주세요. ({selectedFeatures.length}개 선택됨)
          </p>
        </div>

        {/* Quick Category Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#F1F5F9] rounded-xl border border-[#E2E8F0] text-xs font-bold shrink-0">
          <button
            type="button"
            onClick={() => setFilterCategory('all')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filterCategory === 'all' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B]'
            }`}
          >
            전체
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('contact')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filterCategory === 'contact' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B]'
            }`}
          >
            문의/연락
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('interactive')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filterCategory === 'interactive' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B]'
            }`}
          >
            예약/결제
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory('marketing')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              filterCategory === 'marketing' ? 'bg-[#2563EB] text-white shadow-xs' : 'text-[#64748B]'
            }`}
          >
            마케팅
          </button>
        </div>
      </div>

      {/* Rule-based recommendation banner */}
      <div className={`p-4 rounded-3xl bg-[#EFF6FF] border border-[#DBEAFE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
        aiAppliedAnim ? 'ring-2 ring-[#2563EB]' : ''
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center shrink-0 shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#1E40AF]">어떤 기능이 필요한지 모르겠어요</h4>
            <p className="text-[11px] text-[#1E3A8A]">
              선택하신 업종({category || '일반'})과 목적에 맞춰 추천 기능을 표시합니다. 외부 AI가 아닙니다.
            </p>
          </div>
        </div>

        <Button
          type="button"
          variant="primary"
          size="sm"
          leftIcon={<Sparkles className="w-3.5 h-3.5" />}
          onClick={handleRecommendSelect}
          className="shrink-0 bg-[#2563EB] hover:bg-blue-700 font-bold"
        >
          업종에 맞게 추천해주세요
        </Button>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredList.map((feat) => {
          const isSelected = selectedFeatures.includes(feat.id);
          const rec = isRecommended(feat);

          return (
            <div
              key={feat.id}
              onClick={() => handleToggle(feat.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between space-y-2.5 ${
                isSelected
                  ? 'border-[#2563EB] bg-[#EFF6FF]/60 ring-2 ring-[#2563EB]/15 shadow-xs'
                  : 'border-[#E2E8F0] bg-white hover:border-[#2563EB]/40 hover:bg-[#F8FAFC]'
              }`}
            >
              {/* Recommended Badge */}
              {rec && (
                <span className="absolute top-3.5 right-3.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#10B981] text-white flex items-center gap-1 shadow-2xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>추천</span>
                </span>
              )}

              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#2563EB] text-white'
                      : 'bg-[#F1F5F9] text-[#2563EB]'
                  }`}
                >
                  {feat.icon}
                </div>

                <div className="min-w-0 pr-12">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">{feat.name}</h4>
                  <p className="text-[11px] text-[#64748B] mt-0.5 leading-relaxed line-clamp-2">
                    {feat.desc}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#F1F5F9] text-xs">
                <span className="text-[11px] font-semibold text-[#64748B]">
                  {isSelected ? '적용 선택됨' : '선택하기'}
                </span>
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
            </div>
          );
        })}
      </div>

      {/* Navigation Controls */}
      <div className="wizard-cta-bar">
        <Button
          variant="outline"
          size="md"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={onPrev}
        >
          이전 (STEP 6 디자인 스타일)
        </Button>
        <Button
          variant="primary"
          size="md"
          rightIcon={<ArrowRight className="w-4 h-4" />}
          onClick={onNext}
          disabled={selectedFeatures.length === 0}
        >
          다음: 제작 자료 업로드 센터 →
        </Button>
      </div>
    </div>
  );
};
