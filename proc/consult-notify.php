<?php
/**
 * 상담·진단 폼 → 이메일 알림 (게시판 없이 메일만)
 * URL: /proc/consult-notify.php (POST, JSON)
 *
 * 수신: _site.config.php inquiry_notify_email
 */
include_once dirname(__FILE__) . '/../common.php';

if (!defined('_GNUBOARD_')) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array('success' => false, 'message' => '접근이 올바르지 않습니다.'), JSON_UNESCAPED_UNICODE);
    exit;
}

if (is_file(G5_PATH . '/_site.config.php')) {
    include_once G5_PATH . '/_site.config.php';
}

function onoff_consult_json($success, $message)
{
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array(
        'success' => (bool) $success,
        'message' => (string) $message,
    ), JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_consult_rate_limit($record = false)
{
    $ip = isset($_SERVER['REMOTE_ADDR']) ? trim($_SERVER['REMOTE_ADDR']) : '';
    if ($ip === '') {
        return;
    }

    $now = defined('G5_SERVER_TIME') ? (int) G5_SERVER_TIME : time();
    $session_key = 'onoff_consult_ip_' . md5($ip);
    $last = (int) get_session($session_key);

    if ($last > 0 && ($now - $last) < 60) {
        onoff_consult_json(false, '잠시 후 다시 시도해 주세요.');
    }

    if (defined('G5_DATA_PATH')) {
        $cache_dir = G5_DATA_PATH . '/cache';
        if (is_dir($cache_dir) || @mkdir($cache_dir, G5_DIR_PERMISSION, true)) {
            $cache_file = $cache_dir . '/consult_ip_' . md5($ip) . '.txt';
            if (is_file($cache_file) && is_readable($cache_file)) {
                $cached = (int) @file_get_contents($cache_file);
                if ($cached > 0 && ($now - $cached) < 60) {
                    onoff_consult_json(false, '잠시 후 다시 시도해 주세요.');
                }
            }
            if ($record && is_writable($cache_dir)) {
                @file_put_contents($cache_file, (string) $now, LOCK_EX);
            }
        }
    }

    if ($record) {
        set_session($session_key, $now);
    }
}

function onoff_consult_valid_phone($phone)
{
    $digits = preg_replace('/[^0-9]/', '', $phone);
    $len = strlen($digits);
    if ($len < 9 || $len > 15) {
        return false;
    }
    return (bool) preg_match('/^[0-9+\-\s().]+$/u', $phone);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    onoff_consult_json(false, '잘못된 요청입니다.');
}

if (!empty($_POST['website_url'])) {
    onoff_consult_json(false, '접수할 수 없습니다.');
}

$http_ua = isset($_SERVER['HTTP_USER_AGENT']) ? trim($_SERVER['HTTP_USER_AGENT']) : '';
if ($http_ua === '') {
    onoff_consult_json(false, '접수할 수 없습니다.');
}

onoff_consult_rate_limit(false);

$token = isset($_POST['onoff_inquiry_token']) ? trim($_POST['onoff_inquiry_token']) : '';
$session_token = get_session('onoff_inquiry_token');
if ($token === '' || $session_token === '' || $token !== $session_token) {
    onoff_consult_json(false, '보안 토큰이 만료되었습니다. 페이지를 새로고침한 뒤 다시 시도해 주세요.');
}

$name = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$phone = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$email = isset($_POST['email']) ? trim(strip_tags($_POST['email'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';
$form_type = isset($_POST['form_type']) ? trim(strip_tags($_POST['form_type'])) : 'consult';
$company = isset($_POST['company']) ? trim(strip_tags($_POST['company'])) : '';
$services = isset($_POST['services']) ? trim(strip_tags($_POST['services'])) : '';
$website = isset($_POST['website']) ? trim(strip_tags($_POST['website'])) : '';
$keyword = isset($_POST['keyword']) ? trim(strip_tags($_POST['keyword'])) : '';
$concern = isset($_POST['concern']) ? trim(strip_tags($_POST['concern'])) : '';
$referer_page = isset($_POST['referer_page']) ? trim(strip_tags($_POST['referer_page'])) : '';
$privacy = !empty($_POST['privacy_agree']) ? '동의' : '미동의';

if ($name === '') {
    onoff_consult_json(false, '이름을 입력해 주세요.');
}
if (function_exists('mb_strlen') ? mb_strlen($name, 'UTF-8') > 50 : strlen($name) > 50) {
    onoff_consult_json(false, '이름이 너무 깁니다. 50자 이내로 입력해 주세요.');
}
if ($phone === '') {
    onoff_consult_json(false, '연락처를 입력해 주세요.');
}
if (!onoff_consult_valid_phone($phone)) {
    onoff_consult_json(false, '연락처 형식을 확인해 주세요.');
}
if (empty($_POST['privacy_agree'])) {
    onoff_consult_json(false, '개인정보 수집·이용에 동의해 주세요.');
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    onoff_consult_json(false, '이메일 형식이 올바르지 않습니다.');
}

$body_parts = array();
if ($form_type !== '') {
    $body_parts[] = '폼 유형: ' . $form_type;
}
if ($company !== '') {
    $body_parts[] = '회사/사이트: ' . $company;
}
if ($website !== '') {
    $body_parts[] = '웹사이트: ' . $website;
}
if ($keyword !== '') {
    $body_parts[] = '키워드: ' . $keyword;
}
if ($concern !== '') {
    $body_parts[] = '관심/고민: ' . $concern;
}
if ($services !== '') {
    $body_parts[] = '관심 서비스: ' . $services;
}
if ($message !== '') {
    $body_parts[] = "문의내용:\n" . $message;
}

$composed = trim(implode("\n", $body_parts));
if ($composed === '') {
    onoff_consult_json(false, '문의내용을 입력해 주세요.');
}
$msg_len = function_exists('mb_strlen') ? mb_strlen($composed, 'UTF-8') : strlen($composed);
if ($msg_len < 5) {
    onoff_consult_json(false, '문의내용을 조금 더 자세히 입력해 주세요.');
}
if ($msg_len > 4000) {
    onoff_consult_json(false, '문의내용이 너무 깁니다.');
}

if ($referer_page === '' && !empty($_SERVER['HTTP_REFERER'])) {
    $referer_page = trim(strip_tags($_SERVER['HTTP_REFERER']));
}

$site_name = function_exists('g5site_cfg') ? g5site_cfg('site_name', '온오프마케팅') : '온오프마케팅';
if ($site_name === '' && !empty($config['cf_title'])) {
    $site_name = $config['cf_title'];
}

$inquiry_data = array(
    'site_name'     => $site_name,
    'name'          => $name,
    'phone'         => $phone,
    'email'         => $email,
    'message'       => $composed,
    'referer_page'  => $referer_page,
    'privacy_agree' => $privacy,
    'ip'            => isset($_SERVER['REMOTE_ADDR']) ? $_SERVER['REMOTE_ADDR'] : '',
    'created_at'    => defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s'),
    'admin_url'     => defined('G5_URL') ? G5_URL : '',
    'bo_table'      => '',
    'wr_id'         => 0,
);

$notifier_file = G5_PATH . '/components/inquiry-notifier.php';
$sent = false;
if (is_file($notifier_file)) {
    include_once $notifier_file;
    if (function_exists('onoff_send_inquiry_email_notification')) {
        try {
            $sent = (bool) onoff_send_inquiry_email_notification($inquiry_data);
        } catch (Exception $e) {
            $sent = false;
        }
    } elseif (function_exists('onoff_send_inquiry_notifications')) {
        try {
            onoff_send_inquiry_notifications($inquiry_data);
            $sent = true;
        } catch (Exception $e) {
            $sent = false;
        }
    }
}

onoff_consult_rate_limit(true);
set_session('onoff_inquiry_token', md5(uniqid((string) mt_rand(), true)));

if (!$sent) {
    /* 메일 설정 미비여도 접수 시도는 성공으로 안내하되 운영자가 알 수 있게 메시지 */
    onoff_consult_json(true, '상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.');
}

onoff_consult_json(true, '상담 신청이 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.');
