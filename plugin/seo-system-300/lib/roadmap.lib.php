<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_roadmap_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_roadmap_steps_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_roadmap_steps_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_require_roadmap_tables()
{
    if (!seosys300_roadmap_tables_ready()) {
        seosys300_json_error(503, 'tables_missing', '로드맵 테이블이 아직 준비되지 않았습니다.');
    }
}

function seosys300_get_task_by_key($task_key)
{
    global $g5;
    $key = seosys300_esc((string) $task_key);
    $table = $g5['seosys300_roadmap_tasks_table'];
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE task_key = '{$key}' AND is_active = 1 LIMIT 1");
}

function seosys300_ensure_project_task_row($project_id, $task_id, $mb_id)
{
    global $g5;
    $project_id = (int) $project_id;
    $task_id = (int) $task_id;
    $table = $g5['seosys300_project_roadmap_tasks_table'];
    $row = seosys300_fetch("SELECT * FROM `{$table}` WHERE project_id = {$project_id} AND task_id = {$task_id} LIMIT 1");
    if ($row) {
        return $row;
    }
    $now = seosys300_now();
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = {$project_id},
        task_id = {$task_id},
        mb_id = '" . seosys300_esc($mb_id) . "',
        status = 'not_started',
        progress = 0,
        started_at = NULL,
        completed_at = NULL,
        created_at = '{$now}',
        updated_at = '{$now}'");
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE project_id = {$project_id} AND task_id = {$task_id} LIMIT 1");
}

