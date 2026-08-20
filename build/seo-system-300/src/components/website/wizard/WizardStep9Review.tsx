import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { Button } from '../../common/Button';

export type ReviewSectionKey =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'step6'
  | 'step7'
  | 'step8';

export interface WizardStep9ReviewProps {
  siteType: string;
  purposes: string[];
  industry: string;
  siteName: string;
  brandName: string;
  phone: string;
  email: string;
  region: string;
  businessDesc: string;
  designStyle: string;
  colorPreset: string;
  customPrimaryColor: string;
  customSecondaryColor: string;
  references: Array<{ url: string; memo?: string }>;
  menus: Array<{ title: string }>;
  features: string[];
  filesCount: number;
  materialsPercent: number;
  extraRequest: string;
  setExtraRequest: (v: string) => void;
  contacts: Record<string, string>;
  onEdit: (step: ReviewSectionKey) => void;
  onPrev: () => void;
  onSubmit: () => void;
  submitting?: boolean;
}

const Card: React.FC<{
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}> = ({ title, onEdit, children }) => (
  <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 space-y-2 min-w-0">
    <div className="flex items-center justify-between gap-2">
      <h4 className="text-sm font-bold text-[#0F172A]">{title}</h4>
      <button type="button" className="text-xs font-bold text-[#2563EB] shrink-0" onClick={onEdit}>
        수정
      </button>
    </div>
    <div className="text-xs text-[#475569] space-y-1 break-words [overflow-wrap:anywhere]">{children}</div>
  </div>
);

export const WizardStep9Review: React.FC<WizardStep9ReviewProps> = ({
  siteType,
  purposes,
  industry,
  siteName,
  brandName,
  phone,
  email,
  region,
  businessDesc,
  designStyle,
  colorPreset,
  customPrimaryColor,
  customSecondaryColor,
  references,
  menus,
  features,
  filesCount,
  materialsPercent,
  extraRequest,
  setExtraRequest,
  contacts,
  onEdit,
  onPrev,
  onSubmit,
  submitting = false,
}) => {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <div className="space-y-5 animate-in fade-in duration-200 wizard-step9-confirm">
      <div>
        <h3 className="text-lg font-bold text-[#0F172A]">최종 확인</h3>
        <p className="text-xs text-[#64748B] mt-1">입력한 내용을 확인한 뒤 제작을 요청하세요.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card title="기본정보" onEdit={() => onEdit('step4')}>
          <p>사이트명: {siteName || '-'}</p>
          <p>브랜드: {brandName || '-'}</p>
          <p>종류: {siteType || '-'}</p>
          <p>업종: {industry || '-'}</p>
          <p>전화: {phone || '-'}</p>
          <p>이메일: {email || '-'}</p>
          <p>지역: {region || '-'}</p>
          <p className="whitespace-pre-wrap">소개: {businessDesc || '-'}</p>
        </Card>
        <Card title="목적" onEdit={() => onEdit('step2')}>
          <p>{purposes.length ? purposes.join(', ') : '-'}</p>
        </Card>
        <Card title="페이지/메뉴" onEdit={() => onEdit('step5')}>
          <p>{menus.length ? menus.map((m) => m.title).join(' · ') : '-'}</p>
        </Card>
        <Card title="디자인 / 컬러" onEdit={() => onEdit('step6')}>
          <p>스타일: {designStyle || '-'}</p>
          <p>컬러 프리셋: {colorPreset || '-'}</p>
          <p>메인: {customPrimaryColor}</p>
          <p>보조: {customSecondaryColor}</p>
        </Card>
        <Card title="참고사이트" onEdit={() => onEdit('step6')}>
          {references.length === 0 ? (
            <p>없음</p>
          ) : (
            references.map((r) => (
              <p key={r.url}>
                {r.url}
                {r.memo ? ` — ${r.memo}` : ''}
              </p>
            ))
          )}
        </Card>
        <Card title="기능" onEdit={() => onEdit('step7')}>
          <p>{features.length ? features.join(', ') : '-'}</p>
        </Card>
        <Card title="자료" onEdit={() => onEdit('step8')}>
          <p>
            파일 {filesCount}개 · 자료 준비율 {materialsPercent}%
          </p>
        </Card>
        <Card title="연락처" onEdit={() => onEdit('step8')}>
          <p>전화: {contacts.phone || phone || '-'}</p>
          <p>Kakao: {contacts.kakao || '-'}</p>
          <p>Telegram: {contacts.telegram || '-'}</p>
          <p>WhatsApp: {contacts.whatsapp || '-'}</p>
          <p>Email: {contacts.email || email || '-'}</p>
          <p>주소: {contacts.address || '-'}</p>
        </Card>
      </div>

      <div className="rounded-2xl border border-[#E2E8F0] p-4 space-y-2">
        <label className="text-sm font-bold text-[#0F172A]">추가 요청</label>
        <textarea
          value={extraRequest}
          onChange={(e) => setExtraRequest(e.target.value)}
          rows={4}
          className="w-full rounded-xl border border-[#E2E8F0] px-3 py-2 text-sm"
          placeholder="추가로 전달할 제작 요청이 있으면 적어주세요."
        />
      </div>

      <label className="flex items-start gap-2 text-sm text-[#0F172A] scroll-mb-36 pb-2 relative z-30">
        <input
          type="checkbox"
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
          className="mt-1 relative z-30"
        />
        <span>입력한 내용과 제작요청 사항을 확인했습니다.</span>
      </label>

      <div className="h-2 sm:h-0" aria-hidden="true" />

      <div className="wizard-cta-bar">
        <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={onPrev}>
          이전 (자료 업로드)
        </Button>
        <Button
          variant="primary"
          size="lg"
          rightIcon={confirmed ? <Send className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          disabled={!confirmed || submitting}
          onClick={onSubmit}
          className="bg-[#2563EB] hover:bg-blue-700 font-bold"
        >
          홈페이지 제작 요청하기
        </Button>
      </div>
    </div>
  );
};
