<?php
/**
 * CLI-only metrics sync entry. Do not register cron in this step.
 * Web requests without SEOSYS300_CRON_KEY are rejected.
 */
if (php_sapi_name() !== 'cli') {
    $key = getenv('SEOSYS300_CRON_KEY');
    $got = isset($_GET['key']) ? (string) $_GET['key'] : '';
    if ($key === false || $key === '' || $got === '' || !hash_equals((string) $key, $got)) {
        http_response_code(403);
        echo 'forbidden';
        exit;
    }
}

define('_GNUBOARD_', true);
include_once dirname(__FILE__) . '/../api/_init.php';

if (!seosys300_metrics_tables_ready()) {
    fwrite(STDERR, "metrics tables missing\n");
    exit(2);
}

echo "SEO SYSTEM 300 metrics cron entry is ready. Schedule is not registered yet.\n";
echo "Intended policy: GSC once daily, GA4 once daily per project.\n";
exit(0);
