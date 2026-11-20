# How to add a new lesson

교육 슬라이드 Source of Truth:

`src/education/slides/`

Viewer / Explanation / Mission shell:

`src/components/slides/`

Builder originals are archived in `build/_builder-source/` and must not be re-wired.

## 최소 파일

1. `lessonConfig`
   - lesson id, 번호, 제목, 설명, 예상 시간
2. `slides`
   - 1920×1080 시각 컴포넌트
3. `explanations`
   - 슬라이드별 핵심 설명과 선택 섹션
4. `missions`
   - 필요한 강의만 Mission model/repository/UI 추가

## 1. 시각자료 작성

- 제목 1개, 핵심 메시지 1개, 키워드 3~5개를 우선한다.
- 긴 개념 설명, 근거, 실행 순서는 시각자료에 반복하지 않는다.
- Flow, Pipeline, Timeline, Funnel, Network, Comparison, Matrix 중
  가장 빠르게 이해되는 구조를 사용한다.
- `text-[9px]`, `text-[10px]`, `text-[11px]`는 slide number나
  metadata badge가 아니면 사용하지 않는다.
- 결과 보장, 공식 점수로 오해할 수 있는 문구를 쓰지 않는다.

## 2. Explanation 작성

`src/components/slides/content/lessonNExplanations.ts`를 추가한다.

```ts
{
  id: 'lesson-3-slide-01',
  lessonId: 'lesson-3',
  order: 1,
  shortTitle: '짧은 제목',
  visualKeywords: ['FLOW', 'DATA', 'ACTION'],
  explanation: {
    summary: '핵심 개념 한 문단',
    why: ['왜 중요한지'],
    onoffUse: ['플랫폼에서 어디에 연결되는지'],
    action: ['수강생이 할 일'],
  },
}
```

표지·전환·완료 슬라이드는 필요하지 않은 배열을 생략할 수 있다.
설명 key는 slide metadata의 `slug`와 같아야 한다.

## 3. Registry 연결

`src/components/slides/slideDeckRegistry.tsx`에서:

1. 시각 컴포넌트를 import한다.
2. `SLIDE_COMPONENTS`에 global 순서대로 추가한다.
3. `EDUCATION_DECKS`에 새 lesson config를 추가한다.
4. metadata slice 범위를 정확히 지정한다.

장수 표시는 `TOTAL_EDUCATION_SLIDES`에서 자동 계산된다. UI에 전체 장수를
직접 하드코딩하지 않는다.

## 4. Mission 연결

- 데이터 타입과 repository interface를 먼저 정의한다.
- API 연결 전에는 `localStorage` repository만 사용한다.
- UI에 `LOCAL ONLY`를 명확히 표시한다.
- 자동 구매·성과 판정은 만들지 않는다.
- 서버 연결 시 repository 구현만 교체할 수 있도록 UI에서 저장 방식을
  직접 구현하지 않는다.

## 5. Route

표준 route:

```text
/slides/lesson-{number}/{lesson-local-slide-number}
```

`getEducationDeck`이 새 lesson id를 찾을 수 있어야 한다. 이전/다음 강의
이동이 배열 순서와 일치하는지 확인한다.

## 6. 완료 전 검사

- metadata / component / explanation 수가 모두 같은가
- 첫 장과 마지막 장 route가 열리는가
- 이전/다음 및 강의 경계 이동이 되는가
- keyboard, fullscreen, swipe가 동작하는가
- explanation이 현재 slide와 같이 바뀌는가
- Mission이 서버 write 없이 동작하는가
- `npm run lint`
- 별도 `typecheck` script가 없으면 `lint`가 `tsc --noEmit`인지 확인
- `npm run build`
