<?php
/**
 * ONOFF Education enrollment helpers.
 * Bank-transfer workflow (CAP-style contract gate):
 * inquiry → pending_deposit → admin grants permission (pending_contract)
 * → student signs education contract → active enrollment.
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

if (!function_exists('onoff_education_platform_grant_cookie')) {
    function onoff_education_platform_grant_cookie()
    {
        return 'onoff_edu_platform_grant';
    }
}

if (!function_exists('onoff_education_platform_grant_key')) {
    function onoff_education_platform_grant_key()
    {
        if (defined('G5_TOKEN_ENCRYPTION_KEY') && (string) G5_TOKEN_ENCRYPTION_KEY !== '') {
            return (string) G5_TOKEN_ENCRYPTION_KEY;
        }
        return hash('sha256', (defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_') . '|onoff-education-platform');
    }
}

if (!function_exists('onoff_education_create_platform_grant_token')) {
    function onoff_education_create_platform_grant_token(array $enrollment, $ttl = 900)
    {
        $enId = isset($enrollment['en_id']) ? (int) $enrollment['en_id'] : 0;
        $courseId = preg_replace('/[^a-z0-9_\-]/i', '', (string) ($enrollment['course_id'] ?? ''));
        if ($enId < 1 || $courseId === '') {
            return '';
        }
        $expires = time() + max(60, (int) $ttl);
        $payload = $enId . '|' . $courseId . '|' . $expires;
        $encoded = rtrim(strtr(base64_encode($payload), '+/', '-_'), '=');
        $signature = hash_hmac('sha256', $encoded, onoff_education_platform_grant_key());
        return $encoded . '.' . $signature;
    }
}

if (!function_exists('onoff_education_issue_platform_grant')) {
    /**
     * Carry the already verified classroom enrollment into the education SPA.
     * The token contains only an enrollment id/course/expiry and is rechecked
     * against the database by the platform on every session request.
     */
    function onoff_education_issue_platform_grant(array $enrollment, $ttl = 900)
    {
        $token = onoff_education_create_platform_grant_token($enrollment, $ttl);
        if ($token === '') {
            return false;
        }

        $expires = time() + max(60, (int) $ttl);
        $host = strtolower(preg_replace('/:\d+$/', '', (string) ($_SERVER['HTTP_HOST'] ?? '')));
        $domain = preg_match('/(^|\.)icrm\.co\.kr$/', $host) ? '.icrm.co.kr' : '';

        if (PHP_VERSION_ID >= 70300) {
            return setcookie(onoff_education_platform_grant_cookie(), $token, array(
                'expires' => $expires,
                'path' => '/',
                'domain' => $domain,
                'secure' => true,
                'httponly' => true,
                'samesite' => 'Lax',
            ));
        }
        return setcookie(onoff_education_platform_grant_cookie(), $token, $expires, '/', $domain, true, true);
    }
}

if (!function_exists('onoff_education_validate_platform_grant_token')) {
    function onoff_education_validate_platform_grant_token($token, $courseId = 'seo-geo-master')
    {
        $token = trim((string) $token);
        $dot = strpos($token, '.');
        if ($dot === false) {
            return null;
        }
        $encoded = substr($token, 0, $dot);
        $signature = substr($token, $dot + 1);
        $expected = hash_hmac('sha256', $encoded, onoff_education_platform_grant_key());
        if ($signature === '' || !hash_equals($expected, $signature)) {
            return null;
        }

        $padding = strlen($encoded) % 4;
        $decoded = base64_decode(strtr($encoded . ($padding ? str_repeat('=', 4 - $padding) : ''), '-_', '+/'), true);
        $parts = is_string($decoded) ? explode('|', $decoded) : array();
        if (count($parts) !== 3) {
            return null;
        }
        $enId = (int) $parts[0];
        $tokenCourse = preg_replace('/[^a-z0-9_\-]/i', '', (string) $parts[1]);
        $expires = (int) $parts[2];
        $courseId = preg_replace('/[^a-z0-9_\-]/i', '', (string) $courseId);
        if ($enId < 1 || $expires < time() || $tokenCourse === '') {
            return null;
        }
        // Allow matching the token's embedded course, or any platform course when $courseId is 'any'.
        if ($courseId !== '' && $courseId !== 'any' && $tokenCourse !== $courseId) {
            return null;
        }
        $lookupCourse = ($courseId === '' || $courseId === 'any') ? $tokenCourse : $courseId;

        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
        $row = sql_fetch(
            " select *
                from {$table}
               where en_id = '{$enId}'
                 and course_id = '" . sql_real_escape_string($lookupCourse) . "'
                 and status = 'active'
                 and (starts_at is null or starts_at = '' or starts_at <= '" . sql_real_escape_string($now) . "')
                 and (ends_at is null or ends_at = '' or ends_at >= '" . sql_real_escape_string($now) . "')
               limit 1 "
        );
        return !empty($row['en_id']) ? $row : null;
    }
}

