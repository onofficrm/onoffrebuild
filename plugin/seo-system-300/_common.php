<?php
// Keep the platform's local GNUBoard session separate from the shared Core
// PHPSESSID. Using the same cookie name creates two PHPSESSID values on
// onoff.icrm.co.kr and makes Core authentication depend on browser cookie order.
if (session_status() === PHP_SESSION_NONE) {
    if (!defined('G5_SESSION_NAME')) {
        define('G5_SESSION_NAME', 'SEOSYS300PHPSESSID');
    }
    @session_name(G5_SESSION_NAME);
}
include_once(dirname(__FILE__) . '/../../common.php');
include_once(dirname(__FILE__) . '/../../lib/edu-platform.php');
include_once(dirname(__FILE__) . '/../../lib/onoff-education.lib.php');

$ticketMemberId = function_exists('get_session') ? (string) get_session('seosys300_ticket_mb_id') : '';
$ticketUntil = function_exists('get_session') ? (int) get_session('seosys300_ticket_until') : 0;
$ticketEnrollment = null;
if (
    $ticketMemberId !== ''
    && $ticketUntil >= time()
) {
    $ticketEnrollment = onoff_education_get_active_enrollment($ticketMemberId, 'any');
    if ($ticketEnrollment) {
        $ticketMember = function_exists('get_member') ? get_member($ticketMemberId) : null;
        if (!is_array($ticketMember) || empty($ticketMember['mb_id'])) {
            $ticketName = (string) ($ticketEnrollment['applicant_name'] ?? $ticketMemberId);
            $ticketMember = array(
                'mb_id' => $ticketMemberId,
                'mb_name' => $ticketName,
                'mb_nick' => $ticketName,
                'mb_email' => (string) ($ticketEnrollment['email'] ?? ''),
                'mb_level' => 2,
                'mb_leave_date' => '',
                'mb_intercept_date' => '',
            );
        }
        if (empty($ticketMember['mb_leave_date']) && empty($ticketMember['mb_intercept_date'])) {
            $member = $ticketMember;
            $is_member = true;
            $is_admin = function_exists('is_admin') ? is_admin($ticketMemberId) : '';
        } else {
            $ticketEnrollment = null;
        }
    }
}

if (!$ticketEnrollment && function_exists('edu_platform_adopt_member')) {
    edu_platform_adopt_member();
}

if (function_exists('onoff_education_platform_grant_enrollment')) {
    $educationGrant = onoff_education_platform_grant_enrollment('any');
    $educationMemberId = is_array($educationGrant) ? (string) ($educationGrant['mb_id'] ?? '') : '';
    if ($educationMemberId !== '' && function_exists('get_member')) {
        $educationMember = get_member($educationMemberId);
        if (
            is_array($educationMember)
            && !empty($educationMember['mb_id'])
            && empty($educationMember['mb_leave_date'])
            && empty($educationMember['mb_intercept_date'])
        ) {
            $member = $educationMember;
            $is_member = true;
            $is_admin = function_exists('is_admin') ? is_admin($educationMember['mb_id']) : '';
        }
    }
}
include_once(dirname(__FILE__) . '/../../lib/onoff-education-admin-auth.lib.php');
if (function_exists('onoff_education_try_platform_admin_adopt')) {
    onoff_education_try_platform_admin_adopt();
}
