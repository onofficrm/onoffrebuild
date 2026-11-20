import { useState } from 'react';
import {
  ArrowRight,
  Calculator,
  CalendarDays,
  Check,
  Cpu,
  FolderLock,
  Lock,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';

type ExampleId = 'calculator' | 'booking' | 'member-library';

interface FeatureExampleSpec {
  id: ExampleId;
  label: string;
  icon: typeof Calculator;
  requestTag: string;
  customerIdea: string;
  aiDesignSpecs: { label: string; value: string }[];
  reviewPoint: string;
  scopeNote: string;
}

const FEATURE_EXAMPLES: FeatureExampleSpec[] = [
  {
    id: 'calculator',
    label: '견적 계산기',
    icon: Calculator,
    requestTag: 'B2B 상담 자동 정리',
    customerIdea:
      '고객이 페이지 규모와 원하는 기능을 고르면 예상 구성을 정리해 바로 상담으로 연결되는 계산기를 만들고 싶어요.',
    aiDesignSpecs: [
      { label: '화면 구성', value: '규모 선택 · 옵션 복수 체크 · 조건 요약' },
      { label: '연계 흐름', value: '선택 조건을 상담 폼으로 구조화 전달' },
      { label: '검수 항목', value: '입력값 검증 · 반응형 UI · 예외 조건 확인' },
    ],
    reviewPoint: '임의 단가 오해 방지 · 상담 연계 정합성 검수',
    scopeNote: '계산 규칙 복잡도에 따라 범위 협의 및 개별 견적',
  },
  {
    id: 'booking',
    label: '예약 신청',
    icon: CalendarDays,
    requestTag: '상담·방문 일정 접수',
    customerIdea:
      '홈페이지에서 상담 유형과 희망 날짜·시간을 선택해 예약하고, 같은 시간 중복 접수를 막고 싶어요.',
    aiDesignSpecs: [
      { label: '화면 구성', value: '유형 선택 · 시간대 슬롯 · 선택 일정 확인' },
      { label: '연계 흐름', value: '운영 시간 제한 · 관리자 확인 목록 연계' },
      { label: '검수 항목', value: '중복 접수 방지 · 개인정보 동의 · 보안 점검' },
    ],
    reviewPoint: '중복 예약 방지 로직 · 실제 기기 동작 검수',
    scopeNote: '외부 캘린더·알림 연동 여부에 따라 별도 협의',
  },
  {
    id: 'member-library',
    label: '회원 전용 자료실',
    icon: FolderLock,
    requestTag: '거래처·승인 회원 전용',
    customerIdea:
      '승인된 거래처나 기존 고객만 로그인해서 브로슈어와 기술 매뉴얼, 계약 서식을 내려받게 하고 싶어요.',
    aiDesignSpecs: [
      { label: '화면 구성', value: '카테고리 필터 · 권한 등급 표시 · 자료 목록' },
      { label: '연계 흐름', value: '승인 회원 인증 · 등급별 열람·다운로드 분기' },
      { label: '검수 항목', value: '직접 URL 접근 차단 · 기존 회원 DB 호환 확인' },
    ],
    reviewPoint: '파일 접근 권한 검증 · 회원 데이터 보안 검수',
    scopeNote: '회원 권한 등급·기존 DB 연동 여부에 따라 개별 견적',
  },
];

const LIBRARY_DOCS = [
  {
    id: 'doc-1',
    category: '브로슈어',
    title: '2026 기업 도입 안내서 (PDF)',
    access: '승인 회원',
  },
  {
    id: 'doc-2',
    category: '기술 가이드',
    title: '도메인 · DNS 연결 점검 매뉴얼',
    access: '파트너 등급',
  },
  {
    id: 'doc-3',
    category: '계약 서식',
    title: '유지보수 요청 및 검수 양식',
    access: '승인 회원',
  },
];

export function AiDevBlueprintDemo() {
  const [selectedId, setSelectedId] = useState<ExampleId>('calculator');

  // Client-side UI preview states only (no real storage, payment, or deployment)
  const [calcScale, setCalcScale] = useState<'compact' | 'standard' | 'extended'>('standard');
  const [calcOptions, setCalcOptions] = useState<string[]>(['반응형 SEO', '문의 폼 분기']);

  const [bookingType, setBookingType] = useState<string>('온라인 화상');
  const [bookingSlot, setBookingSlot] = useState<string>('11/24 (화) 14:00');

  const [libraryFilter, setLibraryFilter] = useState<string>('전체');
  const [selectedDocId, setSelectedDocId] = useState<string>('doc-1');

  const spec =
    FEATURE_EXAMPLES.find((item) => item.id === selectedId) ?? FEATURE_EXAMPLES[0];

  const toggleCalcOption = (opt: string) => {
    setCalcOptions((prev) =>
      prev.includes(opt) ? prev.filter((item) => item !== opt) : [...prev, opt]
    );
  };

  const filteredDocs =
    libraryFilter === '전체'
      ? LIBRARY_DOCS
      : LIBRARY_DOCS.filter((doc) => doc.category === libraryFilter);

  const selectedDoc =
    filteredDocs.find((d) => d.id === selectedDocId) ?? filteredDocs[0] ?? LIBRARY_DOCS[0];

  return (
    <figure
      role="region"
      aria-label="고객 요청 입력에서 AI 설계 카드, 웹 기능 미리보기로 이어지는 맞춤 기능 개발 3단계 시연"
      className="w-full overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      {/* Top Bar: 3 Interactive Example Tabs Only */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div
          role="tablist"
          aria-label="맞춤 기능 개발 예시 선택"
          className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-slate-200 bg-white p-1"
        >
          {FEATURE_EXAMPLES.map((item) => {
            const Icon = item.icon;
            const active = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSelectedId(item.id)}
                className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-[7px] px-3.5 py-1.5 text-[12.5px] font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#101828] text-white'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-[12px] font-medium text-slate-500 shrink-0">
          시연 UI · 실제 저장·결제·배포 안 됨
        </span>
      </div>

      {/* 3-Scene Core Graphic: [1. 고객 요청 입력] → [2. AI 설계 카드] → [3. 웹 기능 미리보기] */}
      <div className="grid grid-cols-1 lg:grid-cols-12 bg-white">
        {/* SCENE 1 (LEFT): 고객 요청 입력 */}
        <div className="relative lg:col-span-3 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-white p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-950">
                <MessageSquareText className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                <span>고객 요청 입력</span>
              </span>
              <span className="text-[11px] font-bold tabular-metrics text-slate-400">01</span>
            </div>

            <div className="mt-4 rounded-[14px] border border-[#2563EB]/25 bg-blue-50/65 p-4">
              <p className="text-[11px] font-semibold text-blue-600">{spec.requestTag}</p>
              <p className="mt-2 text-[13.5px] font-medium leading-[1.6] text-slate-950">
                “{spec.customerIdea}”
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-3 text-[11.5px] text-slate-500">
            <span>개발 문서 없이 말로 설명</span>
            <ArrowRight className="h-3.5 w-3.5 text-blue-600 lg:hidden" aria-hidden="true" />
          </div>

          {/* Desktop Connector Arrow 1 -> 2 */}
          <div
            aria-hidden="true"
            className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-[0_2px_8px_rgba(16,24,40,0.06)]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* SCENE 2 (CENTER): AI 설계 카드 */}
        <div className="relative lg:col-span-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[12px] font-bold text-slate-950">
                <Cpu className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                <span>AI 설계 카드</span>
              </span>
              <span className="text-[11px] font-bold tabular-metrics text-slate-400">02</span>
            </div>

            <div className="mt-4 space-y-2.5">
              {spec.aiDesignSpecs.map((row) => (
                <div
                  key={row.label}
                  className="rounded-[12px] border border-slate-200 bg-white px-3.5 py-3"
                >
                  <p className="text-[11px] font-semibold text-blue-600">{row.label}</p>
                  <p className="mt-0.5 text-[13px] font-medium leading-[1.45] text-[#344054]">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-slate-200 bg-white px-3.5 py-2.5">
            <div className="flex items-center gap-2 text-[12px] font-semibold text-slate-950">
              <ShieldCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" aria-hidden="true" />
              <span className="truncate">{spec.reviewPoint}</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">{spec.scopeNote}</p>
          </div>

          {/* Desktop Connector Arrow 2 -> 3 */}
          <div
            aria-hidden="true"
            className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600 shadow-[0_2px_8px_rgba(16,24,40,0.06)]"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* SCENE 3 (RIGHT): 실제 웹 기능 미리보기 */}
        <div className="lg:col-span-5 flex flex-col justify-between bg-[#F1F5F9]/70 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <span className="text-[12px] font-bold text-slate-950">
              웹 기능 미리보기 · {spec.label}
            </span>
            <span className="text-[11px] font-bold tabular-metrics text-blue-600">03 · 시연</span>
          </div>

          <div className="flex-1 rounded-[14px] border border-[#E2E8F0] bg-white p-4 sm:p-5 shadow-[var(--shadow-subtle)]">
            {/* TAB 1: 견적 계산기 */}
            {selectedId === 'calculator' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-500">1. 페이지 규모</p>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: 'compact', label: '기본 5p' },
                        { id: 'standard', label: '표준 10p' },
                        { id: 'extended', label: '확장 15p+' },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCalcScale(opt.id)}
                        className={`min-h-[34px] rounded-[8px] border px-2 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                          calcScale === opt.id
                            ? 'border-[#2563EB] bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11.5px] font-semibold text-slate-500">
                    2. 희망 기능 (복수 선택)
                  </p>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {['반응형 SEO', '문의 폼 분기', '포트폴리오 필터', '다국어 검토'].map(
                      (opt) => {
                        const checked = calcOptions.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleCalcOption(opt)}
                            className={`flex items-center gap-2 rounded-[8px] border px-2.5 py-2 text-left text-[12px] transition-colors cursor-pointer ${
                              checked
                                ? 'border-[#2563EB] bg-blue-50/60 font-medium text-slate-950'
                                : 'border-slate-200 bg-white text-slate-600'
                            }`}
                          >
                            <span
                              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border ${
                                checked
                                  ? 'border-[#2563EB] bg-[#2563EB] text-white'
                                  : 'border-slate-300'
                              }`}
                              aria-hidden="true"
                            >
                              {checked && <Check className="h-2.5 w-2.5" />}
                            </span>
                            <span className="truncate">{opt}</span>
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-[11px] font-semibold text-blue-600">
                    선택 조건 요약 · 상담 전달 예시
                  </p>
                  <p className="mt-1 text-[13.5px] font-bold text-slate-950">
                    {calcScale === 'compact'
                      ? '기본형 (5p 내외)'
                      : calcScale === 'standard'
                      ? '기업 표준 (10p 내외)'
                      : '확장형 (15p 이상)'}{' '}
                    · 기능 {calcOptions.length}건
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-slate-500 truncate">
                    {calcOptions.length > 0 ? calcOptions.join(', ') : '기본 구성 선택'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: 예약 신청 */}
            {selectedId === 'booking' && (
              <div className="space-y-4">
                <div>
                  <p className="text-[11.5px] font-semibold text-slate-500">1. 상담 유형</p>
                  <div className="mt-1.5 grid grid-cols-3 gap-1.5">
                    {['온라인 화상', '방문 미팅', '전화 점검'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setBookingType(type)}
                        className={`min-h-[34px] rounded-[8px] border px-2 py-1.5 text-[12px] font-medium transition-colors cursor-pointer ${
                          bookingType === type
                            ? 'border-[#2563EB] bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-[11.5px] font-semibold text-slate-500">2. 희망 시간대</p>
                  <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                    {[
                      '11/24 (화) 10:30',
                      '11/24 (화) 14:00',
                      '11/25 (수) 11:00',
                      '11/26 (목) 15:30',
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingSlot(slot)}
                        className={`min-h-[34px] rounded-[8px] border px-2.5 py-1.5 text-left text-[12px] font-medium tabular-metrics transition-colors cursor-pointer ${
                          bookingSlot === slot
                            ? 'border-[#2563EB] bg-blue-50 text-blue-600'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-[10px] border border-slate-200 bg-slate-50 p-3.5">
                  <p className="text-[11px] font-semibold text-blue-600">
                    선택 일정 예시 · 실제 예약 접수 안 됨
                  </p>
                  <p className="mt-1 text-[13.5px] font-bold text-slate-950">
                    {bookingType} · <span className="tabular-metrics">{bookingSlot}</span>
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-slate-500">
                    실제 구현 시 중복 방지·관리자 알림과 함께 연동됩니다.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: 회원 전용 자료실 */}
            {selectedId === 'member-library' && (
              <div className="space-y-3.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="inline-flex flex-wrap items-center gap-1 rounded-[8px] border border-slate-200 bg-slate-50 p-0.5">
                    {['전체', '브로슈어', '기술 가이드', '계약 서식'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setLibraryFilter(cat)}
                        className={`min-h-[28px] rounded-[6px] px-2.5 py-1 text-[11.5px] font-medium transition-colors cursor-pointer ${
                          libraryFilter === cat
                            ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.08)]'
                            : 'text-slate-500 hover:text-slate-950'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                    <Lock className="h-3 w-3 text-blue-600" aria-hidden="true" />
                    권한 예시
                  </span>
                </div>

                <div className="divide-y divide-[#EAECF0] rounded-[10px] border border-slate-200">
                  {filteredDocs.map((doc) => {
                    const active = selectedDoc?.id === doc.id;
                    return (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => setSelectedDocId(doc.id)}
                        className={`flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition-colors cursor-pointer ${
                          active ? 'bg-blue-50/60' : 'bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[12.5px] font-semibold text-slate-950">
                            {doc.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {doc.category} · {doc.access}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 shrink-0">
                          권한 확인
                        </span>
                      </button>
                    );
                  })}
                </div>

                {selectedDoc && (
                  <p className="rounded-[8px] border border-slate-200 bg-slate-50 px-3 py-2 text-[11.5px] text-slate-500">
                    <span className="font-semibold text-slate-950">{selectedDoc.title}</span> — 승인
                    회원 로그인 확인 후 내려받는 시연 화면입니다.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Honest Policy Caption */}
      <figcaption className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          시연 화면 · 실제 데이터 저장·결제·배포는 수행되지 않으며, 맞춤 기능은 별도 범위 협의와
          개별 견적, 전문 개발팀 검수를 거쳐 구현합니다.
        </span>
      </figcaption>
    </figure>
  );
}