if (!function_exists('onoff_education_platform_grant_enrollment')) {
    function onoff_education_platform_grant_enrollment($courseId = 'seo-geo-master')
    {
        $token = (string) ($_COOKIE[onoff_education_platform_grant_cookie()] ?? '');
        if ($courseId === 'any') {
            return onoff_education_validate_platform_grant_token($token, 'any');
        }
        $row = onoff_education_validate_platform_grant_token($token, $courseId);
        if ($row) {
            return $row;
        }
        // Fallback: cookie may have been issued for another platform course.
        return onoff_education_validate_platform_grant_token($token, 'any');
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
            'contract_version' => "ALTER TABLE `{$table}` ADD `contract_version` varchar(40) NOT NULL DEFAULT '' AFTER `kakao_last_error`",
            'contract_party_name' => "ALTER TABLE `{$table}` ADD `contract_party_name` varchar(100) NOT NULL DEFAULT '' AFTER `contract_version`",
            'contract_party_phone' => "ALTER TABLE `{$table}` ADD `contract_party_phone` varchar(50) NOT NULL DEFAULT '' AFTER `contract_party_name`",
            'contract_party_email' => "ALTER TABLE `{$table}` ADD `contract_party_email` varchar(120) NOT NULL DEFAULT '' AFTER `contract_party_phone`",
            'contract_agreements' => "ALTER TABLE `{$table}` ADD `contract_agreements` text NULL AFTER `contract_party_email`",
            'contract_signature_path' => "ALTER TABLE `{$table}` ADD `contract_signature_path` varchar(255) NOT NULL DEFAULT '' AFTER `contract_agreements`",
            'contract_signed_at' => "ALTER TABLE `{$table}` ADD `contract_signed_at` datetime NULL AFTER `contract_signature_path`",
            'contract_signed_ip' => "ALTER TABLE `{$table}` ADD `contract_signed_ip` varchar(45) NOT NULL DEFAULT '' AFTER `contract_signed_at`",
            'contract_snapshot' => "ALTER TABLE `{$table}` ADD `contract_snapshot` mediumtext NULL AFTER `contract_signed_ip`",
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
        $allowed = array('pending_deposit', 'pending_contract', 'active', 'expired', 'cancelled');
        return in_array($status, $allowed, true) ? $status : 'pending_deposit';
    }
}

if (!function_exists('onoff_education_contract_version')) {
    function onoff_education_contract_version()
    {
        return 'EDU-CONTRACT-2026-09';
    }
}

if (!function_exists('onoff_education_platform_course_ids')) {
    /** Course IDs that grant seo-system-300 platform access. */
    function onoff_education_platform_course_ids()
    {
        return array('seo-geo-master', 'marketing-service', 'education-marketing');
    }
}

if (!function_exists('onoff_education_resolve_course_ids')) {
    /**
     * Map a logical course/package key to physical enrollment course_id list.
     * education-marketing covers both education and marketing enrollments.
     */
    function onoff_education_resolve_course_ids($course_id)
    {
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if ($course_id === '' || $course_id === 'any') {
            return onoff_education_platform_course_ids();
        }
        if ($course_id === 'education-marketing') {
            return array('seo-geo-master', 'marketing-service', 'education-marketing');
        }
        return array($course_id);
    }
}

