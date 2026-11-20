import heroStudioImg from '../assets/images/hero_studio_architecture_1795078232997.jpg';
import managedWorkflowImg from '../assets/images/managed_workflow_editorial_1795078231973.jpg';
import digitalInfrastructureImg from '../assets/images/digital_infrastructure_minimal_1795078233001.jpg';
import conceptMedicalImg from '../assets/images/concept_medical_space_1795081083832.jpg';
import conceptInteriorImg from '../assets/images/concept_interior_architecture_1795081083125.jpg';
import conceptEditorialImg from '../assets/images/concept_editorial_platform_1795081083803.jpg';
import corporateHeroImg from '../assets/images/onoff_builder_corporate_hero_20261120.jpg';

export interface EditorialImageAsset {
  src: string;
  filename: string;
  alt: string;
  usage: string;
}

/**
 * ONOFF Builder 정적 이미지 자산 레지스트리
 * Vite ES 모듈 import를 사용하여 프로덕션 빌드(dist/assets/) 시 자동으로 번들링됩니다.
 * GNUBoard PHP 통합 시에는 각 파일을 테마 자산 경로(예: /theme/onoff/img/)로 복사하여 매핑합니다.
 */
export const EDITORIAL_IMAGES = {
  corporateHero: {
    src: corporateHeroImg,
    filename: 'onoff_builder_corporate_hero_20261120.jpg',
    alt: '자연광과 원목, 유리 파사드가 조화를 이루는 현대적인 기업 로비 공간',
    usage: '메인 제품 목업의 기업 홈페이지 대표 화면',
  },
  heroStudio: {
    src: heroStudioImg,
    filename: 'hero_studio_architecture_1795078232997.jpg',
    alt: '정돈된 자연광과 미니멀한 테이블이 배치된 기업형 디자인 스튜디오 공간',
    usage: '메인 Hero 데스크톱 목업, 메인 콘셉트 갤러리, /website 기업 소개 예시',
  },
  managedWorkflow: {
    src: managedWorkflowImg,
    filename: 'managed_workflow_editorial_1795078231973.jpg',
    alt: '정보 구조와 설계 보드가 정돈된 기획 데스크 전경',
    usage: '메인 콘셉트 갤러리 (전문 서비스·컨설팅 예시)',
  },
  digitalInfrastructure: {
    src: digitalInfrastructureImg,
    filename: 'digital_infrastructure_minimal_1795078233001.jpg',
    alt: '정교한 격자 구조로 설계된 현대적 화이트 건축 외관과 유리 파사드',
    usage: '메인 Hero 모바일 목업, 메인 콘셉트 갤러리, /portfolio 기업 공식 홈페이지 콘셉트',
  },
  conceptMedical: {
    src: conceptMedicalImg,
    filename: 'concept_medical_space_1795081083832.jpg',
    alt: '자연광이 스며드는 차분하고 정돈된 병원·전문직 리셉션 공간',
    usage: '/portfolio 병원·전문직 콘셉트, /use-cases 병원·치과·전문직 예시',
  },
  conceptInterior: {
    src: conceptInteriorImg,
    filename: 'concept_interior_architecture_1795081083125.jpg',
    alt: '화이트 벽면과 원목 가구가 조화를 이루는 미니멀 인테리어 주거 공간',
    usage: '/use-cases 인테리어·시공업체 활용사례 시각 자산',
  },
  conceptEditorial: {
    src: conceptEditorialImg,
    filename: 'concept_editorial_platform_1795081083803.jpg',
    alt: '천창 자연광이 비추는 미니멀한 문화 갤러리 및 정보 라운지 공간',
    usage: '/portfolio 커뮤니티·정보 아카이브 콘셉트, /use-cases 커뮤니티·정보 플랫폼 예시',
  },
} as const satisfies Record<string, EditorialImageAsset>;
