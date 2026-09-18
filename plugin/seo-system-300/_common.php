<?php
include_once(dirname(__FILE__) . '/../../common.php');
include_once(dirname(__FILE__) . '/../../lib/edu-platform.php');
if (function_exists('edu_platform_adopt_member')) {
    edu_platform_adopt_member();
}
