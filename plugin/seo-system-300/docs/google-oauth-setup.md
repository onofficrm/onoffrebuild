# SEO SYSTEM 300 — Google OAuth (GSC / GA4) setup

Code path is already live. This document is **ops only** — never commit secrets.

## 1. Google Cloud

1. Create (or reuse) a Google Cloud project
2. Enable APIs:
   - Google Search Console API
   - Google Analytics Admin API
   - Google Analytics Data API
3. OAuth consent screen (External or Internal)
4. Create **OAuth 2.0 Web client**
5. Authorized redirect URI (exact):

```text
https://onoff.icrm.co.kr/plugin/seo-system-300/api/integrations/google/callback.php
```

(Adjust host if the portal domain differs.)

## 2. Server `config.local.php` (FTP)

Copy from `config.local.php.example` if missing. Set:

```php
putenv('SEOSYS300_GOOGLE_CLIENT_ID=...');
putenv('SEOSYS300_GOOGLE_CLIENT_SECRET=...');
putenv('SEOSYS300_GOOGLE_REDIRECT_URI=https://onoff.icrm.co.kr/plugin/seo-system-300/api/integrations/google/callback.php');
putenv('SEOSYS300_TOKEN_KEY=...'); # random ≥32 chars; used for AES-256-GCM token storage
```

Leave empty until ready — Integrations UI shows **Google API 설정 필요** and disables connect.

## 3. Schema

Migration **003** must exist (`g5_seosys300_google_connections`, project integrations, metric tables). Already part of 001–005 production apply.

## 4. Member smoke

1. Open `/seo-system-300/integrations` with an active project
2. **Google 연결** → consent → redirect `?google=connected`
3. Select Search Console property matching the project domain
4. Select GA4 property
5. Sync once — dashboard banner should move toward **연결됨** / metrics ready

## 5. Security notes

- Do not put Client Secret or Token Key in the React bundle
- Do not reuse Builder Gemini keys; use `SEOSYS300_*` only
- Revoke via Integrations **연결 해제** when testing
