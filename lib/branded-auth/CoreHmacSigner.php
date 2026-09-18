<?php
namespace OnoffMarketing\BrandedAuth;

final class CoreHmacSigner
{
    /**
     * @return array{timestamp:string,nonce:string,payloadHash:string,signature:string,rawBody:string,normalizedPath:string}
     */
    public static function sign(
        string $apiKey,
        string $apiSecret,
        string $method,
        string $logicalPath,
        string $rawBody = ''
    ): array {
        $key = trim($apiKey);
        $secret = trim($apiSecret);
        if ($key === '' || $secret === '') {
            throw new BrandedAuthException('Core API credentials not configured', AuthErrors::NOT_CONFIGURED);
        }

        $timestamp = (string) time();
        $nonce = self::nonce24();
        $payloadHash = hash('sha256', $rawBody);
        $normalizedPath = trim($logicalPath, '/');
        $canonical = implode("\n", array(
            $key,
            $timestamp,
            $nonce,
            strtoupper($method),
            $normalizedPath,
            strtolower($payloadHash),
        ));
        $signature = hash_hmac('sha256', $canonical, $secret);

        return array(
            'timestamp' => $timestamp,
            'nonce' => $nonce,
            'payloadHash' => $payloadHash,
            'signature' => $signature,
            'rawBody' => $rawBody,
            'normalizedPath' => $normalizedPath,
        );
    }

    private static function nonce24(): string
    {
        $raw = rtrim(strtr(base64_encode(random_bytes(18)), '+/', '-_'), '=');
        $raw = preg_replace('/[^A-Za-z0-9_-]/', 'x', $raw) ?? $raw;
        return substr($raw, 0, 24);
    }
}
