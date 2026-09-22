# Education Slides Preprod Audit

기준일: 2026-09-22

## Source of Truth (single)

`build/seo-system-300/src/education/slides/`

- Catalog: `slideCatalog.ts`
- Lesson 1 visuals: `lesson01/visuals/` (20)
- Lesson 2 visuals: `lesson02/visuals/` (18)
- Viewer/Explanation/Mission: `src/components/slides/`

Editing a visual under `education/slides` changes the education platform.
Builder originals are archived at:

`build/_builder-source/`

## Registry

- Lesson 1: 20
- Lesson 2: 18
- Total: 38
- Unique components: 38
- Explanation summaries: 38/38
- Slide 38: Course Complete
- Lesson 3 preview: NONE

## Visual QA evidence

`docs/qa/`

- lesson1-desktop.png
- lesson1-desktop-1920.png
- lesson1-desktop-1366.png
- lesson1-mobile.png
- lesson2-desktop.png
- lesson2-mobile.png
- visual-qa-report.json

Measured:

- overflowX: false on all captured viewports
- canvas present
- explanation panel present
- progress `n / 38` present
- keyboard ArrowLeft/ArrowRight: ok

## Mission

LOCAL key:

`seosys300_local_only::lesson-2::expired-domain-comparison::v1`

Save + reload persistence: PASS (scripted)

## Domain tips

Remapped to CatchDomain CONFIRMED fields.
TF/CF remain NOT_FOUND / not provided.
