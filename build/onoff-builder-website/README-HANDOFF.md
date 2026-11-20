# ONOFF Builder 2.0 — GNUBoard 5 통합 개발 전달 패키지 (`README-HANDOFF.md`)

- **프로젝트명**: ONOFF Builder Official Website (시각 중심 플랫폼 리디자인 최종 전달 패키지 · v2.3)
- **대상 운영 도메인**: `https://onoff.icrm.co.kr`
- **브랜드 중심 포지셔닝**: **홈페이지 + 3대 자동화 도구(루틴 · 스텝메일 · 오토포스터(SNS 마케팅)) + 쉬운 홈페이지 수정 + AI 기능 개발** (+ 기존 온오프마케팅 별도 전문 서비스 6종 유지)
- **리디자인 목표**: 텍스트 설명 중심 마케팅 사이트 → **제품 UI 시연·비주얼(65~70%) 중심의 프리미엄 플랫폼 사이트** (주요 마케팅 본문 약 50% 압축, 법적·이용조건·비용 구분·운영 상태 투명성 100% 보존)
- **통합 대상 환경**: 기존 운영 중인 PHP / GNUBoard 5 기반 웹사이트 (자동 배포 없음 · ZIP 내보내기 후 Cursor에서 운영 구조 조사 및 스테이징 검증 후 통합)

> **절대 보호 원칙 (필독)**
> 1. 기존 `https://onoff.icrm.co.kr/community` 및 그 하위 모든 게시글, 회원(`g5_member`), 첨부파일(`/data/file/*`), 로그인·세션, 게시판 권한(`g5_board`), 관리자(`/adm`) 데이터를 **절대 수정·삭제·덮어쓰기하지 않습니다.**
> 2. 본 패키지에는 운영 서버 PHP, DB, 인증, 회원 시스템 수정 코드가 포함되어 있지 않으며, 자동 배포하지 않습니다. 전체 소스를 ZIP으로 내보낸 뒤 Cursor에서 기존 서버 디렉터리·`.htaccess`/Nginx·GNUBoard 테마 구조를 먼저 조사하고 스테이징 검증 후 통합합니다.
> 3. 기존 운영 중인 13개 서비스/안내 URL과 신규 `/features` 6개 정규 URL, 3개 별칭 리디렉션(`301`) 및 검색 메타(`src/data/seo.ts`)를 보존합니다.

---

## 1. v2.3 시각적 리디자인 — 화면별 변경 컴포넌트 및 구조

### A. 공통 디자인 시스템 및 신규 재사용 UI 프리미티브
| 파일 | 역할 | 주요 변경 내용 |
|---|---|---|
| `src/index.css` | 전역 디자인 토큰 | 라운딩(`10~18px`), 극절제 그림자(`--shadow-subtle`, `--shadow-stage`), `tabular-metrics`, `overflow-x: clip`, `keep-all` 유지 |
| `src/components/ui/Container.tsx` | 반응형 컨테이너 | `narrow` / `default(1200px)` / `wide(1320px)` 3단계 폭 지원 |
| `src/components/ui/Typography.tsx` | 타이포 위계 | `DisplayHeading`, `SectionHeading`, `LeadText`, `SectionKicker`, `MetaLine` |
| `src/components/ui/Button.tsx` | 버튼 시스템 | `primary` / `secondary` / `ghost` + 짙은 네이비 CTA용 `inverse` / `inverseGhost` |
| `src/components/ui/Card.tsx` | 카드 래퍼 | 기본 `Card` + 비주얼 상단 우선 `VisualCard` |
| `src/components/ui/Section.tsx` *(신규)* | 섹션 레이아웃 | 일관된 상하 리듬과 `SectionHeader` 단일 메시지 구조 |
| `src/components/ui/ProductStage.tsx` *(신규)* | 제품 시연 프레임 | 대형 제품 UI 목업용 공통 브라우저/스테이지 래퍼 |
| `src/components/ui/DetailDisclosure.tsx` *(신규)* | 접힘 상세 고지 | 정책·조건·상세 상태 카드를 접힘형으로 제공해 본문 밀도 절감 |
| `src/components/ui/EditorialImage.tsx` | 이미지 래퍼 | `aspect-*` 고정(CLS 방지), `alt`, `loading`, `decoding="async"`, 로드 실패 폴백 |
| `src/components/features/PlatformPreviewCards.tsx` *(신규)* | 플랫폼 비주얼 카드 | 3대 자동화 도구 별도 UI 프리뷰, `0원` 대형 가치 배너, 2열 운영 비교, 쉬운 수정 와이드 비교, AI 개발 미리보기, 별도 서비스 컴팩트 메뉴 |

