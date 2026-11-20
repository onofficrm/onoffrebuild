<?php
namespace OnoffMarketing\BrandedAuth;

/**
 * Cookie jar merge + Set-Cookie forwarding (Traffic platformAuthService pattern).
 */
final class CookieJar
{
    /**
     * @param string[] $setCookieHeaders
     */
    public static function merge(string $jar, array $setCookieHeaders): string
    {
        $next = (string) $jar;
        foreach ($setCookieHeaders as $header) {
            $parts = preg_split('/,(?=[^;]+?=)/', (string) $header) ?: array();
            foreach ($parts as $part) {
                $segment = trim(explode(';', $part, 2)[0]);
                if ($segment === '' || strpos($segment, '=') === false) {
                    continue;
                }
                $name = explode('=', $segment, 2)[0];
                $regex = '/(?:^|;\s*)' . preg_quote($name, '/') . '=[^;]*/';
                $next = preg_replace($regex, '', $next) ?? $next;
                $next = ltrim($next, " \t;");
                $next = $next !== '' ? ($next . '; ' . $segment) : $segment;
            }
        }
        return $next;
    }

    /**
     * Extract Set-Cookie header lines from curl header blob.
     *
     * @return string[]
     */
    public static function extractSetCookies(string $rawHeaders): array
    {
        $out = array();
        foreach (explode("\r\n", $rawHeaders) as $line) {
            if (stripos($line, 'Set-Cookie:') === 0) {
                $out[] = trim(substr($line, strlen('Set-Cookie:')));
            }
        }
        return $out;
    }

    /**
     * Emit Set-Cookie headers to browser (PHP).
     *
     * @param string[] $setCookieHeaders
     */
    public static function forwardToBrowser(array $setCookieHeaders): void
    {
        foreach ($setCookieHeaders as $cookie) {
            if ($cookie === '') {
                continue;
            }
            // Prevent Domain=.icrm.co.kr shared cookie activation in local tests
            if (self::isSharedIcrmDomainCookie($cookie) && !self::allowSharedDomainCookies()) {
                continue;
            }
            header('Set-Cookie: ' . $cookie, false);
        }
    }

    /**
     * @param array<string, mixed> $data
     */
    public static function applySessionBootstrap(array $data): void
    {
        $b = $data['bff_session_bootstrap'] ?? null;
        if (!is_array($b)) {
            return;
        }
        $name = (string) ($b['cookie_name'] ?? '');
        $sid = (string) ($b['session_id'] ?? '');
        if ($name === '' || $sid === '') {
            return;
        }
        $parts = array(
            $name . '=' . $sid,
            'Path=' . ((string) ($b['cookie_path'] ?? '/') ?: '/'),
            'HttpOnly',
        );
        if (!empty($b['secure'])) {
            $parts[] = 'Secure';
        }
        $domain = (string) ($b['cookie_domain'] ?? '');
        if ($domain !== '' && self::allowSharedDomainCookies()) {
            $parts[] = 'Domain=' . $domain;
        }
        $ss = (string) ($b['samesite'] ?? 'Lax');
        if ($ss !== '') {
            $parts[] = 'SameSite=' . $ss;
        }
        header('Set-Cookie: ' . implode('; ', $parts), false);
    }

    private static function isSharedIcrmDomainCookie(string $cookie): bool
    {
        return (bool) preg_match('/;\s*Domain=\.?icrm\.co\.kr/i', $cookie);
    }

    /**
     * Shared Domain=.icrm.co.kr so Core / sibling platforms see the same Unified session.
     * Explicit false/0 disables; true/1 enables; otherwise auto-on for *.icrm.co.kr hosts.
     */
    private static function allowSharedDomainCookies(): bool
    {
        $v = strtolower(trim((string) (getenv('ONOFF_ALLOW_ICRM_SHARED_COOKIE') ?: '')));
        if ($v === 'false' || $v === '0' || $v === 'off' || $v === 'no') {
            return false;
        }
        if ($v === 'true' || $v === '1' || $v === 'on' || $v === 'yes') {
            return true;
        }
        $host = strtolower((string) (getenv('ONOFF_PUBLIC_HOST') ?: getenv('BFF_PUBLIC_HOST') ?: ''));
        if ($host === '') {
            $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
        }
        $host = preg_replace('#^https?://#i', '', $host);
        $host = explode('/', $host)[0];
        $host = preg_replace('/:\d+$/', '', $host);
        return $host === 'icrm.co.kr' || substr($host, -strlen('.icrm.co.kr')) === '.icrm.co.kr';
    }

    private static function isSessionCookieName(string $name): bool
    {
        return (bool) preg_match('/^(PHPSESSID|G5\d*PHPSESSID)$/i', trim($name));
    }

    /**
     * Drop stale PHPSESSID from inbound Cookie header before login/signup CSRF.
     */
    public static function stripSessionCookies(string $cookieHeader): string
    {
        $raw = trim($cookieHeader);
        if ($raw === '') {
            return '';
        }
        $parts = array();
        foreach (explode(';', $raw) as $part) {
            $part = trim($part);
            if ($part === '' || strpos($part, '=') === false) {
                continue;
            }
            $name = trim(explode('=', $part, 2)[0]);
            if (self::isSessionCookieName($name)) {
                continue;
            }
            $parts[] = $part;
        }
        return implode('; ', $parts);
    }

