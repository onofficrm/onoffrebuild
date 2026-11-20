# Education Slides Source of Truth

Runtime education slides for `seo-system-300` load ONLY from this directory.

## Active paths

- Lecture registry: `lessons/index.ts` (`LESSONS` — the only registration point)
- Lecture data: `lessons/lesson01.ts` (20), `lessons/lesson02.ts` (18); new lectures start from `lessons/_lessonTemplate.ts`
- Slide data type: `shared/slideSpec.ts` (`SlideSpec`, `SlideDiagram`, `LessonDefinition`)
- Renderer: `shared/SlideRenderer.tsx` (`SlideFrame` + one diagram from `shared/diagrams.tsx` + optional `OutcomeBar`)
- Decks, page numbers, totals, next/previous lecture: `../../components/slides/slideDeckRegistry.tsx` (derived from `LESSONS`)
- Viewer shell: `../../components/slides/`
- Explanations / Domain tips / Mission: `../../components/slides/content` and `missions`
- `slideCatalog.ts` and `lesson01.ts` are derived compatibility exports for the deprecated `EducationSlidesView`; do not edit slides there.

## Adding a lecture

1. Copy `lessons/_lessonTemplate.ts` to `lessons/lessonNN.ts` and fill it in.
2. Add `components/slides/content/lessonNExplanations.ts` (keyed by slug, with `details`).
3. Append the lesson to `LESSONS` in `lessons/index.ts`.

Page numbers, lecture cards, sidebar, and navigation update automatically.

## Visual rule

Slides are 1920×1080 diagrams: one title, one key line, and a few short labels.
Sentences that explain the diagram live in `explanation.details` and open in the panel under the slide.
See `.cursor/rules/education-slides-ppt-style.mdc`.

## Not active

Builder originals were moved to:

`/Volumes/onoff/cursor/platform/onoff-home/build/_builder-source/`

Do not import slide components from those trees for the education platform.
