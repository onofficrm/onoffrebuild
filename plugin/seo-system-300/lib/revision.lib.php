<?php
/**
 * Website revision tickets: student requests, free/quote workflow, attachments.
 * Tables are created on first use.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_revision_env($name, $default = '')
{
    if (function_exists('seosys300_env')) {
        return seosys300_env($name, $default);
    }
    $raw = getenv($name);
    return ($raw === false || $raw === '') ? $default : (string) $raw;
}

function seosys300_revision_free_per_month()
{
    $n = (int) seosys300_revision_env('SEOSYS300_REVISION_FREE_PER_MONTH', '10');
    return $n > 0 ? $n : 3;
}

function seosys300_revision_quote_days()
{
    $n = (int) seosys300_revision_env('SEOSYS300_REVISION_QUOTE_DAYS', '7');
    return $n > 0 ? $n : 7;
}

function seosys300_revision_point_use_enabled()
{
    $raw = strtolower(trim(seosys300_revision_env('ONOFF_PLATFORM_POINT_USE_ENABLED', 'true')));
    return !in_array($raw, array('off', '0', 'false', 'no'), true);
}

function seosys300_revision_auth_bootstrap()
{
    $bootstrap = dirname(__FILE__) . '/../../../lib/branded-auth/bootstrap.php';
    if (!is_file($bootstrap)) {
        return false;
    }
    require_once $bootstrap;
    return class_exists('\\OnoffMarketing\\BrandedAuth\\BrandedAuthConfig');
}

function seosys300_revision_payment_configured()
{
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    if (!seosys300_revision_point_use_enabled()) {
        $cached = false;
        return false;
    }
    try {
        if (!seosys300_revision_auth_bootstrap()) {
            $cached = false;
            return false;
        }
        $cached = \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isConfigured()
            && \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isEnabled()
            && \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isPlatformAuthEnabled();
    } catch (Exception $e) {
        $cached = false;
    }
    return $cached;
}

function seosys300_revision_quote_enabled()
{
    // Free-only pilot: paid quotes stay off unless explicitly enabled.
    $raw = strtolower(trim(seosys300_revision_env('SEOSYS300_REVISION_QUOTE_ENABLED', 'false')));
    if (!in_array($raw, array('on', '1', 'true', 'yes'), true)) {
        return false;
    }
    return seosys300_revision_payment_configured();
}

function seosys300_revision_wallet_snapshot()
{
    static $cached = null;
    if ($cached !== null) {
        return $cached;
    }
    $empty = array(
        'ok' => false,
        'ready' => false,
        'balance' => 0,
        'message' => '포인트 잔액을 확인하지 못했습니다.',
    );
    if (!seosys300_revision_quote_enabled()) {
        $empty['message'] = '현재는 무료 수정만 운영합니다.';
        $cached = $empty;
        return $cached;
    }
    $cookies = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
    if ($cookies === '') {
        $empty['message'] = '로그인 세션이 없어 잔액을 확인하지 못했습니다.';
        $cached = $empty;
        return $cached;
    }
    try {
        if (!seosys300_revision_auth_bootstrap()) {
            $cached = $empty;
            return $cached;
        }
        $points = \OnoffMarketing\BrandedAuth\PlatformAuthService::getPoints($cookies, 1);
        if (class_exists('\\OnoffMarketing\\BrandedAuth\\CookieJar') && !empty($points['setCookies'])) {
            \OnoffMarketing\BrandedAuth\CookieJar::forwardToBrowser($points['setCookies']);
        }
        $cached = array(
            'ok' => true,
            'ready' => true,
            'balance' => (int) $points['balance'],
            'message' => '',
        );
    } catch (Exception $e) {
        $empty['message'] = '포인트 잔액을 확인하지 못했습니다. 다시 로그인한 뒤 결제해주세요.';
        $cached = $empty;
    }
    return $cached;
}

function seosys300_revision_assert_free_quota($row)
{
    if (is_array($row) && (int) (isset($row['free_used']) ? $row['free_used'] : 0) === 1) {
        return;
    }
    $mb_id = is_array($row) && isset($row['mb_id']) ? $row['mb_id'] : '';
    $quota = seosys300_revision_free_quota($mb_id);
    if ($quota['remaining'] < 1) {
        seosys300_json_error(
            409,
            'quota_exceeded',
            '이번 달 무료 수정 한도(' . (int) $quota['limit'] . '회)를 모두 사용했습니다.'
        );
    }
}

function seosys300_revision_tickets_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_tickets';
}

function seosys300_revision_events_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_events';
}

function seosys300_revision_comments_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_comments';
}

function seosys300_revision_files_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_revision_files';
}

function seosys300_revision_ensure_column($table, $column, $definition)
{
    $safeColumn = seosys300_esc($column);
    $row = seosys300_fetch("SHOW COLUMNS FROM `{$table}` LIKE '{$safeColumn}'");
    if ($row) {
        return;
    }
    seosys300_query("ALTER TABLE `{$table}` ADD {$definition}");
}

function seosys300_revision_clamp_percent($value)
{
    $n = (float) $value;
    if ($n < 0) {
        return 0.0;
    }
    if ($n > 100) {
        return 100.0;
    }
    return round($n, 1);
}

function seosys300_revision_normalize_box($box)
{
    if (!is_array($box)) {
        return null;
    }
    $x = seosys300_revision_clamp_percent(isset($box['x']) ? $box['x'] : 0);
    $y = seosys300_revision_clamp_percent(isset($box['y']) ? $box['y'] : 0);
    $w = seosys300_revision_clamp_percent(isset($box['w']) ? $box['w'] : 0);
    $h = seosys300_revision_clamp_percent(isset($box['h']) ? $box['h'] : 0);
    if ($w < 0.5 || $h < 0.5) {
        return null;
    }
    if ($x + $w > 100) {
        $w = seosys300_revision_clamp_percent(100 - $x);
    }
    if ($y + $h > 100) {
        $h = seosys300_revision_clamp_percent(100 - $y);
    }
    return array('x' => $x, 'y' => $y, 'w' => $w, 'h' => $h);
}

function seosys300_revision_normalize_annotation($raw)
{
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        $raw = is_array($decoded) ? $decoded : array();
    }
    if (!is_array($raw)) {
        return null;
    }
    $tool = isset($raw['tool']) ? preg_replace('/[^a-z]/', '', strtolower((string) $raw['tool'])) : '';
    if (!in_array($tool, array('block', 'box', 'pen'), true)) {
        return null;
    }
    $label = trim(isset($raw['label']) ? (string) $raw['label'] : '');
    $label = preg_replace('/[\x00-\x1F\x7F]/u', '', $label);
    if (!is_string($label) || $label === '') {
        $label = '선택한 부분';
    }
    if (function_exists('mb_substr')) {
        $label = mb_substr($label, 0, 80);
    } else {
        $label = substr($label, 0, 80);
    }
    $device = isset($raw['device']) ? preg_replace('/[^a-z]/', '', strtolower((string) $raw['device'])) : 'pc';
    if (!in_array($device, array('pc', 'mobile', 'both'), true)) {
        $device = 'pc';
    }
    $pageUrl = trim(isset($raw['pageUrl']) ? (string) $raw['pageUrl'] : '');
    if (strlen($pageUrl) > 500) {
        $pageUrl = substr($pageUrl, 0, 500);
    }
    $out = array(
        'tool' => $tool,
        'label' => $label,
        'device' => $device,
        'pageUrl' => $pageUrl,
    );
    $box = seosys300_revision_normalize_box(isset($raw['box']) ? $raw['box'] : null);
    if ($box) {
        $out['box'] = $box;
    }
    $snapId = isset($raw['snapshotFileId']) ? (int) $raw['snapshotFileId'] : 0;
    if ($snapId > 0) {
        $out['snapshotFileId'] = $snapId;
    }
    return $out;
}

function seosys300_revision_annotation_with_snapshot($annotation)
{
    if (!is_array($annotation)) {
        return null;
    }
    $fid = isset($annotation['snapshotFileId']) ? (int) $annotation['snapshotFileId'] : 0;
    if ($fid > 0) {
        $file = seosys300_revision_get_file_row($fid);
        if ($file) {
            $api = seosys300_revision_file_to_api($file);
            $annotation['snapshotUrl'] = (string) $api['downloadUrl'];
        }
    }
    return $annotation;
}

function seosys300_revision_clip_text($value, $max)
{
    $text = trim((string) $value);
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text);
    if (!is_string($text)) {
        return '';
    }
    $max = (int) $max;
    if ($max < 1) {
        return $text;
    }
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $max);
    }
    return substr($text, 0, $max);
}

function seosys300_revision_new_info_id()
{
    return 'ir_' . date('YmdHis') . '_' . substr(bin2hex(random_bytes(3)), 0, 6);
}

function seosys300_revision_normalize_info_item($raw, $createId = true)
{
    if (!is_array($raw)) {
        return null;
    }
    $id = preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) (isset($raw['id']) ? $raw['id'] : ''));
    if ($id === '' && !$createId) {
        return null;
    }
    if ($id === '') {
        $id = seosys300_revision_new_info_id();
    }
    $label = seosys300_revision_clip_text(isset($raw['label']) ? $raw['label'] : '', 80);
    if ($label === '') {
        $label = '추가 자료';
    }
    $hint = seosys300_revision_clip_text(isset($raw['hint']) ? $raw['hint'] : '', 400);
    $required = !isset($raw['required']) || $raw['required'] === true || $raw['required'] === 1 || $raw['required'] === '1';
    $status = isset($raw['status']) ? preg_replace('/[^a-z_]/', '', strtolower((string) $raw['status'])) : 'requested';
    if (!in_array($status, array('requested', 'answered'), true)) {
        $status = 'requested';
    }
    $fileIds = array();
    $rawFiles = isset($raw['fileIds']) ? $raw['fileIds'] : (isset($raw['file_ids']) ? $raw['file_ids'] : array());
    if (is_array($rawFiles)) {
        foreach ($rawFiles as $fid) {
            $n = (int) $fid;
            if ($n > 0 && !in_array($n, $fileIds, true)) {
                $fileIds[] = $n;
            }
        }
    }
    return array(
        'id' => $id,
        'label' => $label,
        'hint' => $hint,
        'required' => $required,
        'status' => $status,
        'answerText' => seosys300_revision_clip_text(isset($raw['answerText']) ? $raw['answerText'] : (isset($raw['answer_text']) ? $raw['answer_text'] : ''), 2000),
        'fileIds' => $fileIds,
        'createdAt' => seosys300_revision_clip_text(isset($raw['createdAt']) ? $raw['createdAt'] : (isset($raw['created_at']) ? $raw['created_at'] : seosys300_now()), 32),
        'answeredAt' => isset($raw['answeredAt']) && $raw['answeredAt'] ? seosys300_revision_clip_text($raw['answeredAt'], 32) : (isset($raw['answered_at']) && $raw['answered_at'] ? seosys300_revision_clip_text($raw['answered_at'], 32) : null),
    );
}

function seosys300_revision_normalize_work($raw)
{
    if (is_string($raw) && trim($raw) !== '') {
        $decoded = json_decode($raw, true);
        $raw = is_array($decoded) ? $decoded : array();
    }
    if (!is_array($raw)) {
        $raw = array();
    }
    $scope = isset($raw['scope']) ? preg_replace('/[^a-z_]/', '', strtolower((string) $raw['scope'])) : 'page';
    if (!in_array($scope, array('page', 'site'), true)) {
        $scope = 'page';
    }
    $items = array();
    $seen = array();
    $rawItems = isset($raw['infoRequests']) ? $raw['infoRequests'] : (isset($raw['info_requests']) ? $raw['info_requests'] : array());
    if (is_array($rawItems)) {
        foreach ($rawItems as $item) {
            $norm = seosys300_revision_normalize_info_item($item, false);
            if (!$norm || isset($seen[$norm['id']])) {
                continue;
            }
            $seen[$norm['id']] = true;
            $items[] = $norm;
        }
    }
    $last = isset($raw['lastResult']) && is_array($raw['lastResult']) ? $raw['lastResult'] : (isset($raw['last_result']) && is_array($raw['last_result']) ? $raw['last_result'] : array());
    $pkg = isset($raw['agentPackage']) && is_array($raw['agentPackage'])
        ? $raw['agentPackage']
        : (isset($raw['agent_package']) && is_array($raw['agent_package']) ? $raw['agent_package'] : array());
    $dispatch = isset($raw['agentDispatch']) && is_array($raw['agentDispatch'])
        ? $raw['agentDispatch']
        : (isset($raw['agent_dispatch']) && is_array($raw['agent_dispatch']) ? $raw['agent_dispatch'] : array());
    $dispatchStatus = isset($dispatch['status']) ? preg_replace('/[^a-z_]/', '', strtolower((string) $dispatch['status'])) : '';
    if (!in_array($dispatchStatus, array('', 'queued', 'running', 'completed', 'failed'), true)) {
        $dispatchStatus = '';
    }
    return array(
        'assignee' => seosys300_revision_clip_text(isset($raw['assignee']) ? $raw['assignee'] : '', 80),
        'constraints' => seosys300_revision_clip_text(isset($raw['constraints']) ? $raw['constraints'] : '', 2000),
        'scope' => $scope,
        'readyForAgent' => !empty($raw['readyForAgent']) || !empty($raw['ready_for_agent']),
        'cwd' => seosys300_revision_clip_text(isset($raw['cwd']) ? $raw['cwd'] : (isset($raw['siteCwd']) ? $raw['siteCwd'] : ''), 500),
        'infoRequests' => $items,
        'lastResult' => array(
            'url' => seosys300_revision_clip_text(isset($last['url']) ? $last['url'] : '', 500),
            'note' => seosys300_revision_clip_text(isset($last['note']) ? $last['note'] : '', 2000),
            'snapshotFileId' => isset($last['snapshotFileId']) ? (int) $last['snapshotFileId'] : (isset($last['snapshot_file_id']) ? (int) $last['snapshot_file_id'] : 0),
            'at' => seosys300_revision_clip_text(isset($last['at']) ? $last['at'] : '', 32),
            'cwd' => seosys300_revision_clip_text(isset($last['cwd']) ? $last['cwd'] : '', 500),
            'changedFiles' => seosys300_revision_normalize_changed_files(
                isset($last['changedFiles']) ? $last['changedFiles'] : (isset($last['changed_files']) ? $last['changed_files'] : array())
            ),
            'diffStat' => seosys300_revision_clip_text(isset($last['diffStat']) ? $last['diffStat'] : (isset($last['diff_stat']) ? $last['diff_stat'] : ''), 2000),
        ),
        'reopenCount' => isset($raw['reopenCount']) ? max(0, (int) $raw['reopenCount']) : (isset($raw['reopen_count']) ? max(0, (int) $raw['reopen_count']) : 0),
        'reopenNote' => seosys300_revision_clip_text(isset($raw['reopenNote']) ? $raw['reopenNote'] : (isset($raw['reopen_note']) ? $raw['reopen_note'] : ''), 500),
        'agentPackage' => array(
            'writtenAt' => seosys300_revision_clip_text(isset($pkg['writtenAt']) ? $pkg['writtenAt'] : (isset($pkg['written_at']) ? $pkg['written_at'] : ''), 32),
            'json' => seosys300_revision_clip_text(isset($pkg['json']) ? $pkg['json'] : '', 80),
            'md' => seosys300_revision_clip_text(isset($pkg['md']) ? $pkg['md'] : '', 80),
            'version' => isset($pkg['version']) ? (int) $pkg['version'] : 1,
        ),
        'agentDispatch' => array(
            'status' => $dispatchStatus,
            'queuedAt' => seosys300_revision_clip_text(isset($dispatch['queuedAt']) ? $dispatch['queuedAt'] : (isset($dispatch['queued_at']) ? $dispatch['queued_at'] : ''), 32),
            'requestedBy' => seosys300_revision_clip_text(isset($dispatch['requestedBy']) ? $dispatch['requestedBy'] : '', 40),
            'agentRunId' => seosys300_revision_clip_text(isset($dispatch['agentRunId']) ? $dispatch['agentRunId'] : '', 120),
            'webhookOk' => !empty($dispatch['webhookOk']),
            'webhookStatus' => isset($dispatch['webhookStatus']) ? (int) $dispatch['webhookStatus'] : 0,
            'resultAt' => seosys300_revision_clip_text(isset($dispatch['resultAt']) ? $dispatch['resultAt'] : '', 32),
            'error' => seosys300_revision_clip_text(isset($dispatch['error']) ? $dispatch['error'] : '', 500),
        ),
        'deploy' => seosys300_revision_normalize_deploy(
            isset($raw['deploy']) ? $raw['deploy'] : array()
        ),
        'slaAlert' => seosys300_revision_normalize_sla_alert(
            isset($raw['slaAlert']) ? $raw['slaAlert'] : (isset($raw['sla_alert']) ? $raw['sla_alert'] : array())
        ),
    );
}

/**
 * @param mixed $raw
 * @return array{status:string,queuedAt:string,requestedBy:string,resultAt:string,error:string,command:string}
 */
