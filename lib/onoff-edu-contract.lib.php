<?php
/**
 * Lecture / marketing standard contracts stored in GNUBoard content.
 * Super-admin edits them at 회원관리 → 콘텐츠 (co_id).
 */
if (!defined('_GNUBOARD_')) {
    exit;
}

function onoff_edu_contract_id()
{
    return 'edu_contract';
}

function onoff_edu_contract_id_for_type($type)
{
    $type = preg_replace('/[^a-z0-9_\-]/i', '', (string) $type);
    if ($type === 'marketing' || $type === 'marketing_contract' || $type === 'marketing-service') {
        return 'marketing_contract';
    }
    if (
        $type === 'education-marketing'
        || $type === 'edu_marketing_contract'
        || $type === 'edumkt_contract'
        || $type === 'edu-marketing'
    ) {
        return 'edumkt_contract';
    }
    if ($type === 'edu_contract' || $type === 'education' || $type === 'seo-geo-master') {
        return 'edu_contract';
    }
    // Direct co_id passthrough for known ids
    if (in_array($type, array('edu_contract', 'marketing_contract', 'edumkt_contract'), true)) {
        return $type;
    }
    return 'edu_contract';
}

function onoff_edu_contract_default_html()
{
    return <<<'HTML'
<h2>제1조 (목적)</h2>
<p>이 표준계약서는 온오프 아카데미(이하 “회사”)가 제공하는 SEO·GEO 강의 및 클래스룸 이용과 관련하여 회사와 수강 신청자(이하 “수강생”)의 권리·의무를 정합니다.</p>
<h2>제2조 (계약의 성립)</h2>
<p>수강생이 신청서의 내용을 확인하고 전자서명을 제출하면 수강 신청이 접수됩니다. 세부 금액·일정·제공 범위는 상담 후 확정되며, 회사가 확정 내용을 안내한 때 이 계약이 성립합니다.</p>
<h2>제3조 (제공 범위)</h2>
<ol>
<li>SEO·GEO 실무 커리큘럼 수강</li>
<li>클래스룸을 통한 실습·피드백 및 안내</li>
<li>맞춤 제작이 필요한 경우 별도 범위 협의</li>
</ol>
<p>위 범위에 없는 작업은 이 계약에 포함되지 않으며, 별도 합의가 없으면 제공하지 않습니다.</p>
<h2>제4조 (기간)</h2>
<p>수강 기간은 과정 일정과 수강 안내를 따릅니다. 일정 변경이 있으면 회사가 신청서에 적은 연락처로 안내합니다.</p>
<h2>제5조 (비용)</h2>
<p>수강료와 옵션 비용은 과정·선택 항목에 따라 상담 후 확정합니다. 신청 화면의 금액 안내는 확정 견적이 아닙니다.</p>
<h2>제6조 (수강생의 의무)</h2>
<ol>
<li>수강권은 본인만 사용하며 제3자에게 양도·공유하지 않습니다.</li>
<li>강의 자료와 클래스룸 콘텐츠를 무단으로 복제·배포·판매하지 않습니다.</li>
<li>신청서에 사실과 다른 정보를 적지 않습니다.</li>
</ol>
<h2>제7조 (청약철회·환불)</h2>
<p>환불 가능 기간과 공제 기준은 과정 안내 및 관련 법령을 따릅니다. 이미 제공된 수업·자료가 있으면 해당 범위는 환불액에서 제외할 수 있습니다. 구체적인 기준은 회사가 이 조항을 수정해 안내할 수 있습니다.</p>
<h2>제8조 (개인정보)</h2>
<p>회사는 상담·수강 신청·계약 이행에 필요한 이름, 연락처, 이메일, 서명 정보를 수집·이용합니다. 목적 달성 후 관련 법령이 정한 기간 동안 보관하고 파기합니다.</p>
<h2>제9조 (전자서명)</h2>
<p>신청 화면의 전자서명은 수강 신청 의사를 확인하는 서명으로, 수기 서명과 같은 효력에 동의하는 것으로 봅니다.</p>
HTML;
}

