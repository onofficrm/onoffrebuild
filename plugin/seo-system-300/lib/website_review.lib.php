<?php
/**
 * Customer answer to a homepage the team sent for review (customer_review).
 * Approve -> completed. Changes -> revision, with the request kept for staff
 * and on the customer's own timeline. Only the order owner may answer.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_website_customer_review($order_id, $mb_id, $approve, $message = '')
{
    global $g5;
    $oid = (int) $order_id;
    $table = $g5['seosys300_website_orders_table'];
    $row = seosys300_fetch("SELECT id, mb_id, status FROM `{$table}` WHERE id = {$oid} LIMIT 1");
    if (!$row || (string) $row['mb_id'] !== (string) $mb_id) {
        seosys300_json_error(404, 'order_not_found', '홈페이지 주문을 찾을 수 없습니다.');
    }
    if ((string) $row['status'] !== 'customer_review') {
        seosys300_json_error(409, 'invalid_status', '고객 확인 단계에서만 답할 수 있습니다.');
    }

    $message = trim((string) $message);
    if (function_exists('mb_substr')) {
        $message = mb_substr($message, 0, 1000);
    } else {
        $message = substr($message, 0, 1000);
    }

    if ($approve) {
        seosys300_admin_change_order_status($oid, 'completed', '고객 확인 완료');
        seosys300_append_customer_update($oid, '제작 결과를 확인했습니다.' . ($message !== '' ? "\n" . $message : ''), array(), '고객');
    } else {
        if ($message === '') {
            seosys300_json_error(422, 'validation_error', '수정이 필요한 내용을 적어주세요.');
        }
        seosys300_admin_change_order_status($oid, 'revision', '고객 수정 요청');
        seosys300_append_customer_update($oid, "수정을 요청했습니다.\n" . $message, array(), '고객');
        seosys300_append_staff_note($oid, '고객 수정 요청: ' . $message, '고객');
    }

    $fresh = seosys300_fetch("SELECT status, progress FROM `{$table}` WHERE id = {$oid} LIMIT 1");
    return array(
        'id' => $oid,
        'status' => $fresh ? (string) $fresh['status'] : '',
        'progress' => $fresh ? (int) $fresh['progress'] : 0,
    );
}
