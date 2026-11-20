import { useState } from 'react';
import {
  CalendarClock,
  Check,
  FileText,
  Globe,
  Mail,
  Send,
  Share2,
} from 'lucide-react';
import { EDITORIAL_IMAGES } from '../../data/assets';

type MockupView = 'website' | 'routine' | 'stepmail' | 'sns';

const MOCKUP_TABS: { id: MockupView; label: string; shortLabel: string }[] = [
  { id: 'website', label: '통합 쇼케이스', shortLabel: '홈페이지' },
  { id: 'routine', label: '콘텐츠 루틴', shortLabel: '루틴' },
  { id: 'stepmail', label: '스텝메일', shortLabel: '스텝메일' },
  { id: 'sns', label: '오토포스터', shortLabel: 'SNS' },
];

export function HomeProductMockup() {
  const [activeView, setActiveView] = useState<MockupView>('website');
  const [heroImgError, setHeroImgError] = useState(false);

  return (
    <figure
      role="region"
      aria-label="ONOFF Builder 홈페이지 및 자동화 도구 통합 화면 예시"
      className="relative mx-auto w-full"
    >
      {/* Minimal Top Bar: Compact View Switcher + Quiet Example Caption */}
      <div className="mb-4 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div
          role="tablist"
          aria-label="ONOFF Builder 제품 화면 예시 전환"
          className="inline-flex w-full sm:w-auto items-center justify-between sm:justify-start gap-1 rounded-[12px] border border-slate-200 bg-slate-50 p-1"
        >
          {MOCKUP_TABS.map((tab) => {
            const selected = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveView(tab.id)}
                className={`min-h-[34px] flex-1 sm:flex-none rounded-[9px] px-3 sm:px-3.5 py-1.5 text-[12.5px] sm:text-[13px] font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer ${
                  selected
                    ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                <span className="sm:hidden">{tab.shortLabel}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <p className="text-[12px] font-medium text-slate-500 sm:text-right">
          화면 예시 · 홈페이지 및 자동화 구성 시안
        </p>
      </div>

      {/* ===================================================================== */}
      {/* DESKTOP / TABLET PRODUCT SHOWCASE (lg and up — large browser + 2 overlays) */}
      {/* ===================================================================== */}
      <div className="hidden lg:block">
        <div className="relative rounded-[18px] border border-slate-200 bg-slate-50 px-10 pt-9 pb-14">
          {activeView === 'website' ? (
            <div className="relative mx-auto max-w-[1040px]">
              {/* Primary Browser Frame */}
              <div className="overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_12px_32px_rgba(16,24,40,0.045)]">
                {/* Browser Top Chrome */}
                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3">
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-[8px] border border-slate-200 bg-white px-4 py-1 text-[11.5px] font-medium text-slate-500 tabular-metrics">
                    <Globe className="h-3 w-3 text-slate-400" aria-hidden="true" />
                    <span>brand-website.co.kr</span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">화면 예시</span>
                </div>

                {/* Inside Preview: Client Website Header */}
                <div className="flex items-center justify-between border-b border-[#F2F4F7] px-8 py-4">
                  <span className="text-[13px] font-bold tracking-[-0.02em] text-slate-950">
                    STANDARD STUDIO
                  </span>
                  <div className="flex items-center gap-7 text-[12px] font-medium text-slate-500">
                    <span className="text-slate-950">소개</span>
                    <span>서비스</span>
                    <span>인사이트</span>
                    <span>포트폴리오</span>
                    <span className="rounded-[8px] bg-[#101828] px-3.5 py-1.5 text-[11.5px] font-medium text-white">
                      상담 문의
                    </span>
                  </div>
                </div>

                {/* Inside Preview: Editorial Website Hero & Visual Canvas */}
                <div className="grid grid-cols-12 items-center gap-8 px-8 pt-9 pb-14">
                  <div className="col-span-5 space-y-4">
                    <p className="text-[11.5px] font-semibold tracking-[-0.01em] text-blue-600">
                      관리형 브랜드 홈페이지
                    </p>
                    <p className="text-[26px] font-bold leading-[1.24] tracking-[-0.03em] text-slate-950">
                      브랜드 신뢰를 높이는
                      <br />
                      공식 웹사이트 운영
                    </p>
                    <p className="text-[13px] leading-[1.6] text-slate-500">
                      콘텐츠 발행과 문의 후속 안내, SNS 채널 배포까지 하나의 홈페이지 흐름으로
                      연결합니다.
                    </p>
                    <div className="flex items-center gap-2.5 pt-1">
                      <span className="rounded-[8px] bg-[#2563EB] px-4 py-2 text-[12px] font-medium text-white">
                        도입 상담 신청
                      </span>
                      <span className="rounded-[8px] border border-slate-300 px-4 py-2 text-[12px] font-medium text-slate-600">
                        사례 보기
                      </span>
                    </div>
                  </div>

                  <div className="col-span-7">
                    <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50">
                      {heroImgError ? (
                        <div className="flex h-full w-full items-center justify-center text-[12px] text-slate-500">
                          기업 홈페이지 대표 화면 예시
                        </div>
                      ) : (
                        <img
                          src={EDITORIAL_IMAGES.corporateHero.src}
                          alt={EDITORIAL_IMAGES.corporateHero.alt}
                          referrerPolicy="no-referrer"
                          loading="eager"
                          decoding="async"
                          onError={() => setHeroImgError(true)}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtle Base Bar inside Website Preview */}
                <div className="grid grid-cols-3 border-t border-[#F2F4F7] bg-slate-50/60 px-8 py-4 text-[11.5px]">
                  <div className="text-slate-600">
                    <span className="font-semibold text-slate-950">자동화 허브</span> · 루틴 ·
                    스텝메일 · 오토포스터
                  </div>
                  <div className="text-center text-slate-600">
                    <span className="font-semibold text-slate-950">쉬운 수정</span> · 자연어 요청
                    검수 반영
                  </div>
                  <div className="text-right text-slate-600">
                    <span className="font-semibold text-slate-950">AI 확장</span> · 업종 맞춤 기능
                    설계
                  </div>
                </div>
              </div>

              {/* Floating UI #1 (Bottom-Left): 콘텐츠 루틴 */}
              <button
                type="button"
                onClick={() => setActiveView('routine')}
                className="group absolute -bottom-7 -left-5 w-[276px] cursor-pointer rounded-[14px] border border-[#E2E8F0] bg-white p-4 text-left shadow-[0_10px_28px_rgba(16,24,40,0.06)] transition-[border-color,box-shadow] duration-150 hover:border-[#2563EB]/40 hover:shadow-[0_12px_32px_rgba(16,24,40,0.08)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-blue-50 text-blue-600">
                      <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-[12.5px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                      콘텐츠 루틴
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400">화면 예시</span>
                </div>

                <div className="mt-3 space-y-2 border-t border-[#F2F4F7] pt-2.5">
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="truncate font-medium text-slate-950">
                      서비스 가이드 초안 생성
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-blue-600">검수 대기</span>
                  </div>
                  <div className="flex items-center justify-between text-[11.5px]">
                    <span className="truncate text-slate-500">매주 화요일 정기 발행 루틴</span>
                    <span className="shrink-0 text-[11px] text-slate-500">승인 흐름</span>
                  </div>
                </div>
              </button>

              {/* Floating UI #2 (Bottom-Right): 이메일 / SNS */}
              <button
                type="button"
                onClick={() => setActiveView('stepmail')}
                className="group absolute -bottom-7 -right-5 w-[292px] cursor-pointer rounded-[14px] border border-[#E2E8F0] bg-white p-4 text-left shadow-[0_10px_28px_rgba(16,24,40,0.06)] transition-[border-color,box-shadow] duration-150 hover:border-[#2563EB]/40 hover:shadow-[0_12px_32px_rgba(16,24,40,0.08)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-slate-950 text-white">
                      <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    </span>
                    <span className="text-[12.5px] font-semibold text-slate-950 group-hover:text-blue-600 transition-colors">
                      이메일 / SNS
                    </span>
                  </div>
                  <span className="text-[10.5px] text-slate-400">화면 예시</span>
                </div>

                <div className="mt-3 space-y-2 border-t border-[#F2F4F7] pt-2.5">
                  <div className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-950">
                      <Mail className="h-3 w-3 text-blue-600" aria-hidden="true" />
                      스텝메일
                    </span>
                    <span className="text-[11px] text-slate-500 tabular-metrics">
                      D+0 안내 → D+2 사례
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 text-[11.5px]">
                    <span className="flex items-center gap-1.5 font-medium text-slate-950">
                      <Share2 className="h-3 w-3 text-blue-600" aria-hidden="true" />
                      오토포스터
                    </span>
                    <span className="text-[11px] text-slate-500">원문 요약 · 채널 예약</span>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <DesktopAutomationStage activeView={activeView} />
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MOBILE / SMALL TABLET DEDICATED PREVIEW (< lg — crisp, zero tiny zoom) */}
      {/* ===================================================================== */}
      <div className="block lg:hidden">
        {activeView === 'website' ? (
          <div className="space-y-3">
            {/* Compact Mobile Browser Preview */}
            <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(16,24,40,0.04)]">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
                <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-slate-500 tabular-metrics">
                  <Globe className="h-3 w-3 text-slate-400" aria-hidden="true" />
                  brand-website.co.kr
                </span>
                <span className="text-[11px] font-medium text-slate-400">화면 예시</span>
              </div>

              <div className="p-4 sm:p-5 space-y-4">
                <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] border border-slate-200 bg-slate-50">
                  {heroImgError ? (
                    <div className="flex h-full w-full items-center justify-center text-[12px] text-slate-500">
                      기업 홈페이지 화면 예시
                    </div>
                  ) : (
                    <img
                      src={EDITORIAL_IMAGES.corporateHero.src}
                      alt={EDITORIAL_IMAGES.corporateHero.alt}
                      referrerPolicy="no-referrer"
                      loading="eager"
                      decoding="async"
                      onError={() => setHeroImgError(true)}
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold text-blue-600">STANDARD STUDIO</p>
                    <p className="mt-1 text-[16px] font-bold leading-[1.3] tracking-[-0.02em] text-slate-950">
                      브랜드 신뢰와 운영 자동화를 하나로
                    </p>
                  </div>
                  <span className="shrink-0 rounded-[8px] bg-[#101828] px-3 py-1.5 text-[11.5px] font-medium text-white">
                    상담 문의
                  </span>
                </div>
              </div>
            </div>

            {/* Two Concise Mobile Automation Cards (Readable 13~14px, Tap to Inspect) */}
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveView('routine')}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition-colors hover:border-slate-300 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-blue-50 text-blue-600">
                    <CalendarClock className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-950">콘텐츠 루틴</p>
                    <p className="truncate text-[12px] text-slate-500">초안 · 검수 · 정기 발행 흐름</p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">예시</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveView('stepmail')}
                className="flex items-center justify-between gap-3 rounded-[14px] border border-slate-200 bg-slate-50 px-4 py-3.5 text-left transition-colors hover:border-slate-300 hover:bg-white cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[9px] bg-slate-950 text-white">
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-950">이메일 / SNS</p>
                    <p className="truncate text-[12px] text-slate-500">스텝메일 · 오토포스터 연계</p>
                  </div>
                </div>
                <span className="shrink-0 text-[11px] text-slate-400">예시</span>
              </button>
            </div>
          </div>
        ) : (
          <MobileAutomationPreview activeView={activeView} />
        )}
      </div>
    </figure>
  );
}

/* ------------------------------------------------------------------------- */
/* Desktop Focused Automation Preview Tabs (Visual-First Workspace Frames)    */
/* ------------------------------------------------------------------------- */

function DesktopAutomationStage({
  activeView,
}: {
  activeView: Exclude<MockupView, 'website'>;
}) {
  const titleMap: Record<Exclude<MockupView, 'website'>, string> = {
    routine: '콘텐츠 루틴 · 정기 발행 워크스페이스',
    stepmail: '스텝메일 · 단계별 이메일 시퀀스',
    sns: '오토포스터 · 홈페이지 연동 SNS 배포',
  };

  return (
    <div className="mx-auto max-w-[1040px] overflow-hidden rounded-[16px] border border-[#E2E8F0] bg-white shadow-[0_12px_32px_rgba(16,24,40,0.045)]">
      {/* Workspace Chrome */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          </div>
          <span className="text-[12px] font-semibold text-slate-950">{titleMap[activeView]}</span>
        </div>
        <span className="text-[11px] font-medium text-slate-400">화면 예시</span>
      </div>

      {activeView === 'routine' && (
        <div className="grid grid-cols-12 gap-6 p-7">
          <div className="col-span-4 space-y-3 rounded-[12px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-[11.5px] font-semibold text-blue-600">발행 루틴 단계</p>
            {[
              { step: '01', name: '월간 주제·주기 설정', done: true },
              { step: '02', name: 'AI 구조화 초안 생성', done: true },
              { step: '03', name: '담당자 사실 검수·승인', done: true },
              { step: '04', name: '홈페이지 정기 발행', done: false },
            ].map((item) => (
              <div
                key={item.step}
                className="flex items-center justify-between rounded-[10px] border border-slate-200 bg-white px-3.5 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-semibold tabular-metrics text-blue-600">
                    {item.step}
                  </span>
                  <span className="text-[13px] font-medium text-slate-950">{item.name}</span>
                </div>
                {item.done && <Check className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />}
              </div>
            ))}
          </div>

          <div className="col-span-8 flex flex-col justify-between rounded-[12px] border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
              <span className="text-[13px] font-semibold text-slate-950">발행 캘린더 대기열</span>
              <span className="text-[11.5px] text-slate-500">검수 승인 원고만 반영</span>
            </div>
            <div className="divide-y divide-[#F2F4F7] py-1">
              {[
                {
                  date: '화 · 09:00',
                  title: '업종별 홈페이지 리뉴얼 체크리스트',
                  channel: '인사이트',
                  state: '검수 완료',
                },
                {
                  date: '목 · 10:00',
                  title: '문의 전환율을 높이는 상담 폼 구성 기준',
                  channel: '가이드',
                  state: '초안 검토',
                },
                {
                  date: '다음 주 화',
                  title: '관리형 운영으로 유지보수 부담 줄이기',
                  channel: '인사이트',
                  state: '주제 확정',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-center justify-between gap-4 py-3.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="truncate text-[13.5px] font-semibold text-slate-950">
                        {item.title}
                      </p>
                      <p className="text-[11.5px] text-slate-500">
                        {item.date} · {item.channel}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 text-[12px] font-medium text-blue-600">
                    {item.state}
                  </span>
                </div>
              ))}
            </div>
            <p className="border-t border-[#F2F4F7] pt-3 text-[11.5px] text-slate-500">
              화면 예시 · 실제 제공 범위 및 연동 상태는 기능 상세 페이지에서 확인하세요.
            </p>
          </div>
        </div>
      )}

      {activeView === 'stepmail' && (
        <div className="grid grid-cols-12 gap-6 p-7">
          <div className="col-span-7 space-y-3">
            <p className="text-[11.5px] font-semibold text-blue-600">문의 고객 단계별 시퀀스</p>
            {[
              {
                day: 'D+0',
                title: '문의 접수 확인 및 회사 소개서 안내',
                desc: '수신 동의 고객 대상 기본 자료 즉시 안내',
              },
              {
                day: 'D+2',
                title: '업종별 활용 방식 및 자주 묻는 질문',
                desc: '도입 검토 단계에서 필요한 운영 기준 요약',
              },
              {
                day: 'D+5',
                title: '1:1 맞춤 상담 일정 제안',
                desc: '관심 서비스가 연결된 상담 페이지로 자연 이동',
              },
            ].map((step) => (
              <div
                key={step.day}
                className="flex items-start gap-4 rounded-[12px] border border-slate-200 bg-slate-50 px-4 py-3.5"
              >
                <span className="mt-0.5 min-w-[36px] text-[12px] font-bold tabular-metrics text-blue-600">
                  {step.day}
                </span>
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-950">{step.title}</p>
                  <p className="mt-0.5 text-[12px] text-slate-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="col-span-5 flex flex-col justify-between rounded-[12px] border border-slate-200 bg-white p-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#F2F4F7] pb-3">
                <span className="text-[12.5px] font-semibold text-slate-950">메일 미리보기</span>
                <span className="text-[11px] text-slate-400">D+0</span>
              </div>
              <p className="text-[13.5px] font-semibold text-slate-950">
                [안내] 요청하신 홈페이지 구축 기준 자료입니다
              </p>
              <p className="text-[12.5px] leading-[1.6] text-slate-600">
                문의해 주셔서 감사합니다. 업종별 구성 예시와 운영관리 기준을 정리해 드립니다.
                검토 후 편하신 일정에 상담을 이어가실 수 있습니다.
              </p>
              <div className="pt-1">
                <span className="inline-block rounded-[8px] bg-[#2563EB] px-3.5 py-1.5 text-[11.5px] font-medium text-white">
                  맞춤 상담 이어가기
                </span>
              </div>
            </div>
            <p className="mt-4 border-t border-[#F2F4F7] pt-3 text-[11.5px] text-slate-500">
              화면 예시 · 명시적 수신 동의(옵트인) 및 수신 거부 기준 준수
            </p>
          </div>
        </div>
      )}

      {activeView === 'sns' && (
        <div className="grid grid-cols-12 gap-6 p-7">
          <div className="col-span-5 flex flex-col justify-between rounded-[12px] border border-slate-200 bg-slate-50 p-5">
            <div className="space-y-2.5">
              <p className="text-[11.5px] font-semibold text-blue-600">홈페이지 원본 콘텐츠</p>
              <p className="text-[16px] font-bold leading-[1.35] text-slate-950">
                홈페이지에 발행한 글을
                <br />
                채널별 요약으로 자동 정리
              </p>
              <p className="text-[12.5px] leading-[1.6] text-slate-600">
                원본 링크와 핵심 메시지를 유지한 채 각 채널 형식에 맞춰 검수·예약 흐름으로
                연결합니다.
              </p>
            </div>
            <p className="mt-5 border-t border-slate-200 pt-3 text-[11.5px] text-slate-500">
              화면 예시 · 홈페이지 전환 링크 자동 포함 구조
            </p>
          </div>

          <div className="col-span-7 divide-y divide-[#F2F4F7] rounded-[12px] border border-slate-200 bg-white px-5">
            {[
              {
                channel: 'Instagram',
                format: '카드 요약 + 핵심 3줄',
                state: '검수 대기',
              },
              {
                channel: 'LinkedIn',
                format: 'B2B 인사이트 요약 + 원문 링크',
                state: '예약 구성',
              },
              {
                channel: 'Naver / Blog',
                format: '검색형 소제목 요약 + 상담 링크',
                state: '배포 흐름',
              },
            ].map((row) => (
              <div key={row.channel} className="flex items-center justify-between gap-4 py-4">
                <div>
                  <p className="text-[13.5px] font-semibold text-slate-950">{row.channel}</p>
                  <p className="mt-0.5 text-[12px] text-slate-500">{row.format}</p>
                </div>
                <span className="shrink-0 text-[12px] font-medium text-blue-600">{row.state}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------- */
/* Mobile Dedicated Automation Preview (Clean, Readable, Zero Pinch-Zoom)     */
/* ------------------------------------------------------------------------- */

function MobileAutomationPreview({
  activeView,
}: {
  activeView: Exclude<MockupView, 'website'>;
}) {
  const content: Record<
    Exclude<MockupView, 'website'>,
    { title: string; rows: { tag: string; label: string; meta: string }[] }
  > = {
    routine: {
      title: '콘텐츠 루틴 흐름',
      rows: [
        { tag: '01', label: '주제·발행 주기 설정', meta: '월간 캘린더' },
        { tag: '02', label: 'AI 구조화 초안 작성', meta: '브랜드 톤' },
        { tag: '03', label: '담당자 검수 후 반영', meta: '승인 발행' },
      ],
    },
    stepmail: {
      title: '스텝메일 시퀀스',
      rows: [
        { tag: 'D+0', label: '접수 확인 및 소개서 안내', meta: '즉시 안내' },
        { tag: 'D+2', label: '업종별 활용 사례 요약', meta: '신뢰 형성' },
        { tag: 'D+5', label: '맞춤 상담 일정 연결', meta: '전환 유도' },
      ],
    },
    sns: {
      title: '오토포스터 배포 흐름',
      rows: [
        { tag: '원본', label: '홈페이지 공지·인사이트 글', meta: '기준 원문' },
        { tag: '요약', label: '채널별 메시지·이미지 검수', meta: '사전 확인' },
        { tag: '연결', label: '예약 일정 및 홈페이지 링크', meta: '유입 회귀' },
      ],
    },
  };

  const current = content[activeView];

  return (
    <div className="overflow-hidden rounded-[16px] border border-slate-200 bg-white shadow-[0_6px_20px_rgba(16,24,40,0.04)]">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <span className="text-[12.5px] font-semibold text-slate-950">{current.title}</span>
        <span className="text-[11px] font-medium text-slate-400">화면 예시</span>
      </div>
      <div className="divide-y divide-[#F2F4F7] px-4">
        {current.rows.map((row) => (
          <div key={row.tag} className="flex items-center justify-between gap-3 py-3.5">
            <div className="flex items-center gap-3 min-w-0">
              <span className="min-w-[34px] text-[12px] font-semibold tabular-metrics text-blue-600">
                {row.tag}
              </span>
              <span className="truncate text-[13.5px] font-medium text-slate-950">{row.label}</span>
            </div>
            <span className="shrink-0 text-[11.5px] text-slate-500">{row.meta}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
