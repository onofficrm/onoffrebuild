<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_metrics_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_google_connections_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_google_connections_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_require_metrics_tables()
{
    if (!seosys300_metrics_tables_ready()) {
        seosys300_json_error(503, 'tables_missing', 'SEO 성과 테이블이 아직 준비되지 않았습니다.');
    }
}

function seosys300_google_auth_url($mb_id)
{
    seosys300_require_google_config();
    $state = seosys300_oauth_state_create();
    if (function_exists('set_session')) {
        set_session('seosys300_oauth_state', $state);
        set_session('seosys300_oauth_mb', (string) $mb_id);
        set_session('seosys300_oauth_at', (string) time());
    }
    $params = array(
        'client_id' => seosys300_google_client_id(),
        'redirect_uri' => seosys300_google_redirect_uri(),
        'response_type' => 'code',
        'scope' => implode(' ', seosys300_google_readonly_scopes()),
        'access_type' => 'offline',
        'include_granted_scopes' => 'true',
        'prompt' => 'consent',
        'state' => $state,
    );
    return 'https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params);
}

function seosys300_google_connection_row($mb_id)
{
    global $g5;
    $mb_id = seosys300_esc((string) $mb_id);
    return seosys300_fetch("SELECT * FROM `{$g5['seosys300_google_connections_table']}` WHERE mb_id = '{$mb_id}' LIMIT 1");
}

function seosys300_google_connection_public($row)
{
    if (!$row) {
        return array(
            'configured' => seosys300_google_configured(),
            'connected' => false,
            'status' => 'disconnected',
            'googleEmailMasked' => '',
            'scopes' => array(),
        );
    }
    $email = (string) $row['google_email'];
    $masked = '';
    if ($email !== '' && strpos($email, '@') !== false) {
        $parts = explode('@', $email, 2);
        $masked = substr($parts[0], 0, 1) . '***@' . $parts[1];
    }
    return array(
        'configured' => seosys300_google_configured(),
        'connected' => (string) $row['status'] === 'connected',
        'status' => (string) $row['status'],
        'googleEmailMasked' => $masked,
        'scopes' => array_filter(explode(' ', (string) $row['scopes'])),
        'connectedAt' => (string) $row['connected_at'],
    );
}

