import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MousePointerClick,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

type ScenarioId = 'website-inquiry' | 'brochure-download' | 'automation-consult';
type CadenceId = 'standard' | 'fast';

interface DemoStep {
  id: string;
  stepNo: string;
  title: string;
  standardTiming: string;
  fastTiming: string;
  kind: 'trigger' | 'email' | 'review';
  senderExample: string;
  subject: string;
  bodyParagraphs: string[];
  ctaLabel: string;
  targetPath: string;
  complianceNote: string;
}

interface DemoScenario {
  id: ScenarioId;
  label: string;
  triggerSource: string;
  steps: DemoStep[];
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'website-inquiry',
    label: '홈페이지 제작 문의',
    triggerSource: '홈페이지 상담 폼 (수신 동의 체크)',
    steps: [
      {
        id: 'trigger',
        stepNo: '01',
        title: '고객 문의 접수',
        standardTiming: 'D+0',
        fastTiming: 'D+0',
        kind: 'trigger',
        senderExample: '홈페이지 상담 폼 → 스텝메일 연결',
        subject: '홈페이지 제작 상담 요청 접수 (시연 트리거)',
        bodyParagraphs: [
          '홈페이지 상담 폼에서 관심 서비스와 이메일, 명시적 수신 동의를 접수하면 시퀀스가 시작됩니다.',
          '외부 툴로 수동 복사하지 않고 홈페이지 문의 접점과 후속 안내 흐름을 하나로 잇습니다.',
        ],
        ctaLabel: '홈페이지 문의 폼 연결',
        targetPath: '/contact?service=website',
        complianceNote: '수신 동의 기록 및 실발송 엔진은 연동 준비 중입니다.',
      },
      {
        id: 'welcome',
        stepNo: '02',
        title: '환영 메일',
        standardTiming: '즉시',
        fastTiming: '즉시',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[안내] 홈페이지 제작 상담이 접수되었습니다 — 진행 순서를 먼저 보내드립니다',
        bodyParagraphs: [
          '안녕하세요, 담당자님. ONOFF Builder 홈페이지 제작 문의를 남겨 주셔서 감사합니다.',
          '남겨 주신 업종과 요청을 확인 중이며, 상담 전 미리 보실 수 있는 기본 제작 구성과 진행 순서를 함께 전달드립니다.',
        ],
        ctaLabel: '홈페이지 제작 구성 보기',
        targetPath: '/website',
        complianceNote: '하단 수신거부 링크 및 발신 인증(SPF·DKIM) 연동 준비 중',
      },
      {
        id: 'intro',
        stepNo: '03',
        title: '안내 · 사례 메일',
        standardTiming: '3일 후',
        fastTiming: '1일 후',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[가이드] 오픈 후에도 멈추지 않는 홈페이지 운영·자동화 구조 안내',
        bodyParagraphs: [
          '홈페이지 구축 시 가장 많이 고민하시는 부분은 오픈 이후 수정과 콘텐츠 운영입니다.',
          'ONOFF Builder는 관리형 홈페이지 위에 콘텐츠 루틴, 스텝메일, 자연어 기반 쉬운 수정 구조를 연결해 운영 부담을 줄입니다.',
        ],
        ctaLabel: '업종별 활용사례 확인',
        targetPath: '/use-cases',
        complianceNote: '홈페이지 원본 콘텐츠와 연계한 정보성 안내 구성 예시',
      },
      {
        id: 'consult',
        stepNo: '04',
        title: '상담 CTA 메일',
        standardTiming: '7일 후',
        fastTiming: '4일 후',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[상담 안내] 우리 사업에 필요한 범위만 정리해 개별 견적을 안내해 드립니다',
        bodyParagraphs: [
          '초기 제작비, 월 운영관리, 선택형 기능은 필요한 범위만 골라 구성할 수 있습니다.',
          '현재 운영 중인 사이트 주소나 희망 일정을 알려주시면 현실적인 구성안과 견적 기준을 정리해 드립니다.',
        ],
        ctaLabel: '요금 구조 및 상담 일정 확인',
        targetPath: '/pricing',
        complianceNote: '관심 서비스가 사전 선택된 상담 페이지로 자연 연결',
      },
      {
        id: 'reaction',
        stepNo: '05',
        title: '고객 반응 점검',
        standardTiming: '종료 후',
        fastTiming: '종료 후',
        kind: 'review',
        senderExample: '운영자 확인 화면 (시연 예시)',
        subject: '단계별 진행 상태 · 재방문 · 회신 여부 점검',
        bodyParagraphs: [
          '실제 발송 엔진이 연동되었을 때 링크 이동, 수신거부 요청, 재문의 여부를 한 흐름으로 점검하는 구조입니다.',
          '본 시연 화면은 가짜 열람률이나 허위 전환 수치를 생성하지 않습니다.',
        ],
        ctaLabel: '담당자 후속 상담 연계',
        targetPath: '/contact?service=stepmail',
        complianceNote: '실제 발송·트래킹·수신거부 자동 반영은 연동 준비 중입니다.',
      },
    ],
  },
  {
    id: 'brochure-download',
    label: '소개서·자료 요청',
    triggerSource: '홈페이지 소개서 요청 폼 (수신 동의)',
    steps: [
      {
        id: 'trigger',
        stepNo: '01',
        title: '자료 요청 접수',
        standardTiming: 'D+0',
        fastTiming: 'D+0',
        kind: 'trigger',
        senderExample: '홈페이지 자료 요청 → 스텝메일 연결',
        subject: '서비스 소개 자료 요청 접수 (시연 트리거)',
        bodyParagraphs: [
          '소개 자료를 요청한 방문자에게 자료 링크만 전달하고 끝나지 않도록 후속 안내 흐름을 연결합니다.',
          '명시적 수신 동의가 확인된 요청 건에 한해 시나리오를 적용합니다.',
        ],
        ctaLabel: '소개 자료 요청 접점 구성',
        targetPath: '/features',
        complianceNote: '수신 동의 기록 및 실발송 엔진은 연동 준비 중입니다.',
      },
      {
        id: 'welcome',
        stepNo: '02',
        title: '환영 · 자료 전달',
        standardTiming: '즉시',
        fastTiming: '즉시',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[자료 전달] 요청하신 ONOFF Builder 플랫폼 안내 자료를 보내드립니다',
        bodyParagraphs: [
          '요청하신 ONOFF Builder 소개 자료와 기본 기능 구성 안내를 보내드립니다.',
          '홈페이지 제작·운영 범위와 3대 자동화 도구의 제공 기준을 한눈에 확인하실 수 있습니다.',
        ],
        ctaLabel: '기본 기능 전체 보기',
        targetPath: '/features',
        complianceNote: '하단 수신거부 링크 및 발신 인증(SPF·DKIM) 연동 준비 중',
      },
      {
        id: 'intro',
        stepNo: '03',
        title: '핵심 기능 안내',
        standardTiming: '3일 후',
        fastTiming: '1일 후',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[안내] 편집기를 배우지 않고 말로 요청하는 쉬운 홈페이지 수정 방식',
        bodyParagraphs: [
          '오픈 후 수정할 때마다 편집 도구를 익히거나 외주 담당자를 찾는 과정은 큰 부담이 됩니다.',
          'ONOFF Builder는 자연어로 요청하면 디자인 일관성을 유지하며 검수 후 반영하는 관리형 운영을 제공합니다.',
        ],
        ctaLabel: '쉬운 홈페이지 수정 보기',
        targetPath: '/features/easy-edit',
        complianceNote: '실무 검토 단계에 맞춘 정보 제공형 이메일 예시',
      },
      {
        id: 'consult',
        stepNo: '04',
        title: '맞춤 상담 CTA',
        standardTiming: '7일 후',
        fastTiming: '4일 후',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[안내] 내부 검토 중 궁금하신 점은 부담 없이 질문해 주세요',
        bodyParagraphs: [
          '소개 자료를 살펴보시면서 업종별 기능 범위나 예상 일정이 궁금하실 수 있습니다.',
          '간단한 목적만 남겨 주시면 초기 제작과 월 운영, 선택 기능 구분을 투명하게 정리해 드립니다.',
        ],
        ctaLabel: '맞춤 범위 상담 신청',
        targetPath: '/contact?service=stepmail',
        complianceNote: '관심 서비스가 사전 선택된 상담 페이지로 연결',
      },
      {
        id: 'reaction',
        stepNo: '05',
        title: '고객 반응 점검',
        standardTiming: '종료 후',
        fastTiming: '종료 후',
        kind: 'review',
        senderExample: '운영자 확인 화면 (시연 예시)',
        subject: '관심 기능 페이지 · 상담 전환 여부 확인',
        bodyParagraphs: [
          '단순 일괄 발송에 그치지 않고 홈페이지 재방문과 상담 전환 흐름을 한 기준에서 확인합니다.',
          '실제 발송 로그, 수신거부 처리, 사용량 집계는 연동 준비 중입니다.',
        ],
        ctaLabel: '상담 전환 기준 점검',
        targetPath: '/contact?service=stepmail',
        complianceNote: '실제 발송·트래킹·수신거부 자동 반영은 연동 준비 중입니다.',
      },
    ],
  },
  {
    id: 'automation-consult',
    label: '운영 전환 문의',
    triggerSource: '기존 홈페이지 보유 기업 전환 상담',
    steps: [
      {
        id: 'trigger',
        stepNo: '01',
        title: '전환 상담 접수',
        standardTiming: 'D+0',
        fastTiming: 'D+0',
        kind: 'trigger',
        senderExample: '운영 전환 문의 폼 → 스텝메일 연결',
        subject: '홈페이지 운영·자동화 전환 상담 접수 (시연 트리거)',
        bodyParagraphs: [
          '기존 홈페이지 주소와 운영 불편 사항을 접수하면 도메인 보존 중심의 전환 안내 시퀀스가 시작됩니다.',
          '수신 동의 기준을 충족한 문의 건에 한해 시나리오를 적용합니다.',
        ],
        ctaLabel: '운영관리 전환 기준 확인',
        targetPath: '/management',
        complianceNote: '수신 동의 기록 및 실발송 엔진은 연동 준비 중입니다.',
      },
      {
        id: 'welcome',
        stepNo: '02',
        title: '환영 · 점검 안내',
        standardTiming: '즉시',
        fastTiming: '즉시',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[접수 확인] 기존 홈페이지·도메인 현황 점검 전 확인 사항을 안내드립니다',
        bodyParagraphs: [
          '기존 홈페이지 운영 전환 및 자동화 도입 문의를 접수했습니다.',
          '전환 과정에서 기존 도메인이나 회사 이메일(MX)이 중단되지 않도록 DNS 레코드를 우선 점검합니다.',
        ],
        ctaLabel: '도메인·메일 보존 기준 보기',
        targetPath: '/domain',
        complianceNote: '하단 수신거부 링크 및 발신 인증(SPF·DKIM) 연동 준비 중',
      },
      {
        id: 'intro',
        stepNo: '03',
        title: '단계별 통합 안내',
        standardTiming: '3일 후',
        fastTiming: '1일 후',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[소개] 홈페이지 · 루틴 · 스텝메일을 하나로 연결하는 단계별 도입 순서',
        bodyParagraphs: [
          '여러 외부 도구를 동시에 도입하면 계정이 분산되고 관리가 어려워집니다.',
          '관리형 홈페이지와 쉬운 수정을 먼저 안정화한 뒤, 콘텐츠 루틴과 스텝메일을 순차 연결하는 방식을 권장합니다.',
        ],
        ctaLabel: '루틴 자동발행 구조 보기',
        targetPath: '/features/routine',
        complianceNote: '현재 도입 가능 범위와 연동 준비 중 항목을 구분 안내',
      },
      {
        id: 'consult',
        stepNo: '04',
        title: '상담 일정 CTA',
        standardTiming: '7일 후',
        fastTiming: '4일 후',
        kind: 'email',
        senderExample: 'hello@example-company.co.kr (발신 예시)',
        subject: '[안내] 현재 사이트 기준의 단계별 전환 제안이 필요하시면 답신해 주세요',
        bodyParagraphs: [
          '현재 운영 중인 홈페이지 URL을 공유해 주시면 리뉴얼 여부, 도메인 연결, 자동화 연계 범위를 정리해 드립니다.',
          '우선순위 정리만 필요하신 경우에도 부담 없이 상담 가능합니다.',
        ],
        ctaLabel: '전환 상담 신청하기',
        targetPath: '/contact?service=management',
        complianceNote: '관심 서비스가 사전 선택된 상담 페이지로 연결',
      },
      {
        id: 'reaction',
        stepNo: '05',
        title: '고객 반응 점검',
        standardTiming: '종료 후',
        fastTiming: '종료 후',
        kind: 'review',
        senderExample: '운영자 확인 화면 (시연 예시)',
        subject: '전환 점검 반응 및 후속 상담 필요 여부 확인',
        bodyParagraphs: [
          '고객이 확인한 안내 페이지와 회신 여부를 점검해 담당자가 맥락에 맞는 1:1 상담을 이어갑니다.',
          '실제 발송·반응 트래킹 및 사용량 정책은 현재 연동 준비 중 상태입니다.',
        ],
        ctaLabel: '스텝메일 도입 상담',
        targetPath: '/contact?service=stepmail',
        complianceNote: '실제 발송·트래킹·수신거부 자동 반영은 연동 준비 중입니다.',
      },
    ],
  },
];

