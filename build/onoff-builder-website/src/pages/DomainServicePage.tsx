import {
  CoreServicePageTemplate,
  type CoreFaqItem,
  type CoreFeatureItem,
  type CoreProcessStep,
  type CoreReasonItem,
} from '../components/services/CoreServicePageTemplate';
import { DomainPreviewShowcase } from '../components/services/DomainPreviewShowcase';

const DOMAIN_PROBLEMS: CoreReasonItem[] = [
  {
    number: '01',
    title: '브랜드에 어울리는 도메인 선택과 구조 판단의 어려움',
    description:
      '기업명과 맞지 않거나 기억하기 어려운 주소, 무분별한 서브도메인 분리는 명함·제안서 전달력과 장기적인 브랜드 신뢰를 떨어뜨립니다.',
  },
  {
    number: '02',
    title: '기존 도메인 연결 시 회사 이메일 중단 및 설정 오류 우려',
    description:
      '홈페이지를 새로 만들거나 이전할 때 DNS 설정을 잘못 건드려 회사 메일 수신이 멈추거나 보안 경고(HTTPS 오류)가 뜨는 사고가 자주 발생합니다.',
  },
  {
    number: '03',
    title: '검색 신뢰를 분산시키는 중복 주소와 이력 미확인',
    description:
      'http/https, www 유무가 정리되지 않거나 과거 이력을 확인하지 않은 도메인을 사용하면 검색엔진 평가와 접속 안정성에 불리하게 작용합니다.',
  },
];

const DOMAIN_VALUES: CoreFeatureItem[] = [
  {
    number: '01',
    title: '브랜드 도메인 구성 자문',
    scopeNote: '신규 구축 기준',
    description:
      '기업명과 사업 확장 계획을 고려해 기억하기 쉽고 신뢰감을 주는 대표 도메인 및 서브도메인 구조를 함께 설계합니다.',
  },
  {
    number: '02',
    title: '도메인 사전 분석',
    scopeNote: '현황 진단 단계',
    description:
      '보유 중이거나 새로 검토 중인 도메인의 기본 이력, 기존 연결 상태, 만료·관리 환경을 확인해 리스크를 사전에 점검합니다.',
  },
  {
    number: '03',
    title: '기존 도메인 안전 연결',
    scopeNote: '기술 연결 지원',
    description:
      '기존에 사용 중인 기업 이메일(MX·SPF 등) 설정을 사전에 확인·보존하면서 ONOFF Builder 홈페이지와 안전하게 연결합니다.',
  },
  {
    number: '04',
    title: 'HTTPS 보안(SSL) 및 리다이렉트',
    scopeNote: '기본 보안 구성',
    description:
      '모든 접속이 안전한 HTTPS 대표 주소로 일관되게 연결되도록 SSL 인증서 적용과 리다이렉트 규칙을 정비합니다.',
  },
  {
    number: '05',
    title: '검색 관련 도메인 고려사항 반영',
    scopeNote: 'SEO 기초 연계',
    description:
      '표준 주소(Canonical) 통일, 리뉴얼 시 주요 경로 유지 기준, 검색엔진 소유권 확인 환경을 함께 정돈합니다.',
  },
  {
    number: '06',
    title: '고객사 소유권 중심의 투명한 안내',
    scopeNote: '운영 원칙',
    description:
      '도메인은 기업의 핵심 자산이므로 고객사가 소유권과 갱신 기준을 명확히 파악할 수 있도록 투명하게 안내합니다.',
  },
];

const DOMAIN_PROCESS: CoreProcessStep[] = [
  {
    step: '01',
    title: '도메인 및 메일 현황 확인',
    description:
      '신규 브랜드 도메인 선정이 필요한지, 기존 도메인을 연결할지 확인하고 사용 중인 메일 연동을 점검합니다.',
  },
  {
    step: '02',
    title: '도메인 분석 및 주소 설계',
    description:
      '대표 주소, 서브도메인 필요 여부, 리다이렉트와 검색 관련 고려사항을 정리합니다.',
  },
  {
    step: '03',
    title: 'DNS 연결 및 SSL 적용',
    description:
      '기존 메일 레코드를 보호하면서 웹 연결(A/CNAME)과 HTTPS 보안 인증서를 적용합니다.',
  },
  {
    step: '04',
    title: '접속 검증 및 운영 인계',
    description:
      'PC·모바일 접속, 보안 표시, 리다이렉트 정상 동작을 최종 검증하고 관리 기준을 안내합니다.',
  },
];