function seosys300_google_save_tokens($mb_id, $tokenJson)
{
    global $g5;
    $access = isset($tokenJson['access_token']) ? (string) $tokenJson['access_token'] : '';
    $refresh = isset($tokenJson['refresh_token']) ? (string) $tokenJson['refresh_token'] : '';
    $expiresIn = isset($tokenJson['expires_in']) ? (int) $tokenJson['expires_in'] : 3500;
    $scope = isset($tokenJson['scope']) ? (string) $tokenJson['scope'] : implode(' ', seosys300_google_readonly_scopes());
    if ($access === '') {
        return false;
    }
    $existing = seosys300_google_connection_row($mb_id);
    if ($refresh === '' && $existing && (string) $existing['refresh_token_encrypted'] !== '') {
        $refreshStored = (string) $existing['refresh_token_encrypted'];
    } else {
        $refreshStored = seosys300_encrypt_secret($refresh);
    }
    $accessStored = seosys300_encrypt_secret($access);
    if ($accessStored === '' || ($refreshStored === '' && $refresh !== '')) {
        seosys300_json_error(503, 'GOOGLE_NOT_CONFIGURED', '토큰 암호화 키가 필요합니다.');
    }
    $now = seosys300_now();
    $exp = date('Y-m-d H:i:s', time() + max(60, $expiresIn - 60));
    $table = $g5['seosys300_google_connections_table'];
    $mb = seosys300_esc($mb_id);
    if ($existing) {
        $refreshSql = $refreshStored !== '' ? "refresh_token_encrypted = '" . seosys300_esc($refreshStored) . "'," : '';
        return seosys300_query("UPDATE `{$table}` SET
            access_token_encrypted = '" . seosys300_esc($accessStored) . "',
            {$refreshSql}
            token_expires_at = '{$exp}',
            scopes = '" . seosys300_esc($scope) . "',
            status = 'connected',
            last_refresh_at = '{$now}',
            updated_at = '{$now}'
            WHERE mb_id = '{$mb}'");
    }
    return seosys300_query("INSERT INTO `{$table}` SET
        mb_id = '{$mb}',
        google_account_id = '',
        google_email = '',
        access_token_encrypted = '" . seosys300_esc($accessStored) . "',
        refresh_token_encrypted = '" . seosys300_esc($refreshStored) . "',
        token_expires_at = '{$exp}',
        scopes = '" . seosys300_esc($scope) . "',
        status = 'connected',
        connected_at = '{$now}',
        last_refresh_at = '{$now}',
        created_at = '{$now}',
        updated_at = '{$now}'");
}

function seosys300_google_exchange_code($code)
{
    $res = seosys300_http_json('POST', 'https://oauth2.googleapis.com/token', array(
        'headers' => array('Content-Type' => 'application/x-www-form-urlencoded'),
        'body' => array(
            'code' => $code,
            'client_id' => seosys300_google_client_id(),
            'client_secret' => seosys300_google_client_secret(),
            'redirect_uri' => seosys300_google_redirect_uri(),
            'grant_type' => 'authorization_code',
        ),
    ));
    if ($res['status'] < 200 || $res['status'] >= 300 || empty($res['json']['access_token'])) {
        seosys300_log('google token exchange failed status=' . $res['status']);
        return null;
    }
    return $res['json'];
}

function seosys300_google_refresh($mb_id)
{
    $row = seosys300_google_connection_row($mb_id);
    if (!$row) {
        return null;
    }
    $refresh = seosys300_decrypt_secret($row['refresh_token_encrypted']);
    if ($refresh === '') {
        seosys300_google_mark_reauth($mb_id);
        return null;
    }
    $res = seosys300_http_json('POST', 'https://oauth2.googleapis.com/token', array(
        'headers' => array('Content-Type' => 'application/x-www-form-urlencoded'),
        'body' => array(
            'refresh_token' => $refresh,
            'client_id' => seosys300_google_client_id(),
            'client_secret' => seosys300_google_client_secret(),
            'grant_type' => 'refresh_token',
        ),
    ));
    if ($res['status'] < 200 || $res['status'] >= 300 || empty($res['json']['access_token'])) {
        seosys300_google_mark_reauth($mb_id);
        return null;
    }
    $json = $res['json'];
    if (empty($json['refresh_token'])) {
        $json['refresh_token'] = $refresh;
    }
    seosys300_google_save_tokens($mb_id, $json);
    return seosys300_google_connection_row($mb_id);
}

function seosys300_google_mark_reauth($mb_id)
{
    global $g5;
    $now = seosys300_now();
    seosys300_query("UPDATE `{$g5['seosys300_google_connections_table']}` SET
        status = 'reauth_required', updated_at = '{$now}'
        WHERE mb_id = '" . seosys300_esc($mb_id) . "'");
    seosys300_log_activity(0, 'GOOGLE_REAUTH_REQUIRED', 'Google 연결을 다시 인증해주세요.', array(
        'mb_id' => $mb_id,
        'entity_type' => 'google_connection',
    ));
}

function seosys300_google_access_token($mb_id)
{
    $row = seosys300_google_connection_row($mb_id);
    if (!$row || (string) $row['status'] === 'disconnected') {
        return '';
    }
    $exp = strtotime((string) $row['token_expires_at']);
    if ($exp && $exp < time() + 30) {
        $row = seosys300_google_refresh($mb_id);
        if (!$row) {
            return '';
        }
    }
    if ((string) $row['status'] === 'reauth_required') {
        return '';
    }
    return seosys300_decrypt_secret($row['access_token_encrypted']);
}

function seosys300_google_auth_header($mb_id)
{
    $token = seosys300_google_access_token($mb_id);
    if ($token === '') {
        return null;
    }
    return array('Authorization' => 'Bearer ' . $token, 'Accept' => 'application/json');
}

function seosys300_google_disconnect($mb_id)
{
    global $g5;
    $row = seosys300_google_connection_row($mb_id);
    if ($row) {
        $access = seosys300_decrypt_secret($row['access_token_encrypted']);
        if ($access !== '') {
            seosys300_http_request('POST', 'https://oauth2.googleapis.com/revoke', array(
                'headers' => array('Content-Type' => 'application/x-www-form-urlencoded'),
                'body' => array('token' => $access),
            ));
        }
        $now = seosys300_now();
        seosys300_query("UPDATE `{$g5['seosys300_google_connections_table']}` SET
            access_token_encrypted = '',
            refresh_token_encrypted = '',
            google_email = '',
            google_account_id = '',
            status = 'disconnected',
            updated_at = '{$now}'
            WHERE mb_id = '" . seosys300_esc($mb_id) . "'");
    }
    seosys300_query("UPDATE `{$g5['seosys300_project_integrations_table']}` SET
        status = 'inactive',
        updated_at = '" . seosys300_now() . "'
        WHERE mb_id = '" . seosys300_esc($mb_id) . "'");
}

function seosys300_integration_get($project_id, $provider)
{
    global $g5;
    $provider = strtoupper((string) $provider);
    return seosys300_fetch("SELECT * FROM `{$g5['seosys300_project_integrations_table']}`
        WHERE project_id = " . (int) $project_id . " AND provider = '" . seosys300_esc($provider) . "' LIMIT 1");
}

function seosys300_integration_upsert($project_id, $mb_id, $provider, $connection_id, $extId, $extName, $extUrl)
{
    global $g5;
    if (!seosys300_provider_allowed($provider)) {
        seosys300_json_error(422, 'validation_error', '허용되지 않은 연동입니다.');
    }
    $provider = strtoupper($provider);
    $now = seosys300_now();
    $existing = seosys300_integration_get($project_id, $provider);
    $table = $g5['seosys300_project_integrations_table'];
    if ($existing) {
        seosys300_query("UPDATE `{$table}` SET
            connection_id = " . (int) $connection_id . ",
            external_property_id = '" . seosys300_esc($extId) . "',
            external_property_name = '" . seosys300_esc($extName) . "',
            external_property_url = '" . seosys300_esc($extUrl) . "',
            status = 'active',
            last_error_code = '',
            last_error_message = '',
            updated_at = '{$now}'
            WHERE id = " . (int) $existing['id']);
        return seosys300_integration_get($project_id, $provider);
    }
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        provider = '" . seosys300_esc($provider) . "',
        connection_id = " . (int) $connection_id . ",
        external_property_id = '" . seosys300_esc($extId) . "',
        external_property_name = '" . seosys300_esc($extName) . "',
        external_property_url = '" . seosys300_esc($extUrl) . "',
        status = 'active',
        created_at = '{$now}',
        updated_at = '{$now}'");
    return seosys300_integration_get($project_id, $provider);
}

function seosys300_integration_public($row)
{
    if (!$row) {
        return null;
    }
    return array(
        'provider' => (string) $row['provider'],
        'status' => (string) $row['status'],
        'externalPropertyId' => (string) $row['external_property_id'],
        'externalPropertyName' => (string) $row['external_property_name'],
        'externalPropertyUrl' => (string) $row['external_property_url'],
        'lastSyncAt' => (string) $row['last_sync_at'],
        'lastSuccessAt' => (string) $row['last_success_at'],
        'lastErrorCode' => (string) $row['last_error_code'],
    );
}
