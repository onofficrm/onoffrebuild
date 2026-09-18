<?php
namespace OnoffMarketing\BrandedAuth;

/**
 * Admin-only Pilot Gate — exact allowlist matching (Traffic/Content/Backlink parity).
 *
 * Rules:
 * - empty / null allowlist → nobody (false)
 * - login candidate: exact string match only (no prefix / substring / wildcard)
 * - post-auth membership: exact OR Core-masked form of an allowlisted id (`ad*in`)
 * - wildcard characters in allowlist entries are dropped at parse time
 *
 * LOCAL SOURCE + TEST helpers. Does not enable Auth/SSO.
 */
final class PilotGate
{
    public const MARKER = 'ONOFF_ADMIN_PILOT_GATE_SOURCE_READY';

    /** @var string */
    private const WILDCARD_META = '/[*?\\[\\]]/';

    /**
     * Parse ONOFF_PLATFORM_AUTH_PILOT_MB_IDS / BFF_BRANDED_AUTH_PILOT_MB_IDS.
     * Null/empty → []. Wildcard entries (`*`, `admin*`, …) are dropped.
     *
     * @return string[]
     */
    public static function parseAllowlist(?string $raw): array
    {
        if ($raw === null) {
            return array();
        }
        $text = trim((string) $raw);
        if ($text === '') {
            return array();
        }
        $out = array();
        foreach (explode(',', $text) as $part) {
            $s = trim($part);
            if ($s === '') {
                continue;
            }
            if (preg_match(self::WILDCARD_META, $s)) {
                continue;
            }
            $out[] = $s;
        }
        return $out;
    }

    public static function isWildcardToken(?string $token): bool
    {
        return (bool) preg_match(self::WILDCARD_META, (string) $token);
    }

    /**
     * Exact allowlist membership. No prefix / substring / wildcard fuzzy logic.
     *
     * @param string[]|null $allowlist
     */
    public static function isExactMatch(?string $candidate, ?array $allowlist): bool
    {
        if ($candidate === null) {
            return false;
        }
        $id = trim((string) $candidate);
        if ($id === '') {
            return false;
        }
        if ($allowlist === null || count($allowlist) === 0) {
            return false;
        }
        foreach ($allowlist as $entry) {
            if ((string) $entry === $id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Mirror OnoffCore_PlatformAuthContract::maskMemberId.
     */
    public static function maskMemberId(?string $mbId): string
    {
        $id = trim((string) $mbId);
        $len = strlen($id);
        if ($len <= 2) {
            return str_repeat('*', $len);
        }
        if ($len <= 4) {
            return substr($id, 0, 1) . str_repeat('*', $len - 1);
        }
        return substr($id, 0, 2) . str_repeat('*', max(1, $len - 4)) . substr($id, -2);
    }

    /**
     * Post-auth: exact OR Core-masked form of an allowlisted id.
     * Unapproved masked IDs (e.g. mask of non-allowlisted user) → false.
     *
     * @param string[]|null $allowlist
     */
    public static function isExactOrMaskedMatch(?string $candidate, ?array $allowlist): bool
    {
        if ($candidate === null) {
            return false;
        }
        $got = trim((string) $candidate);
        if ($got === '') {
            return false;
        }
        if ($allowlist === null || count($allowlist) === 0) {
            return false;
        }
        foreach ($allowlist as $entry) {
            $a = trim((string) $entry);
            if ($a === '') {
                continue;
            }
            if ($a === $got || self::maskMemberId($a) === $got) {
                return true;
            }
        }
        return false;
    }

    /**
     * Post-auth / session pilot check.
     * pilotOnly=false → true (gate inactive).
     * pilotOnly=true → exact OR Core-masked allowlist; empty → false.
     *
     * @param array{pilotOnly?:bool,allowlist?:string[]|null} $opts
     */
    public static function evaluateMembership(?string $mbId, array $opts = array()): bool
    {
        $pilotOnly = !array_key_exists('pilotOnly', $opts) || $opts['pilotOnly'] !== false;
        if (!$pilotOnly) {
            return true;
        }
        $allowlist = array_key_exists('allowlist', $opts) ? $opts['allowlist'] : null;
        return self::isExactOrMaskedMatch($mbId, $allowlist);
    }

    /**
     * Pre-login candidate — before Core platform login.
     * Exact match only (no mask shortcut). empty allowlist → false.
     *
     * @param array{pilotOnly?:bool,allowlist?:string[]|null} $opts
     */
    public static function evaluateLoginCandidate(?string $login, array $opts = array()): bool
    {
        $pilotOnly = !array_key_exists('pilotOnly', $opts) || $opts['pilotOnly'] !== false;
        if (!$pilotOnly) {
            return true;
        }
        $allowlist = array_key_exists('allowlist', $opts) ? $opts['allowlist'] : null;
        return self::isExactMatch($login, $allowlist);
    }
}
