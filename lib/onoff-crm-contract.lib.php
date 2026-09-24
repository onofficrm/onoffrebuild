<?php
/**
 * CRM (crm.icrm.co.kr) view over the three OnOff contract types.
 *
 * education           -> onoff_education_enrollments (seo-geo-master, not part of a combined package)
 * marketing           -> onoff_service_contracts (marketing-service)
 * education_marketing -> onoff_service_contracts (education-marketing)
 *
 * OnOff stays the source of truth: this layer reads the existing rows and mutates them only
 * through the existing education / service-contract functions. The only table it owns is the
 * CRM audit log.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

require_once dirname(__FILE__) . '/onoff-education.lib.php';
require_once dirname(__FILE__) . '/onoff-service-contract.lib.php';

if (!defined('ONOFF_CRM_CONTRACT_API_PATH')) {
    define('ONOFF_CRM_CONTRACT_API_PATH', '/api/crm/contracts.php');
}

function onoff_crm_contract_types()
{
    return array(
        'education' => '교육',
        'marketing' => '마케팅',
        'education_marketing' => '교육+마케팅',
    );
}

function onoff_crm_contract_statuses()
{
    return array('pending', 'in_progress', 'review_pending', 'signed', 'rejected', 'cancelled', 'expired', 'renewal');
}

function onoff_crm_contract_service_course_ids($type)
{
    if ($type === 'education') {
        return array('seo-geo-master');
    }
    if ($type === 'marketing') {
        return array('marketing-service', 'marketing');
    }
    if ($type === 'education_marketing') {
        return array('education-marketing', 'edu-marketing');
    }
    return array();
}

function onoff_crm_contract_type_for_service_course($course_id)
{
    foreach (array('education', 'marketing', 'education_marketing') as $type) {
        if (in_array((string) $course_id, onoff_crm_contract_service_course_ids($type), true)) {
            return $type;
        }
    }
    return '';
}

/**
 * @return array{type:string,id:int}|null
 */
function onoff_crm_contract_parse_key($key)
{
    if (!is_string($key) || !preg_match('/^(education|marketing|education_marketing):([1-9][0-9]{0,18})$/', $key, $m)) {
        return null;
    }
    return array('type' => $m[1], 'id' => (int) $m[2]);
}

function onoff_crm_contract_make_key($type, $id)
{
    return $type . ':' . (int) $id;
}

function onoff_crm_contract_make_ref($storage, $type, $id)
{
    return $storage . ':' . $type . ':' . (int) $id;
}

/**
 * @return array{storage:string,type:string,id:int}|null
 */
function onoff_crm_contract_parse_ref($ref)
{
    if (!is_string($ref) || !preg_match('/^(platform|legacy):(education|marketing|education_marketing):([1-9][0-9]{0,18})$/', $ref, $m)) {
        return null;
    }
    return array('storage' => $m[1], 'type' => $m[2], 'id' => (int) $m[3]);
}

function onoff_crm_contract_now()
{
    return defined('G5_TIME_YMDHIS') ? G5_TIME_YMDHIS : date('Y-m-d H:i:s');
}

function onoff_crm_contract_nullable($value)
{
    $value = trim((string) $value);
    return $value === '' ? null : $value;
}

function onoff_crm_contract_nullable_datetime($value)
{
    $value = trim((string) $value);
    if ($value === '' || strpos($value, '0000-00-00') === 0) {
        return null;
    }
    return $value;
}

function onoff_crm_contract_nullable_date($value)
{
    $value = onoff_crm_contract_nullable_datetime($value);
    if ($value === null) {
        return null;
    }
    return preg_match('/^\d{4}-\d{2}-\d{2}/', $value) ? substr($value, 0, 10) : $value;
}

/** Parses free-form amount text such as "3,300,000원" or "330만원" into a number. */
function onoff_crm_contract_parse_amount($value)
{
    if (is_int($value) || is_float($value)) {
        return $value + 0;
    }
    $text = str_replace(array(',', ' '), '', trim((string) $value));
    if ($text === '') {
        return null;
    }
    if (preg_match('/^(\d+(?:\.\d+)?)만/u', $text, $m)) {
        return (int) round(((float) $m[1]) * 10000);
    }
    if (preg_match('/\d+(?:\.\d+)?/', $text, $m)) {
        return strpos($m[0], '.') !== false ? (float) $m[0] : (int) $m[0];
    }
    return null;
}

function onoff_crm_contract_file_url($action, $key)
{
    return ONOFF_CRM_CONTRACT_API_PATH . '?action=' . $action . '&contract_key=' . rawurlencode($key);
}

/* ------------------------------------------------------------------ */
/* Education (education-only enrollment contracts)                     */
/* ------------------------------------------------------------------ */

/** SQL predicate for seo-geo-master rows that belong to a combined education+marketing package. */
function onoff_crm_contract_education_combined_sql($alias)
{
    $etable = onoff_education_enrollment_table();
    return "exists (select 1 from {$etable} sib
                     where sib.course_id in ('marketing-service', 'education-marketing')
                       and sib.contract_bo_table = {$alias}.contract_bo_table
                       and sib.contract_wr_id = {$alias}.contract_wr_id
                       and {$alias}.contract_bo_table <> ''
                       and {$alias}.contract_wr_id > 0)";
}

/**
 * Enrollment rows that look like education contracts (legacy storage shape), ignoring platform overlap.
 * Used for explicit legacy:contractRef resolution and ambiguity detection.
 */
function onoff_crm_contract_education_legacy_shape_sql($alias)
{
    return "{$alias}.course_id = 'seo-geo-master'
        and ( {$alias}.status = 'pending_contract'
              or ({$alias}.status in ('active', 'expired') and {$alias}.contract_signed_at is not null)
              or ({$alias}.status = 'cancelled' and ({$alias}.contract_signed_at is not null or {$alias}.activated_at is not null)) )
        and not " . onoff_crm_contract_education_combined_sql($alias);
}

/**
 * Legacy education contracts stored on the enrollment row. Enrollments that never reached the contract step
 * (e.g. cancelled while awaiting deposit) are not contracts, and enrollments with a platform contract are served from it.
 */
function onoff_crm_contract_education_where_sql($alias)
{
    onoff_service_contract_ensure_tables();
    $sc_table = onoff_service_contract_table();
    return onoff_crm_contract_education_legacy_shape_sql($alias) . "
        and not exists (select 1 from {$sc_table} sc where sc.sc_en_id = {$alias}.en_id and sc.sc_course_id = 'seo-geo-master')";
}

function onoff_crm_contract_education_status($row)
{
    $status = (string) ($row['status'] ?? '');
    if ($status === 'expired' || $status === 'cancelled') {
        return $status;
    }
    return onoff_education_contract_review_status($row);
}