if (!function_exists('onoff_education_contract_path_for_course')) {
    function onoff_education_contract_path_for_course($course_id)
    {
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if ($course_id === 'marketing-service') {
            return '/marketing/contract';
        }
        if ($course_id === 'education-marketing') {
            return '/service/contract';
        }
        return '/education/contract';
    }
}

if (!function_exists('onoff_education_contract_package')) {
    function onoff_education_contract_package()
    {
        return array(
            'id' => 'education',
            'title' => '온오프 아카데미 수강 계약',
            'version' => onoff_education_contract_version(),
            'scope' => array(
                'SEO·GEO 실무 커리큘럼 수강',
                '실습·피드백 및 클래스룸 안내',
                '맞춤 제작이 필요한 경우 별도 범위 협의',
            ),
            'period' => '과정 일정에 따름 (수강 안내서 기준)',
            'feeNote' => '입금 확인된 수강료 기준으로 적용',
            'clauses' => array(
                '수강권은 본인만 사용할 수 있으며, 제3자 양도·공유를 금지합니다.',
                '강의 자료·녹화본·클래스룸 콘텐츠의 무단 복제·배포를 금지합니다.',
                '온오프마케팅이 홈페이지를 제작해 드린 경우, 납품 후 매년 50만 포인트를 충전해야 합니다. 이 충전은 연 유지보수 비용이 아니며, 충전한 포인트는 콘텐츠·백링크·트래픽 등 서비스 요금으로 사용할 수 있습니다.',
                '환불·일정 변경은 온오프마케팅 안내 기준을 따릅니다.',
                '전자서명은 수기 서명과 동일한 효력을 갖는 것에 동의합니다.',
            ),
        );
    }
}

if (!function_exists('onoff_marketing_contract_package')) {
    function onoff_marketing_contract_package()
    {
        return array(
            'id' => 'marketing',
            'title' => '온오프마케팅 의뢰 계약',
            'version' => 'MKT-CONTRACT-2026-09',
            'scope' => array(
                'SEO·GEO·홈페이지·콘텐츠·백링크·트래픽 등 마케팅 실행 범위 협의',
                '전담 매니저 배정 및 킥오프·진행 리포트',
                '교육 플랫폼을 통한 프로젝트·주문·수정요청 관리',
            ),
            'period' => '계약서 기재 기간 (통상 1~3개월, 협의)',
            'feeNote' => '서비스·규모에 따라 상담 후 확정',
            'clauses' => array(
                '의뢰 범위·일정·비용은 상담 후 확정된 견적·계약 내용을 따릅니다.',
                '제공된 기획·디자인·소스·리포트의 무단 재판매·양도를 금지합니다.',
                '온오프마케팅이 홈페이지를 제작해 드린 경우, 납품 후 매년 50만 포인트를 충전해야 합니다. 이 충전은 연 유지보수 비용이 아니며, 충전한 포인트는 콘텐츠·백링크·트래픽 등 서비스 요금으로 사용할 수 있습니다.',
                '환불·일정 변경은 온오프마케팅 안내 기준을 따릅니다.',
                '전자서명은 수기 서명과 동일한 효력을 갖는 것에 동의합니다.',
            ),
        );
    }
}

