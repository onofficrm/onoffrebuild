<?php
/**
 * ONOFF service contracts — CRM / super-admin API.
 *
 * Auth: Bearer ONOFF_CRM_CONTRACT_API_TOKEN or GNUBoard super-admin session.
 */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');

require_once dirname(__DIR__, 2) . '/common.php';
require_once G5_LIB_PATH . '/onoff-service-contract.lib.php';

function onoff_crm_contracts_cors()
{
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? trim((string) $_SERVER['HTTP_ORIGIN']) : '';
    if ($origin === 'https://crm.icrm.co.kr') {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Access-Control-Allow-Credentials: false');
        header('Access-Control-Allow-Headers: Authorization, Content-Type, X-ONOFF-Contract-Token, X-Api-Token');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    }
}

function onoff_crm_contracts_json($payload, $status = 200)
{
    while (ob_get_level() > 0) {
        ob_end_clean();
    }
    onoff_crm_contracts_cors();
    http_response_code((int) $status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function onoff_crm_contracts_ok($data, $status = 200)
{
    onoff_crm_contracts_json(array('ok' => true, 'data' => $data), $status);
}

function onoff_crm_contracts_fail($code, $message, $status)
{
    onoff_crm_contracts_json(array(
        'ok' => false,
        'error' => array(
            'code' => (string) $code,
            'message' => (string) $message,
        ),
    ), $status);
}

function onoff_crm_contracts_read_body()
{
    $raw = file_get_contents('php://input');
    $body = json_decode((string) $raw, true);
    return is_array($body) ? $body : array();
}

function onoff_crm_contracts_bearer_token()
{
    $header = isset($_SERVER['HTTP_AUTHORIZATION']) ? (string) $_SERVER['HTTP_AUTHORIZATION'] : '';
    if ($header === '' && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        $header = (string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    }
    if ($header !== '' && preg_match('/^\s*Bearer\s+(\S+)\s*$/i', $header, $m)) {
        return (string) $m[1];
    }
    // Cafe24 / some proxies strip Authorization — allow explicit fallback header.
    if (!empty($_SERVER['HTTP_X_ONOFF_CONTRACT_TOKEN'])) {
        return trim((string) $_SERVER['HTTP_X_ONOFF_CONTRACT_TOKEN']);
    }
    if (!empty($_SERVER['HTTP_X_API_TOKEN'])) {
        return trim((string) $_SERVER['HTTP_X_API_TOKEN']);
    }
    return null;
}

/**
 * @return array{actor_type:string,actor_mb_id:string}|null
 */
function onoff_crm_contracts_require_auth()
{
    global $is_admin, $member;

    $bearer = onoff_crm_contracts_bearer_token();
    if ($bearer !== null) {
        if (!defined('ONOFF_CRM_CONTRACT_API_TOKEN') || ONOFF_CRM_CONTRACT_API_TOKEN === '') {
            onoff_crm_contracts_fail('not_configured', 'CRM contract API token is not configured.', 503);
        }
        if (!hash_equals((string) ONOFF_CRM_CONTRACT_API_TOKEN, $bearer)) {
            onoff_crm_contracts_fail('unauthorized', 'Invalid API token.', 401);
        }
        return array('actor_type' => 'crm', 'actor_mb_id' => 'crm');
    }

    if (isset($is_admin) && $is_admin === 'super') {
        $mb_id = is_array($member) ? (string) ($member['mb_id'] ?? '') : '';
        if ($mb_id === '') {
            $mb_id = 'admin';
        }
        return array('actor_type' => 'admin', 'actor_mb_id' => $mb_id);
    }

    onoff_crm_contracts_fail('unauthorized', 'Authentication required.', 401);
}

onoff_crm_contracts_cors();

$method = strtoupper((string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'));
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$auth = onoff_crm_contracts_require_auth();
onoff_service_contract_ensure_tables();

$api_base = onoff_service_contract_api_base();

if ($method === 'GET') {
    $sc_id = isset($_GET['scId']) ? (int) $_GET['scId'] : 0;
    if ($sc_id > 0) {
        $detail = onoff_service_contract_admin_detail($sc_id);
        if ($detail === null) {
            onoff_crm_contracts_fail('not_found', 'Contract not found.', 404);
        }
        $contract = is_array($detail['contract']) ? $detail['contract'] : array();
        $id = (int) ($contract['id'] ?? 0);
        if ($id > 0) {
            $contract['urls'] = array(
                'document' => $api_base . '/document.php?sc_id=' . $id,
                'download' => $api_base . '/download.php?sc_id=' . $id,
            );
            $detail['contract'] = $contract;
        }
        onoff_crm_contracts_ok($detail);
    }

    $filters = array(
        'q' => isset($_GET['q']) ? (string) $_GET['q'] : '',
        'status' => isset($_GET['status']) ? (string) $_GET['status'] : '',
        'courseId' => isset($_GET['courseId']) ? (string) $_GET['courseId'] : '',
        'mbId' => isset($_GET['mbId']) ? (string) $_GET['mbId'] : '',
        'page' => isset($_GET['page']) ? (int) $_GET['page'] : 1,
        'limit' => isset($_GET['limit']) ? (int) $_GET['limit'] : 20,
    );
    $list = onoff_service_contract_admin_list($filters);
    if (!empty($list['items']) && is_array($list['items'])) {
        foreach ($list['items'] as $idx => $item) {
            if (!is_array($item)) {
                continue;
            }
            $id = (int) ($item['id'] ?? 0);
            if ($id > 0) {
                $list['items'][$idx]['urls'] = array(
                    'document' => $api_base . '/document.php?sc_id=' . $id,
                    'download' => $api_base . '/download.php?sc_id=' . $id,
                );
            }
        }
    }
    onoff_crm_contracts_ok($list);
}

if ($method === 'POST') {
    $body = onoff_crm_contracts_read_body();
    $action = preg_replace('/[^a-zA-Z_]/', '', (string) ($body['action'] ?? ''));
    $sc_id = isset($body['scId']) ? (int) $body['scId'] : 0;
    $reason = isset($body['reason']) ? (string) $body['reason'] : '';

    if ($action === '') {
        onoff_crm_contracts_fail('bad_request', 'action is required.', 400);
    }

    $transition_actions = array('approve', 'reject', 'cancel', 'expire', 'requireRenewal');
    if (in_array($action, $transition_actions, true)) {
        if ($sc_id < 1) {
            onoff_crm_contracts_fail('bad_request', 'scId is required.', 400);
        }
        if ($action === 'reject' && trim($reason) === '') {
            onoff_crm_contracts_fail('bad_request', 'reason is required for reject.', 400);
        }
        $result = onoff_service_contract_admin_transition(
            $sc_id,
            $action,
            $reason,
            $auth['actor_mb_id'],
            $auth['actor_type']
        );
        if (empty($result['ok'])) {
            onoff_crm_contracts_fail('transition_failed', (string) ($result['message'] ?? 'Transition failed.'), 400);
        }
        onoff_crm_contracts_ok(array(
            'message' => (string) ($result['message'] ?? ''),
            'contract' => onoff_service_contract_to_api($result['contract'] ?? null),
        ));
    }

    if ($action === 'add_addendum') {
        if ($sc_id < 1) {
            onoff_crm_contracts_fail('bad_request', 'scId is required.', 400);
        }
        $title = isset($body['title']) ? (string) $body['title'] : '';
        $addendum_body = isset($body['body']) ? (string) $body['body'] : '';
        $added = onoff_service_contract_addendum_add(
            $sc_id,
            $title,
            $addendum_body,
            $auth['actor_type'] === 'crm' ? 'admin' : 'admin',
            $auth['actor_mb_id']
        );
        if (empty($added['ok'])) {
            onoff_crm_contracts_fail('addendum_failed', (string) ($added['message'] ?? 'Failed to add addendum.'), 400);
        }
        onoff_crm_contracts_ok(array(
            'message' => (string) ($added['message'] ?? ''),
            'addendumId' => (int) ($added['id'] ?? 0),
        ));
    }

    if ($action === 'void_addendum') {
        $sca_id = isset($body['scaId']) ? (int) $body['scaId'] : (isset($body['addendumId']) ? (int) $body['addendumId'] : 0);
        if ($sca_id < 1) {
            onoff_crm_contracts_fail('bad_request', 'scaId is required.', 400);
        }
        $voided = onoff_service_contract_addendum_void($sca_id, $reason, $auth['actor_mb_id']);
        if (!$voided) {
            onoff_crm_contracts_fail('void_failed', 'Failed to void addendum.', 400);
        }
        onoff_crm_contracts_ok(array('message' => 'Addendum voided.', 'addendumId' => $sca_id));
    }

    onoff_crm_contracts_fail('bad_request', 'Unsupported action.', 400);
}

onoff_crm_contracts_fail('method_not_allowed', 'Method not allowed.', 405);
