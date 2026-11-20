<?php
$sub_menu = '200966';
require_once './_common.php';

global $is_admin, $g5, $config, $member;

if ($is_admin !== 'super') {
    alert('최고관리자만 접근할 수 있습니다.');
}

require_once G5_LIB_PATH . '/onoff-service-contract.lib.php';
onoff_service_contract_ensure_tables();

$api_base = onoff_service_contract_api_base();
$actor_mb_id = is_array($member) ? (string) ($member['mb_id'] ?? 'admin') : 'admin';

function onoff_sc_admin_escape($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

function onoff_sc_admin_status_badge($status)
{
    $map = array(
        ONOFF_SC_STATUS_PENDING => '#64748b',
        ONOFF_SC_STATUS_IN_PROGRESS => '#0369a1',
        ONOFF_SC_STATUS_REVIEW_PENDING => '#b45309',
        ONOFF_SC_STATUS_SIGNED => '#047857',
        ONOFF_SC_STATUS_REJECTED => '#b91c1c',
        ONOFF_SC_STATUS_CANCELLED => '#475569',
        ONOFF_SC_STATUS_EXPIRED => '#334155',
        ONOFF_SC_STATUS_RENEWAL => '#7c3aed',
    );
    $color = isset($map[$status]) ? $map[$status] : '#334155';
    $label = onoff_service_contract_status_label($status);
    return '<span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;background:#f8fafc;border:1px solid #e2e8f0;color:' . $color . ';font-weight:700;font-size:12px;">'
        . onoff_sc_admin_escape($label)
        . '</span>';
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    check_admin_token();
    $sc_id = isset($_POST['sc_id']) ? (int) $_POST['sc_id'] : 0;
    $action = preg_replace('/[^a-zA-Z]/', '', (string) ($_POST['action'] ?? ''));
    $reason = isset($_POST['reason']) ? trim((string) $_POST['reason']) : '';

    if ($sc_id < 1) {
        alert('계약 ID가 올바르지 않습니다.');
    }
    if ($action === '') {
        alert('작업을 선택해 주세요.');
    }
    if ($action === 'reject' && $reason === '') {
        alert('반려 사유를 입력해 주세요.');
    }

    $allowed = array('approve', 'reject', 'cancel', 'expire');
    if (!in_array($action, $allowed, true)) {
        alert('지원하지 않는 작업입니다.');
    }

    $result = onoff_service_contract_admin_transition($sc_id, $action, $reason, $actor_mb_id, 'admin');
    if (empty($result['ok'])) {
        alert((string) ($result['message'] ?? '처리에 실패했습니다.'));
    }

    $redirect = './onoff_service_contracts.php';
    if ($sc_id > 0) {
        $redirect .= '?sc_id=' . $sc_id;
    }
    $status_q = isset($_POST['return_status']) ? trim((string) $_POST['return_status']) : '';
    $stx_q = isset($_POST['return_stx']) ? trim((string) $_POST['return_stx']) : '';
    if ($status_q !== '' || $stx_q !== '') {
        $redirect = './onoff_service_contracts.php?' . http_build_query(array(
            'status' => $status_q,
            'stx' => $stx_q,
            'sc_id' => $sc_id > 0 ? $sc_id : null,
        ));
    }
    goto_url($redirect);
}

$status = isset($_GET['status']) ? preg_replace('/[^a-z0-9_\-]/i', '', (string) $_GET['status']) : '';
$stx = isset($_GET['stx']) ? trim(strip_tags((string) $_GET['stx'])) : '';
$detail_sc_id = isset($_GET['sc_id']) ? (int) $_GET['sc_id'] : 0;
$page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;

$list = onoff_service_contract_admin_list(array(
    'q' => $stx,
    'status' => $status,
    'page' => $page,
    'limit' => 20,
));

$total_count = (int) ($list['total'] ?? 0);
$rows = (int) ($list['limit'] ?? 20);
$total_page = max(1, (int) ceil($total_count / $rows));
$items = is_array($list['items']) ? $list['items'] : array();

$status_counts = array();
$table = onoff_service_contract_table();
$count_result = sql_query(" select sc_status, count(*) as cnt from {$table} group by sc_status ");
while ($count_row = sql_fetch_array($count_result)) {
    $status_counts[(string) $count_row['sc_status']] = (int) $count_row['cnt'];
}

$detail = null;
if ($detail_sc_id > 0) {
    $detail = onoff_service_contract_admin_detail($detail_sc_id);
}

$g5['title'] = 'ONOFF 서비스 계약 관리';
require_once './admin.head.php';
$admin_token = get_admin_token();
?>

<div class="local_ov01 local_ov">
    <span class="btn_ov01"><span class="ov_txt">전체 계약</span><span class="ov_num"><?php echo number_format($total_count); ?>건</span></span>
    <?php
    $count_statuses = array(
        ONOFF_SC_STATUS_REVIEW_PENDING,
        ONOFF_SC_STATUS_SIGNED,
        ONOFF_SC_STATUS_REJECTED,
        ONOFF_SC_STATUS_IN_PROGRESS,
        ONOFF_SC_STATUS_PENDING,
    );
    foreach ($count_statuses as $s) {
        $cnt = isset($status_counts[$s]) ? $status_counts[$s] : 0;
        ?>
        <a class="btn_ov01" href="./onoff_service_contracts.php?status=<?php echo urlencode($s); ?>">
            <span class="ov_txt"><?php echo onoff_sc_admin_escape(onoff_service_contract_status_label($s)); ?></span>
            <span class="ov_num"><?php echo number_format($cnt); ?>건</span>
        </a>
    <?php } ?>
</div>

<form method="get" class="local_sch01 local_sch">
    <label for="status" class="sound_only">상태</label>
    <select name="status" id="status">
        <option value="">전체</option>
        <?php
        $all_statuses = array(
            ONOFF_SC_STATUS_PENDING,
            ONOFF_SC_STATUS_IN_PROGRESS,
            ONOFF_SC_STATUS_REVIEW_PENDING,
            ONOFF_SC_STATUS_SIGNED,
            ONOFF_SC_STATUS_REJECTED,
            ONOFF_SC_STATUS_CANCELLED,
            ONOFF_SC_STATUS_EXPIRED,
            ONOFF_SC_STATUS_RENEWAL,
        );
        foreach ($all_statuses as $s) {
            ?>
            <option value="<?php echo onoff_sc_admin_escape($s); ?>" <?php echo $status === $s ? 'selected' : ''; ?>>
                <?php echo onoff_sc_admin_escape(onoff_service_contract_status_label($s)); ?>
            </option>
        <?php } ?>
    </select>
    <label for="stx" class="sound_only">검색어</label>
    <input type="text" name="stx" id="stx" value="<?php echo onoff_sc_admin_escape($stx); ?>" class="frm_input" placeholder="계약코드/회사명/서명자/이메일">
    <button type="submit" class="btn_submit">검색</button>
    <a href="./onoff_service_contracts.php" class="btn btn_02">전체</a>
</form>

<?php if (is_array($detail) && !empty($detail['contract'])) {
    $c = $detail['contract'];
    $sc_id = (int) ($c['id'] ?? 0);
    ?>
    <section class="tbl_frm01 tbl_wrap" style="margin-bottom:24px;">
        <h2 class="h2_frm">계약 상세 #<?php echo $sc_id; ?></h2>
        <table>
            <tbody>
            <tr>
                <th scope="row">상태</th>
                <td><?php echo onoff_sc_admin_status_badge((string) ($c['status'] ?? '')); ?></td>
                <th scope="row">회원 ID</th>
                <td><?php echo onoff_sc_admin_escape($c['mbId'] ?? ''); ?></td>
            </tr>
            <tr>
                <th scope="row">계약 코드</th>
                <td><?php echo onoff_sc_admin_escape($c['code'] ?? ''); ?></td>
                <th scope="row">과정</th>
                <td><?php echo onoff_sc_admin_escape($c['courseId'] ?? ''); ?></td>
            </tr>
            <tr>
                <th scope="row">회사</th>
                <td colspan="3"><?php echo onoff_sc_admin_escape($c['companyName'] ?? ''); ?> / <?php echo onoff_sc_admin_escape($c['signerName'] ?? ''); ?></td>
            </tr>
            <tr>
                <th scope="row">문서</th>
                <td colspan="3">
                    <?php if ($sc_id > 0) { ?>
                        <a href="<?php echo onoff_sc_admin_escape($api_base . '/document.php?sc_id=' . $sc_id); ?>" target="_blank" rel="noopener noreferrer">미리보기</a>
                        |
                        <a href="<?php echo onoff_sc_admin_escape($api_base . '/download.php?sc_id=' . $sc_id); ?>" target="_blank" rel="noopener noreferrer">PDF 다운로드</a>
                    <?php } else { ?>
                        -
                    <?php } ?>
                </td>
            </tr>
            <?php if (!empty($c['rejectReason'])) { ?>
            <tr>
                <th scope="row">반려 사유</th>
                <td colspan="3"><?php echo nl2br(onoff_sc_admin_escape($c['rejectReason'])); ?></td>
            </tr>
            <?php } ?>
            </tbody>
        </table>

        <form method="post" style="margin-top:12px;">
            <input type="hidden" name="token" value="<?php echo $admin_token; ?>">
            <input type="hidden" name="sc_id" value="<?php echo $sc_id; ?>">
            <input type="hidden" name="return_status" value="<?php echo onoff_sc_admin_escape($status); ?>">
            <input type="hidden" name="return_stx" value="<?php echo onoff_sc_admin_escape($stx); ?>">
            <label for="reason" class="sound_only">사유</label>
            <input type="text" name="reason" id="reason" class="frm_input" style="width:320px;" placeholder="반려/메모 사유 (반려 시 필수)">
            <?php if (($c['status'] ?? '') === ONOFF_SC_STATUS_REVIEW_PENDING) { ?>
                <button type="submit" name="action" value="approve" class="btn btn_03">승인</button>
                <button type="submit" name="action" value="reject" class="btn btn_02">반려</button>
            <?php } ?>
            <button type="submit" name="action" value="cancel" class="btn btn_02" onclick="return confirm('계약을 취소하시겠습니까?');">취소</button>
            <button type="submit" name="action" value="expire" class="btn btn_02" onclick="return confirm('만료 처리하시겠습니까?');">만료</button>
            <a href="./onoff_service_contracts.php?status=<?php echo urlencode($status); ?>&amp;stx=<?php echo urlencode($stx); ?>" class="btn btn_02">목록으로</a>
        </form>
    </section>
<?php } ?>

<div class="tbl_head01 tbl_wrap">
    <table>
        <caption><?php echo $g5['title']; ?> 목록</caption>
        <thead>
        <tr>
            <th scope="col">ID</th>
            <th scope="col">상태</th>
            <th scope="col">회원</th>
            <th scope="col">계약</th>
            <th scope="col">회사/서명자</th>
            <th scope="col">문서</th>
            <th scope="col">관리</th>
        </tr>
        </thead>
        <tbody>
        <?php if (count($items) < 1) { ?>
            <tr><td colspan="7" class="empty_table">등록된 서비스 계약이 없습니다.</td></tr>
        <?php } ?>
        <?php foreach ($items as $row) {
            $sc_id = (int) ($row['id'] ?? 0);
            ?>
            <tr>
                <td class="td_num"><?php echo $sc_id; ?></td>
                <td><?php echo onoff_sc_admin_status_badge((string) ($row['status'] ?? '')); ?></td>
                <td><?php echo onoff_sc_admin_escape($row['mbId'] ?? ''); ?><br>
                    <span style="color:#64748b;font-size:12px;">en: <?php echo (int) ($row['enrollmentId'] ?? 0); ?></span>
                </td>
                <td>
                    <strong><?php echo onoff_sc_admin_escape($row['code'] ?? ''); ?></strong><br>
                    <?php echo onoff_sc_admin_escape($row['courseId'] ?? ''); ?><br>
                    <span style="font-size:12px;"><?php echo onoff_sc_admin_escape($row['createdAt'] ?? ''); ?></span>
                </td>
                <td>
                    <?php echo onoff_sc_admin_escape($row['companyName'] ?? ''); ?><br>
                    <?php echo onoff_sc_admin_escape($row['signerName'] ?? ''); ?><br>
                    <?php echo onoff_sc_admin_escape($row['signerEmail'] ?? ''); ?>
                </td>
                <td>
                    <?php if ($sc_id > 0 && !empty($row['pdfPath'])) { ?>
                        <a href="<?php echo onoff_sc_admin_escape($api_base . '/document.php?sc_id=' . $sc_id); ?>" target="_blank" rel="noopener noreferrer">보기</a><br>
                        <a href="<?php echo onoff_sc_admin_escape($api_base . '/download.php?sc_id=' . $sc_id); ?>">PDF</a>
                    <?php } else { ?>
                        -
                    <?php } ?>
                </td>
                <td>
                    <a href="./onoff_service_contracts.php?sc_id=<?php echo $sc_id; ?>&amp;status=<?php echo urlencode($status); ?>&amp;stx=<?php echo urlencode($stx); ?>" class="btn btn_03">상세</a>
                </td>
            </tr>
        <?php } ?>
        </tbody>
    </table>
</div>

<?php
echo get_paging(
    G5_IS_MOBILE ? $config['cf_mobile_pages'] : $config['cf_write_pages'],
    $page,
    $total_page,
    './onoff_service_contracts.php?status=' . urlencode($status) . '&amp;stx=' . urlencode($stx) . '&amp;page='
);

require_once './admin.tail.php';