if (!function_exists('onoff_education_marketing_contract_package')) {
    function onoff_education_marketing_contract_package()
    {
        return array(
            'id' => 'education-marketing',
            'title' => '온오프 아카데미 수강 + 마케팅 의뢰 통합 계약',
            'version' => 'EDU-MKT-CONTRACT-2026-09',
            'scope' => array(
                'SEO·GEO 실무 커리큘럼 수강 및 클래스룸 안내',
                '마케팅 실행(홈페이지·콘텐츠·백링크·트래픽 등) 범위 협의',
                '교육 플랫폼을 통한 학습·프로젝트·주문 통합 관리',
            ),
            'period' => '수강·의뢰 일정에 따름 (안내서·견적 기준)',
            'feeNote' => '수강료·마케팅 비용은 상담 후 각각 확정',
            'clauses' => array(
                '수강권은 본인만 사용할 수 있으며, 제3자 양도·공유를 금지합니다.',
                '강의 자료·클래스룸 콘텐츠 및 마케팅 산출물의 무단 복제·배포를 금지합니다.',
                '온오프마케팅이 홈페이지를 제작해 드린 경우, 납품 후 매년 50만 포인트를 충전해야 합니다. 이 충전은 연 유지보수 비용이 아니며, 충전한 포인트는 콘텐츠·백링크·트래픽 등 서비스 요금으로 사용할 수 있습니다.',
                '환불·일정 변경은 온오프마케팅 안내 기준을 따릅니다.',
                '전자서명은 수기 서명과 동일한 효력을 갖는 것에 동의합니다.',
            ),
        );
    }
}

if (!function_exists('onoff_education_contract_package_for_course')) {
    function onoff_education_contract_package_for_course($course_id)
    {
        $course_id = preg_replace('/[^a-z0-9_\-]/i', '', (string) $course_id);
        if ($course_id === 'marketing-service' || $course_id === 'marketing') {
            return onoff_marketing_contract_package();
        }
        if ($course_id === 'education-marketing') {
            return onoff_education_marketing_contract_package();
        }
        return onoff_education_contract_package();
    }
}

if (!function_exists('onoff_education_create_pending_enrollment')) {
    function onoff_education_create_pending_enrollment(array $data)
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();

        $bo_table = isset($data['contract_bo_table']) ? preg_replace('/[^a-z0-9_]/i', '', (string) $data['contract_bo_table']) : '';
        $wr_id = isset($data['contract_wr_id']) ? (int) $data['contract_wr_id'] : 0;

        $course_id = isset($data['course_id']) ? preg_replace('/[^a-z0-9_\-]/i', '', (string) $data['course_id']) : 'seo-geo-master';
        if ($course_id === '') {
            $course_id = 'seo-geo-master';
        }

        if ($bo_table !== '' && $wr_id > 0) {
            $exists = sql_fetch(" select en_id from {$table} where contract_bo_table = '" . sql_real_escape_string($bo_table) . "' and contract_wr_id = '" . (int) $wr_id . "' and course_id = '" . sql_real_escape_string($course_id) . "' limit 1 ");
            if (!empty($exists['en_id'])) {
                return (int) $exists['en_id'];
            }
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

        $activated_sql = '';
        if ($status === 'active' || $status === 'pending_contract') {
            $activated_sql = ", activated_at = IF(activated_at IS NULL, '" . sql_real_escape_string($now) . "', activated_at)";
        }
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
            'contract_version' => (string) ($row['contract_version'] ?? ''),
            'contract_party_name' => (string) ($row['contract_party_name'] ?? ''),
            'contract_party_phone' => (string) ($row['contract_party_phone'] ?? ''),
            'contract_party_email' => (string) ($row['contract_party_email'] ?? ''),
            'contract_signed_at' => (string) ($row['contract_signed_at'] ?? ''),
            'has_contract_signature' => trim((string) ($row['contract_signature_path'] ?? '')) !== '',
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
        if ($mb_id === '') {
            return null;
        }

        $course_ids = onoff_education_resolve_course_ids($course_id);
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');

        foreach ($course_ids as $cid) {
            $expired_sql = " update {$table}
                                set status = 'expired',
                                    updated_at = '" . sql_real_escape_string($now) . "'
                              where mb_id = '" . sql_real_escape_string($mb_id) . "'
                                and course_id = '" . sql_real_escape_string($cid) . "'
                                and status = 'active'
                                and ends_at is not null
                                and ends_at <> ''
                                and ends_at < '" . sql_real_escape_string($now) . "' ";
            sql_query($expired_sql, false);

            $sql = " select *
                       from {$table}
                      where mb_id = '" . sql_real_escape_string($mb_id) . "'
                        and course_id = '" . sql_real_escape_string($cid) . "'
                        and status = 'active'
                        and (starts_at is null or starts_at = '' or starts_at <= '" . sql_real_escape_string($now) . "')
                        and (ends_at is null or ends_at = '' or ends_at >= '" . sql_real_escape_string($now) . "')
                      order by en_id desc
                      limit 1 ";
            $row = sql_fetch($sql);
            if ($row) {
                return $row;
            }
        }
        return null;
    }
}