function seosys300_revision_normalize_deploy($raw)
{
    if (!is_array($raw)) {
        $raw = array();
    }
    $status = isset($raw['status']) ? preg_replace('/[^a-z_]/', '', strtolower((string) $raw['status'])) : '';
    if (!in_array($status, array('', 'queued', 'running', 'completed', 'failed', 'preview'), true)) {
        $status = '';
    }
    $ftpLocal = null;
    if (array_key_exists('ftpConfiguredLocal', $raw)) {
        if ($raw['ftpConfiguredLocal'] === null || $raw['ftpConfiguredLocal'] === '') {
            $ftpLocal = null;
        } else {
            $ftpLocal = !empty($raw['ftpConfiguredLocal']);
        }
    }
    return array(
        'status' => $status,
        'queuedAt' => seosys300_revision_clip_text(isset($raw['queuedAt']) ? $raw['queuedAt'] : (isset($raw['queued_at']) ? $raw['queued_at'] : ''), 32),
        'requestedBy' => seosys300_revision_clip_text(isset($raw['requestedBy']) ? $raw['requestedBy'] : '', 40),
        'resultAt' => seosys300_revision_clip_text(isset($raw['resultAt']) ? $raw['resultAt'] : '', 32),
        'error' => seosys300_revision_clip_text(isset($raw['error']) ? $raw['error'] : '', 500),
        'note' => seosys300_revision_clip_text(isset($raw['note']) ? $raw['note'] : '', 500),
        'command' => seosys300_revision_clip_text(isset($raw['command']) ? $raw['command'] : '', 500),
        'ftpConfiguredLocal' => $ftpLocal,
    );
}

/**
 * Operator Mac heartbeat (worker/FTP readiness) stored beside agent packages.
 *
 * @return array{at:string,workerAlive:bool,domains:array<string,array>}
 */
function seosys300_revision_operator_status_get()
{
    $path = seosys300_revision_agent_package_dir() . '/operator-status.json';
    if (!is_file($path)) {
        return array('at' => '', 'workerAlive' => false, 'domains' => array());
    }
    $raw = json_decode((string) @file_get_contents($path), true);
    if (!is_array($raw)) {
        return array('at' => '', 'workerAlive' => false, 'domains' => array());
    }
    $domains = array();
    if (isset($raw['domains']) && is_array($raw['domains'])) {
        foreach ($raw['domains'] as $host => $info) {
            $host = strtolower(trim((string) $host));
            if ($host === '' || !is_array($info)) {
                continue;
            }
            $domains[$host] = array(
                'ftpConfigured' => !empty($info['ftpConfigured']),
                'cwd' => seosys300_revision_clip_text(isset($info['cwd']) ? $info['cwd'] : '', 500),
                'at' => seosys300_revision_clip_text(isset($info['at']) ? $info['at'] : '', 32),
            );
        }
    }
    return array(
        'at' => seosys300_revision_clip_text(isset($raw['at']) ? $raw['at'] : '', 32),
        'workerAlive' => !empty($raw['workerAlive']),
        'domains' => $domains,
    );
}

/**
 * @param array $input
 * @return array
 */
function seosys300_revision_operator_status_save($input)
{
    $dir = seosys300_revision_agent_package_dir();
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $prev = seosys300_revision_operator_status_get();
    $domains = isset($prev['domains']) && is_array($prev['domains']) ? $prev['domains'] : array();
    $domain = isset($input['domain']) ? strtolower(trim((string) $input['domain'])) : '';
    $domain = preg_replace('#^https?://#', '', $domain);
    $domain = preg_replace('#/.*$#', '', $domain);
    if ($domain !== '') {
        $domains[$domain] = array(
            'ftpConfigured' => !empty($input['ftpConfigured']),
            'cwd' => seosys300_revision_clip_text(isset($input['cwd']) ? $input['cwd'] : '', 500),
            'at' => seosys300_now(),
        );
    }
    if (isset($input['domains']) && is_array($input['domains'])) {
        foreach ($input['domains'] as $host => $info) {
            $host = strtolower(trim((string) $host));
            if ($host === '' || !is_array($info)) {
                continue;
            }
            $domains[$host] = array(
                'ftpConfigured' => !empty($info['ftpConfigured']),
                'cwd' => seosys300_revision_clip_text(isset($info['cwd']) ? $info['cwd'] : '', 500),
                'at' => seosys300_now(),
            );
        }
    }
    $out = array(
        'at' => seosys300_now(),
        'workerAlive' => array_key_exists('workerAlive', $input) ? !empty($input['workerAlive']) : !empty($prev['workerAlive']),
        'domains' => $domains,
    );
    @file_put_contents(
        $dir . '/operator-status.json',
        json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n",
        LOCK_EX
    );
    return $out;
}

/**
 * @param mixed $raw
 * @return array{code:string,at:string,label:string}
 */
function seosys300_revision_normalize_sla_alert($raw)
{
    if (!is_array($raw)) {
        $raw = array();
    }
    return array(
        'code' => seosys300_revision_clip_text(isset($raw['code']) ? $raw['code'] : '', 40),
        'at' => seosys300_revision_clip_text(isset($raw['at']) ? $raw['at'] : '', 32),
        'label' => seosys300_revision_clip_text(isset($raw['label']) ? $raw['label'] : '', 120),
    );
}

function seosys300_revision_work_from_row($row)
{
    return seosys300_revision_normalize_work(isset($row['work_json']) ? $row['work_json'] : '');
}

function seosys300_revision_save_work($ticket_id, $work)
{
    $norm = seosys300_revision_normalize_work($work);
    $json = json_encode($norm, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return $norm;
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET work_json = '" . seosys300_esc($json) . "', updated_at = '{$now}'
         WHERE id = " . (int) $ticket_id
    );
    return $norm;
}

function seosys300_revision_info_pending_required($work)
{
    if (!is_array($work) || empty($work['infoRequests']) || !is_array($work['infoRequests'])) {
        return false;
    }
    foreach ($work['infoRequests'] as $item) {
        if (!empty($item['required']) && (isset($item['status']) ? $item['status'] : '') !== 'answered') {
            return true;
        }
    }
    return false;
}

function seosys300_revision_info_counts($work)
{
    $pending = 0;
    $answered = 0;
    $items = (is_array($work) && !empty($work['infoRequests']) && is_array($work['infoRequests'])) ? $work['infoRequests'] : array();
    foreach ($items as $item) {
        if ((isset($item['status']) ? $item['status'] : '') === 'answered') {
            $answered++;
        } else {
            $pending++;
        }
    }
    return array('pending' => $pending, 'answered' => $answered, 'total' => count($items));
}

function seosys300_revision_triage_state($row, $work)
{
    $status = is_array($row) ? (string) $row['status'] : '';
    if (in_array($status, array('completed', 'cancelled', 'expired'), true)) {
        return 'done';
    }
    if ($status === 'feedback') {
        return 'confirm';
    }
    if (in_array($status, array('in_progress', 'free_progress', 'paid'), true)) {
        return 'in_progress';
    }
    if ($status === 'need_info') {
        return seosys300_revision_info_pending_required($work) ? 'waiting_info' : 'info_returned';
    }
    if (!empty($work['readyForAgent'])) {
        return 'ready';
    }
    if ($status === 'quote_pending') {
        return 'ready';
    }
    return 'needs_triage';
}

function seosys300_revision_triage_state_label($state)
{
    // Staff queue names only: 오늘 할 일 / 자료 / 확인 / 작업 중
    $map = array(
        'needs_triage' => '오늘 할 일',
        'waiting_info' => '자료',
        'info_returned' => '오늘 할 일',
        'ready' => '오늘 할 일',
        'confirm' => '확인',
        'in_progress' => '작업 중',
        'done' => '완료',
    );
    return isset($map[$state]) ? $map[$state] : $state;
}

function seosys300_revision_find_info_item(&$work, $id)
{
    $id = (string) $id;
    if (!is_array($work) || empty($work['infoRequests']) || !is_array($work['infoRequests'])) {
        return null;
    }
    foreach ($work['infoRequests'] as $idx => $item) {
        if ((string) $item['id'] === $id) {
            return $idx;
        }
    }
    return null;
}

function seosys300_revision_attach_info_file($ticket_id, $info_request_id, $file_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return null;
    }
    $work = seosys300_revision_work_from_row($row);
    $idx = seosys300_revision_find_info_item($work, $info_request_id);
    if ($idx === null) {
        return $work;
    }
    $fid = (int) $file_id;
    if ($fid > 0 && !in_array($fid, $work['infoRequests'][$idx]['fileIds'], true)) {
        $work['infoRequests'][$idx]['fileIds'][] = $fid;
        seosys300_revision_save_work($ticket_id, $work);
    }
    return $work;
}

function seosys300_revision_apply_work_input($ticket_id, $row, $input)
{
    $work = seosys300_revision_work_from_row($row);
    $pkg = isset($input['workPackage']) && is_array($input['workPackage']) ? $input['workPackage'] : $input;
    $changed = false;
    if (array_key_exists('assignee', $pkg)) {
        $work['assignee'] = seosys300_revision_clip_text($pkg['assignee'], 80);
        $changed = true;
    }
    if (array_key_exists('constraints', $pkg)) {
        $work['constraints'] = seosys300_revision_clip_text($pkg['constraints'], 2000);
        $changed = true;
    }
    if (array_key_exists('scope', $pkg)) {
        $scope = preg_replace('/[^a-z_]/', '', strtolower((string) $pkg['scope']));
        $work['scope'] = in_array($scope, array('page', 'site'), true) ? $scope : 'page';
        $changed = true;
    }
    if (array_key_exists('readyForAgent', $pkg) || array_key_exists('ready_for_agent', $pkg)) {
        $flag = array_key_exists('readyForAgent', $pkg) ? $pkg['readyForAgent'] : $pkg['ready_for_agent'];
        $work['readyForAgent'] = ($flag === true || $flag === 1 || $flag === '1' || $flag === 'true');
        $changed = true;
    }
    if (array_key_exists('cwd', $pkg) || array_key_exists('siteCwd', $pkg)) {
        $cwd = array_key_exists('cwd', $pkg) ? $pkg['cwd'] : $pkg['siteCwd'];
        $work['cwd'] = seosys300_revision_clip_text($cwd, 500);
        $changed = true;
    }
    if ($changed) {
        $work = seosys300_revision_save_work($ticket_id, $work);
    }
    return $work;
}

function seosys300_revision_append_info_requests($ticket_id, $row, $incoming, $note = '')
{
    $work = seosys300_revision_work_from_row($row);
    $added = 0;
    if (is_array($incoming)) {
        foreach ($incoming as $item) {
            $norm = seosys300_revision_normalize_info_item($item, true);
            if (!$norm) {
                continue;
            }
            $norm['status'] = 'requested';
            $norm['answerText'] = '';
            $norm['fileIds'] = array();
            $norm['answeredAt'] = null;
            $norm['createdAt'] = seosys300_now();
            $work['infoRequests'][] = $norm;
            $added++;
        }
    }
    if ($added === 0 && trim((string) $note) !== '') {
        $lines = preg_split('/\r\n|\r|\n/', trim((string) $note));
        $label = seosys300_revision_clip_text(isset($lines[0]) ? $lines[0] : $note, 80);
        $hint = count($lines) > 1 ? seosys300_revision_clip_text(implode("\n", array_slice($lines, 1)), 400) : '';
        $work['infoRequests'][] = seosys300_revision_normalize_info_item(array(
            'id' => seosys300_revision_new_info_id(),
            'label' => $label !== '' ? $label : '추가 자료',
            'hint' => $hint,
            'required' => true,
            'status' => 'requested',
        ), false);
        $added++;
    }
    $work['readyForAgent'] = false;
    return seosys300_revision_save_work($ticket_id, $work);
}

function seosys300_revision_student_reply_info($ticket_id, $mb_id, $input)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if (in_array($row['status'], array('completed', 'cancelled'), true)) {
        seosys300_json_error(409, 'ticket_closed', '완료·취소된 요청에는 자료를 올릴 수 없습니다.');
    }
    $replies = isset($input['items']) && is_array($input['items'])
        ? $input['items']
        : (isset($input['infoReplies']) && is_array($input['infoReplies']) ? $input['infoReplies'] : array());
    if (isset($input['infoRequestId']) || isset($input['id'])) {
        $replies[] = $input;
    }
    $work = seosys300_revision_work_from_row($row);
    $now = seosys300_now();
    $answered = 0;
    $notes = array();
    foreach ($replies as $reply) {
        if (!is_array($reply)) {
            continue;
        }
        $id = isset($reply['id']) ? (string) $reply['id'] : (isset($reply['infoRequestId']) ? (string) $reply['infoRequestId'] : '');
        $idx = seosys300_revision_find_info_item($work, $id);
        if ($idx === null) {
            continue;
        }
        $text = seosys300_revision_clip_text(isset($reply['answerText']) ? $reply['answerText'] : (isset($reply['body']) ? $reply['body'] : ''), 2000);
        if ($text !== '') {
            $work['infoRequests'][$idx]['answerText'] = $text;
        }
        $hasFiles = !empty($work['infoRequests'][$idx]['fileIds']);
        if ($text === '' && !$hasFiles) {
            continue;
        }
        $work['infoRequests'][$idx]['status'] = 'answered';
        $work['infoRequests'][$idx]['answeredAt'] = $now;
        $answered++;
        $notes[] = $work['infoRequests'][$idx]['label'] . ($text !== '' ? ': ' . $text : ' (파일 첨부)');
    }
    if ($answered < 1) {
        seosys300_json_error(422, 'validation_error', '요청한 자료 칸에 답이나 파일을 넣어주세요.');
    }
    seosys300_revision_save_work($ticket_id, $work);
    seosys300_revision_add_comment($ticket_id, $mb_id, 'student', "[자료 회신]\n" . implode("\n", $notes));
    $table = seosys300_revision_tickets_table();
    $escNow = seosys300_esc($now);
    $flipped = false;
    if (!seosys300_revision_info_pending_required($work) && (string) $row['status'] === 'need_info') {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'reviewing', updated_at = '{$escNow}' WHERE id = " . (int) $ticket_id
        );
        $flipped = true;
    } else {
        seosys300_query(
            "UPDATE `{$table}` SET updated_at = '{$escNow}' WHERE id = " . (int) $ticket_id
        );
    }
    $fresh = seosys300_revision_get_row($ticket_id);
    if ($flipped) {
        seosys300_revision_crm_event('revision.info_returned', $fresh);
    }
    return seosys300_revision_ticket_to_api($fresh, true);
}

function seosys300_revision_site_context($ticket)
{
    global $g5;
    $orderId = isset($ticket['orderId']) ? (int) $ticket['orderId'] : 0;
    $projectId = isset($ticket['projectId']) ? (int) $ticket['projectId'] : 0;
    $siteName = '';
    $orderDomain = '';
    $siteUrl = '';
    $cwd = '';

    $work = (isset($ticket['workPackage']) && is_array($ticket['workPackage'])) ? $ticket['workPackage'] : array();
    if (!empty($work['cwd'])) {
        $cwd = seosys300_revision_clip_text($work['cwd'], 500);
    }

    $order = null;
    if ($orderId > 0 && !empty($g5['seosys300_website_orders_table'])) {
        $order = seosys300_fetch(
            "SELECT id, site_name, email, current_url, extra_json, project_id
             FROM `{$g5['seosys300_website_orders_table']}`
             WHERE id = {$orderId} LIMIT 1"
        );
        if ($order) {
            $siteName = trim((string) ($order['site_name'] ?? ''));
            if ($projectId < 1 && !empty($order['project_id'])) {
                $projectId = (int) $order['project_id'];
            }
            $extra = array();
            if (!empty($order['extra_json'])) {
                $decoded = json_decode((string) $order['extra_json'], true);
                if (is_array($decoded)) {
                    $extra = $decoded;
                }
            }
            if (function_exists('seosys300_order_preview_url')) {
                $siteUrl = trim((string) seosys300_order_preview_url($order, $extra));
            }
            if ($siteUrl === '' && !empty($extra['previewUrl'])) {
                $siteUrl = trim((string) $extra['previewUrl']);
            }
            if ($siteUrl === '' && !empty($order['current_url'])) {
                $siteUrl = trim((string) $order['current_url']);
            }
        }
    }

    if ($projectId > 0 && !empty($g5['seosys300_projects_table'])) {
        $project = seosys300_fetch(
            "SELECT id, name, domain FROM `{$g5['seosys300_projects_table']}` WHERE id = {$projectId} LIMIT 1"
        );
        if ($project) {
            if ($siteName === '' && !empty($project['name'])) {
                $siteName = trim((string) $project['name']);
            }
            $orderDomain = strtolower(trim((string) ($project['domain'] ?? '')));
            $orderDomain = preg_replace('#^https?://#i', '', $orderDomain);
            $orderDomain = rtrim((string) $orderDomain, '/');
        }
    }

    if ($siteUrl === '' && $orderDomain !== '') {
        $siteUrl = 'https://' . $orderDomain;
    }

    if ($cwd === '' && $orderDomain !== '') {
        $cwd = seosys300_revision_cwd_from_domain($orderDomain);
    }

    return array(
        'orderId' => $orderId,
        'projectId' => $projectId,
        'siteName' => seosys300_revision_clip_text($siteName, 120),
        'orderDomain' => seosys300_revision_clip_text($orderDomain, 200),
        'siteUrl' => seosys300_revision_clip_text($siteUrl, 500),
        'cwd' => $cwd,
    );
}

/**
 * @return array<string, string>
 */
function seosys300_revision_site_cwd_map()
{
    static $map = null;
    if (is_array($map)) {
        return $map;
    }
    $map = array();
    $raw = trim(seosys300_revision_env('SEOSYS300_REVISION_SITE_CWD_MAP', ''));
    if ($raw !== '') {
        $decoded = json_decode($raw, true);
        if (is_array($decoded)) {
            $map = $decoded;
        }
    }
    if (!$map) {
        $file = dirname(__FILE__) . '/../config/revision-site-cwd.map.json';
        if (is_file($file) && is_readable($file)) {
            $decoded = json_decode((string) @file_get_contents($file), true);
            if (is_array($decoded)) {
                $map = $decoded;
            }
        }
    }
    $clean = array();
    foreach ($map as $host => $path) {
        $host = strtolower(trim((string) $host));
        $host = preg_replace('#^https?://#i', '', $host);
        $host = rtrim((string) $host, '/');
        $path = seosys300_revision_clip_text($path, 500);
        if ($host !== '' && $path !== '') {
            $clean[$host] = $path;
        }
    }
    $map = $clean;
    return $map;
}

