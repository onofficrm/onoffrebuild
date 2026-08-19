<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_admin_diagnostics()
{
    return array(
        'coreDb' => seosys300_tables_ready() ? 'ready' : 'missing',
        'roadmapDb' => function_exists('seosys300_roadmap_tables_ready') && seosys300_roadmap_tables_ready() ? 'ready' : 'missing',
        'metricsDb' => seosys300_metrics_tables_ready() ? 'ready' : 'missing',
        'toolsDb' => function_exists('seosys300_tools_tables_ready') && seosys300_tools_tables_ready() ? 'ready' : 'missing',
        'googleConfigured' => seosys300_google_configured(),
        'aiConfigured' => function_exists('seosys300_ai_configured') && seosys300_ai_configured(),
    );
}

function seosys300_admin_integrations_monitor($filter = '')
{
    global $g5;
    if (!seosys300_metrics_tables_ready()) {
        return array();
    }
    $projects = seosys300_fetch_all("SELECT id, mb_id, name, domain FROM `{$g5['seosys300_projects_table']}` WHERE is_active = 1 ORDER BY id DESC LIMIT 200");
    $out = array();
    $now = time();
    foreach ($projects as $p) {
        $gsc = seosys300_integration_get((int) $p['id'], 'GOOGLE_SEARCH_CONSOLE');
        $ga4 = seosys300_integration_get((int) $p['id'], 'GOOGLE_ANALYTICS');
        $gscStatus = $gsc && (string) $gsc['status'] === 'active' ? 'connected' : 'not_connected';
        $gaStatus = $ga4 && (string) $ga4['status'] === 'active' ? 'connected' : 'not_connected';
        $last = '';
        $err = '';
        foreach (array($gsc, $ga4) as $row) {
            if (!$row) {
                continue;
            }
            if ((string) $row['last_sync_at'] > $last) {
                $last = (string) $row['last_sync_at'];
            }
            if ((string) $row['last_error_code'] !== '') {
                $err = (string) $row['last_error_code'];
            }
        }
        $stale = false;
        if ($last !== '') {
            $ts = strtotime($last);
            $stale = $ts !== false && ($now - $ts) > 7 * 86400;
        }
        $item = array(
            'projectId' => (int) $p['id'],
            'mbId' => (string) $p['mb_id'],
            'projectName' => (string) $p['name'],
            'domain' => (string) $p['domain'],
            'gsc' => $gscStatus,
            'ga4' => $gaStatus,
            'lastSyncAt' => $last,
            'errorCode' => $err,
            'stale' => $stale,
        );
        $keep = true;
        if ($filter === 'gsc_missing') {
            $keep = $gscStatus !== 'connected';
        } elseif ($filter === 'ga4_missing') {
            $keep = $gaStatus !== 'connected';
        } elseif ($filter === 'sync_failed') {
            $keep = $err !== '';
        } elseif ($filter === 'stale') {
            $keep = $stale || ($last === '' && ($gscStatus === 'connected' || $gaStatus === 'connected'));
        }
        if ($keep) {
            $out[] = $item;
        }
    }
    return $out;
}

function seosys300_admin_sync_project($project_id, $provider)
{
    $project_id = (int) $project_id;
    $row = seosys300_fetch("SELECT * FROM `" . $GLOBALS['g5']['seosys300_projects_table'] . "` WHERE id = {$project_id} LIMIT 1");
    if (!$row) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $mb = (string) $row['mb_id'];
    $provider = strtoupper((string) $provider);
    if ($provider === 'GOOGLE_SEARCH_CONSOLE' || $provider === 'GSC') {
        return seosys300_sync_gsc($project_id, $mb, 'admin', 90, true);
    }
    if ($provider === 'GOOGLE_ANALYTICS' || $provider === 'GA4') {
        return seosys300_sync_ga4($project_id, $mb, 'admin', 90, true);
    }
    seosys300_json_error(422, 'validation_error', '허용되지 않은 연동입니다.');
}
