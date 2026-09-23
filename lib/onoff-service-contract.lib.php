<?php
/**
 * ONOFF marketing / education+marketing service contracts (CPA-style flow).
 * Tables: onoff_service_contracts, _logs, _status_logs, _addenda.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (!defined('ONOFF_SC_STATUS_PENDING')) {
    define('ONOFF_SC_STATUS_PENDING', 'pending');
}
if (!defined('ONOFF_SC_STATUS_IN_PROGRESS')) {
    define('ONOFF_SC_STATUS_IN_PROGRESS', 'in_progress');
}
if (!defined('ONOFF_SC_STATUS_REVIEW_PENDING')) {
    define('ONOFF_SC_STATUS_REVIEW_PENDING', 'review_pending');
}
if (!defined('ONOFF_SC_STATUS_SIGNED')) {
    define('ONOFF_SC_STATUS_SIGNED', 'signed');
}
if (!defined('ONOFF_SC_STATUS_REJECTED')) {
    define('ONOFF_SC_STATUS_REJECTED', 'rejected');
}
if (!defined('ONOFF_SC_STATUS_CANCELLED')) {
    define('ONOFF_SC_STATUS_CANCELLED', 'cancelled');
}
if (!defined('ONOFF_SC_STATUS_EXPIRED')) {
    define('ONOFF_SC_STATUS_EXPIRED', 'expired');
}
if (!defined('ONOFF_SC_STATUS_RENEWAL')) {
    define('ONOFF_SC_STATUS_RENEWAL', 'renewal');
}

if (!function_exists('onoff_service_contract_bootstrap')) {
    function onoff_service_contract_bootstrap()
    {
        if (!function_exists('onoff_education_get_enrollment')) {
            $path = (defined('G5_LIB_PATH') ? G5_LIB_PATH : dirname(__FILE__)) . '/onoff-education.lib.php';
            if (is_file($path)) {
                include_once $path;
            }
        }
        if (!function_exists('onoff_edu_contract_public')) {
            $path = (defined('G5_LIB_PATH') ? G5_LIB_PATH : dirname(__FILE__)) . '/onoff-edu-contract.lib.php';
            if (is_file($path)) {
                include_once $path;
            }
        }
    }
}

if (!function_exists('onoff_service_contract_now')) {
    function onoff_service_contract_now()
    {
        return defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
    }
}

if (!function_exists('onoff_service_contract_table_prefix')) {
    function onoff_service_contract_table_prefix()
    {
        if (defined('G5_TABLE_PREFIX') && G5_TABLE_PREFIX !== '') {
            return G5_TABLE_PREFIX;
        }
        return 'g5_';
    }
}

if (!function_exists('onoff_service_contract_table')) {
    function onoff_service_contract_table()
    {
        return onoff_service_contract_table_prefix() . 'onoff_service_contracts';
    }
}

if (!function_exists('onoff_service_contract_log_table')) {
    function onoff_service_contract_log_table()
    {
        return onoff_service_contract_table_prefix() . 'onoff_service_contract_logs';
    }
}

if (!function_exists('onoff_service_contract_status_log_table')) {
    function onoff_service_contract_status_log_table()
    {
        return onoff_service_contract_table_prefix() . 'onoff_service_contract_status_logs';
    }
}

if (!function_exists('onoff_service_contract_addendum_table')) {
    function onoff_service_contract_addendum_table()
    {
        return onoff_service_contract_table_prefix() . 'onoff_service_contract_addenda';
    }
}

if (!function_exists('onoff_service_contract_ensure_tables')) {
    function onoff_service_contract_ensure_tables()
    {
        static $done = false;
        if ($done || !function_exists('sql_query')) {
            return (bool) $done;
        }

        $contracts = onoff_service_contract_table();
        $logs = onoff_service_contract_log_table();
        $status_logs = onoff_service_contract_status_log_table();
        $addenda = onoff_service_contract_addendum_table();

        $sql_contracts = "CREATE TABLE IF NOT EXISTS `{$contracts}` (
  `sc_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sc_mb_id` varchar(50) NOT NULL DEFAULT '',
  `sc_en_id` int unsigned NOT NULL DEFAULT 0,
  `sc_course_id` varchar(50) NOT NULL DEFAULT '',
  `sc_inquiry_bo_table` varchar(50) NOT NULL DEFAULT '',
  `sc_inquiry_wr_id` int unsigned NOT NULL DEFAULT 0,
  `sc_contract_version` varchar(50) NOT NULL DEFAULT '',
  `sc_contract_code` varchar(50) NOT NULL DEFAULT '',
  `sc_status` varchar(20) NOT NULL DEFAULT 'pending',
  `sc_company_name` varchar(200) NOT NULL DEFAULT '',
  `sc_representative_name` varchar(100) NOT NULL DEFAULT '',
  `sc_business_number` varchar(20) NOT NULL DEFAULT '',
  `sc_company_address` varchar(500) NOT NULL DEFAULT '',
  `sc_company_phone` varchar(30) NOT NULL DEFAULT '',
  `sc_signer_name` varchar(100) NOT NULL DEFAULT '',
  `sc_signer_position` varchar(100) NOT NULL DEFAULT '',
  `sc_signer_phone` varchar(30) NOT NULL DEFAULT '',
  `sc_signer_email` varchar(200) NOT NULL DEFAULT '',
  `sc_service_scope` mediumtext,
  `sc_amount` varchar(100) NOT NULL DEFAULT '',
  `sc_start_date` varchar(30) NOT NULL DEFAULT '',
  `sc_end_date` varchar(30) NOT NULL DEFAULT '',
  `sc_negotiated_terms` mediumtext,
  `sc_special_clauses` mediumtext,
  `sc_signature_file_path` varchar(500) NOT NULL DEFAULT '',
  `sc_signed_at` datetime DEFAULT NULL,
  `sc_signed_ip` varchar(45) NOT NULL DEFAULT '',
  `sc_user_agent` varchar(500) NOT NULL DEFAULT '',
  `sc_contract_pdf_path` varchar(500) NOT NULL DEFAULT '',
  `sc_contract_file_hash` varchar(128) NOT NULL DEFAULT '',
  `sc_company_snapshot` longtext,
  `sc_contract_snapshot` longtext,
  `sc_agreement_snapshot` longtext,
  `sc_reviewed_by` varchar(50) NOT NULL DEFAULT '',
  `sc_reviewed_at` datetime DEFAULT NULL,
  `sc_reject_reason` varchar(1000) NOT NULL DEFAULT '',
  `sc_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sc_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sc_id`),
  UNIQUE KEY `uk_sc_en_version` (`sc_en_id`, `sc_contract_version`),
  KEY `idx_sc_mb_id` (`sc_mb_id`),
  KEY `idx_sc_status` (`sc_status`),
  KEY `idx_sc_course` (`sc_course_id`),
  KEY `idx_sc_code` (`sc_contract_code`),
  KEY `idx_sc_signed_at` (`sc_signed_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $sql_logs = "CREATE TABLE IF NOT EXISTS `{$logs}` (
  `scl_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sc_id` bigint unsigned NOT NULL DEFAULT 0,
  `sc_mb_id` varchar(50) NOT NULL DEFAULT '',
  `scl_contract_code` varchar(50) NOT NULL DEFAULT '',
  `scl_contract_version` varchar(50) NOT NULL DEFAULT '',
  `scl_signed_at` datetime DEFAULT NULL,
  `scl_ip` varchar(45) NOT NULL DEFAULT '',
  `scl_user_agent` varchar(500) NOT NULL DEFAULT '',
  `scl_pdf_path` varchar(500) NOT NULL DEFAULT '',
  `scl_pdf_hash` varchar(128) NOT NULL DEFAULT '',
  `scl_result` varchar(20) NOT NULL DEFAULT 'success',
  `scl_message` varchar(500) NOT NULL DEFAULT '',
  `scl_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`scl_id`),
  KEY `idx_scl_sc_id` (`sc_id`),
  KEY `idx_scl_mb_id` (`sc_mb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $sql_status = "CREATE TABLE IF NOT EXISTS `{$status_logs}` (
  `scsl_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sc_id` bigint unsigned NOT NULL DEFAULT 0,
  `sc_mb_id` varchar(50) NOT NULL DEFAULT '',
  `admin_mb_id` varchar(50) NOT NULL DEFAULT '',
  `actor_type` varchar(20) NOT NULL DEFAULT 'admin',
  `scsl_old_status` varchar(20) NOT NULL DEFAULT '',
  `scsl_new_status` varchar(20) NOT NULL DEFAULT '',
  `scsl_reason` varchar(1000) NOT NULL DEFAULT '',
  `scsl_ip` varchar(45) NOT NULL DEFAULT '',
  `scsl_user_agent` varchar(500) NOT NULL DEFAULT '',
  `scsl_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`scsl_id`),
  KEY `idx_scsl_sc_id` (`sc_id`),
  KEY `idx_scsl_mb_id` (`sc_mb_id`),
  KEY `idx_scsl_admin` (`admin_mb_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        $sql_addenda = "CREATE TABLE IF NOT EXISTS `{$addenda}` (
  `sca_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sc_id` bigint unsigned NOT NULL DEFAULT 0,
  `sc_mb_id` varchar(50) NOT NULL DEFAULT '',
  `sca_seq` int unsigned NOT NULL DEFAULT 1,
  `sca_title` varchar(200) NOT NULL DEFAULT '특약사항',
  `sca_body` mediumtext NOT NULL,
  `sca_status` varchar(20) NOT NULL DEFAULT 'active',
  `sca_created_by_type` varchar(20) NOT NULL DEFAULT 'admin',
  `sca_created_by` varchar(100) NOT NULL DEFAULT '',
  `sca_voided_at` datetime DEFAULT NULL,
  `sca_void_reason` varchar(500) NOT NULL DEFAULT '',
  `sca_created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `sca_updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sca_id`),
  KEY `idx_sca_sc_id` (`sc_id`),
  KEY `idx_sca_mb_id` (`sc_mb_id`),
  KEY `idx_sca_status` (`sca_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4";

        sql_query($sql_contracts, false);
        sql_query($sql_logs, false);
        sql_query($sql_status, false);
        sql_query($sql_addenda, false);
        $done = true;
        return true;
    }
}

if (!function_exists('onoff_service_contract_party_b')) {
    function onoff_service_contract_party_b()
    {
        global $site_config;
        $company = '온오프마케팅';
        $representative = '박민수';
        $business_number = '';
        $address = '';
        $phone = '';
        if (is_array($site_config)) {
            if (!empty($site_config['company_name'])) {
                $company = (string) $site_config['company_name'];
            }
            if (!empty($site_config['ceo_name'])) {
                $representative = (string) $site_config['ceo_name'];
            }
            if (!empty($site_config['business_no'])) {
                $business_number = (string) $site_config['business_no'];
            }
            if (!empty($site_config['address'])) {
                $address = (string) $site_config['address'];
            }
            if (!empty($site_config['phone'])) {
                $phone = (string) $site_config['phone'];
            }
        }
        return array(
            'company_name' => $company,
            'representative_name' => $representative,
            'business_number' => $business_number,
            'company_address' => $address,
            'company_phone' => $phone,
        );
    }
}

if (!function_exists('onoff_service_contract_status_label')) {
    function onoff_service_contract_status_label($status)
    {
        $status = (string) $status;
        $map = array(
            ONOFF_SC_STATUS_PENDING => '작성 대기',
            ONOFF_SC_STATUS_IN_PROGRESS => '작성 중',
            ONOFF_SC_STATUS_REVIEW_PENDING => '승인 대기',
            ONOFF_SC_STATUS_SIGNED => '체결 완료',
            ONOFF_SC_STATUS_REJECTED => '반려',
            ONOFF_SC_STATUS_CANCELLED => '취소',
            ONOFF_SC_STATUS_EXPIRED => '만료',
            ONOFF_SC_STATUS_RENEWAL => '갱신 필요',
        );
        return isset($map[$status]) ? $map[$status] : $status;
    }
}

if (!function_exists('onoff_service_contract_marketing_course_ids')) {
    function onoff_service_contract_marketing_course_ids()
    {
        return array('marketing-service', 'education-marketing');
    }
}

if (!function_exists('onoff_service_contract_applies_course')) {
    function onoff_service_contract_applies_course($course_id)
    {
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if ($course_id === 'marketing-service' || $course_id === 'education-marketing') {
            return true;
        }
        if ($course_id === 'marketing' || $course_id === 'edu-marketing') {
            return true;
        }
        return false;
    }
}

if (!function_exists('onoff_service_contract_version_for_course')) {
    function onoff_service_contract_version_for_course($course_id)
    {
        onoff_service_contract_bootstrap();
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if (function_exists('onoff_education_contract_package_for_course')) {
            $pkg = onoff_education_contract_package_for_course($course_id);
            if (!empty($pkg['version'])) {
                return (string) $pkg['version'];
            }
        }
        if ($course_id === 'education-marketing') {
            return 'EDU-MKT-CONTRACT-2026-09';
        }
        return 'MKT-CONTRACT-2026-09';
    }
}

if (!function_exists('onoff_service_contract_grace_until')) {
    function onoff_service_contract_grace_until()
    {
        return defined('ONOFF_SERVICE_CONTRACT_GRACE_UNTIL') ? (string) ONOFF_SERVICE_CONTRACT_GRACE_UNTIL : '';
    }
}

if (!function_exists('onoff_service_contract_grace_active')) {
    function onoff_service_contract_grace_active()
    {
        $until = trim(onoff_service_contract_grace_until());
        if ($until === '') {
            return false;
        }
        $now = onoff_service_contract_now();
        return strcmp($now, $until) <= 0;
    }
}

if (!function_exists('onoff_service_contract_applicable_enrollment_statuses')) {
    function onoff_service_contract_applicable_enrollment_statuses()
    {
        return array('pending_deposit', 'pending_contract', 'active', 'expired');
    }
}

if (!function_exists('onoff_service_contract_decode_json')) {
    function onoff_service_contract_decode_json($raw)
    {
        if (is_array($raw)) {
            return $raw;
        }
        $decoded = json_decode((string) $raw, true);
        return is_array($decoded) ? $decoded : array();
    }
}

if (!function_exists('onoff_service_contract_client_ip')) {
    function onoff_service_contract_client_ip()
    {
        return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 45);
    }
}

if (!function_exists('onoff_service_contract_user_agent')) {
    function onoff_service_contract_user_agent()
    {
        $ua = (string) ($_SERVER['HTTP_USER_AGENT'] ?? '');
        if (function_exists('mb_substr')) {
            return mb_substr($ua, 0, 500, 'UTF-8');
        }
        return substr($ua, 0, 500);
    }
}

if (!function_exists('onoff_service_contract_data_base_dir')) {
    function onoff_service_contract_data_base_dir()
    {
        $dir = G5_DATA_PATH . '/onoff_service_contracts';
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }
}

if (!function_exists('onoff_service_contract_signature_dir_for_mb')) {
    function onoff_service_contract_signature_dir_for_mb($mb_id)
    {
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $dir = onoff_service_contract_data_base_dir() . '/signatures/' . $mb_id;
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }
}

if (!function_exists('onoff_service_contract_save_signature_png_local')) {
    /**
     * @return array{ok:bool,message:string,path:string}
     */
    function onoff_service_contract_save_signature_png_local($mb_id, $data_url)
    {
        $data_url = trim((string) $data_url);
        if ($data_url === '') {
            return array('ok' => false, 'message' => '서명 데이터가 없습니다.', 'path' => '');
        }
        if (!preg_match('#^data:image/png;base64,#i', $data_url)) {
            return array('ok' => false, 'message' => 'PNG 형식의 서명만 허용됩니다.', 'path' => '');
        }
        $binary = base64_decode(preg_replace('#^data:image/png;base64,#i', '', $data_url), true);
        if ($binary === false || $binary === '') {
            return array('ok' => false, 'message' => '서명 데이터가 올바르지 않습니다.', 'path' => '');
        }
        if (strlen($binary) > 500 * 1024) {
            return array('ok' => false, 'message' => '서명 파일 크기가 너무 큽니다. (최대 500KB)', 'path' => '');
        }
        if (substr($binary, 0, 8) !== "\x89PNG\r\n\x1a\n") {
            return array('ok' => false, 'message' => 'PNG 형식의 서명만 허용됩니다.', 'path' => '');
        }
        $dir = onoff_service_contract_signature_dir_for_mb($mb_id);
        if (!is_dir($dir) || !is_writable($dir)) {
            return array('ok' => false, 'message' => '서명 저장 폴더를 사용할 수 없습니다.', 'path' => '');
        }
        $name = 'sig_' . date('Ymd_His') . '_' . substr(md5($mb_id . microtime(true)), 0, 10) . '.png';
        $abs = $dir . '/' . $name;
        if (@file_put_contents($abs, $binary) === false) {
            return array('ok' => false, 'message' => '서명 파일 저장에 실패했습니다.', 'path' => '');
        }
        $rel = 'onoff_service_contracts/signatures/' . preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id) . '/' . $name;
        return array('ok' => true, 'message' => '서명이 저장되었습니다.', 'path' => $rel);
    }
}

