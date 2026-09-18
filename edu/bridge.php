<?php
/**
 * When edu/ is the vhost document root, /plugin/seo-system-300/* is outside
 * that root. This bridge includes the real plugin script from the parent tree.
 * open_basedir must allow the parent onoff-home directory.
 */
require_once dirname(__DIR__) . '/lib/edu-platform.php';

$script = isset($_GET['__edu_script']) ? (string) $_GET['__edu_script'] : '';
unset($_GET['__edu_script']);

$script = str_replace('\\', '/', $script);
if ($script === '' || strpos($script, '..') !== false || $script[0] === '/') {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Not found';
    exit;
}

$root = realpath(dirname(__DIR__) . '/plugin/seo-system-300');
$full = realpath($root . '/' . $script);
if ($root === false || $full === false || strpos($full, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($full)) {
    http_response_code(404);
    header('Content-Type: text/plain; charset=UTF-8');
    echo 'Not found';
    exit;
}

require $full;
