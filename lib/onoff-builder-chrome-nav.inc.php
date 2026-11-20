<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

/**
 * Builder marketing chrome for GNUBoard theme headers (notice/faq/youtube).
 * Mirrors ONOFF Builder official SPA navigation structure.
 */
function onoff_builder_chrome_nav_path()
{
    $path = isset($_SERVER['REQUEST_URI']) ? parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) : '/';
    $path = is_string($path) ? $path : '/';
    if ($path !== '/') {
        $path = rtrim($path, '/');
    }
    return $path;
}

function onoff_builder_chrome_prepare_nav_context()
{
    global $oh_path, $oh_board, $oh_points_label;
    global $oh_home_on, $oh_features_on, $oh_usecases_on, $oh_portfolio_on, $oh_pricing_on, $oh_services_on, $oh_community_on;

    $oh_path = onoff_builder_chrome_nav_path();
    $oh_board = isset($bo_table) ? (string) $bo_table : '';

    $service_paths = array(
        '/website',
        '/management',
        '/services/seo',
        '/seo',
        '/geo',
        '/backlink',
        '/traffic',
        '/domain',
        '/content',
    );
    $service_boards = array('geo', 'domain', 'content', 'backlink', 'traffic', 'website', 'management', 'seo');

    $oh_home_on = ($oh_path === '/' || $oh_path === '');
    $oh_features_on = strpos($oh_path, '/features') === 0;
    $oh_usecases_on = $oh_path === '/use-cases';
    $oh_portfolio_on = $oh_path === '/portfolio';
    $oh_pricing_on = $oh_path === '/pricing';
    $oh_services_on = in_array($oh_path, $service_paths, true) || in_array($oh_board, $service_boards, true);
    $oh_community_on = in_array($oh_board, array('notice', 'faq', 'youtube'), true)
        || in_array($oh_path, array('/notice', '/faq', '/youtube', '/community'), true);

    global $is_member, $member;
    $oh_points_label = ($is_member && isset($member['mb_point']))
        ? number_format((int) $member['mb_point']).' P'
        : '포인트';
}

function onoff_builder_chrome_feature_items()
{
  return array(
        'automation' => array(
            array('href' => G5_URL.'/features/routine', 'label' => '루틴 자동발행', 'desc' => '주기·검수 흐름으로 콘텐츠 발행'),
            array('href' => G5_URL.'/features/step-mail', 'label' => '스텝메일', 'desc' => '단계별 이메일 자동화'),
            array('href' => G5_URL.'/features/sns-poster', 'label' => 'SNS 마케팅', 'desc' => 'SNS 배포·예약·관리'),
            array('href' => G5_URL.'/features/auto-comment', 'label' => '자동 댓글', 'desc' => 'AI 댓글 응대·승인 후 게시'),
        ),
        'editing' => array(
            array('href' => G5_URL.'/features/easy-edit', 'label' => '쉬운 홈페이지 수정', 'desc' => '자연어 수정 요청'),
            array('href' => G5_URL.'/features/ai-development', 'label' => 'AI 기능 개발', 'desc' => '맞춤 기능 설계·개발'),
        ),
    );
}

function onoff_builder_chrome_service_items()
{
    return array(
        'core' => array(
            array('href' => G5_URL.'/website', 'label' => '홈페이지 제작', 'desc' => '기획·디자인·퍼블리싱'),
            array('href' => G5_URL.'/management', 'label' => '운영관리', 'desc' => '호스팅·유지보수·수정 요청'),
        ),
        'extension' => array(
            array('href' => G5_URL.'/services/seo', 'label' => 'SEO', 'desc' => '검색 친화 구조·기술 최적화'),
            array('href' => G5_URL.'/geo', 'label' => 'GEO', 'desc' => 'AI 검색 환경 정보 구조화'),
            array('href' => G5_URL.'/backlink', 'label' => 'BACKLINK', 'desc' => '외부 연계·신뢰도 강화'),
            array('href' => G5_URL.'/traffic', 'label' => 'TRAFFIC', 'desc' => '유입 채널 연계 운영'),
            array('href' => G5_URL.'/domain', 'label' => 'DOMAIN', 'desc' => '도메인·DNS·SSL'),
            array('href' => G5_URL.'/content', 'label' => 'AI 콘텐츠', 'desc' => '체계적 콘텐츠 제작'),
        ),
    );
}

