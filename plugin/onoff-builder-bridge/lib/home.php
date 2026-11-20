<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

if (!function_exists('onoff_builder_get_home_bridge_id')) {
    function onoff_builder_get_home_bridge_id()
    {
        $id = '';
        if (function_exists('g5site_cfg')) {
            $id = onoff_builder_sanitize_project_id(g5site_cfg('home_builder_bridge_id', ''));
        }

        if ($id === '' && function_exists('onoff_builder_read_runtime_config')) {
            $runtime = onoff_builder_read_runtime_config();
            $id = isset($runtime['home_builder_bridge_id'])
                ? onoff_builder_sanitize_project_id($runtime['home_builder_bridge_id'])
                : '';
        }

        return $id;
    }
}

/**
 * Official builder marketing SPA import id (when synced).
 * Does not change home_builder_bridge_id until canary approval.
 */
if (!function_exists('onoff_builder_get_official_import_id')) {
    function onoff_builder_get_official_import_id()
    {
        $id = 'onoff-builder-official';
        if (function_exists('g5site_cfg')) {
            $configured = onoff_builder_sanitize_project_id(g5site_cfg('official_builder_bridge_id', $id));
            if ($configured !== '') {
                $id = $configured;
            }
        }
        return $id;
    }
}

/**
 * Legacy renewal / auth / education SPA import id.
 */
if (!function_exists('onoff_builder_get_legacy_import_id')) {
    function onoff_builder_get_legacy_import_id()
    {
        $home = onoff_builder_get_home_bridge_id();
        return $home !== '' ? $home : 'onoffmarketing';
    }
}

/**
 * Paths that must keep the onoffmarketing (renewal) SPA.
 *
 * @return string[] path prefixes (leading slash, no trailing slash except root)
 */
if (!function_exists('onoff_builder_legacy_spa_path_prefixes')) {
    function onoff_builder_legacy_spa_path_prefixes()
    {
        return array(
            '/login',
            '/signup',
            '/session-expired',
            '/password',
            '/auth',
            '/account',
            '/education',
            '/marketing',
            '/service',
            '/consult',
            '/seo-platform',
            '/seo-aeo',
            '/company',
            '/diy',
            '/request',
            '/platform',
            '/ai-tools',
            '/blog',
            '/cafe',
            '/onoffcpa',
            '/free-courses',
            '/home1',
        );
    }
}

/**
 * Exact / nested paths served by the official builder website SPA.
 *
 * @return string[]
 */
if (!function_exists('onoff_builder_official_spa_paths')) {
    function onoff_builder_official_spa_paths()
    {
        return array(
            '/',
            '/features',
            '/features/routine',
            '/features/step-mail',
            '/features/stepmail',
            '/features/sns-poster',
            '/features/sns',
            '/features/auto-comment',
            '/features/easy-edit',
            '/features/ai-development',
            '/features/ai-dev',
            '/website',
            '/management',
            '/services/seo',
            '/geo',
            '/backlink',
            '/traffic',
            '/domain',
            '/content',
            '/use-cases',
            '/portfolio',
            '/pricing',
            '/contact',
            '/community',
        );
    }
}

/**
 * Official dual-routing is armed only when import exists AND an explicit gate is on.
 * Prevents accidental / cutover merely by uploading imports/onoff-builder-official/.
 *
 * Gate (any one):
 * - g5site_cfg_bool('official_builder_routes_enabled', false) === true
 * - home_builder_bridge_id === official import id (explicit cutover)
 */
if (!function_exists('onoff_builder_official_routes_armed')) {
    function onoff_builder_official_routes_armed()
    {
        $official_id = onoff_builder_get_official_import_id();
        if (!function_exists('onoff_builder_project_exists') || !onoff_builder_project_exists($official_id)) {
            return false;
        }

        if (function_exists('g5site_cfg_bool') && g5site_cfg_bool('official_builder_routes_enabled', false)) {
            return true;
        }

        return onoff_builder_get_home_bridge_id() === $official_id;
    }
}

/**
 * Resolve which bridge import project should render for the current REQUEST_URI.
 * Falls back to home_builder_bridge_id / onoffmarketing when official is not armed.
 *
 * @param string|null $req_path
 * @return string project id
 */
if (!function_exists('onoff_builder_resolve_request_project_id')) {
    function onoff_builder_resolve_request_project_id($req_path = null)
    {
        if ($req_path === null) {
            $req_path = parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH);
        }
        $req_path = is_string($req_path) ? rtrim($req_path, '/') : '';
        if ($req_path === '') {
            $req_path = '/';
        }

        $legacy_id = onoff_builder_get_legacy_import_id();
        $official_id = onoff_builder_get_official_import_id();
        $official_armed = onoff_builder_official_routes_armed();

        foreach (onoff_builder_legacy_spa_path_prefixes() as $prefix) {
            if ($req_path === $prefix || strpos($req_path, $prefix . '/') === 0) {
                return $legacy_id;
            }
        }

        $official_paths = onoff_builder_official_spa_paths();
        if (in_array($req_path, $official_paths, true)) {
            return $official_armed ? $official_id : $legacy_id;
        }

        // Unknown path hitting index.php — keep configured home bridge
        return $legacy_id;
    }
}

if (!function_exists('onoff_builder_home_enabled')) {
    function onoff_builder_home_enabled()
    {
        if (function_exists('g5site_cfg_bool') && !g5site_cfg_bool('onoff_builder_bridge_enabled', true)) {
            return false;
        }

        $id = onoff_builder_resolve_request_project_id();

        return $id !== '' && onoff_builder_project_exists($id);
    }
}

if (!function_exists('onoff_builder_maybe_render_home')) {
    /**
     * index.php 에서 호출 — 홈(/)을 빌더 페이지로 출력
     *
     * @return bool 렌더 후 종료해야 하면 true
     */
    function onoff_builder_maybe_render_home()
    {
        if (!onoff_builder_home_enabled()) {
            return false;
        }

        if (defined('G5_IS_MOBILE') && G5_IS_MOBILE) {
            return false;
        }

        $id = onoff_builder_resolve_request_project_id();
        onoff_builder_render_import_page($id);

        return true;
    }
}
