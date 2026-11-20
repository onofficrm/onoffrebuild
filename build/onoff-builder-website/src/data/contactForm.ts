/**
 * 상담 관련 공통 데이터
 *
 * - **관심 항목**: `ALL_INQUIRY_OPTIONS`, `parseQueryServices` — `/contact?service=` + Meet 폼 칩 UI
 * - **클래식 폼 API**: `ConsultationFormState`, `validateConsultationForm`, `submitInquiryToBoard`
 *   (공식 ContactPage는 Google Meet + 카카오; 클래식은 프로그램·연동·테스트용 유지)
 */
import {
  CORE_FEATURE_NAV_ITEMS,
  SERVICE_NAV_ITEMS,
  type InquiryServiceSlug,
} from './navigation';

export interface ConsultationFormState {
  name: string;
  company: string;
  phone: string;
  email: string;
  services: InquiryServiceSlug[];
  message: string;
  agreed: boolean;
}

export interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  services?: string;
  agreed?: string;
}

export interface ContactFieldSpec {
  field: keyof ConsultationFormState;
  htmlId: string;
  label: string;
  required: boolean;
  type: 'text' | 'tel' | 'email' | 'multi-select' | 'textarea' | 'checkbox';
  validationRule: string;
  gnuboardSuggestedColumn: string;
}

export interface InquiryOptionItem {
  slug: InquiryServiceSlug;
  label: string;
  group: 'core_feature' | 'website_service' | 'separate_service';
  statusTag?: string;
}

export const INQUIRY_CORE_FEATURE_OPTIONS: InquiryOptionItem[] = CORE_FEATURE_NAV_ITEMS.map(
  (item) => ({
    slug: item.slug,
    label: item.label,
    group: 'core_feature',
    statusTag:
      item.group === 'automation'
        ? '연동 준비 중'
        : '상담 협의',
  })
);

export const INQUIRY_SERVICE_OPTIONS: InquiryOptionItem[] = SERVICE_NAV_ITEMS.map((item) => ({
  slug: item.slug,
  label: item.label,
  group: item.group === 'core' ? 'website_service' : 'separate_service',
}));

export const ALL_INQUIRY_OPTIONS: InquiryOptionItem[] = [
  ...INQUIRY_CORE_FEATURE_OPTIONS,
  ...INQUIRY_SERVICE_OPTIONS,
];

const OPTION_LABEL_MAP = new Map<InquiryServiceSlug, string>(
  ALL_INQUIRY_OPTIONS.map((item) => [item.slug, item.label])
);

export function getInquiryOptionLabel(slug: InquiryServiceSlug): string {
  return OPTION_LABEL_MAP.get(slug) ?? slug;
}

/** proc/inquiry-submit.php + onoff-inquiry 스킨 기준 (클래식 폼 제출) */
export const CONTACT_FORM_FIELD_SPECS: ContactFieldSpec[] = [
  {
    field: 'name',
    htmlId: 'contact-name',
    label: '이름',
    required: true,
    type: 'text',
    validationRule: '공백 제외 1자 이상 필수',
    gnuboardSuggestedColumn: 'wr_name',
  },
  {
    field: 'company',
    htmlId: 'contact-company',
    label: '업체명',
    required: false,
    type: 'text',
    validationRule: '선택 입력',
    gnuboardSuggestedColumn: '본문 message 블록 또는 wr_content 부가',
  },
  {
    field: 'phone',
    htmlId: 'contact-phone',
    label: '연락처',
    required: true,
    type: 'tel',
    validationRule: '필수 · 숫자 추출 기준 9~15자리',
    gnuboardSuggestedColumn: 'wr_1',
  },
  {
    field: 'email',
    htmlId: 'contact-email',
    label: '이메일',
    required: false,
    type: 'email',
    validationRule: '선택 입력 · google_meet 채널 시 서버 필수',
    gnuboardSuggestedColumn: 'wr_2',
  },
  {
    field: 'services',
    htmlId: 'contact-service-first',
    label: '관심 서비스 및 기능',
    required: true,
    type: 'multi-select',
    validationRule:
      '클래식 API 필수 1개 이상 · Meet UI는 선택(칩) · ?service= 쿼리 및 별칭 사전 선택',
    gnuboardSuggestedColumn: 'message 본문 [관심 기능·서비스]',
  },
  {
    field: 'message',
    htmlId: 'contact-message',
    label: '요청 내용',
    required: false,
    type: 'textarea',
    validationRule: '클래식 선택 · Meet는 brief 필수(별도 스키마)',
    gnuboardSuggestedColumn: 'wr_content',
  },
  {
    field: 'agreed',
    htmlId: 'contact-agreed',
    label: '개인정보 수집·이용 동의',
    required: true,
    type: 'checkbox',
    validationRule: '필수 true',
    gnuboardSuggestedColumn: 'wr_4',
  },
];

const VALID_INQUIRY_SLUGS = new Set<string>(ALL_INQUIRY_OPTIONS.map((item) => item.slug));

const QUERY_SLUG_ALIASES: Record<string, InquiryServiceSlug> = {
  'step-mail': 'stepmail',
  sns: 'sns-marketing',
  'sns-poster': 'sns-marketing',
  'ai-development': 'ai-dev',
  easyedit: 'easy-edit',
  autocomment: 'auto-comment',
  comment: 'auto-comment',
};

export function parseQueryServices(raw: string | null): InquiryServiceSlug[] {
  if (!raw) return [];
  const resolved: InquiryServiceSlug[] = [];

  for (const part of raw.split(',')) {
    const normalized = part.trim().toLowerCase();
    if (!normalized) continue;

    if (VALID_INQUIRY_SLUGS.has(normalized)) {
      resolved.push(normalized as InquiryServiceSlug);
    } else if (normalized in QUERY_SLUG_ALIASES) {
      resolved.push(QUERY_SLUG_ALIASES[normalized]);
    }
  }

  return Array.from(new Set(resolved));
}

export function validateConsultationForm(
  state: Pick<ConsultationFormState, 'name' | 'phone' | 'email' | 'message' | 'agreed'> & {
    services: readonly string[];
  }
): FormErrors {
  const nextErrors: FormErrors = {};

  if (!state.name.trim()) {
    nextErrors.name = '이름을 입력해 주세요.';
  }

  const digitsOnly = state.phone.replace(/[^0-9]/g, '');
  if (!state.phone.trim()) {
    nextErrors.phone = '연락처를 입력해 주세요.';
  } else if (digitsOnly.length < 9 || digitsOnly.length > 12) {
    nextErrors.phone = '올바른 연락처 형식으로 입력해 주세요. (예: 010-1234-5678)';
  }

  if (state.email.trim()) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(state.email.trim())) {
      nextErrors.email = '올바른 이메일 형식으로 입력해 주세요.';
    }
  }

  if (state.services.length === 0) {
    nextErrors.services = '관심 기능 또는 서비스를 1개 이상 선택해 주세요.';
  }

  if (!state.agreed) {
    nextErrors.agreed = '개인정보 수집·이용 동의에 체크해 주세요.';
  }

  return nextErrors;
}