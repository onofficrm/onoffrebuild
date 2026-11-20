<?php
if (!defined('_GNUBOARD_')) exit; // 개별 페이지 접근 불가

if (!defined('G5_COMMUNITY_USE')) {
    define('G5_COMMUNITY_USE', true);
}

if (G5_IS_MOBILE) {
    include_once(G5_THEME_MOBILE_PATH.'/tail.php');
    return;
}

if(G5_COMMUNITY_USE === false) {
    include_once(G5_THEME_SHOP_PATH.'/shop.tail.php');
    return;
}
?>

    </div>
</div>

</div>
<!-- } 콘텐츠 끝 -->

<hr>

<!-- 하단 시작 { -->
<div id="ft" class="oh-footer">
    <div class="oh-footer__inner">
        <div class="oh-footer__brand">
            <a href="<?php echo G5_URL; ?>/">
                <img class="oh-footer__logo" src="<?php echo G5_URL; ?>/img/logo/logo-pc-white.png" alt="온오프마케팅 ONOFF MARKETING" width="210" height="70">
            </a>
            <p>홈페이지 하나로, 운영까지.</p>
        </div>
        <nav class="oh-footer__links" aria-label="하단 메뉴">
            <?php
            include_once(G5_LIB_PATH.'/onoff-builder-chrome-nav.inc.php');
            foreach (onoff_builder_chrome_footer_nav_links() as $oh_flink) {
            ?>
            <a href="<?php echo $oh_flink['href']; ?>"><?php echo $oh_flink['label']; ?></a>
            <?php } ?>
        </nav>
        <div class="oh-footer__legal">
            <a href="<?php echo get_pretty_url('content', 'privacy'); ?>">개인정보처리방침</a>
            <a href="<?php echo get_pretty_url('content', 'provision'); ?>">서비스이용약관</a>
            <a href="<?php echo get_pretty_url('content', 'company'); ?>">회사소개</a>
        </div>
        <p class="oh-footer__copy">Copyright &copy; <?php echo date('Y'); ?> 온오프마케팅. All rights reserved.</p>
    </div>
    
    
    <button type="button" id="top_btn">
    	<i class="fa fa-arrow-up" aria-hidden="true"></i><span class="sound_only">상단으로</span>
    </button>
    <script>
    $(function() {
        $("#top_btn").on("click", function() {
            $("html, body").animate({scrollTop:0}, '500');
            return false;
        });
    });
    </script>
</div>

<?php
if(G5_DEVICE_BUTTON_DISPLAY && !G5_IS_MOBILE) { ?>
<?php
}

if ($config['cf_analytics']) {
    echo $config['cf_analytics'];
}
?>

<!-- } 하단 끝 -->

<script>
$(function() {
    // 폰트 리사이즈 쿠키있으면 실행
    font_resize("container", get_cookie("ck_font_resize_rmv_class"), get_cookie("ck_font_resize_add_class"));
});
</script>

<?php
include_once(G5_THEME_PATH."/tail.sub.php");