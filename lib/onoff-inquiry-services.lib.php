<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

/**
 * Official /contact interest_services slugs (mirror build/onoff-builder-website contactForm).
 *
 * @return array<string, string> slug => label
 */
function onoff_inquiry_service_label_map()
{
    return array(
        'routine' => '루틴 자동발행',
        'stepmail' => '스텝메일',
        'sns-marketing' => 'SNS 마케팅',
        'auto-comment' => '자동 댓글',
        'easy-edit' => '쉬운 홈페이지 수정',
        'ai-dev' => 'AI 기능 개발',
        'website' => '홈페이지 제작',
        'management' => '운영관리',
        'seo' => 'SEO',
        'geo' => 'GEO',
        'backlink' => 'BACKLINK',
        'traffic' => 'TRAFFIC',
        'domain' => 'DOMAIN',
        'content' => 'AI 콘텐츠',
    );
}

/**
 * @param string $raw comma-separated slugs
 * @return string[] normalized unique slugs
 */
function onoff_inquiry_normalize_service_slugs($raw)
{
    $map = onoff_inquiry_service_label_map();
    $aliases = array(
        'step-mail' => 'stepmail',
        'sns' => 'sns-marketing',
        'sns-poster' => 'sns-marketing',
        'ai-development' => 'ai-dev',
        'easyedit' => 'easy-edit',
        'autocomment' => 'auto-comment',
        'comment' => 'auto-comment',
    );
    $out = array();
    foreach (explode(',', (string) $raw) as $part) {
        $slug = strtolower(trim($part));
        if ($slug === '') {
            continue;
        }
        if (isset($aliases[$slug])) {
            $slug = $aliases[$slug];
        }
        if (isset($map[$slug])) {
            $out[$slug] = $slug;
        }
    }
    return array_values($out);
}

/**
 * @param string[] $slugs
 * @return string comma-separated labels
 */
function onoff_inquiry_labels_from_slugs(array $slugs)
{
    $map = onoff_inquiry_service_label_map();
    $labels = array();
    foreach ($slugs as $slug) {
        if (isset($map[$slug])) {
            $labels[] = $map[$slug];
        }
    }
    return implode(', ', $labels);
}

/**
 * Parse Meet/classic message block [관심 기능·서비스].
 *
 * @param string $message
 * @return string labels line or empty
 */
function onoff_inquiry_extract_interest_from_message($message)
{
    $message = (string) $message;
    if ($message === '') {
        return '';
    }
    if (preg_match('/\[관심 기능·서비스\]\s*(.+?)(?:\n|$)/u', $message, $m)) {
        return trim($m[1]);
    }
    return '';
}

/**
 * Query ?service= on referer URL.
 *
 * @param string $referer_page
 * @return string[] slugs
 */
function onoff_inquiry_slugs_from_referer($referer_page)
{
    $referer_page = trim((string) $referer_page);
    if ($referer_page === '') {
        return array();
    }
    $query = parse_url($referer_page, PHP_URL_QUERY);
    if (!is_string($query) || $query === '') {
        return array();
    }
    parse_str($query, $params);
    if (empty($params['service'])) {
        return array();
    }
    return onoff_inquiry_normalize_service_slugs((string) $params['service']);
}