function onoff_builder_chrome_render_header()
{
    global $g5, $is_member, $is_admin;
    global $oh_path, $oh_home_on, $oh_features_on, $oh_usecases_on, $oh_portfolio_on, $oh_pricing_on, $oh_services_on, $oh_community_on, $oh_points_label;

    $features = onoff_builder_chrome_feature_items();
    $services = onoff_builder_chrome_service_items();
    $logo_src = G5_URL.'/img/logo/logo-pc.png';
    ?>
<!-- 상단 시작 { -->
<header id="hd" class="oh-header oh-header--builder">
    <h1 id="hd_h1" class="sound_only"><?php echo get_text($g5['title']); ?></h1>
    <div class="oh-skip"><a href="#container">본문 바로가기</a></div>

    <?php
    if (defined('_INDEX_')) {
        include G5_BBS_PATH.'/newwin.inc.php';
    }
    ?>

    <div class="oh-header__bar">
        <a class="oh-logo" href="<?php echo G5_URL; ?>/" aria-label="ONOFF Builder 홈으로 이동">
            <img src="<?php echo $logo_src; ?>" alt="ONOFF Builder" width="182" height="54">
        </a>

        <nav id="oh-nav" class="oh-nav" aria-label="메인메뉴">
            <a class="oh-pill<?php echo $oh_home_on ? ' is-active' : ''; ?>" href="<?php echo G5_URL; ?>/">빌더 소개</a>

            <div class="oh-services oh-services--features" id="oh-features">
                <button type="button" class="oh-pill<?php echo $oh_features_on ? ' is-active' : ''; ?>" aria-expanded="false" aria-haspopup="menu" id="oh-features-btn">
                    기본 기능
                    <span class="oh-chevron" aria-hidden="true"></span>
                </button>
                <div class="oh-services__panel oh-features__panel" role="menu" hidden>
                    <div class="oh-features__head">
                        <div>
                            <p class="oh-features__kicker">ONOFF Builder 핵심 기능</p>
                            <p class="oh-features__sub">운영 자동화 · 자동 댓글 · 쉬운 수정 · AI 기능 개발</p>
                        </div>
                        <a class="oh-features__all" href="<?php echo G5_URL; ?>/features">전체 보기</a>
                    </div>
                    <div class="oh-features__grid">
                        <div class="oh-features__col">
                            <p class="oh-menu__label">운영 자동화</p>
                            <?php foreach ($features['automation'] as $item) { ?>
                            <a class="oh-feature-link" role="menuitem" href="<?php echo $item['href']; ?>">
                                <strong><?php echo $item['label']; ?></strong>
                                <span><?php echo $item['desc']; ?></span>
                            </a>
                            <?php } ?>
                        </div>
                        <div class="oh-features__col">
                            <p class="oh-menu__label">쉬운 수정 · AI</p>
                            <?php foreach ($features['editing'] as $item) { ?>
                            <a class="oh-feature-link" role="menuitem" href="<?php echo $item['href']; ?>">
                                <strong><?php echo $item['label']; ?></strong>
                                <span><?php echo $item['desc']; ?></span>
                            </a>
                            <?php } ?>
                        </div>
                    </div>
                </div>
            </div>

            <a class="oh-pill<?php echo $oh_usecases_on ? ' is-active' : ''; ?>" href="<?php echo G5_URL; ?>/use-cases">활용사례</a>
            <a class="oh-pill<?php echo $oh_portfolio_on ? ' is-active' : ''; ?>" href="<?php echo G5_URL; ?>/portfolio">제작사례</a>

            <div class="oh-services" id="oh-services">
                <button type="button" class="oh-pill<?php echo $oh_services_on ? ' is-active' : ''; ?>" aria-expanded="false" aria-haspopup="menu" id="oh-services-btn">
                    서비스
                    <span class="oh-chevron" aria-hidden="true"></span>
                </button>
                <div class="oh-services__panel oh-services__panel--builder" role="menu" hidden>
                    <p class="oh-menu__label">핵심 서비스</p>
                    <?php foreach ($services['core'] as $item) { ?>
                    <a class="oh-feature-link" role="menuitem" href="<?php echo $item['href']; ?>">
                        <strong><?php echo $item['label']; ?></strong>
                        <span><?php echo $item['desc']; ?></span>
                    </a>
                    <?php } ?>
                    <p class="oh-menu__label oh-menu__label--spaced">별도 전문 서비스</p>
                    <?php foreach ($services['extension'] as $item) { ?>
                    <a class="oh-feature-link" role="menuitem" href="<?php echo $item['href']; ?>">
                        <strong><?php echo $item['label']; ?></strong>
                        <span><?php echo $item['desc']; ?></span>
                    </a>
                    <?php } ?>
                </div>
            </div>

            <a class="oh-pill<?php echo $oh_pricing_on ? ' is-active' : ''; ?>" href="<?php echo G5_URL; ?>/pricing">요금안내</a>
            <a class="oh-pill<?php echo $oh_community_on ? ' is-active' : ''; ?>" href="<?php echo G5_URL; ?>/community">커뮤니티</a>
        </nav>

        <div class="oh-utils">
            <?php if ($is_member) { ?>
            <a class="oh-text-btn" href="<?php echo G5_URL; ?>/account">내 계정</a>
            <?php } ?>
            <a class="oh-text-btn" href="<?php echo G5_URL; ?>/account/points"><?php echo $oh_points_label; ?></a>
            <?php if ($is_member) { ?>
            <a class="oh-text-btn oh-text-btn--line" href="<?php echo G5_BBS_URL; ?>/logout.php">로그아웃</a>
            <?php if ($is_admin) { ?>
            <a class="oh-text-btn" href="<?php echo correct_goto_url(G5_ADMIN_URL); ?>">관리자</a>
            <?php } ?>
            <?php } else { ?>
            <a class="oh-text-btn oh-text-btn--line" href="<?php echo G5_URL; ?>/login">로그인</a>
            <a class="oh-text-btn" href="<?php echo G5_URL; ?>/signup">회원가입</a>
            <?php } ?>
            <a class="oh-cta" href="<?php echo G5_URL; ?>/contact">상담하기</a>
            <button type="button" class="oh-burger" id="oh-burger" aria-controls="oh-mobile" aria-expanded="false">
                <span class="sound_only">메뉴</span>
            </button>
        </div>
    </div>

    <div class="oh-mobile" id="oh-mobile" hidden>
        <a href="<?php echo G5_URL; ?>/">빌더 소개</a>
        <button type="button" class="oh-mobile__toggle" id="oh-mobile-features" aria-expanded="false">기본 기능</button>
        <div class="oh-mobile__services" id="oh-mobile-features-panel" hidden>
            <a href="<?php echo G5_URL; ?>/features">기본 기능 전체 보기</a>
            <?php foreach (array_merge($features['automation'], $features['editing']) as $item) { ?>
            <a href="<?php echo $item['href']; ?>"><strong><?php echo $item['label']; ?></strong></a>
            <?php } ?>
        </div>
        <a href="<?php echo G5_URL; ?>/use-cases">활용사례</a>
        <a href="<?php echo G5_URL; ?>/portfolio">제작사례</a>
        <button type="button" class="oh-mobile__toggle" id="oh-mobile-services" aria-expanded="false">서비스</button>
        <div class="oh-mobile__services" id="oh-mobile-services-panel" hidden>
            <?php foreach (array_merge($services['core'], $services['extension']) as $item) { ?>
            <a href="<?php echo $item['href']; ?>"><strong><?php echo $item['label']; ?></strong></a>
            <?php } ?>
        </div>
        <a href="<?php echo G5_URL; ?>/pricing">요금안내</a>
        <a href="<?php echo G5_URL; ?>/community">커뮤니티</a>
        <a href="<?php echo G5_URL; ?>/notice">공지사항</a>
        <a href="<?php echo G5_URL; ?>/faq">자주 묻는 질문</a>
        <a href="<?php echo G5_URL; ?>/youtube">유튜브 콘텐츠</a>
        <a class="oh-mobile__cta" href="<?php echo G5_URL; ?>/contact">상담하기</a>
    </div>
</header>
<script>
(function () {
    function bindDrop(rootId, btnId) {
        var root = document.getElementById(rootId);
        var btn = document.getElementById(btnId);
        var panel = root ? root.querySelector('.oh-services__panel') : null;
        function setOpen(open) {
            if (!btn || !panel) return;
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
            panel.hidden = !open;
            if (root) root.classList.toggle('is-open', open);
        }
        if (!root || !btn) return;
        root.addEventListener('mouseenter', function () { setOpen(true); });
        root.addEventListener('mouseleave', function () { setOpen(false); });
        btn.addEventListener('click', function () {
            setOpen(btn.getAttribute('aria-expanded') !== 'true');
        });
        document.addEventListener('mousedown', function (event) {
            if (!root.contains(event.target)) setOpen(false);
        });
    }
    bindDrop('oh-features', 'oh-features-btn');
    bindDrop('oh-services', 'oh-services-btn');

    var burger = document.getElementById('oh-burger');
    var mobile = document.getElementById('oh-mobile');
    function bindMobileToggle(btnId, panelId) {
        var btn = document.getElementById(btnId);
        var panel = document.getElementById(panelId);
        if (!btn || !panel) return;
        btn.addEventListener('click', function () {
            var open = panel.hidden;
            panel.hidden = !open;
            btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        });
    }
    bindMobileToggle('oh-mobile-features', 'oh-mobile-features-panel');
    bindMobileToggle('oh-mobile-services', 'oh-mobile-services-panel');

    if (burger && mobile) {
        burger.addEventListener('click', function () {
            var open = mobile.hidden;
            mobile.hidden = !open;
            burger.setAttribute('aria-expanded', open ? 'true' : 'false');
            burger.classList.toggle('is-open', open);
        });
    }
})();
</script>
<!-- } 상단 끝 -->
<?php
}

