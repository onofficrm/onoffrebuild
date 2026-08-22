<?php
/**
 * Lightweight public health probe (no GNUBoard bootstrap).
 * Used by uptime CI. Hosting WAF may still block — that is intentional signal.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Onoff-Health: 1');

$payload = array(
    'ok'   => true,
    'service' => 'onoffmarketing',
    'ts'   => gmdate('c'),
    'host' => isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : '',
);

echo json_encode($payload, JSON_UNESCAPED_UNICODE);
