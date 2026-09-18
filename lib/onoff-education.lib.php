<?php
/**
 * ONOFF Education enrollment helpers.
 * Bank-transfer only workflow:
 * contract inquiry → pending enrollment → admin confirms deposit → active enrollment.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (!function_exists('onoff_education_table_prefix')) {
    function onoff_education_table_prefix()
    {
        if (function_exists('icrm_table_prefix')) {
            return icrm_table_prefix();
        }
        return defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    }
}

if (!function_exists('onoff_education_enrollment_table')) {
    function onoff_education_enrollment_table()
    {
        return onoff_education_table_prefix() . 'onoff_education_enrollments';
    }
}

if (!function_exists('onoff_education_ensure_table')) {
    function onoff_education_ensure_table()
    {
        static $done = false;
        if ($done) {
            return true;
        }
        $table = onoff_education_enrollment_table();
        $exists = sql_fetch("SHOW TABLES LIKE '" . sql_real_escape_string($table) . "'");
        if ($exists) {
            $done = true;
            onoff_education_ensure_columns();
            return true;
        }

        $sql = "CREATE TABLE IF NOT EXISTS `{$table}` (
            `en_id` int(11) NOT NULL AUTO_INCREMENT,
            `course_id` varchar(50) NOT NULL DEFAULT 'seo-geo-master',
            `mb_id` varchar(100) NOT NULL DEFAULT '',
            `applicant_name` varchar(100) NOT NULL DEFAULT '',
            `phone` varchar(50) NOT NULL DEFAULT '',
            `email` varchar(120) NOT NULL DEFAULT '',
            `status` varchar(20) NOT NULL DEFAULT 'pending_deposit',
            `source` varchar(30) NOT NULL DEFAULT 'contract',
            `contract_bo_table` varchar(50) NOT NULL DEFAULT '',
            `contract_wr_id` int(11) NOT NULL DEFAULT 0,
            `deposit_amount` int(11) NOT NULL DEFAULT 0,
            `depositor_name` varchar(100) NOT NULL DEFAULT '',
            `admin_memo` text NULL,
            `starts_at` datetime NULL,
            `ends_at` datetime NULL,
            `activated_at` datetime NULL,
            `cancelled_at` datetime NULL,
            `kakao_active_sent_at` datetime NULL,
            `kakao_last_error` varchar(255) NOT NULL DEFAULT '',
            `created_at` datetime NOT NULL,
            `updated_at` datetime NOT NULL,
            PRIMARY KEY (`en_id`),
            KEY `idx_mb_status` (`mb_id`, `status`),
            KEY `idx_contract` (`contract_bo_table`, `contract_wr_id`),
            KEY `idx_course_status` (`course_id`, `status`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8";
        sql_query($sql, false);
        $done = true;
        onoff_education_ensure_columns();
        return true;
    }
}

if (!function_exists('onoff_education_ensure_columns')) {
    function onoff_education_ensure_columns()
    {
        static $done = false;
        if ($done) {
            return true;
        }
        $table = onoff_education_enrollment_table();
        $columns = array(
            'kakao_active_sent_at' => "ALTER TABLE `{$table}` ADD `kakao_active_sent_at` datetime NULL AFTER `cancelled_at`",
            'kakao_last_error' => "ALTER TABLE `{$table}` ADD `kakao_last_error` varchar(255) NOT NULL DEFAULT '' AFTER `kakao_active_sent_at`",
        );
        foreach ($columns as $column => $sql) {
            $exists = sql_fetch("SHOW COLUMNS FROM `{$table}` LIKE '" . sql_real_escape_string($column) . "'");
            if (empty($exists)) {
                sql_query($sql, false);
            }
        }
        $done = true;
        return true;
    }
}

if (!function_exists('onoff_education_normalize_status')) {
    function onoff_education_normalize_status($status)
    {
        $status = trim((string) $status);
        $allowed = array('pending_deposit', 'active', 'expired', 'cancelled');
        return in_array($status, $allowed, true) ? $status : 'pending_deposit';
    }
}

if (!function_exists('onoff_education_create_pending_enrollment')) {
    function onoff_education_create_pending_enrollment(array $data)
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();

        $bo_table = isset($data['contract_bo_table']) ? preg_replace('/[^a-z0-9_]/i', '', (string) $data['contract_bo_table']) : '';
        $wr_id = isset($data['contract_wr_id']) ? (int) $data['contract_wr_id'] : 0;

        if ($bo_table !== '' && $wr_id > 0) {
            $exists = sql_fetch(" select en_id from {$table} where contract_bo_table = '" . sql_real_escape_string($bo_table) . "' and contract_wr_id = '" . (int) $wr_id . "' limit 1 ");
            if (!empty($exists['en_id'])) {
                return (int) $exists['en_id'];
            }
        }

        $course_id = isset($data['course_id']) ? preg_replace('/[^a-z0-9_\-]/i', '', (string) $data['course_id']) : 'seo-geo-master';
        if ($course_id === '') {
            $course_id = 'seo-geo-master';
        }
        $mb_id = isset($data['mb_id']) ? preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $data['mb_id']) : '';
        $name = isset($data['applicant_name']) ? trim(strip_tags((string) $data['applicant_name'])) : '';
        $phone = isset($data['phone']) ? trim(strip_tags((string) $data['phone'])) : '';
        $email = isset($data['email']) ? trim(strip_tags((string) $data['email'])) : '';
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');

        $sql = " insert into {$table}
                    set course_id = '" . sql_real_escape_string($course_id) . "',
                        mb_id = '" . sql_real_escape_string($mb_id) . "',
                        applicant_name = '" . sql_real_escape_string($name) . "',
                        phone = '" . sql_real_escape_string($phone) . "',
                        email = '" . sql_real_escape_string($email) . "',
                        status = 'pending_deposit',
                        source = 'contract',
                        contract_bo_table = '" . sql_real_escape_string($bo_table) . "',
                        contract_wr_id = '" . (int) $wr_id . "',
                        created_at = '" . sql_real_escape_string($now) . "',
                        updated_at = '" . sql_real_escape_string($now) . "' ";
        sql_query($sql, false);
        return (int) sql_insert_id();
    }
}

if (!function_exists('onoff_education_update_enrollment')) {
    function onoff_education_update_enrollment($en_id, array $data)
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $en_id = (int) $en_id;
        if ($en_id < 1) {
            return false;
        }

        $status = onoff_education_normalize_status($data['status'] ?? 'pending_deposit');
        $mb_id = isset($data['mb_id']) ? preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $data['mb_id']) : null;
        $deposit_amount = isset($data['deposit_amount']) ? max(0, (int) $data['deposit_amount']) : 0;
        $depositor_name = isset($data['depositor_name']) ? trim(strip_tags((string) $data['depositor_name'])) : '';
        $admin_memo = isset($data['admin_memo']) ? trim(strip_tags((string) $data['admin_memo'])) : '';
        $starts_at = isset($data['starts_at']) ? trim(strip_tags((string) $data['starts_at'])) : '';
        $ends_at = isset($data['ends_at']) ? trim(strip_tags((string) $data['ends_at'])) : '';
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');

        $activated_sql = $status === 'active' ? ", activated_at = IF(activated_at IS NULL, '" . sql_real_escape_string($now) . "', activated_at)" : '';
        $cancelled_sql = $status === 'cancelled' ? ", cancelled_at = IF(cancelled_at IS NULL, '" . sql_real_escape_string($now) . "', cancelled_at)" : '';

        $mb_sql = $mb_id !== null ? " mb_id = '" . sql_real_escape_string($mb_id) . "', " : '';
        $sql = " update {$table}
                    set {$mb_sql}
                        status = '" . sql_real_escape_string($status) . "',
                        deposit_amount = '" . (int) $deposit_amount . "',
                        depositor_name = '" . sql_real_escape_string($depositor_name) . "',
                        admin_memo = '" . sql_real_escape_string($admin_memo) . "',
                        starts_at = " . ($starts_at !== '' ? "'" . sql_real_escape_string($starts_at) . "'" : "NULL") . ",
                        ends_at = " . ($ends_at !== '' ? "'" . sql_real_escape_string($ends_at) . "'" : "NULL") . ",
                        updated_at = '" . sql_real_escape_string($now) . "'
                        {$activated_sql}
                        {$cancelled_sql}
                  where en_id = '{$en_id}' ";
        return (bool) sql_query($sql, false);
    }
}

if (!function_exists('onoff_education_serialize_enrollment')) {
    function onoff_education_serialize_enrollment($row)
    {
        if (!$row || !is_array($row)) {
            return null;
        }
        return array(
            'en_id' => (int) $row['en_id'],
            'course_id' => (string) $row['course_id'],
            'mb_id' => (string) $row['mb_id'],
            'applicant_name' => (string) $row['applicant_name'],
            'status' => (string) $row['status'],
            'source' => (string) $row['source'],
            'deposit_amount' => (int) ($row['deposit_amount'] ?? 0),
            'depositor_name' => (string) ($row['depositor_name'] ?? ''),
            'starts_at' => (string) $row['starts_at'],
            'ends_at' => (string) $row['ends_at'],
            'activated_at' => (string) $row['activated_at'],
            'kakao_active_sent_at' => (string) ($row['kakao_active_sent_at'] ?? ''),
            'created_at' => (string) $row['created_at'],
            'updated_at' => (string) ($row['updated_at'] ?? ''),
        );
    }
}

if (!function_exists('onoff_education_get_enrollment')) {
    function onoff_education_get_enrollment($en_id)
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $en_id = (int) $en_id;
        if ($en_id < 1) {
            return null;
        }
        $row = sql_fetch(" select * from {$table} where en_id = '{$en_id}' limit 1 ");
        return $row ?: null;
    }
}

if (!function_exists('onoff_education_mark_kakao_active_notification')) {
    function onoff_education_mark_kakao_active_notification($en_id, $sent, $error = '')
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $en_id = (int) $en_id;
        if ($en_id < 1) {
            return false;
        }
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
        $error = trim(strip_tags((string) $error));
        if (function_exists('mb_substr')) {
            $error = mb_substr($error, 0, 240, 'UTF-8');
        } else {
            $error = substr($error, 0, 240);
        }
        $sent_sql = $sent ? "kakao_active_sent_at = IF(kakao_active_sent_at IS NULL, '" . sql_real_escape_string($now) . "', kakao_active_sent_at)," : '';
        $sql = " update {$table}
                    set {$sent_sql}
                        kakao_last_error = '" . sql_real_escape_string($error) . "',
                        updated_at = '" . sql_real_escape_string($now) . "'
                  where en_id = '{$en_id}' ";
        return (bool) sql_query($sql, false);
    }
}

if (!function_exists('onoff_education_get_active_enrollment')) {
    function onoff_education_get_active_enrollment($mb_id, $course_id = 'seo-geo-master')
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if ($mb_id === '') {
            return null;
        }
        if ($course_id === '') {
            $course_id = 'seo-geo-master';
        }

        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
        $expired_sql = " update {$table}
                            set status = 'expired',
                                updated_at = '" . sql_real_escape_string($now) . "'
                          where mb_id = '" . sql_real_escape_string($mb_id) . "'
                            and course_id = '" . sql_real_escape_string($course_id) . "'
                            and status = 'active'
                            and ends_at is not null
                            and ends_at <> ''
                            and ends_at < '" . sql_real_escape_string($now) . "' ";
        sql_query($expired_sql, false);

        $sql = " select *
                   from {$table}
                  where mb_id = '" . sql_real_escape_string($mb_id) . "'
                    and course_id = '" . sql_real_escape_string($course_id) . "'
                    and status = 'active'
                    and (starts_at is null or starts_at = '' or starts_at <= '" . sql_real_escape_string($now) . "')
                    and (ends_at is null or ends_at = '' or ends_at >= '" . sql_real_escape_string($now) . "')
                  order by en_id desc
                  limit 1 ";
        $row = sql_fetch($sql);
        return $row ?: null;
    }
}
