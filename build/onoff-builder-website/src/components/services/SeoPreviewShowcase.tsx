import { useState } from 'react';

type SeoPreviewTab = 'snippet' | 'architecture' | 'mobile';

const SEO_TABS: { id: SeoPreviewTab; label: string; caption: string }[] = [
  {
    id: 'snippet',
    label: '검색 결과와 메타정보',
    caption:
      '페이지 제목과 요약 설명을 명확히 정리하면 검색 결과 화면에서 방문자가 내용을 빠르게 이해할 수 있습니다.',
  },
  {
    id: 'architecture',
    label: '내부링크·페이지 구조',
    caption:
      '메인 페이지에서 핵심 서비스와 안내 콘텐츠로 자연스럽게 연결되는 계층 구조가 검색엔진 탐색을 돕습니다.',
  },
  {
    id: 'mobile',
    label: '모바일 최적화·성과 확인',
    caption:
      '모바일 화면 가독성을 유지하고 검색 노출·유입 흐름을 주기적으로 점검해 개선 방향을 잡습니다.',
  },
];

export function SeoPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<SeoPreviewTab>('snippet');
  const currentTab = SEO_TABS.find((t) => t.id === activeTab) ?? SEO_TABS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="SEO 구조 시각 예시 선택"
          className="inline-flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5"
        >
          {SEO_TABS.map((tab) => {
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

        <p className="text-[13px] text-slate-500">구조 이해를 돕는 설명 예시</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 sm:p-8 lg:p-10">
        {/* Tab 1: Search Result Snippet & Page Metadata Mapping */}
        {activeTab === 'snippet' && (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6 space-y-4">
              <p className="text-[12px] font-semibold text-blue-600">
                검색 결과에 표시되는 모습 (예시)
              </p>

              {/* Simulated Clean Search Result Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
                <p className="text-[12px] text-slate-500">
                  example-corp.co.kr › services › website
                </p>
                <p className="mt-2 text-[18px] font-semibold leading-snug text-blue-700">
                  기업 맞춤형 홈페이지 제작 · 운영 안내 — 기업명
                </p>
                <p className="mt-2 text-[14px] leading-[1.6] text-slate-600">
                  기획부터 디자인, 반응형 구현, 호스팅과 유지보수까지. 우리 사업 구조에 맞춘
                  공식 홈페이지 구축 범위와 진행 절차를 확인하세요.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-200 pt-3 text-[12px] font-medium text-blue-600">
                  <span>서비스 소개</span>
                  <span>진행 절차</span>
                  <span>자주 묻는 질문</span>
                  <span>상담하기</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 lg:border-l lg:border-slate-200 lg:pl-8 space-y-4">
              <p className="text-[12px] font-semibold text-slate-500">
                홈페이지 안에서 정리하는 요소
              </p>
              <div className="divide-y divide-[#EAECF0] rounded-xl border border-slate-200 bg-white px-5">
                <div className="py-4">
                  <p className="text-[14px] font-semibold text-slate-950">
                    페이지 제목 (Title)
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                    모든 페이지가 같은 제목을 쓰지 않고, 각 페이지의 주제를 한 줄로 분명히
                    적습니다.
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-[14px] font-semibold text-slate-950">
                    요약 설명 (Meta Description)
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                    검색 사용자가 클릭하기 전에 이 페이지가 어떤 정보를 다루는지 쉽게 판단하도록
                    요약합니다.
                  </p>
                </div>
                <div className="py-4">
                  <p className="text-[14px] font-semibold text-slate-950">
                    읽기 쉬운 주소 (URL 구조)
                  </p>
                  <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">
                    복잡한 기호 대신 페이지 의미를 알 수 있는 깔끔한 경로 체계를 유지합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Website Hierarchy & Internal Linking */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            <div className="flex flex-col items-center">
              <div className="w-full max-w-[300px] rounded-xl border border-[#2563EB]/40 bg-blue-50/60 px-5 py-3.5 text-center">
                <p className="text-[12px] font-semibold text-blue-600">1단계 · 대표 화면</p>
                <p className="mt-0.5 text-[15px] font-bold text-slate-950">메인 홈페이지 (/)</p>
              </div>

              <div aria-hidden="true" className="h-6 w-px bg-[#D0D5DD]" />

              <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  {
                    level: '2단계 · 핵심 서비스',
                    title: '주요 사업·서비스 상세',
                    children: ['서비스별 핵심 설명', '진행 절차 및 FAQ', '관련 서비스 내부 연결'],
                  },
                  {
                    level: '2단계 · 신뢰 정보',
                    title: '활용사례 · 제작사례 · 안내',
                    children: ['업종별 활용 시나리오', '도입 및 요금 기준 안내', '상담 페이지 이동 동선'],
                  },
                  {
                    level: '2단계 · 정보 콘텐츠',
                    title: '공지 · 자료실 · 인사이트',
                    children: ['고객 질문 중심 콘텐츠', '핵심 서비스로 자연 연결', '정기 업데이트 관리'],
                  },
                ].map((branch) => (
                  <div
                    key={branch.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-[12px] font-semibold text-blue-600">{branch.level}</p>
                    <p className="mt-1.5 text-[16px] font-semibold text-slate-950">
                      {branch.title}
                    </p>
                    <ul className="mt-3.5 space-y-2 border-t border-slate-200 pt-3.5 text-[13px] text-slate-600">
                      {branch.children.map((item) => (
                        <li key={item}>· {item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-[13px] leading-[1.6] text-slate-500">
              고립된 페이지 없이 메인·서비스·콘텐츠가 체계적으로 연결되면, 방문자도 원하는 정보를
              쉽게 찾고 검색엔진도 사이트 전체 구조를 정확히 파악할 수 있습니다.
            </p>
          </div>
        )}

        {/* Tab 3: Mobile Optimization & Performance Review */}
        {activeTab === 'mobile' && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-[12px] font-semibold text-blue-600">모바일 기준 최적화</p>
              <p className="mt-2 text-[17px] font-semibold text-slate-950">
                모바일 화면에서 먼저 읽고 판단합니다
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.65] text-slate-600">
                <li>· 작은 화면에서도 글자 크기와 여백이 깨지지 않는 반응형 레이아웃</li>
                <li>· 불필요하게 무거운 요소를 줄인 깔끔한 페이지 로딩 구조</li>
                <li>· 손가락으로 누르기 편한 메뉴와 상담 버튼 배치</li>
              </ul>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <p className="text-[12px] font-semibold text-blue-600">검색 성과 확인 방식</p>
              <p className="mt-2 text-[17px] font-semibold text-slate-950">
                감이 아닌 실제 검색 데이터로 점검합니다
              </p>
              <ul className="mt-4 space-y-2.5 text-[14px] leading-[1.65] text-slate-600">
                <li>· 검색엔진에 주요 페이지가 누락 없이 색인되었는지 확인</li>
                <li>· 어떤 검색어에서 노출과 클릭이 발생하는지 추이 점검</li>
                <li>· 유입이 부족한 페이지의 제목·문구·내부링크 보완 방향 수립</li>
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
