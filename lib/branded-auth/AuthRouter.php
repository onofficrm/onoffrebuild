<?php
namespace OnoffMarketing\BrandedAuth;

/**
 * HTTP router for CatchDomain PHP Auth Bridge.
 * Browser → /api/auth/* → this → Core Staging (never browser→Core).
 */
final class AuthRouter
{
    public static function handle(string $action, string $method): void
    {
        self::corsHeaders();
        if ($method === 'OPTIONS') {
            http_response_code(204);
            exit;
        }

        try {
            if (!BrandedAuthConfig::isEnabled() || !BrandedAuthConfig::isPlatformAuthEnabled()) {
                self::jsonError(AuthErrors::DISABLED, AuthErrors::userMessage(AuthErrors::DISABLED), 503);
            }
            if (!BrandedAuthConfig::isConfigured()) {
                self::jsonError(AuthErrors::NOT_CONFIGURED, AuthErrors::userMessage(AuthErrors::NOT_CONFIGURED), 503);
            }

            $cookies = (string) ($_SERVER['HTTP_COOKIE'] ?? '');
            $body = self::readJsonBody();

            switch ($action) {
                case 'config':
                    self::requireMethod($method, array('GET'));
                    self::jsonOk(BrandedAuthConfig::publicConfig());
                    break;

                case 'session':
                    self::requireMethod($method, array('GET'));
                    $sess = PlatformAuthService::getSession($cookies);
                    CookieJar::forwardToBrowser($sess['setCookies']);
                    if ($sess['sessionExpired']) {
                        self::jsonOk(array(
                            'loggedIn' => false,
                            'sessionExpired' => true,
                            'ssoState' => $sess['ssoState'],
                        ), 401);
                    }
                    $d = $sess['data'];
                    $pointBalance = $d['point_balance'] ?? null;
                    if ($sess['authenticated'] && $pointBalance === null) {
                        try {
                            $p = PlatformAuthService::getPoints($cookies, 1);
                            $pointBalance = $p['balance'];
                        } catch (\Throwable $e) {
                            $pointBalance = null;
                        }
                    }
                    self::jsonOk(array(
                        'loggedIn' => $sess['authenticated'],
                        'sessionExpired' => false,
                        'mbId' => (string) ($d['member_id'] ?? $d['mb_id'] ?? ''),
                        'mbName' => (string) ($d['display_name'] ?? $d['mb_name'] ?? ''),
                        'platform' => (string) ($d['platform'] ?? BrandedAuthConfig::platformId()),
                        'pointBalance' => $pointBalance,
                        'balance' => $pointBalance,
                        'memberLevel' => (int) ($d['member_level'] ?? 0),
                        'brandedAuth' => true,
                    ));
                    break;

                case 'login':
                    self::requireMethod($method, array('POST'));
                    $login = (string) ($body['mb_id'] ?? $body['login'] ?? '');
                    $password = (string) ($body['mb_password'] ?? $body['password'] ?? '');
                    $returnPath = SafeReturnPath::sanitize((string) ($body['returnPath'] ?? $body['return'] ?? ''), '/');
                    if ($login === '' || $password === '') {
                        self::jsonError(AuthErrors::INVALID_CREDENTIALS, AuthErrors::userMessage(AuthErrors::INVALID_CREDENTIALS), 401);
                    }
                    // Admin-only pilot gate — block before Core platform login.
                    if (!BrandedAuthConfig::isPilotLoginCandidate($login)) {
                        self::jsonError(
                            AuthErrors::PILOT_DENIED,
                            AuthErrors::userMessage(AuthErrors::PILOT_DENIED),
                            AuthErrors::httpStatus(AuthErrors::PILOT_DENIED)
                        );
                    }
                    $res = PlatformAuthService::login($login, $password, $cookies);
                    $mbId = (string) ($res['data']['member_id'] ?? $res['data']['mb_id'] ?? $login);
                    if (!BrandedAuthConfig::isPilotMember($mbId)) {
                        CookieJar::clearBrowserSessionCookies();
                        self::jsonError(
                            AuthErrors::PILOT_DENIED,
                            AuthErrors::userMessage(AuthErrors::PILOT_DENIED),
                            AuthErrors::httpStatus(AuthErrors::PILOT_DENIED)
                        );
                    }
                    CookieJar::emitBrowserSessionCookies(true, $res['data'], $res['setCookies']);
                    self::jsonOk(array(
                        'ok' => true,
                        'pilot' => true,
                        'returnPath' => $returnPath,
                        'returnUrl' => $returnPath,
                        'mbId' => $mbId,
                    ));
                    break;

                case 'signup':
                    self::requireMethod($method, array('POST'));
                    // Admin canary: open signup blocked while pilot gate is active.
                    if (BrandedAuthConfig::isPilotOnly()) {
                        self::jsonError(
                            AuthErrors::PILOT_DENIED,
                            AuthErrors::userMessage(AuthErrors::PILOT_DENIED),
                            AuthErrors::httpStatus(AuthErrors::PILOT_DENIED)
                        );
                    }
                    $email = (string) ($body['mb_email'] ?? $body['email'] ?? '');
                    $name = (string) ($body['mb_name'] ?? $body['name'] ?? '');
                    $password = (string) ($body['mb_password'] ?? $body['password'] ?? '');
                    $phone = (string) ($body['mb_hp'] ?? $body['phone'] ?? '');
                    if ($email === '' || $name === '' || $password === '') {
                        self::jsonError('VALIDATION', '필수 항목을 입력해 주세요.', 400);
                    }
                    try {
                        $res = PlatformAuthService::signup($email, $name, $password, $cookies, $phone);
                    } catch (BrandedAuthException $e) {
                        // Some Core signup paths create the member but close the request before
                        // returning JSON. If the new credentials authenticate, treat it as a
                        // successful signup so the browser does not show a false failure.
                        if ($e->errorCode !== AuthErrors::NETWORK_ERROR) {
                            throw $e;
                        }
                        $res = PlatformAuthService::login($email, $password, $cookies);
                        $res['data']['signup_recovered'] = true;
                    }
                    CookieJar::emitBrowserSessionCookies(true, $res['data'], $res['setCookies']);
                    self::jsonOk(array(
                        'ok' => true,
                        'signup_platform' => BrandedAuthConfig::signupPlatform(),
                        'mbId' => (string) ($res['data']['member_id'] ?? $res['data']['mb_id'] ?? ''),
                        'signupRecovered' => !empty($res['data']['signup_recovered']),
                    ));
                    break;

                case 'logout':
                    self::requireMethod($method, array('POST'));
                    $res = PlatformAuthService::logout($cookies);
                    CookieJar::forwardNonSessionUpstreamCookies($res['setCookies']);
                    CookieJar::clearBrowserSessionCookies();
                    self::jsonOk(array('ok' => true));
                    break;

                case 'profile':
                    if ($method === 'GET') {
                        $res = PlatformAuthService::getProfile($cookies);
                        CookieJar::forwardToBrowser($res['setCookies']);
                        $mapped = PlatformAuthService::mapProfile($res['data']);
                        $points = null;
                        try {
                            $p = PlatformAuthService::getPoints($cookies, 5);
                            $points = $p['balance'];
                        } catch (\Throwable $e) {
                            // optional
                        }
                        self::jsonOk(array('profile' => $mapped, 'balance' => $points));
                    }
                    self::requireMethod($method, array('POST', 'PATCH'));
                    $fields = array();
                    if (isset($body['mb_name']) || isset($body['name'])) {
                        $fields['name'] = (string) ($body['mb_name'] ?? $body['name']);
                    }
                    if (isset($body['mb_hp']) || isset($body['phone'])) {
                        $fields['phone'] = (string) ($body['mb_hp'] ?? $body['phone']);
                    }
                    $res = PlatformAuthService::updateProfile($cookies, $fields);
                    CookieJar::forwardToBrowser($res['setCookies']);
                    self::jsonOk(array('profile' => PlatformAuthService::mapProfile($res['data'])));
                    break;

                case 'password':
                    self::requireMethod($method, array('POST'));
                    $res = PlatformAuthService::changePassword(
                        $cookies,
                        (string) ($body['current_password'] ?? ''),
                        (string) ($body['new_password'] ?? ''),
                        (string) ($body['new_password_confirm'] ?? '')
                    );
                    CookieJar::forwardToBrowser($res['setCookies']);
                    self::jsonOk(array('ok' => true));
                    break;

                case 'password_forgot':
                case 'password/forgot':
                    self::requireMethod($method, array('POST'));
                    $email = (string) ($body['mb_email'] ?? $body['email'] ?? '');
                    $res = PlatformAuthService::passwordRecovery($email, $cookies);
                    CookieJar::forwardToBrowser($res['setCookies']);
                    self::jsonOk($res['data']);
                    break;

                case 'points':
                    self::requireMethod($method, array('GET'));
                    $limit = (int) ($_GET['limit'] ?? 50);
                    $res = PlatformAuthService::getPoints($cookies, $limit);
                    CookieJar::forwardToBrowser($res['setCookies']);
                    self::jsonOk(array(
                        'balance' => $res['balance'],
                        'history' => $res['history'],
                        'label' => '통합 포인트',
                    ));
                    break;

                case 'icrm-continue':
                case 'icrm_continue':
                    self::requireMethod($method, array('GET'));
                    $toRaw = (string) ($_GET['to'] ?? $_GET['path'] ?? '/point_center.php?tab=charge');
                    $toPath = self::safeIcrmContinuePath($toRaw);
                    $targetUrl = 'https://icrm.co.kr' . $toPath;
                    $sess = PlatformAuthService::getSession($cookies);
                    if ($sess['sessionExpired']) {
                        self::jsonError(AuthErrors::SESSION_EXPIRED, '세션이 만료되었습니다. 다시 로그인해 주세요.', 401);
                    }
                    if (!$sess['authenticated']) {
                        self::jsonError('unauthorized', '로그인이 필요합니다.', 401);
                    }
                    $mbId = (string) ($sess['data']['member_id'] ?? $sess['data']['mb_id'] ?? '');
                    if ($mbId !== '' && !BrandedAuthConfig::isPilotMember($mbId)) {
                        self::jsonError(
                            AuthErrors::PILOT_DENIED,
                            AuthErrors::userMessage(AuthErrors::PILOT_DENIED),
                            AuthErrors::httpStatus(AuthErrors::PILOT_DENIED)
                        );
                    }
                    $b = is_array($sess['data']['bff_session_bootstrap'] ?? null)
                        ? $sess['data']['bff_session_bootstrap']
                        : array();
                    $fromBootstrap = null;
                    if (trim((string) ($b['session_id'] ?? '')) !== '') {
                        $fromBootstrap = array(
                            'cookieName' => trim((string) ($b['cookie_name'] ?? 'PHPSESSID')) ?: 'PHPSESSID',
                            'sessionId' => trim((string) $b['session_id']),
                        );
                    }
                    $fromCookie = self::extractSessionCookie($cookies);
                    // Prefer Core-authoritative bootstrap (handles duplicate host-only vs Domain cookies).
                    $resolved = $fromBootstrap !== null ? $fromBootstrap : $fromCookie;
                    if ($resolved === null) {
                        self::jsonError('SESSION_COOKIE_MISSING', '세션 쿠키를 확인할 수 없습니다. 다시 로그인해 주세요.', 401);
                    }
                    $domain = CookieJar::resolveSessionCookieDomain($sess['data']) ?: '.icrm.co.kr';
                    CookieJar::clearBrowserSessionCookies($resolved['cookieName']);
                    $parts = array(
                        $resolved['cookieName'] . '=' . $resolved['sessionId'],
                        'Path=/',
                        'HttpOnly',
                        'Secure',
                        'SameSite=Lax',
                        'Domain=' . $domain,
                    );
                    header('Set-Cookie: ' . implode('; ', $parts), false);
                    header('Location: ' . $targetUrl, true, 302);
                    exit;

                case 'sso_exchange':
                case 'sso/exchange':
                    self::requireMethod($method, array('POST'));
                    if (!BrandedAuthConfig::isPlatformSsoEnabled()) {
                        self::jsonError(
                            AuthErrors::SSO_DISABLED,
                            AuthErrors::userMessage(AuthErrors::SSO_DISABLED),
                            AuthErrors::httpStatus(AuthErrors::SSO_DISABLED)
                        );
                    }
                    $code = (string) ($body['code'] ?? $body['authorization_code'] ?? '');
                    $returnPath = SafeReturnPath::sanitize((string) ($body['returnPath'] ?? ''), '/');
                    if ($code === '') {
                        self::jsonError(AuthErrors::SSO_CODE_INVALID, AuthErrors::userMessage(AuthErrors::SSO_CODE_INVALID), 400);
                    }
                    $res = PlatformAuthService::exchangeSsoCode($code, $cookies);
                    $mbId = (string) ($res['data']['member_id'] ?? $res['data']['mb_id'] ?? '');
                    if (!BrandedAuthConfig::isPilotMember($mbId)) {
                        CookieJar::clearBrowserSessionCookies();
                        self::jsonError(
                            AuthErrors::PILOT_DENIED,
                            AuthErrors::userMessage(AuthErrors::PILOT_DENIED),
                            AuthErrors::httpStatus(AuthErrors::PILOT_DENIED)
                        );
                    }
                    CookieJar::emitBrowserSessionCookies(true, $res['data'], $res['setCookies']);
                    self::jsonOk(array(
                        'ok' => true,
                        'pilot' => true,
                        'returnPath' => $returnPath,
                        'mbId' => $mbId,
                    ));
                    break;

                default:
                    self::jsonError('NOT_FOUND', 'Unknown auth action', 404);
            }
        } catch (BrandedAuthException $e) {
            // Login/signup establish failures: drop bad jar so next attempt is clean.
            if (in_array($action, array('login', 'signup'), true)) {
                CookieJar::clearBrowserSessionCookies();
            }
            self::jsonError($e->errorCode, $e->getMessage(), $e->httpStatus);
        } catch (\Throwable $e) {
            if (in_array($action, array('login', 'signup'), true)) {
                CookieJar::clearBrowserSessionCookies();
            }
            self::jsonError(AuthErrors::CORE_UNAVAILABLE, AuthErrors::userMessage(AuthErrors::CORE_UNAVAILABLE), 502);
        }
    }

