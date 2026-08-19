<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

/**
 * Internal hook for future Email / SMS / Kakao. No delivery in this phase.
 *
 * @param string $event
 * @param array  $payload
 */
function seosys300_notify_order_event($event, $payload = array())
{
    unset($event, $payload);
    return true;
}
