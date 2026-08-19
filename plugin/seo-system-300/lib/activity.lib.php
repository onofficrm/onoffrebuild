<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_activity_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_activities_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_activities_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_record_event($project_id, $type, $title, $opts = array())
{
    return seosys300_log_activity($project_id, $type, $title, $opts);
}

function seosys300_log_activity($project_id, $type, $title, $opts = array())
{
    global $g5;
    if (!seosys300_activity_tables_ready()) {
        return 0;
    }
    static $seen = array();
    $project_id = (int) $project_id;
    $type = preg_replace('/[^A-Z0-9_]/', '', strtoupper((string) $type));
    $entity_type = isset($opts['entity_type']) ? substr((string) $opts['entity_type'], 0, 40) : '';
    $entity_id = isset($opts['entity_id']) ? (int) $opts['entity_id'] : 0;
    $dedupe = $type . '|' . $project_id . '|' . $entity_type . '|' . $entity_id . '|' . $title;
    if (isset($seen[$dedupe])) {
        return 0;
    }
    $seen[$dedupe] = true;

    $mb = isset($opts['mb_id']) ? (string) $opts['mb_id'] : seosys300_current_mb_id();
    $desc = isset($opts['description']) ? substr((string) $opts['description'], 0, 255) : '';
    $meta = isset($opts['metadata']) ? $opts['metadata'] : array();
    $now = seosys300_now();
    $table = $g5['seosys300_activities_table'];
    $sql = "INSERT INTO `{$table}` SET
        project_id = {$project_id},
        mb_id = '" . seosys300_esc($mb) . "',
        activity_type = '" . seosys300_esc($type) . "',
        entity_type = '" . seosys300_esc($entity_type) . "',
        entity_id = {$entity_id},
        title = '" . seosys300_esc(substr((string) $title, 0, 191)) . "',
        description = '" . seosys300_esc($desc) . "',
        metadata_json = '" . seosys300_esc(json_encode($meta, JSON_UNESCAPED_UNICODE)) . "',
        created_at = '{$now}'";
    if (!seosys300_query($sql)) {
        return 0;
    }
    return (int) sql_insert_id();
}

function seosys300_activity_list($project_id, $limit = 30, $before_id = 0, $type = '')
{
    global $g5;
    $project_id = (int) $project_id;
    $limit = max(1, min(100, (int) $limit));
    $before_id = (int) $before_id;
    $table = $g5['seosys300_activities_table'];
    $where = "project_id = {$project_id}";
    if ($before_id > 0) {
        $where .= " AND id < {$before_id}";
    }
    if ($type !== '') {
        $where .= " AND activity_type = '" . seosys300_esc(strtoupper($type)) . "'";
    }
    $rows = seosys300_fetch_all("SELECT * FROM `{$table}` WHERE {$where} ORDER BY id DESC LIMIT {$limit}");
    $out = array();
    foreach ($rows as $row) {
        $out[] = array(
            'id' => (int) $row['id'],
            'projectId' => (int) $row['project_id'],
            'mbId' => (string) $row['mb_id'],
            'activityType' => (string) $row['activity_type'],
            'entityType' => (string) $row['entity_type'],
            'entityId' => (int) $row['entity_id'],
            'title' => (string) $row['title'],
            'description' => (string) $row['description'],
            'createdAt' => (string) $row['created_at'],
        );
    }
    return $out;
}