function onoff_crm_contract_education_get($en_id, $allow_platform_overlap = false)
{
    onoff_education_ensure_table();
    $etable = onoff_education_enrollment_table();
    $en_id = (int) $en_id;
    if ($en_id < 1) {
        return null;
    }
    $pred = $allow_platform_overlap
        ? onoff_crm_contract_education_legacy_shape_sql('e')
        : onoff_crm_contract_education_where_sql('e');
    $row = sql_fetch(" select e.* from {$etable} e
        where e.en_id = '{$en_id}'
          and {$pred}
        limit 1 ");
    return $row ?: null;
}

/** True when the enrollment itself carries a legacy customer signature (not only a platform sc_* signature). */
function onoff_crm_contract_education_has_legacy_signature($row)
{
    if (!$row || !is_array($row)) {
        return false;
    }
    return trim((string) ($row['contract_signed_at'] ?? '')) !== ''
        || trim((string) ($row['contract_signature_path'] ?? '')) !== '';
}

function onoff_crm_contract_education_to_api($row)
{
    $key = onoff_crm_contract_make_key('education', (int) $row['en_id']);
    $status = onoff_crm_contract_education_status($row);
    $package = onoff_education_contract_package_for_course('seo-geo-master');
    $signer = trim((string) ($row['contract_party_name'] ?? ''));
    if ($signer === '') {
        $signer = trim((string) ($row['applicant_name'] ?? ''));
    }
    $deposit = (int) ($row['deposit_amount'] ?? 0);
    $types = onoff_crm_contract_types();
    return array(
        'contractKey' => $key,
        'contractRef' => onoff_crm_contract_make_ref('legacy', 'education', (int) $row['en_id']),
        'sourceId' => (int) $row['en_id'],
        'contractType' => 'education',
        'contractTypeLabel' => $types['education'],
        'storage' => 'legacy',
        'contractCode' => null,
        'memberId' => (string) ($row['mb_id'] ?? ''),
        'companyName' => null,
        'representativeName' => null,
        'signerName' => onoff_crm_contract_nullable($signer),
        'serviceScope' => implode("\n", (array) ($package['scope'] ?? array())),
        'amount' => $deposit > 0 ? $deposit : null,
        'startDate' => onoff_crm_contract_nullable_date($row['starts_at'] ?? ''),
        'endDate' => onoff_crm_contract_nullable_date($row['ends_at'] ?? ''),
        'status' => $status,
        'statusLabel' => onoff_service_contract_status_label($status),
        'signedAt' => onoff_crm_contract_nullable_datetime($row['contract_signed_at'] ?? ''),
        'createdAt' => onoff_crm_contract_nullable_datetime($row['created_at'] ?? ''),
        'updatedAt' => onoff_crm_contract_nullable_datetime($row['updated_at'] ?? ''),
        'documentUrl' => null,
        'downloadUrl' => null,
        'signatureUrl' => trim((string) ($row['contract_signature_path'] ?? '')) !== ''
            ? onoff_crm_contract_file_url('signature', $key)
            : null,
    );
}

function onoff_crm_contract_education_list(array $filters)
{
    onoff_education_ensure_table();
    $etable = onoff_education_enrollment_table();
    $where = array(onoff_crm_contract_education_where_sql('e'));
    if ($filters['memberId'] !== '') {
        $where[] = "e.mb_id = '" . sql_real_escape_string($filters['memberId']) . "'";
    }
    if ($filters['query'] !== '') {
        $q = sql_real_escape_string(addcslashes($filters['query'], '%_\\'));
        $where[] = "( e.mb_id like '%{$q}%' or e.applicant_name like '%{$q}%' or e.contract_party_name like '%{$q}%'
                      or e.email like '%{$q}%' or e.contract_party_email like '%{$q}%' )";
    }
    $items = array();
    $result = sql_query(" select e.* from {$etable} e
        where " . implode(' and ', $where) . "
        order by e.updated_at desc, e.en_id desc
        limit 5000 ", false);
    while ($result && ($row = sql_fetch_array($result))) {
        $items[] = onoff_crm_contract_education_to_api($row);
    }
    return $items;
}

/* ------------------------------------------------------------------ */
/* Marketing / education+marketing (onoff_service_contracts)          */
/* ------------------------------------------------------------------ */

/** Education platform contracts keep the enrollment id in their key so the key is the same before and after the move. */
function onoff_crm_contract_service_key_id($type, array $row)
{
    return $type === 'education' ? (int) ($row['sc_en_id'] ?? 0) : (int) $row['sc_id'];
}

function onoff_crm_contract_service_get($type, $id)
{
    $row = $type === 'education'
        ? onoff_service_contract_education_row((int) $id)
        : onoff_service_contract_get_by_id((int) $id);
    if (!$row || onoff_crm_contract_type_for_service_course((string) ($row['sc_course_id'] ?? '')) !== $type) {
        return null;
    }
    return $row;
}

function onoff_crm_contract_service_to_api($row)
{
    $type = onoff_crm_contract_type_for_service_course((string) ($row['sc_course_id'] ?? ''));
    $key_id = onoff_crm_contract_service_key_id($type, $row);
    $key = onoff_crm_contract_make_key($type, $key_id);
    $status = (string) ($row['sc_status'] ?? '');
    $types = onoff_crm_contract_types();
    return array(
        'contractKey' => $key,
        'contractRef' => onoff_crm_contract_make_ref('platform', $type, $key_id),
        'sourceId' => $key_id,
        'contractType' => $type,
        'contractTypeLabel' => isset($types[$type]) ? $types[$type] : $type,
        'storage' => 'platform',
        'contractCode' => onoff_crm_contract_nullable($row['sc_contract_code'] ?? ''),
        'memberId' => (string) ($row['sc_mb_id'] ?? ''),
        'companyName' => onoff_crm_contract_nullable($row['sc_company_name'] ?? ''),
        'representativeName' => onoff_crm_contract_nullable($row['sc_representative_name'] ?? ''),
        'signerName' => onoff_crm_contract_nullable($row['sc_signer_name'] ?? ''),
        'serviceScope' => onoff_crm_contract_nullable($row['sc_service_scope'] ?? ''),
        'amount' => onoff_crm_contract_parse_amount($row['sc_amount'] ?? ''),
        'startDate' => onoff_crm_contract_nullable_date($row['sc_start_date'] ?? ''),
        'endDate' => onoff_crm_contract_nullable_date($row['sc_end_date'] ?? ''),
        'status' => $status,
        'statusLabel' => onoff_service_contract_status_label($status),
        'signedAt' => onoff_crm_contract_nullable_datetime($row['sc_signed_at'] ?? ''),
        'createdAt' => onoff_crm_contract_nullable_datetime($row['sc_created_at'] ?? ''),
        'updatedAt' => onoff_crm_contract_nullable_datetime($row['sc_updated_at'] ?? ''),
        'documentUrl' => onoff_crm_contract_file_url('document', $key),
        'downloadUrl' => trim((string) ($row['sc_contract_pdf_path'] ?? '')) !== ''
            ? onoff_crm_contract_file_url('download', $key)
            : null,
        'signatureUrl' => trim((string) ($row['sc_signature_file_path'] ?? '')) !== ''
            ? onoff_crm_contract_file_url('signature', $key)
            : null,
    );
}

function onoff_crm_contract_service_list($type, array $filters)
{
    onoff_service_contract_ensure_tables();
    $table = onoff_service_contract_table();
    $courses = array();
    foreach (onoff_crm_contract_service_course_ids($type) as $cid) {
        $courses[] = "'" . sql_real_escape_string($cid) . "'";
    }
    $where = array('sc_course_id in (' . implode(',', $courses) . ')');
    if ($filters['status'] !== '') {
        $where[] = "sc_status = '" . sql_real_escape_string($filters['status']) . "'";
    }
    if ($filters['memberId'] !== '') {
        $where[] = "sc_mb_id = '" . sql_real_escape_string($filters['memberId']) . "'";
    }
    if ($filters['query'] !== '') {
        $q = sql_real_escape_string(addcslashes($filters['query'], '%_\\'));
        $where[] = "( sc_contract_code like '%{$q}%' or sc_mb_id like '%{$q}%' or sc_company_name like '%{$q}%'
                      or sc_representative_name like '%{$q}%' or sc_signer_name like '%{$q}%' or sc_signer_email like '%{$q}%' )";
    }
    $items = array();
    $result = sql_query(" select * from {$table}
        where " . implode(' and ', $where) . "
        order by sc_updated_at desc, sc_id desc
        limit 5000 ", false);
    while ($result && ($row = sql_fetch_array($result))) {
        $items[] = onoff_crm_contract_service_to_api($row);
    }
    return $items;
}

/* ------------------------------------------------------------------ */
/* Shared read model                                                   */
/* ------------------------------------------------------------------ */

/**
 * @return array{type:string,source:string,id:int,row:array,contract:array}|null
 */
function onoff_crm_contract_load($key, $storage = '')
{
    $parsed = onoff_crm_contract_parse_key($key);
    if ($parsed === null) {
        return null;
    }
    $storage = trim((string) $storage);
    if ($storage !== '' && !in_array($storage, array('platform', 'legacy'), true)) {
        return null;
    }

    $platform = null;
    $legacy = null;
    $service_row = onoff_crm_contract_service_get($parsed['type'], $parsed['id']);
    if ($service_row) {
        $platform = array(
            'type' => $parsed['type'],
            'source' => 'service',
            'id' => $parsed['id'],
            'row' => $service_row,
            'contract' => onoff_crm_contract_service_to_api($service_row),
        );
    }
    if ($parsed['type'] === 'education') {
        // Allow overlap so contractRef/storage=legacy can disambiguate, and so key-only can detect conflicts.
        $edu_row = onoff_crm_contract_education_get($parsed['id'], true);
        if ($edu_row) {
            $legacy = array(
                'type' => 'education',
                'source' => 'enrollment',
                'id' => $parsed['id'],
                'row' => $edu_row,
                'contract' => onoff_crm_contract_education_to_api($edu_row),
            );
        }
    }

    if ($storage === 'platform') {
        return $platform;
    }
    if ($storage === 'legacy') {
        // Explicit legacy: allow even when a platform row also exists (disambiguation),
        // but do not invent a legacy contract from a platform-only pending enrollment.
        if ($legacy && (!$platform || onoff_crm_contract_education_has_legacy_signature($legacy['row']))) {
            return $legacy;
        }
        return null;
    }
    // Platform enrollments stay pending_contract without a legacy signature; that is not ambiguous.
    // Ambiguity only when a true legacy-signed enrollment coexists with a platform row for the same key.
    if ($platform && $legacy && onoff_crm_contract_education_has_legacy_signature($legacy['row'])) {
        return array('ambiguous' => true, 'candidates' => array($platform, $legacy));
    }
    if ($platform) {
        return $platform;
    }
    return $legacy;
}

function onoff_crm_contract_is_enrollment_source(array $loaded)
{
    return ($loaded['source'] ?? '') === 'enrollment';
}

/**
 * Resolve a contract by contractRef, or by key (+ optional storage).
 *
 * @param array{contractRef?:string,contract_ref?:string,contractKey?:string,contract_key?:string,storage?:string} $params
 * @return array{ok:true,loaded:array}|array{ok:false,response:array}
 */
function onoff_crm_contract_resolve(array $params)
{
    $ref = $params['contractRef'] ?? ($params['contract_ref'] ?? '');
    if (is_string($ref) && $ref !== '') {
        $parsed = onoff_crm_contract_parse_ref($ref);
        if ($parsed === null) {
            return array('ok' => false, 'response' => onoff_crm_contract_error_response(400, 'invalid_contract_ref', 'contractRef 형식이 올바르지 않습니다.'));
        }
        if ($parsed['storage'] === 'legacy' && $parsed['type'] !== 'education') {
            return array('ok' => false, 'response' => onoff_crm_contract_error_response(400, 'invalid_storage', 'legacy 저장소는 교육 계약에만 사용할 수 있습니다.'));
        }
        $loaded = onoff_crm_contract_load(onoff_crm_contract_make_key($parsed['type'], $parsed['id']), $parsed['storage']);
        if ($loaded === null || !empty($loaded['ambiguous'])) {
            return array('ok' => false, 'response' => onoff_crm_contract_error_response(404, 'not_found', '계약을 찾을 수 없습니다.'));
        }
        return array('ok' => true, 'loaded' => $loaded);
    }

    $key = $params['contractKey'] ?? ($params['contract_key'] ?? null);
    $storage = isset($params['storage']) ? trim((string) $params['storage']) : '';
    if ($storage !== '' && !in_array($storage, array('platform', 'legacy'), true)) {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(400, 'invalid_storage', 'storage 값이 올바르지 않습니다.'));
    }
    if (onoff_crm_contract_parse_key($key) === null) {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(400, 'invalid_contract_key', 'contractKey 형식이 올바르지 않습니다.'));
    }
    if ($storage === 'legacy') {
        $parsed = onoff_crm_contract_parse_key($key);
        if ($parsed['type'] !== 'education') {
            return array('ok' => false, 'response' => onoff_crm_contract_error_response(400, 'invalid_storage', 'legacy 저장소는 교육 계약에만 사용할 수 있습니다.'));
        }
    }
    $loaded = onoff_crm_contract_load($key, $storage);
    if (is_array($loaded) && !empty($loaded['ambiguous'])) {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(409, 'CONTRACT_REFERENCE_AMBIGUOUS', '동일 key에 platform/legacy 계약이 함께 있습니다. contractRef 또는 storage로 지정해 주세요.'));
    }
    if ($loaded === null) {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(404, 'not_found', '계약을 찾을 수 없습니다.'));
    }
    return array('ok' => true, 'loaded' => $loaded);
}