function seosys300_set_project_task_status($project_id, $task_id, $status, $mb_id, $opts = array())
{
    $status = strtolower((string) $status);
    if (!seosys300_is_allowed_task_status($status)) {
        seosys300_json_error(422, 'validation_error', '허용되지 않은 작업 상태입니다.');
    }
    $row = seosys300_ensure_project_task_row($project_id, $task_id, $mb_id);
    $now = seosys300_now();
    $started = $row['started_at'];
    $completed = $row['completed_at'];
    if ($status === 'in_progress' && !$started) {
        $started = $now;
    }
    if ($status === 'completed') {
        $completed = $now;
        if (!$started) {
            $started = $now;
        }
    }
    if ($status === 'not_started') {
        $started = null;
        $completed = null;
    }
    $progress = $status === 'completed' ? 100 : ($status === 'in_progress' ? 50 : 0);
    global $g5;
    $table = $g5['seosys300_project_roadmap_tasks_table'];
    $sid = $started ? "'" . seosys300_esc($started) . "'" : 'NULL';
    $cid = $completed ? "'" . seosys300_esc($completed) . "'" : 'NULL';
    seosys300_query("UPDATE `{$table}` SET
        status = '" . seosys300_esc($status) . "',
        progress = {$progress},
        started_at = {$sid},
        completed_at = {$cid},
        updated_at = '{$now}'
        WHERE id = " . (int) $row['id']);

    $task = seosys300_fetch("SELECT title FROM `{$g5['seosys300_roadmap_tasks_table']}` WHERE id = " . (int) $task_id . " LIMIT 1");
    $title = $task ? (string) $task['title'] : '로드맵 작업';
    if ($status === 'in_progress') {
        seosys300_log_activity($project_id, 'ROADMAP_TASK_STARTED', $title . ' 시작', array(
            'entity_type' => 'roadmap_task',
            'entity_id' => (int) $task_id,
        ));
    }
    if ($status === 'completed') {
        seosys300_log_activity($project_id, 'ROADMAP_TASK_COMPLETED', $title . ' 완료', array(
            'entity_type' => 'roadmap_task',
            'entity_id' => (int) $task_id,
        ));
    }
    seosys300_recalculate_project_progress($project_id);
    return seosys300_ensure_project_task_row($project_id, $task_id, $mb_id);
}

function seosys300_auto_complete_task_key($project_id, $task_key)
{
    $task = seosys300_get_task_by_key($task_key);
    if (!$task) {
        return;
    }
    $project = seosys300_fetch("SELECT mb_id FROM `" . $GLOBALS['g5']['seosys300_projects_table'] . "` WHERE id = " . (int) $project_id . " LIMIT 1");
    if (!$project) {
        return;
    }
    $row = seosys300_ensure_project_task_row($project_id, (int) $task['id'], (string) $project['mb_id']);
    if ((string) $row['status'] === 'completed' || (string) $row['status'] === 'skipped') {
        return;
    }
    seosys300_set_project_task_status($project_id, (int) $task['id'], 'completed', (string) $project['mb_id'], array('auto' => 1));
}

function seosys300_sync_auto_roadmap($project_id)
{
    if (!seosys300_roadmap_tables_ready()) {
        return;
    }
    $project_id = (int) $project_id;
    global $g5;
    $project = seosys300_fetch("SELECT * FROM `{$g5['seosys300_projects_table']}` WHERE id = {$project_id} LIMIT 1");
    if (!$project) {
        return;
    }
    seosys300_auto_complete_task_key($project_id, 'project_basic_info');
    if ((int) $project['impressions_goal'] > 0 || (int) $project['traffic_goal'] > 0 || (int) $project['content_goal'] > 0) {
        seosys300_auto_complete_task_key($project_id, 'project_goals');
    }
    $kw = seosys300_project_keywords($project_id);
    if (!empty($kw)) {
        seosys300_auto_complete_task_key($project_id, 'project_keywords');
    }
    if (trim((string) $project['domain']) !== '' && trim((string) $project['domain']) !== '도메인 미정') {
        seosys300_auto_complete_task_key($project_id, 'domain_owned');
        seosys300_auto_complete_task_key($project_id, 'domain_final');
    }
    $order = seosys300_fetch("SELECT * FROM `{$g5['seosys300_website_orders_table']}` WHERE project_id = {$project_id} ORDER BY id DESC LIMIT 1");
    if ($order) {
        $st = (string) $order['status'];
        if ($st !== 'draft') {
            seosys300_auto_complete_task_key($project_id, 'website_order');
            seosys300_auto_complete_task_key($project_id, 'website_need');
        }
        if ($st === 'completed') {
            seosys300_auto_complete_task_key($project_id, 'website_open');
        }
    }
}

function seosys300_recalculate_project_progress($project_id)
{
    if (!seosys300_roadmap_tables_ready()) {
        return 0;
    }
    global $g5;
    $project_id = (int) $project_id;
    $tt = $g5['seosys300_roadmap_tasks_table'];
    $pt = $g5['seosys300_project_roadmap_tasks_table'];
    $tasks = seosys300_fetch_all("SELECT id FROM `{$tt}` WHERE is_active = 1 AND is_required = 1");
    $total = count($tasks);
    $completed = 0;
    if ($total > 0) {
        $ids = array();
        foreach ($tasks as $t) {
            $ids[] = (int) $t['id'];
        }
        $in = implode(',', $ids);
        $done = seosys300_fetch("SELECT COUNT(*) AS cnt FROM `{$pt}` WHERE project_id = {$project_id} AND task_id IN ({$in}) AND status = 'completed'");
        $completed = $done ? (int) $done['cnt'] : 0;
    }
    $pct = seosys300_progress_percent($completed, $total);
    $now = seosys300_now();
    seosys300_query("UPDATE `{$g5['seosys300_projects_table']}` SET progress = {$pct}, updated_at = '{$now}' WHERE id = {$project_id}");
    return $pct;
}

function seosys300_roadmap_for_project($project_id)
{
    global $g5;
    $project_id = (int) $project_id;
    $steps = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_roadmap_steps_table']}` WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
    $tasks = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_roadmap_tasks_table']}` WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
    $states = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_project_roadmap_tasks_table']}` WHERE project_id = {$project_id}");
    $stateMap = array();
    foreach ($states as $st) {
        $stateMap[(int) $st['task_id']] = $st;
    }

    $outSteps = array();
    $firstOpenStep = null;
    foreach ($steps as $step) {
        $stepTasks = array();
        $req = 0;
        $reqDone = 0;
        foreach ($tasks as $task) {
            if ((int) $task['step_id'] !== (int) $step['id']) {
                continue;
            }
            $state = isset($stateMap[(int) $task['id']]) ? $stateMap[(int) $task['id']] : null;
            $status = $state ? (string) $state['status'] : 'not_started';
            $isReq = !empty($task['is_required']);
            if ($isReq) {
                $req++;
                if ($status === 'completed') {
                    $reqDone++;
                }
            }
            $stepTasks[] = array(
                'id' => (int) $task['id'],
                'taskKey' => (string) $task['task_key'],
                'title' => (string) $task['title'],
                'description' => (string) $task['description'],
                'helpText' => (string) $task['help_text'],
                'estimatedMinutes' => (int) $task['estimated_minutes'],
                'relatedTool' => (string) $task['related_tool'],
                'lessonKey' => (string) $task['lesson_key'],
                'completionType' => (string) $task['completion_type'],
                'sortOrder' => (int) $task['sort_order'],
                'isRequired' => $isReq,
                'status' => $status,
                'completedAt' => $state && $state['completed_at'] ? (string) $state['completed_at'] : null,
            );
        }
        $progress = seosys300_progress_percent($reqDone, $req);
        $stepStatus = $progress >= 100 ? 'completed' : ($progress > 0 ? 'in_progress' : 'pending');
        if ($firstOpenStep === null && $stepStatus !== 'completed') {
            $firstOpenStep = $step;
        }
        $outSteps[] = array(
            'id' => (int) $step['id'],
            'stepKey' => (string) $step['step_key'],
            'stepNumber' => (int) $step['sort_order'],
            'title' => (string) $step['title'],
            'description' => (string) $step['description'],
            'sortOrder' => (int) $step['sort_order'],
            'progress' => $progress,
            'status' => $stepStatus,
            'tasks' => $stepTasks,
        );
    }

    $pct = seosys300_recalculate_project_progress($project_id);
    $currentTitle = $firstOpenStep ? (string) $firstOpenStep['title'] : '로드맵 완료';
    $nextGoal = '다음 필수 작업을 진행하세요.';
    foreach ($outSteps as $s) {
        if ($s['status'] !== 'completed') {
            foreach ($s['tasks'] as $t) {
                if ($t['isRequired'] && $t['status'] !== 'completed' && $t['status'] !== 'skipped') {
                    $nextGoal = $t['title'];
                    break 2;
                }
            }
        }
    }

    return array(
        'progress' => $pct,
        'currentStep' => $currentTitle,
        'currentStepNumber' => $firstOpenStep ? (int) $firstOpenStep['sort_order'] : 10,
        'nextGoal' => $nextGoal,
        'steps' => $outSteps,
    );
}

function seosys300_task_result_create($project_id, $task_id, $input)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $url = isset($input['resultUrl']) ? trim((string) $input['resultUrl']) : '';
    if ($url !== '' && !seosys300_valid_http_url($url)) {
        seosys300_json_error(422, 'invalid_url', '결과 주소는 http 또는 https만 사용할 수 있습니다.');
    }
    $keyword = isset($input['keyword']) ? substr(trim((string) $input['keyword']), 0, 191) : '';
    $memo = isset($input['memo']) ? (string) $input['memo'] : '';
    if (strlen($memo) > 4000) {
        seosys300_json_error(422, 'validation_error', '메모가 너무 깁니다.');
    }
    $date = isset($input['resultDate']) ? trim((string) $input['resultDate']) : seosys300_today_date();
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        $date = seosys300_today_date();
    }
    $now = seosys300_now();
    $table = $g5['seosys300_task_results_table'];
    seosys300_query("INSERT INTO `{$table}` SET
        project_id = " . (int) $project_id . ",
        roadmap_task_id = " . (int) $task_id . ",
        mb_id = '" . seosys300_esc($mb_id) . "',
        result_url = '" . seosys300_esc(substr($url, 0, 500)) . "',
        keyword = '" . seosys300_esc($keyword) . "',
        result_date = '" . seosys300_esc($date) . "',
        memo = '" . seosys300_esc($memo) . "',
        screenshot_file_id = " . (isset($input['screenshotFileId']) ? (int) $input['screenshotFileId'] : 0) . ",
        related_tool = '" . seosys300_esc(isset($input['relatedTool']) ? substr((string) $input['relatedTool'], 0, 40) : '') . "',
        metadata_json = '{}',
        is_active = 1,
        created_at = '{$now}',
        updated_at = '{$now}'");
    $id = (int) sql_insert_id();
    seosys300_log_activity($project_id, 'TASK_RESULT_CREATED', '작업 결과 저장', array(
        'entity_type' => 'task_result',
        'entity_id' => $id,
    ));
    return seosys300_task_result_get($id, $project_id);
}