function seosys300_revision_cwd_from_domain($domain)
{
    $domain = strtolower(trim((string) $domain));
    $domain = preg_replace('#^https?://#i', '', $domain);
    $domain = rtrim((string) $domain, '/');
    if ($domain === '') {
        return '';
    }
    foreach (seosys300_revision_site_cwd_map() as $host => $path) {
        if ($host === $domain || $host === 'www.' . $domain || 'www.' . $host === $domain) {
            return $path;
        }
    }
    return '';
}

function seosys300_revision_cwd_is_platform($cwd)
{
    $cwd = (string) $cwd;
    if ($cwd === '') {
        return false;
    }
    return (bool) preg_match('#/(?:platform/)?onoff-home(?:/|$)#', $cwd);
}

function seosys300_revision_build_cursor_prompt($ticket)
{
    $ann = (isset($ticket['annotation']) && is_array($ticket['annotation'])) ? $ticket['annotation'] : array();
    $work = (isset($ticket['workPackage']) && is_array($ticket['workPackage'])) ? $ticket['workPackage'] : array();
    $site = seosys300_revision_site_context($ticket);
    $box = (isset($ann['box']) && is_array($ann['box'])) ? $ann['box'] : null;
    $lines = array();
    $lines[] = '홈페이지 수정 작업입니다. 정리된 지시와 제약만 따르고, 표시한 부분 외는 바꾸지 마세요.';
    $lines[] = '';
    $lines[] = '티켓: #' . (isset($ticket['id']) ? $ticket['id'] : '') . ' ' . (isset($ticket['title']) ? $ticket['title'] : '');
    if (!empty($site['siteName'])) {
        $lines[] = '사이트: ' . $site['siteName'];
    }
    if (!empty($site['orderDomain'])) {
        $lines[] = '도메인: ' . $site['orderDomain'];
    }
    if (!empty($site['siteUrl'])) {
        $lines[] = '사이트 URL: ' . $site['siteUrl'];
    }
    if (!empty($site['cwd'])) {
        $lines[] = '작업 디렉터리: ' . $site['cwd'];
    }
    $page = '';
    if (!empty($ann['pageUrl'])) {
        $page = (string) $ann['pageUrl'];
    } elseif (!empty($ticket['pageUrl'])) {
        $page = (string) $ticket['pageUrl'];
    }
    if ($page !== '') {
        $lines[] = '페이지: ' . $page;
    }
    $device = !empty($ann['device']) ? (string) $ann['device'] : (isset($ticket['device']) ? (string) $ticket['device'] : '');
    if ($device !== '') {
        $lines[] = '기기: ' . $device;
    }
    if (!empty($ann['label'])) {
        $lines[] = '표시: ' . $ann['label'];
    }
    if ($box) {
        $lines[] = '영역(%): x=' . $box['x'] . ', y=' . $box['y'] . ', w=' . $box['w'] . ', h=' . $box['h'];
    }
    if (!empty($ann['snapshotUrl'])) {
        $lines[] = '캡처: ' . $ann['snapshotUrl'];
    }
    $scope = isset($work['scope']) ? (string) $work['scope'] : 'page';
    $lines[] = '범위: ' . ($scope === 'site' ? '사이트 전체에서 같은 요소' : '이 페이지만');
    if (!empty($work['assignee'])) {
        $lines[] = '담당: ' . $work['assignee'];
    }
    $lines[] = '';
    $lines[] = '## 고객 원문';
    $lines[] = isset($ticket['description']) && $ticket['description'] !== '' ? (string) $ticket['description'] : '(없음)';
    $lines[] = '';
    $lines[] = '## 정리된 지시 (고객에게 보이지 않음)';
    $brief = isset($ticket['agentBrief']) ? trim((string) $ticket['agentBrief']) : '';
    $lines[] = $brief !== '' ? $brief : '(아직 없음)';
    $lines[] = '';
    $lines[] = '## 제약';
    $constraints = isset($work['constraints']) ? trim((string) $work['constraints']) : '';
    if ($constraints === '') {
        $constraints = $scope === 'site'
            ? '같은 요소만 맞추고 다른 페이지 레이아웃은 건드리지 마세요.'
            : '이 페이지의 표시한 부분만 수정하세요. 버튼·메뉴·다른 섹션은 유지하세요.';
    }
    $lines[] = $constraints;
    $info = (isset($ticket['infoRequests']) && is_array($ticket['infoRequests'])) ? $ticket['infoRequests'] : array();
    $answered = array();
    foreach ($info as $item) {
        if ((isset($item['status']) ? $item['status'] : '') !== 'answered') {
            continue;
        }
        $line = '- ' . $item['label'];
        if (!empty($item['answerText'])) {
            $line .= ': ' . $item['answerText'];
        }
        if (!empty($item['fileIds']) && is_array($item['fileIds'])) {
            $line .= ' (파일 ' . count($item['fileIds']) . '개)';
        }
        $answered[] = $line;
    }
    if ($answered) {
        $lines[] = '';
        $lines[] = '## 고객이 보낸 자료';
        foreach ($answered as $line) {
            $lines[] = $line;
        }
    }
    $result = (isset($ticket['resultPreview']) && is_array($ticket['resultPreview'])) ? $ticket['resultPreview'] : array();
    if (!empty($ticket['feedbackNote']) || !empty($ticket['feedbackUrl']) || !empty($result['url']) || !empty($result['note'])) {
        $lines[] = '';
        $lines[] = '## 이전 결과';
        if (!empty($result['note'])) {
            $lines[] = (string) $result['note'];
        } elseif (!empty($ticket['feedbackNote'])) {
            $lines[] = (string) $ticket['feedbackNote'];
        }
        $resultUrl = !empty($result['url']) ? (string) $result['url'] : (isset($ticket['feedbackUrl']) ? (string) $ticket['feedbackUrl'] : '');
        if ($resultUrl !== '') {
            $lines[] = '확인 URL: ' . $resultUrl;
        }
        if (!empty($result['snapshotUrl'])) {
            $lines[] = '결과 캡처: ' . $result['snapshotUrl'];
        }
    }
    if (!empty($ticket['reopenNote']) || !empty($ticket['reopenCount'])) {
        $lines[] = '';
        $lines[] = '## 재요청';
        $lines[] = !empty($ticket['reopenNote'])
            ? (string) $ticket['reopenNote']
            : '고객이 같은 자리가 아직 안 고쳐졌다고 했습니다. 표시한 부분만 다시 고치세요.';
        if (!empty($ticket['reopenCount'])) {
            $lines[] = '재요청 횟수: ' . (int) $ticket['reopenCount'];
        }
    }
    $lines[] = '';
    $lines[] = '끝나면 다음을 피드백에 남기세요.';
    $lines[] = '1) 확인 가능한 절대 URL';
    $lines[] = '2) 바꾼 파일 경로 목록 (한 줄에 하나)';
    $lines[] = '3) 무엇을 바꿨는지 한두 문장';
    $lines[] = '라이브 배포 전 확인용이라 파일 목록은 빠뜨리지 마세요.';
    return implode("\n", $lines);
}

/**
 * @param mixed $raw
 * @return array<int, string>
 */
function seosys300_revision_normalize_changed_files($raw)
{
    if (!is_array($raw)) {
        if (is_string($raw) && trim($raw) !== '') {
            $raw = preg_split('/[\r\n,]+/', $raw) ?: array();
        } else {
            return array();
        }
    }
    $out = array();
    $seen = array();
    foreach ($raw as $item) {
        $path = seosys300_revision_clip_text(is_string($item) ? $item : '', 240);
        $path = ltrim(str_replace('\\', '/', $path), './');
        if ($path === '' || isset($seen[$path])) {
            continue;
        }
        $seen[$path] = true;
        $out[] = $path;
        if (count($out) >= 40) {
            break;
        }
    }
    return $out;
}

/**
 * Machine-readable Cursor work package (prompt + structured fields).
 * Staff copy the prompt today; agents/scripts can load the JSON later.
 *
 * @param array $ticket
 * @return array<string, mixed>
 */
function seosys300_revision_build_cursor_package($ticket)
{
    $ann = (isset($ticket['annotation']) && is_array($ticket['annotation'])) ? $ticket['annotation'] : array();
    $work = (isset($ticket['workPackage']) && is_array($ticket['workPackage'])) ? $ticket['workPackage'] : array();
    $result = (isset($ticket['resultPreview']) && is_array($ticket['resultPreview'])) ? $ticket['resultPreview'] : array();
    $site = seosys300_revision_site_context($ticket);
    $page = '';
    if (!empty($ann['pageUrl'])) {
        $page = (string) $ann['pageUrl'];
    } elseif (!empty($ticket['pageUrl'])) {
        $page = (string) $ticket['pageUrl'];
    }
    $infoAnswers = array();
    $info = (isset($ticket['infoRequests']) && is_array($ticket['infoRequests'])) ? $ticket['infoRequests'] : array();
    foreach ($info as $item) {
        if (!is_array($item) || (isset($item['status']) ? $item['status'] : '') !== 'answered') {
            continue;
        }
        $infoAnswers[] = array(
            'label' => isset($item['label']) ? (string) $item['label'] : '',
            'answerText' => isset($item['answerText']) ? (string) $item['answerText'] : '',
            'fileIds' => isset($item['fileIds']) && is_array($item['fileIds']) ? array_values($item['fileIds']) : array(),
        );
    }
    return array(
        'version' => 2,
        'kind' => 'onoff.homepage_revision',
        'ticketId' => isset($ticket['id']) ? (int) $ticket['id'] : 0,
        'orderId' => (int) $site['orderId'],
        'projectId' => (int) $site['projectId'],
        'siteName' => (string) $site['siteName'],
        'orderDomain' => (string) $site['orderDomain'],
        'siteUrl' => (string) $site['siteUrl'],
        'cwd' => (string) $site['cwd'],
        'title' => isset($ticket['title']) ? (string) $ticket['title'] : '',
        'status' => isset($ticket['status']) ? (string) $ticket['status'] : '',
        'pageUrl' => $page,
        'device' => !empty($ann['device']) ? (string) $ann['device'] : (isset($ticket['device']) ? (string) $ticket['device'] : ''),
        'annotation' => $ann,
        'agentBrief' => isset($ticket['agentBrief']) ? (string) $ticket['agentBrief'] : '',
        'constraints' => isset($work['constraints']) ? (string) $work['constraints'] : '',
        'scope' => isset($work['scope']) ? (string) $work['scope'] : 'page',
        'assignee' => isset($work['assignee']) ? (string) $work['assignee'] : '',
        'readyForAgent' => !empty($work['readyForAgent']),
        'customerDescription' => isset($ticket['description']) ? (string) $ticket['description'] : '',
        'infoAnswers' => $infoAnswers,
        'previousResult' => array(
            'url' => !empty($result['url']) ? (string) $result['url'] : (isset($ticket['feedbackUrl']) ? (string) $ticket['feedbackUrl'] : ''),
            'note' => !empty($result['note']) ? (string) $result['note'] : (isset($ticket['feedbackNote']) ? (string) $ticket['feedbackNote'] : ''),
            'snapshotUrl' => isset($result['snapshotUrl']) ? (string) $result['snapshotUrl'] : '',
            'snapshotFileId' => isset($result['snapshotFileId']) ? (int) $result['snapshotFileId'] : 0,
        ),
        'reopen' => array(
            'count' => isset($ticket['reopenCount']) ? (int) $ticket['reopenCount'] : 0,
            'note' => isset($ticket['reopenNote']) ? (string) $ticket['reopenNote'] : '',
        ),
        'prompt' => seosys300_revision_build_cursor_prompt($ticket),
        'createdAt' => seosys300_now(),
    );
}

function seosys300_revision_agent_package_dir()
{
    $root = defined('G5_DATA_PATH') ? G5_DATA_PATH : (dirname(__FILE__) . '/../../../data');
    $dir = rtrim((string) $root, '/') . '/revision_agent_packages';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $ht = $dir . '/.htaccess';
    $ht_contents = is_file($ht) ? (string) @file_get_contents($ht) : '';
    if (strpos($ht_contents, 'Require all denied') === false) {
        @file_put_contents($ht, "Options -Indexes\nRequire all denied\nDeny from all\n");
    }
    return $dir;
}

/**
 * Persist Cursor package files for handoff (JSON + markdown prompt).
 *
 * @param array $ticket API ticket shape
 * @return array<string, mixed>|null
 */
function seosys300_revision_persist_agent_package($ticket)
{
    $ticket_id = isset($ticket['id']) ? (int) $ticket['id'] : 0;
    if ($ticket_id < 1) {
        return null;
    }
    $package = seosys300_revision_build_cursor_package($ticket);
    $dir = seosys300_revision_agent_package_dir();
    $base = $dir . '/ticket-' . $ticket_id;
    $json = json_encode($package, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if (!is_string($json)) {
        return null;
    }
    $prompt = isset($package['prompt']) ? (string) $package['prompt'] : '';
    $md = "# ONOFF homepage revision #{$ticket_id}\n\n"
        . "Paste this into Cursor. Do not change unmarked areas.\n\n"
        . "```\n" . $prompt . "\n```\n";
    @file_put_contents($base . '.json', $json . "\n", LOCK_EX);
    @file_put_contents($base . '.md', $md, LOCK_EX);

    $row = seosys300_revision_get_row($ticket_id);
    if ($row) {
        $work = seosys300_revision_work_from_row($row);
        $work['agentPackage'] = array(
            'writtenAt' => seosys300_now(),
            'json' => 'ticket-' . $ticket_id . '.json',
            'md' => 'ticket-' . $ticket_id . '.md',
            'version' => 1,
        );
        seosys300_revision_save_work($ticket_id, $work);
    }
    return $package;
}

/**
 * @return array{path:string,mime:string,name:string}|null
 */
/**
 * Queue a Cursor agent run for a ready package.
 * Optionally POSTs the package JSON to SEOSYS300_CURSOR_AGENT_WEBHOOK_URL.
 *
 * @param array $ticket
 * @param array $input
 * @return array<string, mixed>
 */
function seosys300_revision_dispatch_agent_package($ticket, $input = array())
{
    $ticket_id = isset($ticket['id']) ? (int) $ticket['id'] : 0;
    if ($ticket_id < 1) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if (empty($ticket['workPackage']['readyForAgent']) && empty($ticket['agentBrief'])) {
        seosys300_json_error(409, 'triage_required', '정리 완료 후 에이전트로 보낼 수 있습니다.');
    }
    if (!empty($input['cwd']) || !empty($input['siteCwd'])) {
        $cwd = !empty($input['cwd']) ? $input['cwd'] : $input['siteCwd'];
        if (!isset($ticket['workPackage']) || !is_array($ticket['workPackage'])) {
            $ticket['workPackage'] = array();
        }
        $ticket['workPackage']['cwd'] = seosys300_revision_clip_text($cwd, 500);
        $rowForCwd = seosys300_revision_get_row($ticket_id);
        if ($rowForCwd) {
            $workForCwd = seosys300_revision_work_from_row($rowForCwd);
            $workForCwd['cwd'] = $ticket['workPackage']['cwd'];
            seosys300_revision_save_work($ticket_id, $workForCwd);
        }
    }
    $package = seosys300_revision_persist_agent_package($ticket);
    if (!$package) {
        seosys300_json_error(500, 'package_failed', '커서 패키지를 만들지 못했습니다.');
    }

    $row = seosys300_revision_get_row($ticket_id);
    $work = seosys300_revision_work_from_row($row);
    $now = seosys300_now();
    $work['agentDispatch'] = array(
        'status' => 'queued',
        'queuedAt' => $now,
        'requestedBy' => isset($input['author']) ? seosys300_revision_clip_text($input['author'], 40) : 'crm',
        'agentRunId' => '',
        'webhookOk' => false,
        'webhookStatus' => 0,
        'resultAt' => '',
        'error' => '',
    );

    $webhook = trim(seosys300_revision_env('SEOSYS300_CURSOR_AGENT_WEBHOOK_URL', ''));
    if ($webhook === '') {
        $webhook = trim(seosys300_revision_env('ONOFF_CURSOR_AGENT_WEBHOOK_URL', ''));
    }
    if ($webhook !== '' && function_exists('curl_init')) {
        $payload = json_encode(array(
            'ok' => true,
            'event' => 'revision.agent_dispatch',
            'ticketId' => $ticket_id,
            'package' => $package,
            'callback' => array(
                'feedbackUrl' => 'https://onoff.icrm.co.kr/api/crm/revisions.php',
                'action' => 'feedback',
            ),
            'queuedAt' => $now,
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $ch = curl_init($webhook);
        if ($ch !== false) {
            $headers = array('Content-Type: application/json', 'Accept: application/json');
            $token = trim(seosys300_revision_env('SEOSYS300_CURSOR_AGENT_WEBHOOK_TOKEN', ''));
            if ($token !== '') {
                $headers[] = 'X-ONOFF-Agent-Token: ' . $token;
            }
            curl_setopt_array($ch, array(
                CURLOPT_POST => true,
                CURLOPT_HTTPHEADER => $headers,
                CURLOPT_POSTFIELDS => is_string($payload) ? $payload : '{}',
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT => 8,
                CURLOPT_CONNECTTIMEOUT => 3,
            ));
            $body = curl_exec($ch);
            $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);
            $work['agentDispatch']['webhookStatus'] = $status;
            $work['agentDispatch']['webhookOk'] = ($status >= 200 && $status < 300);
            if (is_string($body) && $body !== '') {
                $decoded = json_decode($body, true);
                if (is_array($decoded) && !empty($decoded['agentRunId'])) {
                    $work['agentDispatch']['agentRunId'] = seosys300_revision_clip_text((string) $decoded['agentRunId'], 120);
                    $work['agentDispatch']['status'] = 'running';
                }
            }
        }
    }

    // Local inbox for staff runners that poll the package directory.
    $inbox = seosys300_revision_agent_package_dir() . '/inbox';
    if (!is_dir($inbox)) {
        @mkdir($inbox, 0750, true);
    }
    @file_put_contents(
        $inbox . '/ticket-' . $ticket_id . '.json',
        json_encode(array(
            'ticketId' => $ticket_id,
            'queuedAt' => $now,
            'packageFile' => 'ticket-' . $ticket_id . '.json',
            'status' => $work['agentDispatch']['status'],
            'orderDomain' => isset($package['orderDomain']) ? (string) $package['orderDomain'] : '',
            'siteUrl' => isset($package['siteUrl']) ? (string) $package['siteUrl'] : '',
            'cwd' => isset($package['cwd']) ? (string) $package['cwd'] : '',
            'pageUrl' => isset($package['pageUrl']) ? (string) $package['pageUrl'] : '',
        ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n",
        LOCK_EX
    );

    seosys300_revision_save_work($ticket_id, $work);
    seosys300_revision_add_comment(
        $ticket_id,
        isset($input['author']) ? seosys300_revision_clip_text($input['author'], 40) : 'crm',
        'admin',
        '커서 에이전트 실행 대기열에 넣었습니다.'
    );
    return seosys300_revision_admin_detail($ticket_id);
}

/**
 * Runner callback: mark dispatch finished (before/with feedback).
 *
 * @param int $ticket_id
 * @param array $input
 */
function seosys300_revision_mark_agent_dispatch_result($ticket_id, $input = array())
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return;
    }
    $work = seosys300_revision_work_from_row($row);
    if (!isset($work['agentDispatch']) || !is_array($work['agentDispatch'])) {
        $work['agentDispatch'] = array();
    }
    $status = isset($input['dispatchStatus']) ? (string) $input['dispatchStatus'] : 'completed';
    if (!in_array($status, array('queued', 'running', 'completed', 'failed'), true)) {
        $status = 'completed';
    }
    $work['agentDispatch']['status'] = $status;
    $work['agentDispatch']['resultAt'] = seosys300_now();
    if (!empty($input['agentRunId'])) {
        $work['agentDispatch']['agentRunId'] = seosys300_revision_clip_text((string) $input['agentRunId'], 120);
    }
    if (!empty($input['dispatchError'])) {
        $work['agentDispatch']['error'] = seosys300_revision_clip_text((string) $input['dispatchError'], 500);
    }
    seosys300_revision_save_work($ticket_id, $work);
}

function seosys300_revision_agent_package_file($ticket_id, $format = 'md')
{
    $ticket_id = (int) $ticket_id;
    if ($ticket_id < 1) {
        return null;
    }
    $format = strtolower((string) $format);
    if ($format === 'json' || $format === 'application/json') {
        $ext = 'json';
        $mime = 'application/json; charset=utf-8';
    } else {
        $ext = 'md';
        $mime = 'text/markdown; charset=utf-8';
    }
    $path = seosys300_revision_agent_package_dir() . '/ticket-' . $ticket_id . '.' . $ext;
    if (!is_file($path) || !is_readable($path)) {
        return null;
    }
    return array(
        'path' => $path,
        'mime' => $mime,
        'name' => 'onoff-revision-' . $ticket_id . '.' . $ext,
    );
}

function seosys300_revision_bind_result($ticket_id, $file_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return;
    }
    $work = seosys300_revision_work_from_row($row);
    if (!isset($work['lastResult']) || !is_array($work['lastResult'])) {
        $work['lastResult'] = array('url' => '', 'note' => '', 'snapshotFileId' => 0, 'at' => '');
    }
    $work['lastResult']['snapshotFileId'] = (int) $file_id;
    if (empty($work['lastResult']['at'])) {
        $work['lastResult']['at'] = seosys300_now();
    }
    if (empty($work['lastResult']['url']) && !empty($row['feedback_url'])) {
        $work['lastResult']['url'] = (string) $row['feedback_url'];
    }
    if (empty($work['lastResult']['note']) && !empty($row['feedback_note'])) {
        $work['lastResult']['note'] = (string) $row['feedback_note'];
    }
    seosys300_revision_save_work($ticket_id, $work);
}

function seosys300_revision_bind_snapshot($ticket_id, $file_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return;
    }
    $ann = seosys300_revision_annotation_from_row($row);
    if (!$ann) {
        $ann = array(
            'tool' => 'box',
            'label' => '선택한 영역',
            'device' => 'pc',
            'pageUrl' => (string) $row['page_url'],
        );
    }
    $ann['snapshotFileId'] = (int) $file_id;
    $json = json_encode($ann, JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return;
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET annotation_json = '" . seosys300_esc($json) . "', updated_at = '{$now}'
         WHERE id = " . (int) $ticket_id
    );
}

