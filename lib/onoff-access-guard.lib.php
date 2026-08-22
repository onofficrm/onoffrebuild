<?php
/**
 * Public-site access guard helpers (onoff.icrm.co.kr).
 * Host-level firewall blocks cannot be cleared from PHP; this layer:
 * - prevents accidental GNUBoard "접근가능 IP" lockdown
 * - logs app-level IP denials with HTTP 403
 * - exposes a tiny health probe for uptime checks
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (!function_exists('onoff_access_guard_enabled')) {
    function onoff_access_guard_enabled()
    {
        if (function_exists('g5site_cfg_bool')) {
            return g5site_cfg_bool('public_access_guard_enabled', true);
        }

        return true;
    }
}

if (!function_exists('onoff_access_forbid_possible_ip')) {
    function onoff_access_forbid_possible_ip()
    {
        if (function_exists('g5site_cfg_bool')) {
            return g5site_cfg_bool('public_access_forbid_possible_ip', true);
        }

        return true;
    }
}

if (!function_exists('onoff_access_log_dir')) {
    function onoff_access_log_dir()
    {
        if (defined('G5_DATA_PATH') && G5_DATA_PATH) {
            return rtrim((string) G5_DATA_PATH, '/') . '/log';
        }

        return dirname(__DIR__) . '/data/log';
    }
}

if (!function_exists('onoff_access_log')) {
    /**
     * @param array<string,mixed> $context
     */
    function onoff_access_log($event, array $context = array())
    {
        $dir = onoff_access_log_dir();
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        $file = $dir . '/public_access_guard.log';
        $row = array(
            'ts'    => date('c'),
            'event' => (string) $event,
            'ip'    => isset($_SERVER['REMOTE_ADDR']) ? (string) $_SERVER['REMOTE_ADDR'] : '',
            'uri'   => isset($_SERVER['REQUEST_URI']) ? (string) $_SERVER['REQUEST_URI'] : '',
            'ua'    => isset($_SERVER['HTTP_USER_AGENT']) ? substr((string) $_SERVER['HTTP_USER_AGENT'], 0, 180) : '',
        );
        foreach ($context as $k => $v) {
            $row[$k] = $v;
        }
        @file_put_contents($file, json_encode($row, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND | LOCK_EX);
    }
}

if (!function_exists('onoff_access_deny')) {
    /**
     * App-layer deny with proper 403 (distinguishable from hosting DROP/timeout).
     */
    function onoff_access_deny($reason, $message)
    {
        if (onoff_access_guard_enabled()) {
            onoff_access_log('app_ip_deny', array('reason' => $reason));
        }
        if (!headers_sent()) {
            http_response_code(403);
            header('Content-Type: text/html; charset=utf-8');
            header('X-Onoff-Access-Deny: ' . preg_replace('/[^a-z0-9_\-]/i', '', (string) $reason));
        }
        echo '<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>접근 제한</title></head><body>';
        echo '<p>' . htmlspecialchars((string) $message, ENT_QUOTES, 'UTF-8') . '</p>';
        echo '</body></html>';
        exit;
    }
}
