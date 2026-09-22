import { useState } from 'react';
import { CheckCircle2, HardDrive, Save } from 'lucide-react';
import {
  type DomainAssessment,
  type ExpiredDomainCandidate,
  type ExpiredDomainMissionDraft,
} from './missions/expiredDomainMission';
import { localExpiredDomainMissionRepository } from './missions/localExpiredDomainMissionRepository';

const assessmentFields: Array<{
  key: keyof Pick<
    ExpiredDomainCandidate,
    'brandFit' | 'topicRelevance' | 'history' | 'referringDomains' | 'anchor' | 'risk'
  >;
  label: string;
}> = [
  { key: 'brandFit', label: 'BRAND FIT' },
  { key: 'topicRelevance', label: 'TOPIC RELEVANCE' },
  { key: 'history', label: 'HISTORY' },
  { key: 'referringDomains', label: 'REFERRING DOMAINS' },
  { key: 'anchor', label: 'ANCHOR' },
  { key: 'risk', label: 'SPAM / RISK' },
];

const assessmentOptions: Array<{ value: DomainAssessment; label: string }> = [
  { value: 'unrated', label: '선택' },
  { value: 'good', label: 'GOOD' },
  { value: 'review', label: 'REVIEW' },
  { value: 'risk', label: 'RISK' },
];

export function ExpiredDomainMissionPanel() {
  const [draft, setDraft] = useState<ExpiredDomainMissionDraft>(() =>
    localExpiredDomainMissionRepository.load(),
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState(Boolean(draft.updatedAt));
  const candidate = draft.candidates[activeIndex];

  const updateCandidate = (
    patch: Partial<ExpiredDomainCandidate>,
  ) => {
    setDraft((current) => {
      const candidates: ExpiredDomainMissionDraft['candidates'] = [
        current.candidates[0],
        current.candidates[1],
        current.candidates[2],
      ];
      candidates[activeIndex] = { ...candidates[activeIndex], ...patch };
      return { ...current, candidates };
    });
    setSaved(false);
  };

  const saveDraft = () => {
    setDraft(localExpiredDomainMissionRepository.save(draft));
    setSaved(true);
  };

  const inputClass =
    'mt-1 min-h-11 w-full rounded-xl border border-[#CBD5E1] bg-white px-3 text-sm text-[#334155] outline-none transition focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE]';

  return (
    <section className="mt-4 rounded-2xl border border-[#BFDBFE] bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#0F172A]">MISSION · 후보 도메인 3개 비교</p>
          <p className="mt-1 text-xs leading-5 text-[#64748B]">
            자동 구매 판정 없이 근거를 기록합니다. 브라우저의 LOCAL 저장소에만 보관됩니다.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#EFF6FF] px-2.5 py-1 text-[10px] font-black text-[#1D4ED8]">
          <HardDrive className="h-3.5 w-3.5" />
          LOCAL ONLY
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2" role="tablist" aria-label="후보 도메인 선택">
        {draft.candidates.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className={`min-h-11 rounded-xl border px-2 text-xs font-black transition ${
              activeIndex === index
                ? 'border-[#2563EB] bg-[#EFF6FF] text-[#1D4ED8]'
                : 'border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]'
            }`}
          >
            후보 {index + 1}
            {item.domain ? <span className="mt-0.5 block truncate font-mono text-[10px]">{item.domain}</span> : null}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-black text-[#475569]">
          DOMAIN
          <input
            className={inputClass}
            value={candidate.domain}
            onChange={(event) => updateCandidate({ domain: event.target.value })}
            placeholder="example.com"
            inputMode="url"
          />
        </label>
        <label className="text-xs font-black text-[#475569]">
          TARGET
          <select
            className={inputClass}
            value={candidate.target}
            onChange={(event) =>
              updateCandidate({
                target: event.target.value as ExpiredDomainCandidate['target'],
              })
            }
          >
            <option value="NAVER">NAVER</option>
            <option value="GOOGLE">GOOGLE</option>
            <option value="BOTH">NAVER + GOOGLE</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {assessmentFields.map((field) => (
          <label key={field.key} className="text-[11px] font-black text-[#475569]">
            {field.label}
            <select
              className={inputClass}
              value={candidate[field.key]}
              onChange={(event) =>
                updateCandidate({
                  [field.key]: event.target.value as DomainAssessment,
                })
              }
            >
              {assessmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-black text-[#475569]">
          THIRD PARTY METRICS · 참고값
          <input
            className={inputClass}
            value={candidate.metrics}
            onChange={(event) => updateCandidate({ metrics: event.target.value })}
            placeholder="예: RD 120 · DR 18 (공식 점수 아님)"
          />
        </label>
        <label className="text-xs font-black text-[#475569]">
          FINAL
          <select
            className={inputClass}
            value={candidate.finalDecision}
            onChange={(event) =>
              updateCandidate({
                finalDecision: event.target.value as ExpiredDomainCandidate['finalDecision'],
              })
            }
          >
            <option value="unrated">선택</option>
            <option value="candidate">활용 후보</option>
            <option value="review">보류</option>
            <option value="exclude">제외</option>
            <option value="no_purchase">구매하지 않음</option>
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-black text-[#475569]">
          MEMO
          <textarea
            className={`${inputClass} min-h-24 py-3`}
            value={candidate.memo}
            onChange={(event) => updateCandidate({ memo: event.target.value })}
            placeholder="확인한 원본 화면과 수치를 기록"
          />
        </label>
        <label className="text-xs font-black text-[#475569]">
          WHY · 판단 이유 1~2줄
          <textarea
            className={`${inputClass} min-h-24 py-3`}
            value={candidate.reason}
            onChange={(event) => updateCandidate({ reason: event.target.value })}
            placeholder="관련성·이력·링크·위험 근거"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] text-[#64748B]">
          {draft.updatedAt
            ? `마지막 LOCAL 저장: ${new Date(draft.updatedAt).toLocaleString('ko-KR')}`
            : '아직 저장하지 않았습니다.'}
        </p>
        <button
          type="button"
          onClick={saveDraft}
          className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#0F172A] px-4 text-xs font-black text-white transition hover:bg-[#1E293B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB]"
        >
          {saved ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
          {saved ? 'LOCAL 저장 완료' : 'LOCAL 저장'}
        </button>
      </div>
    </section>
  );
}
