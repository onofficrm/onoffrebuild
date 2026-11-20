/**
 * Board-backed inquiry submit (GNUBoard inquiry board via /proc/inquiry-submit.php)
 *
 * Field contract (from proc/inquiry-submit.php):
 * - onoff_inquiry_token (CSRF, from /proc/inquiry-token.php)
 * - name (required, ≤50)
 * - phone (required, 9–15 digits)
 * - email (optional, valid email ≤100; required for inquiry_channel=google_meet)
 * - inquiry_channel (optional: google_meet | phone)
 * - message (required, 10–3000)
 * - privacy_agree (required truthy)
 * - referer_page (optional)
 * - website_url (honeypot — must be empty)
 *
 * PREVIEW mode must not call the live endpoint with a success claim.
 * LIVE requires JSON success:true before showing completion UX.
 */

import { CONSULTATION_CONFIG } from '../config/consultation';
import { getInquiryOptionLabel, type ConsultationFormState } from '../data/contactForm';
import {
  buildGoogleMeetInquiryMessage,
  deriveInquiryNameFromEmail,
  type GoogleMeetFormState,
} from '../data/meetingConsultation';

/** 백엔드 필수 연락처 — Google Meet 상담은 이메일로 연락 (게시판 본문에 명시) */
const GOOGLE_MEET_INQUIRY_PHONE_PLACEHOLDER = '01000000000';

export type InquiryResult = {
  success: boolean;
  message: string;
  redirectUrl?: string;
};

async function fetchInquiryToken(): Promise<string> {
  const res = await fetch(CONSULTATION_CONFIG.tokenEndpoint, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  const data = (await res.json()) as { success?: boolean; token?: string; message?: string };
  if (!data?.success || !data?.token) {
    throw new Error(data?.message || '보안 토큰을 가져오지 못했습니다. 새로고침 후 다시 시도해 주세요.');
  }
  return String(data.token);
}

export function buildInquiryMessage(form: ConsultationFormState): string {
  const labels = form.services.map((slug) => getInquiryOptionLabel(slug));
  const parts: string[] = [];
  if (labels.length > 0) {
    parts.push(`[관심 기능·서비스] ${labels.join(', ')}`);
  }
  if (form.company.trim()) {
    parts.push(`[업체명] ${form.company.trim()}`);
  }
  if (form.message.trim()) {
    parts.push(form.message.trim());
  } else {
    parts.push('홈페이지·기본 기능·별도 서비스 범위 상담을 요청합니다.');
  }
  return parts.join('\n\n');
}

/**
 * Submit to inquiry board when mode === LIVE.
 * In PREVIEW, returns success:false with an explicit non-acceptance message.
 */
export async function submitInquiryToBoard(form: ConsultationFormState): Promise<InquiryResult> {
  if (CONSULTATION_CONFIG.mode !== 'LIVE') {
    return {
      success: false,
      message:
        '상담 접수가 아직 PREVIEW 상태입니다. 실제 서버 접수는 활성화되지 않았으며, 초안 확인·복사만 가능합니다.',
    };
  }

  if (!form.agreed) {
    return { success: false, message: '개인정보 수집·이용에 동의해 주세요.' };
  }
  if (!form.name.trim() || !form.phone.trim()) {
    return { success: false, message: '이름과 연락처를 입력해 주세요.' };
  }

  const message = buildInquiryMessage(form);
  if (message.length < 10) {
    return { success: false, message: '문의내용을 10자 이상 입력해 주세요.' };
  }

  return submitInquiryPayload({
    name: form.name.trim(),
    phone: form.phone.trim(),
    email: form.email.trim() || undefined,
    message,
  });
}

async function submitInquiryPayload(payload: {
  name: string;
  phone: string;
  email?: string;
  message: string;
  inquiryChannel?: 'google_meet' | 'phone';
}): Promise<InquiryResult> {
  try {
    const token = await fetchInquiryToken();
    const body = new FormData();
    body.append('onoff_inquiry_token', token);
    body.append('name', payload.name);
    body.append('phone', payload.phone);
    body.append('privacy_agree', '1');
    body.append('message', payload.message);
    body.append('website_url', '');
    body.append('referer_page', typeof window !== 'undefined' ? window.location.href : '');
    if (payload.email?.trim()) {
      body.append('email', payload.email.trim());
    }
    if (payload.inquiryChannel) {
      body.append('inquiry_channel', payload.inquiryChannel);
    }

    const res = await fetch(CONSULTATION_CONFIG.endpoint, {
      method: 'POST',
      credentials: 'include',
      body,
    });

    let data: { success?: boolean; message?: string; redirect_url?: string };
    try {
      data = await res.json();
    } catch {
      return { success: false, message: '서버 응답을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.' };
    }

    if (!data.success) {
      return { success: false, message: data.message || '접수에 실패했습니다.' };
    }

    return {
      success: true,
      message: data.message || '상담 요청이 접수되었습니다.',
      redirectUrl: data.redirect_url,
    };
  } catch (err) {
    console.error('[inquiry] submit failed', err);
    return {
      success: false,
      message: err instanceof Error ? err.message : '접수 중 오류가 발생했습니다.',
    };
  }
}

export async function submitGoogleMeetToBoard(state: GoogleMeetFormState): Promise<InquiryResult> {
  if (CONSULTATION_CONFIG.mode !== 'LIVE') {
    return {
      success: false,
      message:
        '화상 상담 예약 접수가 아직 PREVIEW 상태입니다. 실제 접수는 활성화되지 않았습니다.',
    };
  }

  const message = buildGoogleMeetInquiryMessage(state);
  const email = state.googleEmail.trim();

  return submitInquiryPayload({
    name: deriveInquiryNameFromEmail(email),
    phone: GOOGLE_MEET_INQUIRY_PHONE_PLACEHOLDER,
    email,
    message,
    inquiryChannel: 'google_meet',
  });
}
