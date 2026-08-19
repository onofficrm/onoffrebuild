<?php
/**
 * DB-free Google metrics helpers and parsers (CLI unit tests).
 */

function seosys300_google_readonly_scopes()
{
    return array(
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/analytics.readonly',
    );
}

function seosys300_google_scope_allowed($scope)
{
    $scope = trim((string) $scope);
    return in_array($scope, seosys300_google_readonly_scopes(), true);
}

function seosys300_integration_providers()
{
    return array('GOOGLE_SEARCH_CONSOLE', 'GOOGLE_ANALYTICS');
}

function seosys300_provider_allowed($provider)
{
    return in_array(strtoupper(trim((string) $provider)), seosys300_integration_providers(), true);
}

function seosys300_oauth_state_create($bytes = 32)
{
    return bin2hex(random_bytes((int) $bytes));
}

function seosys300_oauth_state_matches($expected, $got)
{
    $expected = (string) $expected;
    $got = (string) $got;
    if ($expected === '' || $got === '') {
        return false;
    }
    return hash_equals($expected, $got);
}

function seosys300_redirect_path_allowed($path)
{
    $path = (string) $path;
    if ($path === '' || $path[0] !== '/') {
        return false;
    }
    if (preg_match('#^[a-z]+://#i', $path) || strpos($path, '//') === 0 || strpos($path, '\\') !== false) {
        return false;
    }
    if (strpos($path, '..') !== false) {
        return false;
    }
    return (bool) preg_match('#^/seo-system-300(/|$)#', $path);
}

function seosys300_normalize_host($value)
{
    $value = strtolower(trim((string) $value));
    $value = preg_replace('#^sc-domain:#', '', $value);
    if (preg_match('#^https?://#', $value)) {
        $host = parse_url($value, PHP_URL_HOST);
        $value = is_string($host) ? $host : $value;
    }
    $value = preg_replace('#^www\.#', '', $value);
    $value = preg_replace('#/.*$#', '', $value);
    return $value;
}

function seosys300_gsc_property_type($siteUrl)
{
    $siteUrl = trim((string) $siteUrl);
    if (stripos($siteUrl, 'sc-domain:') === 0) {
        return 'domain';
    }
    return 'url_prefix';
}

function seosys300_domain_mismatch($projectDomain, $gscProperty)
{
    $proj = seosys300_normalize_host($projectDomain);
    $prop = seosys300_normalize_host($gscProperty);
    if ($proj === '' || $prop === '') {
        return false;
    }
    if ($proj === $prop) {
        return false;
    }
    if (substr($proj, -strlen('.' . $prop)) === '.' . $prop) {
        return false;
    }
    if (substr($prop, -strlen('.' . $proj)) === '.' . $proj) {
        return false;
    }
    return true;
}

function seosys300_ga4_property_id_valid($raw)
{
    $raw = trim((string) $raw);
    if (preg_match('#^properties/(\d+)$#', $raw, $m)) {
        $raw = $m[1];
    }
    return preg_match('/^\d{1,20}$/', $raw) === 1 ? $raw : '';
}

function seosys300_ctr($clicks, $impressions)
{
    $impressions = (int) $impressions;
    if ($impressions < 1) {
        return 0.0;
    }
    return ((int) $clicks) / $impressions;
}

function seosys300_period_change_pct($current, $previous)
{
    $current = (float) $current;
    $previous = (float) $previous;
    if ($previous == 0.0) {
        return null;
    }
    return (($current - $previous) / $previous) * 100;
}

function seosys300_sync_cooldown_seconds()
{
    $raw = getenv('SEOSYS300_SYNC_COOLDOWN_SECONDS');
    $sec = $raw !== false && $raw !== '' ? (int) $raw : 900;
    if ($sec < 60) {
        $sec = 60;
    }
    if ($sec > 86400) {
        $sec = 86400;
    }
    return $sec;
}