function seosys300_revision_annotation_from_description($description, $pageUrl = '', $device = '')
{
    if (!preg_match('/^\[표시\]\s*(.+?)\s*·\s*(PC|모바일)/u', (string) $description, $m)) {
        return null;
    }
    $box = null;
    if (preg_match('/영역:\s*([\d.]+),([\d.]+)\s*-\s*([\d.]+),([\d.]+)/u', (string) $description, $b)) {
        $box = array(
            'x' => (float) $b[1],
            'y' => (float) $b[2],
            'w' => (float) $b[3] - (float) $b[1],
            'h' => (float) $b[4] - (float) $b[2],
        );
    }
    return seosys300_revision_normalize_annotation(array(
        'tool' => 'block',
        'label' => $m[1],
        'device' => $m[2] === '모바일' ? 'mobile' : ($device !== '' ? $device : 'pc'),
        'pageUrl' => $pageUrl,
        'box' => $box,
    ));
}

function seosys300_revision_annotation_from_row($row)
{
    if (!is_array($row)) {
        return null;
    }
    $fromJson = seosys300_revision_normalize_annotation(isset($row['annotation_json']) ? $row['annotation_json'] : '');
    if ($fromJson) {
        return $fromJson;
    }
    return seosys300_revision_annotation_from_description(
        isset($row['description']) ? $row['description'] : '',
        isset($row['page_url']) ? $row['page_url'] : '',
        isset($row['device']) ? $row['device'] : ''
    );
}

