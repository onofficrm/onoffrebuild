import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type ManagementPreviewTab = 'request' | 'review' | 'ops';

const PREVIEW_TABS: { id: ManagementPreviewTab; label: string; caption: string }[] = [
  {
    id: 'request',
    label: '수정 요청 전달 예시',
    caption:
      '고객은 코드나 편집 도구를 열지 않고 변경할 내용만 자연스럽게 전달하면 됩니다. (협업 흐름 예시)',
  },
  {
    id: 'review',
    label: '변경 검수 및 반영 예시',
    caption:
      '온오프마케팅이 디자인 일관성과 반응형을 확인해 작업한 뒤, 고객 검수를 거쳐 안전하게 반영합니다.',
  },
  {
    id: 'ops',
    label: '호스팅·운영 점검 예시',
    caption:
      '서버, 도메인, SSL 보안 연결, 배포 등 기술적인 운영 업무를 전담 팀이 대신 관리하는 구조 예시입니다.',
  },
];

export function ManagementPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<ManagementPreviewTab>('request');
  const currentTab = PREVIEW_TABS.find((t) => t.id === activeTab) ?? PREVIEW_TABS[0];

  return (
    <div className="w-full">
      {/* Interactive Tab Selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="운영관리 협업 방식 예시 선택"
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
          운영 협업 예시 · 실제 포털 화면이 아닌 진행 구조 안내
        </p>
      </div>

      {/* Preview Stage */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_16px_40px_rgba(16,24,40,0.05)]">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3.5">
            <span className="text-[12px] font-semibold text-slate-950">
              ONOFF Builder 운영관리 협업 예시
            </span>
            <span className="text-[11px] text-slate-500">전담 담당자 기반 관리 예시</span>
          </div>

          {/* Tab 1: Simple Request Flow */}
          {activeTab === 'request' && (
            <div className="grid grid-cols-1 divide-y divide-[#EAECF0] lg:grid-cols-12 lg:divide-x lg:divide-y-0">
              <div className="p-6 sm:p-8 lg:col-span-6">
                <p className="text-[12px] font-semibold text-slate-500">고객 전달 예시</p>
                <p className="mt-2 text-[17px] font-semibold text-slate-950">
                  별도 프로그램 없이 일상 언어로 요청
                </p>
                <div className="mt-5 space-y-3">
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[12px] font-semibold text-blue-600">요청 예시 01 · 문구 및 이미지 변경</p>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-slate-600">
                      “메인 소개 문구를 신규 사업 방향에 맞게 교체하고, 첨부한 대표 이미지를
                      반영해 주세요.”
                    </p>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[12px] font-semibold text-blue-600">요청 예시 02 · 신규 페이지 추가</p>
                    <p className="mt-1.5 text-[14px] leading-[1.6] text-slate-600">
                      “새로 출시하는 B2B 서비스 안내 페이지를 상단 메뉴에 추가하고 상담 폼과
                      연결하고 싶습니다.”
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8 lg:col-span-6">
                <p className="text-[12px] font-semibold text-blue-600">온오프마케팅 검토 및 처리</p>
                <p className="mt-2 text-[17px] font-semibold text-slate-950">
                  작업 범위 안내 후 전문 팀이 직접 반영
                </p>
                <ul className="mt-5 divide-y divide-[#EAECF0] text-[14px]">
                  <li className="py-3.5 first:pt-0">
                    <p className="font-semibold text-slate-950">01. 영향 범위 및 일정 안내</p>
                    <p className="mt-1 text-slate-600">
                      수정 내용과 기존 디자인 시스템 정합성을 확인하고 반영 일정을 안내합니다.
                    </p>
                  </li>
                  <li className="py-3.5">
                    <p className="font-semibold text-slate-950">02. 디자인·코드·반응형 작업 수행</p>
                    <p className="mt-1 text-slate-600">
                      고객이 직접 코드를 만지지 않도록 전문 담당자가 PC와 모바일 화면을 함께
                      정비합니다.
                    </p>
                  </li>
                  <li className="py-3.5 last:pb-0">
                    <p className="font-semibold text-slate-950">03. 사전 확인 링크 전달</p>
                    <p className="mt-1 text-slate-600">
                      실서비스 배포 전 고객이 결과 화면을 직접 확인하고 승인할 수 있도록 안내합니다.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Tab 2: Before / After Review */}
          {activeTab === 'review' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-11 md:items-center">
                <div className="md:col-span-5 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[12px] font-semibold text-slate-500">변경 전 · 기존 화면 예시</p>
                  <div className="mt-4 space-y-2.5">
                    <div className="h-3 w-2/3 rounded-xs bg-[#D0D5DD]" />
                    <div className="h-2.5 w-full rounded-xs bg-[#EAECF0]" />
                    <div className="h-2.5 w-4/5 rounded-xs bg-[#EAECF0]" />
                  </div>
                  <p className="mt-4 text-[13px] text-slate-500">
                    이전 사업 소개 문구 및 구버전 안내 항목 유지 상태
                  </p>
                </div>

                <div className="md:col-span-1 flex justify-center">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600">
                    <ArrowRight className="h-4 w-4 rotate-90 md:rotate-0" aria-hidden="true" />
                  </div>
                </div>

                <div className="md:col-span-5 rounded-xl border border-[#2563EB]/30 bg-white p-5">
                  <p className="text-[12px] font-semibold text-blue-600">변경 후 · 검수 화면 예시</p>
                  <div className="mt-4 space-y-2.5">
                    <div className="h-3 w-3/4 rounded-xs bg-[#101828]/80" />
                    <div className="h-2.5 w-full rounded-xs bg-[#2563EB]/20" />
                    <div className="h-2.5 w-5/6 rounded-xs bg-[#EAECF0]" />
                  </div>
                  <p className="mt-4 text-[13px] font-medium text-slate-950">
                    신규 메시지 반영 · 모바일 레이아웃 검수 완료 후 실서비스 배포
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 border-t border-slate-200 pt-6 sm:grid-cols-3 text-[13px]">
                <div>
                  <p className="font-semibold text-slate-950">레이아웃 일관성 점검</p>
                  <p className="mt-1 text-slate-500">문구 길이가 달라져도 여백과 정렬을 유지</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">모바일·태블릿 확인</p>
                  <p className="mt-1 text-slate-500">모든 기기에서 가독성과 버튼 동작을 검증</p>
                </div>
                <div>
                  <p className="font-semibold text-slate-950">승인 후 안전 배포</p>
                  <p className="mt-1 text-slate-500">고객 최종 확인을 마친 뒤 실서비스에 적용</p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Hosting / Domain / Maintenance Checklist */}
          {activeTab === 'ops' && (
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    category: '호스팅 · 배포 관리',
                    title: '서버 설정 및 배포 절차 일원화',
                    desc: '고객이 서버 콘솔이나 배포 명령을 직접 다룰 필요 없이 온오프마케팅이 안정적으로 배포합니다.',
                  },
                  {
                    category: '도메인 · SSL 보안',
                    title: 'HTTPS 보안 연결 및 도메인 설정 지원',
                    desc: '대표 도메인 연결, 리다이렉트, SSL 보안 인증서 관련 기술 업무를 함께 점검합니다.',
                  },
                  {
                    category: '콘텐츠 · 페이지 확장',
                    title: '사업 변화에 맞춘 지속적인 화면 개선',
                    desc: '신규 서비스 안내 페이지 추가나 불필요해진 섹션 정리까지 협의해 반영합니다.',
                  },
                  {
                    category: '기능 추가 · 제거 상담',
                    title: '과잉 개발을 막는 단계별 확장 검토',
                    desc: '운영 중 실제로 필요해진 기능을 상담으로 검토해 홈페이지 구조에 맞게 추가하거나 정리합니다.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-[12px] font-semibold text-blue-600">{item.category}</p>
                    <p className="mt-2 text-[16px] font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-[13px] text-slate-500">{currentTab.caption}</p>
      </div>
    </div>
  );
}