function onoff_marketing_contract_default_html()
{
    return <<<'HTML'
<h2>제1조 (목적)</h2>
<p>이 표준계약서는 온오프마케팅(이하 “회사”)이 제공하는 마케팅 의뢰 서비스와 관련하여 회사와 의뢰인(이하 “고객”)의 권리·의무를 정합니다.</p>
<h2>제2조 (계약의 성립)</h2>
<p>고객이 신청서의 내용을 확인하고 전자서명을 제출하면 의뢰가 접수됩니다. 세부 금액·일정·제공 범위는 상담 후 확정되며, 회사가 확정 내용을 안내한 때 이 계약이 성립합니다.</p>
<h2>제3조 (제공 범위)</h2>
<ol>
<li>SEO·GEO·홈페이지·콘텐츠·백링크·트래픽 등 마케팅 실행 범위 협의</li>
<li>전담 매니저 배정 및 킥오프·진행 리포트</li>
<li>교육 플랫폼을 통한 프로젝트·주문·수정요청 관리</li>
</ol>
<p>위 범위에 없는 작업은 이 계약에 포함되지 않으며, 별도 합의가 없으면 제공하지 않습니다.</p>
<h2>제4조 (기간)</h2>
<p>의뢰 기간은 계약서·견적에 기재한 기간을 따릅니다. 일정 변경이 있으면 회사가 신청서에 적은 연락처로 안내합니다.</p>
<h2>제5조 (비용)</h2>
<p>서비스 비용은 규모·범위에 따라 상담 후 확정합니다. 신청 화면의 금액 안내는 확정 견적이 아닙니다.</p>
<h2>제6조 (고객의 의무)</h2>
<ol>
<li>제공된 기획·디자인·소스·리포트를 무단으로 재판매·양도하지 않습니다.</li>
<li>신청서에 사실과 다른 정보를 적지 않습니다.</li>
<li>자료 제출·검수 요청에 성실히 응합니다.</li>
</ol>
<h2>제7조 (청약철회·환불)</h2>
<p>환불 가능 기간과 공제 기준은 회사 안내 및 관련 법령을 따릅니다. 이미 제공된 작업이 있으면 해당 범위는 환불액에서 제외할 수 있습니다.</p>
<h2>제8조 (개인정보)</h2>
<p>회사는 상담·의뢰·계약 이행에 필요한 이름, 연락처, 이메일, 서명 정보를 수집·이용합니다.</p>
<h2>제9조 (전자서명)</h2>
<p>신청 화면의 전자서명은 의뢰 의사를 확인하는 서명으로, 수기 서명과 같은 효력에 동의하는 것으로 봅니다.</p>
HTML;
}

