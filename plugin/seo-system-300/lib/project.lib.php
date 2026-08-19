<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_current_mb_id()
{
    global $member;
    return isset($member['mb_id']) ? (string) $member['mb_id'] : '';
}

function seosys300_project_to_api($row, $keywords = array())
{
    $kw = array();
    foreach ($keywords as $item) {
        $kw[] = array(
            'id' => (int) $item['id'],
            'keyword' => (string) $item['keyword'],
            'priority' => (int) $item['priority'],
            'target' => (string) $item['target'],
        );
    }

    $isActive = !empty($row['is_active']);
    $status = $isActive ? (string) $row['status'] : 'archived';

    return array(
        'id' => (int) $row['id'],
        'mbId' => (string) $row['mb_id'],
        'name' => (string) $row['name'],
        'description' => (string) $row['description'],
        'businessType' => (string) $row['business_type'],
        'purposes' => seosys300_decode_list($row['purposes']),
        'domain' => (string) $row['domain'],
        'websiteStatus' => (string) $row['website_status'],
        'domainStatus' => (string) $row['domain_status'],
        'primaryRegion' => (string) $row['primary_region'],
        'impressionsGoal' => (int) $row['impressions_goal'],
        'trafficGoal' => (int) $row['traffic_goal'],
        'contentGoal' => (int) $row['content_goal'],
        'referringDomainGoal' => (int) $row['referring_domain_goal'],
        'status' => $status,
        'progress' => (int) $row['progress'],
        'isActive' => $isActive ? 1 : 0,
        'keywords' => $kw,
        'createdAt' => (string) $row['created_at'],
        'updatedAt' => (string) $row['updated_at'],
    );
}

function seosys300_project_keywords($project_id)
{
    global $g5;
    $pid = (int) $project_id;
    $table = $g5['seosys300_project_keywords_table'];
    return seosys300_fetch_all("SELECT * FROM `{$table}` WHERE project_id = {$pid} ORDER BY priority ASC, id ASC");
}

function seosys300_get_owned_project($project_id, $mb_id)
{
    global $g5;
    $pid = (int) $project_id;
    $mb = seosys300_esc($mb_id);
    $table = $g5['seosys300_projects_table'];
    return seosys300_fetch("SELECT * FROM `{$table}` WHERE id = {$pid} AND mb_id = '{$mb}' LIMIT 1");
}

function seosys300_replace_keywords($project_id, $keywords)
{
    global $g5;
    $pid = (int) $project_id;
    $ktable = $g5['seosys300_project_keywords_table'];
    seosys300_query("DELETE FROM `{$ktable}` WHERE project_id = {$pid}");

    $seen = array();
    $priority = 0;
    $now = seosys300_now();
    foreach ((array) $keywords as $item) {
        $word = '';
        $target = '';
        if (is_array($item)) {
            $word = isset($item['keyword']) ? trim((string) $item['keyword']) : '';
            $target = isset($item['target']) ? trim((string) $item['target']) : '';
            if (isset($item['priority'])) {
                $priority = (int) $item['priority'];
            }
        } else {
            $word = trim((string) $item);
        }
        $word = substr($word, 0, 191);
        if ($word === '') {
            continue;
        }
        $key = function_exists('mb_strtolower') ? mb_strtolower($word, 'UTF-8') : strtolower($word);
        if (isset($seen[$key])) {
            continue;
        }
        $seen[$key] = true;
        $esc = seosys300_esc($word);
        $tgt = seosys300_esc(substr($target, 0, 100));
        seosys300_query("INSERT INTO `{$ktable}` SET project_id = {$pid}, keyword = '{$esc}', priority = {$priority}, target = '{$tgt}', created_at = '{$now}'");
        $priority++;
    }
}

