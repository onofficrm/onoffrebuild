<?php
function seosys300_token_key()
{
    $key = getenv('SEOSYS300_TOKEN_KEY');
    $key = is_string($key) ? trim($key) : '';
    if ($key === '' && defined('G5_MYSQL_PASSWORD')) {
        $key = 'seosys300|' . G5_MYSQL_PASSWORD;
    }
    if (strlen($key) < 16) {
        return '';
    }
    return hash('sha256', $key, true);
}

function seosys300_encrypt_secret($plain)
{
    $plain = (string) $plain;
    if ($plain === '') {
        return '';
    }
    $key = seosys300_token_key();
    if ($key === '') {
        return '';
    }
    $iv = random_bytes(12);
    $tag = '';
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    if ($cipher === false) {
        return '';
    }
    return base64_encode($iv . $tag . $cipher);
}

function seosys300_decrypt_secret($stored)
{
    $stored = (string) $stored;
    if ($stored === '') {
        return '';
    }
    $key = seosys300_token_key();
    if ($key === '') {
        return '';
    }
    $raw = base64_decode($stored, true);
    if ($raw === false || strlen($raw) < 29) {
        return '';
    }
    $iv = substr($raw, 0, 12);
    $tag = substr($raw, 12, 16);
    $cipher = substr($raw, 28);
    $plain = openssl_decrypt($cipher, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag);
    return $plain === false ? '' : $plain;
}
