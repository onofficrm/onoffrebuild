<?php
define('_GNUBOARD_', true);
include_once dirname(__FILE__) . '/../lib/validate.php';
include_once dirname(__FILE__) . '/../lib/constants.php';
include_once dirname(__FILE__) . '/../lib/metrics_parse.lib.php';
include_once dirname(__FILE__) . '/../lib/tools_parse.lib.php';
include_once dirname(__FILE__) . '/../lib/crypto.lib.php';
include_once dirname(__FILE__) . '/../lib/env_guard.lib.php';
include_once dirname(__FILE__) . '/../lib/launch.lib.php';

$failed = 0;
function seosys300_assert($cond, $label)
{
    global $failed;
    if ($cond) {
        echo "PASS {$label}\n";
        return;
    }
    $failed++;
    echo "FAIL {$label}\n";
}

seosys300_assert(seosys300_valid_http_url('https://example.com') === true, 'https url ok');
seosys300_assert(seosys300_valid_http_url('http://example.com/path') === true, 'http url ok');
seosys300_assert(seosys300_valid_http_url('javascript:alert(1)') === false, 'javascript scheme rejected');
seosys300_assert(seosys300_valid_http_url('data:text/html,hi') === false, 'data scheme rejected');
seosys300_assert(seosys300_valid_http_url('ftp://example.com') === false, 'ftp rejected');

$blocked = seosys300_blocked_upload_ext();
seosys300_assert(seosys300_filename_has_blocked_ext('shell.php', $blocked) === true, 'php blocked');
seosys300_assert(seosys300_filename_has_blocked_ext('photo.php.jpg', $blocked) === true, 'double ext php blocked');
seosys300_assert(seosys300_filename_has_blocked_ext('logo.svg', $blocked) === true, 'svg blocked');
seosys300_assert(seosys300_filename_has_blocked_ext('brief.pdf', $blocked) === false, 'pdf not blocked');

$allowed = seosys300_allowed_upload_ext();
seosys300_assert(in_array(seosys300_safe_ext('a.PNG'), $allowed, true), 'png allowed');
seosys300_assert(!in_array('svg', $allowed, true), 'svg not in allow list');

$catalog = seosys300_feature_catalog();
seosys300_assert(isset($catalog['inquiry_form']), 'feature key inquiry_form');
seosys300_assert(isset($catalog['kakaotalk']), 'feature key kakaotalk');

seosys300_assert(seosys300_progress_percent(0, 0) === 0, 'progress empty');
seosys300_assert(seosys300_progress_percent(1, 4) === 25, 'progress 25');
seosys300_assert(seosys300_progress_percent(4, 4) === 100, 'progress 100');
seosys300_assert(seosys300_website_progress_for_status('submitted') === 20, 'website progress submitted');
seosys300_assert(seosys300_website_progress_for_status('completed') === 100, 'website progress completed');
seosys300_assert(seosys300_kanban_column_for_status('submitted') === 'new_order', 'kanban submitted');
seosys300_assert(seosys300_kanban_column_for_status('customer_review') === 'qa', 'kanban qa');
seosys300_assert(seosys300_status_for_kanban_column('qa') === 'customer_review', 'kanban reverse qa');
seosys300_assert(seosys300_is_allowed_order_status('draft') === true, 'status allowlist draft');
seosys300_assert(seosys300_is_allowed_order_status('hacked') === false, 'status allowlist reject');
seosys300_assert(in_array('project_setup', seosys300_roadmap_step_keys(), true), 'step key project_setup');
seosys300_assert(seosys300_timezone() !== '', 'timezone set');
seosys300_assert(preg_match('/^\d{4}-\d{2}-\d{2}$/', seosys300_today_date()) === 1, 'today date format');

