<?php
/**
 * ONOFF Marketing Auth Bridge entry.
 * Browser → /api/auth.php?action=… → Core platform_auth (never browser→Core).
 *
 * Do not start a local GNUBoard PHPSESSID here — it would shadow Domain=.icrm.co.kr.
 */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');

require_once dirname(__DIR__) . '/lib/branded-auth/bootstrap.php';
require_once dirname(__DIR__) . '/lib/edu-platform.php';
if (function_exists('edu_platform_apply_env')) {
    edu_platform_apply_env();
}

use OnoffMarketing\BrandedAuth\AuthRouter;

$action = (string) ($_GET['action'] ?? '');
if ($action === '') {
    $path = (string) (parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?? '');
    if (preg_match('#/api/auth(?:\.php)?/([a-zA-Z0-9_/-]+)#', $path, $m)) {
        $action = $m[1];
    }
}
if ($action === '') {
    $action = 'session';
}

AuthRouter::handle($action, strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET')));
