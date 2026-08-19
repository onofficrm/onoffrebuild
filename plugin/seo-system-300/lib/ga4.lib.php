<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_ga4_list_properties($mb_id)
{
    $headers = seosys300_google_auth_header($mb_id);
    if (!$headers) {
        seosys300_json_error(409, 'GOOGLE_NOT_CONNECTED', 'Google 연결이 필요합니다.');
    }
    $out = array();
    $pageToken = '';
    for ($i = 0; $i < 5; $i++) {
        $url = 'https://analyticsadmin.googleapis.com/v1beta/accountSummaries?pageSize=200';
        if ($pageToken !== '') {
            $url .= '&pageToken=' . rawurlencode($pageToken);
        }
        $res = seosys300_http_json('GET', $url, array('headers' => $headers));
        if ($res['status'] === 401) {
            seosys300_google_mark_reauth($mb_id);
            seosys300_json_error(409, 'REAUTH_REQUIRED', 'Google 연결을 다시 인증해주세요.');
        }
        if ($res['status'] < 200 || $res['status'] >= 300) {
            seosys300_log('ga4 accountSummaries failed status=' . $res['status']);
            seosys300_json_error(502, 'GA4_SYNC_FAILED', 'GA4 속성 목록을 불러오지 못했습니다.');
        }
        $chunk = seosys300_ga4_parse_account_summaries($res['json']);
        $out = array_merge($out, $chunk);
        $pageToken = isset($res['json']['nextPageToken']) ? (string) $res['json']['nextPageToken'] : '';
        if ($pageToken === '') {
            break;
        }
    }
    return $out;
}

function seosys300_ga4_run_report($mb_id, $propertyId, $payload)
{
    $headers = seosys300_google_auth_header($mb_id);
    if (!$headers) {
        return array('ok' => false, 'code' => 'GOOGLE_NOT_CONNECTED');
    }
    $headers['Content-Type'] = 'application/json';
    $pid = seosys300_ga4_property_id_valid($propertyId);
    if ($pid === '') {
        return array('ok' => false, 'code' => 'GA4_PROPERTY_NOT_SELECTED');
    }
    $url = 'https://analyticsdata.googleapis.com/v1beta/properties/' . $pid . ':runReport';
    $res = seosys300_http_json('POST', $url, array(
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
        seosys300_log('ga4 runReport failed status=' . $res['status']);
        return array('ok' => false, 'code' => 'GA4_SYNC_FAILED');
    }
    return array('ok' => true, 'json' => $res['json']);
}
