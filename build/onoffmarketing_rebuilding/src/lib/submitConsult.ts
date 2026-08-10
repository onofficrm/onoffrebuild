/**
 * 빌더 SPA 상담·진단 폼 → 이메일 알림 API
 */

export type ConsultPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  formType?: string;
  company?: string;
  services?: string;
  website?: string;
  keyword?: string;
  concern?: string;
  privacyAgree: boolean;
};

export type ConsultResult = {
  success: boolean;
  message: string;
};

async function fetchInquiryToken(): Promise<string> {
  const res = await fetch('/proc/inquiry-token.php', {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });
  const data = await res.json();
  if (!data?.success || !data?.token) {
    throw new Error(data?.message || '보안 토큰을 가져오지 못했습니다. 새로고침 후 다시 시도해 주세요.');
  }
  return String(data.token);
}

export async function submitConsultNotify(payload: ConsultPayload): Promise<ConsultResult> {
  if (!payload.privacyAgree) {
    return { success: false, message: '개인정보 수집·이용에 동의해 주세요.' };
  }

  const token = await fetchInquiryToken();
  const body = new FormData();
  body.append('onoff_inquiry_token', token);
  body.append('name', payload.name.trim());
  body.append('phone', payload.phone.trim());
  body.append('privacy_agree', '1');
  body.append('website_url', ''); // honeypot
  body.append('referer_page', typeof window !== 'undefined' ? window.location.href : '');
  body.append('form_type', payload.formType || 'consult');

  if (payload.email) body.append('email', payload.email.trim());
  if (payload.message) body.append('message', payload.message.trim());
  if (payload.company) body.append('company', payload.company.trim());
  if (payload.services) body.append('services', payload.services.trim());
  if (payload.website) body.append('website', payload.website.trim());
  if (payload.keyword) body.append('keyword', payload.keyword.trim());
  if (payload.concern) body.append('concern', payload.concern.trim());

  const res = await fetch('/proc/consult-notify.php', {
    method: 'POST',
    credentials: 'include',
    body,
  });

  let data: ConsultResult;
  try {
    data = await res.json();
  } catch {
    return { success: false, message: '서버 응답을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.' };
  }

  return {
    success: !!data.success,
    message: data.message || (data.success ? '접수되었습니다.' : '접수에 실패했습니다.'),
  };
}
