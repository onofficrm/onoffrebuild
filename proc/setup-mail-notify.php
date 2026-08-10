<?php
/**
 * 일회성: 메일발송 사용 + 관리자 메일 설정
 * 배포 후 /proc/setup-mail-notify.php?key=ONOFF_SETUP_2026 실행 → 삭제 권장
 */
include_once dirname(__FILE__) . '/../common.php';

if (!defined('_GNUBOARD_')) {
    exit;
}

header('Content-Type: text/plain; charset=utf-8');

$key = isset($_GET['key']) ? (string) $_GET['key'] : '';
if ($key !== 'ONOFF_SETUP_2026') {
    echo "forbidden\n";
    exit;
}

$admin_email = 'jong8040@gmail.com';
$sql = " update {$g5['config_table']}
            set cf_email_use = '1',
                cf_admin_email = '" . sql_real_escape_string($admin_email) . "',
                cf_admin_email_name = '온오프마케팅' ";
$ok = sql_query($sql, false);

echo $ok ? "ok: cf_email_use=1, cf_admin_email={$admin_email}\n" : "fail\n";

$row = sql_fetch(" select cf_email_use, cf_admin_email, cf_admin_email_name from {$g5['config_table']} ");
echo 'cf_email_use=' . (isset($row['cf_email_use']) ? $row['cf_email_use'] : '') . "\n";
echo 'cf_admin_email=' . (isset($row['cf_admin_email']) ? $row['cf_admin_email'] : '') . "\n";
echo 'cf_admin_email_name=' . (isset($row['cf_admin_email_name']) ? $row['cf_admin_email_name'] : '') . "\n";
