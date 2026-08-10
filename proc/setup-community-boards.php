<?php
/**
 * 커뮤니티 게시판 스킨/권한/짧은주소 적용
 * /proc/setup-community-boards.php?key=ONOFF_SETUP_2026
 */
include_once dirname(__FILE__) . '/../common.php';

if (!defined('_GNUBOARD_')) {
    exit;
}

header('Content-Type: text/plain; charset=utf-8');

$key = isset($_GET['key']) ? (string) $_GET['key'] : '';
if ($key !== 'ONOFF_SETUP_2026') {
    echo "forbidden\n";
    exit;
}

$boards = array(
    'notice' => array(
        'subject' => '공지사항',
        'skin' => 'onoff-brand',
        'list' => 1,
        'read' => 1,
        'write' => 10,
        'comment' => 10,
        'use_secret' => 0,
        'use_list_content' => 0,
    ),
    'faq' => array(
        'subject' => '자주묻는질문',
        'skin' => 'onoff-brand',
        'list' => 1,
        'read' => 1,
        'write' => 10,
        'comment' => 10,
        'use_secret' => 0,
        'use_list_content' => 1,
    ),
    'youtube' => array(
        'subject' => '유튜브게시판',
        'skin' => 'onoff-brand',
        'list' => 1,
        'read' => 1,
        'write' => 10,
        'comment' => 10,
        'use_secret' => 0,
        'use_list_content' => 0,
    ),
);

foreach ($boards as $bo_table => $cfg) {
    $row = sql_fetch(" select bo_table from {$g5['board_table']} where bo_table = '" . sql_real_escape_string($bo_table) . "' ");
    if (empty($row['bo_table'])) {
        echo "missing:$bo_table (create in admin first)\n";
        continue;
    }

    $sql = " update {$g5['board_table']}
                set bo_subject = '" . sql_real_escape_string($cfg['subject']) . "',
                    bo_skin = '" . sql_real_escape_string($cfg['skin']) . "',
                    bo_mobile_skin = '" . sql_real_escape_string($cfg['skin']) . "',
                    bo_list_level = '{$cfg['list']}',
                    bo_read_level = '{$cfg['read']}',
                    bo_write_level = '{$cfg['write']}',
                    bo_comment_level = '{$cfg['comment']}',
                    bo_use_secret = '{$cfg['use_secret']}',
                    bo_use_list_content = '{$cfg['use_list_content']}',
                    bo_use_dhtml_editor = '1',
                    bo_table_width = '100',
                    bo_page_rows = '15',
                    bo_mobile_page_rows = '10',
                    bo_subject_len = '80',
                    bo_mobile_subject_len = '40',
                    bo_gallery_cols = '2',
                    bo_gallery_width = '400',
                    bo_gallery_height = '225',
                    bo_mobile_gallery_width = '400',
                    bo_mobile_gallery_height = '225',
                    bo_1_subj = '" . ($bo_table === 'youtube' ? '유튜브URL' : '') . "'
              where bo_table = '" . sql_real_escape_string($bo_table) . "' ";
    $ok = sql_query($sql, false);
    echo ($ok ? 'updated:' : 'fail:') . $bo_table . "\n";
}

// 짧은 주소(숫자형) 사용
sql_query(" update {$g5['config_table']} set cf_bbs_rewrite = '1' ", false);
echo "cf_bbs_rewrite=1\n";

if (function_exists('update_rewrite_rules')) {
    $rw = update_rewrite_rules();
    echo 'rewrite_rules=' . ($rw ? 'ok' : 'skip') . "\n";
}

// 메뉴 보정 (PC me_code 기반 간단 추가)
$menu_items = array(
    array('name' => '공지사항', 'link' => G5_URL . '/notice', 'code' => '10'),
    array('name' => '자주묻는질문', 'link' => G5_URL . '/faq', 'code' => '20'),
    array('name' => '유튜브게시판', 'link' => G5_URL . '/youtube', 'code' => '30'),
);

foreach ($menu_items as $mi) {
    $exists = sql_fetch(" select me_id from {$g5['menu_table']} where me_link = '" . sql_real_escape_string($mi['link']) . "' or me_name = '" . sql_real_escape_string($mi['name']) . "' limit 1 ");
    if (!empty($exists['me_id'])) {
        sql_query(" update {$g5['menu_table']}
                       set me_link = '" . sql_real_escape_string($mi['link']) . "',
                           me_target = 'self',
                           me_use = '1',
                           me_mobile_use = '1'
                     where me_id = '{$exists['me_id']}' ", false);
        echo 'menu-updated:' . $mi['name'] . "\n";
        continue;
    }

    sql_query(" insert into {$g5['menu_table']}
                set me_code = '" . sql_real_escape_string($mi['code']) . "',
                    me_name = '" . sql_real_escape_string($mi['name']) . "',
                    me_link = '" . sql_real_escape_string($mi['link']) . "',
                    me_target = 'self',
                    me_order = '" . (int) $mi['code'] . "',
                    me_use = '1',
                    me_mobile_use = '1' ", false);
    echo 'menu-added:' . $mi['name'] . "\n";
}

echo "done\n";
echo "urls:\n";
echo G5_URL . "/notice\n";
echo G5_URL . "/faq\n";
echo G5_URL . "/youtube\n";