function seosys300_revision_ensure_tables()
{
    static $done = false;
    if ($done) {
        return true;
    }
    $tickets = seosys300_revision_tickets_table();
    $comments = seosys300_revision_comments_table();
    $files = seosys300_revision_files_table();

    $ok = seosys300_query("CREATE TABLE IF NOT EXISTS `{$tickets}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `order_id` int(11) NOT NULL DEFAULT 0,
        `project_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `title` varchar(191) NOT NULL DEFAULT '',
        `description` text NOT NULL,
        `page_url` varchar(500) NOT NULL DEFAULT '',
        `device` varchar(20) NOT NULL DEFAULT 'both',
        `category` varchar(40) NOT NULL DEFAULT 'other',
        `priority` varchar(20) NOT NULL DEFAULT 'normal',
        `status` varchar(30) NOT NULL DEFAULT 'requested',
        `quote_points` int(11) NOT NULL DEFAULT 0,
        `quote_note` text NOT NULL,
        `quote_version` int(11) NOT NULL DEFAULT 0,
        `quote_expires_at` datetime DEFAULT NULL,
        `paid_at` datetime DEFAULT NULL,
        `paid_request_id` varchar(80) NOT NULL DEFAULT '',
        `feedback_note` text NOT NULL,
        `feedback_url` varchar(500) NOT NULL DEFAULT '',
        `annotation_json` text NOT NULL,
        `agent_brief` text NOT NULL,
        `free_used` tinyint(1) NOT NULL DEFAULT 0,
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_mb_status` (`mb_id`,`status`),
        KEY `idx_order` (`order_id`),
        KEY `idx_project` (`project_id`),
        KEY `idx_created` (`created_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    $ok2 = seosys300_query("CREATE TABLE IF NOT EXISTS `{$comments}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `ticket_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `author_role` varchar(20) NOT NULL DEFAULT 'student',
        `body` text NOT NULL,
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_ticket` (`ticket_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    seosys300_revision_ensure_column($tickets, 'annotation_json', '`annotation_json` text NULL');
    seosys300_revision_ensure_column($tickets, 'agent_brief', '`agent_brief` text NULL');
    seosys300_revision_ensure_column($tickets, 'work_json', '`work_json` text NULL');

    $events = seosys300_revision_events_table();
    $okEvents = seosys300_query("CREATE TABLE IF NOT EXISTS `{$events}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `ticket_id` int(11) NOT NULL DEFAULT 0,
        `event` varchar(60) NOT NULL DEFAULT '',
        `title` varchar(191) NOT NULL DEFAULT '',
        `triage_state` varchar(40) NOT NULL DEFAULT '',
        `payload_json` text NOT NULL,
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_created` (`id`),
        KEY `idx_ticket` (`ticket_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    $ok3 = seosys300_query("CREATE TABLE IF NOT EXISTS `{$files}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `ticket_id` int(11) NOT NULL DEFAULT 0,
        `comment_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `original_name` varchar(255) NOT NULL DEFAULT '',
        `stored_name` varchar(255) NOT NULL DEFAULT '',
        `mime_type` varchar(120) NOT NULL DEFAULT '',
        `file_size` int(11) NOT NULL DEFAULT 0,
        `rel_path` varchar(500) NOT NULL DEFAULT '',
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `idx_ticket` (`ticket_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");

    $done = ($ok && $ok2 && $ok3 && $okEvents);
    return $done;
}

function seosys300_revision_statuses()
{
    return array(
        'requested',
        'reviewing',
        'need_info',
        'free_progress',
        'quote_pending',
        'paid',
        'in_progress',
        'feedback',
        'completed',
        'cancelled',
        'expired',
    );
}

function seosys300_revision_customer_progress($row, $work)
{
    $status = is_array($row) ? (string) $row['status'] : '';
    $triage = seosys300_revision_triage_state($row, $work);
    if ($status === 'completed') {
        return array('id' => 'done', 'label' => '완료', 'hint' => '완료', 'cta' => '');
    }
    if ($status === 'cancelled') {
        return array('id' => 'cancelled', 'label' => '취소', 'hint' => '취소', 'cta' => '');
    }
    if ($status === 'expired') {
        return array('id' => 'expired', 'label' => '만료', 'hint' => '만료', 'cta' => '다시 요청');
    }
    if ($status === 'feedback') {
        $url = '';
        if (is_array($work) && !empty($work['lastResult']['url'])) {
            $url = (string) $work['lastResult']['url'];
        } elseif (!empty($row['feedback_url'])) {
            $url = (string) $row['feedback_url'];
        }
        return array(
            'id' => 'feedback',
            'label' => '확인',
            'hint' => '확인',
            'confirmUrl' => $url,
            'cta' => '확인',
        );
    }
    if ($status === 'need_info') {
        return array(
            'id' => 'need_info',
            'label' => '진행',
            'hint' => '진행',
            'cta' => '자료 보내기',
        );
    }
    if ($status === 'quote_pending') {
        return array(
            'id' => 'payment',
            'label' => '진행',
            'hint' => '진행',
            'cta' => '결제하기',
        );
    }
    if (in_array($status, array('in_progress', 'free_progress', 'paid'), true)) {
        return array(
            'id' => 'work',
            'label' => '진행',
            'hint' => '진행',
            'cta' => '',
        );
    }
    if ($status === 'reviewing' && $triage === 'info_returned') {
        return array('id' => 'reviewing', 'label' => '진행', 'hint' => '진행', 'cta' => '');
    }
    if ($status === 'reviewing' || $triage === 'ready') {
        return array('id' => 'reviewing', 'label' => '접수', 'hint' => '접수', 'cta' => '');
    }
    return array('id' => 'requested', 'label' => '접수', 'hint' => '접수', 'cta' => '');
}

function seosys300_revision_status_label($status)
{
    // Customer-facing fallback must stay on the 4-step labels.
    $map = array(
        'requested' => '접수',
        'reviewing' => '접수',
        'need_info' => '진행',
        'free_progress' => '진행',
        'quote_pending' => '진행',
        'paid' => '진행',
        'in_progress' => '진행',
        'feedback' => '확인',
        'completed' => '완료',
        'cancelled' => '취소',
        'expired' => '만료',
    );
    $key = (string) $status;
    return isset($map[$key]) ? $map[$key] : $key;
}

function seosys300_revision_categories()
{
    return array('layout', 'design', 'content', 'seo_tag', 'speed', 'other');
}

function seosys300_revision_devices()
{
    return array('pc', 'mobile', 'both');
}

function seosys300_revision_open_statuses()
{
    return array(
        'requested',
        'reviewing',
        'need_info',
        'free_progress',
        'quote_pending',
        'paid',
        'in_progress',
        'feedback',
    );
}

function seosys300_revision_eligible_order($order)
{
    if (!$order || !is_array($order)) {
        return false;
    }
    $status = seosys300_normalize_order_status(isset($order['status']) ? $order['status'] : '');
    return $status !== '' && $status !== 'draft';
}

function seosys300_revision_month_start()
{
    return date('Y-m-01 00:00:00');
}

function seosys300_revision_free_quota($mb_id)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $inParts = array();
    foreach (seosys300_revision_customer_mb_ids($mb_id) as $candidate) {
        $safe = seosys300_esc(substr((string) $candidate, 0, 100));
        if ($safe !== '') {
            $inParts[] = "'{$safe}'";
        }
    }
    if (!$inParts) {
        $inParts[] = "'" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "'";
    }
    $in = implode(',', $inParts);
    $start = seosys300_esc(seosys300_revision_month_start());
    $row = seosys300_fetch(
        "SELECT COUNT(*) AS cnt FROM `{$table}`
         WHERE mb_id IN ({$in}) AND free_used = 1 AND status <> 'cancelled'
           AND created_at >= '{$start}'"
    );
    $used = $row ? (int) $row['cnt'] : 0;
    $limit = seosys300_revision_free_per_month();
    $resetAt = date('Y-m-01 00:00:00', strtotime('first day of next month'));
    return array(
        'limit' => $limit,
        'used' => $used,
        'remaining' => max(0, $limit - $used),
        'monthStart' => seosys300_revision_month_start(),
        'resetAt' => $resetAt,
        'resetLabel' => date('n월 1일', strtotime($resetAt)),
    );
}

function seosys300_revision_expire_quotes()
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET status = 'expired', updated_at = '{$now}'
         WHERE status = 'quote_pending'
           AND quote_expires_at IS NOT NULL
           AND quote_expires_at < '{$now}'"
    );
}

function seosys300_revision_file_to_api($row)
{
    return array(
        'id' => (int) $row['id'],
        'ticketId' => (int) $row['ticket_id'],
        'commentId' => (int) $row['comment_id'],
        'originalName' => (string) $row['original_name'],
        'mimeType' => (string) $row['mime_type'],
        'fileSize' => (int) $row['file_size'],
        'createdAt' => (string) $row['created_at'],
        'downloadUrl' => '/plugin/seo-system-300/api/revision/download.php?id=' . (int) $row['id'],
    );
}

function seosys300_revision_comment_to_api($row)
{
    return array(
        'id' => (int) $row['id'],
        'ticketId' => (int) $row['ticket_id'],
        'mbId' => (string) $row['mb_id'],
        'authorRole' => (string) $row['author_role'],
        'body' => (string) $row['body'],
        'createdAt' => (string) $row['created_at'],
    );
}

function seosys300_revision_ticket_to_api($row, $withDetail = false)
{
    $ticket = array(
        'id' => (int) $row['id'],
        'orderId' => (int) $row['order_id'],
        'projectId' => (int) $row['project_id'],
        'mbId' => (string) $row['mb_id'],
        'title' => (string) $row['title'],
        'description' => (string) $row['description'],
        'pageUrl' => (string) $row['page_url'],
        'device' => (string) $row['device'],
        'category' => (string) $row['category'],
        'priority' => (string) $row['priority'],
        'status' => (string) $row['status'],
        'statusLabel' => seosys300_revision_status_label($row['status']),
        'quotePoints' => (int) $row['quote_points'],
        'quoteNote' => (string) $row['quote_note'],
        'quoteVersion' => (int) $row['quote_version'],
        'quoteExpiresAt' => $row['quote_expires_at'] ? (string) $row['quote_expires_at'] : null,
        'paidAt' => $row['paid_at'] ? (string) $row['paid_at'] : null,
        'feedbackNote' => (string) $row['feedback_note'],
        'feedbackUrl' => (string) $row['feedback_url'],
        'annotation' => seosys300_revision_annotation_with_snapshot(seosys300_revision_annotation_from_row($row)),
        'agentBrief' => isset($row['agent_brief']) ? (string) $row['agent_brief'] : '',
        'freeUsed' => (int) $row['free_used'] === 1,
        'createdAt' => (string) $row['created_at'],
        'updatedAt' => (string) $row['updated_at'],
    );
    $work = seosys300_revision_work_from_row($row);
    $counts = seosys300_revision_info_counts($work);
    $site = seosys300_revision_site_context($ticket);
    $cwd = isset($work['cwd']) ? (string) $work['cwd'] : '';
    $suggestedCwd = isset($site['cwd']) ? (string) $site['cwd'] : '';
    if ($cwd === '' && $suggestedCwd !== '') {
        $cwd = $suggestedCwd;
    }
    $ticket['orderDomain'] = isset($site['orderDomain']) ? (string) $site['orderDomain'] : '';
    $ticket['siteUrl'] = isset($site['siteUrl']) ? (string) $site['siteUrl'] : '';
    if (empty($ticket['siteName']) && !empty($site['siteName'])) {
        $ticket['siteName'] = (string) $site['siteName'];
    }
    $ticket['suggestedCwd'] = $suggestedCwd;
    $ticket['cwdIsPlatform'] = seosys300_revision_cwd_is_platform($cwd);
    $ticket['cwdWarning'] = $ticket['cwdIsPlatform']
        ? 'cwd가 플랫폼(onoff-home)을 가리킵니다. 고객 사이트 경로로 바꾸세요.'
        : (($cwd === '' && $suggestedCwd === '')
            ? '도메인 cwd 매핑이 없습니다. SEOSYS300_REVISION_SITE_CWD_MAP을 확인하세요.'
            : '');
    $ticket['workPackage'] = array(
        'assignee' => $work['assignee'],
        'constraints' => $work['constraints'],
        'scope' => $work['scope'],
        'readyForAgent' => !empty($work['readyForAgent']),
        'cwd' => $cwd,
    );
    $ticket['infoRequests'] = $work['infoRequests'];
    $ticket['infoPendingCount'] = $counts['pending'];
    $ticket['infoAnsweredCount'] = $counts['answered'];
    $ticket['triageState'] = seosys300_revision_triage_state($row, $work);
    $ticket['triageStateLabel'] = seosys300_revision_triage_state_label($ticket['triageState']);
    $ticket['reopenCount'] = isset($work['reopenCount']) ? (int) $work['reopenCount'] : 0;
    $ticket['reopenNote'] = isset($work['reopenNote']) ? (string) $work['reopenNote'] : '';
    $ticket['resultPreview'] = seosys300_revision_result_preview($ticket, $work);
    $ticket['deployChecklist'] = seosys300_revision_deploy_checklist($ticket, $work);
    $ticket['deployPlan'] = seosys300_revision_deploy_plan($ticket, $work);
    $sla = seosys300_revision_compute_sla($row, $work);
    $ticket['sla'] = $sla
        ? array(
            'ok' => false,
            'code' => $sla['code'],
            'label' => $sla['label'],
            'hours' => $sla['hours'],
            'ageHours' => $sla['ageHours'],
        )
        : array('ok' => true, 'code' => '', 'label' => '', 'hours' => 0, 'ageHours' => 0);
    $ticket['cursorPrompt'] = seosys300_revision_build_cursor_prompt($ticket);
    $ticket['customerProgress'] = seosys300_revision_customer_progress($row, $work);
    $ticket['quoteEnabled'] = seosys300_revision_quote_enabled();
    $pkgMeta = (isset($work['agentPackage']) && is_array($work['agentPackage'])) ? $work['agentPackage'] : array();
    $ticketId = (int) $row['id'];
    $hasMd = is_file(seosys300_revision_agent_package_dir() . '/ticket-' . $ticketId . '.md');
    $dispatch = (isset($work['agentDispatch']) && is_array($work['agentDispatch'])) ? $work['agentDispatch'] : array();
    $ticket['cursorPackage'] = array(
        'ready' => $hasMd || !empty($pkgMeta['writtenAt']),
        'writtenAt' => isset($pkgMeta['writtenAt']) ? (string) $pkgMeta['writtenAt'] : '',
        'downloadUrl' => '/api/crm/revisions.php?ticketId=' . $ticketId . '&package=md',
        'jsonUrl' => '/api/crm/revisions.php?ticketId=' . $ticketId . '&package=json',
        'dispatchStatus' => isset($dispatch['status']) ? (string) $dispatch['status'] : '',
        'dispatchedAt' => isset($dispatch['queuedAt']) ? (string) $dispatch['queuedAt'] : '',
        'agentRunId' => isset($dispatch['agentRunId']) ? (string) $dispatch['agentRunId'] : '',
    );
    if ($withDetail) {
        $ticket['comments'] = seosys300_revision_list_comments((int) $row['id']);
        $ticket['files'] = seosys300_revision_list_files((int) $row['id']);
        $ticket['cursorPrompt'] = seosys300_revision_build_cursor_prompt($ticket);
        $ticket['cursorPackagePayload'] = seosys300_revision_build_cursor_package($ticket);
    }
    return $ticket;
}

function seosys300_revision_result_preview($ticket, $work)
{
    $last = (is_array($work) && isset($work['lastResult']) && is_array($work['lastResult'])) ? $work['lastResult'] : array();
    $url = '';
    if (!empty($last['url'])) {
        $url = (string) $last['url'];
    } elseif (!empty($ticket['feedbackUrl'])) {
        $url = (string) $ticket['feedbackUrl'];
    }
    $note = '';
    if (!empty($last['note'])) {
        $note = (string) $last['note'];
    } elseif (!empty($ticket['feedbackNote'])) {
        $note = (string) $ticket['feedbackNote'];
    }
    $snapId = isset($last['snapshotFileId']) ? (int) $last['snapshotFileId'] : 0;
    $snapshotUrl = '';
    if ($snapId > 0) {
        $file = seosys300_revision_get_file_row($snapId);
        if ($file) {
            $api = seosys300_revision_file_to_api($file);
            $snapshotUrl = (string) $api['downloadUrl'];
        }
    }
    $cwd = isset($last['cwd']) ? (string) $last['cwd'] : '';
    if ($cwd === '' && is_array($work) && !empty($work['cwd'])) {
        $cwd = (string) $work['cwd'];
    }
    return array(
        'url' => $url,
        'note' => $note,
        'snapshotFileId' => $snapId,
        'snapshotUrl' => $snapshotUrl,
        'at' => isset($last['at']) ? (string) $last['at'] : '',
        'cwd' => $cwd,
        'changedFiles' => seosys300_revision_normalize_changed_files(isset($last['changedFiles']) ? $last['changedFiles'] : array()),
        'diffStat' => isset($last['diffStat']) ? (string) $last['diffStat'] : '',
    );
}

/**
 * Staff-facing checklist before treating a revision as live-ready.
 *
 * @param array $ticket
 * @param array $work
 * @return array{ready:bool,items:array<int,array{id:string,ok:bool,label:string}>}
 */
function seosys300_revision_deploy_checklist($ticket, $work)
{
    $preview = seosys300_revision_result_preview($ticket, $work);
    $cwd = !empty($preview['cwd'])
        ? (string) $preview['cwd']
        : (isset($work['cwd']) ? (string) $work['cwd'] : '');
    $files = isset($preview['changedFiles']) && is_array($preview['changedFiles']) ? $preview['changedFiles'] : array();
    $url = isset($preview['url']) ? trim((string) $preview['url']) : '';
    $items = array(
        array(
            'id' => 'cwd',
            'ok' => $cwd !== '',
            'label' => $cwd !== '' ? ('작업 디렉터리: ' . $cwd) : '작업 디렉터리(cwd)가 없습니다',
        ),
        array(
            'id' => 'files',
            'ok' => count($files) > 0,
            'label' => count($files) > 0
                ? ('변경 파일 ' . count($files) . '개')
                : '변경 파일 목록이 없습니다',
        ),
        array(
            'id' => 'confirm_url',
            'ok' => $url !== '',
            'label' => $url !== '' ? ('확인 URL: ' . $url) : '확인 URL이 없습니다',
        ),
        array(
            'id' => 'customer_domain',
            'ok' => $cwd === '' || !preg_match('#/platform/onoff-home(?:/|$)#', $cwd),
            'label' => ($cwd !== '' && preg_match('#/platform/onoff-home(?:/|$)#', $cwd))
                ? '경고: cwd가 플랫폼 저장소를 가리킵니다'
                : '고객 사이트 cwd 확인',
        ),
    );
    $ready = true;
    foreach ($items as $item) {
        if (empty($item['ok'])) {
            $ready = false;
            break;
        }
    }
    return array(
        'ready' => $ready,
        'items' => $items,
        'changedFiles' => $files,
        'cwd' => $cwd,
        'confirmUrl' => $url,
        'diffStat' => isset($preview['diffStat']) ? (string) $preview['diffStat'] : '',
    );
}

/**
 * Build a staff-facing live deploy plan (preview + local command).
 *
 * @param array $ticket
 * @param array $work
 * @return array
 */
/**
 * Resolve expected FTP env paths and whether this host can see credentials.
 * Mac customer cwd (/Volumes|/Users) is verified on the operator machine, not CRM.
 *
 * @param string $cwd
 * @param string $domain
 * @return array{configured:?bool,scope:string,paths:array<int,string>,found:string}
 */
function seosys300_revision_ftp_status($cwd, $domain)
{
    $cwd = rtrim((string) $cwd, '/');
    $domain = strtolower(trim((string) $domain));
    $domain = preg_replace('#^https?://#', '', $domain);
    $domain = preg_replace('#/.*$#', '', $domain);
    $paths = array();
    if ($cwd !== '') {
        $paths[] = $cwd . '/ops/ftp.env';
    }
    $home = getenv('HOME');
    if (is_string($home) && $home !== '' && $domain !== '') {
        $paths[] = rtrim($home, '/') . '/.config/onoffmarketing/sites/' . $domain . '.ftp.env';
    }
    $localCwd = $cwd !== '' && (strpos($cwd, '/Volumes/') === 0 || strpos($cwd, '/Users/') === 0);
    if ($localCwd) {
        return array(
            'configured' => null,
            'scope' => 'local',
            'paths' => $paths,
            'found' => '',
        );
    }
    $found = '';
    foreach ($paths as $ftpFile) {
        if (!is_file($ftpFile) || !is_readable($ftpFile)) {
            continue;
        }
        $raw = @file_get_contents($ftpFile);
        if (!is_string($raw) || $raw === '') {
            continue;
        }
        $hasServer = (bool) preg_match('/^\s*FTP_SERVER\s*=\s*\S+/m', $raw);
        $hasUser = (bool) preg_match('/^\s*FTP_USERNAME\s*=\s*\S+/m', $raw);
        $hasPass = (bool) preg_match('/^\s*FTP_PASSWORD\s*=\s*\S+/m', $raw);
        if ($hasServer && $hasUser && $hasPass) {
            $found = $ftpFile;
            break;
        }
    }
    return array(
        'configured' => $found !== '',
        'scope' => 'server',
        'paths' => $paths,
        'found' => $found,
    );
}

function seosys300_revision_deploy_plan($ticket, $work)
{
    $checklist = seosys300_revision_deploy_checklist($ticket, $work);
    $site = seosys300_revision_site_context($ticket);
    $tid = isset($ticket['id']) ? (int) $ticket['id'] : 0;
    $cwd = !empty($checklist['cwd']) ? (string) $checklist['cwd'] : (isset($site['cwd']) ? (string) $site['cwd'] : '');
    $files = isset($checklist['changedFiles']) && is_array($checklist['changedFiles']) ? $checklist['changedFiles'] : array();
    $domain = isset($site['orderDomain']) ? (string) $site['orderDomain'] : '';
    $previewCmd = 'node scripts/revision-cursor-agent/deploy-site.mjs --ticketId=' . $tid . ' --dry-run';
    $deployCmd = 'node scripts/revision-cursor-agent/deploy-site.mjs --ticketId=' . $tid;
    $deployMeta = (isset($work['deploy']) && is_array($work['deploy'])) ? $work['deploy'] : array();
    $status = isset($deployMeta['status']) ? (string) $deployMeta['status'] : '';
    $ftp = seosys300_revision_ftp_status($cwd, $domain);
    $ftpConfigured = array_key_exists('configured', $ftp) ? $ftp['configured'] : false;
    $ftpPaths = isset($ftp['paths']) && is_array($ftp['paths']) ? $ftp['paths'] : array();
    $ftpScope = isset($ftp['scope']) ? (string) $ftp['scope'] : 'server';
    // Prefer Mac operator heartbeat when CRM cannot see /Volumes|/Users paths.
    $operator = seosys300_revision_operator_status_get();
    $opDomain = isset($operator['domains'][$domain]) && is_array($operator['domains'][$domain])
        ? $operator['domains'][$domain]
        : null;
    if ($ftpScope === 'local' && $opDomain !== null && array_key_exists('ftpConfigured', $opDomain)) {
        $ftpConfigured = !empty($opDomain['ftpConfigured']);
    } elseif ($ftpScope === 'local' && array_key_exists('ftpConfiguredLocal', $deployMeta) && $deployMeta['ftpConfiguredLocal'] !== null) {
        $ftpConfigured = !empty($deployMeta['ftpConfiguredLocal']);
    }
    $note = '배포 전 체크리스트를 먼저 채우세요.';
    if (!empty($checklist['ready'])) {
        if ($ftpConfigured === true) {
            $note = '체크리스트 통과. 로컬에서 배포 명령을 실행하거나 배포 대기열에 넣으세요.';
        } elseif ($ftpConfigured === false) {
            $note = '체크리스트 통과. 다만 고객 FTP(ops/ftp.env)가 없어 라이브 업로드는 아직 불가합니다.';
        } elseif ($ftpScope === 'local') {
            $note = '체크리스트 통과. 라이브 업로드는 담당 Mac의 ops/ftp.env가 필요합니다. 먼저 previewCommand(dry-run)로 확인하세요.';
        } else {
            $note = '체크리스트 통과. 다만 고객 FTP(ops/ftp.env)가 없어 라이브 업로드는 아직 불가합니다.';
        }
    }
    return array(
        'ready' => !empty($checklist['ready']),
        'status' => $status,
        'cwd' => $cwd,
        'domain' => $domain,
        'confirmUrl' => isset($checklist['confirmUrl']) ? (string) $checklist['confirmUrl'] : '',
        'changedFiles' => $files,
        'fileCount' => count($files),
        'previewCommand' => $previewCmd,
        'deployCommand' => $deployCmd,
        'ftpConfigured' => $ftpConfigured,
        'ftpScope' => $ftpScope,
        'ftpPaths' => $ftpPaths,
        'operatorAt' => isset($operator['at']) ? (string) $operator['at'] : '',
        'workerAlive' => !empty($operator['workerAlive']),
        'note' => $note,
        'deployNote' => isset($deployMeta['note']) ? (string) $deployMeta['note'] : '',
        'queuedAt' => isset($deployMeta['queuedAt']) ? (string) $deployMeta['queuedAt'] : '',
        'error' => isset($deployMeta['error']) ? (string) $deployMeta['error'] : '',
    );
}

function seosys300_revision_sla_hours($kind)
{
    $defaults = array(
        'triage' => 4,
        'info' => 8,
        'failed' => 1,
    );
    $envKey = 'SEOSYS300_REVISION_SLA_' . strtoupper((string) $kind) . '_HOURS';
    $n = (int) seosys300_revision_env($envKey, (string) $defaults[$kind]);
    if ($n < 1) {
        $n = $defaults[$kind];
    }
    return max(1, min(168, $n));
}

/**
 * Compute current SLA pressure for a ticket (no side effects).
 *
 * @param array $row
 * @param array $work
 * @return array{ok:bool,code:string,label:string,hours:int,ageHours:float}|null
 */
function seosys300_revision_compute_sla($row, $work)
{
    if (!is_array($row)) {
        return null;
    }
    $status = (string) $row['status'];
    if (in_array($status, array('completed', 'cancelled', 'expired'), true)) {
        return null;
    }
    $triage = seosys300_revision_triage_state($row, $work);
    $updated = !empty($row['updated_at']) ? strtotime((string) $row['updated_at']) : 0;
    if ($updated < 1) {
        $updated = !empty($row['created_at']) ? strtotime((string) $row['created_at']) : time();
    }
    $ageHours = max(0, (time() - $updated) / 3600);
    $dispatch = (isset($work['agentDispatch']) && is_array($work['agentDispatch'])) ? $work['agentDispatch'] : array();
    $dispatchStatus = isset($dispatch['status']) ? (string) $dispatch['status'] : '';

    if ($dispatchStatus === 'failed') {
        $limit = seosys300_revision_sla_hours('failed');
        if ($ageHours >= $limit) {
            return array(
                'ok' => false,
                'code' => 'dispatch_failed',
                'label' => '에이전트 실패 ' . round($ageHours, 1) . '시간 방치 (기준 ' . $limit . '시간)',
                'hours' => $limit,
                'ageHours' => round($ageHours, 1),
            );
        }
    }
    if ($triage === 'needs_triage' || $status === 'requested') {
        $limit = seosys300_revision_sla_hours('triage');
        if ($ageHours >= $limit) {
            return array(
                'ok' => false,
                'code' => 'needs_triage',
                'label' => '정리 대기 ' . round($ageHours, 1) . '시간 (기준 ' . $limit . '시간)',
                'hours' => $limit,
                'ageHours' => round($ageHours, 1),
            );
        }
    }
    if ($triage === 'info_returned' || $status === 'need_info') {
        // info_returned is more urgent; need_info waiting on customer is softer
        if ($triage === 'info_returned') {
            $limit = seosys300_revision_sla_hours('info');
            if ($ageHours >= $limit) {
                return array(
                    'ok' => false,
                    'code' => 'info_returned',
                    'label' => '자료 회신 후 미처리 ' . round($ageHours, 1) . '시간 (기준 ' . $limit . '시간)',
                    'hours' => $limit,
                    'ageHours' => round($ageHours, 1),
                );
            }
        }
    }
    return null;
}

/**
 * Scan open tickets and emit CRM SLA events (deduped).
 *
 * @return array{checked:int,alerted:int,items:array}
 */
function seosys300_revision_sla_scan()
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $open = array_map('seosys300_esc', seosys300_revision_open_statuses());
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE status IN ('" . implode("','", $open) . "') ORDER BY id DESC LIMIT 200"
    );
    $checked = 0;
    $alerted = 0;
    $items = array();
    foreach ($rows as $row) {
        $checked++;
        $work = seosys300_revision_work_from_row($row);
        $sla = seosys300_revision_compute_sla($row, $work);
        if (!$sla) {
            continue;
        }
        $items[] = array(
            'ticketId' => (int) $row['id'],
            'code' => $sla['code'],
            'label' => $sla['label'],
        );
        $prev = (isset($work['slaAlert']) && is_array($work['slaAlert'])) ? $work['slaAlert'] : array();
        $sameCode = isset($prev['code']) && (string) $prev['code'] === (string) $sla['code'];
        $prevAt = !empty($prev['at']) ? strtotime((string) $prev['at']) : 0;
        // Re-alert at most once per 6 hours for the same breach code.
        if ($sameCode && $prevAt > 0 && (time() - $prevAt) < 21600) {
            continue;
        }
        $work['slaAlert'] = array(
            'code' => $sla['code'],
            'at' => seosys300_now(),
            'label' => $sla['label'],
        );
        seosys300_revision_save_work((int) $row['id'], $work);
        seosys300_revision_crm_event('revision.sla', $row, array(
            'label' => $sla['label'],
            'code' => $sla['code'],
        ));
        seosys300_revision_add_comment(
            (int) $row['id'],
            'system',
            'admin',
            'SLA 알림: ' . $sla['label']
        );
        $alerted++;
    }
    return array(
        'checked' => $checked,
        'alerted' => $alerted,
        'items' => $items,
    );
}

