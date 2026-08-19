<?php
/**
 * Provision student_a / student_b on the Docker GNUBoard DB only.
 * Uses GNUBoard get_encrypt_string (same as register_form_update).
 * CLI + SEOSYS300 guards. Does not print passwords.
 */
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}

$plugin = realpath(dirname(__FILE__) . '/..');
$root = realpath(dirname(__FILE__) . '/../../..');
require_once $plugin . '/lib/env_guard.lib.php';

$check = seosys300_cli_safety_check(array('e2e' => true, 'migration' => false));
if (!$check['ok']) {
    fwrite(STDERR, "REFUSED [{$check['code']}]\n");
    exit(2);
}

seosys300_cli_prepare_server();
chdir($root);
include_once $root . '/common.php';

$check2 = seosys300_cli_safety_check(array(
    'e2e' => true,
    'mysql_host' => defined('G5_MYSQL_HOST') ? G5_MYSQL_HOST : '',
    'mysql_db' => defined('G5_MYSQL_DB') ? G5_MYSQL_DB : '',
));
if (!$check2['ok']) {
    fwrite(STDERR, "REFUSED [{$check2['code']}]\n");
    exit(4);
}

$passA = getenv('E2E_STUDENT_A_PASSWORD');
$passB = getenv('E2E_STUDENT_B_PASSWORD');
$passAdmin = getenv('E2E_ADMIN_PASSWORD');
if ($passA === false || $passA === '' || $passB === false || $passB === '' || $passAdmin === false || $passAdmin === '') {
    fwrite(STDERR, "Missing E2E_*_PASSWORD env\n");
    exit(5);
}

function seosys300_e2e_upsert_member($mb_id, $password, $name, $email, $level)
{
    global $g5;
    $now = G5_TIME_YMDHIS;
    $hash = get_encrypt_string($password);
    $escId = sql_real_escape_string($mb_id);
    $existing = sql_fetch("SELECT mb_id FROM {$g5['member_table']} WHERE mb_id = '{$escId}'");
    $nick = sql_real_escape_string($mb_id);
    $nameEsc = sql_real_escape_string($name);
    $emailEsc = sql_real_escape_string($email);
    $hashEsc = sql_real_escape_string($hash);
    $level = (int) $level;
    if ($existing && !empty($existing['mb_id'])) {
        sql_query("UPDATE {$g5['member_table']} SET
            mb_password = '{$hashEsc}',
            mb_email_certify = '{$now}',
            mb_intercept_date = '',
            mb_leave_date = '',
            mb_level = {$level}
            WHERE mb_id = '{$escId}'");
        echo "updated {$mb_id}\n";
        return;
    }
    sql_query("INSERT INTO {$g5['member_table']} SET
        mb_id = '{$escId}',
        mb_password = '{$hashEsc}',
        mb_name = '{$nameEsc}',
        mb_nick = '{$nick}',
        mb_nick_date = '" . G5_TIME_YMD . "',
        mb_email = '{$emailEsc}',
        mb_today_login = '{$now}',
        mb_datetime = '{$now}',
        mb_ip = '127.0.0.1',
        mb_level = {$level},
        mb_login_ip = '127.0.0.1',
        mb_mailling = '0',
        mb_sms = '0',
        mb_open = '1',
        mb_open_date = '" . G5_TIME_YMD . "',
        mb_email_certify = '{$now}'");
    echo "created {$mb_id}\n";
}

seosys300_e2e_upsert_member('student_a', $passA, 'Student A', 'student_a@localhost.test', 2);
seosys300_e2e_upsert_member('student_b', $passB, 'Student B', 'student_b@localhost.test', 2);
seosys300_e2e_upsert_member('admin', $passAdmin, 'Admin', 'admin@localhost.test', 10);

echo "provision ok\n";
exit(0);
