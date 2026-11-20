import { useState } from 'react';
import { ArrowRight, Check, MessageSquareText, MoveHorizontal } from 'lucide-react';
import { EDITORIAL_IMAGES } from '../../data/assets';

type MobileTab = 'before' | 'after';

function WebsitePreviewScreen({
  variant,
  imgError,
  onImgError,
}: {
  variant: 'before' | 'after';
  imgError: boolean;
  onImgError: () => void;
}) {
  const isAfter = variant === 'after';

  return (
    <div
      className={`flex h-full min-h-[340px] sm:min-h-[400px] w-full flex-col justify-between ${
        isAfter ? 'bg-white' : 'bg-slate-50'
      }`}
    >
      {/* Mock Site Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5 sm:px-8">
        <span className="text-[12.5px] font-bold tracking-[-0.02em] text-slate-950">
          STANDARD CORP
        </span>
        <div className="hidden sm:flex items-center gap-6 text-[12px] text-slate-500">
          <span>회사소개</span>
          <span>서비스</span>
          <span>사례</span>
          {isAfter && (
            <span className="rounded-[7px] bg-[#2563EB] px-3 py-1 text-[11px] font-semibold text-white">
              상담 문의
            </span>
          )}
        </div>
      </div>

      {/* Mock Site Hero Body */}
      <div className="grid flex-1 grid-cols-1 items-center gap-6 px-5 py-7 sm:px-8 sm:py-9 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-6 space-y-3.5">
          <p
            className={`text-[11.5px] font-semibold ${
              isAfter ? 'text-blue-600' : 'text-slate-400'
            }`}
          >
            {isAfter ? 'B2B 통합 운영 파트너' : '기업 공식 홈페이지'}
          </p>

          <h4
            className={`text-[21px] sm:text-[26px] font-bold leading-[1.26] tracking-[-0.03em] ${
              isAfter ? 'text-slate-950' : 'text-slate-600'
            }`}
          >
            {isAfter ? (
              <>
                복잡한 비즈니스 운영을
                <br />
                하나의 기준으로 연결합니다.
              </>
            ) : (
              <>
                신뢰할 수 있는 기업 파트너,
                <br />
                스탠다드 코퍼레이션입니다.
              </>
            )}
          </h4>

          <p className="text-[13px] leading-[1.6] text-slate-500">
            {isAfter
              ? '업종별 맞춤 구성과 전담 운영관리로 안정적인 도입을 지원합니다.'
              : '다년간의 경험을 바탕으로 고객에게 서비스를 제공하고 있습니다.'}
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            {isAfter && (
              <span className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#2563EB] px-4 py-2.5 text-[12.5px] font-semibold text-white">
                <span>상담 신청하기</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            )}
            <span className="inline-flex items-center rounded-[9px] border border-slate-300 bg-white px-4 py-2.5 text-[12.5px] font-medium text-slate-600">
              회사소개 보기
            </span>
          </div>
        </div>

        {/* Right Visual Area */}
        <div className="md:col-span-6">
          <div className="aspect-[16/10] w-full overflow-hidden rounded-[12px] border border-slate-200 bg-[#EEF2F6]">
            {isAfter && !imgError ? (
              <img
                src={EDITORIAL_IMAGES.heroStudio.src}
                alt="수정 후 메인 배너 적용 예시 화면"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                onError={onImgError}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-[#E2E8F0]/55 px-4 text-center">
                <span className="text-[12px] font-semibold text-slate-500">
                  {isAfter ? '신규 대표 배너 이미지 반영' : '기존 대표 배너 영역'}
                </span>
                <span className="text-[11px] text-slate-400">
                  {isAfter ? '브랜드 톤에 맞춘 교체 예시' : '단순 소개 배너 (변경 전)'}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Status Strip inside Mock Site */}
      <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-2.5 text-[11.5px] sm:px-8">
        <span className={isAfter ? 'font-semibold text-blue-600' : 'font-medium text-slate-500'}>
          {isAfter ? '수정 후 · 배너 교체 및 상담 버튼 반영 (미리보기)' : '수정 전 · 기존 운영 화면'}
        </span>
        {isAfter && (
          <span className="hidden sm:inline-flex items-center gap-1 font-medium text-blue-600">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            PC · 모바일 반응형 검수
          </span>
        )}
      </div>
    </div>
  );
}

export function EasyEditBeforeAfterDemo() {
  // Desktop split position (% of width showing BEFORE on the left, AFTER on the right)
  const [splitPercent, setSplitPercent] = useState<number>(36);
  const [mobileTab, setMobileTab] = useState<MobileTab>('after');
  const [imgError, setImgError] = useState(false);

  return (
    <figure
      role="region"
      aria-label="메인 배너 교체 및 상담 버튼 추가 수정 전후 인터랙티브 비교 시연 화면"
      className="w-full overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      {/* Top Request Prompt Bar (Single Focused Example) */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] bg-blue-50 text-blue-600">
            <MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />
          </span>
          <p className="text-[13.5px] sm:text-[14.5px] font-semibold text-slate-950 truncate">
            “메인 배너를 바꾸고 상담 버튼을 넣어주세요.”
          </p>
        </div>

        {/* Desktop Quick Position Controls */}
        <div className="hidden md:flex items-center gap-1 rounded-[10px] border border-slate-200 bg-white p-1 shrink-0">
          {[
            { label: '수정 전', value: 100 },
            { label: '슬라이더 비교', value: 36 },
            { label: '수정 후', value: 0 },
          ].map((preset) => {
            const active =
              (preset.value === 100 && splitPercent >= 95) ||
              (preset.value === 0 && splitPercent <= 5) ||
              (preset.value === 36 && splitPercent > 5 && splitPercent < 95);
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => setSplitPercent(preset.value)}
                className={`min-h-[30px] rounded-[7px] px-3 py-1 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-[#101828] text-white'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Mobile Tab Switcher (수정 전 / 수정 후) */}
        <div
          role="tablist"
          aria-label="모바일 수정 전후 전환"
          className="flex md:hidden items-center gap-1 rounded-[10px] border border-slate-200 bg-white p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'before'}
            onClick={() => setMobileTab('before')}
            className={`min-h-[36px] flex-1 rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer ${
              mobileTab === 'before'
                ? 'bg-[#101828] text-white'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            수정 전
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === 'after'}
            onClick={() => setMobileTab('after')}
            className={`min-h-[36px] flex-1 rounded-[8px] px-3 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer ${
              mobileTab === 'after'
                ? 'bg-[#2563EB] text-white'
                : 'text-slate-500 hover:text-slate-950'
            }`}
          >
            수정 후
          </button>
        </div>
      </div>

      {/* DESKTOP: Interactive Split Before/After Slider */}
      <div className="hidden md:block relative select-none overflow-hidden bg-white">
        {/* Base Layer: AFTER (visible on right side of divider) */}
        <WebsitePreviewScreen
          variant="after"
          imgError={imgError}
          onImgError={() => setImgError(true)}
        />

        {/* Top Clipped Layer: BEFORE (visible on left side of divider) */}
        <div
          aria-hidden={splitPercent === 0}
          style={{ clipPath: `inset(0 ${100 - splitPercent}% 0 0)` }}
          className="pointer-events-none absolute inset-0"
        >
          <WebsitePreviewScreen
            variant="before"
            imgError={imgError}
            onImgError={() => setImgError(true)}
          />
        </div>

        {/* Vertical Divider & Drag Handle */}
        <div
          aria-hidden="true"
          style={{ left: `${splitPercent}%` }}
          className="pointer-events-none absolute inset-y-0 z-10 -translate-x-1/2 flex items-center"
        >
          <div className="h-full w-[2px] bg-[#2563EB]" />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border border-[#2563EB]/30 bg-white text-blue-600 shadow-[0_4px_14px_rgba(16,24,40,0.12)]">
            <MoveHorizontal className="h-4 w-4" />
          </div>
        </div>

        {/* Subtle Corner Indicators */}
        {splitPercent > 12 && (
          <span className="pointer-events-none absolute top-14 left-4 z-10 rounded-[7px] border border-slate-200 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            수정 전
          </span>
        )}
        {splitPercent < 88 && (
          <span className="pointer-events-none absolute top-14 right-4 z-10 rounded-[7px] border border-[#2563EB]/25 bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-blue-600">
            수정 후
          </span>
        )}

        {/* Accessible Full-Stage Range Slider Overlay */}
        <input
          type="range"
          min={0}
          max={100}
          value={splitPercent}
          onChange={(e) => setSplitPercent(Number(e.target.value))}
          aria-label="수정 전과 수정 후 화면 비교 슬라이더"
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>

      {/* MOBILE: Dedicated Before / After Tabbed Preview */}
      <div className="block md:hidden">
        <WebsitePreviewScreen
          variant={mobileTab}
          imgError={imgError}
          onImgError={() => setImgError(true)}
        />
      </div>

      {/* Honest Managed-Edit Caption Bar */}
      <figcaption className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50 px-4 py-3 text-[12px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span>
          시연 화면 · 고객이 코드를 직접 편집하지 않으며 운영팀이 AI로 수정·검수 후 반영합니다.
        </span>
        <span className="hidden md:inline font-medium text-blue-600 shrink-0">
          좌우로 드래그해 비교해 보세요
        </span>
      </figcaption>
    </figure>
  );
}
