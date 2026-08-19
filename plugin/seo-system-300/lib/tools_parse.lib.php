<?php
/**
 * DB-free SEO tool registry helpers, parsers, health/milestones, AI validation.
 */

function seosys300_tool_keys()
{
    return array('catchdomain', 'content', 'backlink', 'traffic');
}

function seosys300_tool_key_allowed($key)
{
    return in_array(strtolower(trim((string) $key)), seosys300_tool_keys(), true);
}

function seosys300_integration_levels()
{
    return array('NOT_CONFIGURED', 'LINK_ONLY', 'CONTEXT_LINK', 'READ_ONLY', 'TWO_WAY', 'AUTOMATED');
}

function seosys300_integration_level_allowed($level)
{
    return in_array(strtoupper(trim((string) $level)), seosys300_integration_levels(), true);
}

function seosys300_sync_providers_extended()
{
    return array(
        'GOOGLE_SEARCH_CONSOLE',
        'GOOGLE_ANALYTICS',
        'CATCHDOMAIN',
        'CONTENT',
        'BACKLINK',
        'TRAFFIC',
        'AI',
    );
}

function seosys300_sync_provider_allowed($provider)
{
    return in_array(strtoupper(trim((string) $provider)), seosys300_sync_providers_extended(), true);
}

function seosys300_tool_to_sync_provider($tool_key)
{
    $map = array(
        'catchdomain' => 'CATCHDOMAIN',
        'content' => 'CONTENT',
        'backlink' => 'BACKLINK',
        'traffic' => 'TRAFFIC',
    );
    $key = strtolower((string) $tool_key);
    return isset($map[$key]) ? $map[$key] : '';
}

function seosys300_safe_https_url($url)
{
    $url = trim((string) $url);
    if ($url === '' || !preg_match('#^https://[a-zA-Z0-9.-]+(?::[0-9]+)?(?:/.*)?$#', $url)) {
        return '';
    }
    if (preg_match('#^(javascript|data|file):#i', $url)) {
        return '';
    }
    return $url;
}

function seosys300_tool_url_matches_config($candidate, $configured)
{
    $candidate = seosys300_safe_https_url($candidate);
    $configured = seosys300_safe_https_url($configured);
    return $candidate !== '' && $configured !== '' && $candidate === $configured;
}

function seosys300_stale_after_seconds()
{
    return 7 * 86400;
}

function seosys300_is_stale($last_success_at, $now = null)
{
    if ($last_success_at === null || $last_success_at === '') {
        return false;
    }
    $now = $now ? (int) $now : time();
    $ts = strtotime((string) $last_success_at);
    if ($ts === false) {
        return false;
    }
    return ($now - $ts) > seosys300_stale_after_seconds();
}

function seosys300_content_parse_items($raw)
{
    if (is_string($raw)) {
        $raw = json_decode($raw, true);
    }
    $items = array();
    $list = array();
    if (isset($raw['items']) && is_array($raw['items'])) {
        $list = $raw['items'];
    } elseif (is_array($raw) && isset($raw[0])) {
        $list = $raw;
    }
    foreach ($list as $row) {
        if (!is_array($row)) {
            continue;
        }
        $status = strtolower((string) (isset($row['status']) ? $row['status'] : ''));
        $items[] = array(
            'content_id' => isset($row['content_id']) ? (string) $row['content_id'] : (isset($row['id']) ? (string) $row['id'] : ''),
            'external_id' => isset($row['external_id']) ? (string) $row['external_id'] : (isset($row['id']) ? (string) $row['id'] : ''),
            'title' => isset($row['title']) ? (string) $row['title'] : '',
            'url' => isset($row['url']) ? (string) $row['url'] : '',
            'keyword' => isset($row['keyword']) ? (string) $row['keyword'] : (isset($row['targetKeyword']) ? (string) $row['targetKeyword'] : ''),
            'status' => $status,
            'published_at' => isset($row['published_at']) ? (string) $row['published_at'] : (isset($row['publishedAt']) ? (string) $row['publishedAt'] : ''),
            'source' => isset($row['source']) ? (string) $row['source'] : 'external',
        );
    }
    return $items;
}

function seosys300_content_counts($items)
{
    $published = 0;
    $draft = 0;
    $last = '';
    foreach ($items as $it) {
        $st = (string) $it['status'];
        if ($st === 'published') {
            $published++;
            if ((string) $it['published_at'] > $last) {
                $last = (string) $it['published_at'];
            }
        } elseif ($st === 'draft' || $st === 'review') {
            $draft++;
        }
    }
    return array(
        'publishedCount' => $published,
        'draftCount' => $draft,
        'totalCount' => count($items),
        'lastPublishedAt' => $last !== '' ? $last : null,
    );
}

