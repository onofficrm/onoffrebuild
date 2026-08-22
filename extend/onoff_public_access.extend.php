<?php
/**
 * Public access guard bootstrap.
 * - Loads lib for common.php deny helpers / logging
 * - Admin UI warnings live in adm/config_form.php help text
 * - Save protection lives in adm/config_form_update.php
 * Host firewall: docs/IWINV-PUBLIC-ACCESS.md
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (defined('G5_LIB_PATH') && is_file(G5_LIB_PATH . '/onoff-access-guard.lib.php')) {
    include_once G5_LIB_PATH . '/onoff-access-guard.lib.php';
}