    /** @param string[] $allowed */
    private static function requireMethod(string $method, array $allowed): void
    {
        if (!in_array($method, $allowed, true)) {
            self::jsonError('METHOD_NOT_ALLOWED', 'Method not allowed', 405);
        }
    }

    /** Relative iCRM path only — blocks open redirects. */
    private static function safeIcrmContinuePath(string $raw): string
    {
        $fallback = '/point_center.php?tab=charge';
        $input = trim($raw) !== '' ? trim($raw) : $fallback;
        if ($input === '' || $input[0] !== '/' || strpos($input, '//') === 0) {
            return $fallback;
        }
        $parts = parse_url('https://icrm.co.kr' . $input);
        if (!is_array($parts) || (($parts['host'] ?? '') !== 'icrm.co.kr')) {
            return $fallback;
        }
        $path = (string) ($parts['path'] ?? '/');
        $query = isset($parts['query']) ? ('?' . $parts['query']) : '';
        return $path . $query;
    }

    /** @return array{cookieName:string,sessionId:string}|null */
    private static function extractSessionCookie(string $cookieHeader): ?array
    {
        $found = null;
        foreach (explode(';', $cookieHeader) as $part) {
            $trimmed = trim($part);
            $eq = strpos($trimmed, '=');
            if ($eq === false) {
                continue;
            }
            $name = trim(substr($trimmed, 0, $eq));
            $value = trim(substr($trimmed, $eq + 1));
            if ($value === '' || !preg_match('/^(PHPSESSID|G5\d*PHPSESSID)$/i', $name)) {
                continue;
            }
            $found = array('cookieName' => $name, 'sessionId' => $value);
        }
        return $found;
    }

