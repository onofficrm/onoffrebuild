<?php
/**
 * Day-before and day-after class reminders only.
 * Web calls require SEOSYS300_CRON_KEY. CLI can run without it.
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
include_once dirname(__FILE__) . '/../lib/class_journey.lib.php';

$result = seosys300_class_dispatch_reminders();
echo 'class reminders before=' . (int) $result['before'] . ' after=' . (int) $result['after'] . "\n";
exit(0);