function seosys300_backlink_parse_summary($raw)
{
    if (is_string($raw)) {
        $raw = json_decode($raw, true);
    }
    if (!is_array($raw)) {
        $raw = array();
    }
    $rd = isset($raw['referringDomains']) ? $raw['referringDomains'] : (isset($raw['referring_domains']) ? $raw['referring_domains'] : null);
    $bl = isset($raw['backlinks']) ? $raw['backlinks'] : (isset($raw['totalBacklinks']) ? $raw['totalBacklinks'] : null);
    $nw = isset($raw['newBacklinks']) ? $raw['newBacklinks'] : (isset($raw['new']) ? $raw['new'] : null);
    $lost = isset($raw['lostBacklinks']) ? $raw['lostBacklinks'] : (isset($raw['lost']) ? $raw['lost'] : null);
    return array(
        'referringDomains' => $rd === null || $rd === '' ? null : (int) $rd,
        'backlinks' => $bl === null || $bl === '' ? null : (int) $bl,
        'newBacklinks' => $nw === null || $nw === '' ? null : (int) $nw,
        'lostBacklinks' => $lost === null || $lost === '' ? null : (int) $lost,
        'source' => isset($raw['source']) ? (string) $raw['source'] : 'external',
    );
}

function seosys300_traffic_parse_campaigns($raw)
{
    if (is_string($raw)) {
        $raw = json_decode($raw, true);
    }
    $list = array();
    if (isset($raw['campaigns']) && is_array($raw['campaigns'])) {
        $list = $raw['campaigns'];
    } elseif (is_array($raw) && isset($raw[0])) {
        $list = $raw;
    }
    $out = array();
    $delivered = 0;
    foreach ($list as $row) {
        if (!is_array($row)) {
            continue;
        }
        $d = isset($row['delivered_visits']) ? (int) $row['delivered_visits'] : (isset($row['deliveredVisits']) ? (int) $row['deliveredVisits'] : 0);
        $delivered += $d;
        $out[] = array(
            'campaign_id' => isset($row['campaign_id']) ? (string) $row['campaign_id'] : (isset($row['id']) ? (string) $row['id'] : ''),
            'target_url' => isset($row['target_url']) ? (string) $row['target_url'] : (isset($row['targetUrl']) ? (string) $row['targetUrl'] : ''),
            'keyword' => isset($row['keyword']) ? (string) $row['keyword'] : '',
            'planned_visits' => isset($row['planned_visits']) ? (int) $row['planned_visits'] : (isset($row['plannedVisits']) ? (int) $row['plannedVisits'] : 0),
            'delivered_visits' => $d,
            'status' => isset($row['status']) ? (string) $row['status'] : '',
            'start_date' => isset($row['start_date']) ? (string) $row['start_date'] : '',
            'end_date' => isset($row['end_date']) ? (string) $row['end_date'] : '',
        );
    }
    return array('campaigns' => $out, 'deliveredVisits' => $delivered);
}

function seosys300_catchdomain_parse_summary($raw)
{
    if (is_string($raw)) {
        $raw = json_decode($raw, true);
    }
    if (!is_array($raw)) {
        $raw = array();
    }
    $selected = isset($raw['selectedDomain']) ? trim((string) $raw['selectedDomain']) : (isset($raw['selected_domain']) ? trim((string) $raw['selected_domain']) : '');
    $cand = isset($raw['candidateCount']) ? $raw['candidateCount'] : (isset($raw['candidates']) ? $raw['candidates'] : null);
    return array(
        'candidateCount' => $cand === null || $cand === '' ? null : (int) $cand,
        'savedCount' => isset($raw['savedCount']) ? (int) $raw['savedCount'] : null,
        'selectedDomain' => $selected !== '' ? $selected : null,
        'analyzedAt' => isset($raw['analyzedAt']) ? (string) $raw['analyzedAt'] : (isset($raw['analyzed_at']) ? (string) $raw['analyzed_at'] : null),
        'source' => isset($raw['source']) ? (string) $raw['source'] : 'manual',
    );
}

function seosys300_manual_tool_payload_normalize($tool_key, $input)
{
    $key = strtolower((string) $tool_key);
    $input = is_array($input) ? $input : array();
    $base = array('source' => 'manual');
    if ($key === 'catchdomain') {
        return array_merge($base, seosys300_catchdomain_parse_summary($input));
    }
    if ($key === 'content') {
        $items = array();
        if (isset($input['items'])) {
            $items = seosys300_content_parse_items($input);
        }
        $counts = seosys300_content_counts($items);
        $pub = isset($input['publishedCount']) ? (int) $input['publishedCount'] : $counts['publishedCount'];
        return array_merge($base, $counts, array(
            'publishedCount' => $pub,
            'url' => isset($input['url']) ? (string) $input['url'] : '',
            'keyword' => isset($input['keyword']) ? (string) $input['keyword'] : '',
            'items' => $items,
        ));
    }
    if ($key === 'backlink') {
        return array_merge($base, seosys300_backlink_parse_summary($input));
    }
    if ($key === 'traffic') {
        $parsed = seosys300_traffic_parse_campaigns($input);
        $delivered = isset($input['deliveredVisits']) ? (int) $input['deliveredVisits'] : $parsed['deliveredVisits'];
        return array_merge($base, $parsed, array('deliveredVisits' => $delivered));
    }
    return $base;
}

