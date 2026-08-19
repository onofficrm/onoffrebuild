<?php
include_once(dirname(__FILE__) . '/../../_init.php');

function seosys300_oauth_redirect($query)
{
    $path = seosys300_portal_path() . '/integrations';
    if (!seosys300_redirect_path_allowed($path)) {
        $path = '/seo-system-300/integrations';
    }
    header('Location: ' . $path . '?' . $query);
    exit;
}

if (!seosys300_is_member()) {
    seosys300_oauth_redirect('google=login_required');
}

$mb = seosys300_current_mb_id();
$state = isset($_GET['state']) ? (string) $_GET['state'] : '';
$code = isset($_GET['code']) ? (string) $_GET['code'] : '';
$error = isset($_GET['error']) ? (string) $_GET['error'] : '';

if ($error !== '') {
    seosys300_oauth_redirect('google=denied');
}

$expected = function_exists('get_session') ? (string) get_session('seosys300_oauth_state') : '';
$expectedMb = function_exists('get_session') ? (string) get_session('seosys300_oauth_mb') : '';
if (!seosys300_oauth_state_matches($expected, $state) || $expectedMb === '' || $expectedMb !== $mb) {
    seosys300_oauth_redirect('google=state_mismatch');
}

if ($code === '') {
    seosys300_oauth_redirect('google=missing_code');
}

if (!seosys300_google_configured() || !seosys300_metrics_tables_ready()) {
    seosys300_oauth_redirect('google=not_configured');
}

$tokens = seosys300_google_exchange_code($code);
if (!$tokens) {
    seosys300_oauth_redirect('google=token_failed');
}

seosys300_google_save_tokens($mb, $tokens);
if (function_exists('set_session')) {
    set_session('seosys300_oauth_state', '');
    set_session('seosys300_oauth_mb', '');
}
seosys300_log_activity(0, 'GOOGLE_CONNECTED', 'Google 계정을 연결했습니다.', array(
    'entity_type' => 'google_connection',
    'mb_id' => $mb,
));
seosys300_oauth_redirect('google=connected');