$picked = seosys300_pick_mission_task_ids(array(
    array('task_id' => 1, 'status' => 'completed', 'is_required' => 1, 'is_current_step' => 1, 'step_sort' => 1, 'task_sort' => 1),
    array('task_id' => 2, 'status' => 'in_progress', 'is_required' => 1, 'is_current_step' => 1, 'step_sort' => 2, 'task_sort' => 1),
    array('task_id' => 3, 'status' => 'not_started', 'is_required' => 1, 'is_current_step' => 1, 'step_sort' => 2, 'task_sort' => 2),
    array('task_id' => 4, 'status' => 'not_started', 'is_required' => 0, 'is_current_step' => 0, 'step_sort' => 9, 'task_sort' => 1),
    array('task_id' => 5, 'status' => 'skipped', 'is_required' => 1, 'is_current_step' => 1, 'step_sort' => 1, 'task_sort' => 2),
), 3);
seosys300_assert($picked[0] === 2, 'mission prefers in_progress');
seosys300_assert(!in_array(1, $picked, true), 'mission excludes completed');
seosys300_assert(!in_array(5, $picked, true), 'mission excludes skipped');

seosys300_assert(seosys300_google_scope_allowed('https://www.googleapis.com/auth/webmasters.readonly'), 'gsc readonly scope');
seosys300_assert(!seosys300_google_scope_allowed('https://www.googleapis.com/auth/webmasters'), 'gsc write scope rejected');
seosys300_assert(seosys300_provider_allowed('GOOGLE_ANALYTICS'), 'provider ga4');
seosys300_assert(!seosys300_provider_allowed('ads'), 'provider reject');
$st = seosys300_oauth_state_create();
seosys300_assert(strlen($st) === 64, 'oauth state length');
seosys300_assert(seosys300_oauth_state_matches($st, $st), 'oauth state match');
seosys300_assert(!seosys300_oauth_state_matches($st, 'nope'), 'oauth state mismatch');
seosys300_assert(seosys300_redirect_path_allowed('/seo-system-300/integrations'), 'redirect allow portal');
seosys300_assert(!seosys300_redirect_path_allowed('https://evil.example/'), 'open redirect blocked');
seosys300_assert(seosys300_normalize_host('sc-domain:Example.com') === 'example.com', 'normalize sc-domain');
seosys300_assert(seosys300_normalize_host('https://www.example.com/path') === 'example.com', 'normalize url prefix');
seosys300_assert(seosys300_domain_mismatch('cebutrip.co.kr', 'https://example.com/') === true, 'domain mismatch');
seosys300_assert(seosys300_domain_mismatch('www.example.com', 'sc-domain:example.com') === false, 'domain related ok');
seosys300_assert(seosys300_ga4_property_id_valid('properties/123456') === '123456', 'ga4 property parse');
seosys300_assert(seosys300_ga4_property_id_valid('abc') === '', 'ga4 property reject');
seosys300_assert(abs(seosys300_ctr(10, 100) - 0.1) < 0.0001, 'ctr calc');
seosys300_assert((int) seosys300_period_change_pct(120, 100) === 20, 'period +20');
seosys300_assert(seosys300_period_change_pct(50, 0) === null, 'period no baseline');
seosys300_assert(seosys300_sync_cooldown_ok(null) === true, 'cooldown empty ok');
seosys300_assert(seosys300_sync_cooldown_ok(time() - 10, time(), 60) === false, 'cooldown block');
seosys300_assert(seosys300_sync_cooldown_ok(time() - 120, time(), 60) === true, 'cooldown allow');
seosys300_assert(strpos(seosys300_redact_secret('Bearer ya29.abc Authorization'), '[REDACTED]') !== false, 'redact bearer');
seosys300_assert(strpos(seosys300_redact_secret('access_token=secret'), '[REDACTED]') !== false, 'redact access_token');

