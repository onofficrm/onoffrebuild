<?php
/**
 * Validators usable without a DB connection (CLI tests include this file).
 */

if (!function_exists('seosys300_valid_http_url')) {
    function seosys300_valid_http_url($url)
    {
        $url = trim((string) $url);
        if ($url === '' || strlen($url) > 500) {
            return false;
        }
        if (preg_match('/^\s*(javascript|data|vbscript|file):/i', $url)) {
            return false;
        }
        if (!preg_match('#^https?://#i', $url)) {
            return false;
        }
        $parts = parse_url($url);
        if (empty($parts['scheme']) || empty($parts['host'])) {
            return false;
        }
        $scheme = strtolower($parts['scheme']);
        if ($scheme !== 'http' && $scheme !== 'https') {
            return false;
        }
        if (strpos($parts['host'], '.') === false && $parts['host'] !== 'localhost') {
            return false;
        }
        return true;
    }
}

if (!function_exists('seosys300_safe_ext')) {
    function seosys300_safe_ext($filename)
    {
        $filename = strtolower((string) $filename);
        $filename = str_replace('\\', '/', $filename);
        $base = basename($filename);
        $pos = strrpos($base, '.');
        if ($pos === false) {
            return '';
        }
        return preg_replace('/[^a-z0-9]/', '', substr($base, $pos + 1));
    }
}

if (!function_exists('seosys300_filename_has_blocked_ext')) {
    function seosys300_filename_has_blocked_ext($filename, $blocked)
    {
        $name = strtolower((string) $filename);
        foreach ((array) $blocked as $ext) {
            $ext = strtolower($ext);
            if ($ext === '') {
                continue;
            }
            if (preg_match('/\.' . preg_quote($ext, '/') . '(\.|$)/i', $name)) {
                return true;
            }
        }
        return false;
    }
}

if (!function_exists('seosys300_slugify_menu')) {
    function seosys300_slugify_menu($label)
    {
        $label = trim((string) $label);
        if ($label === '') {
            return 'menu';
        }
        $slug = preg_replace('/\s+/', '-', $label);
        $slug = preg_replace('/[^\p{L}\p{N}\-_]+/u', '', $slug);
        $slug = trim($slug, '-');
        if ($slug === '') {
            return 'menu';
        }
        return substr($slug, 0, 80);
    }
}
