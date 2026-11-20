import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type BacklinkTab = 'audit' | 'strategy' | 'campaign';

const TABS: { id: BacklinkTab; label: string; caption: string }[] = [
  {
    id: 'audit',
    label: '사이트 분석 기준',
    caption:
      '외부 링크를 늘리기 전에 현재 사이트의 페이지 완성도와 도메인 준비 상태를 먼저 진단하는 화면 예시입니다.',
  },
  {
    id: 'strategy',
    label: '링크 전략·URL 배분',
    caption:
      '메인 페이지 하나에만 집중하지 않고 핵심 서비스 페이지와 맥락에 맞게 연결 대상을 설계하는 예시입니다.',
  },
  {
    id: 'campaign',
    label: '예산 검토·캠페인 안내',
    caption:
      '업종 경쟁도와 사이트 단계에 맞춰 무리 없는 범위와 속도로 캠페인을 설계합니다. (특정 순위를 보장하지 않습니다.)',
  },
];

export function BacklinkPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<BacklinkTab>('audit');
  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="백링크 전략 화면 예시 선택"
          className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5"
        >
          {TABS.map((tab) => {
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
                    ? 'bg-[#101828] text-white'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <p className="text-[13px] text-slate-500">전략 구조 UI 예시 · 실제 실적 수치가 아닙니다</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_14px_36px_rgba(16,24,40,0.05)]">
          {/* Minimal Workspace Chrome */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div className="flex items-center gap-3">
              <span className="text-[12px] font-semibold text-slate-950">
                BACKLINK STRATEGY BRIEF
              </span>
              <span className="hidden sm:inline text-[12px] text-slate-400">·</span>
              <span className="hidden sm:inline text-[12px] text-slate-500">
                example-corp.co.kr
              </span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">구성 예시</span>
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === 'audit' && (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                <div className="lg:col-span-5 space-y-3">
                  <p className="text-[12px] font-semibold text-blue-600">
                    01 · 사전 사이트 분석 리포트 구조
                  </p>
                  <p className="text-[20px] font-bold leading-snug tracking-[-0.02em] text-slate-950">
                    링크를 받기 좋은 웹사이트 상태부터 점검합니다
                  </p>
                  <p className="text-[14px] leading-[1.68] text-slate-600">
                    내부 페이지의 제목, 본문, 색인 상태가 정리되지 않은 상태에서 외부 링크만
                    추가하면 기대한 효과를 얻기 어렵습니다. 사전 분석으로 우선 보완할 지점을 먼저
                    확인합니다.
                  </p>
                </div>

                <div className="lg:col-span-7 overflow-hidden rounded-xl border border-slate-200">
                  <div className="hidden sm:grid sm:grid-cols-12 border-b border-slate-200 bg-slate-50 px-4 py-2.5 text-[11px] font-semibold text-slate-500">
                    <div className="col-span-4">진단 영역</div>
                    <div className="col-span-5">확인 내용</div>
                    <div className="col-span-3 text-right">검토 기준</div>
                  </div>
                  <div className="divide-y divide-[#EAECF0] bg-white text-[13px]">
                    {[
                      {
                        area: '도메인 이력',
                        detail: '신규 도메인 여부 및 기존 외부 링크 이상 신호 확인',
                        stage: '사전 진단',
                      },
                      {
                        area: '랜딩 완성도',
                        detail: '연결할 핵심 서비스 페이지의 설명 명확성·모바일 점검',
                        stage: '선행 확인',
                      },
                      {
                        area: '온페이지 SEO',
                        detail: '페이지 타이틀, 메타 설명, HTTPS 표준 주소 일치 여부',
                        stage: '기초 정비',
                      },
                      {
                        area: '연결 우선순위',
                        detail: '사업 비중이 높은 주력 서비스 URL 선정',
                        stage: '전략 수립',
                      },
                    ].map((row) => (
                      <div
                        key={row.area}
                        className="grid grid-cols-1 gap-1.5 px-4 py-3.5 sm:grid-cols-12 sm:items-center sm:gap-2"
                      >
                        <div className="flex items-center justify-between gap-2 sm:col-span-4 sm:block">
                          <span className="font-semibold text-slate-950">{row.area}</span>
                          <span className="text-[12px] font-medium text-blue-600 sm:hidden">
                            {row.stage}
                          </span>
                        </div>
                        <div className="sm:col-span-5 text-slate-600 leading-snug">{row.detail}</div>
                        <div className="hidden sm:block sm:col-span-3 sm:text-right font-medium text-blue-600">
                          {row.stage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'strategy' && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-11 md:items-center">
                <div className="md:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <p className="text-[12px] font-semibold text-blue-600">외부 문맥 설계</p>
                  <p className="text-[16px] font-semibold text-slate-950">
                    업종 맥락 · 자연스러운 앵커 비율
                  </p>
                  <ul className="space-y-2 border-t border-slate-200 pt-3 text-[13px] text-slate-600">
                    <li>· 브랜드명 중심의 자연스러운 참조 맥락</li>
                    <li>· 서비스 주제와 연결되는 설명형 문구</li>
                    <li>· 기계적 키워드 반복 배제</li>
                  </ul>
                </div>

                <div className="md:col-span-1 flex justify-center">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600">
                    <ArrowRight
                      className="h-4 w-4 rotate-90 md:rotate-0"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <div className="md:col-span-6 space-y-3">
                  {[
                    {
                      url: 'example-corp.co.kr/',
                      role: '대표 브랜드 신뢰 및 기업명 탐색 중심 연결',
                      type: '대표 랜딩',
                    },
                    {
                      url: 'example-corp.co.kr/services',
                      role: '주력 사업과 직접 맞닿은 핵심 서비스 페이지 배분',
                      type: '핵심 서비스',
                    },
                    {
                      url: 'example-corp.co.kr/guides',
                      role: '전문 안내·정보 콘텐츠의 참조 가치 보강',
                      type: '정보 콘텐츠',
                    },
                  ].map((target) => (
                    <div
                      key={target.url}
                      className="rounded-xl border border-slate-200 bg-white p-4 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between gap-2 text-[12px]">
                        <span className="font-semibold text-blue-600 break-all">{target.url}</span>
                        <span className="text-slate-500 shrink-0">{target.type}</span>
                      </div>
                      <p className="text-[13px] text-slate-600">{target.role}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'campaign' && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                {[
                  {
                    step: '검토 01',
                    title: '목표 및 단계 확인',
                    desc: '신규 사이트 정착 단계인지, 기존 사이트의 검색 경쟁력 보강 단계인지에 따라 목표 범위를 구분합니다.',
                  },
                  {
                    step: '검토 02',
                    title: '합리적 예산·속도 설계',
                    desc: '단기간 과도한 물량 투입을 지양하고, 보유 예산 내에서 지속 가능한 진행 속도와 우선 페이지를 조율합니다.',
                  },
                  {
                    step: '검토 03',
                    title: '캠페인 안내 및 공유',
                    desc: '캠페인 진행 기준과 반영 내역을 투명하게 안내하며, SEO·콘텐츠 운영 흐름과 함께 보완합니다.',
                  },
                ].map((item) => (
                  <div
                    key={item.step}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-[12px] font-semibold text-blue-600">{item.step}</p>
                    <p className="mt-2 text-[16px] font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-[13px] leading-[1.65] text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-[13px] text-slate-500">{currentTab.caption}</p>
      </div>
    </div>
  );
}
