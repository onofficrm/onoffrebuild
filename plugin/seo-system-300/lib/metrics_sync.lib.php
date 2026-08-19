<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_sync_user_message($code)
{
    $map = array(
        'GOOGLE_NOT_CONFIGURED' => 'Google API 설정이 필요합니다.',
        'GOOGLE_NOT_CONNECTED' => 'Google 계정을 연결해주세요.',
        'TOKEN_EXPIRED' => 'Google 연결을 다시 인증해주세요.',
        'REAUTH_REQUIRED' => 'Google 연결을 다시 인증해주세요.',
        'GSC_PROPERTY_NOT_SELECTED' => 'Search Console 속성을 선택해주세요.',
        'GA4_PROPERTY_NOT_SELECTED' => 'GA4 속성을 선택해주세요.',
        'GSC_SYNC_FAILED' => 'Search Console 동기화에 실패했습니다.',
        'GA4_SYNC_FAILED' => 'GA4 동기화에 실패했습니다.',
        'QUOTA_LIMITED' => '요청이 많아 잠시 후 다시 시도해주세요.',
        'SYNC_RUNNING' => '이미 동기화가 진행 중입니다.',
        'SYNC_COOLDOWN' => '최근에 동기화했습니다. 잠시 후 다시 시도해주세요.',
        'tables_missing' => 'SEO 성과 저장 기능이 아직 준비되지 않았습니다.',
    );
    return isset($map[$code]) ? $map[$code] : '요청을 처리할 수 없습니다.';
}

