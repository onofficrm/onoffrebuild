<?php
/**
 * edu.icrm.co.kr — independent student platform on the shared ONOFF login.
 *
 * Same Core session cookie (Domain=.icrm.co.kr). Platform id is `education`,
 * not `onoff`. GNUBoard APIs keep running in this repo; this file only
 * switches identity and maps the Core member onto the local member row.
 */

if (!function_exists('edu_platform_host')) {
    function edu_platform_host()
    {
        $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
        $host = preg_replace('/:\d+$/', '', $host);
        return $host;
    }
}

if (!function_exists('edu_platform_is_host')) {
    function edu_platform_is_host()
    {
        if (edu_platform_host() === 'edu.icrm.co.kr') {
            return true;
        }
        $forced = strtolower(trim((string) getenv('EDU_PLATFORM_FORCE')));
        return $forced === '1' || $forced === 'true' || $forced === 'edu.icrm.co.kr';
    }
}

if (!function_exists('edu_platform_is_request')) {
    /**
     * The temporary /seo-system-300 fallback runs on onoff.icrm.co.kr while
     * edu.icrm.co.kr is being attached to the shared document root.
     * Only plugin requests are treated as education requests; normal ONOFF
     * pages keep their own platform identity.
     */
    function edu_platform_is_request()
    {
        if (edu_platform_is_host()) {
            return true;
        }
        if (edu_platform_host() !== 'onoff.icrm.co.kr') {
            return false;
        }
        $path = (string) (parse_url((string) ($_SERVER['REQUEST_URI'] ?? ''), PHP_URL_PATH) ?? '');
        return strpos($path, '/plugin/seo-system-300/') === 0;
    }
}

if (!function_exists('edu_platform_portal_prefix')) {
    /**
     * URL prefix for the student SPA. Empty on edu.icrm.co.kr (site root).
     */
    function edu_platform_portal_prefix()
    {
        if (edu_platform_is_host()) {
            return '';
        }
        return '/seo-system-300';
    }
}

if (!function_exists('edu_platform_load_env_file')) {
    function edu_platform_load_env_file($path)
    {
        if (!is_readable($path)) {
            return array();
        }
        $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if (!is_array($lines)) {
            return array();
        }
        $out = array();
        foreach ($lines as $line) {
            $line = trim($line);
            if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
                continue;
            }
            list($k, $v) = explode('=', $line, 2);
            $k = trim($k);
            $v = trim($v);
            if ($k === '') {
                continue;
            }
            if (
                strlen($v) >= 2
                && (($v[0] === '"' && substr($v, -1) === '"') || ($v[0] === "'" && substr($v, -1) === "'"))
            ) {
                $v = substr($v, 1, -1);
            }
            $out[$k] = $v;
        }
        return $out;
    }
}

