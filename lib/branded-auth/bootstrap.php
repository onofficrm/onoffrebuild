<?php
/**
 * ONOFF Marketing Platform Auth Bridge bootstrap.
 * Loads env from data/onoff-platform-auth.env and registers class autoload.
 */
if (!defined('ONOFF_BRANDED_AUTH_BOOTSTRAPPED')) {
    define('ONOFF_BRANDED_AUTH_BOOTSTRAPPED', true);

    $envFile = dirname(__DIR__, 2) . '/data/onoff-platform-auth.env';
    if (is_readable($envFile)) {
        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (is_array($lines)) {
            foreach ($lines as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
                    continue;
                }
                list($k, $v) = explode('=', $line, 2);
                $k = trim($k);
                $v = trim($v);
                if ($k === '') {
                    continue;
                }
                if (
                    (strlen($v) >= 2)
                    && (($v[0] === '"' && substr($v, -1) === '"') || ($v[0] === "'" && substr($v, -1) === "'"))
                ) {
                    $v = substr($v, 1, -1);
                }
                if (getenv($k) === false) {
                    putenv($k . '=' . $v);
                }
                $_ENV[$k] = $v;
                $_SERVER[$k] = $v;
            }
        }
    }

    spl_autoload_register(static function ($class) {
        $prefix = 'OnoffMarketing\\BrandedAuth\\';
        if (strpos($class, $prefix) !== 0) {
            return;
        }
        $relative = substr($class, strlen($prefix));
        $file = __DIR__ . '/' . str_replace('\\', '/', $relative) . '.php';
        if (is_file($file)) {
            require_once $file;
        }
    });
}
