<?php
/**
 * Document-root bootstrap when edu.icrm.co.kr points at this edu/ directory.
 * Shared-docroot deploys (HTTP_HOST rewrite in the site .htaccess) do not need this file.
 */
require_once dirname(__DIR__) . '/lib/edu-platform.php';
edu_platform_apply_env();