function onoff_builder_chrome_footer_nav_links()
{
    return array(
        array('href' => G5_URL.'/features', 'label' => '기본 기능'),
        array('href' => G5_URL.'/use-cases', 'label' => '활용사례'),
        array('href' => G5_URL.'/portfolio', 'label' => '제작사례'),
        array('href' => G5_URL.'/website', 'label' => '홈페이지 제작'),
        array('href' => G5_URL.'/management', 'label' => '운영관리'),
        array('href' => G5_URL.'/pricing', 'label' => '요금안내'),
        array('href' => G5_URL.'/contact', 'label' => '상담하기'),
        array('href' => G5_URL.'/community', 'label' => '커뮤니티'),
        array('href' => G5_URL.'/notice', 'label' => '공지사항'),
        array('href' => G5_URL.'/faq', 'label' => '자주 묻는 질문'),
        array('href' => G5_URL.'/youtube', 'label' => '유튜브 콘텐츠'),
    );
}

function onoff_builder_chrome_mobile_nav_links()
{
    $features = onoff_builder_chrome_feature_items();
    $services = onoff_builder_chrome_service_items();
    $links = array(
        array('href' => G5_URL.'/', 'label' => '빌더 소개'),
        array('href' => G5_URL.'/features', 'label' => '기본 기능 전체'),
    );
    foreach (array_merge($features['automation'], $features['editing']) as $item) {
        $links[] = array('href' => $item['href'], 'label' => $item['label']);
    }
    $links[] = array('href' => G5_URL.'/use-cases', 'label' => '활용사례');
    $links[] = array('href' => G5_URL.'/portfolio', 'label' => '제작사례');
    foreach (array_merge($services['core'], $services['extension']) as $item) {
        $links[] = array('href' => $item['href'], 'label' => $item['label']);
    }
    $links[] = array('href' => G5_URL.'/pricing', 'label' => '요금안내');
    $links[] = array('href' => G5_URL.'/community', 'label' => '커뮤니티');
    $links[] = array('href' => G5_URL.'/notice', 'label' => '공지사항');
    $links[] = array('href' => G5_URL.'/faq', 'label' => '자주 묻는 질문');
    $links[] = array('href' => G5_URL.'/youtube', 'label' => '유튜브 콘텐츠');
    $links[] = array('href' => G5_URL.'/contact', 'label' => '상담하기');
    return $links;
}