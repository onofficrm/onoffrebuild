<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_tool_url_env_name($key)
{
    $map = array(
        'catchdomain' => 'SEOSYS300_TOOL_CATCHDOMAIN_URL',
        'content' => 'SEOSYS300_TOOL_CONTENT_URL',
        'backlink' => 'SEOSYS300_TOOL_BACKLINK_URL',
        'traffic' => 'SEOSYS300_TOOL_TRAFFIC_URL',
    );
    return isset($map[$key]) ? $map[$key] : '';
}

function seosys300_tool_public_url($key)
{
    $env = seosys300_tool_url_env_name($key);
    if ($env === '') {
        return '';
    }
    return seosys300_safe_https_url(seosys300_env($env));
}

function seosys300_tool_level_for_url($url)
{
    return $url === '' ? 'NOT_CONFIGURED' : 'LINK_ONLY';
}

function seosys300_ai_provider_name()
{
    return strtolower(trim(seosys300_env('SEOSYS300_AI_PROVIDER')));
}

function seosys300_ai_api_key()
{
    return trim(seosys300_env('SEOSYS300_AI_API_KEY'));
}

function seosys300_ai_model()
{
    $m = trim(seosys300_env('SEOSYS300_AI_MODEL'));
    return $m !== '' ? $m : 'gemini-2.0-flash';
}

function seosys300_ai_configured()
{
    $p = seosys300_ai_provider_name();
    return ($p === 'gemini' || $p === 'openai') && seosys300_ai_api_key() !== '';
}

function seosys300_ai_cooldown_seconds()
{
    $n = (int) seosys300_env('SEOSYS300_AI_COOLDOWN_SECONDS', '21600');
    return max(60, min(86400, $n));
}

function seosys300_tool_registry()
{
    $out = array();
    foreach (seosys300_tool_keys() as $key) {
        $url = seosys300_tool_public_url($key);
        $level = seosys300_tool_level_for_url($url);
        $out[] = array(
            'key' => $key,
            'name' => seosys300_tool_display_name($key),
            'url' => $url,
            'enabled' => $url !== '',
            'integrationLevel' => $level,
            'supportsProjectContext' => false,
            'supportsSync' => false,
            'supportsOrders' => false,
            'discovery' => 'NOT_DISCOVERED_API',
        );
    }
    return $out;
}

function seosys300_tool_display_name($key)
{
    $map = array(
        'catchdomain' => 'CatchDomain',
        'content' => 'Content Automation',
        'backlink' => 'Backlink',
        'traffic' => 'Traffic',
    );
    return isset($map[$key]) ? $map[$key] : $key;
}

function seosys300_tool_registry_item($key)
{
    foreach (seosys300_tool_registry() as $row) {
        if ($row['key'] === $key) {
            return $row;
        }
    }
    return null;
}