export function StepMailDemoMockup() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('website-inquiry');
  const [cadenceId, setCadenceId] = useState<CadenceId>('standard');
  const [activeStepIdx, setActiveStepIdx] = useState<number>(1);

  const scenario =
    DEMO_SCENARIOS.find((item) => item.id === scenarioId) ?? DEMO_SCENARIOS[0];
  const activeStep = scenario.steps[activeStepIdx] ?? scenario.steps[0];
  const isLastStep = activeStepIdx === scenario.steps.length - 1;

  const handleSelectScenario = (id: ScenarioId) => {
    setScenarioId(id);
    setActiveStepIdx(1);
  };

  const handleNextStep = () => {
    setActiveStepIdx((prev) => (prev < scenario.steps.length - 1 ? prev + 1 : 0));
  };

  const getStepTiming = (step: DemoStep) =>
    cadenceId === 'standard' ? step.standardTiming : step.fastTiming;

  return (
    <figure
      role="region"
      aria-label="스텝메일 시나리오 인터랙티브 시연 화면"
      className="w-full overflow-hidden rounded-[18px] border border-slate-200 bg-white shadow-[var(--shadow-stage)]"
    >
      {/* Unified Top Chrome Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#D0D5DD]" />
          </div>
          <span className="text-[13px] font-semibold text-slate-950 truncate">
            스텝메일 시나리오 워크스페이스
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[12px] font-medium text-blue-600">
            실제 메일 미발송 · 시연 UI
          </span>
          <button
            type="button"
            onClick={() => setActiveStepIdx(0)}
            className="inline-flex min-h-[30px] items-center gap-1 rounded-[8px] border border-slate-200 bg-white px-2.5 py-1 text-[11.5px] font-medium text-slate-600 hover:border-slate-300 hover:text-slate-950 transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* Compact Controls Strip: Scenario Tabs + Cadence Switch */}
      <div className="flex flex-col gap-2.5 border-b border-slate-200 bg-white px-4 sm:px-6 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="스텝메일 시나리오 선택"
          className="inline-flex flex-wrap items-center gap-1 rounded-[10px] border border-slate-200 bg-slate-50 p-1"
        >
          {DEMO_SCENARIOS.map((item) => {
            const selected = item.id === scenarioId;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => handleSelectScenario(item.id)}
                className={`min-h-[32px] rounded-[8px] px-3 py-1 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  selected
                    ? 'bg-white text-slate-950 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="hidden xl:inline text-[12px] text-slate-500">
            접점: {scenario.triggerSource}
          </span>
          <div
            role="group"
            aria-label="발송 간격 선택"
            className="inline-flex items-center gap-1 rounded-[10px] border border-slate-200 bg-slate-50 p-1"
          >
            <button
              type="button"
              onClick={() => setCadenceId('standard')}
              className={`min-h-[30px] rounded-[7px] px-2.5 py-1 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                cadenceId === 'standard'
                  ? 'bg-white text-blue-600 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              표준 (즉시·3일·7일)
            </button>
            <button
              type="button"
              onClick={() => setCadenceId('fast')}
              className={`min-h-[30px] rounded-[7px] px-2.5 py-1 text-[12px] font-medium transition-colors whitespace-nowrap cursor-pointer ${
                cadenceId === 'fast'
                  ? 'bg-white text-blue-600 shadow-[0_1px_2px_rgba(16,24,40,0.06)]'
                  : 'text-slate-500 hover:text-slate-950'
              }`}
            >
              단기 (즉시·1일·4일)
            </button>
          </div>
        </div>
      </div>

      {/* Main Split Body: Compact Step List (4 cols) + Clean Email Canvas (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Left: Clean Step Selector */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 bg-slate-50/60 p-4 sm:p-5 flex flex-col justify-between gap-4">
          <div className="space-y-2">
            {scenario.steps.map((step, idx) => {
              const isActive = idx === activeStepIdx;
              const isPassed = idx < activeStepIdx;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => setActiveStepIdx(idx)}
                  className={`flex w-full items-center justify-between gap-3 rounded-[12px] border px-3.5 py-3 text-left transition-[border-color,background-color,box-shadow] duration-150 cursor-pointer ${
                    isActive
                      ? 'border-[#2563EB] bg-white shadow-[0_4px_14px_rgba(37,99,235,0.07)]'
                      : 'border-slate-200 bg-white/80 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`text-[11.5px] font-bold tabular-metrics shrink-0 ${
                        isActive
                          ? 'text-blue-600'
                          : isPassed
                            ? 'text-[#15803D]'
                            : 'text-slate-400'
                      }`}
                    >
                      {step.stepNo}
                    </span>
                    <span className="truncate text-[14px] font-semibold text-slate-950">
                      {step.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[11.5px] font-medium tabular-metrics text-slate-500">
                      {getStepTiming(step)}
                    </span>
                    {isPassed && (
                      <CheckCircle2
                        className="h-3.5 w-3.5 text-[#15803D]"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={handleNextStep}
            className="inline-flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-[10px] bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1D4ED8] transition-colors cursor-pointer"
          >
            <span>{isLastStep ? '1단계부터 다시 보기' : '다음 단계 미리 보기'}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        {/* Right: Focused Email / Flow Preview */}
        <div className="lg:col-span-8 p-5 sm:p-7 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-[13.5px] font-semibold text-slate-950">
                {activeStep.kind === 'trigger' && (
                  <UserCheck className="h-4 w-4 text-blue-600" aria-hidden="true" />
                )}
                {activeStep.kind === 'email' && (
                  <Mail className="h-4 w-4 text-blue-600" aria-hidden="true" />
                )}
                {activeStep.kind === 'review' && (
                  <MousePointerClick className="h-4 w-4 text-blue-600" aria-hidden="true" />
                )}
                <span>
                  STEP {activeStep.stepNo} · {activeStep.title}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[12px] font-medium tabular-metrics text-slate-500">
                <Clock className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                {getStepTiming(activeStep)}
              </span>
            </div>

            {/* Clean Email Frame */}
            <div className="rounded-[14px] border border-slate-200 bg-slate-50 p-5 space-y-4">
              <div className="space-y-1.5 border-b border-slate-200 pb-3.5 text-[13px]">
                <p className="text-[12px] text-slate-500">{activeStep.senderExample}</p>
                <p className="text-[15px] font-semibold leading-snug text-slate-950">
                  {activeStep.subject}
                </p>
              </div>

              <div className="space-y-2.5 text-[14px] leading-[1.68] text-[#344054]">
                {activeStep.bodyParagraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-slate-200 bg-white px-4 py-3">
                <span className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#2563EB] px-3.5 py-1.5 text-[12px] font-semibold text-white">
                  {activeStep.ctaLabel}
                </span>
                <span className="font-mono text-[12px] text-slate-500">
                  {activeStep.targetPath}
                </span>
              </div>

              {activeStep.kind === 'email' && (
                <p className="border-t border-slate-200 pt-3 text-[11.5px] text-slate-500">
                  수신 동의 고객 대상 시연 예시 · 하단 [수신거부 (연동 준비 중)] 포함 구조
                </p>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2 border-t border-slate-200 pt-3.5 text-[12px] text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
            <span>{activeStep.complianceNote}</span>
          </div>
        </div>
      </div>
    </figure>
  );
}
