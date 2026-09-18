<?php
/**
 * ONOFF notification preference helpers.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (!function_exists('onoff_notification_table_prefix')) {
    function onoff_notification_table_prefix()
    {
        if (function_exists('icrm_table_prefix')) {
            return icrm_table_prefix();
        }
        return defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    }
}

if (!function_exists('onoff_notification_preferences_table')) {
    function onoff_notification_preferences_table()
    {
        return onoff_notification_table_prefix() . 'onoff_notification_preferences';
    }
}

if (!function_exists('onoff_notification_ensure_table')) {
    function onoff_notification_ensure_table()
    {
        static $done = false;
        if ($done) {
            return true;
        }

        $table = onoff_notification_preferences_table();
        $exists = sql_fetch("SHOW TABLES LIKE '" . sql_real_escape_string($table) . "'");
        if (!$exists) {
            $sql = "CREATE TABLE IF NOT EXISTS `{$table}` (
                `pref_id` int(11) NOT NULL AUTO_INCREMENT,
                `mb_id` varchar(100) NOT NULL DEFAULT '',
                `phone` varchar(50) NOT NULL DEFAULT '',
                `email` varchar(120) NOT NULL DEFAULT '',
                `kakao_enabled` tinyint(1) NOT NULL DEFAULT 1,
                `email_enabled` tinyint(1) NOT NULL DEFAULT 1,
                `education_active_enabled` tinyint(1) NOT NULL DEFAULT 1,
                `inquiry_admin_enabled` tinyint(1) NOT NULL DEFAULT 0,
                `is_admin_pref` tinyint(1) NOT NULL DEFAULT 0,
                `created_at` datetime NOT NULL,
                `updated_at` datetime NOT NULL,
                PRIMARY KEY (`pref_id`),
                UNIQUE KEY `uniq_mb_id` (`mb_id`),
                KEY `idx_admin_kakao` (`is_admin_pref`, `inquiry_admin_enabled`, `kakao_enabled`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
            sql_query($sql, false);
        }

        $done = true;
        return true;
    }
}

if (!function_exists('onoff_notification_bool')) {
    function onoff_notification_bool($value, $default = true)
    {
        if ($value === null || $value === '') {
            return $default ? 1 : 0;
        }
        if ($value === true || $value === 1 || $value === '1') {
            return 1;
        }
        $lower = strtolower((string) $value);
        return in_array($lower, array('true', 'yes', 'on'), true) ? 1 : 0;
    }
}

if (!function_exists('onoff_notification_normalize_mb_id')) {
    function onoff_notification_normalize_mb_id($mb_id)
    {
        return preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
    }
}

if (!function_exists('onoff_notification_normalize_phone')) {
    function onoff_notification_normalize_phone($phone)
    {
        return preg_replace('/[^0-9]/', '', (string) $phone);
    }
}

if (!function_exists('onoff_notification_default_preferences')) {
    function onoff_notification_default_preferences($mb_id, $phone = '', $email = '', $is_admin = false)
    {
        return array(
            'mb_id' => onoff_notification_normalize_mb_id($mb_id),
            'phone' => onoff_notification_normalize_phone($phone),
            'email' => filter_var($email, FILTER_VALIDATE_EMAIL) ? (string) $email : '',
            'kakao_enabled' => 1,
            'email_enabled' => 1,
            'education_active_enabled' => 1,
            'inquiry_admin_enabled' => 0,
            'is_admin_pref' => $is_admin ? 1 : 0,
        );
    }
}

if (!function_exists('onoff_notification_get_preferences')) {
    function onoff_notification_get_preferences($mb_id, $defaults = array())
    {
        onoff_notification_ensure_table();
        $table = onoff_notification_preferences_table();
        $mb_id = onoff_notification_normalize_mb_id($mb_id);
        if ($mb_id === '') {
            return null;
        }
        $row = sql_fetch(" select * from {$table} where mb_id = '" . sql_real_escape_string($mb_id) . "' limit 1 ");
        if (!$row) {
            return array_merge(onoff_notification_default_preferences($mb_id), $defaults);
        }
        foreach (array('kakao_enabled', 'email_enabled', 'education_active_enabled', 'inquiry_admin_enabled', 'is_admin_pref') as $key) {
            $row[$key] = (int) $row[$key];
        }
        return $row;
    }
}

if (!function_exists('onoff_notification_save_preferences')) {
    function onoff_notification_save_preferences($mb_id, array $data, $can_manage_admin = false)
    {
        onoff_notification_ensure_table();
        $table = onoff_notification_preferences_table();
        $mb_id = onoff_notification_normalize_mb_id($mb_id);
        if ($mb_id === '') {
            return false;
        }

        $current = onoff_notification_get_preferences($mb_id);
        $phone = array_key_exists('phone', $data) ? onoff_notification_normalize_phone($data['phone']) : (string) ($current['phone'] ?? '');
        $email = array_key_exists('email', $data) && filter_var($data['email'], FILTER_VALIDATE_EMAIL) ? (string) $data['email'] : (string) ($current['email'] ?? '');
        $kakao_enabled = onoff_notification_bool($data['kakao_enabled'] ?? ($current['kakao_enabled'] ?? 1), true);
        $email_enabled = onoff_notification_bool($data['email_enabled'] ?? ($current['email_enabled'] ?? 1), true);
        $education_active_enabled = onoff_notification_bool($data['education_active_enabled'] ?? ($current['education_active_enabled'] ?? 1), true);
        $inquiry_admin_enabled = $can_manage_admin ? onoff_notification_bool($data['inquiry_admin_enabled'] ?? ($current['inquiry_admin_enabled'] ?? 0), false) : 0;
        $is_admin_pref = $can_manage_admin && $inquiry_admin_enabled ? 1 : 0;
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');

        $exists = sql_fetch(" select pref_id from {$table} where mb_id = '" . sql_real_escape_string($mb_id) . "' limit 1 ");
        if ($exists) {
            $sql = " update {$table}
                        set phone = '" . sql_real_escape_string($phone) . "',
                            email = '" . sql_real_escape_string($email) . "',
                            kakao_enabled = '" . (int) $kakao_enabled . "',
                            email_enabled = '" . (int) $email_enabled . "',
                            education_active_enabled = '" . (int) $education_active_enabled . "',
                            inquiry_admin_enabled = '" . (int) $inquiry_admin_enabled . "',
                            is_admin_pref = '" . (int) $is_admin_pref . "',
                            updated_at = '" . sql_real_escape_string($now) . "'
                      where mb_id = '" . sql_real_escape_string($mb_id) . "' ";
            sql_query($sql, false);
        } else {
            $sql = " insert into {$table}
                        set mb_id = '" . sql_real_escape_string($mb_id) . "',
                            phone = '" . sql_real_escape_string($phone) . "',
                            email = '" . sql_real_escape_string($email) . "',
                            kakao_enabled = '" . (int) $kakao_enabled . "',
                            email_enabled = '" . (int) $email_enabled . "',
                            education_active_enabled = '" . (int) $education_active_enabled . "',
                            inquiry_admin_enabled = '" . (int) $inquiry_admin_enabled . "',
                            is_admin_pref = '" . (int) $is_admin_pref . "',
                            created_at = '" . sql_real_escape_string($now) . "',
                            updated_at = '" . sql_real_escape_string($now) . "' ";
            sql_query($sql, false);
        }

        return onoff_notification_get_preferences($mb_id);
    }
}

if (!function_exists('onoff_notification_get_admin_kakao_receivers')) {
    function onoff_notification_get_admin_kakao_receivers()
    {
        onoff_notification_ensure_table();
        $table = onoff_notification_preferences_table();
        $items = array();
        $result = sql_query(" select mb_id, phone from {$table}
                               where is_admin_pref = '1'
                                 and inquiry_admin_enabled = '1'
                                 and kakao_enabled = '1'
                                 and phone <> '' ");
        while ($row = sql_fetch_array($result)) {
            $phone = onoff_notification_normalize_phone($row['phone']);
            if ($phone !== '') {
                $items[$phone] = array('mb_id' => (string) $row['mb_id'], 'phone' => $phone);
            }
        }
        return array_values($items);
    }
}
