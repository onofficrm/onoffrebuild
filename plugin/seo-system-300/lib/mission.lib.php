<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_mission_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_daily_missions_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_daily_missions_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_mission_to_api($row, $task = null)
{
    return array(
        'id' => (int) $row['id'],
        'projectId' => (int) $row['project_id'],
        'roadmapTaskId' => (int) $row['roadmap_task_id'],
        'missionDate' => (string) $row['mission_date'],
        'status' => (string) $row['status'],
        'sortOrder' => (int) $row['sort_order'],
        'completedAt' => $row['completed_at'] ? (string) $row['completed_at'] : null,
        'title' => $task ? (string) $task['title'] : '',
        'description' => $task ? (string) $task['description'] : '',
        'completionType' => $task ? (string) $task['completion_type'] : 'check',
        'relatedTool' => $task ? (string) $task['related_tool'] : '',
        'estimatedMinutes' => $task ? (int) $task['estimated_minutes'] : 0,
        'isCompleted' => (string) $row['status'] === 'completed',
    );
}

function seosys300_missions_for_date($project_id, $mb_id, $date)
{
    global $g5;
    $project_id = (int) $project_id;
    $table = $g5['seosys300_daily_missions_table'];
    $tt = $g5['seosys300_roadmap_tasks_table'];
    $sql = "SELECT m.*, t.title, t.description, t.completion_type, t.related_tool, t.estimated_minutes
        FROM `{$table}` m
        LEFT JOIN `{$tt}` t ON t.id = m.roadmap_task_id
        WHERE m.project_id = {$project_id}
          AND m.mb_id = '" . seosys300_esc($mb_id) . "'
          AND m.mission_date = '" . seosys300_esc($date) . "'
        ORDER BY m.sort_order ASC, m.id ASC";
    $rows = seosys300_fetch_all($sql);
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_mission_to_api($row, $row);
    }
    return $out;
}

function seosys300_generate_missions($project_id)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $date = seosys300_today_date();
    $existing = seosys300_missions_for_date($project_id, $mb_id, $date);
    if (!empty($existing)) {
        return $existing;
    }

    $roadmap = seosys300_roadmap_for_project($project_id);
    $currentNum = isset($roadmap['currentStepNumber']) ? (int) $roadmap['currentStepNumber'] : 1;
    $candidates = array();
    foreach ($roadmap['steps'] as $step) {
        foreach ($step['tasks'] as $task) {
            $candidates[] = array(
                'task_id' => (int) $task['id'],
                'status' => (string) $task['status'],
                'is_required' => !empty($task['isRequired']),
                'is_current_step' => (int) $step['stepNumber'] === $currentNum,
                'step_sort' => (int) $step['sortOrder'],
                'task_sort' => (int) $task['sortOrder'],
            );
        }
    }
    $ids = seosys300_pick_mission_task_ids($candidates, 3);
    $now = seosys300_now();
    $table = $g5['seosys300_daily_missions_table'];
    $sort = 1;
    foreach ($ids as $tid) {
        seosys300_query("INSERT IGNORE INTO `{$table}` SET
            project_id = " . (int) $project_id . ",
            roadmap_task_id = " . (int) $tid . ",
            mb_id = '" . seosys300_esc($mb_id) . "',
            mission_date = '" . seosys300_esc($date) . "',
            status = 'open',
            sort_order = {$sort},
            assigned_by = 'system',
            completed_at = NULL,
            created_at = '{$now}',
            updated_at = '{$now}'");
        $sort++;
    }
    return seosys300_missions_for_date($project_id, $mb_id, $date);
}

function seosys300_owned_mission($mission_id, $mb_id)
{
    global $g5;
    return seosys300_fetch("SELECT * FROM `{$g5['seosys300_daily_missions_table']}` WHERE id = " . (int) $mission_id . " AND mb_id = '" . seosys300_esc($mb_id) . "' LIMIT 1");
}

function seosys300_complete_mission($mission_id)
{
    $mb_id = seosys300_current_mb_id();
    $row = seosys300_owned_mission($mission_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'mission_not_found', '오늘의 미션을 찾을 수 없습니다.');
    }
    $project = seosys300_get_owned_project($row['project_id'], $mb_id);
    if (!$project) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    global $g5;
    $task = seosys300_fetch("SELECT * FROM `{$g5['seosys300_roadmap_tasks_table']}` WHERE id = " . (int) $row['roadmap_task_id'] . " LIMIT 1");
    if ($task && (string) $task['completion_type'] === 'result_required' && !seosys300_task_has_result((int) $row['project_id'], (int) $row['roadmap_task_id'])) {
        seosys300_json_error(409, 'result_required', '작업 결과를 저장한 뒤 완료할 수 있습니다.');
    }
    seosys300_set_project_task_status((int) $row['project_id'], (int) $row['roadmap_task_id'], 'completed', $mb_id);
    $now = seosys300_now();
    seosys300_query("UPDATE `{$g5['seosys300_daily_missions_table']}` SET status = 'completed', completed_at = '{$now}', updated_at = '{$now}' WHERE id = " . (int) $mission_id);
    seosys300_log_activity((int) $row['project_id'], 'MISSION_COMPLETED', $task ? $task['title'] . ' 미션 완료' : '미션 완료', array(
        'entity_type' => 'mission',
        'entity_id' => (int) $mission_id,
    ));
    return seosys300_missions_for_date((int) $row['project_id'], $mb_id, (string) $row['mission_date']);
}

function seosys300_reopen_mission($mission_id)
{
    $mb_id = seosys300_current_mb_id();
    $row = seosys300_owned_mission($mission_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'mission_not_found', '오늘의 미션을 찾을 수 없습니다.');
    }
    seosys300_set_project_task_status((int) $row['project_id'], (int) $row['roadmap_task_id'], 'in_progress', $mb_id);
    $now = seosys300_now();
    global $g5;
    seosys300_query("UPDATE `{$g5['seosys300_daily_missions_table']}` SET status = 'open', completed_at = NULL, updated_at = '{$now}' WHERE id = " . (int) $mission_id);
    return seosys300_missions_for_date((int) $row['project_id'], $mb_id, (string) $row['mission_date']);
}
