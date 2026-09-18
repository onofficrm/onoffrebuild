<?php
$sub_menu = '200950';
require_once './_common.php';
require_once G5_PATH . '/lib/branded-auth/bootstrap.php';

global $is_admin, $g5;

if ($is_admin !== 'super') {
    alert('최고관리자만 접근할 수 있습니다.');
}

$g5['title'] = 'ONOFF 통합 Auth/Point 헬스체크';
require_once './admin.head.php';

function onoff_health_escape($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function onoff_health_bool_label($ok)
{
    return $ok
        ? '<span style="color:#047857;font-weight:700;">OK</span>'
        : '<span style="color:#b91c1c;font-weight:700;">확인 필요</span>';
}

function onoff_health_row($label, $status, $detail = '')
{
    echo '<tr>';
    echo '<th scope="row" style="width:220px;">' . onoff_health_escape($label) . '</th>';
    echo '<td style="width:140px;">' . $status . '</td>';
    echo '<td>' . $detail . '</td>';
    echo '</tr>';
}

function onoff_health_usage_files()
{
    $dir = G5_PATH . '/data/service_point_usage';
    $items = array();
    if (!is_dir($dir)) {
        return $items;
    }
    $files = glob($dir . '/*.jsonl');
    if (!is_array($files)) {
        return $items;
    }
    foreach ($files as $file) {
        $name = basename($file);
        $platform = preg_replace('/\.jsonl$/', '', $name);
        $line_count = 0;
        $lines = @file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (is_array($lines)) {
            $line_count = count($lines);
        }
        $items[] = array(
            'platform' => $platform,
            'file' => 'data/service_point_usage/' . $name,
            'count' => $line_count,
            'updated' => is_file($file) ? date('Y-m-d H:i:s', filemtime($file)) : '-',
        );
    }
    return $items;
}

$notifier = G5_PATH . '/components/inquiry-notifier.php';
if (is_file($notifier)) {
    include_once $notifier;
}

$cfg = array(
    'enabled' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isEnabled(),
    'platformEnabled' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isPlatformAuthEnabled(),
    'configured' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isConfigured(),
    'ssoEnabled' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isPlatformSsoEnabled(),
    'pilotOnly' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::isPilotOnly(),
    'platformId' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::platformId(),
    'signupPlatform' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::signupPlatform(),
    'publicOrigin' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::publicOrigin(),
    'callbackUrl' => \OnoffMarketing\BrandedAuth\BrandedAuthConfig::ssoCallbackUrl(),
);

$cookie_header = isset($_SERVER['HTTP_COOKIE']) ? (string) $_SERVER['HTTP_COOKIE'] : '';
$session_status = '미확인';
$session_detail = '';
$points_status = '미확인';
$points_detail = '';

if ($cfg['enabled'] && $cfg['platformEnabled'] && $cfg['configured']) {
    try {
        $session = \OnoffMarketing\BrandedAuth\PlatformAuthService::getSession($cookie_header);
        $logged_in = !empty($session['authenticated']);
        $data = is_array($session['data']) ? $session['data'] : array();
        $session_status = $logged_in ? '로그인됨' : '비로그인';
        $session_detail = 'mb_id=' . onoff_health_escape($data['member_id'] ?? $data['mb_id'] ?? '-');

        if ($logged_in) {
            try {
                $points = \OnoffMarketing\BrandedAuth\PlatformAuthService::getPoints($cookie_header, 5);
                $points_status = '조회 성공';
                $points_detail = 'balance=' . onoff_health_escape($points['balance'] ?? '-')
                    . ', history=' . (is_array($points['history'] ?? null) ? count($points['history']) : 0);
            } catch (Throwable $e) {
                $points_status = '조회 실패';
                $points_detail = onoff_health_escape($e->getMessage());
            }
        }
    } catch (Throwable $e) {
        $session_status = '오류';
        $session_detail = onoff_health_escape($e->getMessage());
    }
}

$point_use_enabled = getenv('ONOFF_PLATFORM_POINT_USE_ENABLED');
$point_use_path = getenv('ONOFF_PLATFORM_POINT_USE_PATH') ?: 'auth/point/use';
$usage_files = onoff_health_usage_files();
$kakao_cfg = function_exists('onoff_kakao_alimtalk_config_summary')
    ? onoff_kakao_alimtalk_config_summary()
    : array(
        'enabled' => false,
        'provider_url' => false,
        'provider_token' => false,
        'sender_key' => false,
        'template_inquiry' => false,
        'template_education_active' => false,
    );
?>

<div class="local_desc01 local_desc">
    <p>ONOFF 통합 아이디/포인트 설정과 현재 관리자 브라우저의 Core 세션 상태를 확인합니다. API key/secret은 표시하지 않습니다.</p>
</div>

<h2 class="h2_frm">Auth 설정</h2>
<div class="tbl_head01 tbl_wrap">
    <table>
        <caption>Auth 설정 상태</caption>
        <tbody>
        <?php
        onoff_health_row('통합 Auth 활성화', onoff_health_bool_label($cfg['enabled']), '');
        onoff_health_row('Platform Auth 활성화', onoff_health_bool_label($cfg['platformEnabled']), '');
        onoff_health_row('Core API 설정', onoff_health_bool_label($cfg['configured']), 'API key/secret 존재 여부만 확인');
        onoff_health_row('SSO 활성화', onoff_health_bool_label($cfg['ssoEnabled']), '');
        onoff_health_row('Pilot 제한', $cfg['pilotOnly'] ? 'ON' : 'OFF', $cfg['pilotOnly'] ? '허용 계정만 로그인 가능' : '전체 회원 로그인 가능');
        onoff_health_row('Platform ID', onoff_health_escape($cfg['platformId']), '');
        onoff_health_row('Signup Platform', onoff_health_escape($cfg['signupPlatform']), '');
        onoff_health_row('Public Origin', onoff_health_escape($cfg['publicOrigin']), '');
        onoff_health_row('SSO Callback', onoff_health_escape($cfg['callbackUrl']), '');
        ?>
        </tbody>
    </table>
</div>

<h2 class="h2_frm">현재 세션/포인트</h2>
<div class="tbl_head01 tbl_wrap">
    <table>
        <caption>세션 및 포인트 상태</caption>
        <tbody>
        <?php
        onoff_health_row('Core 세션', onoff_health_escape($session_status), $session_detail);
        onoff_health_row('Core 포인트 조회', onoff_health_escape($points_status), $points_detail);
        onoff_health_row('포인트 차감 API', onoff_health_bool_label(in_array(strtolower((string) $point_use_enabled), array('1', 'true', 'yes', 'on'), true)), 'path=' . onoff_health_escape($point_use_path));
        ?>
        </tbody>
    </table>
</div>

<h2 class="h2_frm">카카오 알림톡 설정</h2>
<div class="tbl_head01 tbl_wrap">
    <table>
        <caption>카카오 알림톡 설정 상태</caption>
        <tbody>
        <?php
        onoff_health_row('알림톡 활성화', onoff_health_bool_label(!empty($kakao_cfg['enabled'])), '설정 키: inquiry_notify_kakao_enabled');
        onoff_health_row('발송 API/릴레이 URL', onoff_health_bool_label(!empty($kakao_cfg['provider_url'])), 'HTTPS URL 필요');
        onoff_health_row('발송 API 토큰', onoff_health_bool_label(!empty($kakao_cfg['provider_token'])), '값은 표시하지 않음');
        onoff_health_row('발신프로필 Sender Key', onoff_health_bool_label(!empty($kakao_cfg['sender_key'])), '카카오 비즈메시지 발송사에서 발급');
        onoff_health_row('문의 접수 템플릿', onoff_health_bool_label(!empty($kakao_cfg['template_inquiry'])), 'ONOFF_INQUIRY_ADMIN');
        onoff_health_row('수강권 활성화 템플릿', onoff_health_bool_label(!empty($kakao_cfg['template_education_active'])), 'ONOFF_EDU_ACTIVE');
        ?>
        </tbody>
    </table>
</div>

<h2 class="h2_frm">서비스 로컬 사용내역</h2>
<div class="tbl_head01 tbl_wrap">
    <table>
        <caption>서비스 로컬 포인트 사용내역 파일</caption>
        <thead>
        <tr>
            <th scope="col">서비스</th>
            <th scope="col">파일</th>
            <th scope="col">건수</th>
            <th scope="col">수정일</th>
        </tr>
        </thead>
        <tbody>
        <?php if (empty($usage_files)) { ?>
            <tr><td colspan="4" class="empty_table">아직 로컬 사용내역이 없습니다.</td></tr>
        <?php } else { ?>
            <?php foreach ($usage_files as $item) { ?>
                <tr>
                    <td><?php echo onoff_health_escape($item['platform']); ?></td>
                    <td><?php echo onoff_health_escape($item['file']); ?></td>
                    <td class="td_num"><?php echo number_format((int) $item['count']); ?></td>
                    <td><?php echo onoff_health_escape($item['updated']); ?></td>
                </tr>
            <?php } ?>
        <?php } ?>
        </tbody>
    </table>
</div>

<div class="btn_fixed_top">
    <a href="<?php echo G5_URL; ?>/api/auth.php?action=config" target="_blank" rel="noopener noreferrer" class="btn btn_02">Auth Config JSON</a>
    <a href="<?php echo G5_URL; ?>/api/points.php?action=history" target="_blank" rel="noopener noreferrer" class="btn btn_02">Points History JSON</a>
</div>

<?php
require_once './admin.tail.php';