### B. 화면별 변경 컴포넌트 매핑
| 라우트 | 페이지 컴포넌트 | 핵심 인터랙티브 / 비주얼 컴포넌트 | 주요 리디자인 내용 |
|---|---|---|---|
| `/` | `HomePage.tsx` | `HomeProductMockup.tsx`, `PlatformPreviewCards.tsx` | Hero 제품 쇼케이스(PC 대형 프리뷰 + 플로팅 2개 / 모바일 전용 프리뷰), 3대 도구 70% 비주얼 카드, `0원` 가치 배너, 수정 전/후·AI 개발 시각화 |
| `/features` | `FeaturesOverviewPage.tsx` | `PlatformPreviewCards.tsx` | 제품 UI 카드 중심의 5대 기본 기능 통합 탐색 + 접힘 정책 상세 |
| `/features/routine` | `RoutineFeaturePage.tsx` | `RoutineDashboardMockup.tsx` | Hero 대시보드 스포트라이트, 가로 5단계 흐름(`주제 설정→AI 초안→검수→예약→발행 현황`), 모바일 전용 일정·상태 카드(`sm` 미만) 추가 |
| `/features/step-mail` | `StepmailFeaturePage.tsx` | `StepMailDemoMockup.tsx` | 4단계 이메일 흐름 Hero, 비발송 시연 간결화, Mailchimp(`https://mailchimp.com/`) 2열 미니멀 비교 카드, `연동 준비 중`·비용 구분 유지 |
| `/features/sns-poster` | `SnsMarketingFeaturePage.tsx` | `SnsPosterDashboardMockup.tsx` | 게시글→SNS 분기 비주얼, 4단계 압축(`작성→검수→예약→배포 상태`), 모바일 전용 채널·예약 카드, FS Poster(`https://www.fs-poster.com/`) 2열 비교 카드 |
| `/features/easy-edit` | `EasyEditFeaturePage.tsx` | `EasyEditBeforeAfterDemo.tsx` | Hero 70% Before/After 비교(PC 좌우 슬라이더 / 모바일 전·후 탭), 단일 예시 요청, 3단계(`요청→미리보기·검수→반영`), 운영팀 AI 수정·검수 사실 표기 |
| `/features/ai-development` | `AiDevFeaturePage.tsx` | `AiDevBlueprintDemo.tsx` | 3장면 대표 그래픽(`요청 입력→AI 설계 카드→웹 기능 미리보기`), 3개 동작 탭(`견적 계산기·예약 신청·회원 전용 자료실`), 1줄 4단계(`아이디어→설계→제작→검수`) |
| `/pricing` | `PricingPage.tsx` | `ConsultationFaqSection.tsx` | 상단 `홈페이지 운영 + 3대 자체 도구 기본 제공(0원) | 별도 조건` 시각화, 월 운영관리비·외부 발송/API·대행·맞춤 개발비 경계 유지 |
| `/use-cases` | `UseCasesPage.tsx` | `EditorialImage.tsx` | 업종별 웹사이트 목업 카드 우선 배치, 설명 1줄 압축, 모든 시안 `활용 예시` 명시 |
| `/portfolio` | `PortfolioPage.tsx` | `EditorialImage.tsx` | 썸네일 주인공 3열 갤러리(구분·업종·제목 중심), 실제 사례 0건·`콘셉트 디자인 예시` 분리 유지(가상 고객사/로고 없음) |
| `/contact` | `ContactPage.tsx` | `ConsultationFaqSection.tsx` | 상단 비주얼 축소·폼 중심 배치, 기존 입력 필드·필수동의·`?service=` 사전 선택·비전송 시연 100% 보존 |
| `/website`, `/management`, `/seo`, `/geo`, `/backlink`, `/traffic`, `/domain`, `/content` | `CoreServicePageTemplate.tsx` (공통) | 각 서비스 `*PreviewShowcase.tsx` | 8개 서비스 공통 여백·라운딩·기본 접힘 FAQ·화면 예시 상단화, 기본 기능(`/features`)과의 경계 문구 및 기존 SEO/URL 100% 유지 |

---

## 2. 이미지 · 목업 자산 및 성능·접근성 기준

