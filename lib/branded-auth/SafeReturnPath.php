<?php
namespace OnoffMarketing\BrandedAuth;

/**
 * Safe return path — CatchDomain internal relative paths only.
 */
final class SafeReturnPath
{
    public static function sanitize(?string $path, string $fallback = '/'): string
    {
        $p = trim((string) $path);
        if ($p === '') {
            return $fallback;
        }
        // Absolute / protocol-relative / dangerous schemes
        if (preg_match('#^(https?:)?//#i', $p) || preg_match('#^(javascript|data|vbscript):#i', $p)) {
            return $fallback;
        }
        if ($p[0] !== '/') {
            return $fallback;
        }
        if (strpos($p, '\\') !== false || strpos($p, "\0") !== false) {
            return $fallback;
        }
        // Auth loop prevention
        $pathOnly = parse_url($p, PHP_URL_PATH);
        $pathOnly = is_string($pathOnly) ? $pathOnly : $p;
        $blocked = array('/login', '/signup', '/auth/callback', '/session-expired', '/password/forgot', '/password/reset');
        foreach ($blocked as $b) {
            if ($pathOnly === $b || strpos($pathOnly, $b . '/') === 0) {
                return $fallback;
            }
        }
        // Query view auth routes
        if (preg_match('/[?&]view=(login|signup|session-expired|auth-callback|password-forgot|password-reset)\b/', $p)) {
            return $fallback;
        }
        return $p;
    }

    public static function buildLoginReturnUrl(string $returnPath): string
    {
        $safe = self::sanitize($returnPath, '/');
        return '/?view=login&return=' . rawurlencode($safe);
    }

    public static function buildSessionExpiredUrl(string $returnPath): string
    {
        $safe = self::sanitize($returnPath, '/');
        return '/?view=session-expired&return=' . rawurlencode($safe);
    }
}
