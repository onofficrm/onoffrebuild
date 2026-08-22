<?php
/**
 * Public access guard — admin warnings for accidental IP lockdown.
 * Host firewall (iwinv) is separate; see docs/IWINV-PUBLIC-ACCESS.md
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (is_file(G5_LIB_PATH . '/onoff-access-guard.lib.php')) {
    include_once G5_LIB_PATH . '/onoff-access-guard.lib.php';
}

// Admin banner only on config form (avoid breaking file downloads)
$onoff_access_script = isset($_SERVER['SCRIPT_NAME']) ? (string) $_SERVER['SCRIPT_NAME'] : '';
if (
    defined('G5_IS_ADMIN') && G5_IS_ADMIN
    && onoff_access_guard_enabled()
    && onoff_access_forbid_possible_ip()
    && preg_match('#/adm/config_form\.php$#', $onoff_access_script)
) {
    global $config;
    $possible = isset($config['cf_possible_ip']) ? trim((string) $config['cf_possible_ip']) : '';
    if ($possible !== '') {
        echo '<div class="local_desc01" style="border:2px solid #b91c1c;background:#fef2f2;padding:12px 14px;margin:12px 0;">';
        echo '<strong style="color:#991b1b;">[공개 접속 위험]</strong> ';
        echo '환경설정의 <code>접근가능 IP</code>가 비어 있지 않습니다. 공개 사이트에서는 반드시 비워 두세요. ';
        echo '외부에서 사이트가 안 열리면 <strong>iwinv 방화벽 / 해외접속차단</strong>을 확인하세요. (재배포로 해결되지 않습니다)';
        echo '</div>';
        if (function_exists('onoff_access_log')) {
            onoff_access_log('admin_possible_ip_warning', array('possible_ip_set' => true));
        }
    }
}