    /** @return array<string, mixed> */
    private static function readJsonBody(): array
    {
        $raw = file_get_contents('php://input');
        if (!is_string($raw) || trim($raw) === '') {
            return $_POST ?: array();
        }
        $j = json_decode($raw, true);
        return is_array($j) ? $j : array();
    }

    private static function corsHeaders(): void
    {
        $origin = (string) ($_SERVER['HTTP_ORIGIN'] ?? '');
        $allowed = array(
            'https://onoff.icrm.co.kr',
            'http://127.0.0.1:3000',
            'http://localhost:3000',
            'http://127.0.0.1:' . BrandedAuthConfig::localBridgePort(),
            BrandedAuthConfig::publicOrigin(),
        );
        if ($origin !== '' && in_array($origin, $allowed, true)) {
            header('Access-Control-Allow-Origin: ' . $origin);
            header('Access-Control-Allow-Credentials: true');
            header('Access-Control-Allow-Headers: Content-Type, X-CSRF-Token, Accept');
            header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');
        }
        header('Cache-Control: no-store');
        header('X-Content-Type-Options: nosniff');
    }

    /** @param mixed $data */
    private static function jsonOk($data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array('ok' => true, 'success' => true, 'data' => $data), JSON_UNESCAPED_UNICODE);
        exit;
    }

    private static function jsonError(string $code, string $message, int $status): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(array(
            'ok' => false,
            'success' => false,
            'error' => $code,
            'code' => $code,
            'message' => $message,
        ), JSON_UNESCAPED_UNICODE);
        exit;
    }
}
