# Education Slides — Production Release 2026-09-22

Status: **ONOFF_EDUCATION_PRODUCTION_LIVE** · Project close-out: **ONOFF_EDUCATION_PROJECT_CLOSED**

## Production URL

- Entry: https://onoff.icrm.co.kr/seo-system-300/
- Reference slide: https://onoff.icrm.co.kr/seo-system-300/slides/lesson-1/20
- Lesson 1 start: https://onoff.icrm.co.kr/seo-system-300/slides/lesson-1/1
- Lesson 2 end: https://onoff.icrm.co.kr/seo-system-300/slides/lesson-2/18

## Scope shipped

| Item | Value |
|------|--------|
| Lesson 1 | 20 slides |
| Lesson 2 | 18 slides |
| Total | 38 |
| Slide 38 | COURSE COMPLETE |
| Lesson 3 teaser | NONE |
| Explanation | 38/38 PASS |
| Domain Tips | NAVER / GOOGLE / BOTH PASS |
| Mission storage | browser **localStorage** |
| Account sync | **NOT IMPLEMENTED** |
| Desktop / Mobile / Fullscreen | PASS |
| lint / build | PASS |
| Production DB writes | NONE |
| Auth / Payment / Point changes | NONE |
| domain.icrm.co.kr changes | NONE |
| Git push for this release | NONE (FTP SPA deploy only) |

## Source of Truth (active)

```
build/seo-system-300/src/education/slides/
```

- Catalog: `slideCatalog.ts` (38)
- Lesson 1 visuals: `lesson01/visuals/` (20)
- Lesson 2 visuals: `lesson02/visuals/` (18)
- Viewer / Explanation / Mission / Tips: `build/seo-system-300/src/components/slides/`

See also: `build/seo-system-300/src/education/slides/SOURCE_OF_TRUTH.md`

## Builder originals (preserved, not runtime)

```
build/_builder-source/
```

Do not import runtime slides from this tree. Archive only.

## Deployed build identity

| Field | Value |
|-------|--------|
| Deploy start (UTC) | 2026-09-22T15:15:14Z |
| Deploy end (UTC) | 2026-09-22T15:16:17Z |
| Method | `scripts/deploy-seo-system-300.sh` (lftp mirror `--no-perms` + `scripts/ftp-chmod-tree.py` dirs 755 / files 644) |
| Remote path | `/public_html/seo-system-300/` |
| Local publish tree | `seo-system-300/` (from `npm run build:deploy`) |
| Main JS | `assets/index-BUTR6RFD.js` |
| Main CSS | `assets/index-Okqsy7N-.css` |
| Slides chunk | `assets/EducationSlideLibraryView-B1I42fWv.js` |
| Local SHA256 (index) | `5927aa7edcc5229c86cb63b49f9287fb8c0ee1f40144237ab0fc57a89665b284` |
| Local SHA256 (slides) | `98b67a6235d23c4ed93e6221f69549bd5d4442c8e14e8cfb918f5d178427ae24` |

Production index references the same hashed assets (`index-BUTR6RFD.js`, `index-Okqsy7N-.css`). Slides chunk HTTP 200 on live.

## Backup / Rollback

| Field | Path |
|-------|------|
| Backup root | `/Volumes/onoff/cursor/platform/onoff-home/backups/seo-system-300-pre-education-slides-20260922T151357Z` |
| Pre-deploy SPA snapshot | `…/seo-system-300/` (previous `index-B9jrSMQV.js` tree) |
| Manifest | `…/MANIFEST.txt` |
| Rollback procedure | `…/ROLLBACK.md` |

Rollback restores **only** `/public_html/seo-system-300/` via reverse FTP mirror + chmod. No DB restore required for this frontend-only release.

## Known issues

1. **`/data/seo/favicon` HTTP 500** — pre-existing; unrelated to education slides SPA deploy.
2. **Mission / progress** — browser `localStorage` only; not synced across accounts or devices.
3. **Production interactive walk without enrollment** — SPA shows enrollment/login gate (expected). Content verified via live hashed bundle + LOCAL QA of the same build.

## Future work (out of scope for this close-out)

- Account-based Mission / Progress persistence (server API + member-scoped storage)
- Optional: fix `/data/seo/favicon` 500
- Git commit / push of LOCAL education sources when the team chooses to land them on the remote branch

## Close-out constraints honored

- No further Production deploy during close-out
- No new feature development
- No arbitrary deletion of unused files
- No Git push
- No Production DB / API writes
- Builder originals left under `_builder-source/`
