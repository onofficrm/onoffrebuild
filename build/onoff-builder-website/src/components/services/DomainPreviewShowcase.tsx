import { useState } from 'react';
import { Lock } from 'lucide-react';

type DomainTab = 'brand' | 'dns' | 'search';

const TABS: { id: DomainTab; label: string; caption: string }[] = [
  {
    id: 'brand',
    label: '브랜드 도메인 구성',
    caption:
      '기업명과 서비스 구조를 직관적으로 보여주는 대표 도메인 및 서브도메인 설계 예시입니다.',
  },
  {
    id: 'dns',
    label: '기존 도메인 연결·메일 보호',
    caption:
      '홈페이지를 새 환경에 연결할 때 기존 기업 이메일 설정(MX 등)을 보호하며 안전하게 전환하는 구조입니다.',
  },
  {
    id: 'search',
    label: '도메인 분석·검색 고려사항',
    caption:
      '대표 주소 통일, HTTPS 보안, 이전 주소 리다이렉트 등 검색 신뢰를 지키기 위한 핵심 점검 항목입니다.',
  },
];

export function DomainPreviewShowcase() {
  const [activeTab, setActiveTab] = useState<DomainTab>('brand');
  const currentTab = TABS.find((t) => t.id === activeTab) ?? TABS[0];

  return (
    <div className="w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="도메인 구성 예시 선택"
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
        <p className="text-[13px] text-slate-500">도메인 콘솔 설계 예시 · 상담 후 실제 적용</p>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-8">
        <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-[0_14px_36px_rgba(16,24,40,0.05)]">
          {/* Minimal Browser / Domain Console Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 bg-slate-50 px-5 py-3">
            <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-[12px] font-medium text-slate-950">
              <Lock className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
              <span>https://brandname.co.kr</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">HTTPS 보안 연결 예시</span>
          </div>

          <div className="p-5 sm:p-8">
            {activeTab === 'brand' && (
              <div className="space-y-4">
                <div className="rounded-xl border border-[#2563EB]/30 bg-blue-50/40 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-semibold text-blue-600">
                      대표 브랜드 도메인 (예시)
                    </p>
                    <p className="mt-1 text-[18px] font-bold tracking-[-0.02em] text-slate-950">
                      https://brandname.co.kr
                    </p>
                  </div>
                  <p className="text-[13px] text-slate-600">
                    명함·제안서·검색 결과의 중심이 되는 공식 대표 주소
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {[
                    {
                      addr: 'brandname.co.kr / services',
                      type: '하위 경로 방식',
                      note: '대표 도메인의 검색 신뢰도를 하나로 모으고 싶을 때 우선 검토',
                    },
                    {
                      addr: 'product.brandname.co.kr',
                      type: '서브도메인 방식',
                      note: '독립된 서비스나 별도 시스템 운영이 필요할 때 구분 설계',
                    },
                    {
                      addr: 'www → 대표 주소 자동 연결',
                      type: '표준 주소 통일',
                      note: '접속 주소가 여러 개로 분산되지 않도록 HTTPS 대표 주소로 통일',
                    },
                  ].map((item) => (
                    <div
                      key={item.type}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <p className="text-[12px] font-semibold text-slate-500">{item.type}</p>
                      <p className="mt-2 text-[14px] font-semibold text-slate-950 break-all">
                        {item.addr}
                      </p>
                      <p className="mt-2 text-[13px] leading-[1.6] text-slate-600">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'dns' && (
              <div className="overflow-hidden rounded-xl border border-slate-200">
                <div className="hidden sm:grid sm:grid-cols-12 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[12px] font-semibold text-slate-500">
                  <div className="sm:col-span-3">DNS 설정 항목</div>
                  <div className="sm:col-span-3">처리 방식</div>
                  <div className="sm:col-span-6">운영 보호 설명</div>
                </div>
                <div className="divide-y divide-[#EAECF0] bg-white">
                  {[
                    {
                      record: '웹 연결 (A / CNAME)',
                      action: '신규 홈페이지로 연결',
                      desc: '새로 제작된 ONOFF Builder 호스팅 환경과 대표 도메인을 안전하게 연결합니다.',
                    },
                    {
                      record: '기업 메일 (MX / SPF / DKIM)',
                      action: '기존 설정 그대로 보존',
                      desc: 'Google Workspace, 네이버 웍스 등 기존 회사 이메일이 중단되지 않도록 사전 확인 후 유지합니다.',
                    },
                    {
                      record: '보안 인증서 (SSL / HTTPS)',
                      action: '적용 및 자동 리다이렉트',
                      desc: '브라우저 보안 경고가 뜨지 않도록 HTTPS 암호화 접속 환경을 구성합니다.',
                    },
                  ].map((row) => (
                    <div
                      key={row.record}
                      className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-12 sm:items-center sm:gap-4"
                    >
                      <div className="sm:col-span-3 text-[14px] font-semibold text-slate-950">
                        {row.record}
                      </div>
                      <div className="sm:col-span-3 text-[13px] font-medium text-blue-600">
                        {row.action}
                      </div>
                      <div className="sm:col-span-6 text-[13px] leading-[1.6] text-slate-600">
                        {row.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    title: '도메인 이력 사전 분석',
                    desc: '신규 구매나 기존 도메인 활용 전, 과거 스팸 활용 이력이나 검색 제한 요소가 없는지 기본 상태를 살핍니다.',
                  },
                  {
                    title: '리뉴얼 시 기존 주소 연결 유지',
                    desc: '기존에 검색되던 주요 페이지 주소가 바뀔 경우 끊긴 페이지(404)가 쌓이지 않도록 리다이렉트 기준을 검토합니다.',
                  },
                  {
                    title: '표준 주소(Canonical) 통일',
                    desc: 'http/https, www 유무가 중복 노출되지 않도록 하나의 대표 주소로 검색엔진 평가를 집중시킵니다.',
                  },
                  {
                    title: '도메인 소유권 및 연장 관리',
                    desc: '도메인 만료로 홈페이지와 메일이 중단되는 사고를 막기 위해 고객사 명의 소유권과 갱신 일정을 투명하게 안내합니다.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-5"
                  >
                    <p className="text-[15px] font-semibold text-slate-950">{item.title}</p>
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
