<?php
/**
 * Student class journey: prep, next Meet, five class records, execution budget.
 * Tables are created on first use so shared hosting does not need a manual migration.
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_class_plan_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_class_plan';
}

function seosys300_class_steps_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_class_steps';
}

function seosys300_class_sessions_table()
{
    $prefix = defined('G5_TABLE_PREFIX') ? G5_TABLE_PREFIX : 'g5_';
    return $prefix . 'seosys300_class_sessions';
}

function seosys300_class_ensure_column($table, $column, $definition)
{
    $safeColumn = seosys300_esc($column);
    $row = seosys300_fetch("SHOW COLUMNS FROM `{$table}` LIKE '{$safeColumn}'");
    if ($row) {
        return;
    }
    seosys300_query("ALTER TABLE `{$table}` ADD {$definition}");
}

function seosys300_class_ensure_tables()
{
    static $done = false;
    if ($done) {
        return true;
    }
    $plan = seosys300_class_plan_table();
    $steps = seosys300_class_steps_table();
    $sessions = seosys300_class_sessions_table();
    $ok = seosys300_query("CREATE TABLE IF NOT EXISTS `{$plan}` (
        `project_id` int(11) NOT NULL,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `business_summary` text NOT NULL,
        `domain_candidates` text NOT NULL,
        `chosen_domain` varchar(255) NOT NULL DEFAULT '',
        `meet_at` datetime DEFAULT NULL,
        `meet_screen` varchar(40) NOT NULL DEFAULT '',
        `next_action` varchar(255) NOT NULL DEFAULT '',
        `backlink_spent` int(11) NOT NULL DEFAULT 0,
        `traffic_charged` int(11) NOT NULL DEFAULT 0,
        `remind_before_for` datetime DEFAULT NULL,
        `remind_after_for` datetime DEFAULT NULL,
        `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`project_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");
    $ok2 = seosys300_query("CREATE TABLE IF NOT EXISTS `{$steps}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `project_id` int(11) NOT NULL DEFAULT 0,
        `step_key` varchar(20) NOT NULL DEFAULT '',
        `before_note` text NOT NULL,
        `during_screen` varchar(40) NOT NULL DEFAULT '',
        `after_result` text NOT NULL,
        `status` varchar(20) NOT NULL DEFAULT 'open',
        `updated_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        UNIQUE KEY `project_step` (`project_id`,`step_key`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");
    $ok3 = seosys300_query("CREATE TABLE IF NOT EXISTS `{$sessions}` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `project_id` int(11) NOT NULL DEFAULT 0,
        `mb_id` varchar(100) NOT NULL DEFAULT '',
        `held_at` datetime DEFAULT NULL,
        `screen` varchar(40) NOT NULL DEFAULT '',
        `step_key` varchar(20) NOT NULL DEFAULT '',
        `result_note` text NOT NULL,
        `next_action` varchar(255) NOT NULL DEFAULT '',
        `created_at` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (`id`),
        KEY `project_held` (`project_id`,`held_at`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8");
    if ($ok) {
        seosys300_class_ensure_column($plan, 'remind_before_for', '`remind_before_for` datetime DEFAULT NULL');
        seosys300_class_ensure_column($plan, 'remind_after_for', '`remind_after_for` datetime DEFAULT NULL');
    }
    $done = (bool) ($ok && $ok2 && $ok3);
    return $done;
}

function seosys300_class_catalog()
{
    return array(
        array(
            'key' => 'domain',
            'title' => '낙장도메인',
            'toolUrl' => 'https://domain.icrm.co.kr/',
            'toolLabel' => 'CatchDomain 열기',
            'cap' => 300000,
            'capLabel' => '도메인 지원 30만원',
        ),
        array(
            'key' => 'website',
            'title' => '홈페이지',
            'toolUrl' => '',
            'toolLabel' => '홈페이지 주문',
            'cap' => 0,
            'capLabel' => '맞춤 홈페이지 제작 포함',
        ),
        array(
            'key' => 'content',
            'title' => '콘텐츠',
            'toolUrl' => 'https://icrm.co.kr/',
            'toolLabel' => '콘텐츠 도구 열기',
            'cap' => 0,
            'capLabel' => '콘텐츠 운영 환경',
        ),
        array(
            'key' => 'backlink',
            'title' => '백링크',
            'toolUrl' => 'https://backlink.icrm.co.kr/',
            'toolLabel' => '백링크 열기',
            'cap' => 700000,
            'capLabel' => '백링크 지원 70만원',
        ),
        array(
            'key' => 'traffic',
            'title' => '트래픽',
            'toolUrl' => 'https://icrm.co.kr/',
            'toolLabel' => '트래픽 열기',
            'cap' => 1000000,
            'capLabel' => '트래픽 충전 100만원',
        ),
    );
}

function seosys300_class_screens()
{
    return array(
        array('id' => 'catchdomain', 'label' => 'CatchDomain'),
        array('id' => 'website', 'label' => '홈페이지 주문'),
        array('id' => 'content', 'label' => '콘텐츠'),
        array('id' => 'backlink', 'label' => '백링크'),
        array('id' => 'traffic', 'label' => '트래픽'),
    );
}

function seosys300_class_step_allowed($key)
{
    foreach (seosys300_class_catalog() as $step) {
        if ($step['key'] === $key) {
            return true;
        }
    }
    return false;
}

function seosys300_class_screen_allowed($id)
{
    if ($id === '') {
        return true;
    }
    foreach (seosys300_class_screens() as $screen) {
        if ($screen['id'] === $id) {
            return true;
        }
    }
    return false;
}

function seosys300_class_latest_project_id($mb_id)
{
    global $g5;
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_projects_table'];
    $row = seosys300_fetch("SELECT id FROM `{$table}` WHERE mb_id = '{$mb}' AND is_active = 1 ORDER BY id DESC LIMIT 1");
    return $row ? (int) $row['id'] : 0;
}

function seosys300_class_plan_row($project_id)
{
    seosys300_class_ensure_tables();
    $pid = (int) $project_id;
    $table = seosys300_class_plan_table();
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE project_id = {$pid} LIMIT 1");
}

function seosys300_class_upsert_plan($project_id, $fields)
{
    seosys300_class_ensure_tables();
    $pid = (int) $project_id;
    $mb = seosys300_esc(seosys300_current_mb_id());
    $now = seosys300_now();
    $table = seosys300_class_plan_table();
    $existing = seosys300_class_plan_row($pid);
    if (!$existing) {
        $defaults = array(
            'business_summary' => seosys300_class_sql_text(''),
            'domain_candidates' => seosys300_class_sql_text('[]'),
            'chosen_domain' => seosys300_class_sql_text(''),
            'meet_screen' => seosys300_class_sql_text(''),
            'next_action' => seosys300_class_sql_text(''),
            'backlink_spent' => '0',
            'traffic_charged' => '0',
        );
        foreach ($defaults as $col => $sqlValue) {
            if (!isset($fields[$col])) {
                $fields[$col] = $sqlValue;
            }
        }
    }
    $sets = array("mb_id = '{$mb}'", "updated_at = '{$now}'");
    foreach ($fields as $col => $sqlValue) {
        $sets[] = "`{$col}` = {$sqlValue}";
    }
    if ($existing) {
        seosys300_query("UPDATE `{$table}` SET " . implode(', ', $sets) . " WHERE project_id = {$pid}");
        return;
    }
    seosys300_query("INSERT INTO `{$table}` SET project_id = {$pid}, " . implode(', ', $sets));
}

function seosys300_class_sql_text($value)
{
    return "'" . seosys300_esc((string) $value) . "'";
}

function seosys300_class_decode_list($raw)
{
    $decoded = json_decode((string) $raw, true);
    if (!is_array($decoded)) {
        return array();
    }
    $out = array();
    foreach ($decoded as $item) {
        $word = trim((string) $item);
        if ($word !== '') {
            $out[] = substr($word, 0, 255);
        }
    }
    return $out;
}

function seosys300_class_meet_input($raw)
{
    $raw = trim((string) $raw);
    if ($raw === '') {
        return null;
    }
    $ts = strtotime($raw);
    if (!$ts) {
        return null;
    }
    return date('Y-m-d H:i:s', $ts);
}

function seosys300_class_payload($project_id, $project = null)
{
    $project_id = (int) $project_id;
    if ($project === null) {
        $mb = seosys300_current_mb_id();
        $project = $project_id > 0 ? seosys300_get_owned_project($project_id, $mb) : null;
        if ($project_id > 0 && !$project) {
            seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
        }
    }

    $plan = $project ? seosys300_class_plan_row($project_id) : null;
    $keywords = $project ? seosys300_project_keywords($project_id) : array();
    $keywordWords = array();
    foreach ($keywords as $item) {
        $keywordWords[] = (string) $item['keyword'];
    }
    $owner = $project ? (string) $project['mb_id'] : '';
    $order = $project ? seosys300_current_order_for_project($project_id, $owner) : null;
    $candidates = $plan ? seosys300_class_decode_list($plan['domain_candidates']) : array();
    $chosen = $plan ? (string) $plan['chosen_domain'] : ($project ? (string) $project['domain'] : '');
    if ($chosen === '' && $project) {
        $fromTool = seosys300_class_tool_text($project_id, 'catchdomain', array('selectedDomain', 'domain'));
        if ($fromTool !== '') {
            $chosen = $fromTool;
        }
    }
    $meetRaw = $plan && !empty($plan['meet_at']) && $plan['meet_at'] !== '0000-00-00 00:00:00' ? (string) $plan['meet_at'] : '';
    $meetInput = $meetRaw !== '' ? date('Y-m-d\TH:i', strtotime($meetRaw)) : '';

    $websiteReady = $order && (trim((string) $order['site_name']) !== '' || (int) $order['is_draft'] === 0);
    $prep = array(
        'business' => $project && trim((string) $project['name']) !== '' && count($keywordWords) > 0,
        'domain' => $chosen !== '' || count($candidates) > 0,
        'website' => (bool) $websiteReady,
        'meet' => $meetRaw !== '',
    );
    $prep['complete'] = $prep['business'] && $prep['domain'] && $prep['website'] && $prep['meet'];

    $stepRows = array();
    if ($project) {
        $stable = seosys300_class_steps_table();
        foreach (seosys300_fetch_all("SELECT * FROM `{$stable}` WHERE project_id = {$project_id}") as $row) {
            $stepRows[(string) $row['step_key']] = $row;
        }
    }

    $steps = array();
    $mission = null;
    foreach (seosys300_class_catalog() as $step) {
        $row = isset($stepRows[$step['key']]) ? $stepRows[$step['key']] : null;
        $status = $row ? (string) $row['status'] : 'open';
        if (!in_array($status, array('open', 'doing', 'done'), true)) {
            $status = 'open';
        }
        $item = array(
            'key' => $step['key'],
            'title' => $step['title'],
            'toolUrl' => $step['toolUrl'],
            'toolLabel' => $step['toolLabel'],
            'cap' => (int) $step['cap'],
            'capLabel' => $step['capLabel'],
            'beforeNote' => $row ? (string) $row['before_note'] : '',
            'duringScreen' => $row ? (string) $row['during_screen'] : '',
            'afterResult' => $row ? (string) $row['after_result'] : '',
            'status' => $status,
        );
        $steps[] = $item;
        if ($mission === null && $status !== 'done') {
            if (trim($item['beforeNote']) === '') {
                $prompt = '수업 전에 이 단계에서 확인할 내용을 적어 주세요.';
            } elseif (trim($item['afterResult']) === '') {
                $prompt = '수업 후 남은 결과 한 가지만 적어 주세요.';
            } else {
                $prompt = '이 단계를 마쳤으면 완료로 바꿔 주세요.';
            }
            $mission = array(
                'stepKey' => $step['key'],
                'title' => $step['title'],
                'prompt' => $prompt,
            );
        }
    }

    return array(
        'projectId' => $project ? (int) $project['id'] : 0,
        'prep' => $prep,
        'business' => array(
            'name' => $project ? (string) $project['name'] : '',
            'businessType' => $project ? (string) $project['business_type'] : '',
            'summary' => $plan ? (string) $plan['business_summary'] : ($project ? (string) $project['description'] : ''),
            'keywords' => $keywordWords,
        ),
        'domain' => array(
            'candidates' => $candidates,
            'chosen' => $chosen,
        ),
        'website' => array(
            'ordered' => (bool) $websiteReady,
            'status' => $order ? (string) $order['status'] : '',
            'statusLabel' => $order ? seosys300_class_order_label((string) $order['status']) : '주문 전',
            'siteName' => $order ? (string) $order['site_name'] : '',
            'orderId' => $order ? (int) $order['id'] : 0,
        ),
        'meet' => array(
            'at' => $meetInput,
            'screen' => $plan ? (string) $plan['meet_screen'] : '',
            'nextAction' => $plan ? (string) $plan['next_action'] : '',
        ),
        'steps' => $steps,
        'mission' => $mission,
        'screens' => seosys300_class_screens(),
        'sessions' => $project ? seosys300_class_session_list($project_id) : array(),
        'budget' => array(
            'domain' => array(
                'cap' => 300000,
                'chosen' => $chosen !== '',
                'label' => $chosen !== '' ? $chosen : '아직 없음',
            ),
            'website' => array(
                'included' => true,
                'status' => $order ? (string) $order['status'] : '',
                'statusLabel' => $order ? seosys300_class_order_label((string) $order['status']) : '주문 전',
            ),
            'backlink' => seosys300_class_service_amount($project_id, 'backlink', 700000),
            'traffic' => seosys300_class_service_amount($project_id, 'traffic', 1000000),
        ),
    );
}

function seosys300_class_save_prep($input)
{
    $name = trim((string) ($input['businessName'] ?? $input['name'] ?? ''));
    if ($name === '') {
        seosys300_json_error(422, 'validation_error', '사업 이름을 입력해주세요.');
    }
    $keywords = array();
    $rawKeywords = isset($input['keywords']) ? $input['keywords'] : array();
    if (is_string($rawKeywords)) {
        $rawKeywords = preg_split('/[\n,]+/', $rawKeywords);
    }
    foreach ((array) $rawKeywords as $word) {
        $word = trim((string) $word);
        if ($word !== '') {
            $keywords[] = substr($word, 0, 191);
        }
    }
    $candidates = array();
    $rawDomains = isset($input['domainCandidates']) ? $input['domainCandidates'] : array();
    if (is_string($rawDomains)) {
        $rawDomains = preg_split('/[\n,]+/', $rawDomains);
    }
    foreach ((array) $rawDomains as $host) {
        $host = trim((string) $host);
        if ($host !== '') {
            $candidates[] = substr($host, 0, 255);
        }
        if (count($candidates) >= 8) {
            break;
        }
    }
    $chosen = substr(trim((string) ($input['chosenDomain'] ?? '')), 0, 255);
    $summary = (string) ($input['businessSummary'] ?? '');
    $businessType = substr(trim((string) ($input['businessType'] ?? '')), 0, 100);
    $projectId = isset($input['projectId']) ? (int) $input['projectId'] : 0;

    $payload = array(
        'name' => $name,
        'description' => $summary,
        'businessType' => $businessType,
        'domain' => $chosen,
        'keywords' => $keywords,
    );
    if ($projectId < 1) {
        $created = seosys300_project_create($payload);
        $projectId = (int) $created['id'];
    } else {
        seosys300_project_update($projectId, $payload);
    }

    seosys300_class_upsert_plan($projectId, array(
        'business_summary' => seosys300_class_sql_text($summary),
        'domain_candidates' => seosys300_class_sql_text(json_encode($candidates, JSON_UNESCAPED_UNICODE)),
        'chosen_domain' => seosys300_class_sql_text($chosen),
    ));
    return seosys300_class_payload($projectId);
}

function seosys300_class_require_project($input)
{
    $projectId = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    if ($projectId < 1) {
        seosys300_json_error(422, 'validation_error', '먼저 사업과 키워드를 저장해주세요.');
    }
    $project = seosys300_get_owned_project($projectId, seosys300_current_mb_id());
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    return $projectId;
}

function seosys300_class_save_meet($input)
{
    $projectId = seosys300_class_require_project($input);
    $screen = substr(trim((string) ($input['meetScreen'] ?? '')), 0, 40);
    if (!seosys300_class_screen_allowed($screen)) {
        seosys300_json_error(422, 'validation_error', '수업에서 열 화면을 선택해주세요.');
    }
    $meet = seosys300_class_meet_input($input['meetAt'] ?? '');
    $meetSql = $meet === null ? 'NULL' : seosys300_class_sql_text($meet);
    $action = substr(trim((string) ($input['nextAction'] ?? '')), 0, 255);
    $existing = seosys300_class_plan_row($projectId);
    $oldMeet = ($existing && !empty($existing['meet_at']) && $existing['meet_at'] !== '0000-00-00 00:00:00') ? (string) $existing['meet_at'] : '';
    $newMeet = $meet === null ? '' : $meet;
    if ($existing && $oldMeet !== '' && $newMeet !== '' && $newMeet !== $oldMeet) {
        $stepKey = seosys300_class_screen_to_step((string) $existing['meet_screen']);
        $result = '';
        if ($stepKey !== '') {
            $stepRow = seosys300_fetch("SELECT after_result FROM `" . seosys300_class_steps_table() . "` WHERE project_id = {$projectId} AND step_key = '" . seosys300_esc($stepKey) . "' LIMIT 1");
            $result = $stepRow ? (string) $stepRow['after_result'] : '';
        }
        seosys300_class_record_session($projectId, $existing, $result, (string) $existing['next_action'], $stepKey);
    }
    seosys300_class_upsert_plan($projectId, array(
        'meet_at' => $meetSql,
        'meet_screen' => seosys300_class_sql_text($screen),
        'next_action' => seosys300_class_sql_text($action),
    ));
    return seosys300_class_payload($projectId);
}

function seosys300_class_save_step($input)
{
    $projectId = seosys300_class_require_project($input);
    $key = trim((string) ($input['stepKey'] ?? ''));
    if (!seosys300_class_step_allowed($key)) {
        seosys300_json_error(422, 'validation_error', '수업 단계를 확인해주세요.');
    }
    $status = trim((string) ($input['status'] ?? 'open'));
    if (!in_array($status, array('open', 'doing', 'done'), true)) {
        $status = 'open';
    }
    $screen = substr(trim((string) ($input['duringScreen'] ?? '')), 0, 40);
    if (!seosys300_class_screen_allowed($screen)) {
        $screen = '';
    }
    $before = (string) ($input['beforeNote'] ?? '');
    $after = (string) ($input['afterResult'] ?? '');
    $now = seosys300_now();
    $table = seosys300_class_steps_table();
    $keySql = seosys300_esc($key);
    $existing = seosys300_fetch("SELECT id FROM `{$table}` WHERE project_id = {$projectId} AND step_key = '{$keySql}' LIMIT 1");
    $sets = "before_note = " . seosys300_class_sql_text($before)
        . ", during_screen = " . seosys300_class_sql_text($screen)
        . ", after_result = " . seosys300_class_sql_text($after)
        . ", status = " . seosys300_class_sql_text($status)
        . ", updated_at = '{$now}'";
    if ($existing) {
        $id = (int) $existing['id'];
        seosys300_query("UPDATE `{$table}` SET {$sets} WHERE id = {$id}");
    } else {
        seosys300_query("INSERT INTO `{$table}` SET project_id = {$projectId}, step_key = '{$keySql}', {$sets}");
    }
    return seosys300_class_payload($projectId);
}

function seosys300_class_save_budget($input)
{
    unset($input);
    seosys300_json_error(422, 'validation_error', '실행 금액은 수강생이 입력하지 않습니다. 연결된 서비스 사용액만 표시합니다.');
}

function seosys300_class_order_label($status)
{
    $map = array(
        'draft' => '작성 중',
        'submitted' => '제작 요청 완료',
        'need_more_info' => '추가자료 필요',
        'material_waiting' => '자료 검토',
        'planning' => '기획 중',
        'design' => '제작 중',
        'development' => '제작 중',
        'internal_review' => '1차 확인',
        'customer_review' => '1차 확인',
        'revision' => '수정 중',
        'completed' => '제작 완료',
        'delivered' => '제작 완료',
    );
    $key = function_exists('seosys300_normalize_order_status') ? seosys300_normalize_order_status($status) : (string) $status;
    return isset($map[$key]) ? $map[$key] : ($key !== '' ? $key : '주문 전');
}

function seosys300_class_tool_config($project_id, $tool_key)
{
    if (!function_exists('seosys300_tool_row')) {
        return null;
    }
    $row = seosys300_tool_row((int) $project_id, $tool_key);
    if (!$row || empty($row['config_json'])) {
        return null;
    }
    $decoded = json_decode((string) $row['config_json'], true);
    return is_array($decoded) ? $decoded : null;
}

function seosys300_class_tool_text($project_id, $tool_key, $keys)
{
    $config = seosys300_class_tool_config($project_id, $tool_key);
    if (!$config) {
        return '';
    }
    foreach ($keys as $key) {
        if (isset($config[$key]) && trim((string) $config[$key]) !== '') {
            return substr(trim((string) $config[$key]), 0, 255);
        }
    }
    return '';
}

function seosys300_class_service_amount($project_id, $tool_key, $cap)
{
    $config = seosys300_class_tool_config($project_id, $tool_key);
    $known = false;
    $amount = null;
    if ($config) {
        foreach (array('spent', 'usedAmount', 'chargedAmount', 'chargeAmount', 'amount') as $key) {
            if (isset($config[$key]) && $config[$key] !== '' && is_numeric($config[$key])) {
                $known = true;
                $amount = max(0, (int) $config[$key]);
                break;
            }
        }
    }
    $remaining = $known ? max(0, (int) $cap - (int) $amount) : null;
    return array(
        'cap' => (int) $cap,
        'connected' => $config !== null,
        'known' => $known,
        'spent' => $known ? $amount : null,
        'remaining' => $remaining,
        'nearCap' => $known && (int) $cap > 0 && $remaining !== null && $remaining <= (int) floor($cap * 0.2),
    );
}

function seosys300_class_screen_to_step($screen)
{
    if ($screen === 'catchdomain') {
        return 'domain';
    }
    return seosys300_class_step_allowed($screen) ? $screen : '';
}

function seosys300_class_screen_label($screen)
{
    foreach (seosys300_class_screens() as $item) {
        if ($item['id'] === $screen) {
            return $item['label'];
        }
    }
    return $screen !== '' ? $screen : '다음 화면';
}

function seosys300_class_session_list($project_id)
{
    seosys300_class_ensure_tables();
    $pid = (int) $project_id;
    $table = seosys300_class_sessions_table();
    $rows = seosys300_fetch_all("SELECT * FROM `{$table}` WHERE project_id = {$pid} ORDER BY held_at DESC, id DESC LIMIT 30");
    $out = array();
    foreach ($rows as $row) {
        $held = !empty($row['held_at']) && $row['held_at'] !== '0000-00-00 00:00:00' ? date('Y-m-d H:i', strtotime($row['held_at'])) : '';
        $out[] = array(
            'id' => (int) $row['id'],
            'heldAt' => $held,
            'screen' => (string) $row['screen'],
            'stepKey' => (string) $row['step_key'],
            'resultNote' => (string) $row['result_note'],
            'nextAction' => (string) $row['next_action'],
        );
    }
    return $out;
}

function seosys300_class_record_session($project_id, $plan, $result_note, $next_action, $step_key)
{
    if (!$plan) {
        return;
    }
    $held = isset($plan['meet_at']) ? (string) $plan['meet_at'] : '';
    if ($held === '' || $held === '0000-00-00 00:00:00') {
        return;
    }
    seosys300_class_ensure_tables();
    $pid = (int) $project_id;
    $table = seosys300_class_sessions_table();
    $heldSql = seosys300_class_sql_text($held);
    $existing = seosys300_fetch("SELECT id FROM `{$table}` WHERE project_id = {$pid} AND held_at = {$heldSql} LIMIT 1");
    $screen = substr((string) $plan['meet_screen'], 0, 40);
    if ($step_key === '') {
        $step_key = seosys300_class_screen_to_step($screen);
    }
    $now = seosys300_now();
    $sets = "result_note = " . seosys300_class_sql_text($result_note)
        . ", next_action = " . seosys300_class_sql_text(substr((string) $next_action, 0, 255))
        . ", screen = " . seosys300_class_sql_text($screen)
        . ", step_key = " . seosys300_class_sql_text(substr((string) $step_key, 0, 20));
    if ($existing) {
        seosys300_query("UPDATE `{$table}` SET {$sets} WHERE id = " . (int) $existing['id']);
        return;
    }
    $mb = seosys300_class_sql_text(isset($plan['mb_id']) ? (string) $plan['mb_id'] : '');
    seosys300_query("INSERT INTO `{$table}` SET project_id = {$pid}, mb_id = {$mb}, held_at = {$heldSql}, created_at = '{$now}', {$sets}");
}

function seosys300_class_patch_plan($project_id, $mb_id, $fields)
{
    seosys300_class_ensure_tables();
    $pid = (int) $project_id;
    $table = seosys300_class_plan_table();
    $existing = seosys300_class_plan_row($pid);
    $now = seosys300_now();
    $sets = array("updated_at = '{$now}'");
    foreach ($fields as $col => $sqlValue) {
        if (!preg_match('/^[a-z_]+$/', (string) $col)) {
            continue;
        }
        $sets[] = "`{$col}` = {$sqlValue}";
    }
    if ($existing) {
        seosys300_query("UPDATE `{$table}` SET " . implode(', ', $sets) . " WHERE project_id = {$pid}");
        return;
    }
    $defaults = array(
        'business_summary' => seosys300_class_sql_text(''),
        'domain_candidates' => seosys300_class_sql_text('[]'),
        'chosen_domain' => seosys300_class_sql_text(''),
        'meet_screen' => seosys300_class_sql_text(''),
        'next_action' => seosys300_class_sql_text(''),
        'backlink_spent' => '0',
        'traffic_charged' => '0',
    );
    foreach ($defaults as $col => $sqlValue) {
        if (!isset($fields[$col])) {
            $sets[] = "`{$col}` = {$sqlValue}";
        }
    }
    $mb = seosys300_class_sql_text($mb_id);
    seosys300_query("INSERT INTO `{$table}` SET project_id = {$pid}, mb_id = {$mb}, " . implode(', ', $sets));
}

function seosys300_class_project_row($project_id)
{
    global $g5;
    $pid = (int) $project_id;
    $pt = $g5['seosys300_projects_table'];
    $mt = $g5['member_table'];
    return seosys300_fetch("SELECT p.*, m.mb_name, m.mb_hp FROM `{$pt}` p LEFT JOIN `{$mt}` m ON m.mb_id = p.mb_id WHERE p.id = {$pid} LIMIT 1");
}

function seosys300_class_admin_item($project)
{
    $payload = seosys300_class_payload((int) $project['id'], $project);
    $step = null;
    $missionKey = isset($payload['mission']['stepKey']) ? (string) $payload['mission']['stepKey'] : '';
    if ($missionKey !== '') {
        foreach ($payload['steps'] as $item) {
            if ($item['key'] === $missionKey) {
                $step = $item;
                break;
            }
        }
    }
    $student = isset($project['mb_name']) ? trim((string) $project['mb_name']) : '';
    return array(
        'projectId' => (int) $project['id'],
        'mbId' => (string) $project['mb_id'],
        'studentName' => $student !== '' ? $student : (string) $project['mb_id'],
        'businessName' => (string) $project['name'],
        'meet' => $payload['meet'],
        'mission' => $payload['mission'],
        'domain' => $payload['domain'],
        'website' => $payload['website'],
        'step' => $step,
        'sessions' => array_slice($payload['sessions'], 0, 5),
        'screens' => $payload['screens'],
    );
}

function seosys300_class_admin_queue()
{
    global $g5;
    seosys300_class_ensure_tables();
    seosys300_class_dispatch_reminders();
    $pt = $g5['seosys300_projects_table'];
    $mt = $g5['member_table'];
    $rows = seosys300_fetch_all("SELECT p.*, m.mb_name, m.mb_hp FROM `{$pt}` p LEFT JOIN `{$mt}` m ON m.mb_id = p.mb_id WHERE p.is_active = 1 ORDER BY p.id DESC LIMIT 200");
    $items = array();
    foreach ($rows as $project) {
        $items[] = seosys300_class_admin_item($project);
    }
    usort($items, function ($a, $b) {
        $am = isset($a['meet']['at']) && $a['meet']['at'] !== '' ? $a['meet']['at'] : '9999';
        $bm = isset($b['meet']['at']) && $b['meet']['at'] !== '' ? $b['meet']['at'] : '9999';
        return strcmp($am, $bm);
    });
    return array('items' => $items);
}

function seosys300_class_admin_save($input)
{
    $projectId = isset($input['projectId']) ? (int) $input['projectId'] : 0;
    $project = seosys300_class_project_row($projectId);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $key = trim((string) ($input['stepKey'] ?? ''));
    if ($key !== '') {
        if (!seosys300_class_step_allowed($key)) {
            seosys300_json_error(422, 'validation_error', '수업 단계를 확인해주세요.');
        }
        $status = trim((string) ($input['status'] ?? 'doing'));
        if (!in_array($status, array('open', 'doing', 'done'), true)) {
            $status = 'doing';
        }
        $screen = substr(trim((string) ($input['duringScreen'] ?? '')), 0, 40);
        if (!seosys300_class_screen_allowed($screen)) {
            $screen = '';
        }
        $now = seosys300_now();
        $table = seosys300_class_steps_table();
        $keySql = seosys300_esc($key);
        $existing = seosys300_fetch("SELECT id FROM `{$table}` WHERE project_id = {$projectId} AND step_key = '{$keySql}' LIMIT 1");
        $sets = "before_note = " . seosys300_class_sql_text((string) ($input['beforeNote'] ?? ''))
            . ", during_screen = " . seosys300_class_sql_text($screen)
            . ", after_result = " . seosys300_class_sql_text((string) ($input['afterResult'] ?? ''))
            . ", status = " . seosys300_class_sql_text($status)
            . ", updated_at = '{$now}'";
        if ($existing) {
            seosys300_query("UPDATE `{$table}` SET {$sets} WHERE id = " . (int) $existing['id']);
        } else {
            seosys300_query("INSERT INTO `{$table}` SET project_id = {$projectId}, step_key = '{$keySql}', {$sets}");
        }
    }

    $screen = substr(trim((string) ($input['meetScreen'] ?? '')), 0, 40);
    if (!seosys300_class_screen_allowed($screen)) {
        seosys300_json_error(422, 'validation_error', '수업에서 열 화면을 선택해주세요.');
    }
    $meet = seosys300_class_meet_input($input['meetAt'] ?? '');
    $newMeet = $meet === null ? '' : $meet;
    $record = !empty($input['recordHeld']);
    if ($record && $newMeet === '') {
        seosys300_json_error(422, 'validation_error', '일지에 남기려면 다음 수업 일시를 입력해주세요.');
    }
    $plan = seosys300_class_plan_row($projectId);
    $oldMeet = ($plan && !empty($plan['meet_at']) && $plan['meet_at'] !== '0000-00-00 00:00:00') ? (string) $plan['meet_at'] : '';
    if ($plan && $oldMeet !== '' && ($record || ($newMeet !== '' && $newMeet !== $oldMeet))) {
        seosys300_class_record_session($projectId, $plan, (string) ($input['afterResult'] ?? ''), (string) $plan['next_action'], $key);
    }
    $action = substr(trim((string) ($input['nextAction'] ?? '')), 0, 255);
    $fields = array('next_action' => seosys300_class_sql_text($action));
    if ($screen !== '' && ($record || $newMeet !== '')) {
        $fields['meet_screen'] = seosys300_class_sql_text($screen);
    }
    if ($newMeet !== '') {
        $fields['meet_at'] = seosys300_class_sql_text($newMeet);
    }
    seosys300_class_patch_plan($projectId, (string) $project['mb_id'], $fields);
    $fresh = seosys300_class_project_row($projectId);
    return seosys300_class_admin_item($fresh ? $fresh : $project);
}

function seosys300_class_claim_remind($project_id, $column, $meet_at)
{
    if (!in_array($column, array('remind_before_for', 'remind_after_for'), true)) {
        return false;
    }
    $table = seosys300_class_plan_table();
    $pid = (int) $project_id;
    $meetSql = seosys300_class_sql_text($meet_at);
    seosys300_query("UPDATE `{$table}` SET `{$column}` = {$meetSql} WHERE project_id = {$pid} AND (`{$column}` IS NULL OR `{$column}` = '0000-00-00 00:00:00' OR `{$column}` <> {$meetSql})");
    global $g5;
    $affected = 1;
    if (function_exists('sql_affected_rows')) {
        $affected = (int) sql_affected_rows();
    } elseif (!empty($g5['connect_db']) && function_exists('mysqli_affected_rows')) {
        $affected = (int) mysqli_affected_rows($g5['connect_db']);
    }
    return $affected > 0;
}

function seosys300_class_remind_phone($mb_id)
{
    $prefs = dirname(__FILE__) . '/../../../lib/onoff-notification-preferences.lib.php';
    if (!function_exists('onoff_notification_get_preferences') && is_file($prefs)) {
        include_once $prefs;
    }
    $phone = '';
    $kakao = true;
    if (function_exists('onoff_notification_get_preferences')) {
        $preferences = onoff_notification_get_preferences($mb_id);
        if (is_array($preferences)) {
            $kakao = !empty($preferences['kakao_enabled']);
            $phone = isset($preferences['phone']) ? (string) $preferences['phone'] : '';
        }
    }
    if ($phone === '' && function_exists('get_member')) {
        $member = get_member($mb_id);
        if (is_array($member) && !empty($member['mb_hp'])) {
            $phone = (string) $member['mb_hp'];
        }
    }
    return array('phone' => $phone, 'kakao' => $kakao);
}

function seosys300_class_notify_inbox($mb_id, $project_id, $event, $title, $body)
{
    global $g5;
    if (empty($g5['seosys300_notifications_table'])) {
        return;
    }
    if (!function_exists('seosys300_notifications_tables_ready')) {
        return;
    }
    if (!seosys300_notifications_tables_ready()) {
        return;
    }
    $table = $g5['seosys300_notifications_table'];
    $now = seosys300_now();
    $mb = seosys300_esc(substr((string) $mb_id, 0, 20));
    seosys300_query("INSERT INTO `{$table}` SET
        mb_id = '{$mb}',
        project_id = " . (int) $project_id . ",
        event_type = " . seosys300_class_sql_text($event) . ",
        title = " . seosys300_class_sql_text(substr($title, 0, 191)) . ",
        body = " . seosys300_class_sql_text(substr($body, 0, 500)) . ",
        action_tab = 'dashboard',
        severity = 'info',
        created_at = '{$now}'");
}

function seosys300_class_send_kakao($kind, $phone, $variables)
{
    if ($phone === '') {
        return;
    }
    $notifier = dirname(__FILE__) . '/../../../components/inquiry-notifier.php';
    if (!function_exists('onoff_kakao_alimtalk_send') && is_file($notifier)) {
        include_once $notifier;
    }
    if (!function_exists('onoff_kakao_alimtalk_is_enabled') || !onoff_kakao_alimtalk_is_enabled()) {
        return;
    }
    if (!function_exists('onoff_kakao_alimtalk_send') || !function_exists('g5site_cfg')) {
        return;
    }
    $key = $kind === 'before' ? 'inquiry_notify_kakao_template_class_before' : 'inquiry_notify_kakao_template_class_after';
    $fallback = $kind === 'before' ? 'ONOFF_EDU_CLASS_BEFORE' : 'ONOFF_EDU_CLASS_AFTER';
    $template = trim((string) g5site_cfg($key, $fallback));
    if ($template === '') {
        return;
    }
    $url = 'https://edu.icrm.co.kr/';
    onoff_kakao_alimtalk_send($template, $phone, $variables, array(
        array(
            'name' => '강의실 입장',
            'type' => 'WL',
            'urlMobile' => $url,
            'urlPc' => $url,
        ),
    ));
}

function seosys300_class_dispatch_reminders()
{
    static $ran = false;
    if ($ran) {
        return array('before' => 0, 'after' => 0);
    }
    $ran = true;
    seosys300_class_ensure_tables();
    $lockPath = (defined('G5_DATA_PATH') ? G5_DATA_PATH : sys_get_temp_dir()) . '/seosys300-class-reminders.lock';
    $lock = @fopen($lockPath, 'c');
    if (!$lock || !flock($lock, LOCK_EX | LOCK_NB)) {
        if ($lock) {
            fclose($lock);
        }
        return array('before' => 0, 'after' => 0, 'locked' => true);
    }
    $tomorrow = date('Y-m-d', strtotime('+1 day'));
    $yesterday = date('Y-m-d', strtotime('-1 day'));
    $table = seosys300_class_plan_table();
    $rows = seosys300_fetch_all("SELECT * FROM `{$table}`
        WHERE meet_at IS NOT NULL AND meet_at <> '0000-00-00 00:00:00'
        AND (DATE(meet_at) = '{$tomorrow}' OR DATE(meet_at) = '{$yesterday}')
        LIMIT 100");
    $before = 0;
    $after = 0;
    $steps = seosys300_class_steps_table();
    foreach ($rows as $plan) {
        $meetAt = (string) $plan['meet_at'];
        $meetDay = date('Y-m-d', strtotime($meetAt));
        $projectId = (int) $plan['project_id'];
        $mbId = (string) $plan['mb_id'];
        $screen = (string) $plan['meet_screen'];
        $stepKey = seosys300_class_screen_to_step($screen);
        $step = null;
        if ($stepKey !== '') {
            $step = seosys300_fetch("SELECT before_note, after_result FROM `{$steps}` WHERE project_id = {$projectId} AND step_key = '" . seosys300_esc($stepKey) . "' LIMIT 1");
        }
        $screenLabel = seosys300_class_screen_label($screen);
        $when = date('Y-m-d H:i', strtotime($meetAt));
        $contact = seosys300_class_remind_phone($mbId);
        $name = $mbId;
        if (function_exists('get_member')) {
            $member = get_member($mbId);
            if (is_array($member) && !empty($member['mb_name'])) {
                $name = (string) $member['mb_name'];
            }
        }
        if ($meetDay === $tomorrow) {
            if (!seosys300_class_claim_remind($projectId, 'remind_before_for', $meetAt)) {
                continue;
            }
            $memo = ($step && trim((string) $step['before_note']) !== '') ? '' : '수업 전 메모가 비어 있습니다. 확인할 내용 한 줄만 적어 주세요.';
            $body = '내일 ' . $screenLabel . ' 화면을 엽니다.' . ($memo !== '' ? ' ' . $memo : '');
            seosys300_class_notify_inbox($mbId, $projectId, 'CLASS_REMIND_BEFORE', '내일 수업에서 열 화면', $body);
            if (!empty($contact['kakao'])) {
                seosys300_class_send_kakao('before', $contact['phone'], array(
                    'name' => $name,
                    'screen' => $screenLabel,
                    'meet_at' => $when,
                    'memo' => $memo !== '' ? $memo : '-',
                    'classroom_url' => 'https://edu.icrm.co.kr/',
                ));
            }
            $before++;
            continue;
        }
        if ($meetDay !== $yesterday) {
            continue;
        }
        $result = $step ? trim((string) $step['after_result']) : '';
        if (!seosys300_class_claim_remind($projectId, 'remind_after_for', $meetAt)) {
            continue;
        }
        if ($result !== '') {
            continue;
        }
        $body = '어제 수업 결과 한 줄만 남겨 주세요.';
        seosys300_class_notify_inbox($mbId, $projectId, 'CLASS_REMIND_AFTER', '수업 결과 한 줄', $body);
        if (!empty($contact['kakao'])) {
            seosys300_class_send_kakao('after', $contact['phone'], array(
                'name' => $name,
                'screen' => $screenLabel,
                'meet_at' => $when,
                'memo' => $body,
                'classroom_url' => 'https://edu.icrm.co.kr/',
            ));
        }
        $after++;
    }
    flock($lock, LOCK_UN);
    fclose($lock);
    return array('before' => $before, 'after' => $after);
}