function seosys300_ai_pii_keys()
{
    return array(
        'email', 'mb_id', 'mbId', 'phone', 'tel', 'address', 'hp', 'memo',
        'adminNote', 'admin_note', 'access_token', 'refresh_token', 'client_secret',
        'authorization', 'apiKey', 'api_key', 'googleEmail', 'google_email',
        'cookie', 'cookies', 'session', 'csrf', 'password', 'passwd',
    );
}

function seosys300_ai_strip_pii($value)
{
    $keys = seosys300_ai_pii_keys();
    if (is_array($value)) {
        $out = array();
        foreach ($value as $k => $v) {
            $lk = strtolower((string) $k);
            $drop = false;
            foreach ($keys as $pk) {
                if ($lk === strtolower($pk) || strpos($lk, 'token') !== false || strpos($lk, 'secret') !== false) {
                    $drop = true;
                    break;
                }
            }
            if ($drop) {
                continue;
            }
            $out[$k] = seosys300_ai_strip_pii($v);
        }
        return $out;
    }
    if (is_string($value) && preg_match('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', $value)) {
        return preg_replace('/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i', '[redacted]', $value);
    }
    return $value;
}

function seosys300_ai_validate_response($raw)
{
    if (is_string($raw)) {
        $raw = json_decode($raw, true);
    }
    if (!is_array($raw)) {
        return array('ok' => false, 'code' => 'invalid_json');
    }
    $healthIn = isset($raw['health']) && is_array($raw['health']) ? $raw['health'] : array();
    $health = array();
    foreach (array('overall', 'technical', 'content', 'backlink', 'traffic') as $k) {
        $v = isset($healthIn[$k]) ? $healthIn[$k] : null;
        $health[$k] = ($v === null || $v === '') ? null : max(0, min(100, (int) $v));
    }
    $actions = array();
    if (isset($raw['actions']) && is_array($raw['actions'])) {
        foreach (array_slice($raw['actions'], 0, 5) as $a) {
            if (!is_array($a)) {
                continue;
            }
            $prio = strtoupper((string) (isset($a['priority']) ? $a['priority'] : 'MEDIUM'));
            if (!in_array($prio, array('HIGH', 'MEDIUM', 'LOW'), true)) {
                $prio = 'MEDIUM';
            }
            $tool = strtoupper((string) (isset($a['tool']) ? $a['tool'] : ''));
            $actions[] = array(
                'title' => isset($a['title']) ? substr((string) $a['title'], 0, 191) : '',
                'reason' => isset($a['reason']) ? substr((string) $a['reason'], 0, 500) : '',
                'priority' => $prio,
                'tool' => $tool,
                'roadmapTaskKey' => isset($a['roadmapTaskKey']) ? (string) $a['roadmapTaskKey'] : null,
            );
        }
    }
    $insights = array();
    if (isset($raw['insights']) && is_array($raw['insights'])) {
        foreach (array_slice($raw['insights'], 0, 8) as $i) {
            $insights[] = is_string($i) ? $i : (isset($i['text']) ? (string) $i['text'] : '');
        }
    }
    $warnings = array();
    if (isset($raw['warnings']) && is_array($raw['warnings'])) {
        foreach (array_slice($raw['warnings'], 0, 8) as $w) {
            $warnings[] = (string) $w;
        }
    }
    return array(
        'ok' => true,
        'data' => array(
            'summary' => isset($raw['summary']) ? (string) $raw['summary'] : '',
            'health' => $health,
            'insights' => $insights,
            'actions' => $actions,
            'warnings' => $warnings,
        ),
    );
}

