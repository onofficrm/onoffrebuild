<?php
/**
 * Launch-mode HTTP checks against local Docker GNUBoard (localhost:8088).
 * Writes only runtime config.local.php (gitignored). Restores LAUNCH_MODE=all.
 */
if (php_sapi_name() !== 'cli') {
    fwrite(STDERR, "CLI only\n");
    exit(1);
}
error_reporting(E_ALL & ~E_DEPRECATED);

$base = getenv('E2E_BASE_URL') ?: 'http://127.0.0.1:8088';
$pass = array(
    'admin' => getenv('E2E_ADMIN_PASSWORD'),
    'student_a' => getenv('E2E_STUDENT_A_PASSWORD'),
    'student_b' => getenv('E2E_STUDENT_B_PASSWORD'),
);
foreach ($pass as $id => $p) {
    if (!$p) {
        fwrite(STDERR, "Missing password env for {$id}\n");
        exit(2);
    }
}

$runtimeConfig = dirname(__FILE__) . '/../../../.dev/seo-system-300/runtime/www/plugin/seo-system-300/config.local.php';
$failed = 0;

function launch_fail($label)
{
    global $failed;
    $failed++;
    echo "FAIL {$label}\n";
}
function launch_pass($label)
{
    echo "PASS {$label}\n";
}

function launch_write_mode($path, $mode, $pilots)
{
    $existing = is_file($path) ? file_get_contents($path) : "<?php\nif (!defined('_GNUBOARD_')) { exit; }\n";
    $existing = preg_replace('/\n?# SEOSYS300_LAUNCH_BLOCK_BEGIN.*?# SEOSYS300_LAUNCH_BLOCK_END\n?/s', "\n", $existing);
    $block = "\n# SEOSYS300_LAUNCH_BLOCK_BEGIN\n"
        . "putenv('SEOSYS300_LAUNCH_MODE={$mode}');\n"
        . "putenv('SEOSYS300_PILOT_USERS={$pilots}');\n"
        . "# SEOSYS300_LAUNCH_BLOCK_END\n";
    if (strpos($existing, '<?php') === false) {
        $existing = "<?php\nif (!defined('_GNUBOARD_')) { exit; }\n" . $existing;
    }
    if (!is_dir(dirname($path))) {
        fwrite(STDERR, "Runtime config dir missing\n");
        exit(3);
    }
    file_put_contents($path, rtrim($existing) . $block);
}

function launch_request($method, $url, $cookieFile, $opts = array())
{
    $ch = curl_init($url);
    $headers = array('Accept: application/json');
    if (!empty($opts['headers'])) {
        $headers = array_merge($headers, $opts['headers']);
    }
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_COOKIEJAR => $cookieFile,
        CURLOPT_COOKIEFILE => $cookieFile,
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_HEADER => false,
        CURLOPT_TIMEOUT => 30,
    ));
    if (isset($opts['body'])) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $opts['body']);
    }
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    return array('code' => $code, 'json' => json_decode((string) $body, true));
}

function launch_login($base, $mb_id, $password)
{
    $jar = sys_get_temp_dir() . '/seosys300_launch_' . $mb_id . '.txt';
    @unlink($jar);
    launch_request('GET', $base . '/bbs/login.php', $jar);
    launch_request('POST', $base . '/bbs/login_check.php', $jar, array(
        'headers' => array('Content-Type: application/x-www-form-urlencoded'),
        'body' => http_build_query(array(
            'mb_id' => $mb_id,
            'mb_password' => $password,
            'url' => '/',
        )),
    ));
    return $jar;
}

function launch_err($res)
{
    return is_array($res['json']) && isset($res['json']['error']['code']) ? $res['json']['error']['code'] : '';
}

function launch_assert_session($label, $res, $mode, $allowed)
{
    $json = is_array($res['json']) ? $res['json'] : array();
    $ok = ($res['code'] === 200)
        && (($json['launchMode'] ?? '') === $mode)
        && (($json['launchAllowed'] ?? null) === $allowed)
        && !isset($json['pilotUsers'])
        && strpos(json_encode($json), 'SEOSYS300_PILOT') === false;
    if ($ok) {
        launch_pass($label);
    } else {
        launch_fail($label . ' code=' . $res['code'] . ' mode=' . ($json['launchMode'] ?? '') . ' allowed=' . var_export($json['launchAllowed'] ?? null, true));
    }
}

