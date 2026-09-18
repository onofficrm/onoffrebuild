<?php
namespace OnoffMarketing\BrandedAuth;

/**
 * Platform Auth service — Traffic contract ported to PHP.
 * No local member/password/point SoT.
 */
final class PlatformAuthService
{
    /**
     * @return array{token:string,cookies:string,setCookies:string[]}
     */
    public static function fetchCsrf(string $cookies): array
    {
        $result = PlatformAuthClient::request('auth/csrf', array(
            'method' => 'GET',
            'cookies' => $cookies,
            'query' => array('platform_id' => BrandedAuthConfig::platformId()),
        ));
        if (!$result['ok']) {
            throw self::fromResult($result, 'CSRF fetch failed');
        }
        $merged = CookieJar::merge($cookies, $result['setCookies']);
        return array(
            'token' => (string) (($result['data']['csrf_token'] ?? '')),
            'cookies' => $merged,
            'setCookies' => $result['setCookies'],
        );
    }

    /**
     * @return array{authenticated:bool,sessionExpired:bool,ssoState:string,data:array,setCookies:string[]}
     */
    public static function getSession(string $cookies): array
    {
        $result = PlatformAuthClient::request('auth/session', array(
            'method' => 'GET',
            'cookies' => $cookies,
            'query' => array('platform_id' => BrandedAuthConfig::platformId()),
        ));
        if (!$result['ok'] && $result['status'] >= 500) {
            throw self::fromResult($result, 'Session probe failed');
        }
        $data = is_array($result['data']) ? $result['data'] : array();
        $ssoState = (string) ($data['sso_state'] ?? '');
        if ($ssoState === 'SESSION_EXPIRED' || ($result['code'] ?? '') === 'SESSION_EXPIRED') {
            return array(
                'authenticated' => false,
                'sessionExpired' => true,
                'ssoState' => 'SESSION_EXPIRED',
                'data' => $data,
                'setCookies' => $result['setCookies'],
            );
        }
        $authenticated = !empty($data['authenticated']) || $ssoState === 'AUTHENTICATED';
        return array(
            'authenticated' => $authenticated,
            'sessionExpired' => false,
            'ssoState' => $ssoState,
            'data' => $data,
            'setCookies' => $result['setCookies'],
        );
    }