const DOMAIN_FAQS: CoreFaqItem[] = [
  {
    question: '이미 등록해 둔 도메인이 있는데 그대로 ONOFF Builder에 연결할 수 있나요?',
    answer:
      '네, 가능합니다. 기존 도메인 등록 기관을 그대로 유지한 상태에서 웹 연결 설정만 안전하게 적용해 새 홈페이지와 연결할 수 있습니다.',
  },
  {
    question: '도메인을 새 홈페이지로 연결하면 기존 회사 이메일이 끊기지 않나요?',
    answer:
      '작업 전 DNS에 설정된 메일 관련 레코드(MX, SPF, DKIM 등)를 반드시 먼저 확인하고 그대로 보존한 채 웹 연결만 변경하므로 기존 회사 이메일 사용에 영향을 주지 않습니다.',
  },
  {
    question: '좋은 도메인을 선택하면 검색 순위가 자동으로 올라가나요?',
    answer:
      '특정 도메인만으로 검색 순위가 자동 보장되지는 않습니다. 다만 기억하기 쉬운 브랜드 도메인, 깔끔한 HTTPS 표준 주소 통일, 리뉴얼 시 끊긴 주소 방지는 검색엔진이 사이트를 안정적으로 평가하는 데 중요한 기초가 됩니다.',
  },
  {
    question: '도메인 소유권은 누구에게 귀속되나요?',
    answer:
      '도메인은 고객사의 공식 자산이므로 고객사 명의로 소유권을 유지하고 직접 연장 기준을 관리할 수 있도록 안내하며, 연결 및 기술 설정을 온오프마케팅이 지원합니다.',
  },
];

export function DomainServicePage() {
  return (
    <CoreServicePageTemplate
      kicker="서비스 · DOMAIN"
      headline="도메인 선택부터 성장 전략까지."
      heroDescription="도메인은 기업의 공식 주소이자 검색 신뢰가 쌓이는 출발점입니다. 브랜드 도메인 구성과 사전 분석부터 기존 메일을 지키는 안전한 연결, 검색을 고려한 표준 주소 설정까지 체계적으로 지원합니다."
      primaryCtaLabel="도메인 상담하기"
      primaryCtaTo="/contact?service=domain"
      secondaryCtaLabel="지원 범위 살펴보기"
      secondaryCtaHref="#features"
      reasonsKicker="고객이 자주 겪는 문제"
      reasonsHeading="작은 도메인 설정 실수가 홈페이지와 메일 전체에 영향을 줍니다"
      reasonsLead="처음 주소를 정할 때부터 기존 도메인을 새 홈페이지에 연결할 때까지 기술과 검색 기준을 함께 살펴야 안전합니다."
      reasons={DOMAIN_PROBLEMS}
      featuresKicker="서비스 가치"
      featuresHeading="브랜드 도메인 설계, 분석, 안전 연결과 검색 고려사항까지"
      featuresLead="복잡한 DNS 용어를 직접 공부하지 않아도 안전하게 공식 웹 주소를 운영할 수 있도록 돕습니다."
      featuresNotice="안내: 도메인 등록·연장 실비와 기술 연결 지원 범위는 보유 현황에 따라 달라지며, 상담을 통해 소유권과 작업 절차를 투명하게 안내합니다."
      features={DOMAIN_VALUES}
      previewKicker="구체적 활용"
      previewHeading="도메인 구조와 DNS·검색 점검 기준을 확인해 보세요"
      previewLead="대표 도메인 구성 방식, 기존 메일 보호 원칙, 검색 신뢰를 위한 핵심 점검 항목을 예시로 정리했습니다."
      previewComponent={<DomainPreviewShowcase />}
      processKicker="진행 절차"
      processHeading="현황 확인부터 안전한 연결 검증까지 4단계"
      processLead="기존 업무(이메일·기존 사이트)에 지장이 없도록 사전 확인을 거쳐 전환합니다."
      processSteps={DOMAIN_PROCESS}
      relatedLinks={[
        {
          label: '홈페이지 제작',
          description: '도메인 연결과 배포까지 한 흐름으로 완성하는 관리형 기업 홈페이지 구축입니다.',
          to: '/website',
        },
        {
          label: '운영관리',
          description: '오픈 이후에도 호스팅, SSL 보안, 도메인 설정 변경을 지속적으로 관리합니다.',
          to: '/management',
        },
        {
          label: 'SEO',
          description: '정돈된 대표 도메인 위에 검색엔진 친화적 페이지 구조와 메타정보를 구축합니다.',
          to: '/services/seo',
        },
      ]}
      faqs={DOMAIN_FAQS}
      ctaTitle={
        <>
          브랜드 도메인 선택이나 기존 도메인 이전,
          <br />
          안전하게 점검받고 연결하세요.
        </>
      }
      ctaDescription="보유 중인 도메인 주소나 검토 중인 브랜드명을 알려주시면 연결 방식과 검색 고려사항을 안내해 드립니다."
      ctaButtonLabel="도메인 상담하기"
      ctaButtonTo="/contact?service=domain"
    />
  );
}
