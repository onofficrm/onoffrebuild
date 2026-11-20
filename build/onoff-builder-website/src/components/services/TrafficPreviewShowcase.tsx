import { useState } from 'react';
import { ArrowRight } from 'lucide-react';

type TrafficTab = 'flow' | 'conditions' | 'cautions';

const TABS: { id: TrafficTab; label: string; caption: string }[] = [
  {
    id: 'flow',
    label: '유입 목적과 랜딩 연결',
    caption:
      '방문자가 들어오는 목적과 도착 화면의 메시지가 일치할 때 실질적인 탐색과 상담 검토로 이어집니다.',
  },
  {
    id: 'conditions',
    label: '활용 전 점검 조건',
    caption:
      '트래픽 캠페인을 시작하기 전에 도착 홈페이지가 기본 준비 조건을 갖추었는지 먼저 확인합니다.',
  },
  {
    id: 'cautions',
    label: '서비스 방식·유의사항',
    caption:
      '트래픽 서비스의 역할과 한계를 명확히 안내하여 기대치와 운영 방향을 현실적으로 맞춥니다.',
  },
];

export function TrafficPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<TrafficTab>('flow');
  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="트래픽 서비스 구조 예시 선택"
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
        <p className="text-[13px] text-slate-500">운영 흐름 UI 예시 · 가짜 유입 수치 없음</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_14px_36px_rgba(16,24,40,0.05)]">
          {/* Minimal Workspace Chrome */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">
            <span className="text-[12px] font-semibold text-slate-950">
              TRAFFIC &amp; LANDING ALIGNMENT
            </span>
            <span className="text-[11px] font-medium text-slate-500">진행 구조 예시</span>
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === 'flow' && (
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:items-center">
                {/* Step 1: Purpose */}
                <div className="lg:col-span-4 rounded-xl border border-slate-200 bg-slate-50 p-5 space-y-3">
                  <p className="text-[12px] font-semibold text-blue-600">1단계 · 유입 목적 정리</p>
                  <p className="text-[16px] font-semibold text-slate-950">대상 페이지와 기간 협의</p>
                  <ul className="space-y-2 border-t border-slate-200 pt-3 text-[13px] text-slate-600">
                    <li>· 신규 오픈 / 리뉴얼 홈페이지 초기 인지</li>
                    <li>· 특정 서비스 소개 페이지 집중 연결</li>
                    <li>· 상담 동선 및 화면 반응 확인</li>
                  </ul>
                </div>

                <div className="lg:col-span-1 flex justify-center">
                  <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-blue-600">
                    <ArrowRight
                      className="h-4 w-4 rotate-90 lg:rotate-0"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                {/* Step 2 & 3: Landing Screen Wireframe + Action */}
                <div className="lg:col-span-7 rounded-xl border border-[#2563EB]/30 bg-white p-5">
                  <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3 text-[11px]">
                    <span className="font-semibold text-slate-950">도착 페이지(Landing) 화면 점검 예시</span>
                    <span className="text-blue-600 font-medium">메시지 · 모바일 일치 확인</span>
                  </div>
                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-12 sm:items-center">
                    <div className="sm:col-span-7 space-y-2.5">
                      <div className="h-2.5 w-3/4 rounded-xs bg-[#101828]/80" />
                      <div className="h-2 w-full rounded-xs bg-[#D0D5DD]" />
                      <div className="h-2 w-4/5 rounded-xs bg-[#EAECF0]" />
                      <div className="pt-2 flex items-center gap-2">
                        <span className="rounded-md bg-[#2563EB] px-3 py-1.5 text-[11px] font-medium text-white">
                          상담 문의 연결
                        </span>
                        <span className="rounded-md border border-slate-300 px-3 py-1.5 text-[11px] text-slate-600">
                          서비스 안내
                        </span>
                      </div>
                    </div>
                    <div className="sm:col-span-5 rounded-lg border border-slate-200 bg-slate-50 p-3.5 space-y-2 text-[12px]">
                      <p className="font-semibold text-slate-950">도착 화면 핵심 확인</p>
                      <p className="text-slate-600">· 5초 내 핵심 서비스 이해</p>
                      <p className="text-slate-600">· 모바일 가독성 유지</p>
                      <p className="text-slate-600">· 문의 폼 정상 작동</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'conditions' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    num: '조건 01',
                    title: '명확한 도착 페이지(Landing) 준비',
                    desc: '공사 중이거나 정보가 비어 있는 사이트보다, 핵심 서비스와 안내 문구가 정리된 상태에서 진행해야 효과적입니다.',
                  },
                  {
                    num: '조건 02',
                    title: '모바일 환경 가독성 확보',
                    desc: '모바일 접속 비중이 높은 만큼 화면 깨짐이나 버튼 오류 없이 탐색할 수 있는 반응형 상태를 먼저 확인합니다.',
                  },
                  {
                    num: '조건 03',
                    title: '정상 작동하는 문의·연락 경로',
                    desc: '관심을 가진 방문자가 바로 연락할 수 있도록 문의 폼이나 상담 안내가 정상 동작해야 합니다.',
                  },
                  {
                    num: '조건 04',
                    title: '안정적인 호스팅 및 HTTPS 보안',
                    desc: '접속 지연이나 보안 경고가 발생하지 않도록 도메인·SSL 연결 상태를 점검한 뒤 진행합니다.',
                  },
                ].map((item) => (
                  <div
                    key={item.num}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-[12px] font-semibold text-blue-600">{item.num}</p>
                    <p className="mt-2 text-[15px] font-semibold text-slate-950">{item.title}</p>
                    <p className="mt-1.5 text-[13px] leading-[1.6] text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'cautions' && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-[12px] font-semibold text-blue-600">
                    트래픽 서비스로 기대하는 역할
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.65] text-slate-950">
                    <li>· 신규 오픈 또는 리뉴얼 홈페이지의 초기 방문 흐름 형성</li>
                    <li>· 특정 서비스·캠페인 페이지로의 전략적 유입 연결</li>
                    <li>· 홈페이지 구성과 상담 동선의 실제 반응 점검 보조</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-6">
                  <p className="text-[12px] font-semibold text-slate-500">
                    도입 전 꼭 알아두실 유의사항
                  </p>
                  <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.65] text-slate-600">
                    <li>· 방문 유입만으로 매출이나 특정 검색 순위 상승을 보장하지 않습니다.</li>
                    <li>· 도착 페이지의 설득력과 서비스 경쟁력이 함께 받쳐주어야 합니다.</li>
                    <li>· 단기 유입에만 의존하지 않고 SEO·콘텐츠 운영과 병행하는 것을 권장합니다.</li>
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
