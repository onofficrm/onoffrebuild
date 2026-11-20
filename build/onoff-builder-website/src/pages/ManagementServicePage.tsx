import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { ManagementPreviewShowcase } from '../components/services/ManagementPreviewShowcase';

const MANAGEMENT_REASONS: CoreReasonItem[] = [
  {
    number: '01',
    title: '코드를 직접 수정하거나 서버를 관리할 필요가 없습니다',
    description:
      'HTML·CSS 수정, 서버 설정, 호스팅 오류, SSL 인증서 갱신 같은 기술 업무를 내부 직원이 떠안지 않아도 됩니다. 기술 영역 전체를 온오프마케팅이 담당합니다.',
  },
  {
    number: '02',
    title: '방치되는 홈페이지가 아니라 살아 있는 브랜드 자산 유지',
    description:
      '사업 내용이나 연락처, 서비스 구성이 바뀌었는데 예전 정보가 남아 있으면 신뢰가 떨어집니다. 필요한 시점에 브랜드 완성도를 유지하며 신속히 업데이트합니다.',
  },
  {
    number: '03',
    title: '수정마다 외주를 새로 찾는 비효율을 없애는 연속성',
    description:
      '홈페이지 구조를 가장 잘 이해하는 팀이 계속 관리하므로 레이아웃이 깨지거나 디자인 톤이 흔들리지 않으며, 신규 페이지와 기능 확장도 매끄럽게 이어집니다.',
  },
];

const MANAGEMENT_FEATURES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '콘텐츠 수정 요청',
    scopeNote: '정기 운영 범위',
    description:
      '서비스 설명 보완, 회사 정보 업데이트, 공지 및 안내 문구 변경 등 운영 중 발생하는 텍스트 수정을 요청받아 반영합니다.',
  },
  {
    number: '02',
    title: '이미지 및 내용 변경',
    scopeNote: '정기 운영 범위',
    description:
      '대표 비주얼 교체, 배너 및 자료 이미지 최적화, 섹션 구성 조정을 화면 비율과 해상도에 맞춰 깔끔하게 적용합니다.',
  },
  {
    number: '03',
    title: '새로운 페이지 추가',
    scopeNote: '범위 협의 반영',
    description:
      '신규 사업부 개설, 새 서비스 출시, 이벤트 안내 등 확장이 필요할 때 기존 디자인 시스템에 맞춰 새 페이지를 추가합니다.',
  },
  {
    number: '04',
    title: '기능 추가·제거 상담',
    scopeNote: '맞춤 협의 지원',
    description:
      '운영 과정에서 새로 필요해진 문의 항목·게시판 추가나 더 이상 쓰지 않는 영역의 정리를 상담을 통해 합리적으로 설계합니다.',
  },
  {
    number: '05',
    title: '배포 및 유지보수',
    scopeNote: '기술 관리 영역',
    description:
      '변경 사항의 사전 테스트, 실서비스 배포, 브라우저·모바일 표시 점검 등 안정적인 운영을 위한 유지보수를 수행합니다.',
  },
  {
    number: '06',
    title: '호스팅·도메인 관련 운영 업무',
    scopeNote: '기술 관리 영역',
    description:
      '호스팅 환경 관리, 도메인 DNS 설정 변경, HTTPS 보안(SSL) 점검 등 비전문가가 다루기 까다로운 인프라 업무를 지원합니다.',
  },
];

const MANAGEMENT_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '수정 요청',
    description:
      '변경할 문구, 교체할 이미지, 추가하고 싶은 페이지 내용을 편한 언어로 담당자에게 전달합니다.',
  },
  {
    step: '02',
    title: '검토 및 안내',
    description:
      '요청 내용의 적용 방식, 기존 화면과의 조화, 포함 범위 및 예상 완료 일정을 명확히 안내합니다.',
  },
  {
    step: '03',
    title: '작업',
    description:
      '온오프마케팅 팀이 디자인 일관성과 PC·모바일 반응형 표시를 함께 확인하며 직접 작업을 진행합니다.',
  },
  {
    step: '04',
    title: '검수 및 반영',
    description:
      '사전 확인 화면을 고객이 검수하고 승인하면, 실서비스 홈페이지에 안전하게 배포·반영합니다.',
  },
];

const MANAGEMENT_FAQS: CoreFaqItem[] = [
  {
    question: '정말 고객이 코드를 수정하거나 서버를 직접 만질 일이 없나요?',
    answer:
      '네. ONOFF Builder 운영관리의 핵심은 고객이 코드 편집기, 서버 콘솔, 호스팅 설정, 도메인 DNS를 직접 다루지 않아도 되는 것입니다. 고객은 변경할 내용 전달과 결과 화면 검수에만 집중하시면 됩니다.',
  },
  {
    question: '수정 요청은 어떻게 전달하고 진행 상황을 확인하나요?',
    answer:
      '복잡한 툴을 따로 배우실 필요 없이 협의된 전담 담당자 채널로 수정할 내용과 자료를 전달해 주시면 됩니다. 검토 후 일정 안내, 작업, 사전 검수, 실서비스 반영 순으로 투명하게 진행됩니다.',
  },
  {
    question: '단순 문구 변경 외에 새로운 페이지나 기능 추가도 요청할 수 있나요?',
    answer:
      '가능합니다. 기본 콘텐츠·이미지 변경은 운영 범위 내에서 신속히 처리하며, 새로운 페이지 추가나 기능 추가·제거처럼 범위가 큰 작업은 사전 상담을 통해 일정과 조건을 명확히 안내한 뒤 진행합니다.',
  },
  {
    question: '호스팅과 도메인 관련 기술 문제도 함께 관리해 주나요?',
    answer:
      '네. ONOFF Builder 환경의 호스팅 배포와 유지보수, 도메인 연결 및 SSL 보안 설정 점검까지 함께 지원하므로 기술 문제로 홈페이지가 중단되거나 대응이 지연되는 걱정을 줄일 수 있습니다.',
  },
  {
    question: '운영관리 범위와 비용 기준은 어떻게 정해지나요?',
    answer:
      '홈페이지 규모, 예상되는 수정 빈도, 페이지 확장 및 연계 마케팅 필요 여부에 따라 기업마다 적합한 관리 범위가 다릅니다. 상담 시 현재 운영 계획을 확인해 알맞은 관리 기준을 제안해 드립니다.',
  },
];

