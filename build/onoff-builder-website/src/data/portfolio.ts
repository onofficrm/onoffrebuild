import { EDITORIAL_IMAGES } from './assets';

export type PortfolioCategory = '기업' | '전문직' | '커뮤니티' | '랜딩페이지';

export type PortfolioFilterOption = '전체' | PortfolioCategory;

export const PORTFOLIO_FILTERS: PortfolioFilterOption[] = [
  '전체',
  '기업',
  '전문직',
  '커뮤니티',
  '랜딩페이지',
];

/**
 * 제작사례 표준 데이터 구조
 * 실제 고객 프로젝트가 확정·공개 동의되면 아래와 동일한 형식으로 추가하고
 * isConceptExample: false, url: 'https://실제도메인', isPublic: true 로 설정하면
 * 실제 제작사례로 즉시 반영됩니다.
 */
export interface PortfolioItem {
  id: string;
  /** 제목 */
  title: string;
  /** 필터 분류 (기업 / 전문직 / 커뮤니티 / 랜딩페이지) */
  category: PortfolioCategory;
  /** 업종 */
  industry: string;
  /** 설명 */
  description: string;
  /** 썸네일 이미지 경로 */
  thumbnail: string;
  /** 썸네일 대체 텍스트 */
  thumbnailAlt: string;
  /** 주요 기능 목록 */
  features: string[];
  /** 실제 공개 웹사이트 URL (콘셉트 예시 또는 비공개 프로젝트는 null) */
  url: string | null;
  /** 공개 여부 (false인 항목은 갤러리 목록에 노출되지 않음) */
  isPublic: boolean;
  /** 콘셉트 디자인 예시 여부 (실제 고객 제작사례와 명확히 구별) */
  isConceptExample: boolean;
}

/**
 * 실제 고객 제작사례 목록
 * 현재 공개 확정된 실제 사례가 등록되기 전까지 빈 배열로 유지하며,
 * 향후 공개 협의를 마친 실제 프로젝트만 이곳에 추가합니다.
 */
export const REAL_PORTFOLIO_ITEMS: PortfolioItem[] = [];

/**
 * 콘셉트 디자인 예시 목록
 * 실제 고객 제작물과 혼동되지 않도록 UI에서 '콘셉트 디자인 예시'로 명확히 구분하여 표시합니다.
 */
export const CONCEPT_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'concept-corporate-official',
    title: '기업 공식 홈페이지 콘셉트 디자인',
    category: '기업',
    industry: 'B2B 제조 · 기술 · 일반 기업',
    description:
      '대형 타이포그래피와 절제된 건축 이미지, 명확한 사업 소개 구조를 통해 기업의 대외 신뢰도를 높이고 B2B 상담으로 연결하는 공식 홈페이지 콘셉트입니다.',
    thumbnail: EDITORIAL_IMAGES.digitalInfrastructure.src,
    thumbnailAlt: '기업 공식 홈페이지 콘셉트 디자인 예시 이미지',
    features: [
      '회사소개 및 핵심 사업 영역 구조화',
      'PC·모바일 반응형 기업형 레이아웃',
      '브로슈어·자료실 및 공지사항 구성',
      'B2B 문의·견적 접수 폼 및 SEO 기본 구조',
    ],
    url: null,
    isPublic: true,
    isConceptExample: true,
  },
  {
    id: 'concept-professional-clinic',
    title: '병원·전문직 상담 중심 콘셉트 디자인',
    category: '전문직',
    industry: '병원 · 치과 · 법무 · 컨설팅',
    description:
      '방문자가 진료·전문 분야와 진행 기준을 차분하게 이해하고 부담 없이 상담을 요청할 수 있도록 여백과 가독성을 극대화한 전문직 홈페이지 콘셉트입니다.',
    thumbnail: EDITORIAL_IMAGES.conceptMedical.src,
    thumbnailAlt: '병원·전문직 상담 중심 홈페이지 콘셉트 디자인 예시 이미지',
    features: [
      '전문 분야 및 구성원·원장단 소개',
      '자주 묻는 질문(FAQ) 및 이용 안내',
      '모바일 중심 빠른 상담 문의 동선',
      '예약 연동 등 맞춤형 추가 개발 확장 구조',
    ],
    url: null,
    isPublic: true,
    isConceptExample: true,
  },
  {
    id: 'concept-community-archive',
    title: '커뮤니티·정보 아카이브 콘셉트 디자인',
    category: '커뮤니티',
    industry: '커뮤니티 · 기관 · 지역정보 플랫폼',
    description:
      '많은 정보와 게시물이 쌓여도 깔끔한 탐색 경험을 유지할 수 있도록 카테고리 구조, 검색 친화 아카이브, 지속적인 콘텐츠 운영을 전제로 설계한 콘셉트입니다.',
    thumbnail: EDITORIAL_IMAGES.conceptEditorial.src,
    thumbnailAlt: '커뮤니티·정보 플랫폼 콘셉트 디자인 예시 이미지',
    features: [
      '카테고리별 게시판 및 정보 아카이브',
      '공지사항·가이드·자료실 통합 구성',
      '검색엔진 노출을 고려한 페이지 계층 설계',
      '지속 운영관리를 통한 섹션·콘텐츠 확장',
    ],
    url: null,
    isPublic: true,
    isConceptExample: true,
  },
];

/**
 * 갤러리 노출용 전체 공개 항목 반환
 * 실제 제작사례를 최상단에 우선 노출하고, 그 아래 콘셉트 디자인 예시를 구분해 제공합니다.
 */
export function getPublicPortfolioItems(): PortfolioItem[] {
  return [...REAL_PORTFOLIO_ITEMS, ...CONCEPT_PORTFOLIO_ITEMS].filter((item) => item.isPublic);
}