if (!function_exists('onoff_service_contract_abs_from_data_path')) {
    function onoff_service_contract_abs_from_data_path($rel)
    {
        $rel = ltrim(str_replace('\\', '/', (string) $rel), '/');
        if ($rel === '' || strpos($rel, '..') !== false) {
            return '';
        }
        return G5_DATA_PATH . '/' . $rel;
    }
}

if (!function_exists('onoff_service_contract_sanitize_text')) {
    function onoff_service_contract_sanitize_text($v, $max = 500)
    {
        $v = trim(strip_tags((string) $v));
        $max = max(1, (int) $max);
        if (function_exists('mb_substr')) {
            return mb_substr($v, 0, $max, 'UTF-8');
        }
        return substr($v, 0, $max);
    }
}

if (!function_exists('onoff_service_contract_log_status')) {
    function onoff_service_contract_log_status($sc_id, $mb_id, $old_status, $new_status, $reason, $actor_mb_id, $actor_type = 'admin')
    {
        onoff_service_contract_ensure_tables();
        $table = onoff_service_contract_status_log_table();
        $sc_id = (int) $sc_id;
        $sql = " insert into {$table} set
            sc_id = '{$sc_id}',
            sc_mb_id = '" . sql_real_escape_string((string) $mb_id) . "',
            admin_mb_id = '" . sql_real_escape_string(preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $actor_mb_id)) . "',
            actor_type = '" . sql_real_escape_string(preg_replace('/[^a-z0-9_\-]/i', '', (string) $actor_type)) . "',
            scsl_old_status = '" . sql_real_escape_string((string) $old_status) . "',
            scsl_new_status = '" . sql_real_escape_string((string) $new_status) . "',
            scsl_reason = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($reason, 1000)) . "',
            scsl_ip = '" . sql_real_escape_string(onoff_service_contract_client_ip()) . "',
            scsl_user_agent = '" . sql_real_escape_string(onoff_service_contract_user_agent()) . "' ";
        return (bool) sql_query($sql, false);
    }
}

