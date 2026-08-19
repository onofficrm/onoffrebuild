<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_ai_record_run($project_id, $mb_id, $run_type, $result)
{
    global $g5;
    if (!seosys300_ai_tables_ready()) {
        return;
    }
    $now = seosys300_now();
    $ok = !empty($result['ok']);
    $usage = isset($result['tokens']) && is_array($result['tokens']) ? $result['tokens'] : array();
    $in = isset($usage['promptTokenCount']) ? (int) $usage['promptTokenCount'] : (isset($usage['prompt_tokens']) ? (int) $usage['prompt_tokens'] : null);
    $out = isset($usage['candidatesTokenCount']) ? (int) $usage['candidatesTokenCount'] : (isset($usage['completion_tokens']) ? (int) $usage['completion_tokens'] : null);
    $inSql = $in === null ? 'NULL' : (int) $in;
    $outSql = $out === null ? 'NULL' : (int) $out;
    seosys300_query("INSERT INTO `{$g5['seosys300_ai_runs_table']}` SET
        project_id = " . (int) $project_id . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        run_type = '" . seosys300_esc($run_type) . "',
        provider = '" . seosys300_esc(isset($result['provider']) ? $result['provider'] : seosys300_ai_provider_name()) . "',
        model = '" . seosys300_esc(isset($result['model']) ? $result['model'] : seosys300_ai_model()) . "',
        status = '" . ($ok ? 'success' : 'failed') . "',
        input_tokens = {$inSql},
        output_tokens = {$outSql},
        error_code = '" . seosys300_esc(isset($result['code']) ? $result['code'] : '') . "',
        created_at = '{$now}'");
}

function seosys300_ai_cache_get($project_id)
{
    global $g5;
    if (!seosys300_ai_tables_ready()) {
        return null;
    }
    return seosys300_fetch("SELECT * FROM `{$g5['seosys300_ai_analysis_cache_table']}` WHERE project_id = " . (int) $project_id . " LIMIT 1");
}

function seosys300_ai_cache_put($project_id, $mb_id, $result, $data_as_of)
{
    global $g5;
    if (!seosys300_ai_tables_ready() || empty($result['ok'])) {
        return;
    }
    $now = seosys300_now();
    $json = seosys300_esc(json_encode($result['data'], JSON_UNESCAPED_UNICODE));
    $existing = seosys300_ai_cache_get($project_id);
    $prov = seosys300_esc(isset($result['provider']) ? $result['provider'] : '');
    $model = seosys300_esc(isset($result['model']) ? $result['model'] : '');
    $asof = seosys300_esc($data_as_of);
    if ($existing) {
        seosys300_query("UPDATE `{$g5['seosys300_ai_analysis_cache_table']}` SET
            provider = '{$prov}', model = '{$model}', data_as_of = '{$asof}',
            analysis_json = '{$json}', updated_at = '{$now}'
            WHERE project_id = " . (int) $project_id);
    } else {
        seosys300_query("INSERT INTO `{$g5['seosys300_ai_analysis_cache_table']}` SET
            project_id = " . (int) $project_id . ",
            mb_id = '" . seosys300_esc($mb_id) . "',
            provider = '{$prov}', model = '{$model}',
            data_as_of = '{$asof}',
            analysis_json = '{$json}',
            created_at = '{$now}', updated_at = '{$now}'");
    }
}

function seosys300_ai_analyze($project_id, $mb_id, $force = false)
{
    if (!seosys300_ai_configured()) {
        return array('ok' => false, 'code' => 'AI_NOT_CONFIGURED');
    }
    $cache = seosys300_ai_cache_get($project_id);
    if (!$force && $cache) {
        $ts = strtotime((string) $cache['updated_at']);
        if ($ts && (time() - $ts) < seosys300_ai_cooldown_seconds()) {
            $data = json_decode($cache['analysis_json'], true);
            return array(
                'ok' => true,
                'cached' => true,
                'data' => is_array($data) ? $data : array(),
                'createdAt' => (string) $cache['updated_at'],
                'dataAsOf' => (string) $cache['data_as_of'],
                'provider' => (string) $cache['provider'],
            );
        }
    }
    $ctx = seosys300_ai_coach_context_full($project_id, $mb_id);
    $result = seosys300_ai_provider_analyze($ctx, '');
    seosys300_ai_record_run($project_id, $mb_id, 'analyze', $result);
    if (empty($result['ok'])) {
        return $result;
    }
    seosys300_ai_cache_put($project_id, $mb_id, $result, isset($ctx['dataAsOf']) ? $ctx['dataAsOf'] : seosys300_now());
    seosys300_log_activity($project_id, 'AI_ANALYSIS_CREATED', 'AI SEO 분석을 생성했습니다.', array(
        'entity_type' => 'ai',
        'mb_id' => $mb_id,
    ));
    return array(
        'ok' => true,
        'cached' => false,
        'data' => $result['data'],
        'createdAt' => seosys300_now(),
        'dataAsOf' => isset($ctx['dataAsOf']) ? $ctx['dataAsOf'] : seosys300_now(),
        'provider' => isset($result['provider']) ? $result['provider'] : '',
    );
}

function seosys300_ai_chat($project_id, $mb_id, $message)
{
    if (!seosys300_ai_configured()) {
        return array('ok' => false, 'code' => 'AI_NOT_CONFIGURED');
    }
    $message = trim((string) $message);
    if ($message === '') {
        seosys300_json_error(422, 'validation_error', '질문을 입력해 주세요.');
    }
    $ctx = seosys300_ai_coach_context_full($project_id, $mb_id);
    $result = seosys300_ai_provider_analyze($ctx, $message);
    seosys300_ai_record_run($project_id, $mb_id, 'chat', $result);
    return $result;
}

function seosys300_ai_add_mission($project_id, $mb_id, $task_key)
{
    if (!function_exists('seosys300_get_task_by_key') || !seosys300_mission_tables_ready()) {
        seosys300_json_error(503, 'tables_missing', '미션 테이블이 아직 준비되지 않았습니다.');
    }
    $task = seosys300_get_task_by_key($task_key);
    if (!$task) {
        seosys300_json_error(422, 'validation_error', '로드맵 작업에 있는 추천만 미션으로 추가할 수 있습니다.');
    }
    global $g5;
    $date = seosys300_today_date();
    $exists = seosys300_fetch("SELECT id FROM `{$g5['seosys300_daily_missions_table']}`
        WHERE project_id = " . (int) $project_id . "
          AND mb_id = '" . seosys300_esc($mb_id) . "'
          AND mission_date = '" . seosys300_esc($date) . "'
          AND roadmap_task_id = " . (int) $task['id'] . " LIMIT 1");
    if ($exists) {
        return seosys300_missions_for_date($project_id, $mb_id, $date);
    }
    $now = seosys300_now();
    seosys300_query("INSERT INTO `{$g5['seosys300_daily_missions_table']}` SET
        project_id = " . (int) $project_id . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        roadmap_task_id = " . (int) $task['id'] . ",
        mission_date = '" . seosys300_esc($date) . "',
        status = 'open',
        sort_order = 90,
        created_at = '{$now}',
        updated_at = '{$now}'");
    seosys300_log_activity($project_id, 'AI_RECOMMENDATION_ADDED_TO_MISSION', 'AI 추천을 오늘의 미션에 추가했습니다.', array(
        'entity_type' => 'mission',
        'entity_id' => (int) $task['id'],
        'mb_id' => $mb_id,
    ));
    return seosys300_missions_for_date($project_id, $mb_id, $date);
}

function seosys300_admin_ai_monitor()
{
    global $g5;
    if (!seosys300_ai_tables_ready() || !seosys300_tables_ready()) {
        return array();
    }
    $projects = seosys300_fetch_all("SELECT id, mb_id, name, domain FROM `{$g5['seosys300_projects_table']}` WHERE is_active = 1 ORDER BY id DESC LIMIT 200");
    $out = array();
    foreach ($projects as $p) {
        $cache = seosys300_ai_cache_get((int) $p['id']);
        $last = seosys300_fetch("SELECT provider, model, status, error_code, created_at, input_tokens, output_tokens
            FROM `{$g5['seosys300_ai_runs_table']}` WHERE project_id = " . (int) $p['id'] . " ORDER BY id DESC LIMIT 1");
        $out[] = array(
            'projectId' => (int) $p['id'],
            'projectName' => (string) $p['name'],
            'domain' => (string) $p['domain'],
            'lastAnalysisAt' => $cache ? (string) $cache['updated_at'] : '',
            'provider' => $last ? (string) $last['provider'] : '',
            'status' => $last ? (string) $last['status'] : 'none',
            'errorCode' => $last ? (string) $last['error_code'] : '',
            'inputTokens' => $last && $last['input_tokens'] !== null ? (int) $last['input_tokens'] : null,
            'outputTokens' => $last && $last['output_tokens'] !== null ? (int) $last['output_tokens'] : null,
        );
    }
    return $out;
}

function seosys300_admin_tool_health()
{
    $items = array();
    if (!seosys300_tables_ready()) {
        return $items;
    }
    global $g5;
    $projects = seosys300_fetch_all("SELECT id, mb_id, name, domain FROM `{$g5['seosys300_projects_table']}` WHERE is_active = 1 ORDER BY id DESC LIMIT 200");
    foreach ($projects as $p) {
        $pid = (int) $p['id'];
        $tools = seosys300_tools_status_for_project($pid);
        $gsc = 'Not Configured';
        $ga4 = 'Not Configured';
        if (function_exists('seosys300_metrics_status_payload')) {
            $st = seosys300_metrics_status_payload($pid, (string) $p['mb_id']);
            $gsc = $st['gscState'] === 'ready' ? 'Connected' : ($st['gscState'] === 'reauth_required' ? 'Reauth Required' : 'Not Configured');
            $ga4 = $st['ga4State'] === 'ready' ? 'Connected' : ($st['ga4State'] === 'reauth_required' ? 'Reauth Required' : 'Not Configured');
        }
        $map = function ($t) {
            if ($t['status'] === 'error') {
                return 'Error';
            }
            if ($t['integrationLevel'] === 'NOT_CONFIGURED') {
                return 'Not Configured';
            }
            if ($t['status'] === 'manual') {
                return 'Link Only';
            }
            return 'Link Only';
        };
        $items[] = array(
            'projectId' => $pid,
            'projectName' => (string) $p['name'],
            'domain' => (string) $p['domain'],
            'catchdomain' => $map($tools['catchdomain']),
            'content' => $map($tools['content']),
            'backlink' => $map($tools['backlink']),
            'traffic' => $map($tools['traffic']),
            'gsc' => $gsc,
            'ga4' => $ga4,
            'ai' => seosys300_ai_configured() ? (seosys300_ai_cache_get($pid) ? 'Connected' : 'Not Configured') : 'Not Configured',
        );
    }
    return $items;
}