function seosys300_task_result_get($id, $project_id)
{
    global $g5;
    $row = seosys300_fetch("SELECT * FROM `{$g5['seosys300_task_results_table']}` WHERE id = " . (int) $id . " AND project_id = " . (int) $project_id . " AND is_active = 1 LIMIT 1");
    if (!$row) {
        return null;
    }
    return array(
        'id' => (int) $row['id'],
        'projectId' => (int) $row['project_id'],
        'roadmapTaskId' => (int) $row['roadmap_task_id'],
        'resultUrl' => (string) $row['result_url'],
        'keyword' => (string) $row['keyword'],
        'resultDate' => (string) $row['result_date'],
        'memo' => (string) $row['memo'],
        'screenshotFileId' => (int) $row['screenshot_file_id'],
        'relatedTool' => (string) $row['related_tool'],
        'createdAt' => (string) $row['created_at'],
    );
}

function seosys300_task_results_for_project($project_id, $task_id = 0)
{
    global $g5;
    $where = 'project_id = ' . (int) $project_id . ' AND is_active = 1';
    if ($task_id > 0) {
        $where .= ' AND roadmap_task_id = ' . (int) $task_id;
    }
    $rows = seosys300_fetch_all("SELECT * FROM `{$g5['seosys300_task_results_table']}` WHERE {$where} ORDER BY id DESC LIMIT 200");
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_task_result_get((int) $row['id'], $project_id);
    }
    return $out;
}

function seosys300_task_has_result($project_id, $task_id)
{
    global $g5;
    $row = seosys300_fetch("SELECT id FROM `{$g5['seosys300_task_results_table']}` WHERE project_id = " . (int) $project_id . " AND roadmap_task_id = " . (int) $task_id . " AND is_active = 1 LIMIT 1");
    return !empty($row);
}