$gscDaily = seosys300_gsc_parse_searchanalytics(file_get_contents(dirname(__FILE__) . '/fixtures/gsc_searchanalytics.json'), 1);
seosys300_assert(count($gscDaily) === 2 && $gscDaily[0]['clicks'] === 12, 'gsc parser daily');
$sites = seosys300_gsc_parse_sites(file_get_contents(dirname(__FILE__) . '/fixtures/gsc_sites.json'));
seosys300_assert($sites[1]['siteUrl'] === 'sc-domain:example.com', 'gsc sites parser');
$ga4 = seosys300_ga4_parse_runreport(file_get_contents(dirname(__FILE__) . '/fixtures/ga4_runreport.json'));
seosys300_assert($ga4[0]['metric_date'] === '2026-08-01' && (int) $ga4[0]['sessions'] === 55, 'ga4 runReport parser');
$acc = seosys300_ga4_parse_account_summaries(file_get_contents(dirname(__FILE__) . '/fixtures/ga4_accountsummaries.json'));
seosys300_assert($acc[0]['propertyId'] === '123456', 'ga4 accountSummaries parser');
$opps = seosys300_opportunity_rules(array(
    array('query' => 'low ctr', 'impressions' => 500, 'ctr' => 0.01, 'position' => 3, 'clicks' => 5),
    array('query' => 'near', 'impressions' => 20, 'ctr' => 0.1, 'position' => 12, 'clicks' => 2),
    array('query' => 'drop', 'impressions' => 20, 'ctr' => 0.1, 'position' => 4, 'clicks' => 2, 'previousClicks' => 20),
));
$rules = array();
foreach ($opps as $o) {
    $rules[] = $o['rule'];
}
seosys300_assert(in_array('high_impression_low_ctr', $rules, true), 'opp low ctr');
seosys300_assert(in_array('near_top', $rules, true), 'opp near top');
seosys300_assert(in_array('declining', $rules, true), 'opp declining');
seosys300_assert(seosys300_organic_traffic_definition()['ga4DimensionValue'] === 'Organic Search', 'organic sessions definition');

putenv('SEOSYS300_TOKEN_KEY=' . str_repeat('unit-test-secret-key-32b!!', 1));
$enc = seosys300_encrypt_secret('refresh-token-value');
$dec = seosys300_decrypt_secret($enc);
seosys300_assert($enc !== '' && $dec === 'refresh-token-value', 'token encrypt roundtrip');
seosys300_assert(strpos($enc, 'refresh-token-value') === false, 'ciphertext hides plaintext');

seosys300_assert(seosys300_tool_key_allowed('catchdomain'), 'tool key ok');
seosys300_assert(!seosys300_tool_key_allowed('ads'), 'tool key reject');
seosys300_assert(seosys300_integration_level_allowed('LINK_ONLY'), 'level link');
seosys300_assert(seosys300_sync_provider_allowed('BACKLINK'), 'sync provider backlink');
seosys300_assert(seosys300_tool_url_matches_config('https://domain.icrm.co.kr', 'https://domain.icrm.co.kr'), 'url allowlist match');
seosys300_assert(!seosys300_tool_url_matches_config('https://evil.example', 'https://domain.icrm.co.kr'), 'url allowlist reject');
seosys300_assert(seosys300_is_stale(date('Y-m-d H:i:s', time() - 8 * 86400), time()), 'stale 8d');
seosys300_assert(!seosys300_is_stale(date('Y-m-d H:i:s', time() - 3600), time()), 'not stale 1h');

$citems = seosys300_content_parse_items(file_get_contents(dirname(__FILE__) . '/fixtures/content_items.json'));
seosys300_assert(count($citems) === 2 && $citems[0]['status'] === 'published', 'content parser');
$cc = seosys300_content_counts($citems);
seosys300_assert($cc['publishedCount'] === 1 && $cc['draftCount'] === 1, 'content counts');
$bl = seosys300_backlink_parse_summary(file_get_contents(dirname(__FILE__) . '/fixtures/backlink_summary.json'));
seosys300_assert($bl['referringDomains'] === 12 && $bl['lostBacklinks'] === 1, 'backlink parser');
$tr = seosys300_traffic_parse_campaigns(file_get_contents(dirname(__FILE__) . '/fixtures/traffic_campaigns.json'));
seosys300_assert($tr['deliveredVisits'] === 1800 && $tr['campaigns'][0]['keyword'] === 'cebu', 'traffic parser');

$stripped = seosys300_ai_strip_pii(array('name' => 'Site', 'email' => 'a@b.com', 'mb_id' => 'user1', 'domain' => 'x.com'));
seosys300_assert(!isset($stripped['email']) && !isset($stripped['mb_id']) && $stripped['domain'] === 'x.com', 'pii stripped');
$piiCtx = seosys300_ai_strip_pii(array(
    'organicSessions' => 10,
    'sessionDefaultChannelGroup' => 'Organic Search',
    'adminNote' => 'internal',
    'cookie' => 'sid',
    'refresh_token' => 'secret',
    'phone' => '01000000000',
));
seosys300_assert(!isset($piiCtx['adminNote']) && !isset($piiCtx['cookie']) && !isset($piiCtx['refresh_token']) && !isset($piiCtx['phone']), 'pii nested secrets dropped');
seosys300_assert(isset($piiCtx['organicSessions']) && isset($piiCtx['sessionDefaultChannelGroup']), 'ga4 channel group kept');

