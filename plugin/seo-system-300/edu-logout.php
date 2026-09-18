<?php
/**
 * Drop the short Core-member cache used on edu.icrm.co.kr.
 * The shared login cookie itself is cleared by /api/auth.php?action=logout.
 */
include_once dirname(__FILE__) . '/_common.php';
include_once dirname(__FILE__) . '/lib/api.lib.php';

seosys300_require_method('POST');

if (function_exists('set_session')) {
    set_session('edu_core_mb', '');
    set_session('edu_core_name', '');
    set_session('edu_core_email', '');
    set_session('edu_core_until', '');
    set_session('ss_mb_id', '');
}

seosys300_json_response(array('ok' => true), 200);
