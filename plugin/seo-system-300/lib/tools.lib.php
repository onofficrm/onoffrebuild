<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_tools_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_tool_integrations_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_tool_integrations_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_ai_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_ai_runs_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_ai_runs_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_tool_row($project_id, $tool_key)
{
    global $g5;
    if (!seosys300_tools_tables_ready()) {
        return null;
    }
    return seosys300_fetch("SELECT * FROM `{$g5['seosys300_tool_integrations_table']}`
        WHERE project_id = " . (int) $project_id . " AND tool_key = '" . seosys300_esc($tool_key) . "' LIMIT 1");
}

function seosys300_tool_upsert_manual($project_id, $mb_id, $tool_key, $payload)
{
    global $g5;
    if (!seosys300_tool_key_allowed($tool_key)) {
        seosys300_json_error(422, 'validation_error', '허용되지 않은 도구입니다.');
    }
    $reg = seosys300_tool_registry_item($tool_key);
    $level = $reg ? $reg['integrationLevel'] : 'NOT_CONFIGURED';
    $norm = seosys300_manual_tool_payload_normalize($tool_key, $payload);
    $now = seosys300_now();
    $json = seosys300_esc(json_encode($norm, JSON_UNESCAPED_UNICODE));
    $existing = seosys300_tool_row($project_id, $tool_key);
    $status = 'manual';
    if ($existing) {
        seosys300_query("UPDATE `{$g5['seosys300_tool_integrations_table']}` SET
            integration_level = '" . seosys300_esc($level) . "',
            status = '{$status}',
            last_sync_at = '{$now}',
            last_success_at = '{$now}',
            last_error_code = '',
            last_error_message = '',
            config_json = '{$json}',
            updated_at = '{$now}'
            WHERE id = " . (int) $existing['id']);
    } else {
        seosys300_query("INSERT INTO `{$g5['seosys300_tool_integrations_table']}` SET
            project_id = " . (int) $project_id . ",
            mb_id = '" . seosys300_esc($mb_id) . "',
            tool_key = '" . seosys300_esc($tool_key) . "',
            integration_level = '" . seosys300_esc($level) . "',
            status = '{$status}',
            config_json = '{$json}',
            last_sync_at = '{$now}',
            last_success_at = '{$now}',
            created_at = '{$now}',
            updated_at = '{$now}'");
    }
    seosys300_tool_apply_roadmap($project_id, $tool_key, $norm);
    $type = strtoupper(seosys300_tool_to_sync_provider($tool_key)) . '_SYNC_COMPLETED';
    seosys300_log_activity($project_id, $type, seosys300_tool_display_name($tool_key) . ' 수동 결과를 저장했습니다.', array(
        'entity_type' => 'tool',
        'mb_id' => $mb_id,
    ));
    return seosys300_adapter_get_summary($tool_key, seosys300_adapter_get_status($tool_key, seosys300_tool_row($project_id, $tool_key), $reg));
}

function seosys300_tool_apply_roadmap($project_id, $tool_key, $norm)
{
    if (!function_exists('seosys300_auto_complete_task_key')) {
        return;
    }
    if ($tool_key === 'catchdomain' && !empty($norm['selectedDomain'])) {
        seosys300_auto_complete_task_key($project_id, 'catchdomain_candidates');
    }
    if ($tool_key === 'content') {
        $n = isset($norm['publishedCount']) ? (int) $norm['publishedCount'] : 0;
        if ($n >= 1) {
            seosys300_auto_complete_task_key($project_id, 'content_first');
        }
        if ($n >= 10) {
            seosys300_auto_complete_task_key($project_id, 'content_10');
        }
        if ($n >= 30) {
            seosys300_auto_complete_task_key($project_id, 'content_30');
        }
        if ($n >= 50) {
            seosys300_auto_complete_task_key($project_id, 'content_50');
        }
    }
    if ($tool_key === 'backlink') {
        $rd = isset($norm['referringDomains']) ? $norm['referringDomains'] : null;
        $bl = isset($norm['backlinks']) ? $norm['backlinks'] : null;
        if ($bl !== null && (int) $bl >= 1) {
            seosys300_auto_complete_task_key($project_id, 'first_backlink');
        }
        if ($rd !== null && (int) $rd >= 1) {
            seosys300_auto_complete_task_key($project_id, 'referring_domain_check');
        }
    }
    if ($tool_key === 'traffic') {
        $d = isset($norm['deliveredVisits']) ? (int) $norm['deliveredVisits'] : 0;
        if ($d > 0) {
            seosys300_auto_complete_task_key($project_id, 'first_traffic');
            seosys300_auto_complete_task_key($project_id, 'traffic_result');
        }
    }
}

function seosys300_tool_apply_domain($project_id, $mb_id, $domain, $confirm)
{
    if (!$confirm) {
        seosys300_json_error(422, 'confirmation_required', '프로젝트 도메인 변경을 확인해 주세요.');
    }
    $domain = preg_replace('#^https?://#i', '', trim((string) $domain));
    $domain = rtrim($domain, '/');
    if ($domain === '') {
        seosys300_json_error(422, 'validation_error', '도메인을 입력해 주세요.');
    }
    return seosys300_project_update($project_id, array('domain' => $domain));
}

function seosys300_tools_status_for_project($project_id)
{
    $out = array();
    foreach (seosys300_tool_keys() as $key) {
        $reg = seosys300_tool_registry_item($key);
        $row = seosys300_tool_row($project_id, $key);
        $st = seosys300_adapter_get_status($key, $row, $reg);
        $out[$key] = seosys300_adapter_get_summary($key, $st);
        $out[$key]['link'] = seosys300_adapter_get_project_link($key);
        $out[$key]['sync'] = seosys300_adapter_sync($key);
    }
    return $out;
}

function seosys300_unified_seo_summary($project_id, $mb_id)
{
    $project = seosys300_get_owned_project($project_id, $mb_id);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $gsc = array('status' => 'NOT_CONNECTED', 'error' => false);
    $ga4 = array('status' => 'NOT_CONNECTED', 'error' => false);
    $metrics = null;
    try {
        if (function_exists('seosys300_metrics_summary')) {
            $metrics = seosys300_metrics_summary($project_id, $mb_id, '30d');
            $gscState = $metrics['status']['gscState'];
            $gaState = $metrics['status']['ga4State'];
            $gsc['status'] = ($gscState === 'ready') ? 'CONNECTED' : 'NOT_CONNECTED';
            $ga4['status'] = ($gaState === 'ready') ? 'CONNECTED' : 'NOT_CONNECTED';
            $gsc['cell'] = array(
                'impressions' => $metrics['impressions'],
                'clicks' => $metrics['clicks'],
                'source' => 'Google Search Console',
            );
            $ga4['cell'] = array(
                'organicSessions' => $metrics['organicSessions'],
                'source' => 'GA4',
                'definition' => seosys300_organic_traffic_definition(),
            );
        }
    } catch (Exception $e) {
        $gsc = array('status' => 'ERROR', 'error' => true);
        $ga4 = array('status' => 'ERROR', 'error' => true);
    }
    $tools = seosys300_tools_status_for_project($project_id);
    $contentPub = null;
    $rd = null;
    $delivered = null;
    if (isset($tools['content']['summary']['publishedCount'])) {
        $contentPub = $tools['content']['summary']['publishedCount'];
    }
    if (isset($tools['backlink']['summary']['referringDomains'])) {
        $rd = $tools['backlink']['summary']['referringDomains'];
    }
    if (isset($tools['traffic']['summary']['deliveredVisits'])) {
        $delivered = $tools['traffic']['summary']['deliveredVisits'];
    }
    $imp = null;
    $clicks = null;
    $organic = null;
    $impChange = null;
    if ($metrics && $metrics['impressions']['state'] === 'ready') {
        $imp = $metrics['impressions']['value'];
        $clicks = $metrics['clicks']['value'];
        $impChange = $metrics['impressionsChangePct'];
    }
    if ($metrics && $metrics['organicSessions']['state'] === 'ready') {
        $organic = $metrics['organicSessions']['value'];
    }
    $health = seosys300_health_score_rules(array(
        'contentPublished' => $contentPub,
        'contentGoal' => isset($project['content_goal']) ? (int) $project['content_goal'] : 0,
        'referringDomains' => $rd,
        'rdGoal' => isset($project['referring_domain_goal']) ? (int) $project['referring_domain_goal'] : 0,
        'gscReady' => $gsc['status'] === 'CONNECTED',
        'ga4Ready' => $ga4['status'] === 'CONNECTED',
        'impressionsChangePct' => $impChange,
        'trafficDelivered' => $delivered,
    ));
    $milestones = seosys300_milestone_rules(array(
        'contentPublished' => $contentPub,
        'impressions' => $imp,
        'clicks' => $clicks,
        'referringDomains' => $rd,
        'organicSessions' => $organic,
    ));
    $acts = function_exists('seosys300_activity_list') ? seosys300_activity_list($project_id, 20) : array();
    $roadmap = (function_exists('seosys300_roadmap_for_project') && function_exists('seosys300_roadmap_tables_ready') && seosys300_roadmap_tables_ready())
        ? seosys300_roadmap_for_project($project_id)
        : array('status' => 'NOT_CONNECTED');
    return array(
        'project' => array(
            'id' => (int) $project['id'],
            'name' => (string) $project['name'],
            'domain' => (string) $project['domain'],
            'contentGoal' => isset($project['content_goal']) ? (int) $project['content_goal'] : 0,
            'referringDomainGoal' => isset($project['referring_domain_goal']) ? (int) $project['referring_domain_goal'] : 0,
        ),
        'roadmap' => $roadmap,
        'gsc' => $gsc,
        'ga4' => $ga4,
        'catchDomain' => isset($tools['catchdomain']) ? $tools['catchdomain'] : array('status' => 'NOT_CONNECTED'),
        'content' => isset($tools['content']) ? $tools['content'] : array('status' => 'NOT_CONNECTED'),
        'backlink' => isset($tools['backlink']) ? $tools['backlink'] : array('status' => 'NOT_CONNECTED'),
        'traffic' => isset($tools['traffic']) ? $tools['traffic'] : array('status' => 'NOT_CONNECTED'),
        'activities' => $acts,
        'health' => $health,
        'milestones' => $milestones,
        'aiConfigured' => seosys300_ai_configured(),
        'registry' => seosys300_tool_registry(),
    );
}

function seosys300_ai_coach_context_full($project_id, $mb_id)
{
    $uni = seosys300_unified_seo_summary($project_id, $mb_id);
    $ctx = array(
        'project' => $uni['project'],
        'roadmap' => $uni['roadmap'],
        'todayMissions' => (function_exists('seosys300_generate_missions') && function_exists('seosys300_mission_tables_ready') && seosys300_mission_tables_ready())
            ? seosys300_missions_for_date($project_id, $mb_id, seosys300_today_date())
            : array(),
        'recentActivities' => $uni['activities'],
        'gsc' => $uni['gsc'],
        'ga4' => $uni['ga4'],
        'catchDomain' => array(
            'status' => $uni['catchDomain']['status'],
            'summary' => isset($uni['catchDomain']['summary']) ? $uni['catchDomain']['summary'] : null,
            'stale' => !empty($uni['catchDomain']['stale']),
            'lastSuccessAt' => isset($uni['catchDomain']['lastSuccessAt']) ? $uni['catchDomain']['lastSuccessAt'] : null,
        ),
        'content' => array(
            'status' => $uni['content']['status'],
            'summary' => isset($uni['content']['summary']) ? $uni['content']['summary'] : null,
            'stale' => !empty($uni['content']['stale']),
            'lastSuccessAt' => isset($uni['content']['lastSuccessAt']) ? $uni['content']['lastSuccessAt'] : null,
        ),
        'backlink' => array(
            'status' => $uni['backlink']['status'],
            'summary' => isset($uni['backlink']['summary']) ? $uni['backlink']['summary'] : null,
            'stale' => !empty($uni['backlink']['stale']),
            'lastSuccessAt' => isset($uni['backlink']['lastSuccessAt']) ? $uni['backlink']['lastSuccessAt'] : null,
        ),
        'traffic' => array(
            'status' => $uni['traffic']['status'],
            'summary' => isset($uni['traffic']['summary']) ? $uni['traffic']['summary'] : null,
            'stale' => !empty($uni['traffic']['stale']),
            'lastSuccessAt' => isset($uni['traffic']['lastSuccessAt']) ? $uni['traffic']['lastSuccessAt'] : null,
            'notGa4Organic' => true,
        ),
        'healthRuleBased' => $uni['health'],
        'dataAsOf' => seosys300_now(),
    );
    if (function_exists('seosys300_metrics_queries')) {
        $ctx['topQueries'] = array_slice(seosys300_metrics_queries($project_id, '30d'), 0, 20);
        $ctx['topPages'] = array_slice(seosys300_metrics_pages($project_id, '30d'), 0, 20);
        $ctx['opportunities'] = seosys300_opportunity_rules($ctx['topQueries']);
    }
    return seosys300_ai_strip_pii($ctx);
}
