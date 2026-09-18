<?php
namespace OnoffMarketing\BrandedAuth;

final class PlatformAuthClient
{
    public static function buildUrl(string $baseUrl, string $logicalPath, array $query = array()): string
    {
        $base = rtrim($baseUrl, '/');
        $path = ltrim($logicalPath, '/');
        $url = $base . '/api/v1/platform_auth.php?__rp=' . rawurlencode($path);
        if ($query) {
            $url .= '&' . http_build_query($query);
        }
        return $url;
    }

    /**
     * @param array{method?:string,body?:array|null,cookies?:string,query?:array,timeoutMs?:int} $opts
     * @return array{ok:bool,status:int,json:array,code:string,message:string,data:mixed,setCookies:string[],rawHeaders:string}
     */
    public static function request(string $logicalPath, array $opts = array()): array
    {
        if (!BrandedAuthConfig::isConfigured()) {
            throw new BrandedAuthException('Platform Auth not configured', AuthErrors::NOT_CONFIGURED);
        }

        $method = strtoupper((string) ($opts['method'] ?? 'GET'));
        $hasBody = $method !== 'GET' && $method !== 'HEAD';
        $bodyObj = $opts['body'] ?? array();
        $rawBody = $hasBody ? (string) json_encode($bodyObj, JSON_UNESCAPED_UNICODE) : '';

        $signed = CoreHmacSigner::sign(
            BrandedAuthConfig::apiKey(),
            BrandedAuthConfig::apiSecret(),
            $method,
            $logicalPath,
            $rawBody
        );

        $url = self::buildUrl(
            BrandedAuthConfig::coreBaseUrl(),
            $signed['normalizedPath'],
            is_array($opts['query'] ?? null) ? $opts['query'] : array()
        );

        $headers = array(
            'Accept: application/json',
            'X-Api-Key: ' . BrandedAuthConfig::apiKey(),
            'X-Timestamp: ' . $signed['timestamp'],
            'X-Nonce: ' . $signed['nonce'],
            'X-Payload-Hash: ' . $signed['payloadHash'],
            'X-Signature: ' . $signed['signature'],
        );
        if ($hasBody) {
            $headers[] = 'Content-Type: application/json';
        }
        $cookies = (string) ($opts['cookies'] ?? '');
        if ($cookies !== '') {
            $headers[] = 'Cookie: ' . $cookies;
        }

        $timeoutSec = max(1, (int) ceil(($opts['timeoutMs'] ?? BrandedAuthConfig::timeoutMs()) / 1000));
        $ch = curl_init($url);
        if ($ch === false) {
            throw new BrandedAuthException('curl_init failed', AuthErrors::NETWORK_ERROR);
        }

        $responseHeaders = '';
        curl_setopt_array($ch, array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => $method,
            CURLOPT_HTTPHEADER => $headers,
            CURLOPT_HEADER => true,
            CURLOPT_TIMEOUT => $timeoutSec,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_SSL_VERIFYPEER => true,
        ));
        if ($hasBody) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $rawBody);
        }

        $raw = curl_exec($ch);
        if ($raw === false) {
        $err = curl_error($ch);
        throw new BrandedAuthException('Core request failed', AuthErrors::NETWORK_ERROR);
    }
        $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $headerSize = (int) curl_getinfo($ch, CURLINFO_HEADER_SIZE);
        // PHP 8.5+: curl_close is a no-op / deprecated — rely on scope cleanup

        $rawHeaders = substr($raw, 0, $headerSize);
        $bodyText = substr($raw, $headerSize);
        $json = array();
        if ($bodyText !== '') {
            $decoded = json_decode($bodyText, true);
            $json = is_array($decoded) ? $decoded : array(
                'success' => false,
                'code' => 'INVALID_JSON',
                'message' => substr($bodyText, 0, 200),
            );
        }

        $code = (string) ($json['code'] ?? ($status >= 200 && $status < 300 ? 'OK' : 'HTTP_ERROR'));
        $ok = $status >= 200 && $status < 300 && (($json['success'] ?? true) !== false);

        return array(
            'ok' => $ok,
            'status' => $status,
            'json' => $json,
            'code' => $code,
            'message' => (string) ($json['message'] ?? ''),
            'data' => $json['data'] ?? null,
            'setCookies' => CookieJar::extractSetCookies($rawHeaders),
            'rawHeaders' => $rawHeaders,
        );
    }
}
