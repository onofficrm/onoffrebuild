<?php
include_once dirname(__FILE__) . '/_common.php';

header('Cache-Control: no-store');
header('Referrer-Policy: no-referrer');

$ticket = isset($_GET['ticket']) ? (string) $_GET['ticket'] : '';
$enrollment = function_exists('onoff_education_validate_platform_grant_token')
    ? onoff_education_validate_platform_grant_token($ticket, 'any')
    : null;

if (!$enrollment || empty($enrollment['mb_id'])) {
    http_response_code(403);
    header('Content-Type: text/html; charset=utf-8');
    echo '<!doctype html><html lang="ko"><meta charset="utf-8"><title>강의실 인증 만료</title>';
    echo '<body><p>강의실 인증이 만료되었습니다.</p>';
    echo '<p><a href="/education/classroom">수강생 강의실에서 다시 입장하기</a></p></body></html>';
    exit;
}

$mbId = (string) $enrollment['mb_id'];
// The Core enrollment id may not exist in the local GNUBoard member table.
// Keep GNUBoard's native member session empty and use the verified ticket
// marker below to build the education-platform identity in _common.php.
set_session('ss_mb_id', '');
set_session('seosys300_ticket_mb_id', $mbId);
set_session('seosys300_ticket_until', (string) (time() + 10800));
session_write_close();

header('Location: /seo-system-300/dashboard', true, 302);
exit;