$denyProd = seosys300_cli_safety_check(array(
    'sapi' => 'cli',
    'env' => 'development',
    'allow_migration' => '1',
    'confirm' => 'dev-only',
    'host_blob' => 'www.icrm.co.kr',
    'mysql_host' => 'localhost',
    'mysql_db' => 'devdb',
    'db_allowlist' => 'devdb',
    'migration' => true,
));
seosys300_assert($denyProd['ok'] === false && $denyProd['code'] === 'PRODUCTION_HOST', 'guard blocks production host even with flags');
$denyRemote = seosys300_cli_safety_check(array(
    'sapi' => 'cli',
    'env' => 'development',
    'allow_migration' => '1',
    'confirm' => 'dev-only',
    'host_blob' => 'laptop.local',
    'mysql_host' => 'db.example.com',
    'mysql_db' => 'devdb',
    'db_allowlist' => 'devdb',
    'migration' => true,
));
seosys300_assert($denyRemote['ok'] === false && $denyRemote['code'] === 'DB_HOST_NOT_DOCKER', 'guard blocks remote mysql host');
$denyLoopback = seosys300_cli_safety_check(array(
    'sapi' => 'cli',
    'env' => 'development',
    'allow_migration' => '1',
    'confirm' => 'dev-only',
    'host_blob' => 'laptop.local',
    'mysql_host' => '127.0.0.1',
    'mysql_db' => 'seosys300_dev',
    'db_allowlist' => 'seosys300_dev',
    'migration' => true,
));
seosys300_assert($denyLoopback['ok'] === false && $denyLoopback['code'] === 'DB_HOST_NOT_DOCKER', 'guard requires docker host db');
$denyName = seosys300_cli_safety_check(array(
    'sapi' => 'cli',
    'env' => 'development',
    'allow_migration' => '1',
    'confirm' => 'dev-only',
    'host_blob' => 'laptop.local',
    'mysql_host' => 'db',
    'mysql_db' => 'production_lookalike',
    'db_allowlist' => 'seosys300_dev',
    'migration' => true,
));
seosys300_assert($denyName['ok'] === false && $denyName['code'] === 'DB_NAME_NOT_DEV', 'guard requires seosys300_dev');
$denyIcrmDb = seosys300_cli_safety_check(array(
    'sapi' => 'cli',
    'env' => 'development',
    'allow_migration' => '1',
    'confirm' => 'dev-only',
    'host_blob' => 'laptop.local',
    'mysql_host' => 'db',
    'mysql_db' => 'icrm_prod',
    'db_allowlist' => 'icrm_prod',
    'migration' => true,
));
seosys300_assert($denyIcrmDb['ok'] === false && $denyIcrmDb['code'] === 'PRODUCTION_DB', 'guard blocks icrm db name');
$allowDev = seosys300_cli_safety_check(array(
    'sapi' => 'cli',
    'env' => 'development',
    'allow_migration' => '1',
    'confirm' => 'dev-only',
    'host_blob' => 'gimhaseong-ui-MacBookPro-843.local',
    'mysql_host' => 'db',
    'mysql_db' => 'seosys300_dev',
    'db_allowlist' => 'seosys300_dev',
    'migration' => true,
));
seosys300_assert($allowDev['ok'] === true, 'guard allows docker db + seosys300_dev');
seosys300_assert(seosys300_expected_step_keys() === seosys300_roadmap_step_keys(), 'step keys match constants');
$tables = seosys300_expected_schema_tables('g5_');
seosys300_assert(count($tables['core']) === 8 && count($tables['roadmap']) === 7 && count($tables['google']) === 7 && count($tables['tools_ai']) === 3, 'schema table counts');
$split = seosys300_split_sql_statements("-- c\nCREATE TABLE a (id int);\nCREATE TABLE b (id int);");
seosys300_assert(count($split) === 2, 'sql splitter two statements');
$savedSapiPort = isset($_SERVER['SERVER_PORT']) ? $_SERVER['SERVER_PORT'] : null;
unset($_SERVER['SERVER_PORT'], $_SERVER['HTTP_HOST'], $_SERVER['SERVER_NAME'], $_SERVER['REQUEST_URI'], $_SERVER['REMOTE_ADDR']);
seosys300_cli_prepare_server();
seosys300_assert($_SERVER['SERVER_PORT'] === '80' && $_SERVER['HTTP_HOST'] === 'localhost' && $_SERVER['SERVER_NAME'] === 'localhost', 'cli server defaults');
seosys300_assert(strpos($_SERVER['HTTP_HOST'], 'icrm') === false, 'cli host is not production');
if ($savedSapiPort !== null) {
    $_SERVER['SERVER_PORT'] = $savedSapiPort;
}
$val = seosys300_ai_validate_response('{"summary":"ok","health":{"overall":null},"insights":[],"actions":[{"title":"x","priority":"HIGH","tool":"CONTENT"}],"warnings":[]}');
seosys300_assert($val['ok'] && $val['data']['actions'][0]['priority'] === 'HIGH', 'ai json validate');
seosys300_assert(!seosys300_ai_validate_response('not-json')['ok'], 'ai json reject');