if (!function_exists('onoff_education_get_pending_contract_enrollment')) {
    function onoff_education_get_pending_contract_enrollment($mb_id, $course_id = 'seo-geo-master')
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $mb_id = preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) $mb_id);
        if ($mb_id === '') {
            return null;
        }

        $course_ids = onoff_education_resolve_course_ids($course_id);
        foreach ($course_ids as $cid) {
            $sql = " select *
                       from {$table}
                      where mb_id = '" . sql_real_escape_string($mb_id) . "'
                        and course_id = '" . sql_real_escape_string($cid) . "'
                        and status = 'pending_contract'
                      order by en_id desc
                      limit 1 ";
            $row = sql_fetch($sql);
            if ($row) {
                return $row;
            }
        }
        return null;
    }
}

if (!function_exists('onoff_education_decode_agreements')) {
    function onoff_education_decode_agreements($raw)
    {
        if (is_array($raw)) {
            return $raw;
        }
        $decoded = json_decode((string) $raw, true);
        return is_array($decoded) ? $decoded : array();
    }
}

if (!function_exists('onoff_education_contract_signature_dir')) {
    function onoff_education_contract_signature_dir()
    {
        $ym = date('Ym');
        $dir = G5_DATA_PATH . '/education_sign/' . $ym;
        if (!is_dir($dir)) {
            @mkdir($dir, 0755, true);
        }
        return $dir;
    }
}