function seosys300_sync_cooldown_ok($lastSuccessAt, $nowTs = null, $cooldown = null)
{
    if (!$lastSuccessAt) {
        return true;
    }
    $nowTs = $nowTs === null ? time() : (int) $nowTs;
    $cooldown = $cooldown === null ? seosys300_sync_cooldown_seconds() : (int) $cooldown;
    $last = is_numeric($lastSuccessAt) ? (int) $lastSuccessAt : strtotime((string) $lastSuccessAt);
    if ($last === false) {
        return true;
    }
    return ($nowTs - $last) >= $cooldown;
}

function seosys300_redact_secret($text)
{
    $text = (string) $text;
    $text = preg_replace('/Bearer\s+[A-Za-z0-9._\-~+\/=]+/i', 'Bearer [REDACTED]', $text);
    $text = preg_replace('/(access_token|refresh_token|client_secret|code)=([^&\s]+)/i', '$1=[REDACTED]', $text);
    $text = preg_replace('/"(access_token|refresh_token|client_secret|id_token)"\s*:\s*"[^"]*"/i', '"$1":"[REDACTED]"', $text);
    return $text;
}

function seosys300_gsc_parse_searchanalytics($json, $keyCount = 1)
{
    if (is_string($json)) {
        $json = json_decode($json, true);
    }
    if (!is_array($json)) {
        return array();
    }
    $rows = isset($json['rows']) && is_array($json['rows']) ? $json['rows'] : array();
    $out = array();
    foreach ($rows as $row) {
        $keys = isset($row['keys']) && is_array($row['keys']) ? $row['keys'] : array();
        $item = array(
            'clicks' => isset($row['clicks']) ? (int) $row['clicks'] : 0,
            'impressions' => isset($row['impressions']) ? (int) $row['impressions'] : 0,
            'ctr' => isset($row['ctr']) ? (float) $row['ctr'] : seosys300_ctr(isset($row['clicks']) ? $row['clicks'] : 0, isset($row['impressions']) ? $row['impressions'] : 0),
            'position' => isset($row['position']) ? (float) $row['position'] : 0,
            'keys' => $keys,
        );
        if ($keyCount >= 1) {
            $item['date'] = isset($keys[0]) ? (string) $keys[0] : '';
        }
        if ($keyCount >= 2) {
            $item['dim'] = isset($keys[1]) ? (string) $keys[1] : '';
        }
        $out[] = $item;
    }
    return $out;
}

function seosys300_gsc_parse_sites($json)
{
    if (is_string($json)) {
        $json = json_decode($json, true);
    }
    if (!is_array($json)) {
        return array();
    }
    $entries = isset($json['siteEntry']) && is_array($json['siteEntry']) ? $json['siteEntry'] : array();
    $out = array();
    foreach ($entries as $row) {
        $url = isset($row['siteUrl']) ? (string) $row['siteUrl'] : '';
        if ($url === '') {
            continue;
        }
        $out[] = array(
            'siteUrl' => $url,
            'permissionLevel' => isset($row['permissionLevel']) ? (string) $row['permissionLevel'] : '',
        );
    }
    return $out;
}

function seosys300_ga4_parse_runreport($json)
{
    if (is_string($json)) {
        $json = json_decode($json, true);
    }
    if (!is_array($json)) {
        return array();
    }
    $dimHeaders = array();
    if (!empty($json['dimensionHeaders']) && is_array($json['dimensionHeaders'])) {
        foreach ($json['dimensionHeaders'] as $h) {
            $dimHeaders[] = isset($h['name']) ? (string) $h['name'] : '';
        }
    }
    $metHeaders = array();
    if (!empty($json['metricHeaders']) && is_array($json['metricHeaders'])) {
        foreach ($json['metricHeaders'] as $h) {
            $metHeaders[] = isset($h['name']) ? (string) $h['name'] : '';
        }
    }
    $rows = isset($json['rows']) && is_array($json['rows']) ? $json['rows'] : array();
    $out = array();
    foreach ($rows as $row) {
        $item = array();
        $dims = isset($row['dimensionValues']) && is_array($row['dimensionValues']) ? $row['dimensionValues'] : array();
        foreach ($dims as $i => $d) {
            $name = isset($dimHeaders[$i]) ? $dimHeaders[$i] : ('dim' . $i);
            $item[$name] = isset($d['value']) ? (string) $d['value'] : '';
        }
        $mets = isset($row['metricValues']) && is_array($row['metricValues']) ? $row['metricValues'] : array();
        foreach ($mets as $i => $m) {
            $name = isset($metHeaders[$i]) ? $metHeaders[$i] : ('met' . $i);
            $item[$name] = isset($m['value']) ? (string) $m['value'] : '0';
        }
        if (isset($item['date']) && preg_match('/^\d{8}$/', $item['date'])) {
            $item['metric_date'] = substr($item['date'], 0, 4) . '-' . substr($item['date'], 4, 2) . '-' . substr($item['date'], 6, 2);
        }
        $out[] = $item;
    }
    return $out;
}

