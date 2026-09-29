# Education Slides Source of Truth

Runtime education slides for `seo-system-300` load ONLY from this directory.

## Active paths

- Catalog: `slideCatalog.ts` (38 slides)
- Lesson 1 visuals: `lesson01/visuals/` (20)
- Lesson 2 visuals: `lesson02/visuals/` (18)
- Viewer shell: `../../components/slides/`
- Shared PPT frame and diagrams: `shared/` (`SlideFrame`, `diagrams.tsx`)
- Explanations / Domain tips / Mission: `../../components/slides/content` and `missions`

## Visual rule

Slides are 1920×1080 diagrams: one title, one key line, and a few short labels.
Sentences that explain the diagram live in `explanation.details` and open in the panel under the slide.

## Not active

Builder originals were moved to:

`/Volumes/onoff/cursor/platform/onoff-home/build/_builder-source/`

Do not import slide components from those trees for the education platform.
