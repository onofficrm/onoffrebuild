<?php
include_once(dirname(__FILE__) . '/../_init.php');
include_once(dirname(__FILE__) . '/../../lib/website_review.lib.php');

seosys300_require_method('POST');
seosys300_require_login();
seosys300_require_tables();

$input = array_merge(seosys300_json_input(), $_POST);
seosys300_require_csrf($input);

$order_id = isset($input['orderId']) ? (int) $input['orderId'] : 0;
if ($order_id < 1) {
    seosys300_json_error(422, 'validation_error', '주문을 지정해주세요.');
}
$approve = !empty($input['approve']) && $input['approve'] !== 'false';
$message = isset($input['message']) ? (string) $input['message'] : '';

seosys300_json_ok(seosys300_website_customer_review($order_id, seosys300_current_mb_id(), $approve, $message));
