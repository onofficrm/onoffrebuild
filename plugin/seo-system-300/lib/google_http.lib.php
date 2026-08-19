<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_http_request($method, $url, $opts = array())
{
    if (isset($GLOBALS['seosys300_http_mock']) && is_callable($GLOBALS['seosys300_http_mock'])) {
        return call_user_func($GLOBALS['seosys300_http_mock'], $method, $url, $opts);
    }
    $method = strtoupper((string) $method);
    $timeout = isset($opts['timeout']) ? (int) $opts['timeout'] : seosys300_http_timeout();
    $headers = isset($opts['headers']) && is_array($opts['headers']) ? $opts['headers'] : array();
    $body = isset($opts['body']) ? $opts['body'] : null;
    $attempts = 0;
    $max = 2;
    $last = array('status' => 0, 'body' => '', 'error' => 'request_failed');
    while ($attempts < $max) {
        $attempts++;
        $ch = curl_init($url);
        $headerLines = array();
        foreach ($headers as $k => $v) {
            $headerLines[] = $k . ': ' . $v;
        }
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_TIMEOUT => $timeout,
            CURLOPT_CONNECTTIMEOUT => min(8, $timeout),
            CURLOPT_HTTPHEADER => $headerLines,
            CURLOPT_SSL_VERIFYPEER => true,
        ));
        if ($body !== null && $method !== 'GET') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, is_array($body) ? http_build_query($body) : $body);
        }
        $resp = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $err = curl_error($ch);
        curl_close($ch);
        $last = array(
            'status' => $status,
            'body' => is_string($resp) ? $resp : '',
            'error' => $err,
        );
        if ($status === 429 || ($status >= 500 && $status < 600)) {
            if ($attempts < $max) {
                usleep(400000);
                continue;
            }
        }
        break;
    }
    return $last;
}

function seosys300_http_json($method, $url, $opts = array())
{
    $res = seosys300_http_request($method, $url, $opts);
    $decoded = json_decode($res['body'], true);
    $res['json'] = is_array($decoded) ? $decoded : array();
    return $res;
}