function ZeroTechBurdenStrip() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-4">
          <p className="text-[13px] font-semibold text-blue-600">고객 부담 제로 원칙</p>
          <h3 className="mt-2 text-[19px] font-semibold leading-snug text-slate-950">
            직접 하지 않아도 되는 기술 업무
          </h3>
        </div>
        <div className="lg:col-span-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {[
            {
              title: '코드 직접 수정 불필요',
              desc: '레이아웃이 깨질 걱정 없이 전문 팀이 디자인 시스템을 유지하며 수정합니다.',
            },
            {
              title: '서버·호스팅 직접 관리 불필요',
              desc: '배포, 환경 설정, 보안 인증서 점검을 온오프마케팅이 대신 관리합니다.',
            },
            {
              title: '편집 툴 학습 불필요',
              desc: '담당자가 바뀌어도 사용법을 다시 배울 필요 없이 요청만 전달하면 됩니다.',
            },
            {
              title: '도메인·DNS 설정 부담 해소',
              desc: '도메인 연결과 메일 레코드 보호 등 민감한 설정을 안전하게 지원합니다.',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-slate-200 bg-slate-50 p-4"
            >
              <p className="text-[14px] font-semibold text-slate-950">{item.title}</p>
              <p className="mt-1 text-[13px] leading-[1.6] text-slate-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ManagementServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · 운영관리"
      headline={
        <>
          오픈 이후에도,
          <br />
          홈페이지는 계속 진화합니다.
        </>
      }
      heroDescription="홈페이지는 만드는 순간이 끝이 아니라 시작입니다. 콘텐츠 수정, 이미지 교체, 신규 페이지 추가부터 호스팅·도메인·배포 유지보수까지 전문 운영자가 지속적으로 관리합니다."
      primaryCtaLabel="운영 상담하기"
      primaryCtaTo="/contact?service=management"
      secondaryCtaLabel="운영 범위 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="왜 관리형 운영이 필요한가요"
      reasonsHeading="코드를 만지고 서버를 걱정하는 시간, 이제 본업에 쓰세요"
      reasonsLead="직접 수정하는 DIY 빌더나 일회성 외주 제작은 결국 내부 담당자의 부담으로 돌아옵니다. ONOFF Builder는 전담 운영 체계로 홈페이지의 완성도를 계속 지켜냅니다."
      reasons={MANAGEMENT_REASONS}
      reasonsFootnote={<ZeroTechBurdenStrip />}
      featuresKicker="제공 기능 및 운영 범위"
      featuresHeading="일상적인 수정부터 구조 확장과 기술 유지보수까지 한곳에서"
      featuresLead="작은 텍스트 변경부터 새로운 페이지 추가, 기능 확장 상담, 호스팅·도메인 운영까지 체계적으로 지원합니다."
      featuresNotice="안내: 정기 운영 범위에 포함되는 일상 수정과 별도 협의가 필요한 신규 페이지·기능 확장 범위는 도입 상담 시 투명하게 구분하여 안내해 드립니다."
      features={MANAGEMENT_FEATURES}
      previewKicker="운영 협업 흐름 예시"
      previewHeading="복잡한 관리 도구 없이, 요청하고 검수하는 명료한 방식"
      previewLead="고객이 직접 코드를 편집하거나 서버에 접속할 필요 없이 어떤 흐름으로 수정과 유지보수가 이루어지는지 예시로 확인하세요."
      previewComponent={<ManagementPreviewShowcase />}
      processKicker="운영 작업 과정"
      processHeading="수정 요청부터 검수·반영까지 4단계로 깔끔하게"
      processLead="누가 담당하더라도 헷갈리지 않는 단순하고 명확한 협업 절차를 따릅니다."
      processSteps={MANAGEMENT_PROCESS}
      relatedLinks={[
        {
          label: '홈페이지 제작',
          description: '운영과 확장을 전제로 처음부터 탄탄하게 설계하는 관리형 홈페이지 구축입니다.',
          to: '/website',
        },
        {
          label: 'DOMAIN',
          description: '기업 도메인 구성, 기존 메일 보호, DNS 설정 및 HTTPS 보안을 안전하게 연결합니다.',
          to: '/domain',
        },
        {
          label: 'AI 콘텐츠',
          description: '운영 중인 홈페이지에 검색과 상담 전환을 고려한 전문 콘텐츠를 지속적으로 채워갑니다.',
          to: '/content',
        },
      ]}
      faqs={MANAGEMENT_FAQS}
      ctaTitle={
        <>
          오픈 이후의 운영과 확장까지,
          <br />
          안심하고 맡길 수 있는 파트너와 시작하세요.
        </>
      }
      ctaDescription="현재 운영 중인 홈페이지의 관리 이관이나 신규 제작과 함께 묶는 운영관리 상담 모두 가능합니다."
      ctaButtonLabel="운영 상담하기"
      ctaButtonTo="/contact?service=management"
    />
  );
}
