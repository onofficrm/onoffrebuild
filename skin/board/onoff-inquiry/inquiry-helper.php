<?php
/**
 * onoff-inquiry 스킨 공통 헬퍼
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

if (!function_exists('g5b_inquiry_status_label')) {
    /**
     * @param string $status wr_6
     * @return string
     */
    function g5b_inquiry_status_label($status)
    {
        $status = trim(strip_tags((string) $status));

        return $status !== '' ? $status : '신규';
    }
}

if (!function_exists('g5b_inquiry_status_class')) {
    /**
     * @param string $status wr_6
     * @return string
     */
    function g5b_inquiry_status_class($status)
    {
        $label = g5b_inquiry_status_label($status);
        $map = array(
            '신규'     => 'status-new',
            '확인중'   => 'status-checking',
            '상담완료' => 'status-done',
            '계약완료' => 'status-contract',
            '보류'     => 'status-hold',
            '스팸'     => 'status-spam',
        );

        return isset($map[$label]) ? $map[$label] : 'status-new';
    }
}

if (!function_exists('g5b_inquiry_status_options')) {
    /**
     * @return array
     */
    function g5b_inquiry_status_options()
    {
        return array('신규', '확인중', '상담완료', '계약완료', '보류', '스팸');
    }
}

if (!function_exists('g5b_inquiry_short_text')) {
    /**
     * @param string $text
     * @param int    $len
     * @return string
     */
    function g5b_inquiry_short_text($text, $len = 40)
    {
        $text = trim(strip_tags((string) $text));
        if ($text === '') {
            return '';
        }

        if (function_exists('cut_str')) {
            return cut_str($text, (int) $len);
        }

        if (function_exists('mb_strlen') && mb_strlen($text, 'UTF-8') > $len) {
            return mb_substr($text, 0, (int) $len, 'UTF-8') . '…';
        }

        if (strlen($text) > $len) {
            return substr($text, 0, (int) $len) . '…';
        }

        return $text;
    }
}

if (!function_exists('g5b_inquiry_phone_tel')) {
    /**
     * @param string $phone
     * @return string tel: href or empty
     */
    function g5b_inquiry_phone_tel($phone)
    {
        $phone = trim((string) $phone);
        if ($phone === '') {
            return '';
        }
        if (stripos($phone, 'Google Meet') !== false) {
            return '';
        }

        $digits = preg_replace('/[^0-9+]/', '', $phone);
        if (preg_replace('/[^0-9]/', '', $phone) === '01000000000') {
            return '';
        }

        return $digits !== '' ? 'tel:' . $digits : '';
    }
}

if (!function_exists('g5b_inquiry_safe_url')) {
    /**
     * @param string $url
     * @return string safe href or empty
     */
    function g5b_inquiry_safe_url($url)
    {
        $url = trim((string) $url);
        if ($url === '' || $url === '#') {
            return '';
        }

        if (preg_match('#^https?://#i', $url)) {
            return $url;
        }

        if (strpos($url, '/') === 0) {
            return $url;
        }

        if (preg_match('#^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}#i', $url)) {
            return 'https://' . $url;
        }

        return '';
    }
}

if (!function_exists('g5b_inquiry_mask_phone')) {
    /**
     * 목록용 연락처 마스킹 (가운데 숫자 일부 *)
     *
     * @param string $phone
     * @return string
     */
    function g5b_inquiry_mask_phone($phone)
    {
        $phone = trim(strip_tags((string) $phone));
        if ($phone === '') {
            return '—';
        }
        if (stripos($phone, 'Google Meet') !== false) {
            return $phone;
        }

        $digits = preg_replace('/[^0-9]/', '', $phone);
        if ($digits === '01000000000') {
            return 'Google Meet (이메일)';
        }
        $len = strlen($digits);

        if ($len >= 10) {
            return substr($digits, 0, 3) . '-****-' . substr($digits, -4);
        }

        if ($len >= 7) {
            return substr($digits, 0, 2) . '***' . substr($digits, -2);
        }

        return g5b_inquiry_short_text($phone, 12);
    }
}

if (!function_exists('g5b_inquiry_interest_summary')) {
    /**
     * wr_10 또는 본문 [관심 기능·서비스] 줄
     *
     * @param array $row
     * @return string
     */
    function g5b_inquiry_interest_summary($row)
    {
        $wr10 = g5b_inquiry_get_extra($row, 'wr_10');
        if ($wr10 !== '') {
            return $wr10;
        }
        $content = isset($row['wr_content']) ? (string) $row['wr_content'] : '';
        if ($content !== '' && preg_match('/\[관심 기능·서비스\]\s*(.+?)(?:\n|$)/u', $content, $m)) {
            return trim($m[1]);
        }
        return '';
    }
}

if (!function_exists('g5b_inquiry_get_extra')) {
    /**
     * 목록/보기 행에서 여분필드
     *
     * @param array  $row
     * @param string $key wr_1 .. wr_10
     * @return string
     */
    function g5b_inquiry_get_extra($row, $key)
    {
        if (!is_array($row) || !isset($row[$key])) {
            return '';
        }

        return trim(strip_tags((string) $row[$key]));
    }
}