if (!function_exists('onoff_service_contract_get')) {
    function onoff_service_contract_get($en_id, $version = '')
    {
        onoff_service_contract_ensure_tables();
        $table = onoff_service_contract_table();
        $en_id = (int) $en_id;
        if ($en_id < 1) {
            return null;
        }
        $version = trim((string) $version);
        if ($version !== '') {
            $row = sql_fetch(" select * from {$table}
                where sc_en_id = '{$en_id}'
                  and sc_contract_version = '" . sql_real_escape_string($version) . "'
                limit 1 ");
            return $row ?: null;
        }
        $row = sql_fetch(" select * from {$table}
            where sc_en_id = '{$en_id}'
            order by sc_id desc
            limit 1 ");
        return $row ?: null;
    }
}

if (!function_exists('onoff_service_contract_get_by_id')) {
    function onoff_service_contract_get_by_id($sc_id)
    {
        onoff_service_contract_ensure_tables();
        $table = onoff_service_contract_table();
        $sc_id = (int) $sc_id;
        if ($sc_id < 1) {
            return null;
        }
        $row = sql_fetch(" select * from {$table} where sc_id = '{$sc_id}' limit 1 ");
        return $row ?: null;
    }
}

if (!function_exists('onoff_service_contract_get_latest_for_member')) {
    function onoff_service_contract_get_latest_for_member($mb_id, $course_id = '')
    {
        onoff_service_contract_ensure_tables();
        $table = onoff_service_contract_table();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        if ($mb_id === '') {
            return null;
        }
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        $course_sql = '';
        if ($course_id !== '') {
            $course_sql = " and sc_course_id = '" . sql_real_escape_string($course_id) . "' ";
        }
        $row = sql_fetch(" select * from {$table}
            where sc_mb_id = '" . sql_real_escape_string($mb_id) . "'
            {$course_sql}
            order by sc_id desc
            limit 1 ");
        return $row ?: null;
    }
}

if (!function_exists('onoff_service_contract_resolve_package_course')) {
    function onoff_service_contract_resolve_package_course($enrollment)
    {
        onoff_service_contract_bootstrap();
        if (!$enrollment || !is_array($enrollment)) {
            return 'marketing-service';
        }
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($enrollment['course_id'] ?? ''));
        if ($course_id === 'education-marketing') {
            return 'education-marketing';
        }
        if ($course_id === 'marketing-service') {
            return 'marketing-service';
        }
        if ($course_id !== 'seo-geo-master') {
            return $course_id !== '' ? $course_id : 'marketing-service';
        }
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) ($enrollment['mb_id'] ?? ''));
        $bo = preg_replace('/[^a-z0-9_]/i', '', (string) ($enrollment['contract_bo_table'] ?? ''));
        $wr_id = (int) ($enrollment['contract_wr_id'] ?? 0);
        if ($mb_id === '' || $bo === '' || $wr_id < 1 || !function_exists('onoff_education_enrollment_table')) {
            return 'marketing-service';
        }
        onoff_education_ensure_table();
        $etable = onoff_education_enrollment_table();
        $statuses = array('pending_contract', 'active', 'pending_deposit');
        $status_in = array();
        foreach ($statuses as $st) {
            $status_in[] = "'" . sql_real_escape_string($st) . "'";
        }
        $in_status = implode(',', $status_in);
        $mkt = sql_fetch(" select en_id from {$etable}
            where mb_id = '" . sql_real_escape_string($mb_id) . "'
              and contract_bo_table = '" . sql_real_escape_string($bo) . "'
              and contract_wr_id = '" . (int) $wr_id . "'
              and course_id = 'marketing-service'
              and status in ({$in_status})
            limit 1 ");
        if (!empty($mkt['en_id'])) {
            return 'education-marketing';
        }
        return 'marketing-service';
    }
}

if (!function_exists('onoff_service_contract_find_marketing_enrollment')) {
    function onoff_service_contract_find_marketing_enrollment($mb_id)
    {
        onoff_service_contract_bootstrap();
        if (!function_exists('onoff_education_enrollment_table')) {
            return null;
        }
        onoff_education_ensure_table();
        $etable = onoff_education_enrollment_table();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        if ($mb_id === '') {
            return null;
        }
        $statuses = onoff_service_contract_applicable_enrollment_statuses();
        $status_in = array();
        foreach ($statuses as $st) {
            $status_in[] = "'" . sql_real_escape_string($st) . "'";
        }
        $status_sql = implode(',', $status_in);

        $order_cases = array(
            array('marketing-service', 'pending_contract'),
            array('education-marketing', 'pending_contract'),
            array('marketing-service', 'pending_deposit'),
            array('education-marketing', 'pending_deposit'),
            array('marketing-service', 'active'),
            array('education-marketing', 'active'),
            array('marketing-service', 'expired'),
            array('education-marketing', 'expired'),
        );
        foreach ($order_cases as $case) {
            $cid = $case[0];
            $st = $case[1];
            $row = sql_fetch(" select * from {$etable}
                where mb_id = '" . sql_real_escape_string($mb_id) . "'
                  and course_id = '" . sql_real_escape_string($cid) . "'
                  and status = '" . sql_real_escape_string($st) . "'
                order by en_id desc
                limit 1 ");
            if ($row) {
                return $row;
            }
        }
        return null;
    }
}

if (!function_exists('onoff_service_contract_get_for_member')) {
    function onoff_service_contract_get_for_member($mb_id)
    {
        onoff_service_contract_bootstrap();
        $enrollment = onoff_service_contract_find_marketing_enrollment($mb_id);
        if ($enrollment) {
            $package_course = onoff_service_contract_resolve_package_course($enrollment);
            $version = onoff_service_contract_version_for_course($package_course);
            $row = onoff_service_contract_get((int) $enrollment['en_id'], $version);
            if ($row) {
                return $row;
            }
        }
        return onoff_service_contract_get_latest_for_member($mb_id);
    }
}

if (!function_exists('onoff_service_contract_generate_code')) {
    function onoff_service_contract_generate_code($en_id)
    {
        $en_id = (int) $en_id;
        $suffix = strtoupper(substr(md5($en_id . microtime(true) . mt_rand()), 0, 8));
        return 'SVC-' . date('Ymd') . '-' . $en_id . '-' . $suffix;
    }
}

if (!function_exists('onoff_service_contract_create_pending')) {
    function onoff_service_contract_create_pending($mb_id, $en_id, $course_id, $bo_table = '', $wr_id = 0)
    {
        onoff_service_contract_bootstrap();
        onoff_service_contract_ensure_tables();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $en_id = (int) $en_id;
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if ($mb_id === '' || $en_id < 1 || !onoff_service_contract_applies_course($course_id)) {
            return 0;
        }
        $package_course = $course_id;
        if (function_exists('onoff_education_get_enrollment')) {
            $enrollment = onoff_education_get_enrollment($en_id);
            if ($enrollment) {
                $package_course = onoff_service_contract_resolve_package_course($enrollment);
            }
        }
        $version = onoff_service_contract_version_for_course($package_course);
        $existing = onoff_service_contract_get($en_id, $version);
        if ($existing) {
            return (int) $existing['sc_id'];
        }
        $bo_table = preg_replace('/[^a-z0-9_]/i', '', (string) $bo_table);
        $wr_id = (int) $wr_id;
        $table = onoff_service_contract_table();
        $code = onoff_service_contract_generate_code($en_id);
        $now = onoff_service_contract_now();
        $sql = " insert into {$table} set
            sc_mb_id = '" . sql_real_escape_string($mb_id) . "',
            sc_en_id = '{$en_id}',
            sc_course_id = '" . sql_real_escape_string($package_course) . "',
            sc_inquiry_bo_table = '" . sql_real_escape_string($bo_table) . "',
            sc_inquiry_wr_id = '" . (int) $wr_id . "',
            sc_contract_version = '" . sql_real_escape_string($version) . "',
            sc_contract_code = '" . sql_real_escape_string($code) . "',
            sc_status = '" . sql_real_escape_string(ONOFF_SC_STATUS_PENDING) . "',
            sc_created_at = '" . sql_real_escape_string($now) . "',
            sc_updated_at = '" . sql_real_escape_string($now) . "' ";
        sql_query($sql, false);
        return (int) sql_insert_id();
    }
}

if (!function_exists('onoff_service_contract_create_pending_from_enrollment')) {
    function onoff_service_contract_create_pending_from_enrollment($enrollment_row)
    {
        onoff_service_contract_bootstrap();
        if (!$enrollment_row || !is_array($enrollment_row)) {
            return 0;
        }
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($enrollment_row['course_id'] ?? ''));
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) ($enrollment_row['mb_id'] ?? ''));
        $en_id = (int) ($enrollment_row['en_id'] ?? 0);
        $bo = preg_replace('/[^a-z0-9_]/i', '', (string) ($enrollment_row['contract_bo_table'] ?? ''));
        $wr_id = (int) ($enrollment_row['contract_wr_id'] ?? 0);

        if ($course_id === 'seo-geo-master') {
            if ($mb_id === '' || !function_exists('onoff_education_enrollment_table')) {
                return 0;
            }
            onoff_education_ensure_table();
            $etable = onoff_education_enrollment_table();
            $mkt = null;
            if ($bo !== '' && $wr_id > 0) {
                $mkt = sql_fetch(" select * from {$etable}
                    where mb_id = '" . sql_real_escape_string($mb_id) . "'
                      and contract_bo_table = '" . sql_real_escape_string($bo) . "'
                      and contract_wr_id = '" . (int) $wr_id . "'
                      and course_id = 'marketing-service'
                    order by en_id desc
                    limit 1 ");
            }
            if (!$mkt) {
                $mkt = sql_fetch(" select * from {$etable}
                    where mb_id = '" . sql_real_escape_string($mb_id) . "'
                      and course_id = 'marketing-service'
                    order by en_id desc
                    limit 1 ");
            }
            if (!$mkt || empty($mkt['en_id'])) {
                return 0;
            }
            $package_course = onoff_service_contract_resolve_package_course($mkt);
            if (!onoff_service_contract_applies_course($package_course)) {
                return 0;
            }
            return onoff_service_contract_create_pending(
                (string) $mkt['mb_id'],
                (int) $mkt['en_id'],
                $package_course,
                (string) ($mkt['contract_bo_table'] ?? $bo),
                (int) ($mkt['contract_wr_id'] ?? $wr_id)
            );
        }

        if ($course_id === 'marketing-service') {
            return onoff_service_contract_create_pending($mb_id, $en_id, 'marketing-service', $bo, $wr_id);
        }
        if ($course_id === 'education-marketing') {
            if ($bo !== '' && $wr_id > 0 && function_exists('onoff_education_enrollment_table')) {
                onoff_education_ensure_table();
                $etable = onoff_education_enrollment_table();
                $mkt = sql_fetch(" select * from {$etable}
                    where mb_id = '" . sql_real_escape_string($mb_id) . "'
                      and contract_bo_table = '" . sql_real_escape_string($bo) . "'
                      and contract_wr_id = '" . (int) $wr_id . "'
                      and course_id = 'marketing-service'
                    order by en_id desc
                    limit 1 ");
                if ($mkt && !empty($mkt['en_id'])) {
                    return onoff_service_contract_create_pending(
                        $mb_id,
                        (int) $mkt['en_id'],
                        'education-marketing',
                        $bo,
                        $wr_id
                    );
                }
            }
            return onoff_service_contract_create_pending($mb_id, $en_id, 'education-marketing', $bo, $wr_id);
        }

        if (!onoff_service_contract_applies_course($course_id)) {
            return 0;
        }
        return onoff_service_contract_create_pending($mb_id, $en_id, $course_id, $bo, $wr_id);
    }
}

if (!function_exists('onoff_service_contract_can_write')) {
    function onoff_service_contract_can_write($row_or_sc_id)
    {
        $row = is_array($row_or_sc_id) ? $row_or_sc_id : onoff_service_contract_get_by_id($row_or_sc_id);
        if (!$row) {
            return false;
        }
        $status = (string) ($row['sc_status'] ?? '');
        return in_array($status, array(ONOFF_SC_STATUS_PENDING, ONOFF_SC_STATUS_IN_PROGRESS, ONOFF_SC_STATUS_REJECTED), true);
    }
}

if (!function_exists('onoff_service_contract_form_from_row')) {
    function onoff_service_contract_form_from_row($row)
    {
        if (!$row || !is_array($row)) {
            return array();
        }
        $agreements = onoff_service_contract_decode_json($row['sc_agreement_snapshot'] ?? '');
        return array(
            'companyName' => (string) ($row['sc_company_name'] ?? ''),
            'representativeName' => (string) ($row['sc_representative_name'] ?? ''),
            'businessNumber' => (string) ($row['sc_business_number'] ?? ''),
            'companyAddress' => (string) ($row['sc_company_address'] ?? ''),
            'companyPhone' => (string) ($row['sc_company_phone'] ?? ''),
            'signerName' => (string) ($row['sc_signer_name'] ?? ''),
            'signerPosition' => (string) ($row['sc_signer_position'] ?? ''),
            'signerPhone' => (string) ($row['sc_signer_phone'] ?? ''),
            'signerEmail' => (string) ($row['sc_signer_email'] ?? ''),
            'serviceScope' => (string) ($row['sc_service_scope'] ?? ''),
            'amount' => (string) ($row['sc_amount'] ?? ''),
            'startDate' => (string) ($row['sc_start_date'] ?? ''),
            'endDate' => (string) ($row['sc_end_date'] ?? ''),
            'negotiatedTerms' => (string) ($row['sc_negotiated_terms'] ?? ''),
            'specialClauses' => (string) ($row['sc_special_clauses'] ?? ''),
            'agreements' => array(
                'readAll' => !empty($agreements['readAll']),
                'personalUse' => !empty($agreements['personalUse']),
                'noRedistribute' => !empty($agreements['noRedistribute']),
                'electronic' => !empty($agreements['electronic']),
            ),
            'step' => isset($agreements['step']) ? (int) $agreements['step'] : 0,
        );
    }
}

if (!function_exists('onoff_service_contract_save_draft')) {
    function onoff_service_contract_save_draft($mb_id, array $form)
    {
        onoff_service_contract_ensure_tables();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        if ($mb_id === '') {
            return array('ok' => false, 'message' => '회원 정보가 없습니다.');
        }
        $row = onoff_service_contract_get_for_member($mb_id);
        if (!$row || (string) ($row['sc_mb_id'] ?? '') !== $mb_id) {
            return array('ok' => false, 'message' => '작성 가능한 서비스 계약이 없습니다.');
        }
        if (!onoff_service_contract_can_write($row)) {
            return array('ok' => false, 'message' => '현재 상태에서는 수정할 수 없습니다.');
        }

        $agreements = isset($form['agreements']) && is_array($form['agreements']) ? $form['agreements'] : array();
        $agreement_snapshot = array(
            'readAll' => !empty($agreements['readAll']),
            'personalUse' => !empty($agreements['personalUse']),
            'noRedistribute' => !empty($agreements['noRedistribute']),
            'electronic' => !empty($agreements['electronic']),
            'step' => isset($form['step']) ? (int) $form['step'] : 0,
        );
        $company_snapshot = array(
            'companyName' => onoff_service_contract_sanitize_text($form['companyName'] ?? '', 200),
            'representativeName' => onoff_service_contract_sanitize_text($form['representativeName'] ?? '', 100),
            'businessNumber' => onoff_service_contract_sanitize_text($form['businessNumber'] ?? '', 20),
            'companyAddress' => onoff_service_contract_sanitize_text($form['companyAddress'] ?? '', 500),
            'companyPhone' => onoff_service_contract_sanitize_text($form['companyPhone'] ?? '', 30),
        );

        $new_status = (string) ($row['sc_status'] ?? ONOFF_SC_STATUS_PENDING);
        if ($new_status === ONOFF_SC_STATUS_PENDING || $new_status === ONOFF_SC_STATUS_REJECTED) {
            $new_status = ONOFF_SC_STATUS_IN_PROGRESS;
        }

        $sc_id = (int) $row['sc_id'];
        $table = onoff_service_contract_table();
        $now = onoff_service_contract_now();
        $sql = " update {$table} set
            sc_status = '" . sql_real_escape_string($new_status) . "',
            sc_company_name = '" . sql_real_escape_string($company_snapshot['companyName']) . "',
            sc_representative_name = '" . sql_real_escape_string($company_snapshot['representativeName']) . "',
            sc_business_number = '" . sql_real_escape_string($company_snapshot['businessNumber']) . "',
            sc_company_address = '" . sql_real_escape_string($company_snapshot['companyAddress']) . "',
            sc_company_phone = '" . sql_real_escape_string($company_snapshot['companyPhone']) . "',
            sc_signer_name = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['signerName'] ?? '', 100)) . "',
            sc_signer_position = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['signerPosition'] ?? '', 100)) . "',
            sc_signer_phone = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['signerPhone'] ?? '', 30)) . "',
            sc_signer_email = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['signerEmail'] ?? '', 200)) . "',
            sc_service_scope = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['serviceScope'] ?? '', 5000)) . "',
            sc_amount = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['amount'] ?? '', 100)) . "',
            sc_start_date = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['startDate'] ?? '', 30)) . "',
            sc_end_date = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['endDate'] ?? '', 30)) . "',
            sc_negotiated_terms = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['negotiatedTerms'] ?? '', 5000)) . "',
            sc_special_clauses = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($form['specialClauses'] ?? '', 5000)) . "',
            sc_company_snapshot = '" . sql_real_escape_string(json_encode($company_snapshot, JSON_UNESCAPED_UNICODE)) . "',
            sc_agreement_snapshot = '" . sql_real_escape_string(json_encode($agreement_snapshot, JSON_UNESCAPED_UNICODE)) . "',
            sc_updated_at = '" . sql_real_escape_string($now) . "'
          where sc_id = '{$sc_id}'
            and sc_mb_id = '" . sql_real_escape_string($mb_id) . "' ";
        if (!sql_query($sql, false)) {
            return array('ok' => false, 'message' => '임시 저장에 실패했습니다.');
        }
        return array('ok' => true, 'message' => '저장되었습니다.', 'contract' => onoff_service_contract_get_by_id($sc_id));
    }
}