### A. 정적 번들 이미지 6종 (`src/assets/images/`, `src/data/assets.ts`)
모든 이미지는 Vite ES 모듈 import로 번들링되며, 고정 비율(`aspect-[16/10]` 등)로 CLS를 방지하고 `alt`, `referrerPolicy="no-referrer"`, `decoding="async"`, 로드 실패 폴백 UI를 갖춥니다.
1. `heroStudio` (`hero_studio_architecture_1795078232997.jpg`) — 메인 Hero(`loading="eager"`), 쉬운 수정 Before/After(`loading="eager"`), `/website`·`/use-cases` 예시(`loading="lazy"`)
2. `managedWorkflow` (`managed_workflow_editorial_1795078231973.jpg`) — `/use-cases` 교육·컨설팅 활용 예시(`loading="lazy"`)
3. `digitalInfrastructure` (`digital_infrastructure_minimal_1795078233001.jpg`) — `/use-cases`·`/portfolio` 기업 활용 예시(`loading="lazy"`)
4. `conceptMedical` (`concept_medical_space_1795081083832.jpg`) — `/use-cases`·`/portfolio` 병원·전문직 활용 예시(`loading="lazy"`)
5. `conceptInterior` (`concept_interior_architecture_1795081083125.jpg`) — `/use-cases` 인테리어·시공업체 활용 예시(`loading="lazy"`)
6. `conceptEditorial` (`concept_editorial_platform_1795081083803.jpg`) — `/use-cases`·`/portfolio` 커뮤니티·정보 플랫폼 활용 예시(`loading="lazy"`)

### B. React UI 목업 자산 및 모바일 전용 구성
- **반응형 전용 UI 분기**:
  - `HomeProductMockup`: `lg+` 대형 브라우저+플로팅 카드 / `< lg` 모바일 전용 프리뷰
  - `EasyEditBeforeAfterDemo`: `md+` 좌우 드래그 슬라이더(`<input type="range">` 키보드 접근성 지원) / `< md` 수정 전·후 탭
  - `RoutineDashboardMockup`: `sm+` 7열 캘린더·상태 테이블 / `< sm` 모바일 일정·상태 카드 리스트
  - `SnsPosterDashboardMockup`: `sm+` 채널·예약 테이블 / `< sm` 모바일 채널·예약 카드 리스트
- **상호작용·접근성**: 모든 탭(`role="tablist"`, `aria-selected`), 아코디언(`aria-expanded`, `aria-controls`), 모달(`role="dialog"`, `Escape` 닫기), 슬라이더(`aria-label`), 포커스 링(`:focus-visible`)이 hover 없이 키보드·터치만으로 동작합니다.

---

## 3. 전체 라우트 및 외부 링크 목록

### A. 정규 19개 라우트 + 3개 별칭 리디렉션 + 404 (`src/App.tsx`, `src/data/routes.ts`)
- **메인 / 기본 기능 (6)**: `/`, `/features`, `/features/routine`, `/features/step-mail`, `/features/sns-poster`, `/features/easy-edit`, `/features/ai-development`
- **별칭 리디렉션 (3, 서버 301 권장)**: `/features/stepmail` → `/features/step-mail`, `/features/sns` → `/features/sns-poster`, `/features/ai-dev` → `/features/ai-development`
- **기존 핵심·별도 서비스 (8, URL·SEO 무변경)**: `/website`, `/management`, `/seo`, `/geo`, `/backlink`, `/traffic`, `/domain`, `/content`
- **안내·전환·오류 (5)**: `/use-cases`, `/portfolio`, `/pricing`, `/contact`, `*` (`NotFoundPage`, `noindex, nofollow`)
- **절대 보호 경로**: `/community`, `/community/*`, `/bbs/*`, `/adm/*`, `/data/*`, `/plugin/*`, `/extend/*`, `/lib/*`, `/theme/*`

### B. 외부 링크 보안 속성 검증 (`target="_blank" rel="noopener noreferrer"`)
- 기존 커뮤니티: `https://onoff.icrm.co.kr/community` (`Header.tsx`, `Footer.tsx`)
- 비교 제품 공식 링크: `https://mailchimp.com/` (`StepmailFeaturePage.tsx`), `https://www.fs-poster.com/` (`SnsMarketingFeaturePage.tsx`)

---

## 4. 시연 화면 vs 실서비스 경계 (단일 원천: `src/data/platformCapabilities.ts`)

`CORE_INCLUDED_TOOL_POLICY`와 `OPERATIONAL_STATUS_META`를 기준으로 모든 페이지의 표기가 일치합니다.

