<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_gsc_list_sites($mb_id)
{
    $headers = seosys300_google_auth_header($mb_id);
    if (!$headers) {
        seosys300_json_error(409, 'GOOGLE_NOT_CONNECTED', 'Google 연결이 필요합니다.');
    }
    $res = seosys300_http_json('GET', 'https://www.googleapis.com/webmasters/v3/sites', array(
        'headers' => $headers,
    ));
    if ($res['status'] === 401) {
        seosys300_google_mark_reauth($mb_id);
        seosys300_json_error(409, 'REAUTH_REQUIRED', 'Google 연결을 다시 인증해주세요.');
    }
    if ($res['status'] < 200 || $res['status'] >= 300) {
        seosys300_log('gsc sites.list failed status=' . $res['status']);
        seosys300_json_error(502, 'GSC_SYNC_FAILED', 'Search Console 사이트 목록을 불러오지 못했습니다.');
    }
    return seosys300_gsc_parse_sites($res['json']);
}

function seosys300_gsc_query($mb_id, $siteUrl, $payload)
{
    $headers = seosys300_google_auth_header($mb_id);
    if (!$headers) {
        return array('ok' => false, 'code' => 'GOOGLE_NOT_CONNECTED');
    }
    $headers['Content-Type'] = 'application/json';
    $enc = rawurlencode($siteUrl);
    $res = seosys300_http_json('POST', 'https://www.googleapis.com/webmasters/v3/sites/' . $enc . '/searchAnalytics/query', array(
        'headers' => $headers,
        'body' => json_encode($payload),
    ));
    if ($res['status'] === 401) {
        seosys300_google_mark_reauth($mb_id);
        return array('ok' => false, 'code' => 'REAUTH_REQUIRED');
    }
    if ($res['status'] === 429) {
        return array('ok' => false, 'code' => 'QUOTA_LIMITED');
    }
    if ($res['status'] < 200 || $res['status'] >= 300) {
        seosys300_log('gsc searchanalytics failed status=' . $res['status']);
        return array('ok' => false, 'code' => 'GSC_SYNC_FAILED');
    }
    return array('ok' => true, 'json' => $res['json']);
}
