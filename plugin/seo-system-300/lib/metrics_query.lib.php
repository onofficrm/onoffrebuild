<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_range_days($range)
{
    $map = array('7d' => 7, '30d' => 30, '3m' => 90, '6m' => 180, '1y' => 365, 'all' => 365);
    $range = strtolower((string) $range);
    return isset($map[$range]) ? $map[$range] : 30;
}

function seosys300_gsc_sum($project_id, $from, $to)
{
    global $g5;
    $row = seosys300_fetch("SELECT
        COALESCE(SUM(clicks),0) AS clicks,
        COALESCE(SUM(impressions),0) AS impressions,
        COALESCE(AVG(position),0) AS position,
        COUNT(*) AS days
        FROM `{$g5['seosys300_gsc_daily_table']}`
        WHERE project_id = " . (int) $project_id . "
          AND metric_date >= '" . seosys300_esc($from) . "'
          AND metric_date <= '" . seosys300_esc($to) . "'");
    $clicks = $row ? (int) $row['clicks'] : 0;
    $imp = $row ? (int) $row['impressions'] : 0;
    return array(
        'clicks' => $clicks,
        'impressions' => $imp,
        'ctr' => seosys300_ctr($clicks, $imp),
        'avgPosition' => $row ? (float) $row['position'] : null,
        'days' => $row ? (int) $row['days'] : 0,
    );
}

function seosys300_ga4_sum($project_id, $from, $to)
{
    global $g5;
    $row = seosys300_fetch("SELECT
        COALESCE(SUM(active_users),0) AS active_users,
        COALESCE(SUM(sessions),0) AS sessions,
        COALESCE(SUM(organic_sessions),0) AS organic_sessions,
        COALESCE(SUM(engaged_sessions),0) AS engaged_sessions,
        COALESCE(SUM(page_views),0) AS page_views,
        COALESCE(AVG(engagement_rate),0) AS engagement_rate,
        COUNT(*) AS days
        FROM `{$g5['seosys300_ga4_daily_table']}`
        WHERE project_id = " . (int) $project_id . "
          AND metric_date >= '" . seosys300_esc($from) . "'
          AND metric_date <= '" . seosys300_esc($to) . "'");
    return array(
        'activeUsers' => $row ? (int) $row['active_users'] : 0,
        'sessions' => $row ? (int) $row['sessions'] : 0,
        'organicSessions' => $row ? (int) $row['organic_sessions'] : 0,
        'engagedSessions' => $row ? (int) $row['engaged_sessions'] : 0,
        'pageViews' => $row ? (int) $row['page_views'] : 0,
        'engagementRate' => $row ? (float) $row['engagement_rate'] : 0,
        'days' => $row ? (int) $row['days'] : 0,
    );
}

function seosys300_metrics_status_payload($project_id, $mb_id)
{
    $configured = seosys300_google_configured();
    $tables = seosys300_metrics_tables_ready();
    $conn = $tables ? seosys300_google_connection_row($mb_id) : null;
    $gsc = $tables ? seosys300_integration_get($project_id, 'GOOGLE_SEARCH_CONSOLE') : null;
    $ga4 = $tables ? seosys300_integration_get($project_id, 'GOOGLE_ANALYTICS') : null;
    $gscState = 'not_configured';
    if (!$configured) {
        $gscState = 'not_configured';
    } elseif (!$tables) {
        $gscState = 'tables_missing';
    } elseif (!$conn || (string) $conn['status'] === 'disconnected') {
        $gscState = 'not_connected';
    } elseif ((string) $conn['status'] === 'reauth_required') {
        $gscState = 'reauth_required';
    } elseif (!$gsc || (string) $gsc['status'] !== 'active') {
        $gscState = 'property_not_selected';
    } elseif (empty($gsc['last_success_at'])) {
        $gscState = 'sync_needed';
    } else {
        $gscState = 'ready';
    }
    $gaState = $gscState;
    if ($configured && $tables && $conn && (string) $conn['status'] === 'connected') {
        if (!$ga4 || (string) $ga4['status'] !== 'active') {
            $gaState = 'property_not_selected';
        } elseif (empty($ga4['last_success_at'])) {
            $gaState = 'sync_needed';
        } else {
            $gaState = 'ready';
        }
    }
    return array(
        'configured' => $configured,
        'tablesReady' => $tables,
        'connection' => seosys300_google_connection_public($conn),
        'gsc' => seosys300_integration_public($gsc),
        'ga4' => seosys300_integration_public($ga4),
        'gscState' => $gscState,
        'ga4State' => $gaState,
        'organicTrafficDefinition' => seosys300_organic_traffic_definition(),
    );
}

function seosys300_metric_cell($state, $value)
{
    if ($state === 'not_configured' || $state === 'tables_missing') {
        return array('state' => '연결 필요', 'value' => null);
    }
    if ($state === 'not_connected' || $state === 'reauth_required') {
        return array('state' => $state === 'reauth_required' ? '다시 연결' : '연결 필요', 'value' => null);
    }
    if ($state === 'property_not_selected') {
        return array('state' => '연결 필요', 'value' => null);
    }
    if ($state === 'sync_needed') {
        return array('state' => '동기화 필요', 'value' => null);
    }
    if ($value === null) {
        return array('state' => '데이터 없음', 'value' => null);
    }
    return array('state' => 'ready', 'value' => $value);
}

function seosys300_metrics_summary($project_id, $mb_id, $range = '30d')
{
    $days = seosys300_range_days($range);
    $to = date('Y-m-d', strtotime('-1 day'));
    $from = date('Y-m-d', strtotime('-' . $days . ' day'));
    $prevTo = date('Y-m-d', strtotime($from . ' -1 day'));
    $prevFrom = date('Y-m-d', strtotime($prevTo . ' -' . ($days - 1) . ' day'));
    $status = seosys300_metrics_status_payload($project_id, $mb_id);
    $gsc = array('clicks' => 0, 'impressions' => 0, 'ctr' => 0, 'avgPosition' => null, 'days' => 0);
    $gscPrev = $gsc;
    $ga = array('organicSessions' => 0, 'activeUsers' => 0, 'days' => 0);
    $gaPrev = $ga;
    if (seosys300_metrics_tables_ready()) {
        $gsc = seosys300_gsc_sum($project_id, $from, $to);
        $gscPrev = seosys300_gsc_sum($project_id, $prevFrom, $prevTo);
        $ga = seosys300_ga4_sum($project_id, $from, $to);
        $gaPrev = seosys300_ga4_sum($project_id, $prevFrom, $prevTo);
    }
    $impressionsChange = ($gsc['days'] > 0 && $gscPrev['days'] > 0) ? seosys300_period_change_pct($gsc['impressions'], $gscPrev['impressions']) : null;
    $clicksChange = ($gsc['days'] > 0 && $gscPrev['days'] > 0) ? seosys300_period_change_pct($gsc['clicks'], $gscPrev['clicks']) : null;
    $organicChange = ($ga['days'] > 0 && $gaPrev['days'] > 0) ? seosys300_period_change_pct($ga['organicSessions'], $gaPrev['organicSessions']) : null;
    return array(
        'range' => $range,
        'from' => $from,
        'to' => $to,
        'compareFrom' => $prevFrom,
        'compareTo' => $prevTo,
        'status' => $status,
        'impressions' => seosys300_metric_cell($status['gscState'], $gsc['days'] > 0 ? $gsc['impressions'] : null),
        'clicks' => seosys300_metric_cell($status['gscState'], $gsc['days'] > 0 ? $gsc['clicks'] : null),
        'ctr' => seosys300_metric_cell($status['gscState'], $gsc['days'] > 0 ? $gsc['ctr'] : null),
        'avgPosition' => seosys300_metric_cell($status['gscState'], $gsc['days'] > 0 ? $gsc['avgPosition'] : null),
        'organicSessions' => seosys300_metric_cell($status['ga4State'], $ga['days'] > 0 ? $ga['organicSessions'] : null),
        'activeUsers' => seosys300_metric_cell($status['ga4State'], $ga['days'] > 0 ? $ga['activeUsers'] : null),
        'impressionsChangePct' => $impressionsChange,
        'clicksChangePct' => $clicksChange,
        'organicSessionsChangePct' => $organicChange,
        'contents' => array('state' => 'not_connected', 'value' => null),
        'referringDomains' => array('state' => 'not_connected', 'value' => null),
        'seoHealthScore' => array('state' => '준비 중', 'value' => null, 'kind' => 'not_ready'),
    );
}

function seosys300_metrics_timeseries($project_id, $range = '30d')
{
    global $g5;
    $days = seosys300_range_days($range);
    $to = date('Y-m-d', strtotime('-1 day'));
    $from = date('Y-m-d', strtotime('-' . $days . ' day'));
    $gsc = array();
    $ga = array();
    if (seosys300_metrics_tables_ready()) {
        foreach (seosys300_fetch_all("SELECT metric_date, clicks, impressions, ctr, position FROM `{$g5['seosys300_gsc_daily_table']}`
            WHERE project_id = " . (int) $project_id . " AND metric_date >= '" . seosys300_esc($from) . "' AND metric_date <= '" . seosys300_esc($to) . "'
            ORDER BY metric_date ASC") as $row) {
            $gsc[] = array(
                'date' => (string) $row['metric_date'],
                'clicks' => (int) $row['clicks'],
                'impressions' => (int) $row['impressions'],
                'ctr' => (float) $row['ctr'],
                'position' => (float) $row['position'],
            );
        }
        foreach (seosys300_fetch_all("SELECT metric_date, organic_sessions, active_users, sessions FROM `{$g5['seosys300_ga4_daily_table']}`
            WHERE project_id = " . (int) $project_id . " AND metric_date >= '" . seosys300_esc($from) . "' AND metric_date <= '" . seosys300_esc($to) . "'
            ORDER BY metric_date ASC") as $row) {
            $ga[] = array(
                'date' => (string) $row['metric_date'],
                'organicSessions' => (int) $row['organic_sessions'],
                'activeUsers' => (int) $row['active_users'],
                'sessions' => (int) $row['sessions'],
            );
        }
    }
    return array('from' => $from, 'to' => $to, 'gsc' => $gsc, 'ga4' => $ga);
}

function seosys300_metrics_queries($project_id, $range = '30d')
{
    global $g5;
    if (!seosys300_metrics_tables_ready()) {
        return array();
    }
    $days = seosys300_range_days($range);
    $to = date('Y-m-d', strtotime('-1 day'));
    $from = date('Y-m-d', strtotime('-' . $days . ' day'));
    $prevTo = date('Y-m-d', strtotime($from . ' -1 day'));
    $prevFrom = date('Y-m-d', strtotime($prevTo . ' -' . ($days - 1) . ' day'));
    $nowRows = seosys300_fetch_all("SELECT query,
        SUM(clicks) AS clicks, SUM(impressions) AS impressions, AVG(position) AS position
        FROM `{$g5['seosys300_gsc_queries_table']}`
        WHERE project_id = " . (int) $project_id . " AND metric_date >= '" . seosys300_esc($from) . "' AND metric_date <= '" . seosys300_esc($to) . "'
        GROUP BY query ORDER BY clicks DESC LIMIT 50");
    $prevMap = array();
    foreach (seosys300_fetch_all("SELECT query, SUM(clicks) AS clicks
        FROM `{$g5['seosys300_gsc_queries_table']}`
        WHERE project_id = " . (int) $project_id . " AND metric_date >= '" . seosys300_esc($prevFrom) . "' AND metric_date <= '" . seosys300_esc($prevTo) . "'
        GROUP BY query") as $p) {
        $prevMap[(string) $p['query']] = (int) $p['clicks'];
    }
    $out = array();
    foreach ($nowRows as $row) {
        $q = (string) $row['query'];
        $clicks = (int) $row['clicks'];
        $imp = (int) $row['impressions'];
        $change = isset($prevMap[$q]) ? seosys300_period_change_pct($clicks, $prevMap[$q]) : null;
        $out[] = array(
            'query' => $q,
            'clicks' => $clicks,
            'impressions' => $imp,
            'ctr' => seosys300_ctr($clicks, $imp),
            'position' => (float) $row['position'],
            'clicksChangePct' => $change,
            'previousClicks' => isset($prevMap[$q]) ? $prevMap[$q] : null,
        );
    }
    return $out;
}

function seosys300_metrics_pages($project_id, $range = '30d')
{
    global $g5;
    if (!seosys300_metrics_tables_ready()) {
        return array();
    }
    $days = seosys300_range_days($range);
    $to = date('Y-m-d', strtotime('-1 day'));
    $from = date('Y-m-d', strtotime('-' . $days . ' day'));
    $rows = seosys300_fetch_all("SELECT page,
        SUM(clicks) AS clicks, SUM(impressions) AS impressions, AVG(position) AS position
        FROM `{$g5['seosys300_gsc_pages_table']}`
        WHERE project_id = " . (int) $project_id . " AND metric_date >= '" . seosys300_esc($from) . "' AND metric_date <= '" . seosys300_esc($to) . "'
        GROUP BY page ORDER BY clicks DESC LIMIT 50");
    $out = array();
    foreach ($rows as $row) {
        $clicks = (int) $row['clicks'];
        $imp = (int) $row['impressions'];
        $out[] = array(
            'page' => (string) $row['page'],
            'clicks' => $clicks,
            'impressions' => $imp,
            'ctr' => seosys300_ctr($clicks, $imp),
            'position' => (float) $row['position'],
        );
    }
    return $out;
}

function seosys300_metrics_before_now($project_id)
{
    global $g5;
    if (!seosys300_metrics_tables_ready()) {
        return array('before' => null, 'now' => null);
    }
    $first = seosys300_fetch("SELECT MIN(metric_date) AS d FROM `{$g5['seosys300_gsc_daily_table']}` WHERE project_id = " . (int) $project_id);
    if (!$first || empty($first['d'])) {
        return array('before' => null, 'now' => null);
    }
    $start = (string) $first['d'];
    $beforeTo = date('Y-m-d', strtotime($start . ' +6 day'));
    $nowTo = date('Y-m-d', strtotime('-1 day'));
    $nowFrom = date('Y-m-d', strtotime($nowTo . ' -6 day'));
    $before = seosys300_gsc_sum($project_id, $start, $beforeTo);
    $now = seosys300_gsc_sum($project_id, $nowFrom, $nowTo);
    $ga4Before = seosys300_ga4_sum($project_id, $start, $beforeTo);
    $ga4Now = seosys300_ga4_sum($project_id, $nowFrom, $nowTo);
    return array(
        'before' => $before['days'] > 0 ? $before : null,
        'now' => $now['days'] > 0 ? $now : null,
        'beforeFrom' => $start,
        'beforeTo' => $beforeTo,
        'nowFrom' => $nowFrom,
        'nowTo' => $nowTo,
        'ga4Before' => $ga4Before['days'] > 0 ? $ga4Before : null,
        'ga4Now' => $ga4Now['days'] > 0 ? $ga4Now : null,
    );
}

function seosys300_ai_coach_context($project_id, $mb_id)
{
    if (function_exists('seosys300_ai_coach_context_full')) {
        return seosys300_ai_coach_context_full($project_id, $mb_id);
    }
    $project = seosys300_get_owned_project($project_id, $mb_id);
    if (!$project) {
        return null;
    }
    $summary = seosys300_metrics_summary($project_id, $mb_id, '30d');
    $queries = seosys300_metrics_queries($project_id, '30d');
    $pages = seosys300_metrics_pages($project_id, '30d');
    $acts = function_exists('seosys300_activity_list') ? seosys300_activity_list($project_id, 10) : array();
    $roadmap = function_exists('seosys300_roadmap_for_project') && seosys300_roadmap_tables_ready()
        ? seosys300_roadmap_for_project($project_id)
        : null;
    return array(
        'project' => array(
            'id' => (int) $project['id'],
            'name' => (string) $project['name'],
            'domain' => (string) $project['domain'],
        ),
        'roadmap' => $roadmap,
        'recentActivities' => $acts,
        'gscSummary' => array(
            'impressions' => $summary['impressions'],
            'clicks' => $summary['clicks'],
            'ctr' => $summary['ctr'],
            'avgPosition' => $summary['avgPosition'],
        ),
        'ga4Summary' => array(
            'organicSessions' => $summary['organicSessions'],
            'activeUsers' => $summary['activeUsers'],
            'definition' => seosys300_organic_traffic_definition(),
        ),
        'topQueries' => array_slice($queries, 0, 10),
        'topPages' => array_slice($pages, 0, 10),
        'opportunities' => seosys300_opportunity_rules($queries),
    );
}
