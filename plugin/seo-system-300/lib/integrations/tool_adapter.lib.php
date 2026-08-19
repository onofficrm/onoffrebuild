<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_adapter_unsupported($op)
{
    return array(
        'ok' => false,
        'code' => 'unsupported',
        'operation' => $op,
        'message' => '이 기능은 현재 공식 API가 없어 지원되지 않습니다.',
    );
}

function seosys300_adapter_get_status($tool_key, $row, $reg)
{
    $url = $reg && !empty($reg['url']) ? $reg['url'] : '';
    $level = $reg ? $reg['integrationLevel'] : 'NOT_CONFIGURED';
    $manual = array();
    if ($row && (string) $row['config_json'] !== '') {
        $decoded = json_decode($row['config_json'], true);
        $manual = is_array($decoded) ? $decoded : array();
    }
    $status = 'not_configured';
    if ($url !== '') {
        $status = 'link_only';
    }
    if (!empty($manual) && isset($manual['source'])) {
        $status = 'manual';
    }
    $last = $row && !empty($row['last_success_at']) ? (string) $row['last_success_at'] : null;
    $err = $row && (string) $row['last_error_code'] !== '' ? (string) $row['last_error_code'] : '';
    return array(
        'toolKey' => $tool_key,
        'name' => seosys300_tool_display_name($tool_key),
        'url' => $url,
        'integrationLevel' => $level,
        'status' => $err !== '' ? 'error' : $status,
        'uiStatus' => $level === 'NOT_CONFIGURED' ? 'NOT CONNECTED' : ($status === 'manual' ? 'MANUAL' : 'LINK ONLY'),
        'supportsSync' => false,
        'supportsOrders' => false,
        'lastSuccessAt' => $last,
        'stale' => seosys300_is_stale($last),
        'errorCode' => $err,
        'manual' => $manual,
        'source' => !empty($manual) ? 'Manual Result' : ($url !== '' ? 'Link Only' : 'Not Configured'),
    );
}

function seosys300_adapter_get_summary($tool_key, $status)
{
    $manual = isset($status['manual']) && is_array($status['manual']) ? $status['manual'] : array();
    if ($tool_key === 'catchdomain') {
        $parsed = seosys300_catchdomain_parse_summary($manual);
        return array_merge($status, array('summary' => $parsed));
    }
    if ($tool_key === 'content') {
        return array_merge($status, array('summary' => seosys300_manual_tool_payload_normalize('content', $manual)));
    }
    if ($tool_key === 'backlink') {
        return array_merge($status, array('summary' => seosys300_backlink_parse_summary($manual)));
    }
    if ($tool_key === 'traffic') {
        return array_merge($status, array(
            'summary' => seosys300_manual_tool_payload_normalize('traffic', $manual),
            'note' => 'Traffic delivered visits are not GA4 Organic Sessions.',
        ));
    }
    return $status;
}

function seosys300_adapter_get_project_link($tool_key)
{
    $reg = seosys300_tool_registry_item($tool_key);
    $url = $reg ? $reg['url'] : '';
    return array(
        'url' => $url,
        'rel' => 'noopener noreferrer',
        'target' => '_blank',
        'contextAttached' => false,
    );
}

function seosys300_adapter_sync($tool_key)
{
    return seosys300_adapter_unsupported('sync');
}

function seosys300_adapter_validate($tool_key)
{
    $reg = seosys300_tool_registry_item($tool_key);
    if (!$reg || $reg['url'] === '') {
        return array('ok' => false, 'code' => 'NOT_CONFIGURED');
    }
    return array('ok' => true, 'code' => 'LINK_ONLY');
}
