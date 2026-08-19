<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_esc($value)
{
    return sql_real_escape_string((string) $value);
}

function seosys300_now()
{
    return date('Y-m-d H:i:s');
}

function seosys300_query($sql)
{
    $result = sql_query($sql, false);
    if ($result === false) {
        seosys300_log('sql failed');
        return false;
    }
    return $result;
}

function seosys300_fetch($sql)
{
    $result = seosys300_query($sql);
    if (!$result) {
        return null;
    }
    $row = sql_fetch_array($result);
    return $row ? $row : null;
}

function seosys300_fetch_all($sql)
{
    $result = seosys300_query($sql);
    $rows = array();
    if (!$result) {
        return $rows;
    }
    while ($row = sql_fetch_array($result)) {
        $rows[] = $row;
    }
    return $rows;
}

function seosys300_tables_ready()
{
    global $g5;
    if (empty($g5['seosys300_projects_table'])) {
        return false;
    }
    $table = seosys300_esc($g5['seosys300_projects_table']);
    $row = seosys300_fetch("SHOW TABLES LIKE '{$table}'");
    return !empty($row);
}

function seosys300_require_tables()
{
    if (!seosys300_tables_ready()) {
        seosys300_json_error(503, 'tables_missing', '프로젝트 저장 테이블이 아직 준비되지 않았습니다. 관리자에게 문의하세요.');
    }
}

function seosys300_begin()
{
    return seosys300_query('START TRANSACTION') !== false;
}

function seosys300_commit()
{
    return seosys300_query('COMMIT') !== false;
}

function seosys300_rollback()
{
    return seosys300_query('ROLLBACK') !== false;
}

function seosys300_json_list($value)
{
    if (is_array($value)) {
        return json_encode(array_values($value), JSON_UNESCAPED_UNICODE);
    }
    $str = trim((string) $value);
    if ($str === '') {
        return '[]';
    }
    $decoded = json_decode($str, true);
    if (is_array($decoded)) {
        return json_encode(array_values($decoded), JSON_UNESCAPED_UNICODE);
    }
    return json_encode(array($str), JSON_UNESCAPED_UNICODE);
}

function seosys300_decode_list($value)
{
    $decoded = json_decode((string) $value, true);
    if (!is_array($decoded)) {
        return array();
    }
    $out = array();
    foreach ($decoded as $item) {
        if (is_string($item) || is_numeric($item)) {
            $out[] = (string) $item;
        }
    }
    return $out;
}
