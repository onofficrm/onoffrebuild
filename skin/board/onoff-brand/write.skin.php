<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

add_stylesheet('<link rel="stylesheet" href="' . $board_skin_url . '/style.css?v=1">', 0);

$is_youtube = ($bo_table === 'youtube');
$is_edit = ($w === 'u');
$eyebrow = ($bo_table === 'faq') ? 'FAQ' : ($is_youtube ? 'YOUTUBE' : 'NOTICE');
$form_title = $is_edit ? '글 수정' : '글쓰기';
?>

<section class="ob-board" id="bo_w">
    <div class="ob-board__hero">
        <a class="ob-board__brand" href="<?php echo G5_URL; ?>/">ON/OFF Marketing</a>
        <span class="ob-board__eyebrow"><?php echo $eyebrow; ?></span>
        <h1 class="ob-board__title"><?php echo get_text($board['bo_subject']); ?></h1>
        <p class="ob-board__desc"><?php echo $form_title; ?></p>
        <nav class="ob-board__tabs" aria-label="커뮤니티">
            <a href="<?php echo G5_URL; ?>/notice"<?php echo $bo_table === 'notice' ? ' aria-current="page"' : ''; ?>>공지사항</a>
            <a href="<?php echo G5_URL; ?>/faq"<?php echo $bo_table === 'faq' ? ' aria-current="page"' : ''; ?>>자주묻는질문</a>
            <a href="<?php echo G5_URL; ?>/youtube"<?php echo $bo_table === 'youtube' ? ' aria-current="page"' : ''; ?>>유튜브게시판</a>
        </nav>
    </div>

    <div class="ob-board__panel">
        <form name="fwrite" id="fwrite" class="ob-write" action="<?php echo $action_url; ?>" onsubmit="return fwrite_submit(this);" method="post" enctype="multipart/form-data" autocomplete="off">
            <input type="hidden" name="uid" value="<?php echo get_uniqid(); ?>">
            <input type="hidden" name="w" value="<?php echo $w; ?>">
            <input type="hidden" name="bo_table" value="<?php echo $bo_table; ?>">
            <input type="hidden" name="wr_id" value="<?php echo $wr_id; ?>">
            <input type="hidden" name="sca" value="<?php echo $sca; ?>">
            <input type="hidden" name="sfl" value="<?php echo $sfl; ?>">
            <input type="hidden" name="stx" value="<?php echo $stx; ?>">
            <input type="hidden" name="spt" value="<?php echo $spt; ?>">
            <input type="hidden" name="sst" value="<?php echo $sst; ?>">
            <input type="hidden" name="sod" value="<?php echo $sod; ?>">
            <input type="hidden" name="page" value="<?php echo $page; ?>">

            <?php
            $option = '';
            $option_hidden = '';
            if ($is_notice || $is_html || $is_secret || $is_mail) {
                if ($is_notice) {
                    $option .= '<label style="margin-right:1rem"><input type="checkbox" id="notice" name="notice" value="1" ' . $notice_checked . '> 공지</label>';
                }
                if ($is_html) {
                    if ($is_dhtml_editor) {
                        $option_hidden .= '<input type="hidden" value="html1" name="html">';
                    } else {
                        $option .= '<label style="margin-right:1rem"><input type="checkbox" id="html" name="html" value="' . $html_value . '" ' . $html_checked . '> HTML</label>';
                    }
                }
                if ($is_secret) {
                    if ($is_admin || $is_secret == 1) {
                        $option .= '<label style="margin-right:1rem"><input type="checkbox" id="secret" name="secret" value="secret" ' . $secret_checked . '> 비밀글</label>';
                    } else {
                        $option_hidden .= '<input type="hidden" name="secret" value="secret">';
                    }
                }
            }
            echo $option_hidden;
            ?>

            <?php if ($is_category) { ?>
            <div class="ob-write__row">
                <label class="ob-write__label" for="ca_name">분류<span class="required">*</span></label>
                <select name="ca_name" id="ca_name" required>
                    <option value="">분류를 선택하세요</option>
                    <?php echo $category_option; ?>
                </select>
            </div>
            <?php } ?>

            <?php if ($is_name) { ?>
            <div class="ob-write__row">
                <label class="ob-write__label" for="wr_name">이름<span class="required">*</span></label>
                <input type="text" name="wr_name" value="<?php echo $name; ?>" id="wr_name" required placeholder="이름">
            </div>
            <?php } ?>

            <?php if ($is_password) { ?>
            <div class="ob-write__row">
                <label class="ob-write__label" for="wr_password">비밀번호<?php echo $password_required ? '<span class="required">*</span>' : ''; ?></label>
                <input type="password" name="wr_password" id="wr_password" <?php echo $password_required; ?> placeholder="비밀번호">
            </div>
            <?php } ?>

            <?php if ($option) { ?>
            <div class="ob-write__row"><?php echo $option; ?></div>
            <?php } ?>

            <div class="ob-write__row">
                <label class="ob-write__label" for="wr_subject">제목<span class="required">*</span></label>
                <input type="text" name="wr_subject" value="<?php echo $subject; ?>" id="wr_subject" required maxlength="255" placeholder="제목을 입력하세요">
            </div>

            <?php if ($is_youtube) { ?>
            <div class="ob-write__row">
                <label class="ob-write__label" for="wr_1">유튜브 URL<span class="required">*</span></label>
                <input type="url" name="wr_1" id="wr_1" value="<?php echo isset($write['wr_1']) ? get_text($write['wr_1']) : ''; ?>" placeholder="https://www.youtube.com/watch?v=..." required>
                <p class="ob-write__hint">watch / youtu.be / shorts URL을 입력하면 목록·본문에 영상이 표시됩니다.</p>
            </div>
            <?php } ?>

            <div class="ob-write__row">
                <label class="ob-write__label" for="wr_content">내용<span class="required">*</span></label>
                <?php echo $editor_html; ?>
            </div>

            <?php for ($i = 0; $is_file && $i < $file_count; $i++) { ?>
            <div class="ob-write__row">
                <label class="ob-write__label" for="bf_file_<?php echo $i + 1; ?>">파일 #<?php echo $i + 1; ?></label>
                <input type="file" name="bf_file[]" id="bf_file_<?php echo $i + 1; ?>" title="파일첨부 <?php echo $i + 1; ?>">
                <?php if ($is_file_content) { ?>
                <input type="text" name="bf_content[]" value="<?php echo ($w == 'u' && isset($file[$i]['bf_content'])) ? $file[$i]['bf_content'] : ''; ?>" placeholder="파일 설명" style="margin-top:0.45rem">
                <?php } ?>
                <?php if ($w == 'u' && isset($file[$i]['file']) && $file[$i]['file']) { ?>
                <p class="ob-write__hint">
                    <label><input type="checkbox" name="bf_file_del[<?php echo $i; ?>]" value="1"> <?php echo $file[$i]['source'] . '(' . $file[$i]['size'] . ')'; ?> 파일 삭제</label>
                </p>
                <?php } ?>
            </div>
            <?php } ?>

            <?php if ($is_use_captcha) { ?>
            <div class="ob-write__row"><?php echo $captcha_html; ?></div>
            <?php } ?>

            <div class="ob-write__actions">
                <a href="<?php echo get_pretty_url($bo_table); ?>" class="ob-btn">취소</a>
                <button type="submit" id="btn_submit" class="ob-btn ob-btn--primary" accesskey="s"><?php echo $is_edit ? '수정완료' : '작성완료'; ?></button>
            </div>
        </form>
    </div>
</section>

<script>
function html_auto_br(obj) {
  if (obj.checked) {
    result = confirm("자동 줄바꿈을 하시겠습니까?\n\n자동 줄바꿈은 게시물 내용중 줄바뀐 곳을<br>태그로 변환하는 기능입니다.");
    if (result) obj.value = "html2";
    else obj.value = "html1";
  } else {
    obj.value = "";
  }
}
function fwrite_submit(f) {
  <?php echo $editor_js; ?>
  <?php echo $captcha_js; ?>
  document.getElementById("btn_submit").disabled = "disabled";
  return true;
}
</script>