$hs = seosys300_health_score_rules(array('contentPublished' => 26, 'contentGoal' => 30, 'gscReady' => true, 'ga4Ready' => false));
seosys300_assert($hs['content'] !== null && $hs['technical'] === 50 && $hs['kind'] === 'rule_based', 'health score rules');
$ms = seosys300_milestone_rules(array('impressions' => 1200, 'contentPublished' => 1, 'clicks' => 10));
$keys = array();
foreach ($ms as $m) {
    if ($m['achieved']) {
        $keys[] = $m['key'];
    }
}
seosys300_assert(in_array('first_content', $keys, true) && in_array('impressions_1000', $keys, true), 'milestones achieved');
seosys300_assert(!in_array('impressions_10000', $keys, true), 'milestones not fake');
seosys300_assert(seosys300_area_status(true, false, true) === 'ERROR', 'partial failure status');

putenv('SEOSYS300_LAUNCH_MODE=off');
putenv('SEOSYS300_PILOT_USERS=student_a,testuser1');
seosys300_assert(seosys300_launch_mode() === 'off', 'launch mode off');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => true, 'mb_id' => 'admin')) === false, 'off blocks admin');
putenv('SEOSYS300_LAUNCH_MODE=admin');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => true, 'mb_id' => 'admin')) === true, 'admin mode allows admin');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => false, 'mb_id' => 'student_a')) === false, 'admin mode blocks student');
putenv('SEOSYS300_LAUNCH_MODE=pilot');
seosys300_assert(seosys300_is_pilot_member('student_a') === true, 'pilot list match');
seosys300_assert(seosys300_is_pilot_member('student_b') === false, 'pilot list miss');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => false, 'mb_id' => 'student_a')) === true, 'pilot allows listed student');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => false, 'mb_id' => 'student_b')) === false, 'pilot blocks other student');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => true, 'mb_id' => 'admin')) === true, 'pilot allows admin');
putenv('SEOSYS300_LAUNCH_MODE=all');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => true, 'is_admin' => false, 'mb_id' => 'student_b')) === true, 'all allows member');
seosys300_assert(seosys300_is_launch_allowed(array('authenticated' => false, 'is_admin' => false, 'mb_id' => '')) === false, 'all blocks guest');
putenv('SEOSYS300_LAUNCH_MODE=unknown');
seosys300_assert(seosys300_launch_mode() === 'off', 'unknown mode falls back to off');
$pub = seosys300_launch_public_state();
seosys300_assert(isset($pub['launchMode'], $pub['launchAllowed']) && !isset($pub['pilotUsers']), 'launch public state has no pilot list');
putenv('SEOSYS300_LAUNCH_MODE=');
putenv('SEOSYS300_PILOT_USERS=');

echo $failed === 0 ? "ALL PASS\n" : "FAILED {$failed}\n";
exit($failed === 0 ? 0 : 1);
