import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type GeoPreviewTab = 'shift' | 'workflow' | 'boundary';

const GEO_TABS: { id: GeoPreviewTab; label: string; caption: string }[] = [
  {
    id: 'shift',
    label: 'AI 검색과 웹사이트 구조',
    caption:
      'AI 검색은 모호한 광고 문구보다 사실에 기반해 구조화된 공식 웹사이트 정보를 더 정확하게 해석합니다. (특정 인용 결과를 보장하지 않습니다.)',
  },
  {
    id: 'workflow',
    label: 'GEO Analyzer 진단 흐름',
    caption:
      'GEO Analyzer로 현재 상태를 객관적으로 분석한 뒤, 개선 방향 제안과 재측정까지 단계적으로 관리합니다.',
  },
  {
    id: 'boundary',
    label: 'GEO UP과 홈페이지 반영 구분',
    caption:
      '분석·개선 캠페인(GEO UP)과 실제 홈페이지 소스 수정·배포는 역할과 범위를 명확히 구분하여 진행합니다.',
  },
];

export function GeoPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<GeoPreviewTab>('shift');
  const currentTab = GEO_TABS.find((t) => t.id === activeTab) ?? GEO_TABS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="GEO 구조 시각 예시 선택"
          className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5"
        >
          {GEO_TABS.map((tab) => {
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

        <p className="text-[13px] text-slate-500">개념 설명 예시 · 인용 보장 아님</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10">
        {/* Tab 1: AI Search Shift & Structured Official Info */}
        {activeTab === 'shift' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-[12px] font-semibold text-blue-600">
                변화한 고객 질문 방식 (예시)
              </p>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6 space-y-4">
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold text-slate-500">사용자 질문 예시</p>
                  <p className="mt-1 text-[14px] font-medium text-slate-950">
                    “기업 홈페이지를 제작하고 오픈 후 유지보수까지 맡길 수 있는 관리형 서비스는
                    어떤 기준으로 고르면 좋을까요?”
                  </p>
                </div>

                <div className="space-y-2 px-1">
                  <p className="text-[11px] font-semibold text-blue-600">
                    AI 검색이 공식 웹사이트에서 확인하는 요소
                  </p>
                  <p className="text-[14px] leading-[1.65] text-slate-600">
                    서비스의 정확한 정의, 제공 범위, DIY와의 차이, 진행 절차, 자주 묻는 질문이
                    명확한 문장으로 정리된 공식 페이지를 우선 참고하여 요약합니다.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:border-l lg:border-slate-200 lg:pl-8">
              <p className="text-[12px] font-semibold text-slate-500">
                AI가 이해하기 쉬운 홈페이지 정보 조건
              </p>
              <div className="mt-4 divide-y divide-[#EAECF0] rounded-xl border border-slate-200 bg-white px-5">
                <div className="py-4">
                  <p className="text-[14px] font-semibold text-slate-950">
                    명확한 기업·서비스 정의
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                    이미지 안에만 글자를 넣지 않고, 텍스트로 “무엇을 제공하는 기업인지” 분명히
                    서술합니다.
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-[14px] font-semibold text-slate-950">
                    질문·답변(FAQ) 중심 구조
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                    고객이 실제로 묻는 기준과 답변을 간결한 문장으로 정리해 오해 소지를 줄입니다.
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-[14px] font-semibold text-slate-950">
                    일관된 문서 계층과 구조화
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                    제목(H1~H3), 본문, 목록이 논리적으로 정리되어 사람과 시스템 모두가 쉽게 읽을
                    수 있게 합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: GEO Analyzer Diagnosis Loop */}
        {activeTab === 'workflow' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
              {[
                {
                  step: '01',
                  title: 'GEO Analyzer 분석',
                  desc: '현재 웹사이트가 AI 검색 환경에서 어떻게 해석되고 있는지 핵심 항목을 점검합니다.',
                },
                {
                  step: '02',
                  title: '콘텐츠·구조 진단',
                  desc: '누락된 서비스 설명, 모호한 표현, 문서 계층 및 구조화 보완 지점을 찾습니다.',
                },
                {
                  step: '03',
                  title: '개선 방향 제안',
                  desc: '우선순위가 높은 페이지부터 문구 정리, FAQ 보강, 구조 개선안을 제안합니다.',
                },
                {
                  step: '04',
                  title: '재측정 및 관리',
                  desc: '개선 사항이 반영된 이후 변화 여부를 다시 측정하고 후속 관리 방향을 잡습니다.',
                },
              ].map((item, idx) => (
                <div key={item.step} className="relative flex flex-col">
                  <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] font-semibold tabular-nums text-blue-600">
                        Step {item.step}
                      </span>
                      {idx < 3 && (
                        <ArrowRight
                          className="hidden md:block h-4 w-4 text-slate-400"
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <p className="mt-3 text-[15px] font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-2 text-[13px] leading-[1.6] text-slate-600">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: GEO UP Campaign vs Website Source Modification */}
        {activeTab === 'boundary' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-[#2563EB]/30 bg-slate-50 p-6">
              <p className="text-[12px] font-semibold text-blue-600">
                영역 A · GEO UP 분석·개선 캠페인
              </p>
              <p className="mt-2 text-[17px] font-semibold text-slate-950">
                진단 · 전략 수립 · 재측정 중심
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.65] text-slate-600">
                <li>· GEO Analyzer를 활용한 현황 분석 및 리포트 정리</li>
                <li>· AI 검색 관점의 콘텐츠 누락 및 사이트 구조 진단</li>
                <li>· 우선 보완해야 할 페이지와 문구·FAQ 개선 방향 제안</li>
                <li>· 개선 적용 이후 재측정 및 정기 점검 관리</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <p className="text-[12px] font-semibold text-slate-500">
                영역 B · 실제 홈페이지 소스 수정·배포
              </p>
              <p className="mt-2 text-[17px] font-semibold text-slate-950">
                실제 코드 반영 · 페이지 개편 · 배포 작업
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.65] text-slate-600">
                <li>· 진단 결과에 따른 실제 HTML·구조화 마크업·소스 코드 수정</li>
                <li>· 신규 안내 섹션, FAQ, 콘텐츠 페이지 디자인 및 구현</li>
                <li>· 테스트 검수 후 실서비스 홈페이지 배포</li>
                <li>· ONOFF Builder 제작·운영관리 또는 고객사 개발팀과 별도 협의 진행</li>
              </ul>
            </div>
          </div>
        )}

        <p className="mt-6 border-t border-slate-200 pt-4 text-[13px] text-slate-500">
          {currentTab.caption}
        </p>
      </div>
    </div>
  );
}
