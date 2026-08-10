<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

include_once G5_SKIN_PATH . '/board/_inc/g5b-seo-list.php';
include_once G5_SKIN_PATH . '/board/_inc/g5b-youtube.php';

add_stylesheet('<link rel="stylesheet" href="' . $board_skin_url . '/style.css?v=1">', 0);

$is_faq = ($bo_table === 'faq');
$is_youtube = ($bo_table === 'youtube');
$eyebrow = $is_faq ? 'FAQ' : ($is_youtube ? 'YOUTUBE' : 'NOTICE');
$desc_map = array(
    'notice'  => '온오프마케팅의 새로운 소식과 서비스 업데이트를 확인하세요.',
    'faq'     => '서비스 이용 전 자주 묻는 질문을 빠르게 확인해 보세요.',
    'youtube' => '마케팅 노하우와 홈페이지 제작 팁을 영상으로 만나보세요.',
);
$desc = isset($desc_map[$bo_table]) ? $desc_map[$bo_table] : get_text($board['bo_subject']);
?>

<div class="ob-board" id="bo_list">
    <div class="ob-board__hero">
        <span class="ob-board__eyebrow"><?php echo $eyebrow; ?></span>
        <h1 class="ob-board__title"><?php echo get_text($board['bo_subject']); ?></h1>
        <p class="ob-board__desc"><?php echo get_text($desc); ?></p>
    </div>

    <?php if ($is_category) { ?>
    <nav class="ob-cate" id="bo_cate" aria-label="카테고리">
        <ul id="bo_cate_ul"><?php echo $category_option; ?></ul>
    </nav>
    <?php } ?>

    <div class="ob-board__toolbar">
        <div class="ob-board__meta">
            <span>전체 <strong><?php echo number_format($total_count); ?></strong>건</span>
            <span><?php echo (int) $page; ?> 페이지</span>
        </div>
        <ul class="ob-board__actions">
            <?php if ($admin_href) { ?>
            <li><a class="ob-btn" href="<?php echo $admin_href; ?>">관리</a></li>
            <?php } ?>
            <?php if ($write_href) { ?>
            <li><a class="ob-btn ob-btn--primary" href="<?php echo $write_href; ?>">글쓰기</a></li>
            <?php } ?>
        </ul>
    </div>

    <div class="ob-board__panel">
        <form name="fsearch" method="get" class="ob-board__search" action="<?php echo get_pretty_url($bo_table); ?>">
            <input type="hidden" name="bo_table" value="<?php echo $bo_table; ?>">
            <input type="hidden" name="sca" value="<?php echo $sca; ?>">
            <input type="hidden" name="sop" value="and">
            <select name="sfl" id="sfl" aria-label="검색대상">
                <option value="wr_subject"<?php echo get_selected($sfl, 'wr_subject', true); ?>>제목</option>
                <option value="wr_content"<?php echo get_selected($sfl, 'wr_content'); ?>>내용</option>
                <option value="wr_subject||wr_content"<?php echo get_selected($sfl, 'wr_subject||wr_content'); ?>>제목+내용</option>
            </select>
            <input type="text" name="stx" value="<?php echo stripslashes($stx); ?>" placeholder="검색어를 입력하세요" aria-label="검색어">
            <button type="submit" class="ob-btn ob-btn--primary">검색</button>
        </form>

        <?php if ($is_faq) { ?>
            <?php if (!count($list)) { ?>
            <div class="ob-empty">등록된 FAQ가 없습니다.</div>
            <?php } else { ?>
            <div class="ob-faq" id="obFaqList">
                <?php for ($i = 0; $i < count($list); $i++) {
                    $item = $list[$i];
                    $open = ($i === 0 && $stx === '') ? ' is-open' : '';
                ?>
                <div class="ob-faq__item<?php echo $open; ?>">
                    <button type="button" class="ob-faq__q" aria-expanded="<?php echo $open ? 'true' : 'false'; ?>">
                        <span><?php echo get_text($item['subject']); ?></span>
                        <span class="ob-faq__icon" aria-hidden="true">?</span>
                    </button>
                    <div class="ob-faq__a">
                        <?php echo conv_content($item['wr_content'], 1); ?>
                        <?php if ($update_href || $is_admin) { ?>
                        <p style="margin-top:0.85rem">
                            <a class="ob-btn" href="<?php echo $item['href']; ?>">자세히 보기</a>
                        </p>
                        <?php } ?>
                    </div>
                </div>
                <?php } ?>
            </div>
            <script>
            (function(){
              var root = document.getElementById('obFaqList');
              if (!root) return;
              root.addEventListener('click', function(e){
                var btn = e.target.closest('.ob-faq__q');
                if (!btn) return;
                var item = btn.parentElement;
                var open = item.classList.contains('is-open');
                Array.prototype.forEach.call(root.querySelectorAll('.ob-faq__item'), function(el){
                  el.classList.remove('is-open');
                  var b = el.querySelector('.ob-faq__q');
                  if (b) b.setAttribute('aria-expanded', 'false');
                });
                if (!open) {
                  item.classList.add('is-open');
                  btn.setAttribute('aria-expanded', 'true');
                }
              });
            })();
            </script>
            <?php } ?>

        <?php } else if ($is_youtube) { ?>
            <?php if (!count($list)) { ?>
            <div class="ob-empty">등록된 영상이 없습니다.</div>
            <?php } else { ?>
            <div class="ob-video-grid">
                <?php for ($i = 0; $i < count($list); $i++) {
                    $item = $list[$i];
                    $yt_id = '';
                    if (!empty($item['wr_1'])) {
                        $yt_id = g5b_youtube_id_from_url($item['wr_1']);
                        if ($yt_id === '') {
                            $yt_id = g5b_youtube_sanitize_id($item['wr_1']);
                        }
                    }
                    $thumb = $yt_id !== '' ? 'https://img.youtube.com/vi/' . $yt_id . '/hqdefault.jpg' : '';
                ?>
                <a class="ob-video-card" href="<?php echo $item['href']; ?>">
                    <div class="ob-video-card__thumb"<?php echo $thumb ? ' style="background-image:url(' . htmlspecialchars($thumb, ENT_QUOTES, 'UTF-8') . ')"' : ''; ?>>
                        <div class="ob-video-card__play">▶</div>
                    </div>
                    <div class="ob-video-card__body">
                        <h3 class="ob-video-card__title"><?php echo get_text($item['subject']); ?></h3>
                        <div class="ob-video-card__meta">
                            <?php echo g5b_seo_list_time($item); ?> · 조회 <?php echo number_format($item['wr_hit']); ?>
                        </div>
                    </div>
                </a>
                <?php } ?>
            </div>
            <?php } ?>

        <?php } else { ?>
            <?php if (!count($list)) { ?>
            <div class="ob-empty">등록된 게시글이 없습니다.</div>
            <?php } else { ?>
            <ul class="ob-list">
                <?php for ($i = 0; $i < count($list); $i++) {
                    $item = $list[$i];
                ?>
                <li class="ob-list__item">
                    <span class="ob-badge<?php echo $item['is_notice'] ? ' ob-badge--notice' : ''; ?>">
                        <?php echo $item['is_notice'] ? '공지' : $item['num']; ?>
                    </span>
                    <div>
                        <h3 class="ob-list__subject">
                            <a href="<?php echo $item['href']; ?>"><?php echo get_text($item['subject']); ?></a>
                            <?php if ($item['icon_new']) { ?><span class="ob-badge ob-badge--new">N</span><?php } ?>
                        </h3>
                    </div>
                    <div class="ob-list__side">
                        <span><?php echo g5b_seo_list_time($item); ?></span>
                        <span>조회 <?php echo number_format($item['wr_hit']); ?></span>
                    </div>
                </li>
                <?php } ?>
            </ul>
            <?php } ?>
        <?php } ?>
    </div>

    <div class="ob-paging">
        <?php echo $write_pages; ?>
    </div>
</div>