if (!function_exists('edu_platform_apply_env')) {
    /**
     * Force education platform identity without dropping Core API credentials
     * already loaded from data/onoff-platform-auth.env.
     */
    function edu_platform_apply_env()
    {
        static $done = false;
        if ($done || !edu_platform_is_request()) {
            return;
        }
        $done = true;

        $boot = dirname(__FILE__) . '/branded-auth/bootstrap.php';
        if (is_file($boot)) {
            try {
                require_once $boot;
            } catch (Throwable $e) {
                return;
            }
        }
        if (!class_exists('OnoffMarketing\\BrandedAuth\\BrandedAuthConfig')) {
            return;
        }

        $isEduHost = edu_platform_host() === 'edu.icrm.co.kr';
        $publicOrigin = $isEduHost ? 'https://edu.icrm.co.kr' : 'https://onoff.icrm.co.kr';
        // Until edu.icrm.co.kr is live, /seo-system-300 runs as an ONOFF
        // fallback route. Its browser login cookie belongs to the `onoff`
        // platform, so asking Core for an `education` session here always
        // reports authenticated=false even though the user just logged in.
        $platformId = $isEduHost ? 'education' : 'onoff';
        $values = array(
            'ONOFF_PLATFORM_ID' => $platformId,
            'ONOFF_SIGNUP_PLATFORM' => $platformId,
            'ONOFF_PUBLIC_ORIGIN' => $publicOrigin,
            'ONOFF_SSO_CALLBACK_URL' => $publicOrigin . '/auth/callback',
            'ONOFF_PUBLIC_HOST' => $isEduHost ? 'edu.icrm.co.kr' : 'onoff.icrm.co.kr',
            'ONOFF_BRANDED_AUTH_ENABLED' => 'true',
            'BFF_BRANDED_AUTH_ENABLED' => 'true',
            'ONOFF_PLATFORM_AUTH_ENABLED' => 'true',
            'BFF_PLATFORM_AUTH_ENABLED' => 'true',
            'ONOFF_PLATFORM_SSO_ENABLED' => 'true',
            'BFF_PLATFORM_SSO_ENABLED' => 'true',
            'ONOFF_ALLOW_ICRM_SHARED_COOKIE' => 'true',
            'BFF_SESSION_COOKIE_DOMAIN' => '.icrm.co.kr',
        );
        $file = dirname(__DIR__) . '/data/edu-platform-auth.env';
        foreach (edu_platform_load_env_file($file) as $k => $v) {
            $values[$k] = $v;
        }

        foreach ($values as $k => $v) {
            putenv($k . '=' . $v);
            $_ENV[$k] = $v;
            $_SERVER[$k] = $v;
            OnoffMarketing\BrandedAuth\BrandedAuthConfig::setEnvOverride($k, $v);
        }
    }
}

if (!function_exists('edu_platform_lookup_member')) {
    function edu_platform_lookup_member($mbId, $displayName, $email)
    {
        global $g5;

        $mbId = trim((string) $mbId);
        if ($mbId === '' || !function_exists('get_member')) {
            return null;
        }

        $mb = get_member($mbId);
        if (!empty($mb['mb_id'])) {
            return $mb;
        }

        if ($email !== '' && function_exists('sql_fetch') && !empty($g5['member_table'])) {
            $safe = sql_real_escape_string($email);
            $table = $g5['member_table'];
            $row = sql_fetch(" select * from {$table} where mb_email = '{$safe}' and mb_leave_date = '' limit 1 ");
            if (!empty($row['mb_id'])) {
                return $row;
            }
        }

        return array(
            'mb_id' => $mbId,
            'mb_name' => $displayName !== '' ? $displayName : $mbId,
            'mb_nick' => $displayName !== '' ? $displayName : $mbId,
            'mb_email' => $email,
            'mb_level' => 2,
            'mb_leave_date' => '',
            'mb_intercept_date' => '',
        );
    }
}

if (!function_exists('edu_platform_core_cookie_candidates')) {
    /**
     * ONOFF may have both a host-only GNUBoard PHPSESSID and the shared
     * Domain=.icrm.co.kr Core PHPSESSID. Cookie headers do not include Domain,
     * so try each PHPSESSID value independently instead of trusting order.
     *
     * @return string[]
     */
    function edu_platform_core_cookie_candidates($cookieHeader)
    {
        $sessionValues = array();
        $other = array();
        foreach (explode(';', (string) $cookieHeader) as $part) {
            $part = trim($part);
            if ($part === '' || strpos($part, '=') === false) {
                continue;
            }
            list($name, $value) = explode('=', $part, 2);
            $name = trim($name);
            if (strcasecmp($name, 'PHPSESSID') === 0) {
                $value = trim($value);
                if ($value !== '' && !in_array($value, $sessionValues, true)) {
                    $sessionValues[] = $value;
                }
                continue;
            }
            // Never forward the platform-local session to Core.
            if (strcasecmp($name, 'SEOSYS300PHPSESSID') !== 0) {
                $other[] = $part;
            }
        }

        $candidates = array();
        foreach ($sessionValues as $value) {
            $parts = $other;
            $parts[] = 'PHPSESSID=' . $value;
            $candidates[] = implode('; ', $parts);
        }
        if (!$candidates) {
            $candidates[] = implode('; ', $other);
        }
        return $candidates;
    }
}

