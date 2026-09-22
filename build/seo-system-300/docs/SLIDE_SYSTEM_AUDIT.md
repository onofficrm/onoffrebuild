# SEO·GEO 교육 슬라이드 LOCAL 감사 기록

기준일: 2026-09-22  
범위: `build/seo-system-300` 및 연결된 1·2강 시각자료  
안전 상태: Production 배포/DB/API write/Git push 없음

## 1. 활성 Source of Truth

- Viewer: `src/components/slides/EducationSlideLibraryView.tsx`
- Deck registry: `src/components/slides/slideDeckRegistry.tsx`
- 설명 데이터: `src/components/slides/content/lesson1Explanations.ts`,
  `lesson2Explanations.ts`
- Domain 교육 데이터: `content/expiredDomainTips.ts`,
  `content/domainMetricMap.ts`
- Mission: `missions/expiredDomainMission.ts`,
  `missions/localExpiredDomainMissionRepository.ts`
- 38장 메타데이터:
  `build/1강-강의자료_-seo·geo-실전-프로세스/src/types/slide.ts`
- 1강 시각자료 20장:
  `build/1강-강의자료_-seo·geo-실전-프로세스-_-온오프마케팅/src/slides`
- 2강 시각자료 18장:
  `build/1강-강의자료_-seo·geo-실전-프로세스/src/slides/lesson02`

메타데이터와 1강 시각자료가 서로 다른 트리에 있으므로 registry를 유일한
런타임 연결 지점으로 유지한다. 전체 프로세스 프로젝트의 `lesson01` 복제본은
현재 교육 플랫폼에서 사용하지 않는다.

## 2. Route 및 연결

- 기본: `/slides/lesson-1`
- 1강: `/slides/lesson-1/1` ~ `/slides/lesson-1/20`
- 2강: `/slides/lesson-2/1` ~ `/slides/lesson-2/18`
- URL의 마지막 숫자는 강의 내부 번호다. 화면의 `globalId`는 1~38이다.
- 잘못되거나 누락된 번호는 해당 강의의 LOCAL 진행 위치로 정규화한다.
- 1강 마지막에서 다음을 누르면 2강 1장으로, 2강 첫 장에서 이전을 누르면
  1강 20장으로 이동한다.

## 3. Viewer 기능

- `FixedSlideCanvas`: 1920×1080 기준, `ResizeObserver`로
  `min(containerWidth / 1920, containerHeight / 1080)` 배율 적용
- Fullscreen: viewer element에 Fullscreen API 적용
- Navigation: 버튼, Arrow/PageUp/PageDown/Space/Home/End, 모바일 swipe
- Sidebar: desktop sticky 목록 + 작은 화면 overlay 목록
- Progress: 강의별 진행률 및 전체 진행률. 전체 장수는 registry에서 계산한다.
- Explanation: 슬라이드 전환 시 연결 데이터가 자동 변경되고 핵심 설명으로
  accordion 상태가 초기화된다.
- Mission: 2강 Mission에서 후보 3개를 LOCAL 저장소에만 기록한다.

## 4. 수량 및 데이터 무결성

- 1강: 20장
- 2강: 18장
- 합계: 38장
- Explanation `summary`: 38/38
- Slide 38: `COURSE COMPLETION · 교육 과정 완료`
- Domain TIP 연결:
  - Slide 31: NAVER / GOOGLE / BOTH 안내
  - Slide 33: 10초 체크
  - Slide 35: 후보 3개 Mission

## 5. Domain 연동 경계

현재 교육 플랫폼의 CatchDomain registry는 `LINK_ONLY`,
`supportsSync: false`, `discovery: NOT_DISCOVERED_API`다.

교육 플랫폼에서 확인된 contract:

- `selectedDomain`
- `candidateCount`
- `savedCount`
- `analyzedAt`
- `source`

CatchDomain 공개 페이지에서 확인된 내용:

- 만료·삭제 예정 후보 추천
- 검색 흔적·과거 운영 기록·백링크 자산을 분석 대상으로 설명
- 만료 전 도메인명 마스킹/포인트 공개
- 만료 후 로그인 회원 도메인명 공개
- 예상 만료 시점(D-Day) 기반 공개 정책
- `searchTarget` public bootstrap 값

상세 UI/API 필드명을 확인하지 못한 항목은 `DOMAIN_METRIC_MAP`에서
`manual` 또는 `not-provided`로 구분했다. Anchor, Spam score,
DA/DR/TF/CF, 검색엔진별 SERP 신호는 교육 플랫폼에 존재하는 필드로
간주하지 않는다.

## 6. SEO 문구 및 시각 감사

- 100% 필터링, 완벽 차단, 영구 독점, 고정 샌드박스 기간,
  1페이지 보장, 공식 신뢰 점수처럼 읽히는 문구를 중립화했다.
- DA/DR/TF/CF는 제3자 참고값으로만 표기한다.
- Domain 화면 mock은 “후보 요약 + 외부 상세 검증”으로 정정했다.
- 우선 슬라이드 04/08/11/12/14 및 27/28/30/31/33/35의 본문을
  축약하거나 확대했다.
- footer, slide number, 영문 metadata badge의 작은 글씨는 UI label로
  간주해 유지했다.

결과: 구조와 핵심 우선 슬라이드는 PASS. 활성 1강 디자인 전반에는
작은 dashboard-style 보조 label이 남아 있어 전체 시각 감사는 PARTIAL이다.

## 7. Legacy / 중복

- `EducationSlidesView.tsx`: import가 없는 1강 전용 legacy viewer.
  파일 상단에 deprecated 표시를 추가했고 삭제하지 않았다.
- `EducationSlideLibraryView.tsx`: 현재 활성 viewer.
- `build/1강-강의자료_-seo·geo-실전-프로세스/src/slides/lesson01`:
  portal registry가 사용하지 않는 1강 복제본.
- `...-_-온오프마케팅/src/_unused`: 기존 격리 폴더.

## 8. 검증 경계

- 정적 route/keyboard/fullscreen/touch 로직 및 38장 registry 연결 확인
- `npm install --legacy-peer-deps`: 완료
- Recharts peer인 `react-is`가 lockfile에 설치되지 않아 첫 build가 실패했고
  명시적 dependency(`react-is@^19`)로 추가한 뒤 해결
- `npm run lint` (`tsc --noEmit`): PASS
- 별도 `typecheck` script: 없음 (`lint`가 TypeScript 검사)
- `npm run build`: PASS
- LOCAL route HTTP smoke:
  - `/slides/lesson-1/1`: 200
  - `/slides/lesson-1/20`: 200
  - `/slides/lesson-2/1`: 200
  - `/slides/lesson-2/18`: 200
- registry runtime check: 20 + 18 = 38, explanation 누락 0, 마지막 제목
  `SEO·GEO 실전 프로세스 기초 과정 완료`
- 설치 감사 결과 moderate dependency vulnerability 3건이 남아 있다.
  범위 밖 강제 upgrade는 수행하지 않았다.
- 실제 인증이 필요한 LOCAL 브라우저 E2E와 기기별 스크린샷 비교는 별도
  인증 가능한 테스트 세션에서 수행해야 한다.