function seosys300_ga4_parse_account_summaries($json)
{
    if (is_string($json)) {
        $json = json_decode($json, true);
    }
    if (!is_array($json)) {
        return array();
    }
    $accounts = isset($json['accountSummaries']) && is_array($json['accountSummaries']) ? $json['accountSummaries'] : array();
    $out = array();
    foreach ($accounts as $acc) {
        $accountName = isset($acc['displayName']) ? (string) $acc['displayName'] : '';
        $props = isset($acc['propertySummaries']) && is_array($acc['propertySummaries']) ? $acc['propertySummaries'] : array();
        foreach ($props as $p) {
            $resource = isset($p['property']) ? (string) $p['property'] : '';
            $id = seosys300_ga4_property_id_valid($resource);
            if ($id === '') {
                continue;
            }
            $out[] = array(
                'propertyId' => $id,
                'displayName' => isset($p['displayName']) ? (string) $p['displayName'] : '',
                'accountName' => $accountName,
            );
        }
    }
    return $out;
}

function seosys300_opportunity_thresholds()
{
    return array(
        'high_impressions' => 100,
        'low_ctr' => 0.02,
        'near_top_min' => 8,
        'near_top_max' => 20,
        'decline_ratio' => 0.3,
    );
}

function seosys300_opportunity_rules($queries, $thresholds = null)
{
    $t = $thresholds ? $thresholds : seosys300_opportunity_thresholds();
    $out = array();
    foreach ((array) $queries as $q) {
        $imp = isset($q['impressions']) ? (int) $q['impressions'] : 0;
        $ctr = isset($q['ctr']) ? (float) $q['ctr'] : 0;
        $pos = isset($q['position']) ? (float) $q['position'] : 0;
        $clicks = isset($q['clicks']) ? (int) $q['clicks'] : 0;
        $prevClicks = isset($q['previousClicks']) ? (int) $q['previousClicks'] : null;
        $query = isset($q['query']) ? (string) $q['query'] : '';
        if ($imp >= (int) $t['high_impressions'] && $ctr < (float) $t['low_ctr']) {
            $out[] = array(
                'rule' => 'high_impression_low_ctr',
                'query' => $query,
                'reason' => '노출은 높고 CTR이 낮습니다.',
            );
        }
        if ($pos > (float) $t['near_top_min'] && $pos <= (float) $t['near_top_max']) {
            $out[] = array(
                'rule' => 'near_top',
                'query' => $query,
                'reason' => '10위권 근접 검색어입니다.',
            );
        }
        if ($prevClicks !== null && $prevClicks > 0 && $clicks < $prevClicks * (1 - (float) $t['decline_ratio'])) {
            $out[] = array(
                'rule' => 'declining',
                'query' => $query,
                'reason' => '이전 기간 대비 클릭이 감소했습니다.',
            );
        }
    }
    return $out;
}

function seosys300_organic_traffic_definition()
{
    return array(
        'key' => 'organic_sessions',
        'ga4Metric' => 'sessions',
        'ga4Dimension' => 'sessionDefaultChannelGroup',
        'ga4DimensionValue' => 'Organic Search',
        'labelKo' => '자연검색 방문',
        'labelEn' => 'Organic Sessions',
        'note' => 'GA4 sessions where sessionDefaultChannelGroup is Organic Search. Not mixed with activeUsers.',
    );
}