if (!function_exists('edu_platform_get_core_session')) {
    function edu_platform_get_core_session($cookieHeader, &$matchedCookies = '')
    {
        $fallback = null;
        foreach (edu_platform_core_cookie_candidates($cookieHeader) as $candidate) {
            try {
                $session = OnoffMarketing\BrandedAuth\PlatformAuthService::getSession($candidate);
            } catch (Throwable $e) {
                continue;
            }
            if ($fallback === null) {
                $fallback = $session;
            }
            if (!empty($session['authenticated'])) {
                $matchedCookies = $candidate;
                return $session;
            }
        }
        $matchedCookies = '';
        return $fallback;
    }
}

if (!function_exists('edu_platform_adopt_member')) {
    /**
     * Replace the GNUBoard session user with the Core unified member.
     * No-op outside edu.icrm.co.kr. Does not start a PHPSESSID (GNUBoard uses G5PHPSESSID).
     */
    function edu_platform_adopt_member()
    {
        if (!edu_platform_is_request() || !defined('_GNUBOARD_')) {
            return;
        }

        try {
            edu_platform_apply_env();
        } catch (Throwable $e) {
            return;
        }
        if (!class_exists('OnoffMarketing\\BrandedAuth\\BrandedAuthConfig')) {
            return;
        }
        if (!OnoffMarketing\BrandedAuth\BrandedAuthConfig::isConfigured()) {
            return;
        }

        global $member, $is_member, $is_admin;

        $now = time();
        $cachedUntil = function_exists('get_session') ? (int) get_session('edu_core_until') : 0;
        $cachedId = function_exists('get_session') ? (string) get_session('edu_core_mb') : '';
        if ($cachedUntil > $now && $cachedId !== '') {
            $mb = edu_platform_lookup_member($cachedId, (string) get_session('edu_core_name'), (string) get_session('edu_core_email'));
            if (is_array($mb) && empty($mb['mb_leave_date']) && empty($mb['mb_intercept_date'])) {
                $member = $mb;
                $is_member = true;
                $is_admin = function_exists('is_admin') ? is_admin($mb['mb_id']) : '';
            }
            return;
        }

        $matchedCookies = '';
        $sess = edu_platform_get_core_session((string) ($_SERVER['HTTP_COOKIE'] ?? ''), $matchedCookies);
        if (!is_array($sess)) {
            $member = array();
            $is_member = false;
            $is_admin = '';
            return;
        }

        if (empty($sess['authenticated'])) {
            $member = array();
            $is_member = false;
            $is_admin = '';
            if (function_exists('set_session')) {
                set_session('edu_core_mb', '');
                set_session('edu_core_until', '');
            }
            return;
        }

        $data = is_array($sess['data'] ?? null) ? $sess['data'] : array();
        $mbId = trim((string) ($data['member_id'] ?? $data['mb_id'] ?? ''));
        $name = trim((string) ($data['display_name'] ?? $data['mb_name'] ?? ''));
        $email = trim((string) ($data['email'] ?? $data['mb_email'] ?? ''));
        if ($mbId === '') {
            $member = array();
            $is_member = false;
            $is_admin = '';
            return;
        }

        $mb = edu_platform_lookup_member($mbId, $name, $email);
        if (!is_array($mb) || !empty($mb['mb_leave_date']) || !empty($mb['mb_intercept_date'])) {
            $member = array();
            $is_member = false;
            $is_admin = '';
            return;
        }

        $member = $mb;
        $is_member = true;
        $is_admin = function_exists('is_admin') ? is_admin($mb['mb_id']) : '';
        if (function_exists('set_session')) {
            set_session('edu_core_mb', (string) $mb['mb_id']);
            set_session('edu_core_name', (string) ($mb['mb_name'] ?? $name));
            set_session('edu_core_email', (string) ($mb['mb_email'] ?? $email));
            set_session('edu_core_until', (string) ($now + 300));
        }
    }
}
