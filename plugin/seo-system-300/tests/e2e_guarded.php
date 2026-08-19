<?php
/**
 * Guarded E2E helper. Does NOT run against production.
 *
 * Required env:
 *   SEOSYS300_ENV=development
 *   SEOSYS300_E2E=1
 *   SEOSYS300_ALLOW_DB=1
 *   SEOSYS300_E2E_CONFIRM=dev-only
 *   SEOSYS300_DB_ALLOWLIST=<exact G5_MYSQL_DB>
 *
 * Never set these on production. Production hostnames are always refused.
 *
 * CASE checklist (manual or future runner) — requires 001–004 on a non-production DB:
 * AUTH-1..5, Project, IDOR, Website wizard/files, Roadmap, Website→COMPLETED auto,
 * Mission, Activity, Admin kanban/notes/inbox, Google (credentials only),
 * Tools LINK/MANUAL, AI (SEOSYS300_* only), UX, regression.
 */
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}

require_once dirname(__FILE__) . '/../lib/env_guard.lib.php';

$check = seosys300_cli_safety_check(array('e2e' => true, 'migration' => false));
if (!$check['ok']) {
    fwrite(STDERR, "Refusing E2E [{$check['code']}] {$check['message']}\n");
    fwrite(STDERR, "DEVELOPMENT_DB_NOT_AVAILABLE or guard failed. No HTTP cases executed.\n");
    exit(2);
}

$root = dirname(__FILE__) . '/../../..';
if (!is_file($root . '/data/dbconfig.php') && !is_file($root . '/data/dbconfig.local.php')) {
    fwrite(STDERR, "DEVELOPMENT_DB_NOT_AVAILABLE: data/dbconfig.php missing. Abort.\n");
    exit(3);
}

echo "Guard passed. Implement live HTTP cases against local GNUBoard when migrations are applied.\n";
echo "Do not insert test rows into production.\n";
exit(0);
