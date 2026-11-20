<?php
namespace OnoffMarketing\BrandedAuth;

final class AuthErrors
{
    public const INVALID_CREDENTIALS = 'INVALID_CREDENTIALS';
    public const SESSION_EXPIRED = 'SESSION_EXPIRED';
    public const CSRF_INVALID = 'CSRF_INVALID';
    public const INVALID_PLATFORM = 'INVALID_PLATFORM';
    public const PASSWORD_INVALID = 'PASSWORD_INVALID';
    public const SSO_CODE_INVALID = 'SSO_CODE_INVALID';
    public const SSO_CODE_EXPIRED = 'SSO_CODE_EXPIRED';
    public const SSO_CODE_USED = 'SSO_CODE_USED';
    public const CORE_UNAVAILABLE = 'CORE_UNAVAILABLE';
    public const NETWORK_ERROR = 'NETWORK_ERROR';
    public const NOT_CONFIGURED = 'NOT_CONFIGURED';
    public const UNAUTHORIZED = 'unauthorized';
    public const INVALID_RETURN = 'INVALID_RETURN_URL';
    public const DISABLED = 'BRANDED_AUTH_DISABLED';
    public const PILOT_DENIED = 'PILOT_DENIED';
    public const SSO_DISABLED = 'PLATFORM_SSO_DISABLED';

    /** User-facing Korean messages — no Core internals. */
    public static function userMessage(string $code): string
    {
        $map = array(
            self::INVALID_CREDENTIALS => '이메일 또는 비밀번호가 올바르지 않습니다.',
            self::SESSION_EXPIRED => '로그인 세션이 만료되었습니다. 다시 로그인해 주세요.',
            self::CSRF_INVALID => '보안 토큰이 만료되었습니다. 다시 시도해 주세요.',
            self::INVALID_PLATFORM => '플랫폼 설정 오류입니다. 잠시 후 다시 시도해 주세요.',
            self::PASSWORD_INVALID => '비밀번호를 확인할 수 없습니다.',
            self::SSO_CODE_INVALID => '로그인 연결 코드가 올바르지 않습니다.',
            self::SSO_CODE_EXPIRED => '로그인 연결 코드가 만료되었습니다.',
            self::SSO_CODE_USED => '이미 사용된 로그인 연결 코드입니다.',
            self::CORE_UNAVAILABLE => '인증 서버에 일시적으로 연결할 수 없습니다.',
            self::NETWORK_ERROR => '네트워크 오류가 발생했습니다.',
            self::NOT_CONFIGURED => '인증 설정이 완료되지 않았습니다.',
            self::UNAUTHORIZED => '로그인이 필요합니다.',
            self::INVALID_RETURN => '돌아갈 주소가 허용되지 않습니다.',
            self::DISABLED => '통합 로그인이 비활성화되어 있습니다.',
            self::PILOT_DENIED => 'ONOFF 통합계정 Pilot 대상이 아닙니다.',
            self::SSO_DISABLED => '통합 SSO가 비활성화되어 있습니다.',
        );
        return $map[$code] ?? '요청을 처리할 수 없습니다.';
    }

    public static function httpStatus(string $code): int
    {
        if (in_array($code, array(self::INVALID_CREDENTIALS, self::SESSION_EXPIRED, self::UNAUTHORIZED), true)) {
            return 401;
        }
        if ($code === self::PILOT_DENIED) {
            return 403;
        }
        if ($code === self::SSO_CODE_USED || $code === 'CODE_ALREADY_USED') {
            return 409;
        }
        if ($code === self::SSO_CODE_EXPIRED || $code === 'CODE_EXPIRED') {
            return 410;
        }
        if ($code === self::CORE_UNAVAILABLE || $code === self::NETWORK_ERROR) {
            return 502;
        }
        if (in_array($code, array(self::NOT_CONFIGURED, self::DISABLED, self::SSO_DISABLED), true)) {
            return 503;
        }
        return 400;
    }

    public static function normalizeCoreCode(string $code): string
    {
        $c = strtoupper(trim($code));
        $aliases = array(
            'CODE_ALREADY_USED' => self::SSO_CODE_USED,
            'CODE_EXPIRED' => self::SSO_CODE_EXPIRED,
            'CODE_INVALID' => self::SSO_CODE_INVALID,
            'SSO_CODE_ALREADY_USED' => self::SSO_CODE_USED,
            'UNAUTHENTICATED' => self::UNAUTHORIZED,
            'REAUTH_REQUIRED' => self::SESSION_EXPIRED,
        );
        return $aliases[$c] ?? ($c !== '' ? $c : 'ERROR');
    }
}