function seosys300_upsert_gsc_daily($project_id, $date, $clicks, $impressions, $ctr, $position)
{
    global $g5;
    $now = seosys300_now();
    $pid = (int) $project_id;
    $date = seosys300_esc($date);
    $table = $g5['seosys300_gsc_daily_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = {$pid},
        metric_date = '{$date}',
        clicks = " . (int) $clicks . ",
        impressions = " . (int) $impressions . ",
        ctr = " . (float) $ctr . ",
        position = " . (float) $position . ",
        created_at = '{$now}',
        updated_at = '{$now}'
        ON DUPLICATE KEY UPDATE
        clicks = VALUES(clicks),
        impressions = VALUES(impressions),
        ctr = VALUES(ctr),
        position = VALUES(position),
        updated_at = '{$now}'");
}

function seosys300_upsert_gsc_query_row($project_id, $date, $query, $clicks, $impressions, $ctr, $position)
{
    global $g5;
    $now = seosys300_now();
    $query = substr((string) $query, 0, 191);
    $table = $g5['seosys300_gsc_queries_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        metric_date = '" . seosys300_esc($date) . "',
        query = '" . seosys300_esc($query) . "',
        clicks = " . (int) $clicks . ",
        impressions = " . (int) $impressions . ",
        ctr = " . (float) $ctr . ",
        position = " . (float) $position . ",
        created_at = '{$now}',
        updated_at = '{$now}'
        ON DUPLICATE KEY UPDATE
        clicks = VALUES(clicks),
        impressions = VALUES(impressions),
        ctr = VALUES(ctr),
        position = VALUES(position),
        updated_at = '{$now}'");
}

function seosys300_upsert_gsc_page_row($project_id, $date, $page, $clicks, $impressions, $ctr, $position)
{
    global $g5;
    $now = seosys300_now();
    $page = substr((string) $page, 0, 255);
    $table = $g5['seosys300_gsc_pages_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        metric_date = '" . seosys300_esc($date) . "',
        page = '" . seosys300_esc($page) . "',
        clicks = " . (int) $clicks . ",
        impressions = " . (int) $impressions . ",
        ctr = " . (float) $ctr . ",
        position = " . (float) $position . ",
        created_at = '{$now}',
        updated_at = '{$now}'
        ON DUPLICATE KEY UPDATE
        clicks = VALUES(clicks),
        impressions = VALUES(impressions),
        ctr = VALUES(ctr),
        position = VALUES(position),
        updated_at = '{$now}'");
}

function seosys300_upsert_ga4_daily($project_id, $date, $row)
{
    global $g5;
    $now = seosys300_now();
    $table = $g5['seosys300_ga4_daily_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        metric_date = '" . seosys300_esc($date) . "',
        active_users = " . (int) $row['active_users'] . ",
        sessions = " . (int) $row['sessions'] . ",
        organic_sessions = " . (int) $row['organic_sessions'] . ",
        engaged_sessions = " . (int) $row['engaged_sessions'] . ",
        page_views = " . (int) $row['page_views'] . ",
        engagement_rate = " . (float) $row['engagement_rate'] . ",
        created_at = '{$now}',
        updated_at = '{$now}'
        ON DUPLICATE KEY UPDATE
        active_users = VALUES(active_users),
        sessions = VALUES(sessions),
        organic_sessions = VALUES(organic_sessions),
        engaged_sessions = VALUES(engaged_sessions),
        page_views = VALUES(page_views),
        engagement_rate = VALUES(engagement_rate),
        updated_at = '{$now}'");
}

function seosys300_sync_begin($project_id, $provider, $sync_type, $from, $to)
{
    global $g5;
    $now = seosys300_now();
    $stale = date('Y-m-d H:i:s', time() - 600);
    seosys300_query("UPDATE `{$g5['seosys300_sync_runs_table']}` SET
        status = 'failed',
        error_code = 'SYNC_STALE',
        error_message = 'expired running lock',
        finished_at = '{$now}'
        WHERE project_id = " . (int) $project_id . "
          AND provider = '" . seosys300_esc($provider) . "'
          AND status = 'running'
          AND started_at < '{$stale}'");
    $running = seosys300_fetch("SELECT id FROM `{$g5['seosys300_sync_runs_table']}`
        WHERE project_id = " . (int) $project_id . "
          AND provider = '" . seosys300_esc($provider) . "'
          AND status = 'running' LIMIT 1");
    if ($running) {
        return 0;
    }
    seosys300_query("INSERT INTO `{$g5['seosys300_sync_runs_table']}` SET
        project_id = " . (int) $project_id . ",
        provider = '" . seosys300_esc($provider) . "',
        sync_type = '" . seosys300_esc($sync_type) . "',
        date_from = '" . seosys300_esc($from) . "',
        date_to = '" . seosys300_esc($to) . "',
        status = 'running',
        started_at = '{$now}',
        created_at = '{$now}'");
    return (int) sql_insert_id();
}

function seosys300_sync_finish($run_id, $status, $rows, $code = '', $message = '')
{
    global $g5;
    $now = seosys300_now();
    seosys300_query("UPDATE `{$g5['seosys300_sync_runs_table']}` SET
        status = '" . seosys300_esc($status) . "',
        rows_received = " . (int) $rows . ",
        finished_at = '{$now}',
        error_code = '" . seosys300_esc($code) . "',
        error_message = '" . seosys300_esc(substr($message, 0, 255)) . "'
        WHERE id = " . (int) $run_id);
}

function seosys300_sync_gsc($project_id, $mb_id, $sync_type = 'manual', $days = 90, $force = false)
{
    $integ = seosys300_integration_get($project_id, 'GOOGLE_SEARCH_CONSOLE');
    if (!$integ || (string) $integ['status'] !== 'active' || (string) $integ['external_property_id'] === '') {
        return array('ok' => false, 'code' => 'GSC_PROPERTY_NOT_SELECTED');
    }
    if (!$force && !seosys300_sync_cooldown_ok($integ['last_success_at'])) {
        return array('ok' => false, 'code' => 'SYNC_COOLDOWN');
    }
    $to = date('Y-m-d', strtotime('-1 day'));
    $from = date('Y-m-d', strtotime('-' . (int) $days . ' day'));
    $run = seosys300_sync_begin($project_id, 'GOOGLE_SEARCH_CONSOLE', $sync_type, $from, $to);
    if ($run < 1) {
        return array('ok' => false, 'code' => 'SYNC_RUNNING');
    }
    $site = (string) $integ['external_property_id'];
    $rowsN = 0;
    $daily = seosys300_gsc_query($mb_id, $site, array(
        'startDate' => $from,
        'endDate' => $to,
        'dimensions' => array('date'),
        'rowLimit' => 500,
    ));
    if (empty($daily['ok'])) {
        seosys300_sync_finish($run, 'failed', 0, $daily['code'], '');
        seosys300_integration_error($integ['id'], $daily['code']);
        return array('ok' => false, 'code' => $daily['code']);
    }
    foreach (seosys300_gsc_parse_searchanalytics($daily['json'], 1) as $row) {
        if ($row['date'] === '') {
            continue;
        }
        seosys300_upsert_gsc_daily($project_id, $row['date'], $row['clicks'], $row['impressions'], $row['ctr'], $row['position']);
        $rowsN++;
    }
    $qFrom = date('Y-m-d', strtotime('-28 day'));
    $queries = seosys300_gsc_query($mb_id, $site, array(
        'startDate' => $qFrom,
        'endDate' => $to,
        'dimensions' => array('date', 'query'),
        'rowLimit' => 2500,
    ));
    if (!empty($queries['ok'])) {
        foreach (seosys300_gsc_parse_searchanalytics($queries['json'], 2) as $row) {
            if ($row['date'] === '' || $row['dim'] === '') {
                continue;
            }
            seosys300_upsert_gsc_query_row($project_id, $row['date'], $row['dim'], $row['clicks'], $row['impressions'], $row['ctr'], $row['position']);
            $rowsN++;
        }
    }
    $pages = seosys300_gsc_query($mb_id, $site, array(
        'startDate' => $qFrom,
        'endDate' => $to,
        'dimensions' => array('date', 'page'),
        'rowLimit' => 2500,
    ));
    if (!empty($pages['ok'])) {
        foreach (seosys300_gsc_parse_searchanalytics($pages['json'], 2) as $row) {
            if ($row['date'] === '' || $row['dim'] === '') {
                continue;
            }
            seosys300_upsert_gsc_page_row($project_id, $row['date'], $row['dim'], $row['clicks'], $row['impressions'], $row['ctr'], $row['position']);
            $rowsN++;
        }
    }
    $partial = empty($queries['ok']) || empty($pages['ok']);
    $status = $partial ? 'partial' : 'success';
    seosys300_sync_finish($run, $status, $rowsN);
    seosys300_integration_touch($integ['id'], $status === 'success');
    seosys300_log_activity($project_id, 'GSC_SYNC_COMPLETED', 'Search Console 데이터를 동기화했습니다.', array(
        'entity_type' => 'integration',
        'entity_id' => (int) $integ['id'],
    ));
    return array('ok' => true, 'rows' => $rowsN, 'status' => $status);
}

function seosys300_sync_ga4($project_id, $mb_id, $sync_type = 'manual', $days = 90, $force = false)
{
    $integ = seosys300_integration_get($project_id, 'GOOGLE_ANALYTICS');
    if (!$integ || (string) $integ['status'] !== 'active' || (string) $integ['external_property_id'] === '') {
        return array('ok' => false, 'code' => 'GA4_PROPERTY_NOT_SELECTED');
    }
    if (!$force && !seosys300_sync_cooldown_ok($integ['last_success_at'])) {
        return array('ok' => false, 'code' => 'SYNC_COOLDOWN');
    }
    $to = date('Y-m-d', strtotime('-1 day'));
    $from = date('Y-m-d', strtotime('-' . (int) $days . ' day'));
    $run = seosys300_sync_begin($project_id, 'GOOGLE_ANALYTICS', $sync_type, $from, $to);
    if ($run < 1) {
        return array('ok' => false, 'code' => 'SYNC_RUNNING');
    }
    $pid = $integ['external_property_id'];
    $core = seosys300_ga4_run_report($mb_id, $pid, array(
        'dateRanges' => array(array('startDate' => $from, 'endDate' => $to)),
        'dimensions' => array(array('name' => 'date')),
        'metrics' => array(
            array('name' => 'activeUsers'),
            array('name' => 'sessions'),
            array('name' => 'engagedSessions'),
            array('name' => 'screenPageViews'),
            array('name' => 'engagementRate'),
        ),
        'limit' => 400,
    ));
    if (empty($core['ok'])) {
        seosys300_sync_finish($run, 'failed', 0, $core['code'], '');
        seosys300_integration_error($integ['id'], $core['code']);
        return array('ok' => false, 'code' => $core['code']);
    }
    $byDate = array();
    foreach (seosys300_ga4_parse_runreport($core['json']) as $row) {
        $d = isset($row['metric_date']) ? $row['metric_date'] : '';
        if ($d === '') {
            continue;
        }
        $byDate[$d] = array(
            'active_users' => isset($row['activeUsers']) ? (int) $row['activeUsers'] : 0,
            'sessions' => isset($row['sessions']) ? (int) $row['sessions'] : 0,
            'organic_sessions' => 0,
            'engaged_sessions' => isset($row['engagedSessions']) ? (int) $row['engagedSessions'] : 0,
            'page_views' => isset($row['screenPageViews']) ? (int) $row['screenPageViews'] : 0,
            'engagement_rate' => isset($row['engagementRate']) ? (float) $row['engagementRate'] : 0,
        );
    }
    $org = seosys300_ga4_run_report($mb_id, $pid, array(
        'dateRanges' => array(array('startDate' => $from, 'endDate' => $to)),
        'dimensions' => array(array('name' => 'date')),
        'metrics' => array(array('name' => 'sessions')),
        'dimensionFilter' => array(
            'filter' => array(
                'fieldName' => 'sessionDefaultChannelGroup',
                'stringFilter' => array(
                    'matchType' => 'EXACT',
                    'value' => 'Organic Search',
                ),
            ),
        ),
        'limit' => 400,
    ));
    $partial = empty($org['ok']);
    if (!empty($org['ok'])) {
        foreach (seosys300_ga4_parse_runreport($org['json']) as $row) {
            $d = isset($row['metric_date']) ? $row['metric_date'] : '';
            if ($d === '') {
                continue;
            }
            if (!isset($byDate[$d])) {
                $byDate[$d] = array(
                    'active_users' => 0,
                    'sessions' => 0,
                    'organic_sessions' => 0,
                    'engaged_sessions' => 0,
                    'page_views' => 0,
                    'engagement_rate' => 0,
                );
            }
            $byDate[$d]['organic_sessions'] = isset($row['sessions']) ? (int) $row['sessions'] : 0;
        }
    }
    $n = 0;
    foreach ($byDate as $date => $vals) {
        seosys300_upsert_ga4_daily($project_id, $date, $vals);
        $n++;
    }
    $status = $partial ? 'partial' : 'success';
    seosys300_sync_finish($run, $status, $n);
    seosys300_integration_touch($integ['id'], $status === 'success');
    seosys300_log_activity($project_id, 'GA4_SYNC_COMPLETED', 'GA4 데이터를 동기화했습니다.', array(
        'entity_type' => 'integration',
        'entity_id' => (int) $integ['id'],
    ));
    return array('ok' => true, 'rows' => $n, 'status' => $status);
}

function seosys300_integration_touch($id, $ok)
{
    global $g5;
    $now = seosys300_now();
    $success = $ok ? ", last_success_at = '{$now}', last_error_code = '', last_error_message = ''" : '';
    seosys300_query("UPDATE `{$g5['seosys300_project_integrations_table']}` SET
        last_sync_at = '{$now}' {$success},
        updated_at = '{$now}'
        WHERE id = " . (int) $id);
}

function seosys300_integration_error($id, $code)
{
    global $g5;
    $now = seosys300_now();
    seosys300_query("UPDATE `{$g5['seosys300_project_integrations_table']}` SET
        last_sync_at = '{$now}',
        last_error_code = '" . seosys300_esc($code) . "',
        last_error_message = '" . seosys300_esc(seosys300_sync_user_message($code)) . "',
        updated_at = '{$now}'
        WHERE id = " . (int) $id);
}