function onoff_crm_contract_allowed_actions($type, $status, ?array $loaded = null)
{
    switch ($status) {
        case 'pending':
        case 'in_progress':
            $actions = array('edit', 'update_draft', 'cancel');
            break;
        case 'review_pending':
            $actions = array('request_revision', 'approve', 'reject', 'cancel');
            break;
        case 'rejected':
            $actions = array('cancel');
            break;
        default:
            $actions = array();
            break;
    }
    if ($loaded !== null) {
        $contract = isset($loaded['contract']) && is_array($loaded['contract']) ? $loaded['contract'] : array();
        $is_legacy = onoff_crm_contract_is_enrollment_source($loaded);
        if (!$is_legacy) {
            $actions[] = 'view_document';
            if (!empty($contract['signatureUrl'])) {
                $actions[] = 'view_signature';
            }
        } elseif (!empty($contract['signatureUrl'])) {
            $actions[] = 'view_signature';
        }
    }
    return array_values(array_unique($actions));
}

function onoff_crm_contract_list(array $params)
{
    $types = onoff_crm_contract_types();
    $type = trim((string) ($params['contract_type'] ?? ''));
    $status = trim((string) ($params['status'] ?? ''));
    if ($type !== '' && !isset($types[$type])) {
        return array('error' => array('invalid_filter', 'contract_type 값이 올바르지 않습니다.'));
    }
    if ($status !== '' && !in_array($status, onoff_crm_contract_statuses(), true)) {
        return array('error' => array('invalid_filter', 'status 값이 올바르지 않습니다.'));
    }
    $query = trim(strip_tags((string) ($params['query'] ?? '')));
    $query = function_exists('mb_substr') ? mb_substr($query, 0, 100, 'UTF-8') : substr($query, 0, 100);
    $filters = array(
        'status' => $status,
        'query' => $query,
        'memberId' => preg_replace('/[^a-z0-9_@\.\-]/i', '', (string) ($params['member_id'] ?? '')),
    );
    $page = max(1, (int) ($params['page'] ?? 1));
    $page_size = (int) ($params['page_size'] ?? 20);
    $page_size = $page_size < 1 ? 20 : min(100, $page_size);

    $items = array();
    foreach (array_keys($types) as $t) {
        if ($type !== '' && $type !== $t) {
            continue;
        }
        $chunk = onoff_crm_contract_service_list($t, $filters);
        if ($t === 'education') {
            $chunk = array_merge($chunk, onoff_crm_contract_education_list($filters));
        }
        foreach ($chunk as $item) {
            if ($status !== '' && $item['status'] !== $status) {
                continue;
            }
            $items[] = $item;
        }
    }
    usort($items, function ($a, $b) {
        $cmp = strcmp((string) $b['updatedAt'], (string) $a['updatedAt']);
        return $cmp !== 0 ? $cmp : strcmp($a['contractKey'], $b['contractKey']);
    });
    $total = count($items);
    return array(
        'items' => array_values(array_slice($items, ($page - 1) * $page_size, $page_size)),
        'total' => $total,
        'page' => $page,
        'pageSize' => $page_size,
        'totalPages' => (int) ceil($total / $page_size),
    );
}