function onoff_edu_marketing_contract_default_html()
{
    return <<<'HTML'
<h2>제1조 (목적)</h2>
<p>이 표준계약서는 온오프마케팅(이하 “회사”)이 제공하는 아카데미 수강과 마케팅 의뢰를 함께 이용하는 경우, 회사와 신청자(이하 “고객”)의 권리·의무를 정합니다.</p>
<h2>제2조 (계약의 성립)</h2>
<p>고객이 신청서의 내용을 확인하고 전자서명을 제출하면 신청이 접수됩니다. 수강료·마케팅 비용·일정·범위는 상담 후 확정되며, 회사가 확정 내용을 안내한 때 이 계약이 성립합니다.</p>
<h2>제3조 (제공 범위)</h2>
<ol>
<li>SEO·GEO 실무 커리큘럼 수강 및 클래스룸 안내</li>
<li>마케팅 실행(홈페이지·콘텐츠·백링크·트래픽 등) 범위 협의</li>
<li>교육 플랫폼을 통한 학습·프로젝트·주문 통합 관리</li>
</ol>
<h2>제4조 (기간)</h2>
<p>수강·의뢰 기간은 안내서·견적에 따릅니다.</p>
<h2>제5조 (비용)</h2>
<p>수강료와 마케팅 비용은 각각 상담 후 확정합니다.</p>
<h2>제6조 (고객의 의무)</h2>
<ol>
<li>수강권은 본인만 사용하며 제3자에게 양도·공유하지 않습니다.</li>
<li>강의 자료·클래스룸 콘텐츠 및 마케팅 산출물을 무단 복제·배포하지 않습니다.</li>
<li>신청서에 사실과 다른 정보를 적지 않습니다.</li>
</ol>
<h2>제7조 (청약철회·환불)</h2>
<p>환불 가능 기간과 공제 기준은 회사 안내 및 관련 법령을 따릅니다.</p>
<h2>제8조 (개인정보)</h2>
<p>회사는 상담·수강·의뢰·계약 이행에 필요한 이름, 연락처, 이메일, 서명 정보를 수집·이용합니다.</p>
<h2>제9조 (전자서명)</h2>
<p>신청 화면의 전자서명은 수기 서명과 같은 효력에 동의하는 것으로 봅니다.</p>
HTML;
}

function onoff_edu_contract_meta_for_id($id)
{
    if ($id === 'marketing_contract') {
        return array(
            'subject' => '온오프마케팅 의뢰 표준계약서',
            'html' => onoff_marketing_contract_default_html(),
        );
    }
    if ($id === 'edumkt_contract') {
        return array(
            'subject' => '온오프 아카데미·마케팅 통합 표준계약서',
            'html' => onoff_edu_marketing_contract_default_html(),
        );
    }
    return array(
        'subject' => '온오프 아카데미 강의 표준계약서',
        'html' => onoff_edu_contract_default_html(),
    );
}

function onoff_edu_contract_ensure($co_id = null)
{
    global $g5;

    if (empty($g5['content_table']) || !function_exists('sql_fetch')) {
        return false;
    }

    $id = $co_id ? onoff_edu_contract_id_for_type($co_id) : onoff_edu_contract_id();
    $table = $g5['content_table'];
    $row = sql_fetch(" select co_id from {$table} where co_id = '" . sql_real_escape_string($id) . "' ");
    if (!empty($row['co_id'])) {
        return true;
    }

    $meta = onoff_edu_contract_meta_for_id($id);
    $subject = $meta['subject'];
    $html = $meta['html'];
    $seo = function_exists('generate_seo_title') ? generate_seo_title($subject) : $id;
    $sql = " insert into {$table} set
        co_id = '" . sql_real_escape_string($id) . "',
        co_html = '1',
        co_tag_filter_use = '1',
        co_subject = '" . sql_real_escape_string($subject) . "',
        co_content = '" . sql_real_escape_string($html) . "',
        co_mobile_content = '" . sql_real_escape_string($html) . "',
        co_seo_title = '" . sql_real_escape_string($seo) . "',
        co_skin = 'basic',
        co_mobile_skin = 'basic',
        co_include_head = '',
        co_include_tail = '' ";
    sql_query($sql, false);
    if (function_exists('g5_delete_cache_by_prefix')) {
        g5_delete_cache_by_prefix('content-' . $id . '-');
    }
    return true;
}

function onoff_edu_contract_public($type = 'education')
{
    global $g5;

    $id = onoff_edu_contract_id_for_type($type);
    onoff_edu_contract_ensure($id);
    if (!function_exists('get_content_db')) {
        return null;
    }

    $co = get_content_db($id);
    if (empty($co['co_id'])) {
        return null;
    }

    $html = function_exists('conv_content')
        ? conv_content((string) $co['co_content'], (int) $co['co_html'], 1)
        : (string) $co['co_content'];

    return array(
        'id' => $id,
        'type' => $type,
        'subject' => get_text((string) $co['co_subject']),
        'html' => $html,
    );
}
