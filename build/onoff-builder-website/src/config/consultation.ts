/**
 * Consultation submit mode for /contact.
 *
 * PREVIEW (default): validation + draft preview/copy only — never claim success.
 * LIVE: POST /proc/inquiry-submit.php after CSRF token (requires operator approval).
 *
 * Override locally: VITE_CONSULTATION_MODE=LIVE (never commit .env with secrets).
 */
export type ConsultationMode = 'PREVIEW' | 'LIVE';

export interface ConsultationConfig {
  mode: ConsultationMode;
  endpoint: string;
  tokenEndpoint: string;
  privacyPolicyUrl: string;
}

const envMode = (import.meta.env.VITE_CONSULTATION_MODE as string | undefined)?.toUpperCase();
const apiOrigin = (import.meta.env.VITE_INQUIRY_API_ORIGIN as string | undefined)?.replace(/\/$/, '') || '';

export const CONSULTATION_CONFIG: ConsultationConfig = {
  mode: envMode === 'LIVE' ? 'LIVE' : 'PREVIEW',
  endpoint: `${apiOrigin}/proc/inquiry-submit.php`,
  tokenEndpoint: `${apiOrigin}/proc/inquiry-token.php`,
  privacyPolicyUrl: '/content/privacy',
};
