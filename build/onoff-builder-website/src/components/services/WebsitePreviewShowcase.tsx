import { useState } from 'react';
import { EDITORIAL_IMAGES } from '../../data/assets';

type WebsitePreviewTab = 'brand' | 'board' | 'inquiry';

const PREVIEW_TABS: { id: WebsitePreviewTab; label: string; caption: string }[] = [
  {
    id: 'brand',
    label: '기업·서비스 소개',
    caption: '브랜드 메시지와 핵심 사업 구조를 데스크톱·모바일에 맞춰 설계한 화면 예시입니다.',
  },
  {
    id: 'board',
    label: '게시판·자료실·공지',
    caption: '공지사항, 기술 자료실, 소식 게시판을 브랜드 톤에 맞게 통합 구성한 화면 예시입니다.',
  },
  {
    id: 'inquiry',
    label: '문의·견적 요청',
    caption: '업종별 상담 항목과 입력 검증을 반영해 상담 전환을 돕는 문의 화면 예시입니다.',
  },
];

export function WebsitePreviewShowcase() {
  const [activeTab, setActiveTab] = useState<WebsitePreviewTab>('brand');
  const [imgError, setImgError] = useState(false);

  const currentTab = PREVIEW_TABS.find((t) => t.id === activeTab) ?? PREVIEW_TABS[0];

  return (
    <div className="w-full">
      {/* Interactive Tab Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="홈페이지 화면 구성 예시 선택"
          className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 p-1.5"
        >
          {PREVIEW_TABS.map((tab) => {
            const selected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveTab(tab.id)}
                className={`min-h-[38px] rounded-lg px-4 py-1.5 text-[14px] font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer ${
                  selected
                    ? 'bg-white text-slate-950 shadow-[0_1px_3px_rgba(16,24,40,0.08)]'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <p className="text-[13px] text-slate-500">
          화면 구성 예시 · 프로젝트 범위에 따라 맞춤 설계
        </p>
      </div>

      {/* Preview Stage */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)]">
          {/* Browser Chrome */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3">
            <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
              <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            </div>
            <div className="min-w-0 truncate max-w-[190px] sm:max-w-none rounded-md border border-slate-200 bg-white px-3 sm:px-4 py-1 text-[11px] font-medium text-slate-500">
              {activeTab === 'brand' && 'example-corp.co.kr / company'}
              {activeTab === 'board' && 'example-corp.co.kr / resources'}
              {activeTab === 'inquiry' && 'example-corp.co.kr / quote'}
            </div>
            <span className="hidden sm:inline text-[11px] font-medium text-slate-400 shrink-0">
              디자인 예시
            </span>
          </div>

          {/* Tab 1: Brand & Service Intro */}
          {activeTab === 'brand' && (
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-4">
                <span className="text-[13px] font-bold tracking-[-0.02em] text-slate-950">
                  EXAMPLE ENTERPRISE
                </span>
                <div className="hidden sm:flex items-center gap-6 text-[12px] text-slate-500">
                  <span className="font-semibold text-slate-950">회사소개</span>
                  <span>사업분야</span>
                  <span>자료실</span>
                  <span className="rounded-md bg-[#2563EB] px-3 py-1 text-[11px] font-medium text-white">
                    견적 문의
                  </span>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
                <div className="lg:col-span-6 space-y-4">
                  <p className="text-[12px] font-semibold text-blue-600">회사소개 · 반응형 구성 예시</p>
                  <p className="text-[22px] sm:text-[26px] font-bold leading-[1.28] tracking-[-0.025em] text-slate-950">
                    사업의 핵심 가치를
                    <br />
                    한눈에 이해하는 기업 구조
                  </p>
                  <p className="text-[14px] leading-[1.68] text-slate-600">
                    회사 개요, 핵심 역량, 보유 인증 및 사업 영역을 의사결정권자가 빠르게 파악할 수
                    있도록 명료한 정보 계층으로 배치합니다.
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                      <p className="text-[12px] font-semibold text-slate-950">PC · 모바일 반응형</p>
                      <p className="mt-1 text-[12px] text-slate-500">화면 크기별 자동 최적화</p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3.5">
                      <p className="text-[12px] font-semibold text-slate-950">SEO 기본 마크업</p>
                      <p className="mt-1 text-[12px] text-slate-500">시맨틱 제목·메타 구조</p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6">
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center">
                    {imgError ? (
                      <span className="text-[12px] text-slate-500">기업 소개 화면 예시</span>
                    ) : (
                      <img
                        src={EDITORIAL_IMAGES.heroStudio.src}
                        alt="기업 및 서비스 소개 페이지 구성 예시"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        decoding="async"
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Board / Resources / Notices */}
          {activeTab === 'board' && (
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-blue-600">
                    게시판 · 자료실 · 공지사항 구성 예시
                  </p>
                  <p className="mt-1.5 text-[20px] font-bold tracking-[-0.02em] text-slate-950">
                    기업 소식 및 기술 자료 아카이브
                  </p>
                </div>
                <div className="flex items-center gap-4 text-[12px] text-slate-500">
                  <span className="font-semibold text-slate-950">전체</span>
                  <span>공지사항</span>
                  <span>제품 브로슈어</span>
                  <span>기술 문서</span>
                </div>
              </div>

              <div className="mt-2 divide-y divide-[#EAECF0]">
                {[
                  {
                    type: '공지사항',
                    title: '기업 공식 안내 및 서비스 운영 기준 안내 (게시글 예시)',
                    meta: '안내 · 열람 가능',
                  },
                  {
                    type: '자료실',
                    title: '회사 소개서 및 주요 사업 안내 문서 다운로드 (자료실 예시)',
                    meta: 'PDF 문서 · 첨부 구성 예시',
                  },
                  {
                    type: '소식',
                    title: '신규 제품 라인업 및 서비스 범위 개편 안내 (콘텐츠 예시)',
                    meta: '기업 소식 · 검색 구조 반영',
                  },
                  {
                    type: '자료실',
                    title: '도입 검토를 위한 기본 체크리스트 및 사양서 (자료실 예시)',
                    meta: '문서 자료 · 카테고리 분류',
                  },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col gap-1.5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-baseline gap-3">
                      <span className="text-[12px] font-semibold text-blue-600 shrink-0">
                        {row.type}
                      </span>
                      <span className="text-[14px] font-medium text-slate-950">{row.title}</span>
                    </div>
                    <span className="text-[12px] text-slate-500 shrink-0">{row.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Customer Inquiry & Quote Form */}
          {activeTab === 'inquiry' && (
            <div className="p-5 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5 space-y-3">
                  <p className="text-[12px] font-semibold text-blue-600">
                    고객 문의 · 견적 요청 구성 예시
                  </p>
                  <p className="text-[20px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
                    업종 특성에 맞춘
                    <br />
                    구조화된 상담 접수 화면
                  </p>
                  <p className="text-[14px] leading-[1.65] text-slate-600">
                    단순한 자유 입력창 대신 프로젝트 유형, 희망 일정, 문의 분야를 구조화해
                    담당자가 빠르게 검토하고 응대할 수 있도록 설계합니다.
                  </p>
                </div>

                <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] font-medium text-slate-500">담당자명 / 기업명</p>
                      <p className="mt-0.5 text-[13px] text-slate-400">입력 필드 예시</p>
                    </div>
                    <div className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5">
                      <p className="text-[11px] font-medium text-slate-500">연락처 / 이메일</p>
                      <p className="mt-0.5 text-[13px] text-slate-400">형식 검증 적용 예시</p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-slate-300 bg-white px-3.5 py-2.5">
                    <p className="text-[11px] font-medium text-slate-500">문의 유형 선택</p>
                    <p className="mt-1 text-[12px] text-slate-600">
                      서비스 도입 문의 · 견적 요청 · 제휴 제안 (업종별 맞춤 항목 구성)
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-300 bg-white px-3.5 py-3">
                    <p className="text-[11px] font-medium text-slate-500">상세 문의 내용</p>
                    <p className="mt-1 text-[12px] text-slate-400">
                      상담에 필요한 세부 요청사항 입력 영역 예시
                    </p>
                  </div>
                  <div className="flex justify-end">
                    <span className="inline-block rounded-lg bg-[#2563EB] px-5 py-2 text-[12px] font-semibold text-white">
                      문의 접수 버튼 예시
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-[13px] text-slate-500">{currentTab.caption}</p>
      </div>
    </div>
  );
}