function seosys300_revision_list_comments($ticket_id)
{
    $table = seosys300_revision_comments_table();
    $tid = (int) $ticket_id;
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE ticket_id = {$tid} ORDER BY id ASC"
    );
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_revision_comment_to_api($row);
    }
    return $out;
}

function seosys300_revision_list_files($ticket_id)
{
    $table = seosys300_revision_files_table();
    $tid = (int) $ticket_id;
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE ticket_id = {$tid} ORDER BY id ASC"
    );
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_revision_file_to_api($row);
    }
    return $out;
}

function seosys300_revision_get_row($ticket_id)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_tickets_table();
    $id = (int) $ticket_id;
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$id} LIMIT 1");
}

function seosys300_revision_customer_mb_ids($mb_id)
{
    $ids = array();
    $primary = trim((string) $mb_id);
    if ($primary !== '') {
        $ids[$primary] = true;
    }
    $email = '';
    if (function_exists('get_member') && $primary !== '') {
        $mb = get_member($primary);
        if (is_array($mb) && !empty($mb['mb_email'])) {
            $email = strtolower(trim((string) $mb['mb_email']));
        }
    }
    if ($email === '' && function_exists('get_session')) {
        $email = strtolower(trim((string) get_session('edu_core_email')));
    }
    if ($email !== '' && function_exists('onoff_education_find_enrollment_by_email')) {
        $en = onoff_education_find_enrollment_by_email($email, 'any', array('active'));
        if (is_array($en) && !empty($en['mb_id'])) {
            $ids[trim((string) $en['mb_id'])] = true;
        }
    }
    return array_keys($ids);
}

function seosys300_revision_get_owned($ticket_id, $mb_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        return null;
    }
    $owner = (string) $row['mb_id'];
    foreach (seosys300_revision_customer_mb_ids($mb_id) as $candidate) {
        if ($owner === (string) $candidate) {
            return $row;
        }
    }
    return null;
}

function seosys300_revision_add_comment($ticket_id, $mb_id, $role, $body)
{
    seosys300_revision_ensure_tables();
    $body = trim((string) $body);
    if ($body === '') {
        return null;
    }
    $table = seosys300_revision_comments_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "INSERT INTO `{$table}` SET
            ticket_id = " . (int) $ticket_id . ",
            mb_id = '" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "',
            author_role = '" . seosys300_esc($role === 'admin' ? 'admin' : 'student') . "',
            body = '" . seosys300_esc($body) . "',
            created_at = '{$now}'"
    );
    return (int) sql_insert_id();
}

function seosys300_revision_notify($event, $ticket, $extra = array())
{
    if (function_exists('seosys300_notify_order_event')) {
        $payload = array_merge(array(
            'order_id' => (int) $ticket['order_id'],
            'project_id' => (int) $ticket['project_id'],
            'mb_id' => (string) $ticket['mb_id'],
            'ticket_id' => (int) $ticket['id'],
            'ticket_title' => (string) $ticket['title'],
            'status' => (string) $ticket['status'],
            'quote_points' => (int) $ticket['quote_points'],
        ), $extra);
        seosys300_notify_order_event($event, $payload);
    }
    $push = array(
        'REVISION_REQUESTED' => 'revision.requested',
        'REVISION_NEED_INFO' => 'revision.need_info',
        'REVISION_FREE' => 'revision.free',
        'REVISION_PAID' => 'revision.paid',
        'REVISION_FEEDBACK' => 'revision.feedback',
        'REVISION_INFO_RETURNED' => 'revision.info_returned',
        'REVISION_REOPENED' => 'revision.reopened',
        'REVISION_COMPLETED' => 'revision.completed',
    );
    if (isset($push[$event])) {
        seosys300_revision_crm_event($push[$event], $ticket, $extra);
    }
}

function seosys300_revision_crm_event($event, $ticket, $extra = array())
{
    if (!is_array($ticket) || empty($ticket['id'])) {
        return;
    }
    seosys300_revision_ensure_tables();
    $api = seosys300_revision_ticket_to_api($ticket, false);
    $title = isset($api['title']) ? (string) $api['title'] : (string) $ticket['title'];
    $payload = array(
        'event' => (string) $event,
        'ticketId' => (int) $ticket['id'],
        'triageState' => isset($api['triageState']) ? (string) $api['triageState'] : '',
        'triageStateLabel' => isset($api['triageStateLabel']) ? (string) $api['triageStateLabel'] : '',
        'title' => $title,
        'status' => isset($api['status']) ? (string) $api['status'] : (string) $ticket['status'],
        'createdAt' => seosys300_now(),
    );
    if (is_array($extra)) {
        if (!empty($extra['siteName'])) {
            $payload['siteName'] = seosys300_revision_clip_text($extra['siteName'], 120);
        }
        if (!empty($extra['label'])) {
            $payload['label'] = seosys300_revision_clip_text($extra['label'], 160);
            $payload['title'] = seosys300_revision_clip_text($extra['label'], 191);
            $title = $payload['title'];
        }
        if (!empty($extra['code'])) {
            $payload['code'] = seosys300_revision_clip_text($extra['code'], 40);
        }
    }
    $table = seosys300_revision_events_table();
    $now = seosys300_esc(seosys300_now());
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
    seosys300_query(
        "INSERT INTO `{$table}` SET
            ticket_id = " . (int) $ticket['id'] . ",
            event = '" . seosys300_esc(substr((string) $event, 0, 60)) . "',
            title = '" . seosys300_esc(seosys300_revision_clip_text($title, 191)) . "',
            triage_state = '" . seosys300_esc(isset($payload['triageState']) ? $payload['triageState'] : '') . "',
            payload_json = '" . seosys300_esc($json ? $json : '{}') . "',
            created_at = '{$now}'"
    );
    $payload['id'] = (int) sql_insert_id();
    seosys300_revision_webhook_post($payload);
}

function seosys300_revision_list_events($since_id = 0, $limit = 50)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_events_table();
    $since = (int) $since_id;
    $lim = max(1, min(100, (int) $limit));
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE id > {$since} ORDER BY id ASC LIMIT {$lim}"
    );
    $out = array();
    foreach ($rows as $row) {
        $payload = array();
        if (!empty($row['payload_json'])) {
            $decoded = json_decode((string) $row['payload_json'], true);
            if (is_array($decoded)) {
                $payload = $decoded;
            }
        }
        $payload['id'] = (int) $row['id'];
        $payload['ticketId'] = (int) $row['ticket_id'];
        $payload['event'] = (string) $row['event'];
        $payload['title'] = (string) $row['title'];
        $payload['triageState'] = (string) $row['triage_state'];
        $payload['createdAt'] = (string) $row['created_at'];
        $out[] = $payload;
    }
    return $out;
}