if (!function_exists('onoff_education_save_contract_signature_png')) {
    /**
     * @return array{ok:bool,message:string,path:string}
     */
    function onoff_education_save_contract_signature_png($en_id, $data_url)
    {
        $en_id = (int) $en_id;
        $data_url = trim((string) $data_url);
        if ($en_id < 1 || $data_url === '') {
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

        $dir = onoff_education_contract_signature_dir();
        if (!is_dir($dir) || !is_writable($dir)) {
            return array('ok' => false, 'message' => '서명 저장 폴더를 사용할 수 없습니다.', 'path' => '');
        }
        $ym = date('Ym');
        $name = 'sig_' . date('Ymd_His') . '_' . substr(md5((string) $en_id . microtime(true)), 0, 10) . '.png';
        $abs = $dir . '/' . $name;
        if (@file_put_contents($abs, $binary) === false) {
            return array('ok' => false, 'message' => '서명 파일 저장에 실패했습니다.', 'path' => '');
        }
        return array(
            'ok' => true,
            'message' => '서명이 저장되었습니다.',
            'path' => 'education_sign/' . $ym . '/' . $name,
        );
    }
}

if (!function_exists('onoff_education_save_contract_draft')) {
    function onoff_education_save_contract_draft($en_id, array $form)
    {
        onoff_education_ensure_table();
        $table = onoff_education_enrollment_table();
        $en_id = (int) $en_id;
        if ($en_id < 1) {
            return false;
        }
        $name = isset($form['partyName']) ? trim(strip_tags((string) $form['partyName'])) : '';
        $phone = isset($form['partyPhone']) ? trim(strip_tags((string) $form['partyPhone'])) : '';
        $email = isset($form['partyEmail']) ? trim(strip_tags((string) $form['partyEmail'])) : '';
        $agreements = onoff_education_decode_agreements($form['agreements'] ?? array());
        $now = defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
        $sql = " update {$table}
                    set contract_party_name = '" . sql_real_escape_string($name) . "',
                        contract_party_phone = '" . sql_real_escape_string($phone) . "',
                        contract_party_email = '" . sql_real_escape_string($email) . "',
                        contract_agreements = '" . sql_real_escape_string(json_encode($agreements, JSON_UNESCAPED_UNICODE)) . "',
                        contract_version = '" . sql_real_escape_string(onoff_education_contract_version()) . "',
                        updated_at = '" . sql_real_escape_string($now) . "'
                  where en_id = '{$en_id}'
                    and status = 'pending_contract' ";
        return (bool) sql_query($sql, false);
    }
}

if (!function_exists('onoff_education_sign_contract')) {
    /**
     * @return array{ok:bool,message:string,enrollment:?array}
     */
    function onoff_education_sign_contract($en_id, array $form, $signature_data_url, $ip = '')
    {
        $en_id = (int) $en_id;
        $row = onoff_education_get_enrollment($en_id);
        if (!$row || (string) ($row['status'] ?? '') !== 'pending_contract') {
            return array('ok' => false, 'message' => '작성 가능한 수강 계약이 없습니다.', 'enrollment' => null);
        }

        $name = trim(strip_tags((string) ($form['partyName'] ?? '')));
        $phone = trim(strip_tags((string) ($form['partyPhone'] ?? '')));
        $email = trim(strip_tags((string) ($form['partyEmail'] ?? '')));
        $agreements = onoff_education_decode_agreements($form['agreements'] ?? array());
        if ($name === '' || $phone === '') {
            return array('ok' => false, 'message' => '계약 당사자 이름과 연락처를 입력해 주세요.', 'enrollment' => null);
        }
        foreach (array('readAll', 'personalUse', 'noRedistribute', 'electronic') as $key) {
            if (empty($agreements[$key])) {
                return array('ok' => false, 'message' => '필수 약관에 모두 동의해 주세요.', 'enrollment' => null);
            }
        }

        $saved = onoff_education_save_contract_signature_png($en_id, $signature_data_url);
        if (empty($saved['ok'])) {
            return array('ok' => false, 'message' => (string) ($saved['message'] ?? '서명 저장 실패'), 'enrollment' => null);
        }

        $row_course = (string) ($row['course_id'] ?? 'seo-geo-master');
        $package_hint = isset($form['packageCourseId']) ? (string) $form['packageCourseId'] : $row_course;
        $package = onoff_education_contract_package_for_course($package_hint !== '' ? $package_hint : $row_course);
        $snapshot = array(
            'version' => $package['version'],
            'package' => $package,
            'party' => array(
                'name' => $name,
                'phone' => $phone,
                'email' => $email,
            ),
            'agreements' => $agreements,
            'signedAt' => defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s'),
            'signedIp' => (string) $ip,
        );
        $now = $snapshot['signedAt'];
        $table = onoff_education_enrollment_table();
        $sql = " update {$table}
                    set status = 'active',
                        contract_party_name = '" . sql_real_escape_string($name) . "',
                        contract_party_phone = '" . sql_real_escape_string($phone) . "',
                        contract_party_email = '" . sql_real_escape_string($email) . "',
                        contract_agreements = '" . sql_real_escape_string(json_encode($agreements, JSON_UNESCAPED_UNICODE)) . "',
                        contract_signature_path = '" . sql_real_escape_string((string) $saved['path']) . "',
                        contract_signed_at = '" . sql_real_escape_string($now) . "',
                        contract_signed_ip = '" . sql_real_escape_string(substr((string) $ip, 0, 45)) . "',
                        contract_version = '" . sql_real_escape_string((string) $package['version']) . "',
                        contract_snapshot = '" . sql_real_escape_string(json_encode($snapshot, JSON_UNESCAPED_UNICODE)) . "',
                        activated_at = IF(activated_at IS NULL, '" . sql_real_escape_string($now) . "', activated_at),
                        updated_at = '" . sql_real_escape_string($now) . "'
                  where en_id = '{$en_id}'
                    and status = 'pending_contract' ";
        if (!sql_query($sql, false)) {
            return array('ok' => false, 'message' => '계약 저장에 실패했습니다.', 'enrollment' => null);
        }

        // Combined education+marketing: activate sibling enrollments from the same inquiry.
        $bo_table = preg_replace('/[^a-z0-9_]/i', '', (string) ($row['contract_bo_table'] ?? ''));
        $wr_id = (int) ($row['contract_wr_id'] ?? 0);
        if ($bo_table !== '' && $wr_id > 0) {
            $sibling_sql = " update {$table}
                                set status = 'active',
                                    contract_party_name = '" . sql_real_escape_string($name) . "',
                                    contract_party_phone = '" . sql_real_escape_string($phone) . "',
                                    contract_party_email = '" . sql_real_escape_string($email) . "',
                                    contract_agreements = '" . sql_real_escape_string(json_encode($agreements, JSON_UNESCAPED_UNICODE)) . "',
                                    contract_signature_path = '" . sql_real_escape_string((string) $saved['path']) . "',
                                    contract_signed_at = '" . sql_real_escape_string($now) . "',
                                    contract_signed_ip = '" . sql_real_escape_string(substr((string) $ip, 0, 45)) . "',
                                    contract_version = '" . sql_real_escape_string((string) $package['version']) . "',
                                    contract_snapshot = '" . sql_real_escape_string(json_encode($snapshot, JSON_UNESCAPED_UNICODE)) . "',
                                    activated_at = IF(activated_at IS NULL, '" . sql_real_escape_string($now) . "', activated_at),
                                    updated_at = '" . sql_real_escape_string($now) . "'
                              where contract_bo_table = '" . sql_real_escape_string($bo_table) . "'
                                and contract_wr_id = '" . (int) $wr_id . "'
                                and en_id <> '{$en_id}'
                                and status = 'pending_contract' ";
            sql_query($sibling_sql, false);
        }

        return array(
            'ok' => true,
            'message' => '계약이 완료되었습니다.',
            'enrollment' => onoff_education_get_enrollment($en_id),
        );
    }
}

if (!function_exists('onoff_education_contract_state_for_member')) {
    function onoff_education_contract_state_for_member($mb_id, $course_id = 'seo-geo-master')
    {
        $active = onoff_education_get_active_enrollment($mb_id, $course_id);
        $pending = onoff_education_get_pending_contract_enrollment($mb_id, $course_id);
        $row = $pending ?: $active;
        $package_course = $course_id;
        if ($row && !empty($row['course_id'])) {
            // Prefer physical enrollment course; for combined signing use education-marketing package.
            if ($course_id === 'education-marketing') {
                $package_course = 'education-marketing';
            } else {
                $package_course = (string) $row['course_id'];
            }
        }
        $package = onoff_education_contract_package_for_course($package_course);
        $agreements = $row ? onoff_education_decode_agreements($row['contract_agreements'] ?? '') : array();
        return array(
            'requiresContract' => (bool) $pending,
            'isSigned' => ((bool) $active) && trim((string) ($active['contract_signed_at'] ?? '')) !== '',
            'canWrite' => (bool) $pending,
            'version' => $package['version'],
            'package' => $package,
            'course_id' => $package_course,
            'contractPath' => onoff_education_contract_path_for_course($package_course),
            'enrollment' => onoff_education_serialize_enrollment($row),
            'form' => array(
                'partyName' => (string) ($row['contract_party_name'] ?? ($row['applicant_name'] ?? '')),
                'partyPhone' => (string) ($row['contract_party_phone'] ?? ($row['phone'] ?? '')),
                'partyEmail' => (string) ($row['contract_party_email'] ?? ($row['email'] ?? '')),
                'agreements' => array(
                    'readAll' => !empty($agreements['readAll']),
                    'personalUse' => !empty($agreements['personalUse']),
                    'noRedistribute' => !empty($agreements['noRedistribute']),
                    'electronic' => !empty($agreements['electronic']),
                ),
            ),
        );
    }
}
