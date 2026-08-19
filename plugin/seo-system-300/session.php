<?php
include_once(dirname(__FILE__) . '/_common.php');
include_once(dirname(__FILE__) . '/lib/api.lib.php');

seosys300_require_method('GET');
seosys300_json_response(seosys300_session_payload(), 200);