    /** Expire host-only + shared-domain session cookies before canonical Set-Cookie. */
    public static function clearBrowserSessionCookies(string $cookieName = 'PHPSESSID'): void
    {
        $name = trim($cookieName) !== '' ? trim($cookieName) : 'PHPSESSID';
        $base = $name . '=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax';
        header('Set-Cookie: ' . $base, false);
        if (self::allowSharedDomainCookies()) {
            header('Set-Cookie: ' . $base . '; Domain=.icrm.co.kr', false);
        }
    }

    private static function isSessionCookieHeader(string $cookie): bool
    {
        $name = trim(explode('=', $cookie, 2)[0]);
        return self::isSessionCookieName($name);
    }

    /**
     * Forward non-session upstream cookies only (never duplicate PHPSESSID attrs).
     *
     * @param string[] $setCookieHeaders
     */
    public static function forwardNonSessionUpstreamCookies(array $setCookieHeaders): void
    {
        $nonSession = array();
        foreach ($setCookieHeaders as $cookie) {
            if ($cookie === '' || self::isSessionCookieHeader($cookie)) {
                continue;
            }
            $nonSession[] = $cookie;
        }
        self::forwardToBrowser($nonSession);
    }

    /**
     * @param array<string, mixed> $data
     * @return array{cookieName:string,sessionId:string}|null
     */
    public static function resolveEstablishedSessionId(array $data, array $setCookies): ?array
    {
        $b = is_array($data['bff_session_bootstrap'] ?? null) ? $data['bff_session_bootstrap'] : array();
        $cookieName = trim((string) ($b['cookie_name'] ?? 'PHPSESSID'));
        if ($cookieName === '') {
            $cookieName = 'PHPSESSID';
        }
        $fromBootstrap = trim((string) ($b['session_id'] ?? ''));
        if ($fromBootstrap !== '') {
            return array('cookieName' => $cookieName, 'sessionId' => $fromBootstrap);
        }

        $sessionId = '';
        $nameFromUpstream = $cookieName;
        foreach ($setCookies as $header) {
            if (!self::isSessionCookieHeader($header)) {
                continue;
            }
            $eq = strpos($header, '=');
            if ($eq === false) {
                continue;
            }
            $name = trim(substr($header, 0, $eq));
            $rest = substr($header, $eq + 1);
            $semi = strpos($rest, ';');
            $value = trim($semi === false ? $rest : substr($rest, 0, $semi));
            if ($value === '') {
                continue;
            }
            $sessionId = $value;
            $nameFromUpstream = $name !== '' ? $name : $cookieName;
        }
        if ($sessionId === '') {
            return null;
        }
        return array('cookieName' => $nameFromUpstream, 'sessionId' => $sessionId);
    }

    /** @param array<string, mixed> $data */
    public static function resolveSessionCookieDomain(array $data): string
    {
        $fromEnv = trim((string) (getenv('BFF_SESSION_COOKIE_DOMAIN') ?: ''));
        if ($fromEnv === '.icrm.co.kr' && self::allowSharedDomainCookies()) {
            return $fromEnv;
        }
        $b = is_array($data['bff_session_bootstrap'] ?? null) ? $data['bff_session_bootstrap'] : array();
        $fromBootstrap = trim((string) ($b['cookie_domain'] ?? ''));
        if ($fromBootstrap === '.icrm.co.kr' && self::allowSharedDomainCookies()) {
            return $fromBootstrap;
        }
        // Production Domain shares Core session under .icrm.co.kr when flag on.
        if (self::allowSharedDomainCookies()) {
            return '.icrm.co.kr';
        }
        return '';
    }

    /**
     * Successful login/signup/SSO: clear prior session cookies, then exactly one
     * canonical PHPSESSID (Traffic emitBrowserSessionCookies port).
     *
     * @param array<string, mixed> $data
     * @param string[] $setCookies
     * @return array{emitted:bool,reason?:string}
     */
    public static function emitBrowserSessionCookies(bool $success, array $data, array $setCookies): array
    {
        self::forwardNonSessionUpstreamCookies($setCookies);
        if (!$success) {
            return array('emitted' => false, 'reason' => 'auth_failed');
        }
        $resolved = self::resolveEstablishedSessionId($data, $setCookies);
        if ($resolved === null) {
            return array('emitted' => false, 'reason' => 'no_session_id');
        }
        self::clearBrowserSessionCookies($resolved['cookieName']);
        $parts = array(
            $resolved['cookieName'] . '=' . $resolved['sessionId'],
            'Path=/',
            'HttpOnly',
            'Secure',
            'SameSite=Lax',
        );
        $domain = self::resolveSessionCookieDomain($data);
        if ($domain === '.icrm.co.kr') {
            $parts[] = 'Domain=' . $domain;
        }
        header('Set-Cookie: ' . implode('; ', $parts), false);
        return array('emitted' => true);
    }
}
