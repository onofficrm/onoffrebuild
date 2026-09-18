<?php
$sub_menu = '200960';
require_once './_common.php';

global $is_admin, $g5, $config;

if ($is_admin !== 'super') {
    alert('최고관리자만 접근할 수 있습니다.');
}

require_once G5_LIB_PATH . '/onoff-education.lib.php';
onoff_education_ensure_table();

$table = onoff_education_enrollment_table();

function onoff_edu_admin_escape($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function onoff_edu_admin_status_label($status)
{
    $map = array(
        'pending_deposit' => '입금대기',
        'active' => '수강중',
        'expired' => '만료',
        'cancelled' => '취소',
    );
    return isset($map[$status]) ? $map[$status] : $status;
}

function onoff_edu_admin_status_badge($status)
{
    $class_map = array(
        'pending_deposit' => '#b45309',
        'active' => '#047857',
        'expired' => '#475569',
        'cancelled' => '#b91c1c',
    );
    $color = isset($class_map[$status]) ? $class_map[$status] : '#334155';
    return '<span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;background:#f8fafc;border:1px solid #e2e8f0;color:' . $color . ';font-weight:700;font-size:12px;">'
        . onoff_edu_admin_escape(onoff_edu_admin_status_label($status))
        . '</span>';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_admin_token();
    $en_id = isset($_POST['en_id']) ? (int) $_POST['en_id'] : 0;
    if ($en_id < 1) {
        alert('수강권 ID가 올바르지 않습니다.');
    }
    $before = function_exists('onoff_education_get_enrollment') ? onoff_education_get_enrollment($en_id) : null;
    onoff_education_update_enrollment($en_id, array(
        'mb_id' => $_POST['mb_id'] ?? '',
        'status' => $_POST['status'] ?? 'pending_deposit',
        'deposit_amount' => $_POST['deposit_amount'] ?? 0,
        'depositor_name' => $_POST['depositor_name'] ?? '',
        'starts_at' => $_POST['starts_at'] ?? '',
        'ends_at' => $_POST['ends_at'] ?? '',
        'admin_memo' => $_POST['admin_memo'] ?? '',
    ));
    $after = function_exists('onoff_education_get_enrollment') ? onoff_education_get_enrollment($en_id) : null;
    if (is_array($after)
        && $after['status'] === 'active'
        && (!is_array($before) || $before['status'] !== 'active')
        && empty($after['kakao_active_sent_at'])) {
        $notifier = G5_PATH . '/components/inquiry-notifier.php';
        if (is_file($notifier)) {
            include_once $notifier;
            if (function_exists('onoff_kakao_alimtalk_is_enabled')
                && onoff_kakao_alimtalk_is_enabled()
                && function_exists('onoff_send_education_active_kakao_notification')) {
                $kakao_result = onoff_send_education_active_kakao_notification($after);
                if (function_exists('onoff_education_mark_kakao_active_notification')) {
                    $kakao_sent = !empty($kakao_result['ok']) && empty($kakao_result['skipped']);
                    $kakao_message = !empty($kakao_result['skipped']) ? '' : (isset($kakao_result['message']) ? $kakao_result['message'] : '');
                    onoff_education_mark_kakao_active_notification($en_id, $kakao_sent, $kakao_message);
                }
            }
        }
    }
    goto_url('./onoff_education_enrollments.php');
}

$status = isset($_GET['status']) ? onoff_education_normalize_status($_GET['status']) : '';
$stx = isset($_GET['stx']) ? trim(strip_tags((string) $_GET['stx'])) : '';

$where = " where (1) ";
if ($status !== '') {
    $where .= " and status = '" . sql_real_escape_string($status) . "' ";
}
if ($stx !== '') {
    $safe = sql_real_escape_string($stx);
    $where .= " and (mb_id like '%{$safe}%' or applicant_name like '%{$safe}%' or phone like '%{$safe}%' or email like '%{$safe}%' or course_id like '%{$safe}%' or admin_memo like '%{$safe}%') ";
}

$sql = " select count(*) as cnt from {$table} {$where} ";
$row = sql_fetch($sql);
$total_count = (int) ($row['cnt'] ?? 0);
$status_counts = array(
    'pending_deposit' => 0,
    'active' => 0,
    'expired' => 0,
    'cancelled' => 0,
);
$count_result = sql_query(" select status, count(*) as cnt from {$table} group by status ");
while ($count_row = sql_fetch_array($count_result)) {
    $count_status = onoff_education_normalize_status($count_row['status']);
    $status_counts[$count_status] = (int) $count_row['cnt'];
}
$rows = 20;
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
$total_page = max(1, (int) ceil($total_count / $rows));
$from_record = ($page - 1) * $rows;

$result = sql_query(" select * from {$table} {$where} order by en_id desc limit {$from_record}, {$rows} ");

$g5['title'] = 'ONOFF 교육 수강권 관리';
require_once './admin.head.php';
$admin_token = get_admin_token();
?>

<div class="local_ov01 local_ov">
    <span class="btn_ov01"><span class="ov_txt">전체 수강권</span><span class="ov_num"><?php echo number_format($total_count); ?>건</span></span>
    <?php foreach ($status_counts as $s => $cnt) { ?>
        <a class="btn_ov01" href="./onoff_education_enrollments.php?status=<?php echo urlencode($s); ?>">
            <span class="ov_txt"><?php echo onoff_edu_admin_escape(onoff_edu_admin_status_label($s)); ?></span>
            <span class="ov_num"><?php echo number_format($cnt); ?>건</span>
        </a>
    <?php } ?>
</div>

<form method="get" class="local_sch01 local_sch">
    <label for="status" class="sound_only">상태</label>
    <select name="status" id="status">
        <option value="">전체</option>
        <?php foreach (array('pending_deposit', 'active', 'expired', 'cancelled') as $s) { ?>
            <option value="<?php echo $s; ?>" <?php echo $status === $s ? 'selected' : ''; ?>>
                <?php echo onoff_edu_admin_escape(onoff_edu_admin_status_label($s)); ?>
            </option>
        <?php } ?>
    </select>
    <label for="stx" class="sound_only">검색어</label>
    <input type="text" name="stx" id="stx" value="<?php echo onoff_edu_admin_escape($stx); ?>" class="frm_input" placeholder="회원ID/이름/연락처/이메일/과정/메모">
    <button type="submit" class="btn_submit">검색</button>
    <a href="./onoff_education_enrollments.php" class="btn btn_02">전체</a>
</form>

<div class="tbl_head01 tbl_wrap">
    <table>
        <caption><?php echo $g5['title']; ?> 목록</caption>
        <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">상태</th>
            <th scope="col">신청자</th>
            <th scope="col">수강권</th>
            <th scope="col">계좌입금</th>
            <th scope="col">기간</th>
            <th scope="col">계약글</th>
            <th scope="col">관리</th>
        </tr>
        </thead>
        <tbody>
        <?php if ($total_count < 1) { ?>
            <tr><td colspan="8" class="empty_table">등록된 수강권이 없습니다.</td></tr>
        <?php } ?>
        <?php for ($i = 0; $row = sql_fetch_array($result); $i++) { ?>
            <?php $form_id = 'enrollment_form_' . (int) $row['en_id']; ?>
            <tr>
                <td class="td_num"><?php echo (int) $row['en_id']; ?></td>
                <td><?php echo onoff_edu_admin_status_badge($row['status']); ?></td>
                <td>
                    <strong><?php echo onoff_edu_admin_escape($row['applicant_name']); ?></strong><br>
                    <label class="sound_only" for="mb_id_<?php echo (int) $row['en_id']; ?>">회원ID</label>
                    <input form="<?php echo $form_id; ?>" type="text" name="mb_id" id="mb_id_<?php echo (int) $row['en_id']; ?>" value="<?php echo onoff_edu_admin_escape($row['mb_id']); ?>" class="frm_input" style="width:150px;" placeholder="통합 회원ID"><br>
                    <span><?php echo onoff_edu_admin_escape($row['phone']); ?></span><br>
                    <span><?php echo onoff_edu_admin_escape($row['email']); ?></span>
                </td>
                <td>
                    <?php echo onoff_edu_admin_escape($row['course_id']); ?><br>
                    <span>source: <?php echo onoff_edu_admin_escape($row['source']); ?></span>
                    <br><span>신청: <?php echo onoff_edu_admin_escape($row['created_at']); ?></span>
                    <?php if (!empty($row['updated_at'])) { ?><br><span>수정: <?php echo onoff_edu_admin_escape($row['updated_at']); ?></span><?php } ?>
                    <?php if (!empty($row['kakao_active_sent_at'])) { ?><br><span>카카오 안내: <?php echo onoff_edu_admin_escape($row['kakao_active_sent_at']); ?></span><?php } ?>
                    <?php if (!empty($row['kakao_last_error'])) { ?><br><span style="color:#b91c1c;">카카오 오류: <?php echo onoff_edu_admin_escape($row['kakao_last_error']); ?></span><?php } ?>
                </td>
                <td>
                        <label class="sound_only" for="deposit_amount_<?php echo (int) $row['en_id']; ?>">입금액</label>
                        <input form="<?php echo $form_id; ?>" type="number" name="deposit_amount" id="deposit_amount_<?php echo (int) $row['en_id']; ?>" value="<?php echo (int) $row['deposit_amount']; ?>" class="frm_input" style="width:110px;" min="0"> 원<br>
                        <label class="sound_only" for="depositor_name_<?php echo (int) $row['en_id']; ?>">입금자명</label>
                        <input form="<?php echo $form_id; ?>" type="text" name="depositor_name" id="depositor_name_<?php echo (int) $row['en_id']; ?>" value="<?php echo onoff_edu_admin_escape($row['depositor_name']); ?>" class="frm_input" style="width:130px;" placeholder="입금자명">
                </td>
                <td>
                        <label class="sound_only" for="starts_at_<?php echo (int) $row['en_id']; ?>">시작일</label>
                        <input form="<?php echo $form_id; ?>" type="text" name="starts_at" id="starts_at_<?php echo (int) $row['en_id']; ?>" value="<?php echo onoff_edu_admin_escape($row['starts_at']); ?>" class="frm_input" style="width:145px;" placeholder="YYYY-MM-DD HH:MM:SS"><br>
                        <label class="sound_only" for="ends_at_<?php echo (int) $row['en_id']; ?>">종료일</label>
                        <input form="<?php echo $form_id; ?>" type="text" name="ends_at" id="ends_at_<?php echo (int) $row['en_id']; ?>" value="<?php echo onoff_edu_admin_escape($row['ends_at']); ?>" class="frm_input" style="width:145px;" placeholder="YYYY-MM-DD HH:MM:SS">
                </td>
                <td>
                    <?php if ($row['contract_bo_table'] && (int) $row['contract_wr_id'] > 0) { ?>
                        <a href="<?php echo G5_BBS_URL; ?>/board.php?bo_table=<?php echo urlencode($row['contract_bo_table']); ?>&amp;wr_id=<?php echo (int) $row['contract_wr_id']; ?>" target="_blank" rel="noopener noreferrer">
                            #<?php echo (int) $row['contract_wr_id']; ?>
                        </a>
                    <?php } else { ?>
                        -
                    <?php } ?>
                </td>
                <td>
                        <form id="<?php echo $form_id; ?>" method="post" class="onoff-edu-enrollment-form">
                            <input type="hidden" name="token" value="<?php echo $admin_token; ?>">
                            <input type="hidden" name="en_id" value="<?php echo (int) $row['en_id']; ?>">
                        </form>
                        <label class="sound_only" for="status_<?php echo (int) $row['en_id']; ?>">상태</label>
                        <select form="<?php echo $form_id; ?>" name="status" id="status_<?php echo (int) $row['en_id']; ?>">
                            <?php foreach (array('pending_deposit', 'active', 'expired', 'cancelled') as $s) { ?>
                                <option value="<?php echo $s; ?>" <?php echo $row['status'] === $s ? 'selected' : ''; ?>>
                                    <?php echo onoff_edu_admin_escape(onoff_edu_admin_status_label($s)); ?>
                                </option>
                            <?php } ?>
                        </select><br>
                        <label class="sound_only" for="admin_memo_<?php echo (int) $row['en_id']; ?>">관리 메모</label>
                        <textarea form="<?php echo $form_id; ?>" name="admin_memo" id="admin_memo_<?php echo (int) $row['en_id']; ?>" class="frm_input" style="width:160px;height:50px;" placeholder="관리 메모"><?php echo onoff_edu_admin_escape($row['admin_memo']); ?></textarea><br>
                        <button form="<?php echo $form_id; ?>" type="submit" class="btn btn_03">저장</button>
                </td>
            </tr>
        <?php } ?>
        </tbody>
    </table>
</div>

<?php
echo get_paging(G5_IS_MOBILE ? $config['cf_mobile_pages'] : $config['cf_write_pages'], $page, $total_page, './onoff_education_enrollments.php?status=' . urlencode($status) . '&amp;stx=' . urlencode($stx) . '&amp;page=');

require_once './admin.tail.php';
