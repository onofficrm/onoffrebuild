<?php
namespace OnoffMarketing\BrandedAuth;

/**
 * CatchDomain Branded Auth config — Traffic contract, PHP bridge.
 * platform_id / signup_platform = onoff (Core registered).
 * Secrets: env or data/onoff-platform-auth.env — never commit.
 */
final class BrandedAuthConfig
{
    public const PLATFORM_ID = 'onoff';
    public const SIGNUP_PLATFORM = 'onoff';
    public const SIGNUP_SOURCE = 'ONOFF';
    public const SSO_CALLBACK_PATH = '/auth/callback';
    public const DEFAULT_CORE_BASE = 'https://icrm.co.kr';
    public const DEFAULT_PUBLIC_ORIGIN = 'https://onoff.icrm.co.kr';

    /** @var array<string, string> */
    private static array $envOverrides = array();

    public static function resetEnvOverridesForTests(): void
    {
        self::$envOverrides = array();
    }

    public static function setEnvOverride(string $key, ?string $value): void
    {
        if ($value === null) {
            unset(self::$envOverrides[$key]);
            return;
        }
        self::$envOverrides[$key] = $value;
    }

    private static function env(string $key, string $default = ''): string
    {
        if (array_key_exists($key, self::$envOverrides)) {
            return (string) self::$envOverrides[$key];
        }
        if (isset($_ENV[$key]) && (string) $_ENV[$key] !== '') {
            return (string) $_ENV[$key];
        }
        if (isset($_SERVER[$key]) && (string) $_SERVER[$key] !== '') {
            return (string) $_SERVER[$key];
        }
        $v = getenv($key);
        return $v === false ? $default : (string) $v;
    }

    private static function envBool(string $key, bool $default = false): bool
    {
        $raw = strtolower(trim(self::env($key, $default ? 'true' : 'false')));
        return $raw === 'true' || $raw === '1' || $raw === 'yes';
    }

    public static function isEnabled(): bool
    {
        return self::envBool('ONOFF_BRANDED_AUTH_ENABLED', false)
            || self::envBool('BFF_BRANDED_AUTH_ENABLED', false);
    }

    public static function isPlatformAuthEnabled(): bool
    {
        if (!self::isEnabled()) {
            return false;
        }
        // Default OFF — Production / canary must set explicitly true.
        return self::envBool('ONOFF_PLATFORM_AUTH_ENABLED', false)
            || self::envBool('BFF_PLATFORM_AUTH_ENABLED', false);
    }

    /**
     * SSO exchange/issue routes — separate from Platform Auth login.
     * Default OFF.
     */
    public static function isPlatformSsoEnabled(): bool
    {
        if (!self::isEnabled()) {
            return false;
        }
        return self::envBool('ONOFF_PLATFORM_SSO_ENABLED', false)
            || self::envBool('BFF_PLATFORM_SSO_ENABLED', false);
    }

    /**
     * catchdev-writable flag: open login/signup for virtual-member testing
     * without root editing /etc/catchdomain/platform-auth-production.env.
     * Remove the file to restore pilot gate (unless AUTH_PILOT_FULL_OPEN is set).
     */
    public static function virtualMemberTestOpenPath(): string
    {
        return dirname(__DIR__, 2) . '/data/AUTH_VIRTUAL_MEMBER_TEST_OPEN';
    }

    public static function isVirtualMemberTestOpen(): bool
    {
        $override = self::env('ONOFF_AUTH_VIRTUAL_MEMBER_TEST_OPEN', '');
        if ($override !== '') {
            $raw = strtolower(trim($override));
            return $raw === 'true' || $raw === '1' || $raw === 'yes';
        }
        return is_file(self::virtualMemberTestOpenPath());
    }

    /**
     * Formal go-live open: pilot gate off for all members.
     */
    public static function pilotFullOpenPath(): string
    {
        return dirname(__DIR__, 2) . '/data/AUTH_PILOT_FULL_OPEN';
    }

    public static function isPilotFullOpen(): bool
    {
        $override = self::env('ONOFF_AUTH_PILOT_FULL_OPEN', '');
        if ($override !== '') {
            $raw = strtolower(trim($override));
            return $raw === 'true' || $raw === '1' || $raw === 'yes';
        }
        return is_file(self::pilotFullOpenPath());
    }

    /**
     * Admin-only pilot posture. Default true so enabling Auth without an
     * allowlist admits nobody until ONOFF_PLATFORM_AUTH_PILOT_MB_IDS is set.
     * Full-open / virtual-member test flags force open (pilotOnly=false).
     */
    public static function isPilotOnly(): bool
    {
        if (self::isPilotFullOpen() || self::isVirtualMemberTestOpen()) {
            return false;
        }
        $explicit = self::env('ONOFF_PLATFORM_AUTH_PILOT_ONLY', '');
        if ($explicit === '') {
            $explicit = self::env('BFF_BRANDED_AUTH_PILOT_ONLY', '');
        }
        if ($explicit === '') {
            return true;
        }
        $raw = strtolower(trim($explicit));
        return $raw === 'true' || $raw === '1' || $raw === 'yes';
    }

    /** @return string[] */
    public static function pilotMbIds(): array
    {
        $raw = self::env('ONOFF_PLATFORM_AUTH_PILOT_MB_IDS', '');
        if ($raw === '') {
            $raw = self::env('BFF_BRANDED_AUTH_PILOT_MB_IDS', '');
        }
        return PilotGate::parseAllowlist($raw);
    }

