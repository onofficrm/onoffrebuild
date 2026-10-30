# CRM ↔ ONOFF 홈페이지 수정요청 연동 프롬프트

아래 프롬프트를 `crm.icrm.co.kr` 코드베이스에 그대로 붙여 넣고 구현하세요.

---

## 역할
당신은 `crm.icrm.co.kr` 담당 엔지니어입니다.
ONOFF에 홈페이지 수정요청 조회·피드백 API가 올라갔습니다. CRM에서 접수 목록을 읽고, 검토·자료요청·무료진행·견적·처리결과 피드백을 남기세요.

## 절대 원칙
1. SoT는 ONOFF `g5_seosys300_revision_tickets` 입니다. CRM DB에 티켓 원본을 만들지 마세요.
2. 교육 신청 API, 홈페이지 주문 조회 API와 섞지 마세요.
3. 상태 변경은 아래 POST `action`만 사용하세요. 테이블에 직접 UPDATE 하지 마세요.
4. 토큰은 서버 env에만. 브라우저에 넣지 마세요. 헤더는 `X-ONOFF-Contract-Token`.

## API

- `GET https://onoff.icrm.co.kr/api/crm/revisions.php`
- `POST https://onoff.icrm.co.kr/api/crm/revisions.php`
- BFF: `GET/POST https://crm.icrm.co.kr/api/revisions`

Query: `status`(기본 `open`), `email`, `sinceId`, `ticketId`(상세. comments·files 포함).

목록 응답은 `data`로 감싸지 않습니다.

```json
{
  "ok": true,
  "status": "open",
  "total": 1,
  "items": [
    {
      "id": 1,
      "orderId": 4,
      "orderNo": "WEB-2026-000004",
      "siteName": "사이트명",
      "contactEmail": "customer@example.com",
      "memberEmail": "login@example.com",
      "mbId": "member",
      "title": "헤더 로고 교체",
      "description": "상단 로고를 새 파일로 바꿔 주세요.",
      "status": "requested",
      "statusLabel": "요청됨",
      "pageUrl": "",
      "annotation": {
        "tool": "block",
        "label": "히어로 문구",
        "device": "pc",
        "pageUrl": "https://han-gyeol.co.kr",
        "box": { "x": 4, "y": 12, "w": 92, "h": 30 }
      },
      "agentBrief": "",
      "device": "both",
      "category": "design",
      "priority": "normal",
      "createdAt": "2026-09-28 23:00:00"
    }
  ]
}
```

### 피드백 POST
```json
{ "action": "feedback", "ticketId": 1, "note": "로고를 반영했습니다.", "feedbackUrl": "https://example.com" }
```

| action | 의미 | 고객 화면 상태 |
|---|---|---|
| `review` | 검토 시작 | 검토중 |
| `need_info` | 자료 더 필요. `note` 필수 | 자료 필요 |
| `brief` | 에이전트 지시만 저장. `agentBrief` 필수 | 상태 유지 |
| `free` | 무료로 진행. 과금 없음. `agentBrief` 필수 | 작업중 |
| `quote` | 과금. `quotePoints` 필수, `quoteNote` 선택, `agentBrief` 필수. 고객이 온오프에서 결제하기 전에는 작업을 시작하지 마세요 | 결제 대기 |
| `start` | 작업 시작. 결제 대기(`quote_pending`)에서는 409 `payment_required` | 작업중 |
| `feedback` | 처리 결과. `note` 또는 `feedbackNote` 필수. `feedbackUrl` 선택. 결제 전에는 409 | 확인 요청 |
| `comment` | 댓글만. `note` 필수 | 상태 유지 |
| `cancel` | 취소 | 취소 |

고객이 확인 요청(`feedback`)을 수락하면 ONOFF에서 `completed`가 됩니다. CRM이 완료로 바로 닫지 마세요.

수정 요청은 기본 무료입니다. 과금할 때만 `quote`를 보내세요. 고객은 `https://onoff.icrm.co.kr`에서 포인트를 결제하고, 결제 후 상태가 `in_progress`가 됩니다. 그 뒤에 `feedback`으로 진행하세요. `quote_pending`에서 `start`나 `feedback`을 호출하면 409입니다. CRM이 결제를 완료 처리하지 마세요.

무토큰 401, 잘못된 action 400, 그 외 메서드 405.

## CRM 화면
- 신청목록 또는 홈페이지 주문 상세에 **수정요청** 탭
- 약 45초마다 `status=open` 폴링. `id`가 이전보다 크면 "홈페이지 수정요청" 알림
- 상세에서 위 action 버튼과 메모 입력
- 교육 승인, 주문 상태 변경과 버튼을 섞지 말 것

## 산출물
1. BFF와 수정요청 화면 경로
2. 무토큰 401, 목록 200, `feedback` 저장 후 고객 상태가 `feedback`인 증거
3. 토큰과 고객 개인정보 원문은 빼 주세요
