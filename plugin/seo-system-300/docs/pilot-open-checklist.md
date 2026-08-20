# SEO SYSTEM 300 — Pilot open checklist

Production soft-open path: **admin → pilot → all**.

## 0. Prerequisites (already expected on production)

- [ ] Schema **001–005** applied (HeidiSQL or guarded CLI)
- [ ] `plugin/seo-system-300/config.local.php` exists on server (gitignored)
- [ ] Migration unlock flags removed (`SEOSYS300_ALLOW_MIGRATION`, backup/confirm)
- [ ] Member login / register / password recovery return 200
- [ ] `/seo-system-300/dashboard` loads for admin (`SEOSYS300_LAUNCH_MODE=admin`)

## 1. Apply notifications migration (006)

HeidiSQL (shared hosting):

1. Backup DB
2. Run `plugin/seo-system-300/migrations/006_notifications.sql`
3. Optional history row (checksum via `sha256` of the file after apply):

```sql
INSERT INTO `g5_seosys300_migrations` (`migration`, `applied_at`, `checksum`)
VALUES ('006_notifications.sql', NOW(), 'c8071f76ee0733ad24136e1dbfe18769ef2d02330ca4c8535cef8e134ef57704');
```

CLI (if SSH available): guarded `run.php --apply` after allowlists (see `production-migration-plan.md`).

## 2. Mail

- [ ] GNUBoard `cf_email_use` ON
- [ ] Admin from address (`cf_admin_email`) valid
- [ ] Send a test mail from GNUBoard admin if available

Order events now create **in-app notifications** and attempt **email** via `mailer()`:

| Event | Student inbox | Student email | Admin email |
|-------|---------------|---------------|-------------|
| Order submitted | yes | yes | yes |
| Status changed | yes | yes (except → 추가자료 필요) | no |
| Materials requested | yes | yes | no |

## 3. Pilot mode

Edit server `config.local.php` only (FTP):

```php
putenv('SEOSYS300_LAUNCH_MODE=pilot');
putenv('SEOSYS300_PILOT_USERS=mb_id1,mb_id2'); # real GNUBoard mb_id
```

- [ ] Pilot A: login → dashboard → create project → website order submit
- [ ] Pilot A: Notifications tab shows order receipt
- [ ] Admin: Kanban status change → Pilot A sees notification (+ email if mail works)
- [ ] Non-pilot member: portal blocked / preparing screen
- [ ] `session.php` shows `launchMode: "pilot"` (no pilot list in JSON)

## 4. Google (can be same week or next)

Follow `google-oauth-setup.md`. Not required for pilot order/kanban soft open.

- [ ] `SEOSYS300_GOOGLE_*` + `SEOSYS300_TOKEN_KEY` set
- [ ] Connect → pick GSC site → pick GA4 → sync once

## 5. Full open

```php
putenv('SEOSYS300_LAUNCH_MODE=all');
putenv('SEOSYS300_PILOT_USERS=');
```

- [ ] Random member can enter Control Center
- [ ] Admin-only `/seo-system-300/admin` still forbidden for members

## 6. Rollback

1. Set `SEOSYS300_LAUNCH_MODE=admin` or `off`
2. FTP previous known-good commit if SPA/plugin regresses
3. DB: restore dump if 006 must be undone (`006_notifications.down.sql`)