function onoff_crm_contract_detail($key, $storage = '')
{
    $resolved = onoff_crm_contract_resolve(array('contract_key' => $key, 'storage' => $storage));
    if (!$resolved['ok']) {
        return null;
    }
    $loaded = $resolved['loaded'];
    $row = $loaded['row'];
    $contract = $loaded['contract'];
    $detail = array(
        'contract' => $contract,
        'allowedActions' => onoff_crm_contract_allowed_actions($loaded['type'], $contract['status'], $loaded),
        'auditLogs' => onoff_crm_contract_audit_list($contract['contractKey']),
    );
    if (onoff_crm_contract_is_enrollment_source($loaded)) {
        $agreements = onoff_education_decode_agreements($row['contract_agreements'] ?? '');
        $detail['form'] = array(
            'partyName' => (string) ($row['contract_party_name'] ?? ''),
            'partyPhone' => (string) ($row['contract_party_phone'] ?? ''),
            'partyEmail' => (string) ($row['contract_party_email'] ?? ''),
            'agreements' => array(
                'readAll' => !empty($agreements['readAll']),
                'personalUse' => !empty($agreements['personalUse']),
                'noRedistribute' => !empty($agreements['noRedistribute']),
                'electronic' => !empty($agreements['electronic']),
            ),
        );
        $detail['contractVersion'] = onoff_crm_contract_nullable($row['contract_version'] ?? '');
        $detail['rejectReason'] = onoff_crm_contract_nullable($row['contract_review_reason'] ?? '');
        $detail['reviewedBy'] = onoff_crm_contract_nullable($row['contract_reviewed_by'] ?? '');
        $detail['reviewedAt'] = onoff_crm_contract_nullable_datetime($row['contract_reviewed_at'] ?? '');
        $detail['enrollment'] = array(
            'enrollmentId' => (int) $row['en_id'],
            'courseId' => (string) $row['course_id'],
            'status' => (string) $row['status'],
            'applicantName' => (string) ($row['applicant_name'] ?? ''),
        );
        $detail['statusLogs'] = array();
        $detail['addenda'] = array();
        return $detail;
    }
    $sc_id = (int) $row['sc_id'];
    $form = onoff_service_contract_form_from_row($row);
    unset($form['step']);
    $detail['form'] = $form;
    $detail['contractVersion'] = onoff_crm_contract_nullable($row['sc_contract_version'] ?? '');
    $detail['rejectReason'] = onoff_crm_contract_nullable($row['sc_reject_reason'] ?? '');
    $detail['reviewedBy'] = onoff_crm_contract_nullable($row['sc_reviewed_by'] ?? '');
    $detail['reviewedAt'] = onoff_crm_contract_nullable_datetime($row['sc_reviewed_at'] ?? '');
    $detail['enrollment'] = array('enrollmentId' => (int) ($row['sc_en_id'] ?? 0));
    $detail['addenda'] = onoff_service_contract_addendum_list($sc_id, true);
    $status_logs = array();
    $status_table = onoff_service_contract_status_log_table();
    $result = sql_query(" select * from {$status_table} where sc_id = '{$sc_id}' order by scsl_id desc limit 200 ", false);
    while ($result && ($l = sql_fetch_array($result))) {
        $status_logs[] = array(
            'oldStatus' => (string) $l['scsl_old_status'],
            'newStatus' => (string) $l['scsl_new_status'],
            'actorType' => (string) $l['actor_type'],
            'actorId' => (string) $l['admin_mb_id'],
            'reason' => (string) $l['scsl_reason'],
            'createdAt' => (string) $l['scsl_created_at'],
        );
    }
    $detail['statusLogs'] = $status_logs;
    return $detail;
}

