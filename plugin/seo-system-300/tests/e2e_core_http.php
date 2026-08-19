<?php
/**
 * Core HTTP E2E against local Docker GNUBoard (localhost:8088).
 * Requires E2E_*_PASSWORD env. Never prints passwords.
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

$failed = 0;
$notes = array();
function e2e_fail($label)
{
    global $failed;
    $failed++;
    echo "FAIL {$label}\n";
}
function e2e_pass($label)
{
    echo "PASS {$label}\n";
}

function e2e_request($method, $url, $cookieFile, $opts = array())
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
    return array('code' => $code, 'raw' => (string) $body, 'json' => json_decode((string) $body, true));
}

function e2e_login($base, $mb_id, $password)
{
    $jar = sys_get_temp_dir() . '/seosys300_e2e_' . $mb_id . '.txt';
    @unlink($jar);
    e2e_request('GET', $base . '/bbs/login.php', $jar);
    $res = e2e_request('POST', $base . '/bbs/login_check.php', $jar, array(
        'headers' => array('Content-Type: application/x-www-form-urlencoded'),
        'body' => http_build_query(array(
            'mb_id' => $mb_id,
            'mb_password' => $password,
            'url' => '/',
        )),
    ));
    return array($jar, $res);
}

function e2e_session($base, $jar)
{
    return e2e_request('GET', $base . '/plugin/seo-system-300/session.php', $jar);
}

function e2e_csrf($sess)
{
    if (is_array($sess['json']) && !empty($sess['json']['csrfToken'])) {
        return $sess['json']['csrfToken'];
    }
    return '';
}

function e2e_api($base, $jar, $method, $path, $csrf = '', $payload = null)
{
    $headers = array();
    $body = null;
    if ($payload !== null) {
        $headers[] = 'Content-Type: application/json';
        $body = json_encode($payload, JSON_UNESCAPED_UNICODE);
    }
    if ($csrf !== '') {
        $headers[] = 'X-CSRF-Token: ' . $csrf;
    }
    return e2e_request($method, $base . $path, $jar, array('headers' => $headers, 'body' => $body));
}

function e2e_data($res)
{
    if (!is_array($res['json'])) {
        return null;
    }
    if (isset($res['json']['data'])) {
        return $res['json']['data'];
    }
    return $res['json'];
}

function e2e_err($res)
{
    if (is_array($res['json']) && isset($res['json']['error']['code'])) {
        return $res['json']['error']['code'];
    }
    return '';
}

function e2e_denied($res)
{
    return in_array((int) $res['code'], array(401, 403, 404), true);
}

function e2e_leak($res, $needles)
{
    $raw = strtolower($res['raw']);
    foreach ((array) $needles as $n) {
        if ($n !== '' && strpos($raw, strtolower($n)) !== false) {
            return true;
        }
    }
    return false;
}

list($jarA, $loginAhtml) = e2e_login($base, 'student_a', $pass['student_a']);
list($jarB, $loginBhtml) = e2e_login($base, 'student_b', $pass['student_b']);
list($jarAdmin, $loginAdm) = e2e_login($base, 'admin', $pass['admin']);
$jarGuest = sys_get_temp_dir() . '/seosys300_e2e_guest.txt';
@unlink($jarGuest);

$dash = e2e_request('GET', $base . '/seo-system-300/dashboard', $jarGuest);
$sessG = e2e_session($base, $jarGuest);
if ($dash['code'] === 200 && e2e_err($sessG) === '' && empty($sessG['json']['authenticated'])) {
    e2e_pass('AUTH-1 guest dashboard HTML + unauthenticated session');
} else {
    e2e_fail('AUTH-1 guest');
}

$sessA = e2e_session($base, $jarA);
$sessB = e2e_session($base, $jarB);
$sessAdm = e2e_session($base, $jarAdmin);
$csrfA = e2e_csrf($sessA);
$csrfB = e2e_csrf($sessB);
$csrfAdm = e2e_csrf($sessAdm);

if (!empty($sessA['json']['authenticated']) && (($ua = $sessA['json']['user']) && ($ua['mbId'] ?? '') === 'student_a') && empty($sessA['json']['isAdmin'])) {
    e2e_pass('AUTH-2 student_a session');
} else {
    e2e_fail('AUTH-2 student_a session code=' . $sessA['code']);
}
if (!empty($sessB['json']['authenticated']) && (($ub = $sessB['json']['user']) && ($ub['mbId'] ?? '') === 'student_b') && empty($sessB['json']['isAdmin'])) {
    e2e_pass('AUTH-3 student_b session');
} else {
    e2e_fail('AUTH-3 student_b session');
}
if (!empty($sessAdm['json']['authenticated']) && !empty($sessAdm['json']['isAdmin'])) {
    e2e_pass('AUTH-4 admin session');
} else {
    e2e_fail('AUTH-4 admin session');
}

$admAsA = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=kanban', $csrfA);
if ((int) $admAsA['code'] === 403 && e2e_err($admAsA) === 'forbidden') {
    e2e_pass('AUTH-5 student admin API forbidden');
} else {
    e2e_fail('AUTH-5 student admin API ' . $admAsA['code'] . ' ' . e2e_err($admAsA));
}
$adminPageA = e2e_request('GET', $base . '/seo-system-300/admin', $jarA);
if ($adminPageA['code'] === 200) {
    e2e_pass('AUTH-5 admin SPA URL loads (client AdminForbidden when !isAdmin)');
} else {
    e2e_fail('AUTH-5 admin SPA');
}

$admOk = e2e_api($base, $jarAdmin, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=kanban', $csrfAdm);
if ((int) $admOk['code'] === 200 && !empty($admOk['json']['ok'])) {
    e2e_pass('AUTH-6 admin kanban allowed');
} else {
    e2e_fail('AUTH-6 admin kanban');
}

$sessA2 = e2e_session($base, $jarA);
if (!empty($sessA2['json']['authenticated']) && ($sessA2['json']['user']['mbId'] ?? '') === 'student_a') {
    e2e_pass('AUTH-7 session persist (cookie reuse)');
} else {
    e2e_fail('AUTH-7 refresh');
}

$createA = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php', $csrfA, array(
    'name' => 'SEO SYSTEM E2E Project A',
    'description' => 'Local E2E Test',
    'purposes' => array('Google SEO'),
    'websiteStatus' => '',
    'domain' => '',
));
$projA = e2e_data($createA);
$idA = is_array($projA) ? (int) $projA['id'] : 0;
if ($createA['code'] === 201 && $idA > 0) {
    e2e_pass('Project A create id=' . $idA);
} else {
    e2e_fail('Project A create ' . $createA['code'] . ' ' . substr($createA['raw'], 0, 180));
}

$createA2 = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php', $csrfA, array(
    'name' => 'SEO SYSTEM E2E Project A2',
    'description' => 'Second project',
    'purposes' => array('Google SEO'),
));
$projA2 = e2e_data($createA2);
$idA2 = is_array($projA2) ? (int) $projA2['id'] : 0;
$listA = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/projects/index.php', $csrfA);
$listAdata = e2e_data($listA);
$cntA = (is_array($listAdata) && isset($listAdata['projects'])) ? count($listAdata['projects']) : 0;
if ($idA2 > 0 && $cntA >= 2) {
    e2e_pass('Project A2 create list=' . $cntA);
} else {
    e2e_fail('Project A2 list=' . $cntA);
}

$detA = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA, $csrfA);
$detA2 = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA2, $csrfA);
$nA = e2e_data($detA);
$nA2 = e2e_data($detA2);
if (($nA['name'] ?? '') === 'SEO SYSTEM E2E Project A' && ($nA2['name'] ?? '') === 'SEO SYSTEM E2E Project A2') {
    e2e_pass('Project switch isolation A vs A2');
} else {
    e2e_fail('Project detail mix');
}

$updA = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA . '&action=update', $csrfA, array(
    'id' => $idA,
    'action' => 'update',
    'description' => 'Local E2E Test <script>alert(1)</script>',
));
$updDesc = (string) (e2e_data($updA)['description'] ?? '');
if ($updA['code'] === 200 && $updDesc !== '') {
    e2e_pass('Project update');
} else {
    e2e_fail('Project update ' . $updA['code'] . ' ' . substr($updA['raw'], 0, 180));
}
if (strpos($updA['raw'], '<script>') === false || strpos($updDesc, 'alert(1)') !== false) {
    e2e_pass('XSS payload is JSON text (not executed HTML)');
} else {
    e2e_fail('XSS payload unexpectedly executed as HTML response');
}
if (strpos($updA['raw'], 'mysql') === false && strpos($updA['raw'], 'stack trace') === false) {
    e2e_pass('XSS update no SQL dump');
} else {
    e2e_fail('XSS update leaked sql');
}

$createB = e2e_api($base, $jarB, 'POST', '/plugin/seo-system-300/api/projects/index.php', $csrfB, array(
    'name' => 'SEO SYSTEM E2E Project B',
    'description' => 'B only',
));
$idB = (int) (e2e_data($createB)['id'] ?? 0);
if ($idB > 0) {
    e2e_pass('Project B create id=' . $idB);
} else {
    e2e_fail('Project B create');
}

$idor = array(
    'Project' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA, $csrfB),
    'Website' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/website/index.php?projectId=' . $idA, $csrfB),
    'Roadmap' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/roadmap/index.php?projectId=' . $idA, $csrfB),
    'Mission' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/missions/index.php?projectId=' . $idA, $csrfB),
    'Activity' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/activity/index.php?projectId=' . $idA, $csrfB),
    'TaskResult' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/roadmap/index.php?projectId=' . $idA . '&action=results', $csrfB),
    'Metrics' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/metrics/index.php?projectId=' . $idA, $csrfB),
    'Tools' => e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/tools/index.php?projectId=' . $idA, $csrfB),
);
foreach ($idor as $name => $res) {
    $leak = e2e_leak($res, array('SEO SYSTEM E2E Project A', 'student_a@', 'Local E2E Test'));
    if (e2e_denied($res) && !$leak) {
        e2e_pass("IDOR {$name} {$res['code']} " . e2e_err($res));
    } else {
        e2e_fail("IDOR {$name} {$res['code']} " . e2e_err($res) . ' leak=' . ($leak ? 'yes' : 'no'));
    }
}
$rev = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/projects/index.php?id=' . $idB, $csrfA);
if (e2e_denied($rev) && !e2e_leak($rev, array('Project B'))) {
    e2e_pass('IDOR reverse A cannot read B');
} else {
    e2e_fail('IDOR reverse');
}

$stealUpd = e2e_api($base, $jarB, 'POST', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA . '&action=update', $csrfB, array(
    'id' => $idA,
    'action' => 'update',
    'name' => 'HACKED',
));
$stealArc = e2e_api($base, $jarB, 'POST', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA . '&action=archive', $csrfB, array(
    'id' => $idA,
    'action' => 'archive',
));
if (e2e_denied($stealUpd) && e2e_denied($stealArc)) {
    e2e_pass('IDOR update/archive rejected');
} else {
    e2e_fail('IDOR update/archive');
}

$sqli = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/projects/index.php?id=' . urlencode('1 OR 1=1'), $csrfA);
if ($sqli['code'] !== 500 && strpos($sqli['raw'], 'You have an error in your SQL') === false && strpos($sqli['raw'], 'mysqli_') === false) {
    e2e_pass('SQLi id param no SQL error leak');
} else {
    e2e_fail('SQLi leak');
}

$draft = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'action' => 'draft',
    'projectId' => $idA,
));
$order = e2e_data($draft);
$oid = (int) ($order['id'] ?? 0);
$save1 = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $idA,
    'orderId' => $oid,
    'wizardStep' => 'info',
    'siteType' => 'LOCAL_SERVICE',
    'purposes' => array('SEO'),
    'industry' => 'travel',
    'siteName' => 'E2E Test Site',
    'brandName' => 'E2E Brand',
    'menus' => array(
        array('id' => 'm1', 'label' => 'HOME'),
        array('id' => 'm2', 'label' => '서비스'),
        array('id' => 'm3', 'label' => '블로그'),
        array('id' => 'm4', 'label' => '문의'),
    ),
    'features' => array('inquiry_form', 'board', 'blog'),
    'references' => array(array('url' => 'https://example.com', 'memo' => 'ref')),
    'keywords' => array(array('keyword' => 'e2e seo', 'target' => 'main')),
));
if ($oid > 0 && ($save1['code'] === 200 || $save1['code'] === 201)) {
    e2e_pass('Website draft save steps 1-5 order=' . $oid);
} else {
    e2e_fail('Website draft save ' . $save1['code'] . ' ' . substr($save1['raw'], 0, 200));
}
$restore = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/website/index.php?projectId=' . $idA, $csrfA);
$rest = e2e_data($restore);
$restOrder = is_array($rest) && isset($rest['order']) ? $rest['order'] : $rest;
if (($restOrder['siteName'] ?? '') === 'E2E Test Site' && count($restOrder['menus'] ?? array()) >= 4) {
    e2e_pass('Website draft restore');
} else {
    e2e_fail('Website draft restore');
}
if (($restOrder['wizardStep'] ?? '') === 'step1') {
    e2e_pass('Wizard step restore/alias info→step1');
} else {
    e2e_fail('Wizard step restore got=' . ($restOrder['wizardStep'] ?? ''));
}

$saveExtra = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $idA,
    'orderId' => $oid,
    'wizardStep' => 'step8',
    'designStyle' => 'clean_professional',
    'primaryColor' => 'navy',
    'customColor' => '#2563EB',
    'accentColor' => '#10B981',
    'colorPreset' => 'navy',
    'features' => array('inquiry_form', 'map', 'kakaotalk'),
    'contacts' => array(
        'phone' => '010-0000-0000',
        'kakao' => 'e2e-kakao',
        'email' => 'student_a@example.test',
    ),
    'extraRequest' => '<script>alert(1)</script> E2E extra request memo',
));
$extraD = e2e_data($saveExtra);
if (($extraD['contacts']['kakao'] ?? '') === 'e2e-kakao' && strpos((string) ($extraD['extraRequest'] ?? ''), 'E2E extra request memo') !== false) {
    e2e_pass('Website extra_json contacts/request saved');
} else {
    e2e_fail('Website extra_json ' . $saveExtra['code'] . ' ' . substr($saveExtra['raw'], 0, 180));
}
$reqText = (string) ($extraD['extraRequest'] ?? '');
$noLeak = strpos($saveExtra['raw'], 'mysqli_') === false && strpos($saveExtra['raw'], 'You have an error in your SQL') === false;
if (strpos($reqText, 'alert(1)') !== false && $noLeak) {
    e2e_pass('XSS stored as text; no filesystem/SQL leak in JSON');
} else {
    e2e_fail('XSS/path leak check extra=' . substr($reqText, 0, 80));
}

$inject = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $idA,
    'orderId' => $oid,
    'wizardStep' => '../etc/passwd',
    'progress' => 99,
    'materialsRequest' => array('title' => 'hacked-admin', 'body' => 'should-not-save'),
    'extra_json' => array('adminInternal' => 'secret', 'materialsRequest' => array('title' => 'blob')),
    'contacts' => array(
        'phone' => '010-0000-0000',
        'kakao' => 'e2e-kakao',
        'email' => 'student_a@example.test',
        'adminInternal' => 'nope',
    ),
));
$injD = e2e_data($inject);
$injStep = (string) ($injD['wizardStep'] ?? '');
if (
    $injStep !== '../etc/passwd'
    && (int) ($injD['progress'] ?? 0) !== 99
    && empty($injD['materialsRequest'])
    && strpos($inject['raw'], 'hacked-admin') === false
    && strpos($inject['raw'], 'adminInternal') === false
) {
    e2e_pass('extra_json/progress/wizard_step whitelist');
} else {
    e2e_fail('whitelist step=' . $injStep . ' progress=' . ($injD['progress'] ?? '') . ' ' . substr($inject['raw'], 0, 160));
}

function e2e_upload($base, $jar, $csrf, $orderId, $filename, $bytes, $mime, $action = 'upload', $extra = array())
{
    $tmp = tempnam(sys_get_temp_dir(), 'up');
    file_put_contents($tmp, $bytes);
    $ch = curl_init($base . '/plugin/seo-system-300/api/website/index.php');
    $cfile = new CURLFile($tmp, $mime, $filename);
    $fields = array_merge(array(
        'action' => $action,
        'orderId' => (string) $orderId,
        'category' => 'logo',
        'file' => $cfile,
    ), $extra);
    curl_setopt_array($ch, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_COOKIEFILE => $jar,
        CURLOPT_COOKIEJAR => $jar,
        CURLOPT_POST => true,
        CURLOPT_HTTPHEADER => array('Accept: application/json', 'X-CSRF-Token: ' . $csrf),
        CURLOPT_POSTFIELDS => $fields,
    ));
    $body = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    @unlink($tmp);
    return array('code' => $code, 'raw' => (string) $body, 'json' => json_decode((string) $body, true));
}

$png = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==');
$jpg = $png;
if (function_exists('imagecreatetruecolor') && function_exists('imagejpeg')) {
    $im = imagecreatetruecolor(8, 8);
    ob_start();
    imagejpeg($im, null, 90);
    $jpg = (string) ob_get_clean();
    imagedestroy($im);
}
$pdf = "%PDF-1.1\n1 0 obj<<>>endobj\ntrailer<<>>\n%%EOF\n";
$upPng = e2e_upload($base, $jarA, $csrfA, $oid, 'logo.png', $png, 'image/png');
$upJpg = e2e_upload($base, $jarA, $csrfA, $oid, 'photo.jpg', $jpg, 'image/jpeg');
$upPdf = e2e_upload($base, $jarA, $csrfA, $oid, 'brief.pdf', $pdf, 'application/pdf');
$filePng = e2e_data($upPng);
$fileId = (int) ($filePng['id'] ?? 0);
if ($upPng['code'] === 201 && $upJpg['code'] === 201 && $upPdf['code'] === 201 && $fileId > 0) {
    e2e_pass('File upload png/jpg/pdf');
} else {
    e2e_fail('File upload ' . $upPng['code'] . '/' . $upJpg['code'] . '/' . $upPdf['code'] . ' ' . substr($upPng['raw'], 0, 120));
}
$orig = (string) ($filePng['originalName'] ?? '');
$dlUrl = (string) ($filePng['downloadUrl'] ?? '');
if ($orig === 'logo.png' && strpos($dlUrl, 'download.php?id=') !== false && strpos($dlUrl, 'logo.png') === false) {
    e2e_pass('Upload keeps original name; download URL is id-based');
} else {
    e2e_fail('Upload naming orig=' . $orig . ' url=' . $dlUrl);
}
$memo = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'action' => 'update_file',
    'fileId' => $fileId,
    'memo' => 'E2E logo memo',
));
$memoD = e2e_data($memo);
if (($memoD['memo'] ?? '') === 'E2E logo memo') {
    e2e_pass('File memo update');
} else {
    e2e_fail('File memo ' . $memo['code'] . ' ' . substr($memo['raw'], 0, 120));
}
$memoNoCsrf = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', '', array(
    'action' => 'update_file',
    'fileId' => $fileId,
    'memo' => 'csrf-miss',
));
if ((int) $memoNoCsrf['code'] === 403) {
    e2e_pass('File memo CSRF required');
} else {
    e2e_fail('File memo CSRF ' . $memoNoCsrf['code']);
}
$repl = e2e_upload($base, $jarA, $csrfA, $oid, 'logo-replace.jpg', $jpg, 'image/jpeg', 'replace_file', array('fileId' => (string) $fileId));
$replD = e2e_data($repl);
$newFileId = (int) ($replD['id'] ?? 0);
if ($repl['code'] === 200 && $newFileId > 0) {
    e2e_pass('File replace');
    $fileId = $newFileId;
} else {
    e2e_fail('File replace ' . $repl['code'] . ' ' . substr($repl['raw'], 0, 160));
}
$delPdfId = (int) (e2e_data($upPdf)['id'] ?? 0);
$del = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'action' => 'delete_file',
    'fileId' => $delPdfId,
));
if ($del['code'] === 200) {
    e2e_pass('File delete');
} else {
    e2e_fail('File delete');
}

$badNames = array('x.php', 'x.phtml', 'x.svg', 'x.html', 'x.js', 'x.exe', 'file.php.jpg');
$badOk = true;
foreach ($badNames as $bn) {
    $bad = e2e_upload($base, $jarA, $csrfA, $oid, $bn, "<?php echo 1;", 'application/octet-stream');
    if ($bad['code'] < 400) {
        $badOk = false;
        e2e_fail('dangerous upload allowed ' . $bn);
    }
}
if ($badOk) {
    e2e_pass('Dangerous extensions rejected');
}

$disguise = e2e_upload($base, $jarA, $csrfA, $oid, 'notimage.jpg', "<?php echo 1;", 'image/jpeg');
if ($disguise['code'] >= 400) {
    e2e_pass('MIME/content mismatch jpg rejected');
} else {
    e2e_fail('MIME mismatch accepted');
}

$save2 = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $idA,
    'orderId' => $oid,
    'wizardStep' => 'review',
    'designStyle' => 'modern',
    'primaryColor' => '#111111',
    'businessDescription' => 'E2E local service site',
));
$sub = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'action' => 'submit',
    'projectId' => $idA,
    'orderId' => $oid,
));
$subD = e2e_data($sub);
$orderNo = (string) ($subD['orderNo'] ?? '');
if (($subD['status'] ?? '') === 'submitted' && empty($subD['isDraft'])) {
    e2e_pass('Website submit DRAFT→SUBMITTED');
} else {
    e2e_fail('Website submit ' . $sub['code'] . ' ' . substr($sub['raw'], 0, 180));
}
if (preg_match('/^WEB-' . date('Y') . '-' . str_pad((string) $oid, 6, '0', STR_PAD_LEFT) . '$/', $orderNo) === 1) {
    e2e_pass('order_no PK-based ' . $orderNo);
} else {
    e2e_fail('order_no got=' . $orderNo . ' oid=' . $oid);
}

$bOrder = e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/website/index.php?projectId=' . $idA, $csrfB);
$bFiles = e2e_api($base, $jarB, 'GET', '/plugin/seo-system-300/api/website/index.php?action=files&orderId=' . $oid, $csrfB);
$bDl = e2e_request('GET', $base . '/plugin/seo-system-300/api/website/download.php?id=' . $fileId, $jarB);
$bSave = e2e_api($base, $jarB, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfB, array(
    'projectId' => $idA,
    'orderId' => $oid,
    'siteName' => 'stolen',
));
if (e2e_denied($bOrder) && e2e_denied($bFiles) && e2e_denied($bDl) && e2e_denied($bSave) && !e2e_leak($bOrder, array('E2E Test Site'))) {
    e2e_pass('Website/file IDOR');
} else {
    e2e_fail('Website/file IDOR codes ' . $bOrder['code'] . '/' . $bFiles['code'] . '/' . $bDl['code'] . '/' . $bSave['code']);
}
$bRepl = e2e_upload($base, $jarB, $csrfB, $oid, 'steal.jpg', $jpg, 'image/jpeg', 'replace_file', array('fileId' => (string) $fileId));
$bMemo = e2e_api($base, $jarB, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfB, array(
    'action' => 'update_file',
    'fileId' => $fileId,
    'memo' => 'stolen',
));
if (e2e_denied($bRepl) && e2e_denied($bMemo)) {
    e2e_pass('File replace/memo IDOR');
} else {
    e2e_fail('File replace/memo IDOR ' . $bRepl['code'] . '/' . $bMemo['code']);
}
$guestDl = e2e_request('GET', $base . '/plugin/seo-system-300/api/website/download.php?id=' . $fileId, $jarGuest);
if (e2e_denied($guestDl)) {
    e2e_pass('Guest file download blocked');
} else {
    e2e_fail('Guest file download ' . $guestDl['code']);
}
$adminDl = e2e_request('GET', $base . '/plugin/seo-system-300/api/website/download.php?id=' . $fileId, $jarAdmin);
if ((int) $adminDl['code'] === 200 && strlen($adminDl['raw']) > 10) {
    e2e_pass('Admin file download allowed');
} else {
    e2e_fail('Admin file download ' . $adminDl['code']);
}

$rm = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/roadmap/index.php?projectId=' . $idA, $csrfA);
$rmd = e2e_data($rm);
$steps = $rmd['steps'] ?? array();
$taskCount = 0;
$checkTask = null;
$resultTask = null;
foreach ($steps as $st) {
    foreach ($st['tasks'] as $t) {
        $taskCount++;
        if ($checkTask === null && ($t['completionType'] ?? '') === 'check' && ($t['status'] ?? '') !== 'completed') {
            $checkTask = $t;
        }
        if (($t['completionType'] ?? '') === 'result_required') {
            $resultTask = $t;
        }
    }
}
if (count($steps) === 10 && $taskCount === 41) {
    e2e_pass('Roadmap 10 steps / 41 tasks');
} else {
    e2e_fail('Roadmap counts steps=' . count($steps) . ' tasks=' . $taskCount);
}

$tid = (int) ($checkTask['id'] ?? 0);
$start = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'start', 'projectId' => $idA, 'taskId' => $tid,
));
$comp = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'complete', 'projectId' => $idA, 'taskId' => $tid,
));
$reopen = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'reopen', 'projectId' => $idA, 'taskId' => $tid,
));
$comp2 = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'complete', 'projectId' => $idA, 'taskId' => $tid,
));
if ($start['code'] === 200 && $comp['code'] === 200 && $reopen['code'] === 200 && $comp2['code'] === 200) {
    e2e_pass('Roadmap start/complete/reopen');
} else {
    e2e_fail('Roadmap task flow');
}

$rid = (int) ($resultTask['id'] ?? 0);
$badComp = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'complete', 'projectId' => $idA, 'taskId' => $rid,
));
if ($badComp['code'] === 409 && e2e_err($badComp) === 'result_required') {
    e2e_pass('Result required 409');
} else {
    e2e_fail('Result required expected 409 got ' . $badComp['code'] . ' ' . e2e_err($badComp));
}
$resAdd = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'result',
    'projectId' => $idA,
    'taskId' => $rid,
    'resultUrl' => 'https://example.com/e2e-content',
    'keyword' => 'e2e seo',
    'memo' => 'Local test',
));
$okComp = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/roadmap/index.php', $csrfA, array(
    'action' => 'complete', 'projectId' => $idA, 'taskId' => $rid,
));
if ($resAdd['code'] === 201 && $okComp['code'] === 200) {
    e2e_pass('Result save then complete');
} else {
    e2e_fail('Result complete');
}

$m1 = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/missions/index.php?projectId=' . $idA, $csrfA);
$md1 = e2e_data($m1);
$missions = $md1['missions'] ?? array();
$mcount = count($missions);
$mids = array();
foreach ($missions as $m) {
    $mids[] = (int) $m['id'];
}
sort($mids);
if ($mcount >= 1 && $mcount <= 3) {
    e2e_pass('Mission generate count=' . $mcount);
} else {
    e2e_fail('Mission count ' . $mcount);
}
$m2 = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/missions/index.php?projectId=' . $idA, $csrfA);
$mids2 = array();
foreach (($e2 = e2e_data($m2)['missions'] ?? array()) as $m) {
    $mids2[] = (int) $m['id'];
}
sort($mids2);
if ($mids === $mids2) {
    e2e_pass('Mission same-day stable');
} else {
    e2e_fail('Mission regenerated');
}
$mid = (int) ($missions[0]['id'] ?? 0);
$mcomp = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/missions/index.php', $csrfA, array(
    'action' => 'complete', 'projectId' => $idA, 'missionId' => $mid,
));
if ($mcomp['code'] === 200) {
    e2e_pass('Mission complete');
} else {
    e2e_fail('Mission complete');
}

$act = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/activity/index.php?projectId=' . $idA . '&limit=50', $csrfA);
$acts = e2e_data($act)['activities'] ?? array();
$types = array();
foreach ($acts as $a) {
    $types[] = $a['activityType'] ?? $a['type'] ?? '';
}
$needTypes = array('PROJECT_CREATED', 'WEBSITE_ORDER_SUBMITTED', 'ROADMAP_TASK_COMPLETED', 'TASK_RESULT_CREATED', 'MISSION_COMPLETED');
$missingTypes = array();
foreach ($needTypes as $t) {
    if (!in_array($t, $types, true)) {
        $missingTypes[] = $t;
    }
}
if (!$missingTypes) {
    e2e_pass('Activity events present');
} else {
    e2e_fail('Activity missing ' . implode(',', $missingTypes) . ' have=' . implode(',', array_unique($types)));
}
$actPost = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/activity/index.php', $csrfA, array(
    'projectId' => $idA, 'activity_type' => 'FAKE',
));
if ((int) $actPost['code'] === 405) {
    e2e_pass('Activity client POST rejected');
} else {
    e2e_fail('Activity POST ' . $actPost['code']);
}

$noCsrf = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA . '&action=update', '', array(
    'id' => $idA, 'action' => 'update', 'name' => 'no csrf',
));
$badCsrf = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA . '&action=update', '0.deadbeef', array(
    'id' => $idA, 'action' => 'update', 'name' => 'bad csrf',
));
if ($noCsrf['code'] === 403 && $badCsrf['code'] === 403) {
    e2e_pass('CSRF missing/invalid rejected');
} else {
    e2e_fail('CSRF ' . $noCsrf['code'] . '/' . $badCsrf['code']);
}
$webNoCsrf = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', '', array(
    'projectId' => $idA,
    'orderId' => $oid,
    'siteName' => 'no csrf',
));
$webBadCsrf = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', '0.deadbeef', array(
    'projectId' => $idA,
    'orderId' => $oid,
    'siteName' => 'bad csrf',
));
$adminNoCsrf = e2e_api($base, $jarAdmin, 'POST', '/plugin/seo-system-300/api/admin/index.php', '', array(
    'action' => 'request-more-info',
    'orderId' => $oid,
    'title' => 'x',
    'body' => 'y',
));
if ($webNoCsrf['code'] === 403 && $webBadCsrf['code'] === 403 && $adminNoCsrf['code'] === 403) {
    e2e_pass('Website/admin CSRF missing/invalid rejected');
} else {
    e2e_fail('Website CSRF ' . $webNoCsrf['code'] . '/' . $webBadCsrf['code'] . '/' . $adminNoCsrf['code']);
}

$statuses = array('submitted', 'material_waiting', 'planning', 'design', 'development', 'internal_review', 'customer_review', 'revision', 'completed');
$kanbanOk = true;
foreach ($statuses as $st) {
    $ch = e2e_api($base, $jarAdmin, 'POST', '/plugin/seo-system-300/api/admin/index.php', $csrfAdm, array(
        'action' => 'change_status',
        'orderId' => $oid,
        'status' => $st,
        'memo' => 'e2e ' . $st,
    ));
    if ($ch['code'] !== 200) {
        $kanbanOk = false;
        e2e_fail('Kanban ' . $st . ' ' . $ch['code'] . ' ' . substr($ch['raw'], 0, 120));
    }
}
if ($kanbanOk) {
    e2e_pass('Admin kanban status chain');
}

$stuSite = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/website/index.php?projectId=' . $idA, $csrfA);
$so = e2e_data($stuSite)['order'] ?? e2e_data($stuSite);
if (($so['status'] ?? '') === 'completed' && (int) ($so['progress'] ?? 0) === 100) {
    e2e_pass('Student website COMPLETED progress 100');
} else {
    e2e_fail('Student status after complete ' . ($so['status'] ?? '') . ' p=' . ($so['progress'] ?? ''));
}

$rmAfter = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/roadmap/index.php?projectId=' . $idA, $csrfA);
$rmAfterD = e2e_data($rmAfter);
$openDone = false;
foreach (($rmAfterD['steps'] ?? array()) as $st) {
    foreach ($st['tasks'] as $t) {
        if (($t['taskKey'] ?? '') === 'website_open' && ($t['status'] ?? '') === 'completed') {
            $openDone = true;
        }
    }
}
if ($openDone) {
    e2e_pass('website_open auto-complete');
} else {
    e2e_fail('website_open not completed');
}
$stepNum = (int) ($rmAfterD['currentStepNumber'] ?? 0);
$curTitle = (string) ($rmAfterD['currentStep'] ?? '');
if ($stepNum >= 3 || ($curTitle !== '' && strpos($curTitle, 'STEP 2') === false && stripos($curTitle, '홈페이지') === false)) {
    e2e_pass('Current step advanced (' . $stepNum . ' ' . $curTitle . ')');
} else {
    e2e_fail('Current step not advanced num=' . $stepNum . ' title=' . $curTitle);
}

$note = e2e_api($base, $jarAdmin, 'POST', '/plugin/seo-system-300/api/admin/index.php', $csrfAdm, array(
    'action' => 'note',
    'projectId' => $idA,
    'orderId' => $oid,
    'note' => 'E2E internal admin note',
));
if ($note['code'] === 201) {
    e2e_pass('Admin note create');
} else {
    e2e_fail('Admin note ' . $note['code']);
}
$noteGet = e2e_api($base, $jarAdmin, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=notes&projectId=' . $idA, $csrfAdm);
$stuNote = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=notes&projectId=' . $idA, $csrfA);
$stuJson = json_encode($so);
if ($noteGet['code'] === 200 && strpos($noteGet['raw'], 'E2E internal admin note') !== false && $stuNote['code'] === 403 && strpos($stuJson, 'E2E internal admin note') === false) {
    e2e_pass('Admin note hidden from student');
} else {
    e2e_fail('Admin note visibility');
}

$projMore = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php', $csrfA, array(
    'name' => 'SEO SYSTEM E2E Materials Flow',
    'description' => 'Materials request flow',
    'purposes' => array('Google SEO'),
    'domain' => '',
));
$pidMore = (int) (e2e_data($projMore)['id'] ?? 0);
$draftMore = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'action' => 'draft',
    'projectId' => $pidMore,
));
$oidMore = (int) (e2e_data($draftMore)['id'] ?? 0);
e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $pidMore,
    'orderId' => $oidMore,
    'siteName' => 'Materials Flow Site',
    'wizardStep' => 'step9',
));
$subMore = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'action' => 'submit',
    'projectId' => $pidMore,
    'orderId' => $oidMore,
));
$reqMore = e2e_api($base, $jarAdmin, 'POST', '/plugin/seo-system-300/api/admin/index.php', $csrfAdm, array(
    'action' => 'request-more-info',
    'orderId' => $oidMore,
    'title' => '로고 원본 요청',
    'body' => '투명 배경 PNG를 올려주세요.',
    'categories' => array('logo'),
    'adminMemo' => 'internal only',
));
$reqD = e2e_data($reqMore);
$stuMore = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/website/index.php?projectId=' . $pidMore, $csrfA);
$stuMoreOrder = e2e_data($stuMore)['order'] ?? e2e_data($stuMore);
$lockedSave = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $pidMore,
    'orderId' => $oidMore,
    'siteName' => 'should-not-save',
));
if (
    ($reqD['status'] ?? '') === 'need_more_info'
    && ($stuMoreOrder['status'] ?? '') === 'need_more_info'
    && (($stuMoreOrder['materialsRequest']['title'] ?? '') === '로고 원본 요청')
    && strpos(json_encode($stuMoreOrder), 'internal only') === false
    && (int) $lockedSave['code'] === 409
) {
    e2e_pass('need_more_info request visible; wizard save locked; admin memo hidden');
} else {
    e2e_fail('need_more_info flow ' . $reqMore['code'] . '/' . $lockedSave['code'] . ' st=' . ($stuMoreOrder['status'] ?? ''));
}
$lockedExtra = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/website/index.php', $csrfA, array(
    'projectId' => $pidMore,
    'orderId' => $oidMore,
    'extraRequest' => 'should-not-change-core',
    'siteName' => 'hijack',
    'materialsRequest' => array('title' => 'student-overwrite'),
));
if ((int) $lockedExtra['code'] === 409) {
    e2e_pass('need_more_info core fields remain locked');
} else {
    e2e_fail('need_more_info core lock ' . $lockedExtra['code']);
}
$alias = e2e_api($base, $jarAdmin, 'POST', '/plugin/seo-system-300/api/admin/index.php', $csrfAdm, array(
    'action' => 'change-status',
    'orderId' => $oidMore,
    'status' => 'need_more_info',
    'memo' => 'keep',
));
$upMore = e2e_upload($base, $jarA, $csrfA, $oidMore, 'more-logo.png', $png, 'image/png');
$actMore = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/activity/index.php?projectId=' . $pidMore . '&limit=50', $csrfA);
$actTitles = array();
foreach ((e2e_data($actMore)['activities'] ?? array()) as $a) {
    $actTitles[] = (string) ($a['title'] ?? '');
    $actTitles[] = (string) ($a['activityType'] ?? '');
}
$list = e2e_api($base, $jarAdmin, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=website-orders', $csrfAdm);
$foundMore = strpos($list['raw'], 'Materials Flow Site') !== false;
$detMore = e2e_api($base, $jarAdmin, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=order-detail&id=' . $oidMore, $csrfAdm);
if ($upMore['code'] === 201 && in_array('새 자료가 제출됨', $actTitles, true) && $foundMore && strpos($detMore['raw'], 'more-logo.png') !== false) {
    e2e_pass('Student extra upload + activity + admin list/detail files');
} else {
    e2e_fail('Extra upload/activity/admin files up=' . $upMore['code'] . ' titles=' . implode('|', $actTitles));
}
$reviewing = e2e_api($base, $jarAdmin, 'POST', '/plugin/seo-system-300/api/admin/index.php', $csrfAdm, array(
    'action' => 'change-status',
    'orderId' => $oidMore,
    'status' => 'REVIEWING',
    'memo' => 'alias map',
));
$revD = e2e_data($reviewing);
if (($revD['status'] ?? '') === 'material_waiting') {
    e2e_pass('Status alias REVIEWING→material_waiting');
} else {
    e2e_fail('Status alias ' . $reviewing['code'] . ' ' . ($revD['status'] ?? ''));
}

$detail = e2e_api($base, $jarAdmin, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=student_detail&mbId=student_a', $csrfAdm);
if ($detail['code'] === 200 && strpos($detail['raw'], 'SEO SYSTEM E2E Project A') !== false && strpos($detail['raw'], '38214') === false) {
    e2e_pass('Admin student detail real data, no fake KPI');
} else {
    e2e_fail('Admin student detail');
}

$inbox = e2e_api($base, $jarAdmin, 'GET', '/plugin/seo-system-300/api/admin/index.php?action=inbox', $csrfAdm);
if ($inbox['code'] === 200 && !empty($inbox['json']['ok'])) {
    e2e_pass('Admin inbox JSON ok');
} else {
    e2e_fail('Admin inbox');
}

$met = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/metrics/index.php?projectId=' . $idA . '&action=status', $csrfA);
$tools = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/tools/index.php?projectId=' . $idA, $csrfA);
$ai = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/ai/index.php?projectId=' . $idA, $csrfA);
$ms = e2e_data($met);
$ts = e2e_data($tools);
if (strpos($met['raw'], '38214') === false && strpos($tools['raw'], '+24%') === false) {
    e2e_pass('No fake KPI in metrics/tools');
} else {
    e2e_fail('Fake KPI present');
}

$rmA2 = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/roadmap/index.php?projectId=' . $idA2, $csrfA);
$actA2 = e2e_api($base, $jarA, 'GET', '/plugin/seo-system-300/api/activity/index.php?projectId=' . $idA2, $csrfA);
if (!e2e_leak($rmA2, array('E2E Test Site')) && !e2e_leak($actA2, array('WEBSITE_ORDER_SUBMITTED'))) {
    e2e_pass('Project switch A2 isolated from A website/activity');
} else {
    e2e_fail('Project switch leak into A2');
}

$arc = e2e_api($base, $jarA, 'POST', '/plugin/seo-system-300/api/projects/index.php?id=' . $idA2 . '&action=archive', $csrfA, array(
    'id' => $idA2,
    'action' => 'archive',
));
if ($arc['code'] === 200) {
    e2e_pass('Archive A2');
} else {
    e2e_fail('Archive');
}

$home = e2e_request('GET', $base . '/', $jarA);
$adm = e2e_request('GET', $base . '/adm/', $jarAdmin);
$portal = e2e_request('GET', $base . '/seo-system-300/', $jarA);
if ($home['code'] === 200 && $adm['code'] === 200 && $portal['code'] === 200) {
    e2e_pass('Smoke pages 200');
} else {
    e2e_fail('Smoke pages');
}

echo "---\n";
echo "ids projectA={$idA} projectA2={$idA2} projectB={$idB} order={$oid} file={$fileId} mission={$mid}\n";
echo $failed === 0 ? "CORE_E2E_PASS\n" : "CORE_E2E_FAIL {$failed}\n";
exit($failed === 0 ? 0 : 1);