if (!function_exists('onoff_service_contract_save_signature')) {
    function onoff_service_contract_save_signature($mb_id, $data_url)
    {
        onoff_service_contract_bootstrap();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $row = onoff_service_contract_get_for_member($mb_id);
        if (!$row || (string) ($row['sc_mb_id'] ?? '') !== $mb_id) {
            return array('ok' => false, 'message' => '서비스 계약을 찾을 수 없습니다.', 'path' => '');
        }
        if (!onoff_service_contract_can_write($row)) {
            return array('ok' => false, 'message' => '현재 상태에서는 서명을 저장할 수 없습니다.', 'path' => '');
        }
        $en_id = (int) ($row['sc_en_id'] ?? 0);
        if ($en_id > 0 && function_exists('onoff_education_save_contract_signature_png')) {
            $saved = onoff_education_save_contract_signature_png($en_id, $data_url);
        } else {
            $saved = onoff_service_contract_save_signature_png_local($mb_id, $data_url);
        }
        if (empty($saved['ok'])) {
            return $saved;
        }
        $table = onoff_service_contract_table();
        $sc_id = (int) $row['sc_id'];
        $now = onoff_service_contract_now();
        $sql = " update {$table} set
            sc_signature_file_path = '" . sql_real_escape_string((string) $saved['path']) . "',
            sc_updated_at = '" . sql_real_escape_string($now) . "'
          where sc_id = '{$sc_id}' ";
        sql_query($sql, false);
        return $saved;
    }
}

