<?php
if (!defined('_GNUBOARD_')) exit;

/**
 * 게시판 스킨 공통 fallback 이미지 경로
 * - /img/common/no-image.svg   (썸네일·이미지형)
 * - /img/common/no-youtube.svg (유튜브형)
 */
define('G5B_FALLBACK_DIR', G5_PATH.'/img/common');
define('G5B_FALLBACK_NO_IMAGE_FILE', G5B_FALLBACK_DIR.'/no-image.svg');
define('G5B_FALLBACK_NO_YOUTUBE_FILE', G5B_FALLBACK_DIR.'/no-youtube.svg');
define('G5B_FALLBACK_NO_IMAGE_URL', G5_IMG_URL.'/common/no-image.svg');
define('G5B_FALLBACK_NO_YOUTUBE_URL', G5_IMG_URL.'/common/no-youtube.svg');

/**
 * @param string $type image|youtube
 */
function g5b_fallback_file_path($type = 'image')
{
    return ($type === 'youtube') ? G5B_FALLBACK_NO_YOUTUBE_FILE : G5B_FALLBACK_NO_IMAGE_FILE;
}

/**
 * @param string $type image|youtube
 */
function g5b_fallback_file_url($type = 'image')
{
    return ($type === 'youtube') ? G5B_FALLBACK_NO_YOUTUBE_URL : G5B_FALLBACK_NO_IMAGE_URL;
}

/**
 * @param string $type image|youtube
 */
function g5b_fallback_file_exists($type = 'image')
{
    return is_file(g5b_fallback_file_path($type));
}

/**
 * fallback <img> 태그 HTML
 * @param string $type image|youtube
 */
function g5b_fallback_img_html($type = 'image', $class = 'board-fallback__img')
{
    if (!g5b_fallback_file_exists($type)) {
        return '';
    }
    $src = g5b_fallback_file_url($type);
    $class = preg_replace('/[^a-zA-Z0-9_\- ]/', '', $class);

    return '<img src="'.htmlspecialchars($src, ENT_QUOTES, 'UTF-8').'" alt="" role="presentation" class="'.htmlspecialchars(trim($class), ENT_QUOTES, 'UTF-8').' board-thumb__img--placeholder" loading="lazy" decoding="async">';
}

/**
 * 제목 앞 글자 1자 (한글·영문)
 *
 * @param string $subject
 * @return string
 */
function g5b_subject_initial_char($subject)
{
    $text = trim(strip_tags((string) $subject));
    if ($text === '') {
        return '?';
    }
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, 1, 'UTF-8');
    }

    return substr($text, 0, 1);
}

/**
 * @param string $subject
 * @return string blue|indigo|violet|sky|emerald|slate
 */
function g5b_subject_initial_tone($subject)
{
    $tones = array('blue', 'indigo', 'violet', 'sky', 'emerald', 'slate');
    $idx = abs((int) crc32((string) $subject)) % count($tones);

    return $tones[$idx];
}

/**
 * 썸네일 없을 때 제목 첫 글자 플레이스홀더
 *
 * @param string $subject
 * @param string $block_prefix content-card|board-thumb
 * @return string
 */
function g5b_subject_initial_thumb_html($subject, $block_prefix = 'content-card')
{
    $block_prefix = preg_replace('/[^a-zA-Z0-9_-]/', '', (string) $block_prefix);
    if ($block_prefix === '') {
        $block_prefix = 'content-card';
    }

    $char = g5b_subject_initial_char($subject);
    $tone = g5b_subject_initial_tone($subject);
    $label = get_text(strip_tags((string) $subject));

    return '<span class="' . htmlspecialchars($block_prefix, ENT_QUOTES, 'UTF-8') . '__initial '
        . htmlspecialchars($block_prefix, ENT_QUOTES, 'UTF-8') . '__initial--' . htmlspecialchars($tone, ENT_QUOTES, 'UTF-8') . '"'
        . ' role="img" aria-label="' . htmlspecialchars($label, ENT_QUOTES, 'UTF-8') . '">'
        . '<span class="' . htmlspecialchars($block_prefix, ENT_QUOTES, 'UTF-8') . '__initial-char" aria-hidden="true">'
        . htmlspecialchars($char, ENT_QUOTES, 'UTF-8')
        . '</span></span>';
}
