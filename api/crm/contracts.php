<?php
/**
 * ONOFF contracts API for crm.icrm.co.kr (server-to-server only).
 *
 * Auth: X-ONOFF-Contract-Token (or Authorization: Bearer) matching
 *   ONOFF_CRM_CONTRACT_API_TOKEN       read + write
 *   ONOFF_CRM_CONTRACT_API_READ_TOKEN  read only (optional)
 * No CORS headers are sent; browser requests (Origin header) are refused.
 *
 * GET  ?action=list&contract_type=&status=&query=&page=&page_size=
 * GET  ?action=detail&contract_key=education:123
 * GET  ?action=document|download|signature&contract_key=...
 * POST {"action":"update_draft|request_revision|approve|reject|cancel","contractKey":"...","payload":{},"reason":"",
 *       "idempotencyKey":"optional, replays a completed approve instead of re-running it"}
 * Optional header X-ONOFF-CRM-Actor: CRM staff id recorded as reviewer / audit actor.
 */
@ini_set('session.use_cookies', '0');
@ini_set('session.use_only_cookies', '0');
@ini_set('display_errors', '0');

require_once dirname(__DIR__, 2) . '/common.php';
require_once G5_LIB_PATH . '/onoff-crm-contract.lib.php';

$onoff_crm_headers = array();
foreach ($_SERVER as $name => $value) {
    if (strpos($name, 'HTTP_') === 0) {
        $onoff_crm_headers[strtolower(str_replace('_', '-', substr($name, 5)))] = (string) $value;
    }
}
if (!isset($onoff_crm_headers['authorization']) && isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $onoff_crm_headers['authorization'] = (string) $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}

$onoff_crm_response = onoff_crm_contract_handle(
    array(
        'method' => (string) ($_SERVER['REQUEST_METHOD'] ?? 'GET'),
        'query' => $_GET,
        'headers' => $onoff_crm_headers,
        'body' => (string) file_get_contents('php://input'),
    ),
    array(
        'write' => defined('ONOFF_CRM_CONTRACT_API_TOKEN') ? (string) ONOFF_CRM_CONTRACT_API_TOKEN : '',
        'read' => defined('ONOFF_CRM_CONTRACT_API_READ_TOKEN') ? (string) ONOFF_CRM_CONTRACT_API_READ_TOKEN : '',
    )
);

while (ob_get_level() > 0) {
    ob_end_clean();
}
http_response_code((int) $onoff_crm_response['status']);
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

if (isset($onoff_crm_response['file'])) {
    $file = $onoff_crm_response['file'];
    header('Content-Type: ' . $file['mime']);
    header('Content-Length: ' . (string) filesize($file['path']));
    header('Content-Disposition: ' . $file['disposition'] . '; filename="' . str_replace('"', '', $file['name']) . '"');
    readfile($file['path']);
    exit;
}

if (isset($onoff_crm_response['html'])) {
    header('Content-Type: text/html; charset=utf-8');
    header('Content-Security-Policy: sandbox; default-src \'none\'; img-src data:; style-src \'unsafe-inline\'');
    echo $onoff_crm_response['html'];
    exit;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($onoff_crm_response['body'], JSON_UNESCAPED_UNICODE);
exit;