function seosys300_project_create($input)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $name = isset($input['name']) ? trim((string) $input['name']) : '';
    if ($name === '') {
        seosys300_json_error(422, 'validation_error', '프로젝트 이름을 입력해주세요.');
    }

    $now = seosys300_now();
    $table = $g5['seosys300_projects_table'];
    $fields = array(
        'mb_id' => seosys300_esc($mb_id),
        'name' => seosys300_esc(substr($name, 0, 255)),
        'description' => seosys300_esc(isset($input['description']) ? (string) $input['description'] : ''),
        'business_type' => seosys300_esc(isset($input['businessType']) ? substr((string) $input['businessType'], 0, 100) : ''),
        'purposes' => seosys300_esc(seosys300_json_list(isset($input['purposes']) ? $input['purposes'] : array())),
        'domain' => seosys300_esc(isset($input['domain']) ? substr((string) $input['domain'], 0, 255) : ''),
        'website_status' => seosys300_esc(isset($input['websiteStatus']) ? substr((string) $input['websiteStatus'], 0, 100) : ''),
        'domain_status' => seosys300_esc(isset($input['domainStatus']) ? substr((string) $input['domainStatus'], 0, 150) : ''),
        'primary_region' => seosys300_esc(isset($input['primaryRegion']) ? substr((string) $input['primaryRegion'], 0, 100) : ''),
        'impressions_goal' => isset($input['impressionsGoal']) ? (int) $input['impressionsGoal'] : 0,
        'traffic_goal' => isset($input['trafficGoal']) ? (int) $input['trafficGoal'] : 0,
        'content_goal' => isset($input['contentGoal']) ? (int) $input['contentGoal'] : 0,
        'referring_domain_goal' => isset($input['referringDomainGoal']) ? (int) $input['referringDomainGoal'] : 0,
        'status' => 'active',
        'progress' => 0,
        'is_active' => 1,
        'created_at' => $now,
        'updated_at' => $now,
    );

    $sql = "INSERT INTO `{$table}` SET
        mb_id = '{$fields['mb_id']}',
        name = '{$fields['name']}',
        description = '{$fields['description']}',
        business_type = '{$fields['business_type']}',
        purposes = '{$fields['purposes']}',
        domain = '{$fields['domain']}',
        website_status = '{$fields['website_status']}',
        domain_status = '{$fields['domain_status']}',
        primary_region = '{$fields['primary_region']}',
        impressions_goal = {$fields['impressions_goal']},
        traffic_goal = {$fields['traffic_goal']},
        content_goal = {$fields['content_goal']},
        referring_domain_goal = {$fields['referring_domain_goal']},
        status = '{$fields['status']}',
        progress = {$fields['progress']},
        is_active = 1,
        created_at = '{$now}',
        updated_at = '{$now}'";

    if (!seosys300_begin()) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    if (!seosys300_query($sql)) {
        seosys300_rollback();
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    $id = (int) sql_insert_id();
    if ($id < 1) {
        seosys300_rollback();
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    seosys300_replace_keywords($id, isset($input['keywords']) ? $input['keywords'] : array());
    seosys300_commit();
    seosys300_log_activity($id, 'PROJECT_CREATED', '프로젝트가 생성되었습니다.', array(
        'entity_type' => 'project',
        'entity_id' => $id,
    ));
    seosys300_sync_auto_roadmap($id);

    $row = seosys300_get_owned_project($id, $mb_id);
    return seosys300_project_to_api($row, seosys300_project_keywords($id));
}

function seosys300_project_update($project_id, $input)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $row = seosys300_get_owned_project($project_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }

    $now = seosys300_now();
    $table = $g5['seosys300_projects_table'];
    $pid = (int) $project_id;
    $sets = array("updated_at = '{$now}'");

    $map = array(
        'name' => array('name', 255),
        'description' => array('description', 0),
        'businessType' => array('business_type', 100),
        'domain' => array('domain', 255),
        'websiteStatus' => array('website_status', 100),
        'domainStatus' => array('domain_status', 150),
        'primaryRegion' => array('primary_region', 100),
    );
    foreach ($map as $inKey => $col) {
        if (array_key_exists($inKey, $input)) {
            $val = (string) $input[$inKey];
            if ($col[1] > 0) {
                $val = substr($val, 0, $col[1]);
            }
            $sets[] = "`{$col[0]}` = '" . seosys300_esc($val) . "'";
        }
    }
    if (array_key_exists('purposes', $input)) {
        $sets[] = "purposes = '" . seosys300_esc(seosys300_json_list($input['purposes'])) . "'";
    }
    foreach (array('impressionsGoal' => 'impressions_goal', 'trafficGoal' => 'traffic_goal', 'contentGoal' => 'content_goal', 'referringDomainGoal' => 'referring_domain_goal') as $inKey => $col) {
        if (array_key_exists($inKey, $input)) {
            $sets[] = "`{$col}` = " . (int) $input[$inKey];
        }
    }

    if (!seosys300_begin()) {
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    if (!seosys300_query("UPDATE `{$table}` SET " . implode(', ', $sets) . " WHERE id = {$pid} AND mb_id = '" . seosys300_esc($mb_id) . "'")) {
        seosys300_rollback();
        seosys300_json_error(500, 'save_failed', '저장 중 문제가 발생했습니다.');
    }
    if (array_key_exists('keywords', $input)) {
        seosys300_replace_keywords($pid, $input['keywords']);
    }
    seosys300_commit();
    seosys300_log_activity($pid, 'PROJECT_UPDATED', '프로젝트가 수정되었습니다.', array(
        'entity_type' => 'project',
        'entity_id' => $pid,
    ));
    seosys300_sync_auto_roadmap($pid);
    return seosys300_project_to_api($row, seosys300_project_keywords($pid));
}

function seosys300_project_archive($project_id)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $row = seosys300_get_owned_project($project_id, $mb_id);
    if (!$row) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    $pid = (int) $project_id;
    $now = seosys300_now();
    $table = $g5['seosys300_projects_table'];
    seosys300_query("UPDATE `{$table}` SET is_active = 0, status = 'archived', updated_at = '{$now}' WHERE id = {$pid} AND mb_id = '" . seosys300_esc($mb_id) . "'");
    $row = seosys300_get_owned_project($pid, $mb_id);
    return seosys300_project_to_api($row, seosys300_project_keywords($pid));
}

function seosys300_project_list_for_member($include_archived = false)
{
    global $g5;
    $mb_id = seosys300_current_mb_id();
    $table = $g5['seosys300_projects_table'];
    $where = "mb_id = '" . seosys300_esc($mb_id) . "'";
    if (!$include_archived) {
        $where .= ' AND is_active = 1';
    }
    $rows = seosys300_fetch_all("SELECT * FROM `{$table}` WHERE {$where} ORDER BY updated_at DESC, id DESC");
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_project_to_api($row, seosys300_project_keywords($row['id']));
    }
    return $out;
}

function seosys300_project_detail_for_member($project_id)
{
    $row = seosys300_get_owned_project($project_id, seosys300_current_mb_id());
    if (!$row) {
        seosys300_json_error(404, 'project_not_found', '프로젝트를 찾을 수 없습니다.');
    }
    return seosys300_project_to_api($row, seosys300_project_keywords($row['id']));
}

function seosys300_admin_project_list()
{
    global $g5;
    $table = $g5['seosys300_projects_table'];
    $rows = seosys300_fetch_all("SELECT * FROM `{$table}` ORDER BY created_at DESC, id DESC LIMIT 200");
    $out = array();
    foreach ($rows as $row) {
        $out[] = seosys300_project_to_api($row, seosys300_project_keywords($row['id']));
    }
    return $out;
}