function seosys300_revision_webhook_post($payload)
{
    $url = seosys300_revision_env('SEOSYS300_CRM_REVISION_WEBHOOK_URL', 'https://crm.icrm.co.kr/api/revisions/webhook');
    $url = trim((string) $url);
    if ($url === '' || in_array(strtolower($url), array('off', '0', 'false', 'none'), true) || !preg_match('#^https?://#i', $url)) {
        return;
    }
    $token = '';
    if (defined('ONOFF_CRM_CONTRACT_API_TOKEN')) {
        $token = (string) ONOFF_CRM_CONTRACT_API_TOKEN;
    }
    if ($token === '') {
        $token = seosys300_revision_env('ONOFF_CRM_CONTRACT_API_TOKEN', '');
    }
    $body = json_encode(array('ok' => true) + (is_array($payload) ? $payload : array()), JSON_UNESCAPED_UNICODE);
    if ($body === false || !function_exists('curl_init')) {
        return;
    }
    $ch = curl_init($url);
    if ($ch === false) {
        return;
    }
    $headers = array('Content-Type: application/json', 'Accept: application/json');
    if ($token !== '') {
        $headers[] = 'X-ONOFF-Contract-Token: ' . $token;
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    curl_setopt_array($ch, array(
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $body,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 1,
        CURLOPT_TIMEOUT => 2,
        CURLOPT_SSL_VERIFYPEER => false,
    ));
    curl_exec($ch);
    curl_close($ch);
}

function seosys300_revision_list_for_student($project_id, $mb_id)
{
    seosys300_revision_ensure_tables();
    seosys300_revision_expire_quotes();
    $table = seosys300_revision_tickets_table();
    $pid = (int) $project_id;
    $idList = array();
    foreach (seosys300_revision_customer_mb_ids($mb_id) as $candidate) {
        $safe = seosys300_esc(substr((string) $candidate, 0, 100));
        if ($safe !== '') {
            $idList[] = "'{$safe}'";
        }
    }
    if (!$idList) {
        $idList[] = "'" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "'";
    }
    $in = implode(',', $idList);
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}`
         WHERE project_id = {$pid} AND mb_id IN ({$in})
         ORDER BY id DESC
         LIMIT 100"
    );
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_revision_ticket_to_api($row, false);
    }
    return array(
        'tickets' => $out,
        'quota' => seosys300_revision_free_quota($mb_id),
        'quoteEnabled' => seosys300_revision_quote_enabled(),
        'wallet' => seosys300_revision_wallet_snapshot(),
        'eligible' => true,
    );
}

function seosys300_revision_create($input, $mb_id)
{
    seosys300_revision_ensure_tables();
    $project_id = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    $order_id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
    if ($project_id < 1) {
        seosys300_json_error(422, 'validation_error', '프로젝트를 선택해주세요.');
    }

    $order = null;
    if ($order_id > 0) {
        $order = seosys300_get_owned_order($order_id, $mb_id);
    }
    if (!$order) {
        $order = seosys300_current_order_for_project($project_id, $mb_id);
    }
    if (!$order || !seosys300_revision_eligible_order($order)) {
        seosys300_json_error(409, 'order_not_eligible', '우리 쪽에서 제작 중인 홈페이지 주문이 있을 때만 수정 요청을 할 수 있습니다.');
    }

    $title = trim(isset($input['title']) ? (string) $input['title'] : '');
    $description = trim(isset($input['description']) ? (string) $input['description'] : '');
    if ($title === '') {
        seosys300_json_error(422, 'validation_error', '제목을 입력해주세요.');
    }

    $category = isset($input['category']) ? preg_replace('/[^a-z0-9_]/', '', strtolower((string) $input['category'])) : 'other';
    if (!in_array($category, seosys300_revision_categories(), true)) {
        $category = 'other';
    }
    $device = isset($input['device']) ? preg_replace('/[^a-z]/', '', strtolower((string) $input['device'])) : 'both';
    if (!in_array($device, seosys300_revision_devices(), true)) {
        $device = 'both';
    }
    $priority = isset($input['priority']) && (string) $input['priority'] === 'urgent' ? 'urgent' : 'normal';
    $page_url = trim(isset($input['pageUrl']) ? (string) $input['pageUrl'] : '');
    if (strlen($page_url) > 500) {
        $page_url = substr($page_url, 0, 500);
    }
    $annotation = seosys300_revision_normalize_annotation(isset($input['annotation']) ? $input['annotation'] : null);
    if ($annotation && $page_url === '' && $annotation['pageUrl'] !== '') {
        $page_url = $annotation['pageUrl'];
    }
    if ($page_url === '') {
        $site = seosys300_revision_site_context(array(
            'orderId' => (int) $order['id'],
            'projectId' => (int) $order['project_id'],
            'workPackage' => array(),
        ));
        if (!empty($site['siteUrl'])) {
            $page_url = (string) $site['siteUrl'];
        }
    }
    if ($annotation && empty($annotation['pageUrl']) && $page_url !== '') {
        $annotation['pageUrl'] = $page_url;
    }
    $annotation_json = $annotation ? json_encode($annotation, JSON_UNESCAPED_UNICODE) : '';

    $now = seosys300_now();
    $table = seosys300_revision_tickets_table();
    seosys300_query(
        "INSERT INTO `{$table}` SET
            order_id = " . (int) $order['id'] . ",
            project_id = " . (int) $order['project_id'] . ",
            mb_id = '" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "',
            title = '" . seosys300_esc(substr($title, 0, 191)) . "',
            description = '" . seosys300_esc($description) . "',
            page_url = '" . seosys300_esc($page_url) . "',
            device = '" . seosys300_esc($device) . "',
            category = '" . seosys300_esc($category) . "',
            priority = '" . seosys300_esc($priority) . "',
            status = 'requested',
            quote_note = '',
            feedback_note = '',
            feedback_url = '',
            annotation_json = '" . seosys300_esc($annotation_json) . "',
            agent_brief = '',
            created_at = '" . seosys300_esc($now) . "',
            updated_at = '" . seosys300_esc($now) . "'"
    );
    $id = (int) sql_insert_id();
    $row = seosys300_revision_get_row($id);
    seosys300_revision_notify('REVISION_REQUESTED', $row);
    return seosys300_revision_ticket_to_api($row, true);
}

function seosys300_revision_student_comment($ticket_id, $mb_id, $body)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if (in_array($row['status'], array('completed', 'cancelled'), true)) {
        seosys300_json_error(409, 'ticket_closed', '완료·취소된 요청에는 댓글을 남길 수 없습니다.');
    }
    seosys300_revision_add_comment($ticket_id, $mb_id, 'student', $body);
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    $work = seosys300_revision_work_from_row($row);
    if ($row['status'] === 'need_info' && !seosys300_revision_info_pending_required($work)) {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'reviewing', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
    } else {
        seosys300_query(
            "UPDATE `{$table}` SET updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
    }
    return seosys300_revision_ticket_to_api(seosys300_revision_get_row($ticket_id), true);
}

function seosys300_revision_confirm_done($ticket_id, $mb_id, $ok)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if ($row['status'] !== 'feedback') {
        seosys300_json_error(409, 'invalid_status', '확인 요청 상태에서만 완료할 수 있습니다.');
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    if ($ok) {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'completed', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
        seosys300_revision_add_comment($ticket_id, $mb_id, 'student', '수정 내용을 확인했습니다.');
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_COMPLETED', $fresh);
        return seosys300_revision_ticket_to_api($fresh, true);
    }

    $work = seosys300_revision_work_from_row($row);
    if (empty($work['lastResult']['url']) && !empty($row['feedback_url'])) {
        $work['lastResult']['url'] = (string) $row['feedback_url'];
    }
    if (empty($work['lastResult']['note']) && !empty($row['feedback_note'])) {
        $work['lastResult']['note'] = (string) $row['feedback_note'];
    }
    $brief = isset($row['agent_brief']) ? trim((string) $row['agent_brief']) : '';
    $work['readyForAgent'] = ($brief !== '');
    $work['reopenCount'] = (isset($work['reopenCount']) ? (int) $work['reopenCount'] : 0) + 1;
    $work['reopenNote'] = '고객이 같은 자리가 아직 안 고쳐졌다고 했습니다. 이전 결과와 표시를 보고 그 부분만 다시 고치세요.';
    $work['agentDispatch'] = array(
        'status' => '',
        'queuedAt' => '',
        'requestedBy' => '',
        'agentRunId' => '',
        'webhookOk' => false,
        'webhookStatus' => 0,
        'resultAt' => '',
        'error' => '',
    );
    seosys300_revision_save_work($ticket_id, $work);
    $nextStatus = ($work['readyForAgent'] && (int) $row['free_used'] === 1) ? 'in_progress' : 'reviewing';
    seosys300_query(
        "UPDATE `{$table}` SET status = '{$nextStatus}', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
    );
    seosys300_revision_add_comment($ticket_id, $mb_id, 'student', '같은 자리가 아직 반영되지 않았습니다. 다시 요청합니다.');
    $fresh = seosys300_revision_get_row($ticket_id);
    seosys300_revision_notify('REVISION_REOPENED', $fresh, array(
        'memo' => $work['reopenNote'],
        'reopen_count' => (int) $work['reopenCount'],
    ));

    // Free tickets with an existing brief go straight back to the agent queue.
    if ($nextStatus === 'in_progress') {
        $detail = seosys300_revision_ticket_to_api($fresh, true);
        seosys300_revision_dispatch_agent_package($detail, array('author' => 'customer-reopen'));
        $fresh = seosys300_revision_get_row($ticket_id);
    }
    return seosys300_revision_ticket_to_api($fresh, true);
}

function seosys300_revision_pay_request_id($ticket_id, $quote_version)
{
    return 'rev' . (int) $ticket_id . 'q' . (int) $quote_version;
}

function seosys300_revision_confirm_payment($ticket_id, $mb_id, $input)
{
    $row = seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if ($row['status'] === 'paid' || $row['status'] === 'in_progress' || $row['status'] === 'feedback' || $row['status'] === 'completed') {
        if ((string) $row['paid_request_id'] !== '') {
            return seosys300_revision_ticket_to_api($row, true);
        }
    }
    if ($row['status'] !== 'quote_pending') {
        seosys300_json_error(409, 'invalid_status', '견적 대기 상태에서만 결제할 수 있습니다.');
    }
    if (!empty($row['quote_expires_at']) && strtotime((string) $row['quote_expires_at']) < time()) {
        $table = seosys300_revision_tickets_table();
        $now = seosys300_esc(seosys300_now());
        seosys300_query(
            "UPDATE `{$table}` SET status = 'expired', updated_at = '{$now}' WHERE id = " . (int) $ticket_id
        );
        seosys300_json_error(409, 'quote_expired', '견적 유효기간이 지났습니다. 운영자에게 새 견적을 요청해주세요.');
    }

    $version = isset($input['quoteVersion']) ? (int) $input['quoteVersion'] : 0;
    if ($version < 1 || $version !== (int) $row['quote_version']) {
        seosys300_json_error(409, 'quote_mismatch', '견적 정보가 변경되었습니다. 화면을 새로고침한 뒤 다시 시도해주세요.');
    }
    $points = (int) $row['quote_points'];
    if ($points < 1) {
        seosys300_json_error(422, 'invalid_quote', '견적 금액이 올바르지 않습니다.');
    }

    $request_id = isset($input['requestId']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', (string) $input['requestId']) : '';
    $expected = seosys300_revision_pay_request_id($ticket_id, $version);
    if ($request_id === '' || $request_id !== $expected) {
        seosys300_json_error(422, 'invalid_request_id', '결제 요청 ID가 올바르지 않습니다.');
    }

    $wallet = seosys300_revision_wallet_snapshot();
    if (!empty($wallet['ok']) && (int) $wallet['balance'] < $points) {
        seosys300_json_error(
            409,
            'insufficient_points',
            '보유 포인트가 부족합니다. 현재 ' . number_format((int) $wallet['balance']) . 'P, 견적 ' . number_format($points) . 'P.'
        );
    }

    $pay = seosys300_revision_debit_points($mb_id, $points, $request_id, array(
        'ticket_id' => (int) $ticket_id,
        'quote_version' => $version,
        'order_id' => (int) $row['order_id'],
    ));
    if (empty($pay['ok'])) {
        seosys300_json_error(
            isset($pay['http']) ? (int) $pay['http'] : 502,
            isset($pay['code']) ? (string) $pay['code'] : 'POINT_USE_FAILED',
            isset($pay['message']) ? (string) $pay['message'] : '포인트 차감에 실패했습니다.'
        );
    }

    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    seosys300_query(
        "UPDATE `{$table}` SET
            status = 'in_progress',
            paid_at = '{$now}',
            paid_request_id = '" . seosys300_esc($request_id) . "',
            updated_at = '{$now}'
         WHERE id = " . (int) $ticket_id . " AND status = 'quote_pending'"
    );
    seosys300_revision_add_comment($ticket_id, $mb_id, 'student', '견적 ' . number_format($points) . 'P 결제를 완료했습니다.');
    $fresh = seosys300_revision_get_row($ticket_id);
    seosys300_revision_notify('REVISION_PAID', $fresh);
    // Same as free path: once paid, queue the agent if triage was already locked.
    $detail = seosys300_revision_admin_detail($ticket_id);
    if (!empty($detail['workPackage']['readyForAgent'])) {
        seosys300_revision_dispatch_agent_package($detail, array('author' => 'customer-pay'));
        $fresh = seosys300_revision_get_row($ticket_id);
    }
    return seosys300_revision_ticket_to_api($fresh, true);
}

function seosys300_revision_points_usage_file()
{
    $dir = dirname(__FILE__) . '/../../../data/service_point_usage';
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
    }
    $ht = $dir . '/.htaccess';
    $ht_contents = is_file($ht) ? (string) @file_get_contents($ht) : '';
    if (strpos($ht_contents, 'Require all denied') === false) {
        @file_put_contents($ht, "Options -Indexes\nRequire all denied\nDeny from all\n");
    }
    return $dir . '/onoff.jsonl';
}

function seosys300_revision_find_points_usage($request_id)
{
    $request_id = (string) $request_id;
    if ($request_id === '') {
        return null;
    }
    $file = seosys300_revision_points_usage_file();
    if (!is_file($file) || !is_readable($file)) {
        return null;
    }
    $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if (!is_array($lines)) {
        return null;
    }
    for ($i = count($lines) - 1; $i >= 0; $i--) {
        $row = json_decode((string) $lines[$i], true);
        if (is_array($row) && (string) ($row['request_id'] ?? '') === $request_id) {
            return $row;
        }
    }
    return null;
}

function seosys300_revision_append_points_usage($row)
{
    $line = json_encode($row, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($line)) {
        return false;
    }
    return @file_put_contents(seosys300_revision_points_usage_file(), $line . "\n", FILE_APPEND | LOCK_EX) !== false;
}

function seosys300_revision_pay_fail($code, $message, $http = 502)
{
    $upper = strtoupper((string) $code);
    if (in_array($upper, array('INSUFFICIENT', 'INSUFFICIENT_POINTS', 'INSUFFICIENT_BALANCE', 'POINT_NOT_ENOUGH', 'BALANCE_NOT_ENOUGH'), true)) {
        $message = '포인트가 부족합니다. 충전한 뒤 다시 결제해주세요.';
        $code = 'insufficient_points';
        $http = 409;
    }
    return array(
        'ok' => false,
        'http' => (int) $http,
        'code' => (string) $code,
        'message' => (string) $message,
    );
}

function seosys300_revision_forward_core_cookies($result)
{
    if (!is_array($result) || empty($result['setCookies'])) {
        return;
    }
    if (class_exists('\\OnoffMarketing\\BrandedAuth\\CookieJar')) {
        \OnoffMarketing\BrandedAuth\CookieJar::forwardToBrowser($result['setCookies']);
    }
}

/**
 * Charge the logged-in member on ONOFF through the same Core wallet
 * hold → capture contract used by /api/points.php?action=use.
 */
function seosys300_revision_debit_points($mb_id, $points, $request_id, $metadata = array())
{
    if (!seosys300_revision_quote_enabled()) {
        return seosys300_revision_pay_fail('quote_disabled', '현재는 무료 수정만 운영합니다. 결제는 사용할 수 없습니다.', 409);
    }
    if (!seosys300_revision_auth_bootstrap()) {
        return seosys300_revision_pay_fail('POINT_NOT_CONFIGURED', '포인트 결제 설정을 찾을 수 없습니다.', 503);
    }
    $existing = seosys300_revision_find_points_usage($request_id);
    if (is_array($existing)) {
        return array(
            'ok' => true,
            'replay' => true,
            'hold_transaction_id' => (string) ($existing['hold_transaction_id'] ?? ''),
        );
    }
    $cookies = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
    if ($cookies === '') {
        return seosys300_revision_pay_fail('unauthorized', '로그인 세션이 없어 결제할 수 없습니다. 다시 로그인한 뒤 시도해주세요.', 401);
    }
    $meta = is_array($metadata) ? $metadata : array();
    $meta['mb_id'] = (string) $mb_id;
    try {
        $session = \OnoffMarketing\BrandedAuth\PlatformAuthService::getSession($cookies);
        seosys300_revision_forward_core_cookies($session);
        if (empty($session['authenticated'])) {
            return seosys300_revision_pay_fail('unauthorized', '온오프 로그인 후 과금 결제를 진행해주세요.', 401);
        }
        $sessionData = is_array($session['data']) ? $session['data'] : array();
        $payer = (string) ($sessionData['member_id'] ?? $sessionData['mb_id'] ?? '');
        if ($payer === '' || $payer !== (string) $mb_id) {
            return seosys300_revision_pay_fail('payer_mismatch', '결제는 수정 요청을 접수한 회원 계정으로만 할 수 있습니다.', 403);
        }
        $platform = method_exists('\\OnoffMarketing\\BrandedAuth\\BrandedAuthConfig', 'platformId')
            ? (string) \OnoffMarketing\BrandedAuth\BrandedAuthConfig::platformId()
            : 'ONOFF';
        $hold = \OnoffMarketing\BrandedAuth\CoreInternalClient::request('wallet/hold', array(
            'method' => 'POST',
            'cookies' => $cookies,
            'body' => array(
                'service_code' => strtoupper($platform !== '' ? $platform : 'ONOFF'),
                'amount' => (int) $points,
                'reference_type' => 'website_revision',
                'reference_id' => (string) $request_id,
                'idempotency_key' => $request_id . ':hold',
                'metadata' => $meta,
            ),
        ));
        seosys300_revision_forward_core_cookies($hold);
        if (empty($hold['ok'])) {
            return seosys300_revision_pay_fail(
                !empty($hold['code']) ? $hold['code'] : 'CORE_HOLD_FAILED',
                !empty($hold['message']) ? $hold['message'] : '포인트 결제 예약에 실패했습니다.',
                !empty($hold['status']) ? (int) $hold['status'] : 502
            );
        }
        $hold_data = is_array($hold['data']) ? $hold['data'] : array();
        $hold_tx = is_array($hold_data['transaction'] ?? null) ? $hold_data['transaction'] : array();
        $hold_id = (string) ($hold_tx['transaction_id'] ?? $hold_tx['hold_transaction_id'] ?? $hold_data['hold_transaction_id'] ?? '');
        if ($hold_id === '') {
            return seosys300_revision_pay_fail('CORE_HOLD_INCOMPLETE', '포인트 결제 응답이 불완전합니다. 잠시 후 다시 시도해주세요.', 502);
        }
        $capture = \OnoffMarketing\BrandedAuth\CoreInternalClient::request('wallet/capture', array(
            'method' => 'POST',
            'cookies' => $cookies,
            'body' => array(
                'hold_transaction_id' => $hold_id,
                'idempotency_key' => $request_id . ':capture',
                'amount' => (int) $points,
            ),
        ));
        seosys300_revision_forward_core_cookies($capture);
        if (empty($capture['ok'])) {
            try {
                $release = \OnoffMarketing\BrandedAuth\CoreInternalClient::request('wallet/release', array(
                    'method' => 'POST',
                    'cookies' => $cookies,
                    'body' => array(
                        'hold_transaction_id' => $hold_id,
                        'idempotency_key' => $request_id . ':release',
                    ),
                ));
                seosys300_revision_forward_core_cookies($release);
            } catch (Exception $ignored) {
            }
            return seosys300_revision_pay_fail(
                !empty($capture['code']) ? $capture['code'] : 'CORE_CAPTURE_FAILED',
                !empty($capture['message']) ? $capture['message'] : '포인트 결제에 실패했습니다.',
                !empty($capture['status']) ? (int) $capture['status'] : 502
            );
        }
        $capture_data = is_array($capture['data']) ? $capture['data'] : array();
        $capture_tx = is_array($capture_data['transaction'] ?? null) ? $capture_data['transaction'] : array();
        $capture_id = (string) ($capture_tx['transaction_id'] ?? $capture_data['capture_transaction_id'] ?? '');
        seosys300_revision_append_points_usage(array(
            'mb_id' => (string) $mb_id,
            'platform' => strtolower($platform !== '' ? $platform : 'onoff'),
            'amount' => (int) $points,
            'request_id' => (string) $request_id,
            'reference_id' => (string) $request_id,
            'hold_transaction_id' => $hold_id,
            'capture_transaction_id' => $capture_id,
            'sot' => 'wallet/hold->wallet/capture',
            'kind' => 'website_revision',
            'created_at' => date('c'),
        ));
        return array('ok' => true, 'hold_transaction_id' => $hold_id, 'capture_transaction_id' => $capture_id);
    } catch (\OnoffMarketing\BrandedAuth\BrandedAuthException $e) {
        return seosys300_revision_pay_fail(
            (string) $e->errorCode,
            $e->getMessage() !== '' ? $e->getMessage() : '포인트 결제에 실패했습니다.',
            (int) $e->httpStatus
        );
    } catch (Exception $e) {
        return seosys300_revision_pay_fail('CORE_UNAVAILABLE', '포인트 결제 서버에 연결하지 못했습니다.', 502);
    }
}

function seosys300_revision_work_blocked_until_paid($row)
{
    if (!is_array($row)) {
        return false;
    }
    if ((string) $row['status'] === 'quote_pending') {
        return true;
    }
    return (int) $row['quote_points'] > 0 && empty($row['paid_at']) && !in_array((string) $row['status'], array('cancelled', 'expired', 'free_progress'), true);
}

function seosys300_revision_upload_file($ticket_id, $mb_id, $is_admin = false)
{
    seosys300_revision_ensure_tables();
    $row = $is_admin ? seosys300_revision_get_row($ticket_id) : seosys300_revision_get_owned($ticket_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    if (in_array($row['status'], array('completed', 'cancelled'), true) && !$is_admin) {
        seosys300_json_error(409, 'ticket_closed', '완료·취소된 요청에는 파일을 올릴 수 없습니다.');
    }
    if (empty($_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        seosys300_json_error(422, 'upload_missing', '업로드할 파일을 선택해주세요.');
    }

    $file = $_FILES['file'];
    if (!empty($file['error'])) {
        seosys300_json_error(422, 'upload_failed', '파일 업로드에 실패했습니다.');
    }
    $max = 12 * 1024 * 1024;
    if ((int) $file['size'] > $max || (int) $file['size'] < 1) {
        seosys300_json_error(422, 'file_too_large', '파일은 12MB 이하만 올릴 수 있습니다.');
    }

    $original = isset($file['name']) ? (string) $file['name'] : 'file';
    $blocked = seosys300_blocked_upload_ext();
    if (seosys300_filename_has_blocked_ext($original, $blocked)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }
    $ext = seosys300_safe_ext($original);
    $allowed = seosys300_allowed_upload_ext();
    if ($ext === '' || !in_array($ext, $allowed, true)) {
        seosys300_json_error(422, 'file_type_denied', '허용되지 않은 파일 형식입니다.');
    }

    seosys300_ensure_upload_htaccess();
    $mb_dir = seosys300_safe_mb_dir($row['mb_id']);
    $dir = seosys300_upload_root() . '/revisions/' . $mb_dir . '/' . (int) $ticket_id;
    if (!is_dir($dir)) {
        @mkdir($dir, 0755, true);
    }
    $stored = date('YmdHis') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $dest = $dir . '/' . $stored;
    if (!@move_uploaded_file($file['tmp_name'], $dest)) {
        seosys300_json_error(500, 'upload_failed', '파일 저장에 실패했습니다.');
    }

    $mime = seosys300_detect_mime($dest);
    $rel = 'revisions/' . $mb_dir . '/' . (int) $ticket_id . '/' . $stored;
    $now = seosys300_esc(seosys300_now());
    $table = seosys300_revision_files_table();
    seosys300_query(
        "INSERT INTO `{$table}` SET
            ticket_id = " . (int) $ticket_id . ",
            comment_id = 0,
            mb_id = '" . seosys300_esc(substr((string) $mb_id, 0, 100)) . "',
            original_name = '" . seosys300_esc(substr($original, 0, 255)) . "',
            stored_name = '" . seosys300_esc($stored) . "',
            mime_type = '" . seosys300_esc(substr($mime, 0, 120)) . "',
            file_size = " . (int) $file['size'] . ",
            rel_path = '" . seosys300_esc($rel) . "',
            created_at = '{$now}'"
    );
    $fid = (int) sql_insert_id();
    $asSnapshot = !empty($_POST['asSnapshot']) || !empty($_POST['snapshot']) || !empty($_POST['as_snapshot']);
    if ($asSnapshot) {
        seosys300_revision_bind_snapshot((int) $ticket_id, $fid);
    }
    $asResult = !empty($_POST['asResult']) || !empty($_POST['as_result']) || !empty($_POST['resultSnapshot']);
    if ($asResult) {
        seosys300_revision_bind_result((int) $ticket_id, $fid);
    }
    $infoRequestId = isset($_POST['infoRequestId']) ? (string) $_POST['infoRequestId'] : (isset($_POST['info_request_id']) ? (string) $_POST['info_request_id'] : '');
    if ($infoRequestId !== '') {
        seosys300_revision_attach_info_file((int) $ticket_id, $infoRequestId, $fid);
    }
    $frow = seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$fid} LIMIT 1");
    return seosys300_revision_file_to_api($frow);
}

function seosys300_revision_get_file_row($file_id)
{
    seosys300_revision_ensure_tables();
    $table = seosys300_revision_files_table();
    return seosys300_fetch('SELECT * FROM `' . $table . '` WHERE id = ' . (int) $file_id . ' LIMIT 1');
}

function seosys300_revision_admin_queue($status_filter = '')
{
    seosys300_revision_ensure_tables();
    seosys300_revision_expire_quotes();
    $table = seosys300_revision_tickets_table();
    $where = '1=1';
    if ($status_filter === 'open') {
        $open = array_map('seosys300_esc', seosys300_revision_open_statuses());
        $where = "status IN ('" . implode("','", $open) . "')";
    } elseif ($status_filter !== '' && in_array($status_filter, seosys300_revision_statuses(), true)) {
        $where = "status = '" . seosys300_esc($status_filter) . "'";
    }
    $rows = seosys300_fetch_all(
        "SELECT * FROM `{$table}` WHERE {$where} ORDER BY
            FIELD(status,'requested','need_info','quote_pending','paid','reviewing','free_progress','in_progress','feedback','expired','completed','cancelled'),
            id DESC
         LIMIT 200"
    );
    $out = array();
    foreach ($rows as $row) {
        $item = seosys300_revision_ticket_to_api($row, false);
        $item['openComments'] = 0;
        $out[] = $item;
    }
    return array(
        'items' => $out,
        'quotaDefault' => seosys300_revision_free_per_month(),
        'quoteEnabled' => seosys300_revision_quote_enabled(),
    );
}

function seosys300_revision_admin_detail($ticket_id)
{
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }
    $ticket = seosys300_revision_ticket_to_api($row, true);
    $ticket['quota'] = seosys300_revision_free_quota($row['mb_id']);
    $ticket['quoteEnabled'] = seosys300_revision_quote_enabled();
    return $ticket;
}

function seosys300_revision_admin_save($input, $actor_mb_id = null)
{
    seosys300_revision_ensure_tables();
    $ticket_id = isset($input['ticketId']) ? (int) $input['ticketId'] : 0;
    $row = seosys300_revision_get_row($ticket_id);
    if (!$row) {
        seosys300_json_error(404, 'ticket_not_found', '수정 요청을 찾을 수 없습니다.');
    }

    $action = isset($input['op']) ? preg_replace('/[^a-z0-9_\-]/', '', strtolower((string) $input['op'])) : '';
    $admin_id = ($actor_mb_id !== null && (string) $actor_mb_id !== '')
        ? substr((string) $actor_mb_id, 0, 100)
        : seosys300_current_mb_id();
    $authorName = isset($input['author']) ? trim((string) $input['author']) : '';
    $authorName = preg_replace('/[\x00-\x1F\x7F]/u', '', $authorName);
    if (!is_string($authorName)) {
        $authorName = '';
    }
    if ($authorName !== '') {
        $admin_id = function_exists('mb_substr') ? mb_substr($authorName, 0, 40) : substr($authorName, 0, 40);
    }
    $table = seosys300_revision_tickets_table();
    $now = seosys300_esc(seosys300_now());
    $note = trim(isset($input['note']) ? (string) $input['note'] : '');
    $brief = trim(isset($input['agentBrief']) ? (string) $input['agentBrief'] : '');
    if ($brief === '') {
        $brief = isset($row['agent_brief']) ? trim((string) $row['agent_brief']) : '';
    }
    if ($brief !== '' && $brief !== (isset($row['agent_brief']) ? (string) $row['agent_brief'] : '')) {
        seosys300_query(
            "UPDATE `{$table}` SET agent_brief = '" . seosys300_esc($brief) . "', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        $row['agent_brief'] = $brief;
    }
    $work = seosys300_revision_apply_work_input($ticket_id, $row, $input);
    $row['work_json'] = json_encode($work, JSON_UNESCAPED_UNICODE);

    if ($action === 'brief' || $action === 'triage' || $action === 'package' || $action === 'ready' || $action === 'dispatch') {
        if ($brief === '') {
            seosys300_json_error(422, 'validation_error', '에이전트에게 넘길 지시를 적어주세요.');
        }
        if ($action === 'ready' || $action === 'dispatch' || !empty($input['readyForAgent']) || !empty($input['ready_for_agent'])) {
            $work['readyForAgent'] = true;
            seosys300_revision_save_work($ticket_id, $work);
        }
        $detail = seosys300_revision_admin_detail($ticket_id);
        if ($action === 'dispatch') {
            return seosys300_revision_dispatch_agent_package($detail, $input);
        }
        if (!empty($detail['workPackage']['readyForAgent']) || $action === 'package') {
            seosys300_revision_persist_agent_package($detail);
            $detail = seosys300_revision_admin_detail($ticket_id);
        }
        return $detail;
    }

    if (in_array($action, array('free', 'free_progress', 'quote', 'start', 'in_progress'), true) && $brief === '') {
        seosys300_json_error(422, 'validation_error', '에이전트에게 넘길 지시를 먼저 적어주세요.');
    }
    if (in_array($action, array('free', 'free_progress', 'quote', 'start', 'in_progress'), true) && empty($work['readyForAgent'])) {
        seosys300_json_error(409, 'triage_required', '정리를 마친 뒤에 커서로 넘길 수 있습니다. 담당·제약·지시를 저장하고 준비 완료로 표시하세요.');
    }

    if ($action === 'review') {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'reviewing', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        if ($note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        }
    } elseif ($action === 'need_info' || $action === 'need-info') {
        $incoming = isset($input['infoRequests']) && is_array($input['infoRequests'])
            ? $input['infoRequests']
            : (isset($input['info_requests']) && is_array($input['info_requests']) ? $input['info_requests'] : array());
        if ($note === '' && empty($incoming)) {
            seosys300_json_error(422, 'validation_error', '필요한 자료를 칸으로 넣거나 메모를 적어주세요.');
        }
        seosys300_revision_append_info_requests($ticket_id, $row, $incoming, $note);
        $labels = array();
        foreach ($incoming as $item) {
            if (is_array($item) && !empty($item['label'])) {
                $labels[] = seosys300_revision_clip_text($item['label'], 80);
            }
        }
        $comment = $note !== '' ? $note : ('자료를 요청합니다: ' . implode(', ', $labels));
        seosys300_query(
            "UPDATE `{$table}` SET status = 'need_info', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $comment);
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_NEED_INFO', $fresh, array('memo' => $comment));
    } elseif ($action === 'free' || $action === 'free_progress') {
        seosys300_revision_assert_free_quota($row);
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'in_progress',
                free_used = 1,
                quote_points = 0,
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        $msg = $note !== '' ? $note : '무료 수정으로 진행합니다.';
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $msg);
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_FREE', $fresh);
        $detail = seosys300_revision_admin_detail($ticket_id);
        // Free path auto-queues the Cursor worker (dispatchStatus=queued).
        return seosys300_revision_dispatch_agent_package($detail, $input);
    } elseif ($action === 'quote') {
        if (!seosys300_revision_quote_enabled()) {
            seosys300_json_error(409, 'quote_disabled', '현재는 무료 수정만 운영합니다. 견적·결제는 사용할 수 없습니다.');
        }
        if (in_array((string) $row['status'], array('in_progress', 'feedback', 'completed', 'paid'), true)) {
            seosys300_json_error(409, 'already_started', '이미 진행 중인 수정에는 새로 과금할 수 없습니다.');
        }
        $points = isset($input['quotePoints']) ? (int) $input['quotePoints'] : 0;
        if ($points < 1 || $points > 10000000) {
            seosys300_json_error(422, 'validation_error', '견적 포인트를 올바르게 입력해주세요.');
        }
        $quote_note = trim(isset($input['quoteNote']) ? (string) $input['quoteNote'] : $note);
        $version = (int) $row['quote_version'] + 1;
        $days = seosys300_revision_quote_days();
        $expires = date('Y-m-d H:i:s', time() + ($days * 86400));
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'quote_pending',
                quote_points = {$points},
                quote_note = '" . seosys300_esc($quote_note) . "',
                quote_version = {$version},
                quote_expires_at = '" . seosys300_esc($expires) . "',
                paid_request_id = '',
                paid_at = NULL,
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        $msg = '견적 ' . number_format($points) . 'P' . ($quote_note !== '' ? ' — ' . $quote_note : '');
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $msg);
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_QUOTE', $fresh);
    } elseif ($action === 'mark_paid' || $action === 'mark-paid') {
        seosys300_json_error(409, 'payment_required', '결제는 고객이 온오프에서 포인트를 결제해야 합니다. 담당자가 결제 완료로 표시할 수 없습니다.');
    } elseif ($action === 'start' || $action === 'in_progress') {
        if (seosys300_revision_work_blocked_until_paid($row)) {
            seosys300_json_error(409, 'payment_required', '고객이 온오프에서 과금 결제를 완료한 뒤에 진행할 수 있습니다.');
        }
        seosys300_query(
            "UPDATE `{$table}` SET status = 'in_progress', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        if ($note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        }
        $detail = seosys300_revision_admin_detail($ticket_id);
        seosys300_revision_persist_agent_package($detail);
    } elseif ($action === 'feedback' || $action === 'complete_feedback') {
        if (seosys300_revision_work_blocked_until_paid($row)) {
            seosys300_json_error(409, 'payment_required', '고객이 온오프에서 과금 결제를 완료한 뒤에 진행할 수 있습니다.');
        }
        $feedback = trim(isset($input['feedbackNote']) ? (string) $input['feedbackNote'] : $note);
        $url = trim(isset($input['feedbackUrl']) ? (string) $input['feedbackUrl'] : '');
        if ($feedback === '') {
            seosys300_json_error(422, 'validation_error', '처리 결과를 적어주세요.');
        }
        seosys300_query(
            "UPDATE `{$table}` SET
                status = 'feedback',
                feedback_note = '" . seosys300_esc($feedback) . "',
                feedback_url = '" . seosys300_esc(substr($url, 0, 500)) . "',
                updated_at = '{$now}'
             WHERE id = {$ticket_id}"
        );
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $feedback . ($url !== '' ? "\n" . $url : ''));
        $work = seosys300_revision_work_from_row($row);
        $work['lastResult']['url'] = seosys300_revision_clip_text($url, 500);
        $work['lastResult']['note'] = seosys300_revision_clip_text($feedback, 2000);
        $work['lastResult']['at'] = seosys300_now();
        if (isset($input['feedbackSnapshotFileId'])) {
            $work['lastResult']['snapshotFileId'] = (int) $input['feedbackSnapshotFileId'];
        }
        if (isset($input['changedFiles']) || isset($input['changeFiles'])) {
            $work['lastResult']['changedFiles'] = seosys300_revision_normalize_changed_files(
                isset($input['changedFiles']) ? $input['changedFiles'] : $input['changeFiles']
            );
        }
        if (isset($input['diffStat']) && is_string($input['diffStat'])) {
            $work['lastResult']['diffStat'] = seosys300_revision_clip_text($input['diffStat'], 2000);
        }
        if (isset($input['cwd']) && is_string($input['cwd']) && trim($input['cwd']) !== '') {
            $work['lastResult']['cwd'] = seosys300_revision_clip_text($input['cwd'], 500);
        } elseif (!empty($work['cwd'])) {
            $work['lastResult']['cwd'] = (string) $work['cwd'];
        }
        $work['reopenNote'] = '';
        seosys300_revision_save_work($ticket_id, $work);
        seosys300_revision_mark_agent_dispatch_result($ticket_id, array(
            'dispatchStatus' => isset($input['dispatchStatus']) ? (string) $input['dispatchStatus'] : 'completed',
            'agentRunId' => isset($input['agentRunId']) ? (string) $input['agentRunId'] : '',
            'dispatchError' => isset($input['dispatchError']) ? (string) $input['dispatchError'] : '',
        ));
        $fresh = seosys300_revision_get_row($ticket_id);
        seosys300_revision_notify('REVISION_FEEDBACK', $fresh, array(
            'feedback_url' => $url,
            'feedback_note' => $feedback,
        ));
    } elseif ($action === 'dispatch_status' || $action === 'dispatch-status') {
        $status = isset($input['dispatchStatus']) ? (string) $input['dispatchStatus'] : '';
        if (!in_array($status, array('queued', 'running', 'completed', 'failed'), true)) {
            seosys300_json_error(422, 'validation_error', 'dispatchStatus는 queued|running|completed|failed 만 허용합니다.');
        }
        seosys300_revision_mark_agent_dispatch_result($ticket_id, array(
            'dispatchStatus' => $status,
            'agentRunId' => isset($input['agentRunId']) ? (string) $input['agentRunId'] : '',
            'dispatchError' => isset($input['dispatchError']) ? (string) $input['dispatchError'] : $note,
        ));
        if ($status === 'failed' && $note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', '에이전트 실행 실패: ' . $note);
        }
        return seosys300_revision_admin_detail($ticket_id);
    } elseif ($action === 'retry' || $action === 'retry_dispatch' || $action === 'retry-dispatch') {
        if (in_array((string) $row['status'], array('completed', 'cancelled', 'expired'), true)) {
            seosys300_json_error(409, 'invalid_status', '종료된 요청은 재시도할 수 없습니다.');
        }
        if ($brief === '') {
            seosys300_json_error(422, 'validation_error', '에이전트에게 넘길 지시를 먼저 적어주세요.');
        }
        $work['readyForAgent'] = true;
        seosys300_revision_save_work($ticket_id, $work);
        if (!in_array((string) $row['status'], array('in_progress', 'free_progress', 'paid', 'feedback', 'reviewing'), true)) {
            seosys300_query(
                "UPDATE `{$table}` SET status = 'in_progress', updated_at = '{$now}' WHERE id = {$ticket_id}"
            );
        }
        $detail = seosys300_revision_admin_detail($ticket_id);
        return seosys300_revision_dispatch_agent_package($detail, $input);
    } elseif ($action === 'deploy_queue' || $action === 'deploy-queue' || $action === 'deploy') {
        $detail = seosys300_revision_admin_detail($ticket_id);
        $plan = isset($detail['deployPlan']) && is_array($detail['deployPlan']) ? $detail['deployPlan'] : array();
        if (empty($plan['ready'])) {
            seosys300_json_error(409, 'deploy_not_ready', '배포 전 체크리스트를 먼저 통과해야 합니다.');
        }
        $work = seosys300_revision_work_from_row(seosys300_revision_get_row($ticket_id));
        $work['deploy'] = array(
            'status' => 'queued',
            'queuedAt' => seosys300_now(),
            'requestedBy' => $admin_id,
            'resultAt' => '',
            'error' => '',
            'command' => isset($plan['deployCommand']) ? (string) $plan['deployCommand'] : '',
        );
        seosys300_revision_save_work($ticket_id, $work);
        $inbox = seosys300_revision_agent_package_dir() . '/deploy-inbox';
        if (!is_dir($inbox)) {
            @mkdir($inbox, 0750, true);
        }
        @file_put_contents(
            $inbox . '/ticket-' . $ticket_id . '.json',
            json_encode(array(
                'ticketId' => $ticket_id,
                'queuedAt' => seosys300_now(),
                'cwd' => isset($plan['cwd']) ? (string) $plan['cwd'] : '',
                'domain' => isset($plan['domain']) ? (string) $plan['domain'] : '',
                'changedFiles' => isset($plan['changedFiles']) ? $plan['changedFiles'] : array(),
                'confirmUrl' => isset($plan['confirmUrl']) ? (string) $plan['confirmUrl'] : '',
                'command' => isset($plan['deployCommand']) ? (string) $plan['deployCommand'] : '',
            ), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n",
            LOCK_EX
        );
        seosys300_revision_add_comment(
            $ticket_id,
            $admin_id,
            'admin',
            '라이브 배포 대기열에 넣었습니다. 로컬에서: ' . (isset($plan['deployCommand']) ? $plan['deployCommand'] : 'deploy-site.mjs')
        );
        seosys300_revision_crm_event('revision.deploy_queued', seosys300_revision_get_row($ticket_id));
        return seosys300_revision_admin_detail($ticket_id);
    } elseif ($action === 'deploy_status' || $action === 'deploy-status') {
        $status = isset($input['deployStatus']) ? preg_replace('/[^a-z_]/', '', strtolower((string) $input['deployStatus'])) : '';
        if (!in_array($status, array('queued', 'running', 'completed', 'failed', 'preview'), true)) {
            seosys300_json_error(422, 'validation_error', 'deployStatus가 올바르지 않습니다.');
        }
        $work['deploy'] = seosys300_revision_normalize_deploy(isset($work['deploy']) ? $work['deploy'] : array());
        $work['deploy']['status'] = $status;
        if ($status === 'queued' && empty($work['deploy']['queuedAt'])) {
            $work['deploy']['queuedAt'] = seosys300_now();
        }
        if (in_array($status, array('completed', 'failed'), true)) {
            $work['deploy']['resultAt'] = seosys300_now();
        }
        if (isset($input['ftpConfigured']) || isset($input['ftpConfiguredLocal'])) {
            $flag = isset($input['ftpConfigured']) ? $input['ftpConfigured'] : $input['ftpConfiguredLocal'];
            $work['deploy']['ftpConfiguredLocal'] = !empty($flag);
        }
        if (isset($input['deployError']) && is_string($input['deployError'])) {
            $work['deploy']['error'] = seosys300_revision_clip_text($input['deployError'], 500);
        } elseif ($status === 'failed' && $note !== '') {
            $work['deploy']['error'] = seosys300_revision_clip_text($note, 500);
        } elseif (in_array($status, array('preview', 'completed', 'queued', 'running'), true)) {
            // Preview/progress notes must not look like deploy failures in admin UI.
            $work['deploy']['error'] = '';
            if ($note !== '') {
                $work['deploy']['note'] = seosys300_revision_clip_text($note, 500);
            } elseif (isset($input['deployNote']) && is_string($input['deployNote'])) {
                $work['deploy']['note'] = seosys300_revision_clip_text($input['deployNote'], 500);
            }
        }
        seosys300_revision_save_work($ticket_id, $work);
        if ($status === 'completed') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', '라이브 배포를 완료했습니다.');
            seosys300_revision_crm_event('revision.deployed', seosys300_revision_get_row($ticket_id));
        } elseif ($status === 'failed') {
            seosys300_revision_add_comment(
                $ticket_id,
                $admin_id,
                'admin',
                '라이브 배포 실패' . ($work['deploy']['error'] !== '' ? ': ' . $work['deploy']['error'] : '')
            );
        }
        return seosys300_revision_admin_detail($ticket_id);
    } elseif ($action === 'complete') {
        seosys300_json_error(409, 'customer_confirm_required', '완료는 고객이 온오프에서 확인해야 합니다.');
    } elseif ($action === 'cancel') {
        seosys300_query(
            "UPDATE `{$table}` SET status = 'cancelled', updated_at = '{$now}' WHERE id = {$ticket_id}"
        );
        if ($note !== '') {
            seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        }
    } elseif ($action === 'comment') {
        if ($note === '') {
            seosys300_json_error(422, 'validation_error', '댓글 내용을 입력해주세요.');
        }
        seosys300_revision_add_comment($ticket_id, $admin_id, 'admin', $note);
        seosys300_query("UPDATE `{$table}` SET updated_at = '{$now}' WHERE id = {$ticket_id}");
    } else {
        seosys300_json_error(400, 'unknown_action', '처리할 수 없는 작업입니다.');
    }

    return seosys300_revision_admin_detail($ticket_id);
}