| 영역 | 제공 정책 (`provisionPolicy`) | 현재 상태 (`operationalStatus`) | 시연 / 실서비스 경계 |
|---|---|---|---|
| 홈페이지 제작 (`/website`) | 기본 핵심 범위 | `live` (정상 제공 중) | 개별 견적 상담 후 전담 제작 |
| 운영관리 (`/management`) | 운영 플랜 협의 포함 | `live` (정상 제공 중) | 호스팅·SSL·일상 수정 전담 관리 |
| 쉬운 홈페이지 수정 (`/features/easy-edit`) | 운영 플랜 협의 포함 | `consultation_scoped` (상담 후 범위 제공) | 고객 코드 직접 편집 아님 · 운영팀 AI 지원 수정·검수 후 반영 (Before/After는 시연) |
| AI 기능 개발 (`/features/ai-development`) | 맞춤 개발 별도 협의 | `consultation_scoped` (상담 후 범위 제공) | 별도 범위 협의·개별 견적·전문 개발팀 검수 (3개 탭은 비저장 프런트엔드 시연) |
| 루틴 자동발행 (`/features/routine`) | ONOFF Builder 기본 제공 · 별도 구독료 0원 | `integration_in_progress` (연동 준비 중) | 플랫폼 직접 자동발행 미연동 · 대시보드 시연 화면(가짜 성공 로그 없음) |
| 스텝메일 (`/features/step-mail`) | ONOFF Builder 기본 제공 · 추가 구독료 0원 | `integration_in_progress` (연동 준비 중) | 실제 발송 없음(비발송 시연) · 제3자 발송 실비/사용량/대행/맞춤 개발 별도 |
| 오토포스터 (`/features/sns-poster`) | ONOFF Builder 기본 제공 · 추가 구독료 0원 | `integration_in_progress` (연동 준비 중) | 실제 외부 게시 없음(실연동 채널 0개) · 유료 SNS API/계정 권한/대행 별도 |
| 별도 전문 서비스 6종 (`/seo` 등) | 별도 전문 서비스 | `consultation_scoped` / `live`(`domain`) | 기본 기능과 구분되는 온오프마케팅 전문 서비스 |
| 상담 폼 (`/contact`) | 전환 창구 | 프런트엔드 시연 단계 | 실제 서버 미연동 · 유효성 검증 및 요청 초안 복사만 수행 |
| 제작사례 (`/portfolio`) | 갤러리 | 실제 공개 사례 0건 | 가상 고객사/로고 없음 · `콘셉트 디자인 예시` 3건만 구분 표기 |

---

## 5. 설치 · 빌드 · ZIP 내보내기 및 GNUBoard 5 통합 체크리스트

```bash
npm install        # 의존성 설치
npm run lint       # TypeScript 검사 (tsc --noEmit)
npm run build      # Vite 프로덕션 빌드 (dist/ 생성)
```

### ZIP 내보내기 및 GNUBoard 통합 주의사항
1. **자동 배포 금지**: 기존 운영 서버·DB에 직접 반영하지 않고 `node_modules/`, `dist/`, `.env*`(`.env.example` 제외)를 제외한 전체 프로젝트를 ZIP으로 전달합니다.
2. **GNUBoard `/community` 및 DB 무결성**: `g5_member`, `g5_board`, `g5_write_*`, `/data/file/*`, `/adm`, `/bbs` 및 `/community` 라우트를 웹서버 Rewrite 최상단 예외로 보호합니다.
3. **CSS 완전 격리**: 신규 Tailwind v4 번들은 전용 레이아웃(`head.onoff.php` / `tail.onoff.php`)에만 로드하고, `/community` 게시판 스킨에는 절대 로드하지 않습니다.
4. **백엔드 후속 연동 대상 (Cursor 통합 단계)**:
   - `/contact` → GNUBoard 상담 게시판 또는 전용 PHP API (`POST`, 서버 검증 + CSRF 토큰 + 관리자 열람 권한 제한)
   - `/portfolio` → 실제 공개 동의 완료 프로젝트 확보 시 GNUBoard 포트폴리오 게시판 연동
   - `src/data/seo.ts` → 초기 HTML `<head>` 서버사이드 메타·Canonical·`FAQPage` JSON-LD 출력 및 301/404 상태코드 설정
   - 3대 자동화 도구(루틴·스텝메일·오토포스터) 실제 연동 완료 전까지 `연동 준비 중` 표기 및 비발송/비게시 고지 유지