/* ------------------------------------------------------------------ */
/* Audit log                                                           */
/* ------------------------------------------------------------------ */

function onoff_crm_contract_audit_table()
{
    return onoff_service_contract_table_prefix() . 'onoff_crm_contract_audit_logs';
}

function onoff_crm_contract_audit_ensure_table()
{
    static $done = false;
    if ($done) {
        return true;
    }
    $table = onoff_crm_contract_audit_table();
    sql_query("CREATE TABLE IF NOT EXISTS `{$table}` (
  `cal_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contract_key` varchar(64) NOT NULL DEFAULT '',
  `contract_type` varchar(30) NOT NULL DEFAULT '',
  `source_id` bigint unsigned NOT NULL DEFAULT 0,
  `mb_id` varchar(100) NOT NULL DEFAULT '',
  `action` varchar(30) NOT NULL DEFAULT '',
  `actor_type` varchar(20) NOT NULL DEFAULT 'crm',
  `actor_id` varchar(100) NOT NULL DEFAULT '',
  `result` varchar(20) NOT NULL DEFAULT 'success',
  `error_code` varchar(50) NOT NULL DEFAULT '',
  `old_status` varchar(20) NOT NULL DEFAULT '',
  `new_status` varchar(20) NOT NULL DEFAULT '',
  `reason` varchar(1000) NOT NULL DEFAULT '',
  `changed_fields` varchar(1000) NOT NULL DEFAULT '',
  `idempotency_key` varchar(100) NOT NULL DEFAULT '',
  `detail` text,
  `ip` varchar(45) NOT NULL DEFAULT '',
  `user_agent` varchar(500) NOT NULL DEFAULT '',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`cal_id`),
  KEY `idx_cal_contract` (`contract_key`),
  KEY `idx_cal_idempotency` (`idempotency_key`, `action`),
  KEY `idx_cal_mb_id` (`mb_id`),
  KEY `idx_cal_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4", false);
    $done = true;
    return true;
}

function onoff_crm_contract_audit_write(array $entry)
{
    onoff_crm_contract_audit_ensure_table();
    $table = onoff_crm_contract_audit_table();
    $text = function ($v, $max) {
        return sql_real_escape_string(onoff_service_contract_sanitize_text($v, $max));
    };
    $detail = isset($entry['detail']) && is_array($entry['detail']) ? json_encode($entry['detail'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : '';
    $fields = isset($entry['changed_fields']) && is_array($entry['changed_fields']) ? implode(',', $entry['changed_fields']) : '';
    $sql = " insert into {$table} set
        contract_key = '" . $text($entry['contract_key'] ?? '', 64) . "',
        contract_type = '" . $text($entry['contract_type'] ?? '', 30) . "',
        source_id = '" . (int) ($entry['source_id'] ?? 0) . "',
        mb_id = '" . $text($entry['mb_id'] ?? '', 100) . "',
        action = '" . $text($entry['action'] ?? '', 30) . "',
        actor_type = 'crm',
        actor_id = '" . $text($entry['actor_id'] ?? '', 100) . "',
        result = '" . $text($entry['result'] ?? 'success', 20) . "',
        error_code = '" . $text($entry['error_code'] ?? '', 50) . "',
        old_status = '" . $text($entry['old_status'] ?? '', 20) . "',
        new_status = '" . $text($entry['new_status'] ?? '', 20) . "',
        reason = '" . $text($entry['reason'] ?? '', 1000) . "',
        changed_fields = '" . $text($fields, 1000) . "',
        idempotency_key = '" . sql_real_escape_string((string) ($entry['idempotency_key'] ?? '')) . "',
        detail = '" . sql_real_escape_string((string) $detail) . "',
        ip = '" . sql_real_escape_string(onoff_service_contract_client_ip()) . "',
        user_agent = '" . sql_real_escape_string(onoff_service_contract_user_agent()) . "',
        created_at = '" . sql_real_escape_string(onoff_crm_contract_now()) . "' ";
    return (bool) sql_query($sql, false);
}

function onoff_crm_contract_audit_list($key, $limit = 100)
{
    onoff_crm_contract_audit_ensure_table();
    $table = onoff_crm_contract_audit_table();
    $limit = max(1, min(500, (int) $limit));
    $logs = array();
    $result = sql_query(" select * from {$table}
        where contract_key = '" . sql_real_escape_string((string) $key) . "'
        order by cal_id desc
        limit {$limit} ", false);
    while ($result && ($l = sql_fetch_array($result))) {
        $logs[] = array(
            'action' => (string) $l['action'],
            'actorType' => (string) $l['actor_type'],
            'actorId' => (string) $l['actor_id'],
            'result' => (string) $l['result'],
            'errorCode' => onoff_crm_contract_nullable($l['error_code']),
            'oldStatus' => onoff_crm_contract_nullable($l['old_status']),
            'newStatus' => onoff_crm_contract_nullable($l['new_status']),
            'reason' => onoff_crm_contract_nullable($l['reason']),
            'changedFields' => $l['changed_fields'] !== '' ? explode(',', (string) $l['changed_fields']) : array(),
            'createdAt' => (string) $l['created_at'],
        );
    }
    return $logs;
}

/* ------------------------------------------------------------------ */
/* Mutations                                                           */
/* ------------------------------------------------------------------ */

function onoff_crm_contract_editable_fields($source)
{
    if ($source === 'enrollment') {
        return array('partyName', 'partyPhone', 'partyEmail');
    }
    return array(
        'companyName', 'representativeName', 'businessNumber', 'companyAddress', 'companyPhone',
        'signerName', 'signerPosition', 'signerPhone', 'signerEmail',
        'serviceScope', 'amount', 'startDate', 'endDate', 'negotiatedTerms', 'specialClauses',
    );
}

function onoff_crm_contract_fail($status, $code, $message)
{
    return array('ok' => false, 'status' => (int) $status, 'code' => (string) $code, 'message' => (string) $message);
}

function onoff_crm_contract_state_error($status, $action)
{
    if ($status === 'signed') {
        return onoff_crm_contract_fail(409, 'contract_signed', '체결된 계약은 수정할 수 없습니다. 변경은 새 계약 또는 특약으로 진행하세요.');
    }
    if ($status === 'review_pending' && $action === 'update_draft') {
        return onoff_crm_contract_fail(409, 'review_pending_locked', '승인 대기 계약은 직접 수정할 수 없습니다. 수정 요청 또는 반려를 사용하세요.');
    }
    return onoff_crm_contract_fail(409, 'invalid_state', '현재 계약 상태에서는 이 작업을 할 수 없습니다.');
}

/**
 * @return array{ok:bool,status:int,code?:string,message:string,contract?:array,changedFields?:array,detail?:array}
 */
function onoff_crm_contract_perform(array $loaded, $action, array $payload, $reason, $actor_id)
{
    $type = $loaded['type'];
    $legacy = onoff_crm_contract_is_enrollment_source($loaded);
    $row = $loaded['row'];
    $status = $loaded['contract']['status'];
    $reason = trim((string) $reason);

    if ($action === 'approve' && $status === 'signed') {
        return array('ok' => true, 'status' => 200, 'message' => '이미 승인된 계약입니다.', 'row' => $row, 'alreadyApproved' => true);
    }
    if (in_array($action, array('request_revision', 'reject'), true) && $reason === '') {
        return onoff_crm_contract_fail(422, 'reason_required', '사유(reason)를 입력해 주세요.');
    }
    if (!in_array($action, onoff_crm_contract_allowed_actions($type, $status), true)) {
        return onoff_crm_contract_state_error($status, $action);
    }

    if ($action === 'update_draft') {
        if (empty($payload)) {
            return onoff_crm_contract_fail(422, 'invalid_payload', '수정할 항목(payload)이 없습니다.');
        }
        $allowed = onoff_crm_contract_editable_fields($legacy ? 'enrollment' : 'service');
        $unknown = array_values(array_diff(array_keys($payload), $allowed));
        if (!empty($unknown)) {
            return onoff_crm_contract_fail(422, 'invalid_payload', '수정할 수 없는 항목이 포함되어 있습니다: ' . implode(', ', array_map('strval', $unknown)));
        }
        foreach ($payload as $field => $value) {
            if (!is_scalar($value) && $value !== null) {
                return onoff_crm_contract_fail(422, 'invalid_payload', '항목 값은 문자열 또는 숫자여야 합니다: ' . $field);
            }
        }
        $changed = array_keys($payload);
        if ($legacy) {
            $agreements = onoff_education_decode_agreements($row['contract_agreements'] ?? '');
            $form = array(
                'partyName' => (string) ($row['contract_party_name'] ?? ''),
                'partyPhone' => (string) ($row['contract_party_phone'] ?? ''),
                'partyEmail' => (string) ($row['contract_party_email'] ?? ''),
                'agreements' => $agreements,
            );
            foreach ($payload as $field => $value) {
                $form[$field] = (string) $value;
            }
            if (!onoff_education_save_contract_draft((int) $row['en_id'], $form)) {
                return onoff_crm_contract_fail(500, 'update_failed', '계약 수정에 실패했습니다.');
            }
            $fresh = onoff_crm_contract_education_get((int) $row['en_id']);
            return array('ok' => true, 'status' => 200, 'message' => '계약 초안을 수정했습니다.', 'row' => $fresh, 'changedFields' => $changed);
        }
        $form = onoff_service_contract_form_from_row($row);
        foreach ($payload as $field => $value) {
            $form[$field] = (string) $value;
        }
        $saved = onoff_service_contract_save_draft_row($row, $form);
        if (empty($saved['ok'])) {
            return onoff_crm_contract_fail(409, 'invalid_state', (string) ($saved['message'] ?? '계약 수정에 실패했습니다.'));
        }
        return array('ok' => true, 'status' => 200, 'message' => '계약 초안을 수정했습니다.', 'row' => $saved['contract'], 'changedFields' => $changed);
    }

    if ($action === 'cancel' && $legacy) {
        $ok = onoff_education_update_enrollment((int) $row['en_id'], array(
            'status' => 'cancelled',
            'deposit_amount' => (int) ($row['deposit_amount'] ?? 0),
            'depositor_name' => (string) ($row['depositor_name'] ?? ''),
            'admin_memo' => (string) ($row['admin_memo'] ?? ''),
            'starts_at' => (string) ($row['starts_at'] ?? ''),
            'ends_at' => (string) ($row['ends_at'] ?? ''),
        ));
        if (!$ok) {
            return onoff_crm_contract_fail(500, 'update_failed', '계약 취소에 실패했습니다.');
        }
        return array('ok' => true, 'status' => 200, 'message' => '계약이 취소되었습니다.', 'row' => onoff_crm_contract_education_get((int) $row['en_id']));
    }

    $transition = array(
        'request_revision' => 'requestRevision',
        'approve' => 'approve',
        'reject' => 'reject',
        'cancel' => 'cancel',
    );
    $detail = in_array($action, array('request_revision', 'reject'), true) ? onoff_crm_contract_superseded_detail($legacy, $row) : array();
    if ($legacy) {
        $result = onoff_education_contract_review_transition((int) $row['en_id'], $transition[$action], $reason, $actor_id);
        $fresh = !empty($result['ok']) ? onoff_crm_contract_education_get((int) $row['en_id']) : null;
    } else {
        $result = onoff_service_contract_admin_transition((int) $row['sc_id'], $transition[$action], $reason, $actor_id, 'crm');
        $fresh = !empty($result['ok']) ? $result['contract'] : null;
    }
    if (empty($result['ok'])) {
        $code = $action === 'approve' ? 'approve_failed' : 'transition_failed';
        $fail = onoff_crm_contract_fail(409, $code, (string) ($result['message'] ?? '상태 변경에 실패했습니다.'));
        $fail['rolledBack'] = !empty($result['rolledBack']);
        return $fail;
    }
    return array(
        'ok' => true,
        'status' => 200,
        'message' => (string) ($result['message'] ?? ''),
        'row' => $fresh,
        'detail' => $detail,
        'alreadyApproved' => !empty($result['alreadyApproved']),
    );
}

function onoff_crm_contract_file_fingerprint($rel)
{
    $rel = (string) $rel;
    $path = onoff_crm_contract_safe_data_file($rel);
    return array('path' => $rel !== '' ? $rel : null, 'sha256' => $path !== null ? hash_file('sha256', $path) : null);
}

/** Pointers to the submitted signature / document that a revision or rejection detaches, kept for the audit trail. */
function onoff_crm_contract_superseded_detail($legacy, array $row)
{
    if ($legacy) {
        $snapshot = (string) ($row['contract_snapshot'] ?? '');
        return array(
            'signature' => onoff_crm_contract_file_fingerprint($row['contract_signature_path'] ?? ''),
            'signedAt' => onoff_crm_contract_nullable_datetime($row['contract_signed_at'] ?? ''),
            'snapshotSha256' => $snapshot !== '' ? hash('sha256', $snapshot) : null,
        );
    }
    $snapshot = (string) ($row['sc_contract_snapshot'] ?? '');
    $pdf = onoff_crm_contract_file_fingerprint($row['sc_contract_pdf_path'] ?? '');
    $pdf['recordedHash'] = onoff_crm_contract_nullable($row['sc_contract_file_hash'] ?? '');
    return array(
        'signature' => onoff_crm_contract_file_fingerprint($row['sc_signature_file_path'] ?? ''),
        'pdf' => $pdf,
        'signedAt' => onoff_crm_contract_nullable_datetime($row['sc_signed_at'] ?? ''),
        'snapshotSha256' => $snapshot !== '' ? hash('sha256', $snapshot) : null,
    );
}

function onoff_crm_contract_row_to_api(array $loaded, $row)
{
    if (!$row) {
        return null;
    }
    return onoff_crm_contract_is_enrollment_source($loaded) ? onoff_crm_contract_education_to_api($row) : onoff_crm_contract_service_to_api($row);
}

/**
 * @return array{status:int,body:array}
 */
function onoff_crm_contract_mutate(array $body, $actor_id)
{
    $actions = array('update_draft', 'request_revision', 'approve', 'reject', 'cancel');
    $action = isset($body['action']) && is_string($body['action']) ? $body['action'] : '';
    if (!in_array($action, $actions, true)) {
        return onoff_crm_contract_error_response(400, 'invalid_action', 'action 값이 올바르지 않습니다.');
    }
    $key = isset($body['contractKey']) ? $body['contractKey'] : null;
    $resolve_params = array(
        'contractRef' => $body['contractRef'] ?? ($body['contract_ref'] ?? ''),
        'contractKey' => $key,
        'storage' => $body['storage'] ?? '',
    );
    $resolved = onoff_crm_contract_resolve($resolve_params);
    if (!$resolved['ok']) {
        return $resolved['response'];
    }
    $payload = isset($body['payload']) ? $body['payload'] : array();
    if (!is_array($payload)) {
        return onoff_crm_contract_error_response(422, 'invalid_payload', 'payload는 객체여야 합니다.');
    }
    $reason = isset($body['reason']) && is_scalar($body['reason']) ? (string) $body['reason'] : '';
    $idem = $body['idempotencyKey'] ?? ($body['idempotency_key'] ?? '');
    if (!is_string($idem) || ($idem !== '' && !preg_match('/^[A-Za-z0-9_\-:.]{8,100}$/', $idem))) {
        return onoff_crm_contract_error_response(422, 'invalid_idempotency_key', 'idempotencyKey는 8~100자의 영문·숫자·_-:. 조합이어야 합니다.');
    }

    $loaded = $resolved['loaded'];
    $before = $loaded['contract'];

    if ($idem !== '' && $action === 'approve') {
        $prior = onoff_crm_contract_idempotent_approval($idem);
        if ($prior !== null) {
            if ($prior['contract_key'] !== $before['contractKey']) {
                return onoff_crm_contract_error_response(409, 'idempotency_conflict', '다른 계약에 이미 사용된 idempotencyKey입니다.');
            }
            return array('status' => 200, 'body' => array('ok' => true, 'data' => array(
                'message' => '이미 처리된 승인 요청입니다.',
                'contract' => $before,
                'allowedActions' => onoff_crm_contract_allowed_actions($loaded['type'], $before['status'], $loaded),
                'alreadyApproved' => true,
                'idempotentReplay' => true,
            )));
        }
    }

    $result = onoff_crm_contract_perform($loaded, $action, $payload, $reason, $actor_id);

    $after = !empty($result['ok']) ? onoff_crm_contract_row_to_api($loaded, $result['row'] ?? null) : null;
    $outcome = 'success';
    if (empty($result['ok'])) {
        $outcome = !empty($result['rolledBack']) ? 'failed' : 'denied';
    } elseif (!empty($result['alreadyApproved'])) {
        $outcome = 'noop';
    }
    onoff_crm_contract_audit_write(array(
        'idempotency_key' => $idem,
        'contract_key' => $before['contractKey'],
        'contract_type' => $loaded['type'],
        'source_id' => $before['sourceId'],
        'mb_id' => $before['memberId'],
        'action' => $action,
        'actor_id' => $actor_id,
        'result' => $outcome,
        'error_code' => !empty($result['ok']) ? '' : $result['code'],
        'old_status' => $before['status'],
        'new_status' => $after ? $after['status'] : $before['status'],
        'reason' => $reason,
        'changed_fields' => $result['changedFields'] ?? array(),
        'detail' => $result['detail'] ?? array(),
    ));

    if (empty($result['ok'])) {
        return onoff_crm_contract_error_response($result['status'], $result['code'], $result['message']);
    }
    if ($after === null) {
        $reloaded = onoff_crm_contract_load($before['contractKey'], (string) ($before['storage'] ?? ''));
        $after = ($reloaded && empty($reloaded['ambiguous'])) ? $reloaded['contract'] : $before;
        if ($reloaded && empty($reloaded['ambiguous'])) {
            $loaded = $reloaded;
        }
    }
    return array('status' => 200, 'body' => array('ok' => true, 'data' => array(
        'message' => $result['message'],
        'contract' => $after,
        'allowedActions' => onoff_crm_contract_allowed_actions($loaded['type'], $after['status'], $loaded),
        'alreadyApproved' => !empty($result['alreadyApproved']),
    )));
}

/** A successful (or no-op) approve previously recorded under this idempotency key, if any. */
function onoff_crm_contract_idempotent_approval($idem)
{
    onoff_crm_contract_audit_ensure_table();
    $table = onoff_crm_contract_audit_table();
    $row = sql_fetch(" select contract_key from {$table}
        where idempotency_key = '" . sql_real_escape_string((string) $idem) . "'
          and action = 'approve'
          and result in ('success', 'noop')
        order by cal_id
        limit 1 ", false);
    return $row ?: null;
}

/* ------------------------------------------------------------------ */
/* Files                                                               */
/* ------------------------------------------------------------------ */

function onoff_crm_contract_safe_data_file($rel)
{
    $rel = ltrim(str_replace('\\', '/', (string) $rel), '/');
    if ($rel === '' || strpos($rel, '..') !== false || !defined('G5_DATA_PATH')) {
        return null;
    }
    $root = realpath(G5_DATA_PATH);
    $real = realpath(G5_DATA_PATH . '/' . $rel);
    if ($root === false || $real === false || strpos($real, $root . DIRECTORY_SEPARATOR) !== 0 || !is_file($real)) {
        return null;
    }
    return $real;
}

/**
 * @return array{status:int,body?:array,file?:array,html?:string}
 */
function onoff_crm_contract_file($action, array $params)
{
    $resolved = onoff_crm_contract_resolve($params);
    if (!$resolved['ok']) {
        return $resolved['response'];
    }
    $loaded = $resolved['loaded'];
    $row = $loaded['row'];
    $is_education = onoff_crm_contract_is_enrollment_source($loaded);

    if ($action === 'document') {
        if ($is_education) {
            return onoff_crm_contract_error_response(404, 'not_found', '교육 계약은 별도 계약서 문서가 없습니다.');
        }
        return array('status' => 200, 'html' => onoff_service_contract_document_html($row));
    }

    if ($action === 'signature') {
        $rel = $is_education ? ($row['contract_signature_path'] ?? '') : ($row['sc_signature_file_path'] ?? '');
        $path = onoff_crm_contract_safe_data_file($rel);
        if ($path === null) {
            return onoff_crm_contract_error_response(404, 'not_found', '서명 파일이 없습니다.');
        }
        return array('status' => 200, 'file' => array('path' => $path, 'mime' => 'image/png', 'name' => 'signature.png', 'disposition' => 'inline'));
    }

    if ($is_education) {
        return onoff_crm_contract_error_response(404, 'not_found', '교육 계약은 PDF 계약서가 없습니다.');
    }
    $path = onoff_crm_contract_safe_data_file($row['sc_contract_pdf_path'] ?? '');
    if ($path === null) {
        return onoff_crm_contract_error_response(404, 'not_found', 'PDF 계약서가 없습니다.');
    }
    $code = preg_replace('/[^a-zA-Z0-9_\-]/', '_', (string) ($row['sc_contract_code'] ?? 'contract'));
    return array('status' => 200, 'file' => array('path' => $path, 'mime' => 'application/pdf', 'name' => 'SVC_CONTRACT_' . $code . '.pdf', 'disposition' => 'attachment'));
}

/* ------------------------------------------------------------------ */
/* Auth + request dispatch                                             */
/* ------------------------------------------------------------------ */

function onoff_crm_contract_error_response($status, $code, $message)
{
    return array('status' => (int) $status, 'body' => array(
        'ok' => false,
        'error' => array('code' => (string) $code, 'message' => (string) $message),
    ));
}

function onoff_crm_contract_request_token(array $headers)
{
    $auth = isset($headers['authorization']) ? (string) $headers['authorization'] : '';
    if ($auth !== '' && preg_match('/^\s*Bearer\s+(\S+)\s*$/i', $auth, $m)) {
        return (string) $m[1];
    }
    // Cafe24 strips Authorization, so the custom header is the primary transport in production.
    if (!empty($headers['x-onoff-contract-token'])) {
        return trim((string) $headers['x-onoff-contract-token']);
    }
    return '';
}

/**
 * @param array{write:string,read:string} $tokens
 * @return array{ok:bool,scope?:string,response?:array}
 */
function onoff_crm_contract_authenticate(array $headers, array $tokens, $needs_write)
{
    $write = (string) ($tokens['write'] ?? '');
    $read = (string) ($tokens['read'] ?? '');
    if ($write === '' && $read === '') {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(503, 'not_configured', 'CRM 계약 API가 설정되지 않았습니다.'));
    }
    if (!empty($headers['origin'])) {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(403, 'browser_not_allowed', '서버 간 호출만 허용됩니다.'));
    }
    $token = onoff_crm_contract_request_token($headers);
    if ($token === '') {
        return array('ok' => false, 'response' => onoff_crm_contract_error_response(401, 'unauthorized', '인증이 필요합니다.'));
    }
    if ($write !== '' && hash_equals($write, $token)) {
        return array('ok' => true, 'scope' => 'write');
    }
    if ($read !== '' && hash_equals($read, $token)) {
        if ($needs_write) {
            return array('ok' => false, 'response' => onoff_crm_contract_error_response(403, 'forbidden', '쓰기 권한이 없습니다.'));
        }
        return array('ok' => true, 'scope' => 'read');
    }
    return array('ok' => false, 'response' => onoff_crm_contract_error_response(401, 'unauthorized', '인증이 필요합니다.'));
}

function onoff_crm_contract_actor_id(array $headers)
{
    $actor = isset($headers['x-onoff-crm-actor']) ? (string) $headers['x-onoff-crm-actor'] : '';
    $actor = substr(preg_replace('/[^a-z0-9_@\.\-]/i', '', $actor), 0, 50);
    return $actor !== '' ? $actor : 'crm';
}

/**
 * @param array{method:string,query:array,headers:array,body:string} $request headers keyed in lowercase
 * @param array{write:string,read:string} $tokens
 * @return array{status:int,body?:array,file?:array,html?:string}
 */
function onoff_crm_contract_handle(array $request, array $tokens)
{
    try {
        $method = strtoupper((string) ($request['method'] ?? 'GET'));
        $query = isset($request['query']) && is_array($request['query']) ? $request['query'] : array();
        $headers = isset($request['headers']) && is_array($request['headers']) ? $request['headers'] : array();

        if ($method !== 'GET' && $method !== 'POST') {
            return onoff_crm_contract_error_response(405, 'method_not_allowed', '지원하지 않는 메서드입니다.');
        }
        $auth = onoff_crm_contract_authenticate($headers, $tokens, $method === 'POST');
        if (!$auth['ok']) {
            return $auth['response'];
        }

        onoff_service_contract_ensure_tables();
        onoff_education_ensure_table();
        onoff_crm_contract_audit_ensure_table();

        if ($method === 'GET') {
            $action = isset($query['action']) && is_string($query['action']) ? $query['action'] : 'list';
            if ($action === 'list') {
                $list = onoff_crm_contract_list($query);
                if (isset($list['error'])) {
                    return onoff_crm_contract_error_response(400, $list['error'][0], $list['error'][1]);
                }
                return array('status' => 200, 'body' => array('ok' => true, 'data' => $list));
            }
            $resolve_params = array(
                'contract_key' => isset($query['contract_key']) ? $query['contract_key'] : null,
                'contractRef' => isset($query['contract_ref']) ? $query['contract_ref'] : (isset($query['contractRef']) ? $query['contractRef'] : ''),
                'storage' => isset($query['storage']) ? $query['storage'] : '',
            );
            if ($action === 'detail') {
                $resolved = onoff_crm_contract_resolve($resolve_params);
                if (!$resolved['ok']) {
                    return $resolved['response'];
                }
                $detail = onoff_crm_contract_detail(
                    $resolved['loaded']['contract']['contractKey'],
                    (string) ($resolved['loaded']['contract']['storage'] ?? '')
                );
                if ($detail === null) {
                    return onoff_crm_contract_error_response(404, 'not_found', '계약을 찾을 수 없습니다.');
                }
                return array('status' => 200, 'body' => array('ok' => true, 'data' => $detail));
            }
            if (in_array($action, array('document', 'download', 'signature'), true)) {
                return onoff_crm_contract_file($action, $resolve_params);
            }
            return onoff_crm_contract_error_response(400, 'invalid_action', 'action 값이 올바르지 않습니다.');
        }

        $body = json_decode((string) ($request['body'] ?? ''), true);
        if (!is_array($body)) {
            return onoff_crm_contract_error_response(400, 'invalid_json', '요청 본문이 올바른 JSON이 아닙니다.');
        }
        return onoff_crm_contract_mutate($body, onoff_crm_contract_actor_id($headers));
    } catch (Throwable $e) {
        return onoff_crm_contract_error_response(500, 'internal_error', '요청을 처리하지 못했습니다.');
    }
}
