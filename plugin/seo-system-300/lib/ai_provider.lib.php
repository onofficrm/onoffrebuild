<?php
if (!defined('_GNUBOARD_')) {
    exit;
}

function seosys300_ai_system_prompt()
{
    return 'You are an SEO coach for SEO SYSTEM 300. Use only the JSON context. Never invent metrics. If a source is NOT_CONNECTED or missing, say it is not connected. Separate actual KPIs from guesses. Do not guarantee rankings. Recommend up to 5 concrete next actions with priority HIGH/MEDIUM/LOW and optional roadmapTaskKey from context. Respond with JSON only: {summary, health:{overall,technical,content,backlink,traffic}, insights:[], actions:[{title,reason,priority,tool,roadmapTaskKey}], warnings:[]}. Health scores may be null. Do not include personal data.';
}

function seosys300_ai_provider_analyze($context, $user_message = '')
{
    if (!seosys300_ai_configured()) {
        return array('ok' => false, 'code' => 'AI_NOT_CONFIGURED');
    }
    $provider = seosys300_ai_provider_name();
    $payload = array(
        'context' => $context,
        'message' => substr((string) $user_message, 0, 2000),
    );
    if ($provider === 'gemini') {
        return seosys300_ai_gemini($payload);
    }
    if ($provider === 'openai') {
        return seosys300_ai_openai($payload);
    }
    return array('ok' => false, 'code' => 'AI_NOT_CONFIGURED');
}

function seosys300_ai_gemini($payload)
{
    $model = seosys300_ai_model();
    $url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode($model) . ':generateContent';
    $body = json_encode(array(
        'systemInstruction' => array(
            'parts' => array(array('text' => seosys300_ai_system_prompt())),
        ),
        'generationConfig' => array(
            'temperature' => 0.2,
            'responseMimeType' => 'application/json',
        ),
        'contents' => array(
            array(
                'role' => 'user',
                'parts' => array(array(
                    'text' => json_encode($payload, JSON_UNESCAPED_UNICODE),
                )),
            ),
        ),
    ));
    $res = seosys300_http_json('POST', $url, array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'x-goog-api-key' => seosys300_ai_api_key(),
        ),
        'body' => $body,
        'timeout' => seosys300_http_timeout(),
    ));
    if ($res['status'] < 200 || $res['status'] >= 300) {
        seosys300_log('ai gemini failed status=' . $res['status']);
        return array('ok' => false, 'code' => 'AI_PROVIDER_FAILED', 'tokens' => array());
    }
    $text = '';
    if (isset($res['json']['candidates'][0]['content']['parts'][0]['text'])) {
        $text = (string) $res['json']['candidates'][0]['content']['parts'][0]['text'];
    }
    $usage = isset($res['json']['usageMetadata']) ? $res['json']['usageMetadata'] : array();
    $validated = seosys300_ai_validate_response($text);
    if (!$validated['ok']) {
        return array('ok' => false, 'code' => 'AI_INVALID_RESPONSE', 'tokens' => $usage);
    }
    return array(
        'ok' => true,
        'data' => $validated['data'],
        'provider' => 'gemini',
        'model' => $model,
        'tokens' => $usage,
    );
}

function seosys300_ai_openai($payload)
{
    $model = seosys300_ai_model();
    $body = json_encode(array(
        'model' => $model,
        'temperature' => 0.2,
        'response_format' => array('type' => 'json_object'),
        'messages' => array(
            array('role' => 'system', 'content' => seosys300_ai_system_prompt()),
            array('role' => 'user', 'content' => json_encode($payload, JSON_UNESCAPED_UNICODE)),
        ),
    ));
    $res = seosys300_http_json('POST', 'https://api.openai.com/v1/chat/completions', array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'Authorization' => 'Bearer ' . seosys300_ai_api_key(),
        ),
        'body' => $body,
        'timeout' => seosys300_http_timeout(),
    ));
    if ($res['status'] < 200 || $res['status'] >= 300) {
        seosys300_log('ai openai failed status=' . $res['status']);
        return array('ok' => false, 'code' => 'AI_PROVIDER_FAILED', 'tokens' => array());
    }
    $text = '';
    if (isset($res['json']['choices'][0]['message']['content'])) {
        $text = (string) $res['json']['choices'][0]['message']['content'];
    }
    $usage = isset($res['json']['usage']) ? $res['json']['usage'] : array();
    $validated = seosys300_ai_validate_response($text);
    if (!$validated['ok']) {
        return array('ok' => false, 'code' => 'AI_INVALID_RESPONSE', 'tokens' => $usage);
    }
    return array(
        'ok' => true,
        'data' => $validated['data'],
        'provider' => 'openai',
        'model' => $model,
        'tokens' => $usage,
    );
}