    /** Pre-login: exact allowlist only when pilotOnly. */
    public static function isPilotLoginCandidate(?string $login): bool
    {
        return PilotGate::evaluateLoginCandidate($login, array(
            'pilotOnly' => self::isPilotOnly(),
            'allowlist' => self::pilotMbIds(),
        ));
    }

    /** Post-auth / SSO: exact OR Core-masked allowlist when pilotOnly. */
    public static function isPilotMember(?string $mbId): bool
    {
        return PilotGate::evaluateMembership($mbId, array(
            'pilotOnly' => self::isPilotOnly(),
            'allowlist' => self::pilotMbIds(),
        ));
    }

    public static function coreBaseUrl(): string
    {
        $u = self::env('ONOFF_PLATFORM_AUTH_BASE_URL', '');
        if ($u === '') {
            $u = self::env('ONOFF_CORE_BASE_URL', self::DEFAULT_CORE_BASE);
        }
        return rtrim($u, '/');
    }

    public static function apiKey(): string
    {
        $k = self::env('ONOFF_PLATFORM_AUTH_API_KEY', '');
        if ($k !== '') {
            return $k;
        }
        $cfg = self::loadCredentialFile();
        return (string) ($cfg['api_key'] ?? '');
    }

    public static function apiSecret(): string
    {
        $s = self::env('ONOFF_PLATFORM_AUTH_API_SECRET', '');
        if ($s !== '') {
            return $s;
        }
        $cfg = self::loadCredentialFile();
        return (string) ($cfg['api_secret'] ?? '');
    }

    public static function timeoutMs(): int
    {
        $n = (int) self::env('ONOFF_PLATFORM_AUTH_TIMEOUT_MS', '30000');
        return $n > 0 ? $n : 30000;
    }

    public static function platformId(): string
    {
        $v = trim(self::env('ONOFF_PLATFORM_ID', ''));
        return $v !== '' ? preg_replace('/[^a-z0-9_\-]/i', '', $v) : self::PLATFORM_ID;
    }

    public static function signupPlatform(): string
    {
        $v = trim(self::env('ONOFF_SIGNUP_PLATFORM', ''));
        return $v !== '' ? preg_replace('/[^a-z0-9_\-]/i', '', $v) : self::SIGNUP_PLATFORM;
    }

    public static function publicOrigin(): string
    {
        $o = rtrim(self::env('ONOFF_PUBLIC_ORIGIN', ''), '/');
        if ($o !== '') {
            return $o;
        }
        $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? ''));
        $host = preg_replace('/:\d+$/', '', $host);
        if ($host === 'edu.icrm.co.kr') {
            return 'https://edu.icrm.co.kr';
        }
        if ($host === 'onoff.icrm.co.kr') {
            return self::DEFAULT_PUBLIC_ORIGIN;
        }
        return self::DEFAULT_PUBLIC_ORIGIN;
    }

    public static function localBridgePort(): int
    {
        $p = (int) self::env('ONOFF_AUTH_BRIDGE_PORT', '8765');
        return $p > 0 ? $p : 8765;
    }

    public static function ssoCallbackUrl(): string
    {
        $explicit = self::env('ONOFF_SSO_CALLBACK_URL', '');
        if ($explicit !== '') {
            return $explicit;
        }
        return self::publicOrigin() . self::SSO_CALLBACK_PATH;
    }

    /**
     * Load credential JSON (path from env). Never logs secrets.
     *
     * @return array<string, mixed>
     */
    public static function loadCredentialFile(): array
    {
        static $cached = null;
        if (is_array($cached)) {
            return $cached;
        }
        $path = self::env('ONOFF_PLATFORM_AUTH_CREDENTIAL_FILE', '');
        if ($path === '') {
            $candidates = array(
                dirname(__DIR__, 2) . '/data/onoff-platform-auth.credentials.json',
                '/etc/onoff/onoff-platform-auth.credentials.json',
            );
            foreach ($candidates as $c) {
                if (is_file($c)) {
                    $path = $c;
                    break;
                }
            }
        }
        if ($path === '' || !is_file($path)) {
            $cached = array();
            return $cached;
        }
        $raw = file_get_contents($path);
        $j = is_string($raw) ? json_decode($raw, true) : null;
        $cached = is_array($j) ? $j : array();
        return $cached;
    }

    public static function isConfigured(): bool
    {
        return self::coreBaseUrl() !== ''
            && self::apiKey() !== ''
            && self::apiSecret() !== '';
    }

    /** @return array<string, mixed> */
    public static function publicConfig(): array
    {
        return array(
            'brandedAuthEnabled' => self::isEnabled(),
            'platformAuthEnabled' => self::isPlatformAuthEnabled() && self::isConfigured(),
            'platformSsoEnabled' => self::isPlatformSsoEnabled() && self::isConfigured(),
            'pilotOnly' => self::isPilotOnly(),
            'virtualMemberTestOpen' => self::isVirtualMemberTestOpen(),
            'pilotFullOpen' => self::isPilotFullOpen(),
            'platformId' => self::platformId(),
            'signupPlatform' => self::signupPlatform(),
            'ssoCallbackPath' => self::SSO_CALLBACK_PATH,
            'coreHostHint' => 'icrm.co.kr',
            'adminPilotGate' => PilotGate::MARKER,
            'authBridgeSource' => 'ONOFF_ADMIN_AUTH_BRIDGE_SOURCE_READY',
            'productionCallbackCanary' => 'CALLBACK_SOURCE_READY',
            'configured' => self::isConfigured(),
        );
    }
}