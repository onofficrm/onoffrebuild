import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type ContentTab = 'workflow' | 'status' | 'quality';

const TABS: { id: ContentTab; label: string; caption: string }[] = [
  {
    id: 'workflow',
    label: '기획·초안·검수 흐름',
    caption:
      'AI 초안으로 작성 시간을 줄이되, 담당자 편집과 고객 사실 검수를 거쳐 브랜드 신뢰를 지키는 제작 흐름 예시입니다.',
  },
  {
    id: 'status',
    label: '현재 제공 및 연동 범위',
    caption:
      '현재 상담·지원 가능한 제작 범위와, 아직 자동화되지 않은 연동 예정 항목을 투명하게 구분합니다.',
  },
  {
    id: 'quality',
    label: '편집·검수 화면 예시',
    caption:
      'AI 초안을 그대로 게시하지 않고 사실 관계와 브랜드 어조, SEO·GEO 구조를 검수하는 편집 예시입니다.',
  },
];

export function ContentPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<ContentTab>('workflow');
  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="AI 콘텐츠 워크플로 예시 선택"
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
        <p className="text-[13px] text-slate-500">
          워크플로 예시 · 미구현 자동 연동은 준비 중 표기
        </p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_14px_36px_rgba(16,24,40,0.05)]">
          {/* Minimal Editorial Workspace Chrome */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <span className="text-[12px] font-semibold text-slate-950">
              AI CONTENT EDITORIAL WORKFLOW
            </span>
            <span className="text-[11px] font-medium text-slate-500">협업 구조 예시</span>
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === 'workflow' && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                {[
                  {
                    step: '01',
                    title: '콘텐츠 기획',
                    detail:
                      '업종 주제, 타깃 질문, 핵심 키워드와 글의 목적(안내·상담 연결)을 정리합니다.',
                  },
                  {
                    step: '02',
                    title: 'AI 초안 작성',
                    detail:
                      '기획된 목차와 기업 기초 자료를 바탕으로 구조화된 1차 원고 초안을 빠르게 생성합니다.',
                  },
                  {
                    step: '03',
                    title: '담당자 검수·편집',
                    detail:
                      '사실 관계, 브랜드 어조, 부자연스러운 문장을 담당자와 고객사가 함께 검수해 다듬습니다.',
                  },
                  {
                    step: '04',
                    title: '웹 발행 반영',
                    detail:
                      '검수가 끝난 원고를 협의된 운영 방식으로 홈페이지 게시판·안내 영역에 정갈하게 게시합니다.',
                  },
                ].map((stage, idx) => (
                  <div
                    key={stage.step}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold tabular-nums text-blue-600">
                          Step {stage.step}
                        </span>
                        {idx < 3 && (
                          <ArrowRight
                            className="hidden md:block h-4 w-4 text-slate-400"
                            aria-hidden="true"
                          />
                        )}
                      </div>
                      <p className="mt-3 text-[16px] font-semibold text-slate-950">{stage.title}</p>
                      <p className="mt-2 text-[13px] leading-[1.6] text-slate-600">
                        {stage.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'status' && (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="hidden sm:grid sm:grid-cols-12 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[12px] font-semibold text-slate-500">
                  <div className="sm:col-span-4">항목</div>
                  <div className="sm:col-span-3">제공 구분</div>
                  <div className="sm:col-span-5">현재 안내 기준</div>
                </div>
                <div className="divide-y divide-[#EAECF0] bg-white">
                  {[
                    {
                      feature: '주제 기획 · AI 초안 · 편집 검수',
                      status: '제공 범위 상담',
                      statusColor: 'text-blue-600',
                      desc: '기업 자료와 업종 기준에 맞춰 초안 제작부터 검수 완료 원고 납품까지 협의 진행합니다.',
                    },
                    {
                      feature: '홈페이지 내 콘텐츠 반영(운영 연계)',
                      status: '제공 범위 상담',
                      statusColor: 'text-blue-600',
                      desc: 'ONOFF Builder 운영관리와 함께 이용 시 검수 완료 원고의 웹 게시를 담당자가 반영합니다.',
                    },
                    {
                      feature: 'ONOFF Builder 시스템 완전 자동 연동 발행',
                      status: '연동 준비 중',
                      statusColor: 'text-slate-500',
                      desc: '별도 담당자 절차 없이 시스템 간 자동 배포되는 완전 연동 기능은 현재 준비 단계입니다.',
                    },
                    {
                      feature: '외부 SNS·블로그 자동 게시 연동',
                      status: '연동 준비 중 / 제공 범위 상담',
                      statusColor: 'text-slate-500',
                      desc: '외부 SNS 자동 발행 기능은 기본 제공되지 않으며, 원고 활용 방식은 별도 상담으로 안내합니다.',
                    },
                  ].map((row) => (
                    <div
                      key={row.feature}
                      className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-12 sm:items-center sm:gap-4"
                    >
                      <div className="sm:col-span-4 text-[14px] font-semibold text-slate-950">
                        {row.feature}
                      </div>
                      <div className={`sm:col-span-3 text-[13px] font-semibold ${row.statusColor}`}>
                        {row.status}
                      </div>
                      <div className="sm:col-span-5 text-[13px] leading-[1.6] text-slate-600">
                        {row.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'quality' && (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Simulated Editorial Draft Card */}
                <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-4">
                  <div className="flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-blue-600">원고 초안 · 편집 예시</span>
                    <span className="text-slate-500">담당자 검수 대기</span>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-white p-4 space-y-2.5">
                    <p className="text-[15px] font-bold text-slate-950">
                      기업 홈페이지 리뉴얼 전 반드시 확인해야 할 4가지 기준
                    </p>
                    <p className="text-[13px] leading-[1.65] text-slate-600">
                      기존 도메인과 이메일 연결을 유지하면서 모바일 가독성과 상담 동선을 함께
                      개선하기 위한 사전 체크 항목을 정리합니다.
                    </p>
                    <div className="border-t border-[#F2F4F7] pt-3 text-[12px] text-slate-500">
                      목차 구조: 01. 도메인·메일 보호 · 02. 페이지 계층 정리 · 03. SEO 기본 설정 ·
                      04. 운영관리 기준
                    </div>
                  </div>
                </div>

                {/* Human Review Checklist */}
                <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-3">
                  <p className="text-[13px] font-semibold text-slate-950">담당자 검수 체크리스트</p>
                  <ul className="divide-y divide-[#EAECF0] text-[13px]">
                    <li className="py-2.5 first:pt-0 text-slate-600">
                      <span className="font-semibold text-slate-950">사실 정확성</span> · 허위
                      수치·과장 표현 제거 확인
                    </li>
                    <li className="py-2.5 text-slate-600">
                      <span className="font-semibold text-slate-950">브랜드 어조</span> · 공식
                      홈페이지 문체 일관성 점검
                    </li>
                    <li className="py-2.5 text-slate-600">
                      <span className="font-semibold text-slate-950">검색 구조</span> · 소제목
                      계층 및 질문·답변 정리
                    </li>
                    <li className="py-2.5 last:pb-0 text-slate-600">
                      <span className="font-semibold text-slate-950">최종 승인</span> · 고객사
                      확인 완료 후 웹 게시 진행
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="mt-4 text-[13px] text-slate-500">{currentTab.caption}</p>
      </div>
    </div>
  );
}