function seosys300_health_score_rules($input)
{
    $contentPub = isset($input['contentPublished']) ? $input['contentPublished'] : null;
    $contentGoal = isset($input['contentGoal']) ? (int) $input['contentGoal'] : 0;
    $rd = isset($input['referringDomains']) ? $input['referringDomains'] : null;
    $rdGoal = isset($input['rdGoal']) ? (int) $input['rdGoal'] : 0;
    $gscReady = !empty($input['gscReady']);
    $ga4Ready = !empty($input['ga4Ready']);
    $impChange = isset($input['impressionsChangePct']) ? $input['impressionsChangePct'] : null;
    $trafficDelivered = isset($input['trafficDelivered']) ? $input['trafficDelivered'] : null;

    $content = null;
    $contentWhy = array();
    if ($contentPub !== null) {
        if ($contentGoal > 0) {
            $content = (int) max(0, min(100, round(($contentPub / $contentGoal) * 100)));
            $contentWhy[] = '콘텐츠 목표 ' . $contentGoal . '개 중 ' . (int) $contentPub . '개';
        } else {
            $content = (int) min(100, (int) $contentPub * 2);
            $contentWhy[] = '발행 콘텐츠 ' . (int) $contentPub . '개';
        }
    }

    $backlink = null;
    $backlinkWhy = array();
    if ($rd !== null) {
        if ($rdGoal > 0) {
            $backlink = (int) max(0, min(100, round(($rd / $rdGoal) * 100)));
            $backlinkWhy[] = 'Referring Domain 목표 ' . $rdGoal . ' 중 ' . (int) $rd;
        } else {
            $backlink = (int) min(100, (int) $rd * 5);
            $backlinkWhy[] = 'Referring Domain ' . (int) $rd;
        }
    }

    $technical = null;
    $techWhy = array();
    if ($gscReady || $ga4Ready) {
        $technical = ($gscReady ? 50 : 0) + ($ga4Ready ? 50 : 0);
        if ($gscReady) {
            $techWhy[] = 'Search Console 데이터 있음';
        }
        if ($ga4Ready) {
            $techWhy[] = 'GA4 데이터 있음';
        }
    }

    $traffic = null;
    $trafficWhy = array();
    if ($trafficDelivered !== null) {
        $traffic = (int) min(100, (int) $trafficDelivered > 0 ? 60 : 20);
        $trafficWhy[] = 'Traffic 캠페인 delivered ' . (int) $trafficDelivered . ' (GA4 Organic Sessions와 별개)';
    }

    $growth = null;
    $growthWhy = array();
    if ($impChange !== null) {
        $growth = (int) max(0, min(100, 50 + (int) round($impChange)));
        $growthWhy[] = 'GSC 노출 전기간 대비 ' . $impChange . '%';
    }

    $parts = array();
    $reasons = array();
    foreach (array('technical' => array($technical, $techWhy), 'content' => array($content, $contentWhy), 'backlink' => array($backlink, $backlinkWhy), 'traffic' => array($traffic, $trafficWhy), 'growth' => array($growth, $growthWhy)) as $name => $pair) {
        if ($pair[0] !== null) {
            $parts[] = $pair[0];
            $reasons[$name] = $pair[1];
        }
    }
    $overall = empty($parts) ? null : (int) round(array_sum($parts) / count($parts));
    return array(
        'overall' => $overall,
        'technical' => $technical,
        'content' => $content,
        'backlink' => $backlink,
        'traffic' => $traffic,
        'growth' => $growth,
        'kind' => 'rule_based',
        'reasons' => $reasons,
    );
}

function seosys300_milestone_rules($input)
{
    $defs = array(
        array('key' => 'first_content', 'title' => '첫 콘텐츠 발행', 'metric' => 'contentPublished', 'gte' => 1),
        array('key' => 'content_10', 'title' => '콘텐츠 10개', 'metric' => 'contentPublished', 'gte' => 10),
        array('key' => 'impressions_1000', 'title' => 'Google Impression 1,000', 'metric' => 'impressions', 'gte' => 1000),
        array('key' => 'impressions_10000', 'title' => 'Google Impression 10,000', 'metric' => 'impressions', 'gte' => 10000),
        array('key' => 'clicks_100', 'title' => '첫 Click 100', 'metric' => 'clicks', 'gte' => 100),
        array('key' => 'rd_10', 'title' => 'Referring Domain 10', 'metric' => 'referringDomains', 'gte' => 10),
        array('key' => 'organic_1000', 'title' => 'Organic Sessions 1,000', 'metric' => 'organicSessions', 'gte' => 1000),
    );
    $out = array();
    foreach ($defs as $d) {
        $val = isset($input[$d['metric']]) ? $input[$d['metric']] : null;
        $achieved = $val !== null && (int) $val >= (int) $d['gte'];
        $out[] = array(
            'key' => $d['key'],
            'title' => $d['title'],
            'achieved' => $achieved,
            'value' => $val,
            'threshold' => $d['gte'],
        );
    }
    return $out;
}

function seosys300_area_status($connected, $unsupported, $error)
{
    if ($error) {
        return 'ERROR';
    }
    if ($unsupported) {
        return 'UNSUPPORTED';
    }
    if ($connected) {
        return 'CONNECTED';
    }
    return 'NOT_CONNECTED';
}