list($jarA) = array(launch_login($base, 'student_a', $pass['student_a']));
list($jarB) = array(launch_login($base, 'student_b', $pass['student_b']));
list($jarAdmin) = array(launch_login($base, 'admin', $pass['admin']));

try {
$projects = '/plugin/seo-system-300/api/projects/index.php';
$session = '/plugin/seo-system-300/session.php';
$adminApi = '/plugin/seo-system-300/api/admin/index.php?action=kanban';

launch_write_mode($runtimeConfig, 'off', 'student_a');
launch_assert_session('off student session', launch_request('GET', $base . $session, $jarA), 'off', false);
launch_assert_session('off admin session', launch_request('GET', $base . $session, $jarAdmin), 'off', false);
$p = launch_request('GET', $base . $projects, $jarA);
if ($p['code'] === 403 && launch_err($p) === 'launch_not_allowed') {
    launch_pass('off student API blocked');
} else {
    launch_fail('off student API code=' . $p['code'] . ' err=' . launch_err($p));
}
$pa = launch_request('GET', $base . $projects, $jarAdmin);
if ($pa['code'] === 403 && launch_err($pa) === 'launch_not_allowed') {
    launch_pass('off admin API blocked');
} else {
    launch_fail('off admin API');
}

launch_write_mode($runtimeConfig, 'admin', 'student_a');
launch_assert_session('admin student session', launch_request('GET', $base . $session, $jarA), 'admin', false);
launch_assert_session('admin admin session', launch_request('GET', $base . $session, $jarAdmin), 'admin', true);
$p = launch_request('GET', $base . $projects, $jarA);
if ($p['code'] === 403 && launch_err($p) === 'launch_not_allowed') {
    launch_pass('admin student API blocked');
} else {
    launch_fail('admin student API');
}
$p = launch_request('GET', $base . $projects, $jarAdmin);
if ($p['code'] === 200 && !empty($p['json']['ok'])) {
    launch_pass('admin admin projects allowed');
} else {
    launch_fail('admin admin projects');
}
$adm = launch_request('GET', $base . $adminApi, $jarAdmin);
if ($adm['code'] === 200 && !empty($adm['json']['ok'])) {
    launch_pass('admin kanban still requireAdmin+allowed');
} else {
    launch_fail('admin kanban');
}
$admA = launch_request('GET', $base . $adminApi, $jarA);
if ($admA['code'] === 403 && in_array(launch_err($admA), array('launch_not_allowed', 'forbidden'), true)) {
    launch_pass('admin student kanban blocked');
} else {
    launch_fail('admin student kanban');
}

launch_write_mode($runtimeConfig, 'pilot', 'student_a');
launch_assert_session('pilot A session', launch_request('GET', $base . $session, $jarA), 'pilot', true);
launch_assert_session('pilot B session', launch_request('GET', $base . $session, $jarB), 'pilot', false);
launch_assert_session('pilot admin session', launch_request('GET', $base . $session, $jarAdmin), 'pilot', true);
$p = launch_request('GET', $base . $projects, $jarA);
if ($p['code'] === 200 && !empty($p['json']['ok'])) {
    launch_pass('pilot A API allowed');
} else {
    launch_fail('pilot A API');
}
$p = launch_request('GET', $base . $projects, $jarB);
if ($p['code'] === 403 && launch_err($p) === 'launch_not_allowed') {
    launch_pass('pilot B API blocked');
} else {
    launch_fail('pilot B API');
}

launch_write_mode($runtimeConfig, 'all', 'student_a');
launch_assert_session('all A session', launch_request('GET', $base . $session, $jarA), 'all', true);
launch_assert_session('all B session', launch_request('GET', $base . $session, $jarB), 'all', true);
$p = launch_request('GET', $base . $projects, $jarB);
if ($p['code'] === 200 && !empty($p['json']['ok'])) {
    launch_pass('all B API allowed');
} else {
    launch_fail('all B API');
}
$admA = launch_request('GET', $base . $adminApi, $jarA);
if ($admA['code'] === 403 && launch_err($admA) === 'forbidden') {
    launch_pass('all student kanban still forbidden');
} else {
    launch_fail('all student kanban err=' . launch_err($admA) . ' code=' . $admA['code']);
}

} finally {
    launch_write_mode($runtimeConfig, 'all', 'student_a');
}

echo $failed === 0 ? "LAUNCH_E2E_PASS\n" : "LAUNCH_E2E_FAIL {$failed}\n";
exit($failed === 0 ? 0 : 1);
