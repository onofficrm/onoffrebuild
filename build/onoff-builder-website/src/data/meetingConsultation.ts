import type { InquiryServiceSlug } from './navigation';
import { getInquiryOptionLabel } from './contactForm';

export type HasHomepage = 'yes' | 'no';

export interface GoogleMeetFormState {
  hasHomepage: HasHomepage | '';
  websiteUrl: string;
  consultDate: string;
  consultTime: string;
  googleEmail: string;
  brief: string;
  agreed: boolean;
  /** /contact?service=... 및 UI 칩 선택 */
  interestServices: InquiryServiceSlug[];
}

export interface GoogleMeetFormErrors {
  hasHomepage?: string;
  websiteUrl?: string;
  consultDate?: string;
  consultTime?: string;
  googleEmail?: string;
  brief?: string;
  agreed?: string;
}

/** 09:00 ~ 22:00, 30분 단위 */
export function buildConsultTimeSlots(): string[] {
  const slots: string[] = [];
  for (let hour = 9; hour <= 22; hour++) {
    for (const minute of [0, 30]) {
      if (hour === 22 && minute === 30) continue;
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
}

export const CONSULT_TIME_SLOTS = buildConsultTimeSlots();

function isValidUrl(value: string): boolean {
  const raw = value.trim();
  if (!raw) return false;
  try {
    const u = new URL(raw.includes('://') ? raw : `https://${raw}`);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

export function validateGoogleMeetForm(state: GoogleMeetFormState): GoogleMeetFormErrors {
  const errors: GoogleMeetFormErrors = {};

  if (state.hasHomepage !== 'yes' && state.hasHomepage !== 'no') {
    errors.hasHomepage = '기존 홈페이지 여부를 선택해 주세요.';
  }

  if (state.hasHomepage === 'yes') {
    if (!state.websiteUrl.trim()) {
      errors.websiteUrl = '홈페이지 주소를 입력해 주세요.';
    } else if (!isValidUrl(state.websiteUrl)) {
      errors.websiteUrl = '올바른 URL 형식으로 입력해 주세요.';
    }
  }

  if (!state.consultDate.trim()) {
    errors.consultDate = '상담 희망 날짜를 선택해 주세요.';
  }

  if (!state.consultTime.trim()) {
    errors.consultTime = '상담 희망 시간을 선택해 주세요.';
  } else if (!CONSULT_TIME_SLOTS.includes(state.consultTime)) {
    errors.consultTime = '선택 가능한 시간대 중에서 골라 주세요.';
  }

  const email = state.googleEmail.trim();
  if (!email) {
    errors.googleEmail = '구글(Gmail) 이메일을 입력해 주세요.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.googleEmail = '올바른 이메일 형식으로 입력해 주세요.';
  }

  const brief = state.brief.trim();
  if (!brief) {
    errors.brief = '상담 내용을 간단히 입력해 주세요.';
  } else if (brief.length < 5) {
    errors.brief = '5자 이상 입력해 주세요.';
  }

  if (!state.agreed) {
    errors.agreed = '개인정보 수집·이용에 동의해 주세요.';
  }

  return errors;
}

export function buildGoogleMeetInquiryMessage(state: GoogleMeetFormState): string {
  const lines = ['[상담 유형] Google Meet 1:1 화상 상담'];
  if (state.interestServices.length > 0) {
    const labels = state.interestServices.map((slug) => getInquiryOptionLabel(slug));
    lines.push(`[관심 기능·서비스] ${labels.join(', ')}`);
  }
  lines.push(`[기존 홈페이지] ${state.hasHomepage === 'yes' ? '있음' : '없음'}`);
  if (state.hasHomepage === 'yes' && state.websiteUrl.trim()) {
    lines.push(`[홈페이지 URL] ${state.websiteUrl.trim()}`);
  }
  lines.push(`[희망 일시] ${state.consultDate} ${state.consultTime} (30분)`);
  lines.push(`[Google 이메일] ${state.googleEmail.trim()}`);
  lines.push(`[상담 내용]\n${state.brief.trim()}`);
  return lines.join('\n');
}

export function deriveInquiryNameFromEmail(email: string): string {
  const local = email.split('@')[0]?.trim() || '';
  const safe = local.replace(/[^a-zA-Z0-9가-힣._-]/g, '').slice(0, 50);
  return safe || '화상상담';
}