    /**
     * @return array{data:array,setCookies:string[]}
     */
    public static function login(string $login, string $password, string $cookies, ?string $returnUrl = null): array
    {
        // Never reuse inbound PHPSESSID — stale jar → CSRF_INVALID / session 401 loop.
        $clean = CookieJar::stripSessionCookies($cookies);
        $csrf = self::fetchCsrf($clean);
        $body = array(
            'platform_id' => BrandedAuthConfig::platformId(),
            'login' => $login,
            'password' => $password,
            'csrf_token' => $csrf['token'],
        );
        // Omit return_url by default (Core allowlist) — local frontend handles returnPath
        if ($returnUrl) {
            $body['return_url'] = $returnUrl;
        }
        $result = PlatformAuthClient::request('auth/login', array(
            'method' => 'POST',
            'body' => $body,
            'cookies' => $csrf['cookies'],
        ));
        $setCookies = array_merge($csrf['setCookies'], $result['setCookies']);
        if (!$result['ok']) {
            throw self::fromResult($result, 'Login failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $setCookies);
    }

    /**
     * @return array{data:array,setCookies:string[]}
     */
    public static function signup(string $email, string $name, string $password, string $cookies, string $phone = ''): array
    {
        $clean = CookieJar::stripSessionCookies($cookies);
        $csrf = self::fetchCsrf($clean);
        $result = PlatformAuthClient::request('auth/signup', array(
            'method' => 'POST',
            'body' => array(
                'signup_platform' => BrandedAuthConfig::signupPlatform(),
                'email' => $email,
                'name' => $name,
                'password' => $password,
                'phone' => $phone,
                'csrf_token' => $csrf['token'],
            ),
            'cookies' => $csrf['cookies'],
        ));
        $setCookies = array_merge($csrf['setCookies'], $result['setCookies']);
        if (!$result['ok']) {
            throw self::fromResult($result, 'Signup failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $setCookies);
    }

    /**
     * @return array{ok:bool,setCookies:string[]}
     */
    public static function logout(string $cookies): array
    {
        $result = PlatformAuthClient::request('auth/logout', array(
            'method' => 'POST',
            'body' => array('scope' => 'global'),
            'cookies' => $cookies,
        ));
        return array('ok' => $result['ok'], 'setCookies' => $result['setCookies']);
    }

    /** @return array{data:array,setCookies:string[]} */
    public static function getProfile(string $cookies): array
    {
        $result = PlatformAuthClient::request('auth/profile', array('method' => 'GET', 'cookies' => $cookies));
        if (!$result['ok']) {
            throw self::fromResult($result, 'Profile failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $result['setCookies']);
    }

    /**
     * @param array<string, mixed> $fields
     * @return array{data:array,setCookies:string[]}
     */
    public static function updateProfile(string $cookies, array $fields): array
    {
        $csrf = self::fetchCsrf($cookies);
        $body = array_merge($fields, array(
            'csrf_token' => $csrf['token'],
            'platform_id' => BrandedAuthConfig::platformId(),
        ));
        $result = PlatformAuthClient::request('auth/profile', array(
            'method' => 'POST',
            'body' => $body,
            'cookies' => $csrf['cookies'],
        ));
        $setCookies = array_merge($csrf['setCookies'], $result['setCookies']);
        if (!$result['ok']) {
            throw self::fromResult($result, 'Profile update failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $setCookies);
    }

    /** @return array{data:array,setCookies:string[]} */
    public static function changePassword(
        string $cookies,
        string $current,
        string $newPassword,
        string $confirm
    ): array {
        $csrf = self::fetchCsrf($cookies);
        $result = PlatformAuthClient::request('auth/password/change', array(
            'method' => 'POST',
            'body' => array(
                'platform_id' => BrandedAuthConfig::platformId(),
                'current_password' => $current,
                'new_password' => $newPassword,
                'new_password_confirm' => $confirm,
                'csrf_token' => $csrf['token'],
            ),
            'cookies' => $csrf['cookies'],
        ));
        $setCookies = array_merge($csrf['setCookies'], $result['setCookies']);
        if (!$result['ok']) {
            throw self::fromResult($result, 'Password change failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $setCookies);
    }

    /** @return array{data:array,setCookies:string[]} */
    public static function passwordRecovery(string $email, string $cookies): array
    {
        $csrf = self::fetchCsrf($cookies);
        $result = PlatformAuthClient::request('auth/password/recovery', array(
            'method' => 'POST',
            'body' => array(
                'platform_id' => BrandedAuthConfig::platformId(),
                'email' => $email,
                'csrf_token' => $csrf['token'],
            ),
            'cookies' => $csrf['cookies'],
        ));
        $setCookies = array_merge($csrf['setCookies'], $result['setCookies']);
        // Always return generic success to browser; do not enumerate accounts
        if (!$result['ok'] && ($result['status'] ?? 0) >= 500) {
            throw self::fromResult($result, 'Password recovery failed');
        }
        return array(
            'data' => array('ok' => true, 'message' => '요청이 접수되었습니다. 이메일을 확인해 주세요.'),
            'setCookies' => $setCookies,
        );
    }

    /** @return array{balance:mixed,history:array,setCookies:string[]} */
    public static function getPoints(string $cookies, int $limit = 50): array
    {
        $summary = PlatformAuthClient::request('auth/point/summary', array(
            'method' => 'GET',
            'cookies' => $cookies,
        ));
        if (!$summary['ok']) {
            throw self::fromResult($summary, 'Point summary failed');
        }
        $hist = PlatformAuthClient::request('auth/point/history', array(
            'method' => 'GET',
            'cookies' => $cookies,
            'query' => array('limit' => max(1, min(100, $limit))),
        ));
        $history = array();
        if ($hist['ok'] && is_array($hist['data'])) {
            $history = $hist['data']['history'] ?? $hist['data']['items'] ?? $hist['data'];
            if (!is_array($history)) {
                $history = array();
            }
        }
        $bal = is_array($summary['data'])
            ? ($summary['data']['point_balance'] ?? $summary['data']['balance'] ?? $summary['data'])
            : 0;
        return array(
            'balance' => $bal,
            'history' => $history,
            'setCookies' => array_merge($summary['setCookies'], $hist['setCookies'] ?? array()),
        );
    }

    /** @return array{data:array,setCookies:string[]} */
    public static function exchangeSsoCode(string $code, string $cookies, ?string $callbackUrl = null): array
    {
        $callback = $callbackUrl ?: BrandedAuthConfig::ssoCallbackUrl();
        $result = PlatformAuthClient::request('auth/sso/code/exchange', array(
            'method' => 'POST',
            'body' => array(
                'target_platform' => BrandedAuthConfig::platformId(),
                'callback_url' => $callback,
                'authorization_code' => $code,
            ),
            'cookies' => $cookies,
        ));
        if (!$result['ok']) {
            throw self::fromResult($result, 'SSO exchange failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $result['setCookies']);
    }

    /**
     * Server-side SSO issue (Core contract test — not exposed to browser).
     *
     * @return array{data:array,setCookies:string[]}
     */
    public static function issueSsoCode(
        string $cookies,
        string $targetPlatform,
        string $callbackUrl,
        string $sourcePlatform = ''
    ): array {
        $csrf = self::fetchCsrf($cookies);
        $body = array(
            'source_platform' => $sourcePlatform !== '' ? $sourcePlatform : BrandedAuthConfig::platformId(),
            'target_platform' => $targetPlatform,
            'callback_url' => $callbackUrl,
            'csrf_token' => $csrf['token'],
        );
        $result = PlatformAuthClient::request('auth/sso/code/issue', array(
            'method' => 'POST',
            'body' => $body,
            'cookies' => $csrf['cookies'],
        ));
        $setCookies = array_merge($csrf['setCookies'], $result['setCookies']);
        if (!$result['ok']) {
            throw self::fromResult($result, 'SSO issue failed');
        }
        return array('data' => is_array($result['data']) ? $result['data'] : array(), 'setCookies' => $setCookies);
    }

    /** @param array<string, mixed> $profile */
    public static function mapProfile(array $profile): array
    {
        return array(
            'mbId' => (string) ($profile['member_id'] ?? $profile['mb_id'] ?? ''),
            'mbName' => (string) ($profile['display_name'] ?? $profile['mb_name'] ?? ''),
            'mbNick' => (string) ($profile['nickname'] ?? $profile['mb_nick'] ?? ''),
            'email' => (string) ($profile['email'] ?? $profile['email_masked'] ?? ''),
            'phone' => (string) ($profile['phone'] ?? $profile['phone_masked'] ?? ''),
            'signupPlatform' => (string) ($profile['signup_platform'] ?? BrandedAuthConfig::signupPlatform()),
            'lastLoginPlatform' => (string) ($profile['last_login_platform'] ?? ''),
            'memberLevel' => (int) ($profile['member_level'] ?? 0),
        );
    }

    /**
     * @param array{ok:bool,code:string,message:string,status:int} $result
     */
    private static function fromResult(array $result, string $fallback): BrandedAuthException
    {
        $code = AuthErrors::normalizeCoreCode((string) ($result['code'] ?? 'ERROR'));
        if (($result['status'] ?? 0) >= 500 && $code === 'HTTP_ERROR') {
            $code = AuthErrors::CORE_UNAVAILABLE;
        }
        $msg = AuthErrors::userMessage($code);
        if ($code === 'ERROR' && $fallback !== '') {
            $msg = AuthErrors::userMessage(AuthErrors::CORE_UNAVAILABLE);
            $code = AuthErrors::CORE_UNAVAILABLE;
        }
        return new BrandedAuthException($msg, $code, (int) ($result['status'] ?? 0));
    }
}