if (!function_exists('onoff_service_contract_render_html')) {
    function onoff_service_contract_render_html($course_id, array $party_a, array $extras = array())
    {
        onoff_service_contract_bootstrap();
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        $contract_type = $course_id;
        if ($course_id === 'education-marketing') {
            $contract_type = 'education-marketing';
        } elseif ($course_id === 'marketing-service' || $course_id === 'marketing') {
            $contract_type = 'marketing-service';
        }

        $body = '';
        $subject = '서비스 표준계약서';
        if (function_exists('onoff_edu_contract_public')) {
            $pub = onoff_edu_contract_public($contract_type);
            if (is_array($pub)) {
                $body = (string) ($pub['html'] ?? '');
                $subject = (string) ($pub['subject'] ?? $subject);
            }
        }
        if ($body === '' && function_exists('onoff_marketing_contract_default_html')) {
            if ($contract_type === 'education-marketing' && function_exists('onoff_edu_marketing_contract_default_html')) {
                $body = onoff_edu_marketing_contract_default_html();
            } else {
                $body = onoff_marketing_contract_default_html();
            }
        }

        $party_b = onoff_service_contract_party_b();
        $amount = onoff_service_contract_sanitize_text($extras['amount'] ?? ($party_a['amount'] ?? ''), 100);
        $start = onoff_service_contract_sanitize_text($extras['startDate'] ?? ($party_a['startDate'] ?? ''), 30);
        $end = onoff_service_contract_sanitize_text($extras['endDate'] ?? ($party_a['endDate'] ?? ''), 30);
        $scope = (string) ($extras['serviceScope'] ?? ($party_a['serviceScope'] ?? ''));
        $negotiated = (string) ($extras['negotiatedTerms'] ?? ($party_a['negotiatedTerms'] ?? ''));
        $special = (string) ($extras['specialClauses'] ?? ($party_a['specialClauses'] ?? ''));

        $html = '<div class="onoff-service-contract">';
        $html .= '<h1>' . htmlspecialchars($subject, ENT_QUOTES, 'UTF-8') . '</h1>';
        $html .= '<table border="1" cellpadding="6" cellspacing="0" width="100%">';
        $html .= '<tr><th width="50%">갑 (고객)</th><th width="50%">을 (회사)</th></tr>';
        $html .= '<tr><td valign="top">';
        $html .= '<p><strong>상호</strong>: ' . htmlspecialchars((string) ($party_a['companyName'] ?? ''), ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>대표</strong>: ' . htmlspecialchars((string) ($party_a['representativeName'] ?? ''), ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>사업자번호</strong>: ' . htmlspecialchars((string) ($party_a['businessNumber'] ?? ''), ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>주소</strong>: ' . htmlspecialchars((string) ($party_a['companyAddress'] ?? ''), ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>연락처</strong>: ' . htmlspecialchars((string) ($party_a['companyPhone'] ?? ''), ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '</td><td valign="top">';
        $html .= '<p><strong>상호</strong>: ' . htmlspecialchars((string) $party_b['company_name'], ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>대표</strong>: ' . htmlspecialchars((string) $party_b['representative_name'], ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>사업자번호</strong>: ' . htmlspecialchars((string) $party_b['business_number'], ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>주소</strong>: ' . htmlspecialchars((string) $party_b['company_address'], ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '<p><strong>연락처</strong>: ' . htmlspecialchars((string) $party_b['company_phone'], ENT_QUOTES, 'UTF-8') . '</p>';
        $html .= '</td></tr></table>';

        if ($amount !== '' || $start !== '' || $end !== '') {
            $html .= '<h2>계약 요약</h2><ul>';
            if ($amount !== '') {
                $html .= '<li><strong>금액</strong>: ' . htmlspecialchars($amount, ENT_QUOTES, 'UTF-8') . '</li>';
            }
            if ($start !== '' || $end !== '') {
                $html .= '<li><strong>기간</strong>: ' . htmlspecialchars(trim($start . ' ~ ' . $end), ENT_QUOTES, 'UTF-8') . '</li>';
            }
            $html .= '</ul>';
        }
        if (trim($scope) !== '') {
            $html .= '<h2>서비스 범위</h2><div>' . nl2br(htmlspecialchars($scope, ENT_QUOTES, 'UTF-8')) . '</div>';
        }
        $html .= '<div class="contract-body">' . $body . '</div>';
        if (trim($negotiated) !== '') {
            $html .= '<h2>협의 조건</h2><div>' . nl2br(htmlspecialchars($negotiated, ENT_QUOTES, 'UTF-8')) . '</div>';
        }
        if (trim($special) !== '') {
            $html .= '<h2>특약</h2><div>' . nl2br(htmlspecialchars($special, ENT_QUOTES, 'UTF-8')) . '</div>';
        }

        $addenda = isset($extras['addenda']) && is_array($extras['addenda']) ? $extras['addenda'] : array();
        if ($addenda) {
            $html .= '<h2>부속 합의 (특약사항)</h2><ol>';
            foreach ($addenda as $item) {
                if (!is_array($item)) {
                    continue;
                }
                if ((string) ($item['status'] ?? 'active') !== 'active') {
                    continue;
                }
                $title = (string) ($item['title'] ?? '특약사항');
                $body_text = (string) ($item['body'] ?? '');
                $html .= '<li><strong>' . htmlspecialchars($title, ENT_QUOTES, 'UTF-8') . '</strong>';
                if ($body_text !== '') {
                    $html .= '<div>' . nl2br(htmlspecialchars($body_text, ENT_QUOTES, 'UTF-8')) . '</div>';
                }
                $html .= '</li>';
            }
            $html .= '</ol>';
        }
        $html .= '</div>';
        return $html;
    }
}

if (!function_exists('onoff_service_contract_generate_pdf')) {
    /**
     * @return array{ok:bool,message:string,path:string,hash:string}
     */
    function onoff_service_contract_generate_pdf(array $data)
    {
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) ($data['mb_id'] ?? ''));
        $version = onoff_service_contract_sanitize_text($data['version'] ?? '', 50);
        $code = onoff_service_contract_sanitize_text($data['contract_code'] ?? 'CONTRACT', 50);
        $html = (string) ($data['html'] ?? '');
        if ($mb_id === '' || $version === '' || trim($html) === '') {
            return array('ok' => false, 'message' => 'PDF 생성 정보가 부족합니다.', 'path' => '', 'hash' => '');
        }

        $tcpdf = G5_PATH . '/plugin/seo-system-300/lib/vendor/tcpdf/tcpdf.php';
        if (!is_file($tcpdf)) {
            return array('ok' => false, 'message' => 'PDF 라이브러리를 찾을 수 없습니다.', 'path' => '', 'hash' => '');
        }
        require_once $tcpdf;

        $dir = onoff_service_contract_data_base_dir() . '/' . $mb_id . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $version);
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        if (!is_dir($dir) || !is_writable($dir)) {
            return array('ok' => false, 'message' => 'PDF 저장 경로를 사용할 수 없습니다.', 'path' => '', 'hash' => '');
        }

        $filename = 'SVC_CONTRACT_' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $code) . '.pdf';
        $abs = $dir . '/' . $filename;
        $rel = 'onoff_service_contracts/' . $mb_id . '/' . preg_replace('/[^a-zA-Z0-9_\-]/', '_', $version) . '/' . $filename;

        try {
            $pdf = new TCPDF('P', 'mm', 'A4', true, 'UTF-8', false);
            $pdf->SetCreator('ONOFF');
            $pdf->SetAuthor('ONOFF Marketing');
            $pdf->setPrintHeader(false);
            $pdf->setPrintFooter(false);
            $pdf->SetMargins(15, 15, 15);
            $pdf->SetAutoPageBreak(true, 15);
            $pdf->AddPage();
            $pdf->SetFont('cid0kr', '', 10);
            $pdf->writeHTML($html, true, false, true, false, '');

            $sig_rel = trim((string) ($data['signature_path'] ?? ''));
            $sig_abs = onoff_service_contract_abs_from_data_path($sig_rel);
            if ($sig_abs !== '' && is_file($sig_abs)) {
                $pdf->Ln(4);
                $pdf->SetFont('cid0kr', '', 9);
                $pdf->Cell(0, 6, '갑(고객) 전자서명', 0, 1);
                $pdf->Image($sig_abs, 15, $pdf->GetY(), 40, 0, 'PNG');
            }

            $pdf->Output($abs, 'F');
        } catch (Exception $e) {
            return array('ok' => false, 'message' => 'PDF 생성 중 오류가 발생했습니다.', 'path' => '', 'hash' => '');
        }

        if (!is_file($abs)) {
            return array('ok' => false, 'message' => 'PDF 파일이 생성되지 않았습니다.', 'path' => '', 'hash' => '');
        }
        $hash = hash_file('sha256', $abs);
        return array('ok' => true, 'message' => 'PDF가 생성되었습니다.', 'path' => $rel, 'hash' => $hash);
    }
}

if (!function_exists('onoff_service_contract_sign')) {
    /**
     * @return array{ok:bool,message:string,contract:?array}
     */
    function onoff_service_contract_sign($mb_id, array $form, $signature_data_url = '')
    {
        onoff_service_contract_bootstrap();
        onoff_service_contract_ensure_tables();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $row = onoff_service_contract_get_for_member($mb_id);
        if (!$row || (string) ($row['sc_mb_id'] ?? '') !== $mb_id) {
            return array('ok' => false, 'message' => '서비스 계약을 찾을 수 없습니다.', 'contract' => null);
        }
        if (!onoff_service_contract_can_write($row)) {
            return array('ok' => false, 'message' => '현재 상태에서는 서명할 수 없습니다.', 'contract' => null);
        }

        $draft = onoff_service_contract_save_draft($mb_id, $form);
        if (empty($draft['ok'])) {
            return array('ok' => false, 'message' => (string) ($draft['message'] ?? '저장 실패'), 'contract' => null);
        }
        $row = onoff_service_contract_get_by_id((int) $row['sc_id']);
        if (!$row) {
            return array('ok' => false, 'message' => '계약 정보를 다시 불러올 수 없습니다.', 'contract' => null);
        }

        $agreements = isset($form['agreements']) && is_array($form['agreements']) ? $form['agreements'] : array();
        foreach (array('readAll', 'personalUse', 'noRedistribute', 'electronic') as $key) {
            if (empty($agreements[$key])) {
                return array('ok' => false, 'message' => '필수 약관에 모두 동의해 주세요.', 'contract' => null);
            }
        }
        $signer = onoff_service_contract_sanitize_text($form['signerName'] ?? ($row['sc_signer_name'] ?? ''), 100);
        $signer_phone = onoff_service_contract_sanitize_text($form['signerPhone'] ?? ($row['sc_signer_phone'] ?? ''), 30);
        if ($signer === '' || $signer_phone === '') {
            return array('ok' => false, 'message' => '서명자 이름과 연락처를 입력해 주세요.', 'contract' => null);
        }

        if (trim((string) $signature_data_url) !== '') {
            $sig = onoff_service_contract_save_signature($mb_id, $signature_data_url);
            if (empty($sig['ok'])) {
                return array('ok' => false, 'message' => (string) ($sig['message'] ?? '서명 저장 실패'), 'contract' => null);
            }
            $row = onoff_service_contract_get_by_id((int) $row['sc_id']);
        }
        if (trim((string) ($row['sc_signature_file_path'] ?? '')) === '') {
            return array('ok' => false, 'message' => '전자서명을 입력해 주세요.', 'contract' => null);
        }

        $course_id = (string) ($row['sc_course_id'] ?? 'marketing-service');
        $party_a = onoff_service_contract_form_from_row($row);
        $addenda = onoff_service_contract_addendum_list((int) $row['sc_id'], false);
        $html = onoff_service_contract_render_html($course_id, $party_a, array(
            'amount' => $party_a['amount'] ?? '',
            'startDate' => $party_a['startDate'] ?? '',
            'endDate' => $party_a['endDate'] ?? '',
            'serviceScope' => $party_a['serviceScope'] ?? '',
            'negotiatedTerms' => $party_a['negotiatedTerms'] ?? '',
            'specialClauses' => $party_a['specialClauses'] ?? '',
            'addenda' => $addenda,
        ));

        $now = onoff_service_contract_now();
        $ip = onoff_service_contract_client_ip();
        $ua = onoff_service_contract_user_agent();
        $package = function_exists('onoff_education_contract_package_for_course')
            ? onoff_education_contract_package_for_course($course_id)
            : array('version' => onoff_service_contract_version_for_course($course_id));

        $contract_snapshot = array(
            'version' => (string) ($row['sc_contract_version'] ?? ''),
            'package' => $package,
            'partyA' => $party_a,
            'partyB' => onoff_service_contract_party_b(),
            'html' => $html,
            'signedAt' => $now,
            'signedIp' => $ip,
        );

        $pdf = onoff_service_contract_generate_pdf(array(
            'mb_id' => $mb_id,
            'version' => (string) ($row['sc_contract_version'] ?? ''),
            'contract_code' => (string) ($row['sc_contract_code'] ?? ''),
            'html' => $html,
            'signature_path' => (string) ($row['sc_signature_file_path'] ?? ''),
        ));
        if (empty($pdf['ok'])) {
            return array('ok' => false, 'message' => (string) ($pdf['message'] ?? 'PDF 생성 실패'), 'contract' => null);
        }

        $sc_id = (int) $row['sc_id'];
        $old_status = (string) ($row['sc_status'] ?? ONOFF_SC_STATUS_PENDING);
        $table = onoff_service_contract_table();
        $sql = " update {$table} set
            sc_status = '" . sql_real_escape_string(ONOFF_SC_STATUS_REVIEW_PENDING) . "',
            sc_signed_at = '" . sql_real_escape_string($now) . "',
            sc_signed_ip = '" . sql_real_escape_string($ip) . "',
            sc_user_agent = '" . sql_real_escape_string($ua) . "',
            sc_contract_pdf_path = '" . sql_real_escape_string((string) $pdf['path']) . "',
            sc_contract_file_hash = '" . sql_real_escape_string((string) $pdf['hash']) . "',
            sc_contract_snapshot = '" . sql_real_escape_string(json_encode($contract_snapshot, JSON_UNESCAPED_UNICODE)) . "',
            sc_reject_reason = '',
            sc_updated_at = '" . sql_real_escape_string($now) . "'
          where sc_id = '{$sc_id}' ";
        if (!sql_query($sql, false)) {
            return array('ok' => false, 'message' => '계약 제출 저장에 실패했습니다.', 'contract' => null);
        }

        onoff_service_contract_log_status($sc_id, $mb_id, $old_status, ONOFF_SC_STATUS_REVIEW_PENDING, 'merchant submit', $mb_id, 'merchant');

        $log_table = onoff_service_contract_log_table();
        $log_sql = " insert into {$log_table} set
            sc_id = '{$sc_id}',
            sc_mb_id = '" . sql_real_escape_string($mb_id) . "',
            scl_contract_code = '" . sql_real_escape_string((string) ($row['sc_contract_code'] ?? '')) . "',
            scl_contract_version = '" . sql_real_escape_string((string) ($row['sc_contract_version'] ?? '')) . "',
            scl_signed_at = '" . sql_real_escape_string($now) . "',
            scl_ip = '" . sql_real_escape_string($ip) . "',
            scl_user_agent = '" . sql_real_escape_string($ua) . "',
            scl_pdf_path = '" . sql_real_escape_string((string) $pdf['path']) . "',
            scl_pdf_hash = '" . sql_real_escape_string((string) $pdf['hash']) . "',
            scl_result = 'success',
            scl_message = 'review_pending' ";
        sql_query($log_sql, false);

        return array(
            'ok' => true,
            'message' => '계약서가 제출되었습니다. 관리자 승인 후 체결됩니다.',
            'contract' => onoff_service_contract_get_by_id($sc_id),
        );
    }
}

if (!function_exists('onoff_service_contract_member_has_marketing_enrollment')) {
    function onoff_service_contract_member_has_marketing_enrollment($mb_id)
    {
        onoff_service_contract_bootstrap();
        if (!function_exists('onoff_education_enrollment_table')) {
            return false;
        }
        onoff_education_ensure_table();
        $etable = onoff_education_enrollment_table();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        if ($mb_id === '') {
            return false;
        }
        $status_in = array();
        foreach (onoff_service_contract_applicable_enrollment_statuses() as $st) {
            $status_in[] = "'" . sql_real_escape_string($st) . "'";
        }
        $courses = onoff_service_contract_marketing_course_ids();
        $course_in = array();
        foreach ($courses as $cid) {
            $course_in[] = "'" . sql_real_escape_string($cid) . "'";
        }
        $row = sql_fetch(" select en_id from {$etable}
            where mb_id = '" . sql_real_escape_string($mb_id) . "'
              and course_id in (" . implode(',', $course_in) . ")
              and status in (" . implode(',', $status_in) . ")
            limit 1 ");
        return !empty($row['en_id']);
    }
}

if (!function_exists('onoff_service_contract_is_fully_signed')) {
    function onoff_service_contract_is_fully_signed($mb_id)
    {
        $row = onoff_service_contract_get_for_member($mb_id);
        if (!$row) {
            return false;
        }
        $version = onoff_service_contract_version_for_course((string) ($row['sc_course_id'] ?? ''));
        if ((string) ($row['sc_contract_version'] ?? '') !== $version) {
            return false;
        }
        if ((string) ($row['sc_status'] ?? '') !== ONOFF_SC_STATUS_SIGNED) {
            return false;
        }
        if (trim((string) ($row['sc_signed_at'] ?? '')) === '') {
            return false;
        }
        if (trim((string) ($row['sc_contract_pdf_path'] ?? '')) === '') {
            return false;
        }
        return true;
    }
}

if (!function_exists('onoff_service_contract_status')) {
    function onoff_service_contract_status($mb_id)
    {
        $row = onoff_service_contract_get_for_member($mb_id);
        if (!$row) {
            return '';
        }
        return (string) ($row['sc_status'] ?? '');
    }
}

if (!function_exists('onoff_service_contract_has_signed_history')) {
    function onoff_service_contract_has_signed_history($mb_id)
    {
        onoff_service_contract_ensure_tables();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        if ($mb_id === '') {
            return false;
        }
        $table = onoff_service_contract_table();
        $row = sql_fetch(" select sc_id from {$table}
            where sc_mb_id = '" . sql_real_escape_string($mb_id) . "'
              and sc_status = '" . sql_real_escape_string(ONOFF_SC_STATUS_SIGNED) . "'
            limit 1 ");
        if (!empty($row['sc_id'])) {
            return true;
        }
        $log_table = onoff_service_contract_log_table();
        $log = sql_fetch(" select scl_id from {$log_table}
            where sc_mb_id = '" . sql_real_escape_string($mb_id) . "'
              and scl_result = 'success'
            limit 1 ");
        return !empty($log['scl_id']);
    }
}

if (!function_exists('onoff_service_contract_access')) {
    function onoff_service_contract_access($mb_id)
    {
        onoff_service_contract_bootstrap();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $grace_active = onoff_service_contract_grace_active();
        $has_contract_row = (bool) onoff_service_contract_get_latest_for_member($mb_id);
        $has_mkt_enrollment = onoff_service_contract_member_has_marketing_enrollment($mb_id);
        $applies = $has_mkt_enrollment || $has_contract_row;

        $default = array(
            'applies' => false,
            'signed' => true,
            'blocked' => false,
            'graceActive' => $grace_active,
            'requires' => false,
            'hasSignedHistory' => onoff_service_contract_has_signed_history($mb_id),
            'viewable' => false,
            'status' => '',
            'courseId' => '',
            'path' => '/seo-system-300/contract',
            'version' => '',
            'rejectionReason' => '',
        );

        if (!$applies) {
            return $default;
        }

        $row = onoff_service_contract_get_for_member($mb_id);
        $enrollment = onoff_service_contract_find_marketing_enrollment($mb_id);
        $course_id = $row ? (string) ($row['sc_course_id'] ?? '') : '';
        if ($course_id === '' && $enrollment) {
            $course_id = onoff_service_contract_resolve_package_course($enrollment);
        }
        if ($course_id === '') {
            $course_id = 'marketing-service';
        }
        $version = onoff_service_contract_version_for_course($course_id);
        $status = $row ? (string) ($row['sc_status'] ?? ONOFF_SC_STATUS_PENDING) : ONOFF_SC_STATUS_PENDING;
        $rejection = $row ? (string) ($row['sc_reject_reason'] ?? '') : '';

        $signed = onoff_service_contract_is_fully_signed($mb_id);
        if ($status === ONOFF_SC_STATUS_REVIEW_PENDING) {
            $signed = false;
        }

        $requires = !$signed;
        $blocked = $requires && !$grace_active;

        return array(
            'applies' => true,
            'signed' => $signed,
            'blocked' => $blocked,
            'graceActive' => $grace_active,
            'requires' => $requires,
            'hasSignedHistory' => onoff_service_contract_has_signed_history($mb_id),
            'viewable' => true,
            'status' => $status,
            'courseId' => $course_id,
            'path' => '/seo-system-300/contract',
            'version' => $version,
            'rejectionReason' => $rejection,
        );
    }
}

if (!function_exists('onoff_service_contract_to_api')) {
    function onoff_service_contract_to_api($row)
    {
        if (!$row || !is_array($row)) {
            return null;
        }
        return array(
            'id' => (int) ($row['sc_id'] ?? 0),
            'mbId' => (string) ($row['sc_mb_id'] ?? ''),
            'enrollmentId' => (int) ($row['sc_en_id'] ?? 0),
            'courseId' => (string) ($row['sc_course_id'] ?? ''),
            'inquiryBoTable' => (string) ($row['sc_inquiry_bo_table'] ?? ''),
            'inquiryWrId' => (int) ($row['sc_inquiry_wr_id'] ?? 0),
            'version' => (string) ($row['sc_contract_version'] ?? ''),
            'code' => (string) ($row['sc_contract_code'] ?? ''),
            'status' => (string) ($row['sc_status'] ?? ''),
            'statusLabel' => onoff_service_contract_status_label((string) ($row['sc_status'] ?? '')),
            'companyName' => (string) ($row['sc_company_name'] ?? ''),
            'representativeName' => (string) ($row['sc_representative_name'] ?? ''),
            'businessNumber' => (string) ($row['sc_business_number'] ?? ''),
            'companyAddress' => (string) ($row['sc_company_address'] ?? ''),
            'companyPhone' => (string) ($row['sc_company_phone'] ?? ''),
            'signerName' => (string) ($row['sc_signer_name'] ?? ''),
            'signerPosition' => (string) ($row['sc_signer_position'] ?? ''),
            'signerPhone' => (string) ($row['sc_signer_phone'] ?? ''),
            'signerEmail' => (string) ($row['sc_signer_email'] ?? ''),
            'serviceScope' => (string) ($row['sc_service_scope'] ?? ''),
            'amount' => (string) ($row['sc_amount'] ?? ''),
            'startDate' => (string) ($row['sc_start_date'] ?? ''),
            'endDate' => (string) ($row['sc_end_date'] ?? ''),
            'negotiatedTerms' => (string) ($row['sc_negotiated_terms'] ?? ''),
            'specialClauses' => (string) ($row['sc_special_clauses'] ?? ''),
            'signaturePath' => (string) ($row['sc_signature_file_path'] ?? ''),
            'signedAt' => (string) ($row['sc_signed_at'] ?? ''),
            'pdfPath' => (string) ($row['sc_contract_pdf_path'] ?? ''),
            'pdfHash' => (string) ($row['sc_contract_file_hash'] ?? ''),
            'reviewedBy' => (string) ($row['sc_reviewed_by'] ?? ''),
            'reviewedAt' => (string) ($row['sc_reviewed_at'] ?? ''),
            'rejectReason' => (string) ($row['sc_reject_reason'] ?? ''),
            'createdAt' => (string) ($row['sc_created_at'] ?? ''),
            'updatedAt' => (string) ($row['sc_updated_at'] ?? ''),
        );
    }
}

if (!function_exists('onoff_service_contract_api_base')) {
    function onoff_service_contract_api_base()
    {
        return '/plugin/seo-system-300/api/contract';
    }
}

if (!function_exists('onoff_service_contract_view_to_api')) {
    function onoff_service_contract_view_to_api($mb_id)
    {
        onoff_service_contract_bootstrap();
        $access = onoff_service_contract_access($mb_id);
        $row = onoff_service_contract_get_for_member($mb_id);
        $course_id = (string) ($access['courseId'] ?? 'marketing-service');
        $package = function_exists('onoff_education_contract_package_for_course')
            ? onoff_education_contract_package_for_course($course_id)
            : array('id' => $course_id, 'version' => onoff_service_contract_version_for_course($course_id));

        $form = $row ? onoff_service_contract_form_from_row($row) : array();
        $party_a = $form;
        $addenda = $row ? onoff_service_contract_addendum_list((int) $row['sc_id'], false) : array();
        $contract_html = '';
        if ($row) {
            $contract_html = onoff_service_contract_render_html($course_id, $party_a, array(
                'amount' => $form['amount'] ?? '',
                'startDate' => $form['startDate'] ?? '',
                'endDate' => $form['endDate'] ?? '',
                'serviceScope' => $form['serviceScope'] ?? '',
                'negotiatedTerms' => $form['negotiatedTerms'] ?? '',
                'specialClauses' => $form['specialClauses'] ?? '',
                'addenda' => $addenda,
            ));
        }

        $sc_id = $row ? (int) $row['sc_id'] : 0;
        $api = onoff_service_contract_api_base();
        $status = (string) ($access['status'] ?? '');

        return array(
            'access' => $access,
            'canWrite' => $row ? onoff_service_contract_can_write($row) : false,
            'form' => $form,
            'contractHtml' => $contract_html,
            'partyB' => onoff_service_contract_party_b(),
            'package' => $package,
            'csrfToken' => '',
            'hasSignature' => $row ? trim((string) ($row['sc_signature_file_path'] ?? '')) !== '' : false,
            'isApprovalPending' => $status === ONOFF_SC_STATUS_REVIEW_PENDING,
            'isRejected' => $status === ONOFF_SC_STATUS_REJECTED,
            'rejectionReason' => (string) ($access['rejectionReason'] ?? ''),
            'urls' => array(
                'document' => $sc_id > 0 ? $api . '/document.php?sc_id=' . $sc_id : '',
                'download' => $sc_id > 0 ? $api . '/download.php?sc_id=' . $sc_id : '',
                'signature' => $api . '/signature.php',
            ),
            'contract' => onoff_service_contract_to_api($row),
        );
    }
}

if (!function_exists('onoff_service_contract_can_add_addendum')) {
    function onoff_service_contract_can_add_addendum($row, $by_type = 'admin')
    {
        if (!$row || !is_array($row)) {
            return false;
        }
        $status = (string) ($row['sc_status'] ?? '');
        $by_type = preg_replace('/[^a-z0-9_\-]/i', '', (string) $by_type);
        if ($by_type === 'merchant') {
            return $status === ONOFF_SC_STATUS_SIGNED;
        }
        if ($by_type === 'admin') {
            return in_array($status, array(ONOFF_SC_STATUS_SIGNED, ONOFF_SC_STATUS_REVIEW_PENDING), true);
        }
        return false;
    }
}

if (!function_exists('onoff_service_contract_read_view')) {
    function onoff_service_contract_read_view($mb_id, $version = '')
    {
        onoff_service_contract_ensure_tables();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        $row = onoff_service_contract_get_for_member($mb_id);
        if ($version !== '' && $row) {
            $specific = onoff_service_contract_get((int) $row['sc_en_id'], $version);
            if ($specific) {
                $row = $specific;
            }
        }

        $history = array();
        if ($mb_id !== '') {
            $table = onoff_service_contract_table();
            $result = sql_query(" select * from {$table}
                where sc_mb_id = '" . sql_real_escape_string($mb_id) . "'
                  and sc_status in (
                    '" . sql_real_escape_string(ONOFF_SC_STATUS_SIGNED) . "',
                    '" . sql_real_escape_string(ONOFF_SC_STATUS_REVIEW_PENDING) . "'
                  )
                order by sc_id desc ");
            while ($h = sql_fetch_array($result)) {
                $history[] = onoff_service_contract_to_api($h);
            }
        }

        $addenda = $row ? onoff_service_contract_addendum_list((int) $row['sc_id'], true) : array();
        return array(
            'contract' => onoff_service_contract_to_api($row),
            'history' => $history,
            'addenda' => $addenda,
            'canAddAddendum' => $row ? onoff_service_contract_can_add_addendum($row, 'merchant') : false,
        );
    }
}

if (!function_exists('onoff_service_contract_addendum_list')) {
    function onoff_service_contract_addendum_list($sc_id, $include_voided = true)
    {
        onoff_service_contract_ensure_tables();
        $sc_id = (int) $sc_id;
        if ($sc_id < 1) {
            return array();
        }
        $table = onoff_service_contract_addendum_table();
        $void_sql = $include_voided ? '' : " and sca_status = 'active' ";
        $items = array();
        $result = sql_query(" select * from {$table}
            where sc_id = '{$sc_id}' {$void_sql}
            order by sca_seq asc, sca_id asc ");
        while ($row = sql_fetch_array($result)) {
            $items[] = array(
                'id' => (int) ($row['sca_id'] ?? 0),
                'scId' => (int) ($row['sc_id'] ?? 0),
                'mbId' => (string) ($row['sc_mb_id'] ?? ''),
                'seq' => (int) ($row['sca_seq'] ?? 0),
                'title' => (string) ($row['sca_title'] ?? ''),
                'body' => (string) ($row['sca_body'] ?? ''),
                'status' => (string) ($row['sca_status'] ?? ''),
                'createdByType' => (string) ($row['sca_created_by_type'] ?? ''),
                'createdBy' => (string) ($row['sca_created_by'] ?? ''),
                'voidedAt' => (string) ($row['sca_voided_at'] ?? ''),
                'voidReason' => (string) ($row['sca_void_reason'] ?? ''),
                'createdAt' => (string) ($row['sca_created_at'] ?? ''),
                'updatedAt' => (string) ($row['sca_updated_at'] ?? ''),
            );
        }
        return $items;
    }
}

if (!function_exists('onoff_service_contract_addendum_add')) {
    function onoff_service_contract_addendum_add($sc_id, $title, $body, $by_type, $by)
    {
        onoff_service_contract_ensure_tables();
        $row = onoff_service_contract_get_by_id($sc_id);
        if (!$row) {
            return array('ok' => false, 'message' => '계약을 찾을 수 없습니다.', 'id' => 0);
        }
        $by_type = preg_replace('/[^a-z0-9_\-]/i', '', (string) $by_type);
        if (!onoff_service_contract_can_add_addendum($row, $by_type)) {
            return array('ok' => false, 'message' => '특약을 추가할 수 없는 상태입니다.', 'id' => 0);
        }
        $table = onoff_service_contract_addendum_table();
        $sc_id = (int) $sc_id;
        $max = sql_fetch(" select max(sca_seq) as mx from {$table} where sc_id = '{$sc_id}' ");
        $seq = (int) ($max['mx'] ?? 0) + 1;
        $title = onoff_service_contract_sanitize_text($title, 200);
        if ($title === '') {
            $title = '특약사항';
        }
        $body = trim(strip_tags((string) $body));
        if ($body === '') {
            return array('ok' => false, 'message' => '특약 내용을 입력해 주세요.', 'id' => 0);
        }
        $now = onoff_service_contract_now();
        $sql = " insert into {$table} set
            sc_id = '{$sc_id}',
            sc_mb_id = '" . sql_real_escape_string((string) ($row['sc_mb_id'] ?? '')) . "',
            sca_seq = '{$seq}',
            sca_title = '" . sql_real_escape_string($title) . "',
            sca_body = '" . sql_real_escape_string($body) . "',
            sca_status = 'active',
            sca_created_by_type = '" . sql_real_escape_string($by_type) . "',
            sca_created_by = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($by, 100)) . "',
            sca_created_at = '" . sql_real_escape_string($now) . "',
            sca_updated_at = '" . sql_real_escape_string($now) . "' ";
        sql_query($sql, false);
        return array('ok' => true, 'message' => '특약이 추가되었습니다.', 'id' => (int) sql_insert_id());
    }
}

if (!function_exists('onoff_service_contract_addendum_void')) {
    function onoff_service_contract_addendum_void($sca_id, $reason, $by)
    {
        onoff_service_contract_ensure_tables();
        $table = onoff_service_contract_addendum_table();
        $sca_id = (int) $sca_id;
        if ($sca_id < 1) {
            return false;
        }
        $now = onoff_service_contract_now();
        $sql = " update {$table} set
            sca_status = 'voided',
            sca_voided_at = '" . sql_real_escape_string($now) . "',
            sca_void_reason = '" . sql_real_escape_string(onoff_service_contract_sanitize_text($reason, 500)) . "',
            sca_updated_at = '" . sql_real_escape_string($now) . "'
          where sca_id = '{$sca_id}' ";
        return (bool) sql_query($sql, false);
    }
}

if (!function_exists('onoff_service_contract_activate_enrollments_on_approve')) {
    function onoff_service_contract_activate_enrollments_on_approve(array $row)
    {
        onoff_service_contract_bootstrap();
        if (!function_exists('onoff_education_update_enrollment')) {
            return false;
        }
        $en_id = (int) ($row['sc_en_id'] ?? 0);
        if ($en_id > 0) {
            onoff_education_update_enrollment($en_id, array('status' => 'active'));
        }
        $bo = preg_replace('/[^a-z0-9_]/i', '', (string) ($row['sc_inquiry_bo_table'] ?? ''));
        $wr_id = (int) ($row['sc_inquiry_wr_id'] ?? 0);
        if ($bo === '' || $wr_id < 1 || !function_exists('onoff_education_enrollment_table')) {
            return true;
        }
        onoff_education_ensure_table();
        $etable = onoff_education_enrollment_table();
        $result = sql_query(" select en_id from {$etable}
            where contract_bo_table = '" . sql_real_escape_string($bo) . "'
              and contract_wr_id = '" . (int) $wr_id . "'
              and status = 'pending_contract' ");
        while ($sib = sql_fetch_array($result)) {
            onoff_education_update_enrollment((int) $sib['en_id'], array('status' => 'active'));
        }
        return true;
    }
}

if (!function_exists('onoff_service_contract_admin_list')) {
    function onoff_service_contract_admin_list($filters)
    {
        onoff_service_contract_ensure_tables();
        $filters = is_array($filters) ? $filters : array();
        $q = trim((string) ($filters['q'] ?? ''));
        $status = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($filters['status'] ?? ''));
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($filters['courseId'] ?? ''));
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) ($filters['mbId'] ?? ''));
        $page = max(1, (int) ($filters['page'] ?? 1));
        $limit = max(1, min(100, (int) ($filters['limit'] ?? 20)));
        $offset = ($page - 1) * $limit;

        $table = onoff_service_contract_table();
        $where = array('1=1');
        if ($status !== '') {
            $where[] = "sc_status = '" . sql_real_escape_string($status) . "'";
        }
        if ($course_id !== '') {
            $where[] = "sc_course_id = '" . sql_real_escape_string($course_id) . "'";
        }
        if ($mb_id !== '') {
            $where[] = "sc_mb_id = '" . sql_real_escape_string($mb_id) . "'";
        }
        if ($q !== '') {
            $q_esc = sql_real_escape_string($q);
            $where[] = "( sc_contract_code like '%{$q_esc}%' or sc_company_name like '%{$q_esc}%' or sc_signer_name like '%{$q_esc}%' or sc_signer_email like '%{$q_esc}%' )";
        }
        $where_sql = implode(' and ', $where);

        $total_row = sql_fetch(" select count(*) as cnt from {$table} where {$where_sql} ");
        $total = (int) ($total_row['cnt'] ?? 0);

        $items = array();
        $result = sql_query(" select * from {$table}
            where {$where_sql}
            order by sc_id desc
            limit {$offset}, {$limit} ");
        while ($row = sql_fetch_array($result)) {
            $items[] = onoff_service_contract_to_api($row);
        }

        return array(
            'items' => $items,
            'total' => $total,
            'page' => $page,
            'limit' => $limit,
            'currentVersion' => onoff_service_contract_version_for_course('marketing-service'),
        );
    }
}

if (!function_exists('onoff_service_contract_admin_detail')) {
    function onoff_service_contract_admin_detail($sc_id)
    {
        onoff_service_contract_ensure_tables();
        $row = onoff_service_contract_get_by_id($sc_id);
        if (!$row) {
            return null;
        }
        $sc_id = (int) $sc_id;
        $status_table = onoff_service_contract_status_log_table();
        $log_table = onoff_service_contract_log_table();
        $status_logs = array();
        $pdf_logs = array();

        $r1 = sql_query(" select * from {$status_table} where sc_id = '{$sc_id}' order by scsl_id desc ");
        while ($l = sql_fetch_array($r1)) {
            $status_logs[] = $l;
        }
        $r2 = sql_query(" select * from {$log_table} where sc_id = '{$sc_id}' order by scl_id desc ");
        while ($l = sql_fetch_array($r2)) {
            $pdf_logs[] = $l;
        }

        return array(
            'contract' => onoff_service_contract_to_api($row),
            'addenda' => onoff_service_contract_addendum_list($sc_id, true),
            'statusLogs' => $status_logs,
            'pdfLogs' => $pdf_logs,
            'partyB' => onoff_service_contract_party_b(),
            'canAddAddendum' => onoff_service_contract_can_add_addendum($row, 'admin'),
        );
    }
}

if (!function_exists('onoff_service_contract_admin_transition')) {
    /**
     * @return array{ok:bool,message:string,contract:?array}
     */
    function onoff_service_contract_admin_transition($sc_id, $action, $reason, $actor_mb_id, $actor_type = 'admin')
    {
        onoff_service_contract_ensure_tables();
        $row = onoff_service_contract_get_by_id($sc_id);
        if (!$row) {
            return array('ok' => false, 'message' => '계약을 찾을 수 없습니다.', 'contract' => null);
        }
        $action = preg_replace('/[^a-zA-Z]/', '', (string) $action);
        $old_status = (string) ($row['sc_status'] ?? '');
        $mb_id = (string) ($row['sc_mb_id'] ?? '');
        $sc_id = (int) $sc_id;
        $table = onoff_service_contract_table();
        $now = onoff_service_contract_now();
        $reason_text = onoff_service_contract_sanitize_text($reason, 1000);
        $actor_mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $actor_mb_id);
        $actor_type = preg_replace('/[^a-z0-9_\-]/i', '', (string) $actor_type);

        if ($action === 'approve') {
            if ($old_status !== ONOFF_SC_STATUS_REVIEW_PENDING) {
                return array('ok' => false, 'message' => '승인 대기 상태에서만 승인할 수 있습니다.', 'contract' => null);
            }
            if (trim((string) ($row['sc_signed_at'] ?? '')) === ''
                || trim((string) ($row['sc_signature_file_path'] ?? '')) === ''
                || trim((string) ($row['sc_contract_pdf_path'] ?? '')) === '') {
                return array('ok' => false, 'message' => '서명·PDF가 준비되지 않았습니다.', 'contract' => null);
            }
            $sql = " update {$table} set
                sc_status = '" . sql_real_escape_string(ONOFF_SC_STATUS_SIGNED) . "',
                sc_reviewed_by = '" . sql_real_escape_string($actor_mb_id) . "',
                sc_reviewed_at = '" . sql_real_escape_string($now) . "',
                sc_reject_reason = '',
                sc_updated_at = '" . sql_real_escape_string($now) . "'
              where sc_id = '{$sc_id}' ";
            if (!sql_query($sql, false)) {
                return array('ok' => false, 'message' => '승인 처리에 실패했습니다.', 'contract' => null);
            }
            onoff_service_contract_log_status($sc_id, $mb_id, $old_status, ONOFF_SC_STATUS_SIGNED, $reason_text, $actor_mb_id, $actor_type);
            onoff_service_contract_activate_enrollments_on_approve($row);
            return array('ok' => true, 'message' => '계약이 승인·체결되었습니다.', 'contract' => onoff_service_contract_get_by_id($sc_id));
        }

        if ($action === 'reject') {
            $sql = " update {$table} set
                sc_status = '" . sql_real_escape_string(ONOFF_SC_STATUS_REJECTED) . "',
                sc_reject_reason = '" . sql_real_escape_string($reason_text) . "',
                sc_reviewed_by = '" . sql_real_escape_string($actor_mb_id) . "',
                sc_reviewed_at = '" . sql_real_escape_string($now) . "',
                sc_updated_at = '" . sql_real_escape_string($now) . "'
              where sc_id = '{$sc_id}' ";
            if (!sql_query($sql, false)) {
                return array('ok' => false, 'message' => '반려 처리에 실패했습니다.', 'contract' => null);
            }
            onoff_service_contract_log_status($sc_id, $mb_id, $old_status, ONOFF_SC_STATUS_REJECTED, $reason_text, $actor_mb_id, $actor_type);
            return array('ok' => true, 'message' => '계약이 반려되었습니다.', 'contract' => onoff_service_contract_get_by_id($sc_id));
        }

        $map = array(
            'cancel' => ONOFF_SC_STATUS_CANCELLED,
            'expire' => ONOFF_SC_STATUS_EXPIRED,
            'requireRenewal' => ONOFF_SC_STATUS_RENEWAL,
        );
        if (!isset($map[$action])) {
            return array('ok' => false, 'message' => '지원하지 않는 작업입니다.', 'contract' => null);
        }
        $new_status = $map[$action];
        $sql = " update {$table} set
            sc_status = '" . sql_real_escape_string($new_status) . "',
            sc_updated_at = '" . sql_real_escape_string($now) . "'
          where sc_id = '{$sc_id}' ";
        if (!sql_query($sql, false)) {
            return array('ok' => false, 'message' => '상태 변경에 실패했습니다.', 'contract' => null);
        }
        onoff_service_contract_log_status($sc_id, $mb_id, $old_status, $new_status, $reason_text, $actor_mb_id, $actor_type);
        $labels = array(
            ONOFF_SC_STATUS_CANCELLED => '취소되었습니다.',
            ONOFF_SC_STATUS_EXPIRED => '만료 처리되었습니다.',
            ONOFF_SC_STATUS_RENEWAL => '갱신이 필요합니다.',
        );
        return array(
            'ok' => true,
            'message' => isset($labels[$new_status]) ? $labels[$new_status] : '상태가 변경되었습니다.',
            'contract' => onoff_service_contract_get_by_id($sc_id),
        );
    }
}

if (!function_exists('onoff_service_contract_maybe_create_on_enrollment_status')) {
    function onoff_service_contract_maybe_create_on_enrollment_status($enrollment_row, $new_status)
    {
        $new_status = function_exists('onoff_education_normalize_status')
            ? onoff_education_normalize_status($new_status)
            : trim((string) $new_status);
        if ($new_status !== 'pending_contract') {
            return 0;
        }
        if (!$enrollment_row || !is_array($enrollment_row)) {
            return 0;
        }
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($enrollment_row['course_id'] ?? ''));
        if ($course_id === 'seo-geo-master') {
            return onoff_service_contract_create_pending_from_enrollment($enrollment_row);
        }
        if (!onoff_service_contract_applies_course($course_id)) {
            $resolved = onoff_service_contract_resolve_package_course($enrollment_row);
            if (!onoff_service_contract_applies_course($resolved)) {
                return 0;
            }
        }
        return onoff_service_contract_create_pending_from_enrollment($enrollment_row);
    }
}






