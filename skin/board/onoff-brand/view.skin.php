<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

include_once G5_LIB_PATH . '/thumbnail.lib.php';
include_once G5_SKIN_PATH . '/board/_inc/g5b-seo-view.php';
include_once G5_SKIN_PATH . '/board/_inc/g5b-youtube.php';

add_stylesheet('<link rel="stylesheet" href="' . $board_skin_url . '/style.css?v=3">', 0);

$is_youtube = ($bo_table === 'youtube');
$yt_id = '';
if ($is_youtube) {
    $yt_id = g5b_youtube_id_from_write($view);
}
$eyebrow = ($bo_table === 'faq') ? 'FAQ' : ($is_youtube ? 'YOUTUBE' : 'NOTICE');
?>

<article class="ob-board" id="bo_v">
    <div class="ob-board__hero">
        <a class="ob-board__brand" href="<?php echo G5_URL; ?>/">
            <img src="<?php echo G5_URL; ?>/img/logo/logo-white.png" alt="온오프마케팅" width="140" height="46">
        </a>
        <span class="ob-board__eyebrow"><?php echo $eyebrow; ?></span>
        <h1 class="ob-board__title"><?php echo get_text($board['bo_subject']); ?></h1>
        <p class="ob-board__desc">글 상세 보기</p>
        <nav class="ob-board__tabs" aria-label="커뮤니티">
            <a href="<?php echo G5_URL; ?>/notice"<?php echo $bo_table === 'notice' ? ' aria-current="page"' : ''; ?>>공지사항</a>
            <a href="<?php echo G5_URL; ?>/faq"<?php echo $bo_table === 'faq' ? ' aria-current="page"' : ''; ?>>자주묻는질문</a>
            <a href="<?php echo G5_URL; ?>/youtube"<?php echo $bo_table === 'youtube' ? ' aria-current="page"' : ''; ?>>유튜브게시판</a>
        </nav>
    </div>

    <div class="ob-board__panel">
        <header class="ob-view__head">
            <h2 class="ob-view__title">
                <?php if ($category_name) { ?>
                <span class="ob-badge" style="margin-right:0.4rem"><?php echo $view['ca_name']; ?></span>
                <?php } ?>
                <?php echo cut_str(get_text($view['wr_subject']), 120); ?>
            </h2>
            <div class="ob-view__meta">
                <span><?php echo $view['name']; ?></span>
                <span><time datetime="<?php echo date('c', strtotime($view['wr_datetime'])); ?>"><?php echo date('Y-m-d H:i', strtotime($view['wr_datetime'])); ?></time></span>
                <span>조회 <?php echo number_format($view['wr_hit']); ?></span>
            </div>
        </header>

        <div class="ob-view__body">
            <?php if ($yt_id) { ?>
            <div class="ob-view__embed">
                <iframe src="https://www.youtube.com/embed/<?php echo $yt_id; ?>" title="<?php echo get_text($view['wr_subject']); ?>" allowfullscreen loading="lazy"></iframe>
            </div>
            <?php } ?>
            <?php echo get_view_thumbnail($view['content']); ?>
        </div>

        <footer class="ob-view__footer">
            <div class="ob-board__actions">
                <a class="ob-btn" href="<?php echo $list_href; ?>">목록</a>
                <?php if ($write_href) { ?><a class="ob-btn ob-btn--primary" href="<?php echo $write_href; ?>">글쓰기</a><?php } ?>
            </div>
            <div class="ob-board__actions">
                <?php if ($update_href) { ?><a class="ob-btn" href="<?php echo $update_href; ?>">수정</a><?php } ?>
                <?php if ($delete_href) { ?><a class="ob-btn" href="<?php echo $delete_href; ?>" onclick="del(this.href); return false;">삭제</a><?php } ?>
                <?php if ($search_href) { ?><a class="ob-btn" href="<?php echo $search_href; ?>">검색</a><?php } ?>
            </div>
        </footer>
    </div>

    <?php
    if (function_exists('g5b_seo_view_footer')) {
        g5b_seo_view_footer();
    }
    ?>
</article>
