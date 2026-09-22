# CatchDomain Domain Metric Verification

기준일: 2026-09-22  
범위: READ-ONLY  
근거: production SoT `platform/domain/react` + `platform/domain/repo`  
참고: `catchdomain-seo`는 mock/legacy이며 deploy SoT가 아님

## Classification

### CONFIRMED_UI

- Domain name / TLD
- D-Day / expiryDate / age
- pastSiteTitle / Archive / Topic Consistency / historyQuality
- Ref Domains (`referringDomains`)
- Backlinks total
- Link Quality / Anchor Quality
- Spam Score / spamRiskScore / spamStatus
- Authority Score (primary authority UI — Moz DA 아님)
- Naver Index / Google Index
- Country Distribution / referring TLD distribution
- Google Search Value (keywords / top10 / estimated organic traffic)
- SEO Score / Grade / CatchDomain Score

### CONFIRMED_API

- Education portal: `selectedDomain`, `candidateCount`, `savedCount`, `analyzedAt`, `source`
- CatchDomain repo: `referring_domains`, `sd_anchor_profile`, spam metrics, index flags, archive/history analyzers
- `backlink.da` / `backlink.dr` schema fields (nullable; DataForSEO adapter forces null)

### AVAILABLE_BUT_NOT_UI

- Education portal: `savedCount` / `analyzedAt` (contract only, not always shown)
- Moz DA / Ahrefs-style DR — API leftovers / optional Provider B; prod cards show Authority Score instead
- dofollow/nofollow split counts, platformDistribution, broken_backlinks (mapper/API only)

### NOT_FOUND

- Trust Flow (TF)
- Citation Flow (CF)
- Dedicated content Language field
- Dedicated HTTP Redirect History metric
- Named “SERP” metric (SERP is index-provider plumbing; UI uses Index / Google Search Value)

## Education use notes

- Tip star ratings are education check order, not Google/Naver ranking weights.
- Teach **Authority Score**, not Moz DA / Ahrefs DR as the primary CatchDomain UI metric.
- TF/CF must not be taught as CatchDomain-provided fields.
